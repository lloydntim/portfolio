'use client';

import { useEffect, useState } from 'react';

/**
 * Scrollspy: tracks which of the given in-page section ids (each without
 * its leading '#') currently sits in a thin band near the top of the
 * viewport, well clear of the fixed nav. An id that has no matching
 * element on the current page (a case-study page's nav links point back
 * to homepage sections) is silently skipped. Returns null while above
 * the first section (e.g. still in the hero), below the last one, or when
 * none of the ids exist on this page.
 *
 * IntersectionObserver only reports elements whose intersection state just
 * changed, not the full current set, so a single entry's event can't be
 * used on its own to decide what's active: jumping straight back to the
 * top only reports the last section's exit (nothing enters the band to
 * report instead), which - if you set `activeId` to "whichever entry in
 * this batch is intersecting, if any" - leaves it stuck on that section
 * forever. Tracking every id's own intersection state instead, and
 * recomputing the active one from that full set on every callback, means a
 * section exiting with nothing else entering correctly resolves to null.
 */
export function useActiveSection(ids: string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) return;

    const intersecting = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            intersecting.add(entry.target.id);
          } else {
            intersecting.delete(entry.target.id);
          }
        }
        setActiveId(ids.find((id) => intersecting.has(id)) ?? null);
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [ids]);

  return activeId;
}
