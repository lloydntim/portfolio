'use client';

import { useSyncExternalStore } from 'react';

function subscribe(onChange: () => void) {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)');
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

function getSnapshot(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getServerSnapshot(): boolean {
  return false;
}

/**
 * For JavaScript-controlled timing that cannot be handled through CSS alone
 * (the intro sequence). CSS-only animations use the
 * `@media (prefers-reduced-motion: reduce)` query directly instead
 * (architecture section 17); this hook is not a substitute for that.
 *
 * `useSyncExternalStore` (rather than an effect + setState) reads this
 * browser-only preference without a hydration mismatch: the server snapshot
 * is a fixed `false`, and React reconciles it against the real client value
 * right after hydration.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
