import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { getCaseStudy } from '../../helpers';

export type CaseStudyCardProps = {
  slug: string;
  locale: Locale;
  linkLabel: string;
};

export async function CaseStudyCard({ slug, locale, linkLabel }: CaseStudyCardProps) {
  const caseStudy = await getCaseStudy(slug, locale);

  return (
    <div className="grid grid-cols-1 gap-4 border border-black/[0.08] bg-white p-5 md:grid-cols-[200px_1fr] md:items-center md:gap-6 lg:grid-cols-[280px_1fr_auto] lg:gap-8 lg:p-6">
      <Link href={`/case-studies/${caseStudy.slug}`} className="relative block h-[130px] bg-[#efece6] md:h-[150px]">
        <Image
          src={caseStudy.coverImage.src}
          alt={caseStudy.coverImage.alt}
          fill
          sizes="(min-width: 1024px) 280px, (min-width: 768px) 200px, 100vw"
          className="object-cover"
        />
      </Link>
      <div>
        <h3 className="mb-2.5 font-heading text-[22px] font-semibold text-text-on-light">{caseStudy.title}</h3>
        <p className="text-[15px] leading-[1.65] text-body-light-muted">{caseStudy.summary}</p>
      </div>
      <Link
        href={`/case-studies/${caseStudy.slug}`}
        className="justify-self-start text-sm font-semibold text-accent underline underline-offset-[3px] lg:justify-self-center"
      >
        {linkLabel}
      </Link>
    </div>
  );
}
