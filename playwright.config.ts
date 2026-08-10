import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000',
    // The app already has a real reduced-motion implementation (architecture
    // section 17); using it here bypasses the once-per-session intro
    // sequence deterministically instead of waiting out its timer.
    contextOptions: {
      reducedMotion: 'reduce',
    },
  },
  webServer: process.env.PLAYWRIGHT_SKIP_WEBSERVER ? undefined : {
    // Against `next dev`, concurrent requests during a Turbopack recompile
    // could intermittently truncate the RSC stream for a page mid-request
    // ("Unexpected end of JSON input"), producing a genuinely different
    // render and flaky visual diffs that had nothing to do with the actual
    // content. A webpack production build also avoids Turbopack's internal
    // process-port requirement in restricted test environments. This keeps
    // the browser suite deterministic while `pnpm build` still validates the
    // application's default production bundler separately.
    command: 'pnpm exec next build --webpack && pnpm start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
