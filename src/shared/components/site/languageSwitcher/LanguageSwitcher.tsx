'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { publishedLocales } from '@/i18n/routing';
import styles from './LanguageSwitcher.module.css';

export type LanguageSwitcherProps = {
  variant: 'dropdown' | 'inline';
  /** Called after a locale link is clicked; the inline variant uses this to
   * close the mobile menu, matching how the nav links already behave. */
  onNavigate?: () => void;
};

export function LanguageSwitcher({ variant, onNavigate }: LanguageSwitcherProps) {
  const activeLocale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  if (variant === 'inline') {
    return (
      <div className="flex items-center justify-center gap-6 border-t border-white/10 pt-4 font-label text-sm font-bold tracking-wide">
        {publishedLocales.map((locale) => (
          <Link
            key={locale}
            href={pathname}
            locale={locale}
            onClick={onNavigate}
            aria-current={locale === activeLocale ? 'true' : undefined}
            className={`${styles.option} ${locale === activeLocale ? `${styles.optionActive} text-text-on-dark` : 'text-body-dark-muted'}`}
          >
            {locale.toUpperCase()}
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-1 font-label text-inherit"
      >
        {activeLocale.toUpperCase()}
        <svg
          viewBox="0 0 10 6"
          fill="none"
          aria-hidden="true"
          className={`h-1.5 w-2.5 ${styles.chevron} ${open ? styles.chevronOpen : ''}`}
        >
          <path
            d="M1 1l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-full mt-3 flex min-w-22 flex-col gap-2 bg-bg-dark-panel-alt py-2.5 font-label text-sm font-bold tracking-wide"
        >
          {publishedLocales.map((locale) => (
            <Link
              key={locale}
              role="menuitem"
              href={pathname}
              locale={locale}
              onClick={() => setOpen(false)}
              aria-current={locale === activeLocale ? 'true' : undefined}
              className={`${styles.option} mx-4 ${locale === activeLocale ? `${styles.optionActive} text-text-on-dark` : 'text-body-dark-muted'}`}
            >
              {locale.toUpperCase()}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
