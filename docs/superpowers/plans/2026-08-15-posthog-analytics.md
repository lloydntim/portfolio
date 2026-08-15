# PostHog Analytics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add cookieless, EU-hosted PostHog analytics (pageviews, CV download clicks, contact-form submissions) proxied through `/ingest`, per the approved spec at `specs/architecture/analytics.md`.

**Architecture:** A single global client-side init (`src/instrumentation-client.ts`) loads `posthog-js` with `cookieless_mode: 'always'` and automatic pageview tracking. Two named custom events cover the remaining requirements: `cv_download` (via a typed `analyticsEvent` prop on the shared `Button` component plus one delegated document click-listener, so no server component needs to become a client component) and `contact_form_submitted` (a direct `posthog.capture` call in the already-client `ContactForm`). `next.config.ts` gains a `rewrites()` proxy so PostHog traffic appears to come from the site's own domain.

**Tech Stack:** Next.js 16.3 App Router, `posthog-js`, Vitest + Testing Library.

---

### Task 1: Add the `posthog-js` dependency

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install the package**

Run: `pnpm add posthog-js@^1.417.1`

Expected: `package.json` gains `"posthog-js": "^1.417.1"` under `"dependencies"`, and `pnpm-lock.yaml` updates.

- [ ] **Step 2: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "build: add posthog-js dependency"
```

---

### Task 2: Add a typed `analyticsEvent` prop to `Button`

**Files:**
- Modify: `src/shared/components/ui/button/Button.tsx`
- Test: `src/shared/components/ui/button/Button.spec.tsx`

The CV download link is rendered by a Server Component (`AboutSection.tsx`) through the shared `Button`. React's JSX only allows arbitrary `data-*` attributes on lowercase intrinsic elements (`<a>`, `<button>`), not on typed custom-component props — so `Button` needs an explicit, typed prop that it maps to `data-ph-event` on the DOM node it renders. This keeps `AboutSection` a Server Component; no `'use client'` needed anywhere for this.

- [ ] **Step 1: Write the failing test**

Add to `src/shared/components/ui/button/Button.spec.tsx`, inside the existing `describe('Button', ...)` block:

```tsx
  it('renders a data-ph-event attribute when analyticsEvent is set', () => {
    render(
      <Button href="/cv/lloyd-ntim-cv-en.pdf" analyticsEvent="cv_download">
        Download CV
      </Button>,
    );

    const link = screen.getByRole('link', { name: 'Download CV' });
    expect(link).toHaveAttribute('data-ph-event', 'cv_download');
  });
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test -- Button.spec.tsx`
Expected: FAIL — `analyticsEvent` is not a valid prop on `ButtonProps` (TypeScript) / the rendered anchor has no `data-ph-event` attribute.

- [ ] **Step 3: Implement**

Replace the full contents of `src/shared/components/ui/button/Button.tsx`:

```tsx
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';

type ButtonBaseProps = {
  size?: 'md' | 'lg';
  className?: string;
  analyticsEvent?: string;
};

type ButtonAsButton = ButtonBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsAnchor = ButtonBaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsAnchor;

const base =
  'inline-flex items-center gap-2.5 whitespace-nowrap font-heading font-semibold text-white bg-accent transition-colors duration-200 motion-reduce:transition-none hover:bg-accent-hover-strong';

const sizeClasses: Record<NonNullable<ButtonBaseProps['size']>, string> = {
  md: 'px-6.5 py-3.5 text-[15px]',
  lg: 'px-[30px] py-4 text-[15px]',
};

export function Button({ size = 'lg', className, analyticsEvent, ...props }: ButtonProps) {
  const classes = [base, sizeClasses[size], className].filter(Boolean).join(' ');

  if ('href' in props && props.href !== undefined) {
    const { href, ...rest } = props;
    return (
      <a href={href} className={classes} data-ph-event={analyticsEvent} {...rest}>
        {props.children}
      </a>
    );
  }

  const { children, ...rest } = props as ButtonAsButton;
  return (
    <button className={classes} data-ph-event={analyticsEvent} {...rest}>
      {children}
    </button>
  );
}
```

Note: `data-ph-event={analyticsEvent}` renders no attribute at all when `analyticsEvent` is `undefined` (React omits `undefined`-valued attributes), so every existing `Button` usage without `analyticsEvent` is unaffected.

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm test -- Button.spec.tsx`
Expected: PASS (all 3 tests in the file)

- [ ] **Step 5: Typecheck**

Run: `pnpm typecheck`
Expected: no errors

- [ ] **Step 6: Commit**

```bash
git add src/shared/components/ui/button/Button.tsx src/shared/components/ui/button/Button.spec.tsx
git commit -m "feat: add analyticsEvent prop to Button for data-ph-event tracking"
```

---

### Task 3: Wire `cv_download` on the CV button

**Files:**
- Modify: `src/features/home/components/about/aboutSection/AboutSection.tsx:64`

- [ ] **Step 1: Add the prop**

In `AboutSection.tsx`, change:

```tsx
          <Button href={cvHref} download size="md" className="order-5 self-start md:col-start-1 md:row-start-3 md:justify-self-start">
```

to:

```tsx
          <Button
            href={cvHref}
            download
            size="md"
            analyticsEvent="cv_download"
            className="order-5 self-start md:col-start-1 md:row-start-3 md:justify-self-start"
          >
```

- [ ] **Step 2: Typecheck**

Run: `pnpm typecheck`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/features/home/components/about/aboutSection/AboutSection.tsx
git commit -m "feat: tag CV download button for analytics tracking"
```

---

### Task 4: Delegated click-listener helper

**Files:**
- Create: `src/shared/helpers/trackDelegatedClicks.ts`
- Test: `src/shared/helpers/trackDelegatedClicks.spec.ts`

This is the piece that turns a `data-ph-event` attribute anywhere in the DOM into a `posthog.capture` call, without any per-component client-side code. It is registered once, globally, in Task 5.

- [ ] **Step 1: Write the failing test**

Create `src/shared/helpers/trackDelegatedClicks.spec.ts`:

```ts
import { describe, expect, it, vi, beforeEach } from 'vitest';
import posthog from 'posthog-js';
import { handleDelegatedClick } from './trackDelegatedClicks';

vi.mock('posthog-js', () => ({
  default: { capture: vi.fn() },
}));

describe('handleDelegatedClick', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.mocked(posthog.capture).mockClear();
  });

  it('captures the event named on the clicked element', () => {
    document.body.innerHTML = '<a href="/cv.pdf" data-ph-event="cv_download">Download</a>';
    const link = document.querySelector('a')!;

    handleDelegatedClick(new MouseEvent('click', { bubbles: true }), link);

    expect(posthog.capture).toHaveBeenCalledWith('cv_download');
  });

  it('captures the event when the click target is a descendant of the tagged element', () => {
    document.body.innerHTML = '<a href="/cv.pdf" data-ph-event="cv_download"><span>Download</span></a>';
    const span = document.querySelector('span')!;

    handleDelegatedClick(new MouseEvent('click', { bubbles: true }), span);

    expect(posthog.capture).toHaveBeenCalledWith('cv_download');
  });

  it('does not capture when no ancestor has data-ph-event', () => {
    document.body.innerHTML = '<button>Untracked</button>';
    const button = document.querySelector('button')!;

    handleDelegatedClick(new MouseEvent('click', { bubbles: true }), button);

    expect(posthog.capture).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test -- trackDelegatedClicks.spec.ts`
Expected: FAIL — `./trackDelegatedClicks` has no exported member `handleDelegatedClick` (module does not exist yet)

- [ ] **Step 3: Implement**

Create `src/shared/helpers/trackDelegatedClicks.ts`:

```ts
import posthog from 'posthog-js';

export function handleDelegatedClick(_event: MouseEvent, eventTarget: EventTarget | null): void {
  if (!(eventTarget instanceof Element)) return;

  const trigger = eventTarget.closest<HTMLElement>('[data-ph-event]');
  if (!trigger) return;

  const eventName = trigger.dataset.phEvent;
  if (!eventName) return;

  posthog.capture(eventName);
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm test -- trackDelegatedClicks.spec.ts`
Expected: PASS (all 3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/shared/helpers/trackDelegatedClicks.ts src/shared/helpers/trackDelegatedClicks.spec.ts
git commit -m "feat: add delegated click-listener helper for data-ph-event tracking"
```

---

### Task 5: Global PostHog init (`instrumentation-client.ts`)

**Files:**
- Create: `src/instrumentation-client.ts`

This file is a Next.js convention (App Router, `src/` layout): code here runs once in the browser before the app hydrates. No test — this is framework wiring, not application logic; `handleDelegatedClick` (Task 4) and the PostHog SDK itself are what's under test.

- [ ] **Step 1: Create the file**

Create `src/instrumentation-client.ts`:

```ts
import posthog from 'posthog-js';
import { handleDelegatedClick } from '@/shared/helpers/trackDelegatedClicks';

if (process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN, {
    api_host: '/ingest',
    ui_host: 'https://eu.posthog.com',
    defaults: '2026-05-30',
    cookieless_mode: 'always',
    person_profiles: 'never',
    disable_session_recording: true,
    capture_pageview: 'history_change',
  });

  document.addEventListener('click', (event) => {
    handleDelegatedClick(event, event.target);
  });
}
```

The outer `if` means nothing in this file runs at all — no PostHog script, no click listener — unless `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` is set. That variable will only be set in Netlify's Production deploy context (Task 8), so local dev and preview deploys never send events.

- [ ] **Step 2: Typecheck**

Run: `pnpm typecheck`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/instrumentation-client.ts
git commit -m "feat: initialize cookieless PostHog analytics"
```

---

### Task 6: `contact_form_submitted` event

**Files:**
- Modify: `src/features/home/components/contact/contactForm/ContactForm.tsx`
- Test: `src/features/home/components/contact/contactForm/ContactForm.spec.tsx`

- [ ] **Step 1: Write the failing assertions**

In `ContactForm.spec.tsx`, add the mock near the top (after the existing imports, before `const copy: ContactFormCopy = ...`):

```tsx
import posthog from 'posthog-js';

vi.mock('posthog-js', () => ({
  default: { capture: vi.fn() },
}));
```

Then update the `beforeEach` to also clear the new mock:

```tsx
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.mocked(posthog.capture).mockClear();
  });
```

Then extend the two delivery-outcome tests with capture assertions:

```tsx
  it('shows a success message when delivery succeeds', async () => {
    vi.spyOn(contactDelivery, 'submitContact').mockResolvedValue({ ok: true });
    render(<ContactForm copy={copy} />);

    await fillAndSubmit({ name: 'Lloyd', email: 'lloyd@example.com', message: 'Hello' });

    await waitFor(() => {
      expect(screen.getByText('Thanks, your message has been sent.')).toBeInTheDocument();
    });
    expect(posthog.capture).toHaveBeenCalledWith('contact_form_submitted', { result: 'success' });
  });

  it('shows a submission-failure message when delivery fails', async () => {
    vi.spyOn(contactDelivery, 'submitContact').mockResolvedValue({ ok: false, error: 'network-error' });
    render(<ContactForm copy={copy} />);

    await fillAndSubmit({ name: 'Lloyd', email: 'lloyd@example.com', message: 'Hello' });

    expect(await screen.findByText('Something went wrong sending your message.')).toBeInTheDocument();
    expect(posthog.capture).toHaveBeenCalledWith('contact_form_submitted', { result: 'network-error' });
  });
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `pnpm test -- ContactForm.spec.tsx`
Expected: FAIL on the two new `expect(posthog.capture).toHaveBeenCalledWith(...)` assertions — `capture` is never called yet.

- [ ] **Step 3: Implement**

In `ContactForm.tsx`, add the import at the top:

```tsx
import posthog from 'posthog-js';
```

Then change:

```tsx
    setErrors({});
    setStatus('submitting');
    const delivery = await submitContact(result.data);
    setStatus(delivery.ok ? 'success' : 'submission-failure');
    if (delivery.ok) {
      form.reset();
    }
```

to:

```tsx
    setErrors({});
    setStatus('submitting');
    const delivery = await submitContact(result.data);
    posthog.capture('contact_form_submitted', { result: delivery.ok ? 'success' : delivery.error });
    setStatus(delivery.ok ? 'success' : 'submission-failure');
    if (delivery.ok) {
      form.reset();
    }
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `pnpm test -- ContactForm.spec.tsx`
Expected: PASS (all 3 tests, including the two extended ones)

- [ ] **Step 5: Typecheck**

Run: `pnpm typecheck`
Expected: no errors

- [ ] **Step 6: Commit**

```bash
git add src/features/home/components/contact/contactForm/ContactForm.tsx src/features/home/components/contact/contactForm/ContactForm.spec.tsx
git commit -m "feat: capture contact_form_submitted analytics event"
```

---

### Task 7: `/ingest` reverse proxy

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Implement**

Replace the full contents of `next.config.ts`:

```ts
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      { source: '/ingest/static/:path*', destination: 'https://eu-assets.i.posthog.com/static/:path*' },
      { source: '/ingest/array/:path*', destination: 'https://eu-assets.i.posthog.com/array/:path*' },
      { source: '/ingest/:path*', destination: 'https://eu.i.posthog.com/:path*' },
    ];
  },
};

export default withNextIntl(nextConfig);
```

- [ ] **Step 2: Regression-check canonical/hreflang pages**

`skipTrailingSlashRedirect: true` disables Next's automatic trailing-slash redirect site-wide, not just for `/ingest`. This project's canonical-URL/hreflang work (`feat/canonical-hreflang-alternates`) needs to be confirmed unaffected.

Run: `pnpm dev`

Then, in a browser, view source (not devtools — devtools shows the live DOM, view-source shows what was actually served) for:
- `http://localhost:3000/en`
- `http://localhost:3000/en/case-studies/<any-existing-slug>` (check `src/content/en/case-studies/` for a real slug)

Expected: both pages still have a `<link rel="canonical" href="...">` tag and `<link rel="alternate" hreflang="...">` tags for `de` and `fr`, with the same URLs as before this change (i.e., unaffected by `skipTrailingSlashRedirect`).

- [ ] **Step 3: Typecheck and build**

Run: `pnpm typecheck && pnpm build`
Expected: both succeed with no errors

- [ ] **Step 4: Commit**

```bash
git add next.config.ts
git commit -m "feat: proxy PostHog requests through /ingest to reduce ad-blocker loss"
```

---

### Task 8: Manual step — Netlify Production environment variables

**This task is for Lloyd, not the implementing agent.** It requires the Netlify dashboard, which is outside this repo and outside what an agent should touch without deploy-related approval.

- [x] In the PostHog EU Cloud project settings, copy the Project API Key (public token — safe to expose client-side) and note the EU ingest host `https://eu.i.posthog.com`.
- [x] **In the same PostHog project settings, under Web analytics, enable "Cookieless server hash mode."** Confirmed during implementation testing: `cookieless_mode: 'always'` on the client does nothing without this project-level setting also enabled — the SDK initializes fine but silently drops every event with no error. This is required for any data to appear at all, not an optional hardening step.
- [x] In Netlify → Site settings → Environment variables, add, scoped to the **Production** deploy context only:
  - `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` = the PostHog project API key
  - `NEXT_PUBLIC_POSTHOG_HOST` = `https://eu.i.posthog.com` (kept as a reference value; the app itself talks to `/ingest`, not this host directly — see Task 5)
- [ ] Confirm the variables are **not** set for Deploy Previews or Branch deploys, so non-production traffic never sends events.

---

### Task 9: Manual step — post-deploy verification with an ad-blocker

**This task is for Lloyd, not the implementing agent.** It can only happen after Task 8 is done and this branch is deployed to production (a separate approval, per `AGENTS.md`).

- [ ] Enable an ad-blocker (e.g. uBlock Origin) in a browser.
- [ ] Load the live production site.
- [ ] In the PostHog EU Cloud project's Activity / Live events view, confirm a `$pageview` event arrives for that load, coming through `/ingest` rather than being silently dropped.
- [ ] If it does not arrive, the `/ingest` rewrite (Task 7) is not reaching PostHog in production — check the deployed rewrite behaves the same as it did locally in Task 7 Step 2.

---

### Task 10: Full verification pass

**Files:** none (verification only)

- [ ] **Step 1: Run the full test suite**

Run: `pnpm test`
Expected: all tests pass, including every test added in Tasks 2, 4, and 6

- [ ] **Step 2: Run lint**

Run: `pnpm lint`
Expected: no errors

- [ ] **Step 3: Run typecheck**

Run: `pnpm typecheck`
Expected: no errors

- [ ] **Step 4: Run the production build**

Run: `pnpm build`
Expected: succeeds

- [ ] **Step 5: Report to Lloyd**

Summarize: what changed, files touched, test/lint/typecheck/build results, and that Tasks 8 and 9 (Netlify env vars, post-deploy ad-blocker check) are still outstanding, are Lloyd's to do, and require a production deployment that itself needs separate approval per `AGENTS.md`.
