import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { SectionEyebrow } from '@/shared/components/ui/sectionEyebrow/SectionEyebrow';
import { getAllCaseStudies, getCaseStudy } from '../../helpers';

export type CaseStudyArticleProps = {
  slug: string;
  locale: Locale;
};

const metaLabels = { role: 'ROLE', timeline: 'TIMELINE', stack: 'STACK' } as const;

export async function CaseStudyArticle({ slug, locale }: CaseStudyArticleProps) {
  const [caseStudy, all] = await Promise.all([getCaseStudy(slug, locale), getAllCaseStudies(locale)]);
  const next = all.find((entry) => entry.order === caseStudy.order + 1);

  return (
    <article className="bg-bg-dark text-text-on-dark">
      <div className="mx-auto max-w-205 px-8 py-12 md:px-10 md:py-15">
        <div className="mb-5.5">
          <SectionEyebrow tone="muted">CASE STUDY</SectionEyebrow>
        </div>
        <h1 className="mb-5 font-heading text-[clamp(2rem,7vw,3.375rem)] font-bold leading-[1.1] tracking-[-1px]">
          {caseStudy.title}
        </h1>
        <p className="mb-8 text-[17px] leading-[1.65] text-[#c9c7c4]">{caseStudy.summary}</p>
        <div className="flex flex-wrap gap-8 gap-y-8 md:gap-10">
          <div>
            <div className="mb-1.5 font-label text-[11px] font-semibold tracking-[2px] text-[#8a8580]">
              {metaLabels.role}
            </div>
            <div className="font-heading text-[15px] font-medium">{caseStudy.role}</div>
          </div>
          <div>
            <div className="mb-1.5 font-label text-[11px] font-semibold tracking-[2px] text-[#8a8580]">
              {metaLabels.timeline}
            </div>
            <div className="font-heading text-[15px] font-medium">{caseStudy.timeline}</div>
          </div>
          <div>
            <div className="mb-1.5 font-label text-[11px] font-semibold tracking-[2px] text-[#8a8580]">
              {metaLabels.stack}
            </div>
            <div className="font-heading text-[15px] font-medium">{caseStudy.stack.join(', ')}</div>
          </div>
        </div>
      </div>

      <div className="relative h-[220px] bg-bg-dark-panel md:h-[340px] lg:h-[460px]">
        <Image src={caseStudy.coverImage.src} alt={caseStudy.coverImage.alt} fill sizes="100vw" className="object-cover" />
      </div>

      <div className="bg-bg-light text-text-on-light">
        <div className="mx-auto max-w-180 px-8 py-14 md:px-6 md:py-20">
          <section className="mb-11">
            <div className="mb-5.5">
              <SectionEyebrow>THE CHALLENGE</SectionEyebrow>
            </div>
            <p className="text-base leading-[1.8] text-body-light">{caseStudy.challenge}</p>
          </section>

          <section className="mb-11">
            <div className="mb-5.5">
              <SectionEyebrow>THE APPROACH</SectionEyebrow>
            </div>
            <p className="text-base leading-[1.8] text-body-light">{caseStudy.approach}</p>
          </section>

          {caseStudy.quote ? (
            <blockquote className="my-10 border-y border-black/10 py-8">
              <p className="m-0 font-heading text-[clamp(1.2rem,3vw,1.625rem)] font-medium leading-[1.5] tracking-[-0.3px] text-text-on-light">
                &ldquo;{caseStudy.quote.text}&rdquo;
              </p>
              {caseStudy.quote.attribution ? (
                <footer className="mt-3 text-sm text-body-light-muted">{caseStudy.quote.attribution}</footer>
              ) : null}
            </blockquote>
          ) : null}

          <section className="mb-8">
            <div className="mb-5.5">
              <SectionEyebrow>THE OUTCOME</SectionEyebrow>
            </div>
            <p className="text-base leading-[1.8] text-body-light">{caseStudy.outcome}</p>
          </section>

          {caseStudy.stats && caseStudy.stats.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6">
              {caseStudy.stats.map((stat) => (
                <div key={stat.label}>
                  <div className="font-heading text-[36px] font-bold tracking-[-1px] text-accent">{stat.value}</div>
                  <div className="mt-1.5 text-sm text-body-light-muted">{stat.label}</div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="bg-bg-light px-6 pb-15">
        <div className="mx-auto flex max-w-180 flex-wrap items-center justify-between gap-4 border-t border-black/10 pt-10">
          <Link href="/#projects" className="font-heading text-sm font-semibold text-body-light hover:text-accent">
            ← Back to projects
          </Link>
          {next ? (
            <Link href={`/case-studies/${next.slug}`} className="text-sm text-body-light-muted hover:text-accent">
              Next: {next.title} →
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}
