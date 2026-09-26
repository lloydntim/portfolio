# Geo-aware CV downloads

## Status

Approved by Lloyd (2026-09-26).

Builds on `specs/content/locale-cv-downloads.md`, which made the CV download per-locale. This spec adds one country-based rule to the `en` locale and replaces all three CV PDFs with the versions Lloyd provided on 2026-09-24.

## Purpose

Lloyd maintains two English CVs: a UK version and an English translation of his German CV. A visitor browsing the site in English should get the UK version when they are in the UK, and the English translation of the German CV everywhere else. The German and French locales are not location-dependent.

## Behavior

| Locale | Visitor country | CV served |
|---|---|---|
| `en` | GB | `public/cv/lloyd-ntim-cv-uk.pdf` (UK CV) |
| `en` | Any other country, or unknown | `public/cv/lloyd-ntim-cv-en.pdf` (English version of the German CV) |
| `de` | Any | `public/cv/lloyd-ntim-cv-de.pdf` (German CV) |
| `fr` | Any | `public/cv/lloyd-ntim-cv-en.pdf` (English version of the German CV), until a French CV exists |

This covers Lloyd's stated cases:

- Germany, English picked: English version of the German CV.
- UK, English picked: UK CV.
- Germany, German picked: German CV.
- France (any language other than German): English version of the German CV.

Anything not listed falls back to the English version of the German CV. A visitor who picked German always gets the German CV, wherever they are. A UK visitor who picks German or French does not get the UK CV.

Labels (`cvLabel`) are unchanged in all three locales.

## Implementation

### Assets

Lloyd supplied three PDFs in the repository root. Mapping, confirmed from each file's contents (phone number, language), not only from the filenames:

| Source file (repo root) | Destination | Content |
|---|---|---|
| `Lloyd Ntim - Full Stack Engineer EN - 24 09 26.pdf` | `public/cv/lloyd-ntim-cv-uk.pdf` (new) | UK CV: +44 number, "Settled Status" |
| `Lloyd Ntim - Full Stack Engineer  DE EN  - 24 09 26 2.pdf` | `public/cv/lloyd-ntim-cv-en.pdf` (replaced) | English version of the German CV: +49 number |
| `Lloyd Ntim - Fullstack Engineer  DE - 24 09 26 .pdf` | `public/cv/lloyd-ntim-cv-de.pdf` (replaced) | German CV |

The existing `en` and `de` paths are kept so that any external link to them keeps working. The source files in the repo root are not committed. Lloyd removes them once the copies are in `public/cv/`.

### Country routing: `netlify.toml`

Two `[[redirects]]` rules for `/cv/en`, GB rule first because Netlify applies the first matching rule:

```toml
[[redirects]]
  from = "/cv/en"
  to = "/cv/lloyd-ntim-cv-uk.pdf"
  status = 302
  conditions = { Country = ["GB"] }

[[redirects]]
  from = "/cv/en"
  to = "/cv/lloyd-ntim-cv-en.pdf"
  status = 302
```

Status 302 (temporary) so neither browsers nor intermediate caches remember one visitor's country decision for another request. No `force` is needed: `/cv/en` is not an existing file.

Country detection happens at Netlify's CDN from the request IP. No application code reads location, and nothing is stored.

### Proxy matcher: `src/proxy.ts`

`/cv/en` has no file extension, so the current next-intl proxy matcher would match it and treat it as a page path to localise. On Netlify, Next.js middleware runs as an edge function, and edge functions may run before `netlify.toml` redirects. If they do, next-intl would handle `/cv/en` and it would end in a 404 before the redirect fires. Exclude `cv/` from the matcher, following the existing `/ingest` exclusion:

```ts
matcher: '/((?!api|_next|_vercel|ingest|cv/|.*\\..*).*)',
```

The exclusion is `cv/`, not `cv`, so a hypothetical page path such as `/cvs` would still be localised.

### Content: `src/content/en/site.json`

Change `cvHref` from `/cv/lloyd-ntim-cv-en.pdf` to `/cv/en`. No other content changes. `de` and `fr` keep linking directly to their PDFs.

## Testing

### Local, automated

- `src/proxy.spec.ts`: the matcher excludes `/cv/en` and `/cv/lloyd-ntim-cv-uk.pdf`, and still matches `/en`.
- New Vitest test reading `netlify.toml` as plain text (no TOML parser dependency): the `/cv/en` GB rule appears before the unconditional `/cv/en` rule, both use status 302, and every `to` target under `/cv/` exists in `public/`.
- `tests/e2e/homepage.spec.ts`:
  - The `/en` CV link has `href="/cv/en"` and the `download` attribute.
  - `/cv/lloyd-ntim-cv-en.pdf`, `/cv/lloyd-ntim-cv-de.pdf` and `/cv/lloyd-ntim-cv-uk.pdf` each serve `application/pdf`.
  - The existing `/de` assertions are unchanged.

`next dev` and `next start` do not apply `netlify.toml` redirects, so the redirect itself cannot be tested locally.

### Netlify deploy preview, manual

Netlify's documented `nf_country` cookie overrides the detected country. Against the preview URL:

```sh
curl -sI -H "Cookie: nf_country=GB" <preview>/cv/en   # 302 to /cv/lloyd-ntim-cv-uk.pdf
curl -sI -H "Cookie: nf_country=DE" <preview>/cv/en   # 302 to /cv/lloyd-ntim-cv-en.pdf
curl -sI -H "Cookie: nf_country=FR" <preview>/cv/en   # 302 to /cv/lloyd-ntim-cv-en.pdf
curl -sI <preview>/cv/en                              # 302 to one of the two, per the runner's real country
```

Also confirm in a browser that clicking the `en` CV button downloads a PDF through the redirect with a sensible filename. These results are recorded in the completion report. They are the acceptance criteria for this spec.

## Analytics and privacy

- The `cv_download` event is unchanged, with no new properties. PostHog already attaches approximate GeoIP to each event, so downloads by country are visible in PostHog without new code.
- The site stores, logs or cookies nothing new. The cookieless PostHog setup (`specs/architecture/analytics.md`) is unaffected.
- The site has no privacy page, so there is no copy to update.

## Known limitations

- "UK" means country code GB only. Jersey (JE), Guernsey (GG) and the Isle of Man (IM) get the fallback CV. Adding them is a one-line change to the `Country` list.
- Country comes from the request IP, so a visitor on a VPN or corporate proxy gets the CV for that network's country.
- The redirect only runs on Netlify and can only be verified on a deployed preview.

## Out of scope

- A French CV. When one exists, add `public/cv/lloyd-ntim-cv-fr.pdf` and point `cvHref` in `src/content/fr/site.json` to it.
- Country rules beyond GB.
- New analytics events or properties.
- Any visible UI or label change.
