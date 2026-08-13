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
