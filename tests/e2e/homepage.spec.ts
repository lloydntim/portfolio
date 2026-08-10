import { expect, test } from '@playwright/test';

test('homepage loads and shows the hero title', async ({ page }) => {
  await page.goto('/en');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Engineer');
});

for (const title of ['VocApp', 'Vorwerk', 'Guilds']) {
  test(`the ${title} case study loads from the homepage`, async ({ page }) => {
    await page.goto('/en');
    const card = page.getByRole('heading', { level: 3, name: title }).locator('..').locator('..');
    await card.getByRole('link', { name: 'Case study →' }).click();
    await expect(page.getByRole('heading', { level: 1, name: title })).toBeVisible();
  });
}

test('the published German locale renders German content and document language', async ({ page }) => {
  await page.goto('/de');
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
  await expect(page.getByRole('heading', { level: 2, name: 'Full-Stack-Engineer mit Produktfokus' })).toBeVisible();
});

test('the mobile menu opens, navigates, and closes', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto('/en');

  const toggle = page.getByRole('button', { name: 'Toggle menu' });
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await page.getByRole('link', { name: 'Contact', exact: true }).click();

  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#contact')).toBeInViewport();
});

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

test('an unknown locale resolves to not-found', async ({ page }) => {
  const response = await page.goto('/xx');
  expect(response?.status()).toBe(404);
});
