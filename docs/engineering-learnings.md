# Engineering learnings

Significant bugs and reusable findings, per `AGENTS.md` section 24. Each entry: symptom, reproduction, root cause, solution, verification, regression test, reusable lesson.

---

## Canonical URLs and hreflang alternates were never implemented, despite being a documented requirement

**Date:** 2026-08-13

**Symptom:** Asked whether the live site's route/locale handling followed best practice. Checking turned up that no page declared a canonical URL, and hreflang alternates were missing from the codebase entirely, despite `AGENTS.md` section 18 and architecture section 8 listing both as first-release requirements.

**Reproduction steps:**

```sh
# No <link rel="canonical"> or hreflang anywhere in the rendered HTML
curl -s https://lloydntim.com/en | grep -o "canonical"   # zero matches
curl -s https://lloydntim.com/en | grep -o "hreflang"    # zero matches

# Confirmed via history, not just the current tree: neither term had ever
# appeared in application source
git log --all -S"canonical" --oneline   # only docs/spec commits
git log --all -S"hreflang" --oneline    # only docs/spec commits
```

The live response's HTTP headers did carry a `Link:` header with hreflang values - misleading at first glance - but that could not be traced to anything in this application's source or its git history either. Left unexplained; possibly a stale cached deploy artifact, possibly something injected by the hosting layer independent of this app's code. Not something to rely on either way.

**Root cause:** The requirement was written into the architecture spec (section 18's SEO checklist, section 8's closing paragraph) but never actually implemented. Nothing enforced the gap between "documented as required" and "shipped" - it would only ever surface by someone reading production output against the spec, which is exactly how it was found here.

**Solution:**

- Added `src/i18n/alternates.ts`: a single `buildLocaleAlternates(locale, pathname)` helper building both `canonical` and the full `languages` map (including `x-default`) for a given locale-agnostic path.
- Wired it into `src/app/[locale]/layout.tsx`'s `generateMetadata` (default alternates, for the homepage) and `src/app/[locale]/case-studies/[slug]/page.tsx`'s `generateMetadata` (overrides with the case study's own canonical - Next.js metadata merging is shallow per key, so a page's `alternates` fully replaces rather than merges into a parent's).
- Added `alternates.languages` to every `src/app/sitemap.ts` entry, Next.js's sitemap-file convention for the same signal in `sitemap.xml`.
- `x-default` points at the *un-prefixed* path (handled by `src/proxy.ts`'s locale negotiation) rather than a hardcoded locale, so a visitor who doesn't match any other hreflang entry still gets negotiated to the locale that actually applies to them.

Full description: `specs/architecture/application-architecture.md`, "Canonical URLs and hreflang alternates" (section 8).

**Verification:** Built and served the app in production mode (`pnpm build && pnpm start`, not dev - metadata generation is worth checking against a real build) and confirmed with `curl`:

- `/en`, `/de`, and a case study page (`/en/case-studies/vocapp`) each render their own self-referencing `<link rel="canonical">` and a complete four-entry hreflang set (`en`, `de`, `fr`, `x-default`).
- `sitemap.xml` carries the matching `<xhtml:link rel="alternate" hreflang="...">` entries per URL.

**Regression test:** `src/i18n/alternates.spec.ts` - unit tests the helper directly (self-referencing canonical for both the homepage and a nested path, all three locales present in `languages` regardless of which locale was requested, `x-default` resolving to the un-prefixed path rather than a hardcoded locale). Per `AGENTS.md` section 19, metadata generation is explicitly one of the categories called out for unit test coverage.

**Reusable lesson:** A requirement being written into a spec is not evidence it was built - `AGENTS.md` section 18 had listed this since the first release, and it silently never happened. When a spec makes a claim about live behaviour (SEO metadata, redirect behaviour, headers), verifying it directly against production periodically - not just against the spec text - is the only way to catch this class of gap. The check that found this one was `curl` and `git log -S`, not a code review of the spec.

---

## PostHog analytics events silently failed to send through a Netlify `/ingest` reverse proxy

**Date:** 2026-08-15

**Symptom:** After deploying PostHog analytics behind a same-origin `/ingest` reverse proxy (the standard mitigation for ad-blockers stripping direct `posthog.com` requests), no events appeared in the PostHog dashboard. No error was visible anywhere in the app - the SDK initialized normally, its remote config and extension scripts (`config.js`, `web-vitals.js`) loaded fine through the proxy, and there was no console error or thrown exception. It looked, from the application's side, like nothing was wrong.

**Reproduction steps:**

This bug is invisible to headless test tooling, which was the first trap: PostHog's own bot filter checks `navigator.webdriver` (`true` by default under Playwright/Selenium/Puppeteer) and the browser's `userAgentData.brands` (which includes `"HeadlessChrome"` in headless Chromium even when the UA *string* is overridden), and silently drops every event for automation-flagged sessions - correct behavior on PostHog's part, but it means headless E2E tests can never be used to verify this. Reproducing required a real, non-headless browser session with `navigator.webdriver` masked:

```js
// Playwright, headed, with the automation signal hidden - the minimum
// needed for PostHog to treat the session as a real user:
const browser = await chromium.launch({ headless: false });
const page = await browser.newPage();
await page.addInitScript(() => {
  Object.defineProperty(navigator, 'webdriver', { get: () => false });
});
```

With that in place, the network panel showed the actual capture request failing:

```
400 POST https://<site>/ingest/e/
  content-encoding: (none)
  first bytes: 1f 8b 08 00 ...        <- gzip magic number
  response: failed to parse request: expected value at line 1 column 1
```

Isolated further with raw `curl` requests directly against the proxy (bypassing the SDK and the browser entirely, to separate "is this a PostHog-JS problem" from "is this a proxy/edge problem"):

```sh
# Plain JSON body: succeeds
curl -X POST https://<site>/ingest/e/ -H "Content-Type: text/plain" \
  --data-binary @payload.json
# -> 200 {"status":"Ok"}

# Same payload, gzip-compressed, no Content-Encoding header
# (PostHog-JS's actual default behavior):
gzip -c payload.json | curl -X POST https://<site>/ingest/e/ \
  -H "Content-Type: text/plain" --data-binary @-
# -> 400 failed to parse request: expected value at line 1 column 1

# Same gzip body, this time WITH an explicit Content-Encoding: gzip header:
gzip -c payload.json | curl -X POST https://<site>/ingest/e/ \
  -H "Content-Type: text/plain" -H "Content-Encoding: gzip" --data-binary @-
# -> 400 failed to decode request: invalid GZIP data
```

**Root cause:** `posthog-js` compresses capture request bodies with gzip by default (`disable_compression: false`) and signals this to PostHog's server through its own protocol detail rather than a standard `Content-Encoding` header (needed because `sendBeacon`, one of its transports, can't set custom headers at all). Netlify's edge network transparently decompresses gzip request bodies in transit - independent of whether a `Content-Encoding` header is present - without adjusting what it forwards to the proxy's destination accordingly. The result: the upstream (PostHog) either receives raw gzip bytes with nothing telling it to decompress (fails parsing as JSON directly), or receives already-decompressed bytes still labeled as gzip (fails degzipping already-plain data). Every gzip-compressed request through this proxy path fails, unconditionally - there is no configuration of the proxy itself that fixes it, because the interference happens before the proxy's own rewrite logic runs. This is a Netlify-edge-specific behavior; the identical code path worked fine against a local dev server, where no such edge sits between the browser and the rewrite.

**Solution:** Set `disable_compression: true` in `posthog.init()`. This makes the SDK send plain, uncompressed JSON bodies, which pass through the same edge cleanly (confirmed directly by the `curl` test above). Capture payloads are small (typically well under 1KB), so the bandwidth cost of skipping compression is negligible.

```ts
posthog.init(token, {
  api_host: '/ingest',
  // ...
  disable_compression: true,
});
```

**Verification:** Netlify deploy previews don't carry the production-only PostHog token (intentional, so preview/branch traffic never pollutes real analytics), so the fix itself couldn't be verified through the SDK on a preview. Verified the underlying infrastructure behavior directly instead: sent plain-JSON, gzip-no-header, and gzip-with-header requests straight at the preview's `/ingest/e/` proxy endpoint with `curl` (as shown above) - plain JSON succeeded (`200 {"status":"Ok"}`), both gzip variants failed with the same errors seen in production. Since `disable_compression: true` makes the SDK produce exactly the plain-JSON case, this is conclusive without needing the SDK active on the preview.

**Regression test:** None practical to automate - this is an infrastructure/edge behavior, not application logic, and reproducing it requires a real non-headless browser (headless is filtered as a bot) hitting a real Netlify deployment (the bug doesn't exist against a local dev server). Documented here instead as the check to re-run by hand if analytics silently stop reporting again: the three-request `curl` comparison above against `/ingest/e/`, or the headed-Playwright-with-masked-`navigator.webdriver` method for an SDK-level check.

**Reusable lesson:** When reverse-proxying a third-party SDK (analytics, error tracking, anything with its own client library) through your own domain to dodge ad-blockers, don't assume the proxy is transparent for POST bodies just because GET requests for its static assets work fine - compression, streaming, and any other body-level transport detail the SDK uses can be silently mangled by CDN/edge layers in ways that produce no error in your own application code. Two debugging habits made this findable: (1) testing with a real, non-headless browser with automation signals masked, since the target SDK's own bot-filtering can make headless testing produce a false "nothing sends" signal that looks identical to a real bug; and (2) isolating the proxy from the SDK entirely with raw `curl` once the SDK-level symptom was known, which turned "PostHog stopped working" into a much narrower, mechanically verifiable question about how one specific edge network handles one specific body encoding.
