'use client';

import { useEffect, useState } from 'react';

/**
 * Tracks whether the nav's original position (over the hero) has scrolled
 * out of view, so the caller can switch to a sticky presentation and back
 * (specs/prototype-analysis.md decision 8).
 */
export function useStickyNavigation(thresholdPx = 1): boolean {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > thresholdPx);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [thresholdPx]);

  return isSticky;
}
