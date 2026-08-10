import type { Metadata } from 'next';
import { locale } from 'next/root-params';
import { SiteNavigation, type SiteNavigationLink } from '@/shared/components/site/siteNavigation/SiteNavigation';
import { SiteFooter } from '@/shared/components/site/siteFooter/SiteFooter';
import { CaseStudyArticle, getAllCaseStudies, getCaseStudy } from '@/features/caseStudies';
import type { Locale, PublishedLocale } from '@/i18n/routing';
import enSite from '@/content/en/site.json';
import deSite from '@/content/de/site.json';
import frSite from '@/content/fr/site.json';

const siteContentByLocale = { en: enSite, de: deSite, fr: frSite } as const;

const caseStudyNavLinksByLocale: Record<Locale, SiteNavigationLink[]> = {
  en: [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/#about' },
    { label: 'Projects', href: '/#projects' },
    { label: 'Contact', href: '/#contact' },
  ],
  de: [
    { label: 'Home', href: '/' },
    { label: 'Über mich', href: '/#about' },
    { label: 'Projekte', href: '/#projects' },
    { label: 'Kontakt', href: '/#contact' },
  ],
  fr: [
    { label: 'Accueil', href: '/' },
    { label: 'À propos', href: '/#about' },
    { label: 'Projets', href: '/#projects' },
    { label: 'Contact', href: '/#contact' },
  ],
};

export async function generateStaticParams() {
  const caseStudies = await getAllCaseStudies('en');
  return caseStudies.map((caseStudy) => ({ slug: caseStudy.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = await getCaseStudy(slug, 'en');
  return { title: caseStudy.title, description: caseStudy.summary };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const activeLocale = (await locale()) as PublishedLocale;

  const content = siteContentByLocale[activeLocale];

  return (
    <>
      <SiteNavigation
        logoSrc="/logos/logo.svg"
        logoAlt={content.nav.logoAlt}
        links={caseStudyNavLinksByLocale[activeLocale]}
        startsOverHero
      />
      <main>
        <CaseStudyArticle slug={slug} locale={activeLocale} />
      </main>
      <SiteFooter {...content.footer} />
    </>
  );
}
