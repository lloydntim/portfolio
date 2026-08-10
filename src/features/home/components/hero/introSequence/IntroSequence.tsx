'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';

const SESSION_KEY = 'introPlayed';
// Matches the introHold keyframe's total duration below: holds at full
// opacity 0.5s longer than before (to 78%, ~3.2s) before its ~0.9s fade-out,
// so the logo doesn't disappear as soon as it finishes popping in.
const HOLD_MS = 4100;

// `fetchPriority` on <video> is valid per the HTML living standard and is
// what Lighthouse's LCP-discovery audit checks for on this element, but
// React's DOM types only declare it for img/link/script (lib.dom.d.ts has
// not caught up). Spreading a separately-declared object bypasses excess
// property checking so the lowercase attribute still reaches the DOM.
const videoFetchPriority = { fetchpriority: 'high' } as const;

export type IntroSequenceProps = {
  webmSrc: string;
  mp4Src: string;
  posterSrc: string;
};

function subscribe() {
  return () => {};
}

function getAlreadyPlayedSnapshot(): boolean {
  return Boolean(sessionStorage.getItem(SESSION_KEY));
}

function getAlreadyPlayedServerSnapshot(): boolean {
  return false;
}

/**
 * Plays once per browser session, bypassed entirely under reduced motion
 * (specs/prototype-analysis.md decision 9). The server snapshot for
 * `alreadyPlayed` is a fixed `false` so the overlay (and its video/poster)
 * is present in the initial HTML and discoverable by the browser at
 * parse time, same priority path as the hero image, instead of only
 * appearing after a post-hydration passive-effect correction. A returning
 * visitor's real sessionStorage value is corrected in after hydration same
 * as before; the blocking script in the root layout plus the
 * `html[data-intro-played]` rule in globals.css hide it instantly on first
 * paint so that correction never causes a visible flash.
 */
export function IntroSequence({ webmSrc, mp4Src, posterSrc }: IntroSequenceProps) {
  const reducedMotion = useReducedMotion();
  const [dismissed, setDismissed] = useState(false);
  const alreadyPlayed = useSyncExternalStore(subscribe, getAlreadyPlayedSnapshot, getAlreadyPlayedServerSnapshot);

  const dismiss = () => {
    sessionStorage.setItem(SESSION_KEY, '1');
    setDismissed(true);
  };

  useEffect(() => {
    if (reducedMotion || alreadyPlayed || dismissed) return;
    const timer = setTimeout(dismiss, HOLD_MS);
    return () => clearTimeout(timer);
  }, [reducedMotion, alreadyPlayed, dismissed]);

  if (reducedMotion || alreadyPlayed || dismissed) {
    return null;
  }

  return (
    <div
      id="intro-sequence"
      className="absolute inset-0 z-30 flex items-center justify-center bg-black [animation:introHold_4.1s_ease_forwards]"
    >
      <video
        autoPlay
        muted
        playsInline
        poster={posterSrc}
        {...videoFetchPriority}
        width={1920}
        height={1080}
        className="h-13.5 w-auto max-w-full opacity-0 [animation:logoPop_.6s_ease_.2s_forwards] md:h-22.5"
      >
        <source src={webmSrc} type="video/webm" />
        <source src={mp4Src} type="video/mp4" />
      </video>
      <button
        type="button"
        onClick={dismiss}
        className="absolute bottom-6 right-6 font-label text-xs uppercase tracking-[2px] text-white/70 hover:text-white"
      >
        Skip
      </button>
    </div>
  );
}
