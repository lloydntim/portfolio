import type { ReactNode } from 'react';
import { SectionEyebrow } from '@/shared/components/ui/sectionEyebrow/SectionEyebrow';
import { Container } from '@/shared/components/layout/container/Container';

export type ExpertiseCard = {
  title: string;
  description: string;
};

export type ExpertiseGridProps = {
  eyebrow: string;
  cards: ExpertiseCard[];
};

const icons: Record<number, ReactNode> = {
  0: (
    <>
      <path d="M12 2 2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
    </>
  ),
  1: (
    <>
      <path d="M12 3v3" />
      <path d="m5 8 2 2" />
      <path d="m19 8-2 2" />
      <path d="M12 6a6 6 0 0 0-6 6c0 2.2 1.2 4.1 3 5.2V20h6v-2.8c1.8-1.1 3-3 3-5.2a6 6 0 0 0-6-6z" />
    </>
  ),
  2: (
    <>
      <path d="m8 3-6 9 6 9" />
      <path d="m16 3 6 9-6 9" />
      <path d="M14 4 10 20" />
    </>
  ),
  3: (
    <>
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v6c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
      <path d="M4 11v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
    </>
  ),
};

export function ExpertiseGrid({ eyebrow, cards }: ExpertiseGridProps) {
  return (
    <div id="services" className="bg-bg-dark py-13 text-text-on-dark md:py-17 lg:py-19">
      <Container>
        <div className="mb-8">
          <SectionEyebrow tone="muted">{eyebrow}</SectionEyebrow>
        </div>
        <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {cards.map((card, index) => (
            <div key={card.title} className="bg-bg-dark-panel-alt p-6.5">
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="mb-5 text-accent"
              >
                {icons[index]}
              </svg>
              <div className="mb-2.5 font-heading text-[17px] font-semibold text-text-on-dark">{card.title}</div>
              <div className="text-[14.5px] leading-[1.7] text-body-dark-muted">{card.description}</div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
