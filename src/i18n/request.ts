import * as rootParams from 'next/root-params';
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { publishedLocales, type PublishedLocale } from './routing';

/**
 * Locale resolution without `setRequestLocale` (deprecated by next-intl in
 * favour of `next/root-params`, architecture section 8). A supported-but-
 * unpublished locale (for example `de` before German is approved) is
 * rejected exactly like an invalid locale.
 */
export default getRequestConfig(async () => {
  const paramValue = await rootParams.locale();

  if (!publishedLocales.includes(paramValue as PublishedLocale)) {
    notFound();
  }

  return { locale: paramValue as PublishedLocale, messages: {} };
});
