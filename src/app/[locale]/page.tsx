import { locale } from 'next/root-params';
import { SiteNavigation } from '@/shared/components/site/siteNavigation/SiteNavigation';
import { SiteFooter } from '@/shared/components/site/siteFooter/SiteFooter';
import { Container } from '@/shared/components/layout/container/Container';
import { SectionEyebrow } from '@/shared/components/ui/sectionEyebrow/SectionEyebrow';
import { HeroImage, AboutSection, ExpertiseGrid, ServicesOfferedSection, ContactSection, LogoMarquee, type TrustedByLogo } from '@/features/home';
import { CaseStudyCard } from '@/features/caseStudies';
import type { PublishedLocale } from '@/i18n/routing';
import enSite from '@/content/en/site.json';
import deSite from '@/content/de/site.json';
import frSite from '@/content/fr/site.json';

// English, German, and French are published. Their content remains separated
// by locale so future translation changes can be reviewed independently.
const siteContentByLocale = { en: enSite, de: deSite, fr: frSite } as const;

function getSiteContent(value: PublishedLocale) {
  return siteContentByLocale[value];
}

const caseStudySlugs = ['vocapp', 'vorwerk', 'guilds'] as const;

export default async function HomePage() {
  const activeLocale = (await locale()) as PublishedLocale;
  const content = getSiteContent(activeLocale);

  return (
    <>
      <SiteNavigation logoSrc="/logos/logo.svg" logoAlt={content.nav.logoAlt} links={content.nav.links} startsOverHero />

      <main>
        <HeroImage {...content.hero} />

        <AboutSection {...content.about} />

        <ExpertiseGrid eyebrow={content.expertise.eyebrow} cards={content.expertise.cards} />

        <ServicesOfferedSection eyebrow={content.whatIDeliver.eyebrow} intro={content.whatIDeliver.intro} rows={content.whatIDeliver.rows} />

        <section id="projects" className="bg-bg-light py-13 text-text-on-light md:py-17">
          <Container>
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="mb-4">
                  <SectionEyebrow>{content.projects.eyebrow}</SectionEyebrow>
                </div>
                <h2 className="m-0 font-heading text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-[1.1] tracking-[-1px]">
                  {content.projects.heading}
                </h2>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              {caseStudySlugs.map((slug) => (
                <CaseStudyCard key={slug} slug={slug} locale={activeLocale} linkLabel={content.projects.linkLabel} />
              ))}
            </div>
          </Container>
        </section>

        <ContactSection {...content.contact} />

        <LogoMarquee heading={content.trustedBy.heading} logos={content.trustedBy.logos as TrustedByLogo[]} />
      </main>

      <SiteFooter {...content.footer} />
    </>
  );
}
