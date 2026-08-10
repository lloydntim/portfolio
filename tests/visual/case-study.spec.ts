import { expect, test } from '@playwright/test';
import { waitForFonts } from './waitForFonts';
import { waitForImages } from './waitForImages';

test.describe('case study, desktop', () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test('matches its visual baseline', async ({ page }) => {
    await page.goto('/en/case-studies/vocapp');
    await waitForFonts(page);
    await waitForImages(page);
    await expect(page).toHaveScreenshot('case-study-desktop.png', { animations: 'disabled', fullPage: true });
  });
});

test.describe('case study, mobile', () => {
  test.use({ viewport: { width: 390, height: 800 } });

  test('matches its visual baseline', async ({ page }) => {
    await page.goto('/en/case-studies/vocapp');
    await waitForFonts(page);
    await waitForImages(page);
    await expect(page).toHaveScreenshot('case-study-mobile.png', { animations: 'disabled', fullPage: true });
  });
});
