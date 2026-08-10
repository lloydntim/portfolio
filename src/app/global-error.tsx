'use client';

/**
 * Next.js's global error boundary supplies its own <html>/<body> because it
 * can be triggered above the normal [locale] layout tree (architecture
 * section 8). Per AGENTS.md section 13, no stack trace, digest, or other
 * error detail is rendered.
 */
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en">
      <body className="flex min-h-svh flex-col items-center justify-center gap-4 bg-[#151517] px-6 text-center text-[#f4f2ef]">
        <h1 className="font-bold text-2xl">Something went wrong</h1>
        <p className="max-w-md text-[#a8a6a3]">
          An unexpected error occurred. Please try again, or email info@lloydntim.com if the problem continues.
        </p>
        <button
          type="button"
          onClick={reset}
          className="bg-[#c1121f] px-6 py-3 text-sm font-semibold text-white hover:bg-[#a30f1a]"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
