'use client';

import { useEffect, useState } from 'react';

/**
 * Scrollspy: tracks which of the given in-page section ids (each without
 * its leading '#') currently sits in a thin band near the top of the
 * viewport, well clear of the fixed nav. An id that has no matching
 * element on the current page (a case-study page's nav links point back
 * to homepage sections) is silently skipped. Returns null while above
 * the first section (e.g. still in the hero) or when none of the ids
 * exist on this page.
 */
export function useActiveSection(ids: string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [ids]);

  return activeId;
}
