import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('homepage has no automatically detectable accessibility violations', async ({ page }) => {
  await page.goto('/en');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
