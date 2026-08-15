# Analytics

## Status

Approved by Lloyd (2026-08-15). Supersedes the deferral in `application-architecture.md` §19 for the specific scope described here. All other items in that deferred list (centralized error monitoring, frontend/backend logs, uptime monitoring, production performance monitoring) remain deferred and out of scope.

## Purpose

Give Lloyd visibility into how visitors use the portfolio site:

- How many times the site is visited, and where visitors come from (referrer, UTM parameters)
- Whether visitors click the CV download
- Whether visitors click through to case studies, and which ones they view
- Whether visitors use the contact form, and whether that submission succeeded

## Tool choice

**PostHog Cloud, EU region.** Rationale:

- The site has German and French locales; EU-hosted data residency is the simplest GDPR story.
- PostHog supports named custom events (not just pageview counts), which the click- and form-tracking requirements need.
- Configured cookieless (below), so no cookie-consent banner is required.

**New dependency:** `posthog-js` (production dependency, official SDK). This is the one new package this spec introduces; nothing else is added.

## Cookie policy

`cookieless_mode: 'always'` is set on init. In this mode PostHog never writes cookies or local/session storage; visitor counts use a privacy-preserving hash computed server-side by PostHog. Consequences:

- No cookie-consent banner is needed anywhere on the site.
- `identify()` is never called and person profiles are not created (`person_profiles: 'never'`) — no persistent cross-session distinct ID is stored, consistent with not showing a consent banner.
- Session recording is explicitly disabled (`disable_session_recording: true`). It wasn't requested, and it's the most invasive PostHog capability (DOM capture) — leaving it off keeps the footprint to what was actually asked for.
- Autocapture (PostHog's automatic capture of generic clicks/inputs) stays on as a low-cost bonus signal alongside the named events below.

**Project-level prerequisite, discovered during implementation testing:** `cookieless_mode: 'always'` on the client is not sufficient by itself. PostHog requires **"Cookieless server hash mode"** to also be enabled in the PostHog project's own settings (Web analytics section) — without it, the client SDK initializes normally (config and extension scripts load fine) but every `capture()` call is a silent no-op; nothing is ever sent, with no error surfaced anywhere. This is a one-time dashboard setting, not a code change, and is now part of Task 8 in the implementation plan.

## Integration

### Client init

`instrumentation-client.ts` at the project root (Next.js 15.3+ feature; this project is on Next 16.3.0). Initializes `posthog-js` once, globally, with no provider component and no client-component wrapper — consistent with the RSC-first, minimal-client-JS architecture.

```ts
import posthog from 'posthog-js';

if (process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN, {
    api_host: '/ingest',
    ui_host: 'https://eu.posthog.com',
    defaults: '2026-05-30',
    cookieless_mode: 'always',
    person_profiles: 'never',
    disable_session_recording: true,
    capture_pageview: 'history_change',
    disable_compression: true,
  });
}
```

The `if` guard means analytics only activates when the token env var is present. The token is set only in Netlify's **Production** deploy context, so branch deploys, deploy previews, and local dev never send events — no environment-detection logic needed in code.

**`disable_compression: true`, discovered post-deploy:** PostHog's default gzip-compressed request bodies arrive corrupted after passing through Netlify's edge and the `/ingest` rewrite (`400: failed to parse request`), even though the identical code path works locally where no Netlify edge is involved. Disabling compression avoids the failure; capture payloads are small enough that the bandwidth cost is negligible.

### Reverse proxy (`/ingest`)

Direct requests to `*.posthog.com` are commonly blocked by ad-blocker domain lists. To recover that traffic, PostHog's requests are proxied through the site's own domain:

`next.config.ts` gains a `rewrites()` block:

```ts
async rewrites() {
  return [
    { source: '/ingest/static/:path*', destination: 'https://eu-assets.i.posthog.com/static/:path*' },
    { source: '/ingest/array/:path*', destination: 'https://eu-assets.i.posthog.com/array/:path*' },
    { source: '/ingest/:path*', destination: 'https://eu.i.posthog.com/:path*' },
  ];
},
skipTrailingSlashRedirect: true,
```

This is native Next.js `rewrites()` — no Netlify-specific configuration is needed; the managed Next.js Runtime already used by this project (`netlify.toml`, ADR-004) runs a real Next.js server and honors it directly.

**Verified before writing this spec:** the project has no `middleware.ts` anywhere in the repo, so there is no locale-routing matcher for `/ingest` to collide with.

**Risk to verify during implementation:** `skipTrailingSlashRedirect: true` disables Next's automatic trailing-slash redirect site-wide, not just for `/ingest`. This project just shipped canonical-URL/hreflang work (`feat/canonical-hreflang-alternates`). The canonical `<link>` tags themselves are unaffected by this flag, but the testing section below includes an explicit regression check on those pages before this ships.

## Events

| Event | Trigger | Properties | Notes |
|---|---|---|---|
| `$pageview` | Automatic, on every route change (`capture_pageview: 'history_change'`) | PostHog defaults: URL, referrer, UTM params, approximate geoip | Covers "how many visits," "where from," and "which case studies are viewed" (each case study is its own route) — no custom event needed for case-study views. |
| `cv_download` | Click on the CV download link (`AboutSection.tsx`) | none | The link is server-rendered (no `'use client'` on `AboutSection`). Rather than converting the component, the link gets `data-ph-event="cv_download"`, and one delegated `click` listener registered once in `instrumentation-client.ts` calls `posthog.capture(el.dataset.phEvent)` for any element with that attribute. This keeps the RSC boundary where it already is. |
| `contact_form_submitted` | Contact form submit resolves (`ContactForm.tsx`, already `'use client'`) | `{ result: 'success' \| 'network-error' \| 'submission-failed' }` | Added directly in the existing `handleSubmit` after `submitContact` resolves. |

Explicit click tracking on case-study cards was considered and dropped: the card is a same-page navigation link, so the resulting `$pageview` on `/case-studies/[slug]` already answers "did they click through" and "which one" without a redundant event.

## Error handling

`posthog-js` degrades silently: if the `/ingest` proxy or PostHog's servers are unreachable, or a blocker still catches the request, events are dropped and nothing surfaces to the user. This matches how the contact form already treats delivery failure as non-fatal to the UI — analytics failure must never affect site functionality.

## Testing

- `ContactForm.spec.tsx`: mock `posthog-js`, assert `capture('contact_form_submitted', { result: 'success' })` and the two failure variants fire from the existing success/failure test cases.
- New unit test for the delegated click-listener helper: asserts `capture('cv_download')` fires when a `data-ph-event="cv_download"` element is clicked, and does not fire for unrelated clicks.
- Manual regression check: load a canonical/hreflang page (from `feat/canonical-hreflang-alternates`) after adding `skipTrailingSlashRedirect: true` and confirm the canonical `<link>` tag and hreflang alternates are unchanged.
- Manual verification post-deploy: confirm a real page load with an ad-blocker enabled still records a `$pageview` in the PostHog EU dashboard via `/ingest`.

## Out of scope

- Centralized error monitoring, log aggregation, uptime monitoring, production performance monitoring — still deferred per `application-architecture.md` §19.
- A cookie-consent banner — not needed, since tracking is cookieless.
- Explicit case-study click events — superseded by pageview data (see Events).
