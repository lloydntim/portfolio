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
  githubHref: string;
  linkedinHref: string;
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

export function AboutSection({
  eyebrow,
  heading,
  bio,
  cvLabel,
  cvHref,
  portraitAlt,
  checklist,
  githubHref,
  linkedinHref,
}: AboutSectionProps) {
  return (
    <div id="about" className="bg-bg-light py-13 text-text-on-light md:py-17 lg:py-19">
      <Container>
        <div className="flex flex-col items-center gap-8 md:grid md:grid-cols-[1fr_220px] md:grid-rows-[auto_auto_auto_auto] md:items-start md:gap-x-10 md:gap-y-0 lg:grid-cols-[1.2fr_180px_0.95fr] lg:grid-rows-[auto_auto_auto] lg:gap-x-12">
          <div className="order-1 self-stretch md:col-start-1 md:row-start-1">
            <SectionEyebrow>{eyebrow}</SectionEyebrow>
            <h2 className="mt-5.5 font-heading text-[27px] font-bold leading-[1.2] tracking-[-1px] md:mb-5.5">{heading}</h2>
          </div>

          <Image
            src="/cv-photo.webp"
            alt={portraitAlt}
            width={1055}
            height={1266}
            className="order-2 mx-auto block aspect-5/6 w-full max-w-[280px] object-cover object-top md:col-start-2 md:row-span-3 md:row-start-1 md:max-w-none"
          />

          <p className="order-3 self-stretch text-base leading-[1.7] text-body-light md:col-start-1 md:row-start-2 md:mb-7">{bio}</p>

          <div className="order-4 flex self-stretch flex-col gap-5.5 md:col-start-1 md:row-start-3 md:mt-8 lg:col-start-3 lg:row-span-3 lg:row-start-1 lg:mt-0">
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

          <div className="order-5 flex items-center gap-3 self-start md:col-span-2 md:col-start-1 md:row-start-4 md:mt-8 lg:col-span-1 lg:col-start-1 lg:row-start-3 lg:mt-0">
            <Button href={cvHref} download size="md" analyticsEvent="cv_download">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <path d="M7 10l5 5 5-5" />
                <path d="M12 15V3" />
              </svg>
              {cvLabel}
            </Button>
            <a
              href={githubHref}
              aria-label="GitHub"
              data-ph-event="github_click"
              className="flex h-13 w-13 flex-none items-center justify-center border border-text-on-light/15 text-text-on-light transition-colors duration-200 hover:border-accent hover:text-accent"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.38 7.86 10.9.58.1.79-.25.79-.56v-2.17c-3.2.7-3.87-1.36-3.87-1.36-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.95.1-.75.4-1.25.73-1.53-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.08-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.24 2.75.12 3.04.74.8 1.19 1.82 1.19 3.08 0 4.41-2.7 5.38-5.26 5.67.42.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12c0-6.27-5.23-11.5-11.5-11.5z" />
              </svg>
            </a>
            <a
              href={linkedinHref}
              aria-label="LinkedIn"
              data-ph-event="linkedin_click"
              className="flex h-13 w-13 flex-none items-center justify-center border border-text-on-light/15 text-text-on-light transition-colors duration-200 hover:border-accent hover:text-accent"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.15 1.45-2.15 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45z" />
              </svg>
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
}
