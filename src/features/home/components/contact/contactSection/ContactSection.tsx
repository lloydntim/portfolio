import Image from 'next/image';
import { SectionEyebrow } from '@/shared/components/ui/sectionEyebrow/SectionEyebrow';
import { ContactForm, type ContactFormCopy } from '../contactForm/ContactForm';

export type ContactSectionContent = {
  eyebrow: string;
  heading: string;
  availability: string;
  location: string;
  email: string;
  ukPhone: string | null;
  dePhone: string | null;
  form: ContactFormCopy;
};

export type ContactSectionProps = ContactSectionContent;

export function ContactSection({ eyebrow, heading, availability, location, email, ukPhone, dePhone, form }: ContactSectionProps) {
  return (
    <div id="contact" className="relative overflow-hidden py-16 md:py-20">
      <Image src="/photo-contract-dev-hands-typing.webp" alt="" fill sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(14,14,16,.9),rgba(14,14,16,.82)),radial-gradient(90%_120%_at_15%_50%,rgba(193,18,31,.22),transparent_55%)]" />

      <div className="relative mx-auto max-w-180 px-8 text-center">
        <div className="mb-5.5">
          <SectionEyebrow tone="muted" align="center">
            {eyebrow}
          </SectionEyebrow>
        </div>
        <h2 className="mb-4 font-heading text-[clamp(1.9rem,6vw,2.75rem)] font-bold leading-[1.15] tracking-[-1px] text-text-on-dark">
          {heading}
        </h2>
        <p className="mb-5 text-base text-[#c9c7c4]">{availability}</p>
        <div className="mb-8.5 inline-flex items-center gap-2.5 text-left font-heading text-sm font-medium text-[#e0dedb]">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#e8636f" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="flex-none" aria-hidden="true">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {location}
        </div>

        <ContactForm copy={form} />

        <p className="mt-6 text-sm text-[#c9c7c4]">
          Prefer email?{' '}
          <a href={`mailto:${email}`} className="text-white underline underline-offset-2 hover:text-accent-hover">
            {email}
          </a>
        </p>
        {ukPhone || dePhone ? (
          <p className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-[#c9c7c4]">
            {ukPhone ? (
              <a href={`tel:${ukPhone.replace(/\s+/g, '')}`} className="text-white underline underline-offset-2 hover:text-accent-hover">
                UK {ukPhone}
              </a>
            ) : null}
            {dePhone ? (
              <a href={`tel:${dePhone.replace(/\s+/g, '')}`} className="text-white underline underline-offset-2 hover:text-accent-hover">
                DE {dePhone}
              </a>
            ) : null}
          </p>
        ) : null}
      </div>
    </div>
  );
}
