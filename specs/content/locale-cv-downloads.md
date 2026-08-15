# Locale-aware CV downloads

## Status

Approved by Lloyd (2026-08-15).

## Purpose

The CV download on the About section currently serves the same English PDF to every locale (`en`, `de`, `fr`), with a label explicitly flagging this ("Download CV (English)" / "... (Englisch)" / "... (anglais)"). Lloyd provided a German-language CV; visitors on the `de` locale should now download that instead, and the `en`/`fr` locales should get an updated English/French-facing CV (a newer PDF than the one currently in the repo).

## Behavior

| Locale | CV served | Label |
|---|---|---|
| `en` | `public/cv/lloyd-ntim-cv-en.pdf` (replaced with the updated "Full-Stack Product Engineer" PDF) | "Download CV" |
| `fr` | same file as `en` | "Télécharger le CV" |
| `de` | `public/cv/lloyd-ntim-cv-de.pdf` (new file, the "Fullstack Product Engineer" PDF) | "Lebenslauf herunterladen" |

The "(English)" / "(Englisch)" / "(anglais)" qualifier is dropped from all three labels — it described the old cross-locale behavior (everyone gets the English file) and is no longer accurate now that each locale gets a matching-language CV.

## Implementation

No component or logic changes: `cvHref` and `cvLabel` are already per-locale values in `src/content/{en,de,fr}/site.json`, read directly by `AboutSection` (`src/features/home/components/about/aboutSection/AboutSection.tsx`). This is a content and asset change only:

- Replace `public/cv/lloyd-ntim-cv-en.pdf` with the new PDF Lloyd provided ("Lloyd Ntim - Full-Stack Product Engineer - 13 08 26.pdf").
- Add `public/cv/lloyd-ntim-cv-de.pdf` from the PDF Lloyd provided ("Lloyd Ntim - Fullstack Product Engineer - 13 08 26.pdf").
- Update `cvHref` and `cvLabel` in `src/content/de/site.json`.
- Update `cvLabel` (only) in `src/content/en/site.json` and `src/content/fr/site.json`.

## Testing

`tests/e2e/homepage.spec.ts` has an existing test asserting the `/en` CV link's accessible name is `"Download CV (English)"` and that `/cv/lloyd-ntim-cv-en.pdf` serves a PDF. Update the label match to `"Download CV"`, and add an equivalent assertion for `/de`: the CV link's accessible name is `"Lebenslauf herunterladen"` and it points to `/cv/lloyd-ntim-cv-de.pdf`, which serves a PDF.
