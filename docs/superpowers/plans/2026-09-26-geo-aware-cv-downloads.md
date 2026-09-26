# Geo-aware CV Downloads Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Serve the UK CV to `en` visitors in the UK and the English version of the German CV to all other `en` visitors, and replace all three CV PDFs, per `specs/content/geo-aware-cv-downloads.md`.

**Architecture:** Country routing happens at Netlify's CDN through two `[[redirects]]` rules on `/cv/en` in `netlify.toml`, with no application code reading location. The `en` locale's `cvHref` points at `/cv/en`, and `src/proxy.ts` excludes `cv/` so next-intl's locale routing never intercepts that path. `de` and `fr` keep linking straight to their PDFs.

**Tech Stack:** Netlify redirect rules, Next.js 16 proxy (next-intl), static assets under `public/cv/`, JSON content, Vitest, Playwright.

**Branch:** `feat/geo-aware-cv-downloads` (spec already committed as `73fed76`).

**Commits:** each task ends with a focused local commit, made only if Lloyd approved per-task commits along with this plan. Otherwise leave the changes staged and ask before committing. Never push without Lloyd's approval.

---

## File map

| File | Change | Responsibility |
|---|---|---|
| `public/cv/lloyd-ntim-cv-uk.pdf` | Create | UK CV |
| `public/cv/lloyd-ntim-cv-en.pdf` | Replace | English version of the German CV |
| `public/cv/lloyd-ntim-cv-de.pdf` | Replace | German CV |
| `src/proxy.ts` | Modify | Exclude `cv/` from locale routing |
| `src/proxy.spec.ts` | Modify | Matcher tests for `cv/` |
| `netlify.toml` | Modify | Country redirect rules for `/cv/en` |
| `src/netlifyConfig.spec.ts` | Create | Guards redirect order, status and targets |
| `src/content/en/site.json` | Modify | `cvHref` to `/cv/en` |
| `tests/e2e/homepage.spec.ts` | Modify | `/en` link href and all three PDFs served |
| `specs/architecture/application-architecture.md` | Modify | Bring the proxy matcher snippet up to date |
| `specs/content/geo-aware-cv-downloads.md` | Modify | Status to Approved |

---

### Task 1: Put the CV PDFs in place

**Files:**
- Create: `public/cv/lloyd-ntim-cv-uk.pdf`
- Replace: `public/cv/lloyd-ntim-cv-en.pdf`
- Replace: `public/cv/lloyd-ntim-cv-de.pdf`

The source files are in the repo root. The mapping was confirmed from each file's contents (see the spec's Assets table). Copy, do not move: the spec leaves removing the root originals to Lloyd.

- [ ] **Step 1: Copy the three PDFs**

```bash
cp "Lloyd Ntim - Full Stack Engineer EN - 24 09 26.pdf" public/cv/lloyd-ntim-cv-uk.pdf
cp "Lloyd Ntim - Full Stack Engineer  DE EN  - 24 09 26 2.pdf" public/cv/lloyd-ntim-cv-en.pdf
cp "Lloyd Ntim - Fullstack Engineer  DE - 24 09 26 .pdf" public/cv/lloyd-ntim-cv-de.pdf
```

Note the double spaces and the trailing space before `.pdf` in the source names.

- [ ] **Step 2: Verify each copy is byte-identical to its source and is a PDF**

```bash
cmp "Lloyd Ntim - Full Stack Engineer EN - 24 09 26.pdf" public/cv/lloyd-ntim-cv-uk.pdf && \
cmp "Lloyd Ntim - Full Stack Engineer  DE EN  - 24 09 26 2.pdf" public/cv/lloyd-ntim-cv-en.pdf && \
cmp "Lloyd Ntim - Fullstack Engineer  DE - 24 09 26 .pdf" public/cv/lloyd-ntim-cv-de.pdf && \
file public/cv/*.pdf
```

Expected: no `cmp` output, and `file` reports `PDF document` for all three.

- [ ] **Step 3: Verify the phone numbers match the intended role**

```bash
for f in uk en de; do echo "$f: $(pdftotext -l 1 public/cv/lloyd-ntim-cv-$f.pdf - | grep -oE '\+4[49][0-9 ]+' | head -1)"; done
```

Expected: `uk: +44 79 0852 0696`, `en: +49 176 65708605`, `de: +49 176 65708605`. The `de` first page must also contain `PROFIL` (German), and `en` must contain `PROFILE`.

- [ ] **Step 4: Commit**

```bash
git add public/cv/lloyd-ntim-cv-uk.pdf public/cv/lloyd-ntim-cv-en.pdf public/cv/lloyd-ntim-cv-de.pdf
git commit -m "feat: add UK CV and update English and German CVs

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

Check `git status --short` afterwards: the three root PDFs must still be untracked, not staged.

---

### Task 2: Exclude `cv/` from the proxy matcher

**Files:**
- Modify: `src/proxy.ts:6-8`
- Test: `src/proxy.spec.ts`

On Netlify the Next.js proxy runs as an edge function, which may run before `netlify.toml` redirects. Without this exclusion next-intl would treat `/cv/en` as a page path and it would end in a 404.

- [ ] **Step 1: Write the failing tests**

In `src/proxy.spec.ts`, add these two `it` blocks inside the existing `describe('proxy matcher', ...)`, after the `/ingest` test:

```ts
  it('excludes /cv/ so Netlify country redirects for CV downloads skip locale routing', () => {
    expect(matcher.test('/cv/en')).toBe(false);
    expect(matcher.test('/cv/lloyd-ntim-cv-uk.pdf')).toBe(false);
  });

  it('still matches page paths that only start with "cv"', () => {
    expect(matcher.test('/cvs')).toBe(true);
  });
```

- [ ] **Step 2: Run the tests to verify the first one fails**

Run: `pnpm test src/proxy.spec.ts`
Expected: FAIL on `excludes /cv/ ...` (`/cv/en` currently matches, so `true` is received). The `/cvs` test passes already. It guards against the exclusion being written too broadly as `cv`.

- [ ] **Step 3: Update the matcher**

Replace the `config` export in `src/proxy.ts` with:

```ts
export const config = {
  matcher: '/((?!api|_next|_vercel|ingest|cv/|.*\\..*).*)',
};
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `pnpm test src/proxy.spec.ts`
Expected: PASS, 5 tests.

- [ ] **Step 5: Commit**

```bash
git add src/proxy.ts src/proxy.spec.ts
git commit -m "feat: exclude /cv/ from locale routing

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Add the country redirect rules

**Files:**
- Modify: `netlify.toml` (append at end of file)
- Create: `src/netlifyConfig.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `src/netlifyConfig.spec.ts`:

```ts
// @vitest-environment node
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

type Redirect = { from?: string; to?: string; status?: number; conditions?: string };

// Reads netlify.toml's [[redirects]] blocks as plain text. Deliberately not a
// TOML parser: it only needs to understand the single-line keys this repo
// writes, and avoids adding a dependency just for a test.
function readRedirects(): Redirect[] {
  const toml = readFileSync(join(process.cwd(), 'netlify.toml'), 'utf8');
  return toml
    .split('[[redirects]]')
    .slice(1)
    .map((block) => ({
      from: block.match(/^\s*from\s*=\s*"([^"]+)"/m)?.[1],
      to: block.match(/^\s*to\s*=\s*"([^"]+)"/m)?.[1],
      status: Number(block.match(/^\s*status\s*=\s*(\d+)/m)?.[1]),
      conditions: block.match(/^\s*conditions\s*=\s*(.+)$/m)?.[1],
    }));
}

describe('netlify.toml CV redirects', () => {
  const cvRules = readRedirects().filter((rule) => rule.from === '/cv/en');

  it('sends UK visitors to the UK CV before the fallback applies', () => {
    expect(cvRules).toHaveLength(2);
    expect(cvRules[0]).toMatchObject({ to: '/cv/lloyd-ntim-cv-uk.pdf' });
    expect(cvRules[0].conditions).toMatch(/Country\s*=\s*\["GB"\]/);
  });

  it('sends everyone else to the English version of the German CV', () => {
    expect(cvRules[1]).toMatchObject({ to: '/cv/lloyd-ntim-cv-en.pdf' });
    expect(cvRules[1].conditions).toBeUndefined();
  });

  it('uses temporary redirects so no country decision is cached', () => {
    expect(cvRules.map((rule) => rule.status)).toEqual([302, 302]);
  });

  it('points only at CV files that exist', () => {
    for (const rule of cvRules) {
      expect(existsSync(join(process.cwd(), 'public', rule.to ?? ''))).toBe(true);
    }
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test src/netlifyConfig.spec.ts`
Expected: FAIL. `netlify.toml` has no `[[redirects]]` yet, so `cvRules` has length 0.

- [ ] **Step 3: Append the redirect rules to `netlify.toml`**

Add at the end of the file, after the `[build.environment]` section:

```toml

# Geo-aware CV download (specs/content/geo-aware-cv-downloads.md). The `en`
# locale's CV button links to /cv/en. Netlify applies the first matching
# rule, so the GB rule must stay above the unconditional fallback. 302 keeps
# browsers and caches from remembering one visitor's country decision.
# /cv/ is excluded from src/proxy.ts's matcher so next-intl never sees it.
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

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm test src/netlifyConfig.spec.ts`
Expected: PASS, 4 tests.

- [ ] **Step 5: Commit**

```bash
git add netlify.toml src/netlifyConfig.spec.ts
git commit -m "feat: route English CV downloads by visitor country

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Point the `en` CV button at `/cv/en`

**Files:**
- Modify: `src/content/en/site.json:22`
- Test: `tests/e2e/homepage.spec.ts:36-51`

- [ ] **Step 1: Update the e2e test first**

In `tests/e2e/homepage.spec.ts`, replace the whole `test('contact options and the English CV are available', ...)` block with:

```ts
test('contact options and the English CV are available', async ({ page, request }) => {
  await page.goto('/en');

  await expect(page.getByRole('link', { name: 'info@lloydntim.com' }).first()).toHaveAttribute(
    'href',
    'mailto:info@lloydntim.com',
  );
  await expect(page.getByRole('link', { name: /^UK / })).toHaveAttribute('href', 'tel:+447908520696');
  await expect(page.getByRole('link', { name: /^DE / })).toHaveAttribute('href', 'tel:+4917665708605');

  // /cv/en is resolved by Netlify's country redirect (netlify.toml), which
  // `next start` does not apply, so only the link and both redirect targets
  // are checked here. The redirect itself is verified on a deploy preview.
  const cvLink = page.getByRole('link', { name: 'Download CV' });
  await expect(cvLink).toHaveAttribute('download', '');
  await expect(cvLink).toHaveAttribute('href', '/cv/en');
  for (const pdf of ['/cv/lloyd-ntim-cv-en.pdf', '/cv/lloyd-ntim-cv-uk.pdf']) {
    const cvResponse = await request.get(pdf);
    expect(cvResponse.ok()).toBe(true);
    expect(cvResponse.headers()['content-type']).toBe('application/pdf');
  }
});
```

The `/de` test stays as it is.

- [ ] **Step 2: Run the e2e test to verify it fails**

Run: `pnpm test:e2e --grep "English CV"`
Expected: FAIL on `toHaveAttribute('href', '/cv/en')`, because the link still points to `/cv/lloyd-ntim-cv-en.pdf`. This builds the app first, which takes a few minutes.

- [ ] **Step 3: Update the content**

In `src/content/en/site.json`, change:

```json
    "cvHref": "/cv/lloyd-ntim-cv-en.pdf",
```

to:

```json
    "cvHref": "/cv/en",
```

Do not change `src/content/de/site.json` or `src/content/fr/site.json`.

- [ ] **Step 4: Run the e2e suite to verify it passes**

Run: `pnpm test:e2e`
Expected: all tests PASS, including `the German CV is available on the de locale`.

- [ ] **Step 5: Commit**

```bash
git add src/content/en/site.json tests/e2e/homepage.spec.ts
git commit -m "feat: link the English CV button to the geo-aware route

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Update documentation

**Files:**
- Modify: `specs/architecture/application-architecture.md:425-427`
- Modify: `specs/content/geo-aware-cv-downloads.md` (Status section)

- [ ] **Step 1: Bring the architecture matcher snippet up to date**

The snippet predates the `/ingest` exclusion. In `specs/architecture/application-architecture.md`, replace:

```ts
export const config = {
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)',
};
```

with:

```ts
export const config = {
  matcher: '/((?!api|_next|_vercel|ingest|cv/|.*\\..*).*)',
};
```

Then add this paragraph straight after the closing code fence (before the paragraph beginning "This is next-intl's documented approach"):

```markdown
Beyond next-intl's defaults, the matcher excludes `ingest` (the PostHog proxy, `specs/architecture/analytics.md`) and `cv/` (CV downloads, which Netlify resolves by visitor country before the request reaches Next.js, `specs/content/geo-aware-cv-downloads.md`).
```

- [ ] **Step 2: Mark the spec approved**

In `specs/content/geo-aware-cv-downloads.md`, replace:

```markdown
Draft, awaiting Lloyd's approval (2026-09-26).
```

with:

```markdown
Approved by Lloyd (2026-09-26).
```

- [ ] **Step 3: Check for em dashes in the changed docs**

Run: `grep -n "—" specs/content/geo-aware-cv-downloads.md; git diff -U0 specs/architecture/application-architecture.md | grep "^+.*—"`
Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add specs/architecture/application-architecture.md specs/content/geo-aware-cv-downloads.md docs/superpowers/plans/2026-09-26-geo-aware-cv-downloads.md
git commit -m "docs: document CV route exclusion and approve geo-aware CV spec

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Full local validation and diff review

- [ ] **Step 1: Run all local checks**

```bash
pnpm typecheck && pnpm lint && pnpm test && pnpm build
```

Expected: every command exits 0.

- [ ] **Step 2: Run the browser suites**

```bash
pnpm test:e2e && pnpm test:a11y && pnpm test:visual
```

Expected: all PASS. No visual change is expected, since the button label and layout are unchanged.

- [ ] **Step 3: Review the full diff against `main`**

```bash
git diff --stat origin/main...HEAD
git status --short
git diff --quiet origin/main...HEAD -- reference/prototype && echo "prototype unchanged"
```

Expected: only the files in the file map changed, `prototype unchanged` is printed, and the three root PDFs are still untracked and uncommitted.

---

### Task 7: Verify on a Netlify deploy preview

**Stop before this task and ask Lloyd for approval to push `feat/geo-aware-cv-downloads`.** The push triggers an automatic Netlify deploy preview. Production promotion is a separate approval and is not part of this plan.

- [ ] **Step 1: After approval, push and open a PR**

```bash
git push -u origin feat/geo-aware-cv-downloads
```

Open the PR with `gh pr create`, ending the description with the attribution line. Wait for the Netlify deploy preview to finish and note its URL.

- [ ] **Step 2: Check the redirect per country**

```bash
P=<preview-url>
curl -sI -H "Cookie: nf_country=GB" "$P/cv/en" | grep -iE "^(HTTP|location)"
curl -sI -H "Cookie: nf_country=DE" "$P/cv/en" | grep -iE "^(HTTP|location)"
curl -sI -H "Cookie: nf_country=FR" "$P/cv/en" | grep -iE "^(HTTP|location)"
curl -sI "$P/cv/en" | grep -iE "^(HTTP|location)"
```

Expected: GB gets `302` with a `location` ending in `/cv/lloyd-ntim-cv-uk.pdf`. DE and FR get `302` with a `location` ending in `/cv/lloyd-ntim-cv-en.pdf`. With no cookie the response is a `302` to one of the two, matching the machine's real country. A `404`, or a redirect to `/en/cv/en`, means the proxy is still intercepting, so stop and investigate.

- [ ] **Step 3: Check the targets serve PDFs and `de`/`fr` are unchanged**

```bash
for f in uk en de; do curl -sI "$P/cv/lloyd-ntim-cv-$f.pdf" | grep -iE "^(HTTP|content-type)"; done
curl -s "$P/de" | grep -o 'href="/cv/[^"]*"' | head -1
curl -s "$P/fr" | grep -o 'href="/cv/[^"]*"' | head -1
```

Expected: `200` and `application/pdf` for all three. `/de` links to `/cv/lloyd-ntim-cv-de.pdf`, and `/fr` links to `/cv/lloyd-ntim-cv-en.pdf`.

- [ ] **Step 4: Browser check**

On the preview, open `/en`, click "Download CV", and confirm a PDF downloads with a sensible filename. Record the filename in the completion report.

- [ ] **Step 5: Completion report**

Report the actual results of Tasks 6 and 7, the files changed, and the remaining items:
- The root PDFs are left for Lloyd to remove.
- Merging the PR needs approval.
- Production promotion needs approval.
