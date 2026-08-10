import type { Page } from '@playwright/test';

/**
 * Scroll each image into the viewport so browser-native lazy loading has a
 * chance to start, then wait for decoding before capturing a full-page image.
 */
export async function waitForImages(page: Page): Promise<void> {
  const images = page.locator('img');

  for (let index = 0; index < (await images.count()); index += 1) {
    const image = images.nth(index);
    await image.scrollIntoViewIfNeeded();
    await image.evaluate(async (element) => {
      if (!(element instanceof HTMLImageElement)) {
        throw new Error('Expected an HTML image element');
      }

      if (!element.complete || element.naturalWidth === 0) {
        await new Promise<void>((resolve, reject) => {
          element.addEventListener('load', () => resolve(), { once: true });
          element.addEventListener('error', () => reject(new Error(`Failed to load image: ${element.currentSrc}`)), {
            once: true,
          });
        });
      }

      await element.decode();
    });
  }

  await page.evaluate(() => window.scrollTo(0, 0));
}
