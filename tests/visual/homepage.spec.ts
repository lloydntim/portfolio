import { expect, test } from '@playwright/test';
import { waitForFonts } from './waitForFonts';
import { waitForImages } from './waitForImages';

/**
 * Baselines committed after the screenshot-and-approval process (AGENTS.md
 * section 8, architecture section 20.5): hero full-viewport height, sticky
 * nav, footer centring, and the mobile menu's solid-panel/blurred-backdrop
 * treatment were all reviewed and approved before these were generated.
 */

test.describe('homepage, desktop', () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test('matches its visual baseline', async ({ page }) => {
    await page.goto('/en');
    await waitForFonts(page);
    await waitForImages(page);
    await expect(page).toHaveScreenshot('homepage-desktop.png', { animations: 'disabled', fullPage: true });
  });

  test('sticky nav matches its visual baseline', async ({ page }) => {
    await page.goto('/en');
    await waitForFonts(page);
    await page.mouse.wheel(0, 900);
    await page.waitForTimeout(300);
    await expect(page.locator('nav')).toHaveScreenshot('nav-sticky-desktop.png', { animations: 'disabled' });
  });
});

test.describe('homepage, mobile', () => {
  test.use({ viewport: { width: 390, height: 800 } });

  test('matches its visual baseline', async ({ page }) => {
    await page.goto('/en');
    await waitForFonts(page);
    await waitForImages(page);
    await expect(page).toHaveScreenshot('homepage-mobile.png', { animations: 'disabled', fullPage: true });
  });

  test('open menu matches its visual baseline', async ({ page }) => {
    await page.goto('/en');
    await waitForFonts(page);
    await page.getByRole('button', { name: 'Toggle menu' }).click();
    await expect(page).toHaveScreenshot('homepage-mobile-menu-open.png', { animations: 'disabled' });
  });
});
