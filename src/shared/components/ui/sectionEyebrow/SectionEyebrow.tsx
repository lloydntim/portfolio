import type { ReactNode } from 'react';

export type SectionEyebrowProps = {
  children: ReactNode;
  tone?: 'accent' | 'muted';
  align?: 'start' | 'center';
};

const toneClasses: Record<NonNullable<SectionEyebrowProps['tone']>, string> = {
  accent: 'text-accent',
  muted: 'text-eyebrow-muted',
};

export function SectionEyebrow({ children, tone = 'accent', align = 'start' }: SectionEyebrowProps) {
  return (
    <div
      className={`flex items-center gap-3.5 ${align === 'center' ? 'justify-center' : ''}`}
    >
      <span className="h-[3px] w-[34px] bg-accent" aria-hidden="true" />
      <span className={`font-label text-[13px] font-semibold uppercase tracking-[2px] ${toneClasses[tone]}`}>
        {children}
      </span>
    </div>
  );
}
