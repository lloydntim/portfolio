import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { locale } from 'next/root-params';
import { Montserrat, Roboto, Open_Sans } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { publishedLocales } from '@/i18n/routing';
import '../globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-montserrat',
  display: 'swap',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-roboto',
  display: 'swap',
});

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-open-sans',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lloydntim.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Lloyd Ntim | Product Engineer',
    template: '%s | Lloyd Ntim',
  },
  description: 'Product, full-stack and agentic engineering for enterprise and consumer brands.',
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
  },
};

export function generateStaticParams() {
  return publishedLocales.map((value) => ({ locale: value }));
}

export const dynamicParams = false;

// The intro overlay is server-rendered by default (specs/architecture decision
// 9 needs it discoverable at HTML-parse time, not gated behind hydration, so
// its video/poster load at the same priority as the hero image). This script
// runs synchronously before the overlay markup is parsed, so a returning
// visitor's already-played session never flashes it (see
// IntroSequence.tsx and the `html[data-intro-played]` CSS rule in globals.css).
const introFlashPreventionScript = `(function(){try{if(sessionStorage.getItem("introPlayed"))document.documentElement.setAttribute("data-intro-played","1")}catch(e){}})()`;

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang={await locale()}
      // scroll-pt-* offsets in-page anchor scrolling (nav links, hash URLs)
      // by the fixed nav's height at each breakpoint, so the target section
      // doesn't end up hidden behind it (Next.js docs: "Scroll offset with
      // sticky headers"). scroll-smooth is overridden back to instant under
      // prefers-reduced-motion by the global rule in globals.css.
      className={`${montserrat.variable} ${roboto.variable} ${openSans.variable} scroll-smooth scroll-pt-16 md:scroll-pt-18 lg:scroll-pt-20`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: introFlashPreventionScript }} />
      </head>
      <body className="bg-bg-dark font-body text-text-on-dark antialiased">
        <NextIntlClientProvider messages={{}}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
