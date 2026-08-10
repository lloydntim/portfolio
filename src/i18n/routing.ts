import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'de', 'fr'],
  defaultLocale: 'en',
});

/**
 * Supported locales (above) versus published locales (below) are distinct:
 * a locale can be supported without being publicly reachable. `de` was
 * added 2026-08-10 once German content was translated and approved by
 * Lloyd; `fr` remains unpublished until its translation is separately
 * approved (architecture section 8, AGENTS.md section 4).
 */
export const publishedLocales = ['en', 'de'] as const;

export type Locale = (typeof routing.locales)[number];
export type PublishedLocale = (typeof publishedLocales)[number];
