export type ServicesRowProps = {
  number: string;
  label: string;
  title: string;
  description: string;
  isLast?: boolean;
};

export function ServicesRow({ number, label, title, description, isLast = false }: ServicesRowProps) {
  return (
    <div
      className={`grid grid-cols-1 gap-3.5 border-t border-white/10 py-8 md:grid-cols-[70px_1fr] md:gap-x-6 md:gap-y-2.5 md:py-9 md:[&>*:last-child]:col-start-2 lg:grid-cols-[90px_1.1fr_1.3fr] lg:items-start lg:gap-10 lg:py-10 lg:[&>*:last-child]:col-auto ${
        isLast ? 'border-b border-white/10' : ''
      }`}
    >
      {/* #d94550, not --color-accent (#c1121f): the accent fails WCAG AA
          (3.09:1) against this dark panel; this is the approved minimal fix
          (4.52:1), not an arbitrary deviation. */}
      <div className="font-label text-base font-bold tracking-[1px] text-[#d94550]">{number}</div>
      <div>
        <div className="mb-2.5 font-label text-[12.5px] font-semibold tracking-[2px] text-eyebrow-muted">
          {label}
        </div>
        <h3 className="m-0 font-heading text-[30px] font-bold leading-[1.15] tracking-[-0.5px] text-text-on-dark">
          {title}
        </h3>
      </div>
      <p className="mt-1.5 text-base leading-[1.7] text-body-dark-muted lg:mt-0">{description}</p>
    </div>
  );
}
