export type SiteFooterProps = {
  copyright: string;
  githubHref: string;
  linkedinHref: string;
  email: string;
};

export function SiteFooter({ copyright, githubHref, linkedinHref, email }: SiteFooterProps) {
  return (
    <footer className="flex flex-col items-center gap-3 px-8 py-7 text-center text-[13px] text-footer-text md:flex-row md:items-center md:justify-between md:px-16 md:py-6.5 md:text-left">
      <span>{copyright}</span>
      <div className="flex flex-wrap items-center justify-center gap-3.5 gap-y-3 font-label">
        <a href={githubHref} className="hover:text-accent">
          GitHub
        </a>
        <a href={linkedinHref} className="hover:text-accent">
          LinkedIn
        </a>
        <a href={`mailto:${email}`} className="hover:text-accent">
          {email}
        </a>
      </div>
    </footer>
  );
}
