'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useStickyNavigation } from '@/shared/hooks/useStickyNavigation';
import { LanguageSwitcher } from '@/shared/components/site/languageSwitcher/LanguageSwitcher';
import styles from './SiteNavigation.module.css';

export type SiteNavigationLink = {
  label: string;
  href: string;
};

export type SiteNavigationProps = {
  logoSrc: string;
  logoAlt: string;
  links: SiteNavigationLink[];
  /** Pass this on any page that opens with a dark section the nav can start
   * transparent over (the homepage hero, a case study's opening block). The
   * nav switches to its sticky, solid form once the user scrolls past that
   * section, and back when they return to the top (specs/prototype-analysis.md
   * decision 8, which approves this behaviour for the nav generally, not
   * just the homepage). Omit it on pages without such a section, where the
   * nav should just start sticky. */
  startsOverHero?: boolean;
};

export function SiteNavigation({ logoSrc, logoAlt, links, startsOverHero = false }: SiteNavigationProps) {
  const [open, setOpen] = useState(false);
  const isPastHero = useStickyNavigation();
  const isSticky = !startsOverHero || isPastHero;
  // While the mobile menu is open, the bar and the panel below it are both
  // solid (same colour), and everything else still visible on screen is
  // blurred instead, rather than the panel itself being translucent.
  const isSolid = isSticky || open;

  return (
    <>
      {open ? (
        <div
          onClick={() => setOpen(false)}
          aria-hidden="true"
          className="fixed inset-0 z-9 backdrop-blur-xl md:hidden"
        />
      ) : null}

      <nav
        aria-label="Primary"
        className={`${isSticky ? 'fixed' : 'absolute'} inset-x-0 top-0 z-10 transition-colors duration-200 motion-reduce:transition-none ${
          isSolid ? 'bg-bg-dark-panel' : 'bg-transparent'
        }`}
      >
        <div className="flex items-center justify-between px-8 py-4 md:px-10 md:py-4.5 lg:px-16 lg:py-5.5">
          {/* A sized wrapper + `fill` avoids next/image's width/height
              mismatch warning that a single fixed height + `w-auto` class
              triggers; the wrapper's width is derived from its height via
              aspect-ratio instead. */}
          <span
            className={`relative inline-block ${isSticky ? 'h-3.25 md:h-5' : 'h-3.75 md:h-5.5'}`}
            style={{ aspectRatio: '96 / 20' }}
          >
            <Image src={logoSrc} alt={logoAlt} fill sizes="120px" className="object-contain object-left" preload />
          </span>

          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="nav-links"
            onClick={() => setOpen((value) => !value)}
            className={`z-6 flex h-5.5 w-5.5 flex-col justify-center gap-1 border-none bg-transparent p-0 md:hidden ${
              open ? styles.toggleOpen : ''
            }`}
          >
            <span className={styles.toggleBar} />
            <span className={styles.toggleBar} />
            <span className={styles.toggleBar} />
          </button>

          {/* The padding lives on the inner div, not this clipping wrapper:
              max-height can't shrink an element's own padding below its set
              value, so padding here would leave a few pixels of the closed
              panel visible even at max-h-0. */}
          <div
            id="nav-links"
            className={`absolute inset-x-0 top-full overflow-hidden transition-[max-height] duration-300 motion-reduce:transition-none md:static md:overflow-visible md:max-h-none ${
              open ? 'max-h-130' : 'max-h-0'
            }`}
          >
            <div className="flex flex-col items-center gap-3 bg-bg-dark-panel px-8 pb-4 pt-4 text-center text-2xl font-medium text-[#c7c5c2] md:flex-row md:items-center md:gap-7.5 md:bg-transparent md:p-0 md:pb-0 md:text-[17.4px]">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`${styles.navLink} py-3 text-inherit hover:text-white md:py-0`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="hidden text-[#c7c5c2] hover:text-white md:ml-3.75 md:block">
                <LanguageSwitcher variant="dropdown" />
              </div>
            </div>
            <div className="bg-bg-dark-panel px-8 pb-8 text-[#c7c5c2] md:hidden">
              <LanguageSwitcher variant="inline" onNavigate={() => setOpen(false)} />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
