import type { ContactFormData } from '../schema';

export type ContactDeliveryResult = { ok: true } | { ok: false; error: 'network-error' | 'submission-failed' };

const FORM_NAME = 'contact';

function encodeForNetlify(data: Record<string, string>): string {
  return Object.entries(data)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
}

/**
 * Netlify Forms does not accept JSON: a URL-encoded POST with a `form-name`
 * field matching the static HTML form Netlify's build detected (architecture
 * section 15, ADR-007). The target is `/__forms.html`, the static file that
 * registers this form's shape with Netlify at build time, since
 * @netlify/plugin-nextjs v5 can no longer detect form markup rendered only
 * by the client-side ContactForm component (see public/__forms.html).
 */
export async function submitContact(data: ContactFormData): Promise<ContactDeliveryResult> {
  try {
    const response = await fetch('/__forms.html', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encodeForNetlify({ 'form-name': FORM_NAME, ...data }),
    });

    return response.ok ? { ok: true } : { ok: false, error: 'submission-failed' };
  } catch {
    return { ok: false, error: 'network-error' };
  }
}
