import type { MetadataRoute } from 'next';
import { publishedLocales } from '@/i18n/routing';
import { getAllCaseStudies } from '@/features/caseStudies';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lloydntim.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const localeValue of publishedLocales) {
    entries.push({ url: `${siteUrl}/${localeValue}` });

    const caseStudies = await getAllCaseStudies(localeValue);
    for (const caseStudy of caseStudies) {
      entries.push({ url: `${siteUrl}/${localeValue}/case-studies/${caseStudy.slug}` });
    }
  }

  return entries;
}
