import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.spec.{ts,tsx}'],
    css: true,
    server: {
      // next-intl is ESM-only and imports from `next/navigation` (no
      // extension) to avoid a Next.js deoptimization; Vitest needs to
      // process it directly rather than externalize it as a prebuilt
      // dependency (https://github.com/vercel/next.js/issues/77200,
      // next-intl's own testing docs).
      deps: {
        inline: ['next-intl'],
      },
    },
  },
});
