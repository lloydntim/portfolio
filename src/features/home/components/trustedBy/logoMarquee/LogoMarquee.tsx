export type TrustedByLogo = {
  name: string;
  slug: string;
  variant: 'pair' | 'solo';
  /** Only some brands have a colour asset; a few (Native Instruments) only
   * ever had a black-and-white file, so the "solo" filename isn't always
   * `logo-${slug}.svg`. Defaults to that when omitted. */
  soloFile?: string;
};

export type LogoMarqueeProps = {
  heading: string;
  logos: TrustedByLogo[];
};

function LogoTile({ logo }: { logo: TrustedByLogo }) {
  return (
    <div className="group relative flex h-[60px] w-[130px] flex-none items-center justify-center bg-white px-3.5 md:h-[76px] md:w-[172px] md:px-5.5">
      {logo.variant === 'pair' ? (
        <>
          {/* SVG logos use a plain <img>, not next/image, per ADR-002: vector
              graphics are already resolution-independent. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/logos/logo-${logo.slug}-bw.svg`}
            alt=""
            className="block max-h-6 max-w-[100px] object-contain grayscale transition-opacity duration-300 group-hover:opacity-0 motion-reduce:transition-none md:max-h-8 md:max-w-[126px]"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/logos/logo-${logo.slug}.svg`}
            alt={logo.name}
            className="absolute block max-h-6 max-w-[100px] object-contain opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:transition-none md:max-h-8 md:max-w-[126px]"
          />
        </>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- SVG logo, see ADR-002
        <img
          src={`/logos/${logo.soloFile ?? `logo-${logo.slug}.svg`}`}
          alt={logo.name}
          className="block max-h-6 max-w-[100px] object-contain opacity-85 grayscale transition-[opacity,filter] duration-300 group-hover:opacity-100 group-hover:grayscale-0 motion-reduce:transition-none md:max-h-8 md:max-w-[126px]"
        />
      )}
    </div>
  );
}

export function LogoMarquee({ heading, logos }: LogoMarqueeProps) {
  const track = [...logos, ...logos];

  return (
    <div className="overflow-hidden bg-white py-9 pb-10">
      {/* #7a756c, not the prototype's original #9a938a: that failed WCAG AA
          (3.03:1) on white; this is the approved minimal fix (4.58:1). */}
      <p className="mb-7 px-6 text-center font-label text-sm font-semibold tracking-[3px] text-[#7a756c]">
        {heading}
      </p>
      <div className="relative overflow-hidden">
        <div className="flex w-max [animation:marquee_46s_linear_infinite] hover:[animation-play-state:paused]">
          {track.map((logo, index) => (
            <LogoTile key={`${logo.slug}-${index}`} logo={logo} />
          ))}
        </div>
      </div>
    </div>
  );
}
