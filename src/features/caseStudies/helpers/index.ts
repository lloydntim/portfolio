import { notFound } from 'next/navigation';
import enVocapp from '@/content/en/case-studies/vocapp.json';
import enVorwerk from '@/content/en/case-studies/vorwerk.json';
import enGuilds from '@/content/en/case-studies/guilds.json';
import deVocapp from '@/content/de/case-studies/vocapp.json';
import deVorwerk from '@/content/de/case-studies/vorwerk.json';
import deGuilds from '@/content/de/case-studies/guilds.json';
import frVocapp from '@/content/fr/case-studies/vocapp.json';
import frVorwerk from '@/content/fr/case-studies/vorwerk.json';
import frGuilds from '@/content/fr/case-studies/guilds.json';
import type { Locale } from '@/i18n/routing';
import { caseStudySchema, type CaseStudy } from '../schema';

/**
 * Local-JSON implementation of the case-study data-access seam. Only
 * `getCaseStudy`/`getAllCaseStudies`'s call sites (CaseStudyArticle,
 * CaseStudyCard) are coupled to this file; a future headless WordPress
 * implementation replaces only this module (architecture section 11).
 *
 * German and French content exists here even though neither locale is in
 * `publishedLocales` yet (architecture section 8): translated content and
 * publishing approval are separate steps, and only the latter makes a
 * locale publicly reachable.
 */
const rawCaseStudiesByLocale: Record<Locale, Record<string, unknown>> = {
  en: { vocapp: enVocapp, vorwerk: enVorwerk, guilds: enGuilds },
  de: { vocapp: deVocapp, vorwerk: deVorwerk, guilds: deGuilds },
  fr: { vocapp: frVocapp, vorwerk: frVorwerk, guilds: frGuilds },
};

export async function getCaseStudy(slug: string, locale: Locale): Promise<CaseStudy> {
  const raw = rawCaseStudiesByLocale[locale][slug];
  if (!raw) {
    notFound();
  }
  return caseStudySchema.parse(raw);
}

export async function getAllCaseStudies(locale: Locale): Promise<CaseStudy[]> {
  return Object.values(rawCaseStudiesByLocale[locale])
    .map((raw) => caseStudySchema.parse(raw))
    .sort((a, b) => a.order - b.order);
}
