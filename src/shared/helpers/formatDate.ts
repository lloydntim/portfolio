import type { Locale } from '@/i18n/routing';

export function formatDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
}
