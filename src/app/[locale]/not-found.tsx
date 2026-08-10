import { Link } from '@/i18n/navigation';

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-bg-dark px-6 text-center text-text-on-dark">
      <p className="font-label text-sm uppercase tracking-[2px] text-eyebrow-muted">404</p>
      <h1 className="font-heading text-3xl font-bold">Page not found</h1>
      <p className="max-w-md text-body-dark-muted">The page you are looking for does not exist or has moved.</p>
      <Link
        href="/"
        className="mt-2 bg-accent px-6 py-3 font-heading text-sm font-semibold text-white hover:bg-accent-hover-strong"
      >
        Back to home
      </Link>
    </div>
  );
}
