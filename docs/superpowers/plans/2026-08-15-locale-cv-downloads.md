# Locale-aware CV Downloads Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Serve the German CV to `de` locale visitors and the updated English/French-facing CV to `en`/`fr` visitors, per `specs/content/locale-cv-downloads.md`.

**Architecture:** Pure content/asset change — `cvHref`/`cvLabel` are already per-locale values in `src/content/{en,de,fr}/site.json`, read directly by the existing `AboutSection` component. No component or logic code changes.

**Tech Stack:** Static assets under `public/cv/`, JSON content files, Playwright e2e test.

---

### Task 1: Replace/add the CV PDFs

**Files:**
- Modify (replace content): `public/cv/lloyd-ntim-cv-en.pdf`
- Create: `public/cv/lloyd-ntim-cv-de.pdf`
- Delete: `Lloyd Ntim - Full-Stack Product Engineer - 13 08 26.pdf` (repo root)
- Delete: `Lloyd Ntim - Fullstack Product Engineer - 13 08 26.pdf` (repo root)

Lloyd pasted both source files at the repo root. Move them into place under their existing naming convention (`lloyd-ntim-cv-{locale}.pdf`), replacing the outdated English PDF and adding the new German one.

- [ ] **Step 1: Move the EN/FR PDF into place, replacing the old one**

```bash
mv "Lloyd Ntim - Full-Stack Product Engineer - 13 08 26.pdf" public/cv/lloyd-ntim-cv-en.pdf
```

- [ ] **Step 2: Move the German PDF into place**

```bash
mv "Lloyd Ntim - Fullstack Product Engineer - 13 08 26.pdf" public/cv/lloyd-ntim-cv-de.pdf
```

- [ ] **Step 3: Verify both files are in place and nothing was left at the repo root**

Run: `ls public/cv/ && git status --porcelain`
Expected: `public/cv/` contains `lloyd-ntim-cv-en.pdf` and `lloyd-ntim-cv-de.pdf`; `git status` shows `lloyd-ntim-cv-en.pdf` as modified and `lloyd-ntim-cv-de.pdf` as untracked, with no `.pdf` files left at the repo root.

- [ ] **Step 4: Commit**

```bash
git add public/cv/lloyd-ntim-cv-en.pdf public/cv/lloyd-ntim-cv-de.pdf
git commit -m "feat: replace EN/FR CV and add DE CV"
```

---

### Task 2: Wire the German CV into `de/site.json`

**Files:**
- Modify: `src/content/de/site.json:21-22`

- [ ] **Step 1: Update `cvLabel` and `cvHref`**

In `src/content/de/site.json`, change:

```json
    "cvLabel": "Lebenslauf herunterladen (Englisch)",
    "cvHref": "/cv/lloyd-ntim-cv-en.pdf",
```

to:

```json
    "cvLabel": "Lebenslauf herunterladen",
    "cvHref": "/cv/lloyd-ntim-cv-de.pdf",
```

- [ ] **Step 2: Commit**

```bash
git add src/content/de/site.json
git commit -m "feat: serve the German CV on the de locale"
```

---

### Task 3: Drop the "(English)" qualifier from `en` and `fr` labels

**Files:**
- Modify: `src/content/en/site.json:21`
- Modify: `src/content/fr/site.json:21`

`cvHref` is unchanged in both files — they still point at `/cv/lloyd-ntim-cv-en.pdf` (now the updated PDF from Task 1).

- [ ] **Step 1: Update the English label**

In `src/content/en/site.json`, change:

```json
    "cvLabel": "Download CV (English)",
```

to:

```json
    "cvLabel": "Download CV",
```

- [ ] **Step 2: Update the French label**

In `src/content/fr/site.json`, change:

```json
    "cvLabel": "Télécharger le CV (anglais)",
```

to:

```json
    "cvLabel": "Télécharger le CV",
```

- [ ] **Step 3: Commit**

```bash
git add src/content/en/site.json src/content/fr/site.json
git commit -m "feat: drop the English-only CV qualifier from en/fr labels"
```

---

### Task 4: Update the e2e CV test

**Files:**
- Modify: `tests/e2e/homepage.spec.ts:36-51`

- [ ] **Step 1: Update the existing EN test and add a DE test**

Replace the test at lines 36-51:

```ts
test('contact options and the English CV are available', async ({ page, request }) => {
  await page.goto('/en');

  await expect(page.getByRole('link', { name: 'info@lloydntim.com' }).first()).toHaveAttribute(
    'href',
    'mailto:info@lloydntim.com',
  );
  await expect(page.getByRole('link', { name: /^UK / })).toHaveAttribute('href', 'tel:+447908520696');
  await expect(page.getByRole('link', { name: /^DE / })).toHaveAttribute('href', 'tel:+4917665708605');

  const cvLink = page.getByRole('link', { name: 'Download CV (English)' });
  await expect(cvLink).toHaveAttribute('download', '');
  const cvResponse = await request.get('/cv/lloyd-ntim-cv-en.pdf');
  expect(cvResponse.ok()).toBe(true);
  expect(cvResponse.headers()['content-type']).toBe('application/pdf');
});
```

with:

```ts
test('contact options and the English CV are available', async ({ page, request }) => {
  await page.goto('/en');

  await expect(page.getByRole('link', { name: 'info@lloydntim.com' }).first()).toHaveAttribute(
    'href',
    'mailto:info@lloydntim.com',
  );
  await expect(page.getByRole('link', { name: /^UK / })).toHaveAttribute('href', 'tel:+447908520696');
  await expect(page.getByRole('link', { name: /^DE / })).toHaveAttribute('href', 'tel:+4917665708605');

  const cvLink = page.getByRole('link', { name: 'Download CV' });
  await expect(cvLink).toHaveAttribute('download', '');
  const cvResponse = await request.get('/cv/lloyd-ntim-cv-en.pdf');
  expect(cvResponse.ok()).toBe(true);
  expect(cvResponse.headers()['content-type']).toBe('application/pdf');
});

test('the German CV is available on the de locale', async ({ page, request }) => {
  await page.goto('/de');

  const cvLink = page.getByRole('link', { name: 'Lebenslauf herunterladen' });
  await expect(cvLink).toHaveAttribute('download', '');
  await expect(cvLink).toHaveAttribute('href', '/cv/lloyd-ntim-cv-de.pdf');
  const cvResponse = await request.get('/cv/lloyd-ntim-cv-de.pdf');
  expect(cvResponse.ok()).toBe(true);
  expect(cvResponse.headers()['content-type']).toBe('application/pdf');
});
```

- [ ] **Step 2: Run the e2e suite**

Run: `pnpm test:e2e`
Expected: all tests pass, including the updated EN test and the new DE test. This command builds the app with webpack and starts it itself (see `playwright.config.ts`), so no separate dev server is needed.

- [ ] **Step 3: Commit**

```bash
git add tests/e2e/homepage.spec.ts
git commit -m "test: update e2e coverage for locale-aware CV downloads"
```

---

### Task 5: Full verification pass

**Files:** none (verification only)

- [ ] **Step 1: Run the unit/component test suite**

Run: `pnpm test`
Expected: all tests pass (unaffected by this change, but confirms nothing broke)

- [ ] **Step 2: Run lint and typecheck**

Run: `pnpm lint && pnpm typecheck`
Expected: no errors

- [ ] **Step 3: Run the production build**

Run: `pnpm build`
Expected: succeeds

- [ ] **Step 4: Manual spot-check in a browser**

Run: `pnpm dev`, then visit `http://localhost:3000/en`, `/fr`, and `/de`, and confirm each locale's CV button downloads the correct PDF (open each downloaded file and check it matches the expected language/title — "Full-Stack Product Engineer" for en/fr, "Fullstack Product Engineer" for de).

- [ ] **Step 5: Report to Lloyd**

Summarize: what changed, files affected, test/lint/typecheck/build/e2e results, and the manual spot-check outcome.
