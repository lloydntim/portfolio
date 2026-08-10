import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'de', 'fr'],
  defaultLocale: 'en',
});

/**
 * Supported locales (above) versus published locales (below) are distinct:
 * a locale can be supported without being publicly reachable. `de` and `fr`
 * were each added once their translation was reviewed and approved by
 * Lloyd (`fr` on 2026-08-10, architecture section 8, AGENTS.md section 4).
 */
export const publishedLocales = ['en', 'de', 'fr'] as const;

export type Locale = (typeof routing.locales)[number];
export type PublishedLocale = (typeof publishedLocales)[number];
