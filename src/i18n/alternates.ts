import { publishedLocales, type PublishedLocale } from './routing';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lloydntim.com';

/**
 * Canonical + hreflang alternates (Next.js Metadata API `alternates` field)
 * for a locale and a locale-agnostic pathname ('' for the homepage,
 * '/case-studies/vocapp' for a case study - no leading locale segment).
 *
 * `x-default` intentionally points at the un-prefixed path (e.g.
 * `${siteUrl}${pathname}`), not a hardcoded locale: that URL is itself
 * handled by src/proxy.ts's locale negotiation (Accept-Language, then the
 * NEXT_LOCALE cookie), so a visitor who doesn't match any of the other
 * hreflang entries still lands on whichever locale actually applies to
 * them instead of always being sent to English.
 */
export function buildLocaleAlternates(locale: PublishedLocale, pathname = '') {
  const languages: Partial<Record<PublishedLocale | 'x-default', string>> = {};
  for (const publishedLocale of publishedLocales) {
    languages[publishedLocale] = `${siteUrl}/${publishedLocale}${pathname}`;
  }
  languages['x-default'] = `${siteUrl}${pathname}`;

  return {
    canonical: `${siteUrl}/${locale}${pathname}`,
    languages,
  };
}
