import Image from 'next/image';
import { SectionEyebrow } from '@/shared/components/ui/sectionEyebrow/SectionEyebrow';
import { Button } from '@/shared/components/ui/button/Button';
import { Container } from '@/shared/components/layout/container/Container';

export type AboutSectionContent = {
  eyebrow: string;
  heading: string;
  bio: string;
  cvLabel: string;
  cvHref: string;
  portraitAlt: string;
  checklist: string[];
};

export type AboutSectionProps = AboutSectionContent;

const checklistIcons = [
  <path key="clock" d="M12 7v5l3 2" />,
  <path key="layers" d="M12 2 2 7l10 5 10-5-10-5z" />,
  <path key="ownership" d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3" />,
  <path
    key="gear"
    d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-2.82 1.17V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 8 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 3.6 15a1.65 1.65 0 0 0-1.51-1H2a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 3.6 8.6a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 8 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.14.31.22.66.22 1.02"
  />,
];

export function AboutSection({ eyebrow, heading, bio, cvLabel, cvHref, portraitAlt, checklist }: AboutSectionProps) {
  return (
    <div id="about" className="bg-bg-light py-13 text-text-on-light md:py-17 lg:py-19">
      <Container>
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-[1fr_220px] md:items-start md:gap-x-10 lg:grid-cols-[1.2fr_180px_0.95fr] lg:gap-12">
          <div>
            <SectionEyebrow>{eyebrow}</SectionEyebrow>
            <h2 className="mb-5.5 mt-5.5 font-heading text-[27px] font-bold leading-[1.2] tracking-[-1px]">
              {heading}
            </h2>
            <p className="mb-7 text-base leading-[1.7] text-body-light">{bio}</p>
            <Button href={cvHref} download size="md">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <path d="M7 10l5 5 5-5" />
                <path d="M12 15V3" />
              </svg>
              {cvLabel}
            </Button>
          </div>

          <Image
            src="/cv-photo.webp"
            alt={portraitAlt}
            width={1055}
            height={1266}
            className="mx-auto block aspect-5/6 w-full max-w-[280px] object-cover object-top md:max-w-none"
          />

          <div className="col-span-full flex flex-col gap-5.5 md:col-span-2 lg:col-span-1">
            {checklist.map((item, index) => (
              <div key={item} className="flex items-center gap-4">
                <span className="flex-none text-accent" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    {index === 0 ? <circle cx="12" cy="12" r="9" /> : null}
                    {checklistIcons[index]}
                    {index === 1 ? <path d="M2 17l10 5 10-5M2 12l10 5 10-5" /> : null}
                    {index === 3 ? <circle cx="12" cy="12" r="3" /> : null}
                  </svg>
                </span>
                <span className="font-heading text-base font-medium text-text-on-light">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
