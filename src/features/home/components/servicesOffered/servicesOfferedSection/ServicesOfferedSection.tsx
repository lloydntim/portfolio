import { SectionEyebrow } from '@/shared/components/ui/sectionEyebrow/SectionEyebrow';
import { Container } from '@/shared/components/layout/container/Container';
import { ServicesRow, type ServicesRowProps } from '../servicesRow/ServicesRow';

export type ServicesOfferedSectionProps = {
  eyebrow: string;
  intro: string;
  rows: Omit<ServicesRowProps, 'isLast'>[];
};

export function ServicesOfferedSection({ eyebrow, intro, rows }: ServicesOfferedSectionProps) {
  return (
    <div className="border-t border-white/[0.06] bg-bg-dark-panel py-16 md:py-20 lg:py-24">
      <Container>
        <div className="mb-11 max-w-[720px]">
          <div className="mb-5.5">
            <SectionEyebrow tone="muted">{eyebrow}</SectionEyebrow>
          </div>
          <p className="m-0 font-heading text-[22px] font-medium leading-[1.55] text-[#e5e3e0]">{intro}</p>
        </div>

        {rows.map((row, index) => (
          <ServicesRow key={row.number} {...row} isLast={index === rows.length - 1} />
        ))}
      </Container>
    </div>
  );
}
