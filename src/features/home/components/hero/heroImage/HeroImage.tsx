import { getImageProps } from 'next/image';
import { IntroSequence } from '../introSequence/IntroSequence';

export type HeroImageContent = {
  titleAccent: string;
  titleRest: string;
  subtitle: string;
};

export type HeroImageProps = HeroImageContent;

const backgroundImageClassName =
  'absolute inset-0 h-full w-full object-cover [filter:blur(1.5px)_saturate(.85)] [animation:kenBurns_18s_ease-in-out_infinite_alternate]';

// Art direction (a differently-cropped source per breakpoint, not just a
// resized one): getImageProps + <picture> is next/image's documented
// pattern for this, since a single Image can't switch source images by
// media query. `loading: 'eager'` counteracts the lazy default, and
// `fetchPriority: 'high'` raises the browser's priority for whichever one
// <img> the picture resolves to; neither preloads the other two variants,
// unlike `preload`/`priority`, which would (measured: without this, the LCP
// image had a ~5.3s resource-load delay before the browser even started
// fetching it).
const backgroundImageCommon = { alt: '', sizes: '100vw', loading: 'eager', fetchPriority: 'high' } as const;

const { props: backgroundDesktopImage } = getImageProps({
  ...backgroundImageCommon,
  src: '/photo-hero-landscape.webp',
  width: 1376,
  height: 768,
});
const { props: backgroundTabletImage } = getImageProps({
  ...backgroundImageCommon,
  src: '/photo-hero-tablet-portrait.webp',
  width: 896,
  height: 1200,
});
const { props: backgroundMobileImage } = getImageProps({
  ...backgroundImageCommon,
  src: '/photo-hero-mobile.webp',
  width: 768,
  height: 1376,
});

export function HeroImage({ titleAccent, titleRest, subtitle }: HeroImageProps) {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center gap-7 overflow-hidden px-8 pb-15 pt-27.5 text-center md:px-10 md:pb-17.5 md:pt-35 lg:px-16 lg:pb-20 lg:pt-37.5">
      <IntroSequence webmSrc="/logo-intro.webm" mp4Src="/logo-intro.mp4" posterSrc="/poster.webp" />

      <picture className="contents">
        <source media="(min-width: 1024px)" srcSet={backgroundDesktopImage.srcSet} />
        <source media="(min-width: 700px)" srcSet={backgroundTabletImage.srcSet} />
        <img {...backgroundMobileImage} alt="" className={backgroundImageClassName} />
      </picture>
      <div className="absolute inset-0 bg-accent opacity-[0.08] mix-blend-overlay" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,6,7,.58)_0%,rgba(6,6,7,.42)_40%,rgba(6,6,7,.3)_70%,rgba(6,6,7,.48)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_70%_at_50%_55%,transparent_30%,rgba(6,6,7,.38)_100%)]" />

      <div className="relative top-20 z-[1] mx-auto max-w-[900px]">
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 z-0 h-[220%] w-[150%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_60%_65%_at_50%_50%,rgba(0,0,0,.55),transparent_72%)]"
        />
        <h1 className="hero-fade relative mb-3.5 min-h-[2.1em] font-heading text-[2.35rem] font-bold leading-[1.05] tracking-[-0.02em] text-white opacity-0 [animation:fadeUp_.9s_ease_3.7s_forwards] [text-shadow:0_4px_20px_rgba(0,0,0,.65)] xs:min-h-[1.05em] xs:text-[3rem] md:text-[3.75rem] lg:text-[4.5rem] xl:text-[5.15625rem]">
          <span className="text-accent-mid">{titleAccent}</span> {titleRest}
        </h1>
        <p className="hero-fade relative mx-auto max-w-[480px] text-[15px] leading-[1.6] text-[#f0efec] opacity-0 [animation:fadeUp_.9s_ease_3.9s_forwards] [text-shadow:0_2px_12px_rgba(0,0,0,.6)] md:max-w-[520px] md:text-[17px] lg:text-[18px]">
          {subtitle}
        </p>
      </div>

      <div className="hero-fade relative top-20 z-[2] flex flex-col items-center gap-2 opacity-0 [animation:fadeUp_.8s_ease_4.1s_forwards]">
        <span className="font-label text-[10px] font-medium tracking-[2px] text-white/65">SCROLL</span>
        <div className="relative h-10 w-[1.5px] overflow-hidden bg-white/25">
          <div className="absolute left-0 top-[-16px] h-4 w-full bg-accent [animation:lineDrop_1.8s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
}
