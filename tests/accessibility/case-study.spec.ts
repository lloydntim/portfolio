import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('case study page has no automatically detectable accessibility violations', async ({ page }) => {
  await page.goto('/en/case-studies/vocapp');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
