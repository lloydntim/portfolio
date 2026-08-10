import type { Page } from '@playwright/test';

/**
 * Without this, a screenshot taken before the webfonts finish swapping in
 * uses fallback-font metrics, which can reflow text by a pixel or two once
 * the real font loads. This is a real source of flaky visual-baseline diffs, not a
 * content change.
 */
export async function waitForFonts(page: Page): Promise<void> {
  await page.evaluate(() => document.fonts.ready);
}
