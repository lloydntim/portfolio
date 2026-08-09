# Application Architecture

**Status:** Approved (v1.0)
**Scope:** The Next.js application architecture for the portfolio's first release. Documentation only. No application code, dependencies, or deployment configuration exist yet.
**Inputs:** `AGENTS.md`, `CLAUDE.md`, `specs/workflows/agentic-engineering-workflow.md`, `specs/prototype-analysis.md`.

This document does not scaffold Next.js, install dependencies, modify `reference/prototype/`, create application components, change public content, or configure deployment. All eight architecture decisions in section 21 are approved (section 2 records the two decided directly by Lloyd; section 20 explains the reasoning behind all eight). The independent Codex review's findings have been corrected (locale publication strategy, not-found explanation, preview-deployment wording, and the glossary), and this document is now approved as the architecture for scaffolding. No architecture decision blocks scaffolding; section 22 lists the later implementation and content gates that remain, none of which require restructuring anything documented here.

---

## 1. Architecture goals and non-goals

### Goals

- Reproduce the prototype in `reference/prototype/` closely and almost pixel-perfectly at the agreed reference sizes, per `AGENTS.md` section 7.
- Build a primarily pre-rendered, static-first Next.js App Router application served from Netlify's CDN, per `AGENTS.md` section 3.
- Support English, German, and French as the supported locales for a local, multilingual content model, while publishing only locales whose content is approved (section 8), per `AGENTS.md` section 4.
- Meet WCAG 2.2 AA, per `AGENTS.md` section 15, including the reduced-motion engineering requirement recorded in `specs/prototype-analysis.md` section 8.
- Keep the content layer swappable: local content now, headless WordPress later, without rewriting presentation components, per `AGENTS.md` section 3.
- Keep the codebase small, explicit, and free of speculative structure, per `AGENTS.md` section 14.

### Non-goals (for this phase)

- Headless WordPress integration (`AGENTS.md` section 3, deferred to Phase 2 of the workflow spec).
- Analytics, tracking, or monitoring of any kind (`AGENTS.md` section 27).
- A runtime Agent SDK application (workflow spec section 8; explicitly a later extension).
- Pricing or rate information anywhere in the product (`AGENTS.md` section 10).
- Final case-study content, CV files, and phone numbers: these are deferred inputs (`specs/prototype-analysis.md` section 17), not architectural concerns. See section 22.
- A final, exhaustive breakpoint specification: the prototype's six breakpoints are reference measurements, and the final responsive system still requires separate visual approval (`specs/prototype-analysis.md` decision 7).

---

## 2. Approved architecture decisions

The two decisions below were approved directly by Lloyd. They are recorded in full here and again as ADR-007 and ADR-008 in section 21, alongside six further decisions (ADR-001 to ADR-006) approved on the basis of the comparisons in section 20.

### 2.1 Contact form delivery: Netlify Forms

- A Next.js Server Action alone does not deliver or store a message. A Server Action can run server-side code, but without a destination it does nothing with the submitted data.
- Netlify Forms will receive and store version 1 submissions. Netlify's build system detects a form in the static HTML output (a `data-netlify="true"` attribute plus a hidden `form-name` input matching the form's `name`) and stores submissions server-side without any application-hosted database.
- The application exposes contact submission through its own clearly named abstraction, not by coupling `ContactForm` directly to Netlify. See `features/contact/contactDelivery.ts` in section 3's folder blueprint: a small interface (for example `submitContact(data: ContactFormData): Promise<ContactDeliveryResult>`) that a Netlify Forms implementation (`contactDelivery.netlify.ts`) satisfies.
- The Netlify implementation is replaceable later (for example by a different delivery service or a custom backend) without redesigning `ContactForm` or any other component, because every component depends on the abstraction, never on Netlify directly. This mirrors the case-study data-access seam in section 11.
- Zod validates submissions before accepted data is processed, per section 2.2. Client-side Zod validation provides immediate, accessible user feedback; it can be bypassed by anyone submitting directly to the endpoint, so it must not be described as an authoritative security boundary. Netlify Forms is the receiving and storage boundary for version 1: it is Netlify's platform, not application code, that ultimately accepts and stores the data.
- **Known version 1 limitation:** direct Netlify Forms submissions are not protected by application-controlled, server-side Zod validation. A submission that bypasses the client entirely reaches Netlify's storage without the application re-checking it. This is accepted for v1 because Netlify Forms already provides platform-level spam handling (below) and because introducing a Server Action purely to close this gap is not, on its own, currently a justified need (section 20.6).
- Netlify's spam-protection capabilities provide platform-level spam handling. A honeypot field is used initially, unless implementation-time research identifies a concrete reason to use Netlify's alternative reCAPTCHA mechanism instead.
- The following states must be supported: success, validation error, submission failure, loading (submission in progress), spam protection, and accessible presentation of every one of those states. See section 15 for how they are wired.
- The visual treatment of these states is approved during implementation, following the screenshot-and-approval process in `AGENTS.md` section 13, not by this document.
- A Server Action is only introduced on top of Netlify Forms if a concrete server-side validation or orchestration requirement is separately approved. It must never be described as the delivery mechanism itself. See section 20.6.

### 2.2 Runtime validation: Zod

- TypeScript provides compile-time type checking only; it verifies nothing at runtime once the application is running.
- Zod validates data at runtime wherever information enters the application. This includes: contact-form submissions (section 2.1), local case-study JSON content (section 10), and future WordPress API responses (section 11), which is exactly why Zod is retained for v1 even though only one of those three boundaries is active on day one.
- Validation happens at application boundaries, not scattered through presentation code. For the contact form, the boundary is where the form's data leaves the client (or a future Server Action, if one is ever approved per section 2.1). For content, the boundary is wherever a JSON file is read. For the future WordPress adapter, the boundary is the API response, validated before it is mapped onto the shared `CaseStudy` type.
- Zod schemas are reusable where appropriate (for example, a shared `contactForm.schema.ts` used by both client-side validation and any future server-side check), and TypeScript types are inferred from schemas with `z.infer<typeof schema>` where this prevents duplicated definitions, rather than a schema and a hand-written interface drifting apart.
- Invalid external content must fail safely: a development-time error that is useful for diagnosing the problem, or a user-facing error state (section 15) where the invalid data would otherwise reach a visitor, never a silent pass-through of unvalidated data or an unhandled crash.

---

## 3. Complete target folder blueprint

Folders are created only when they contain real code. The blueprint below shows representative example paths, not a directory listing to be generated speculatively.

```text
portfolio-v2/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── case-studies/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx
│   │   │   └── not-found.tsx
│   │   ├── theme.css
│   │   ├── globals.css
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   └── global-error.tsx
│   ├── proxy.ts
│   ├── features/
│   │   ├── hero/
│   │   │   ├── components/
│   │   │   │   └── hero/
│   │   │   │       ├── Hero.tsx
│   │   │   │       └── Hero.spec.tsx
│   │   │   └── index.ts
│   │   ├── about/
│   │   │   ├── components/
│   │   │   │   └── about/
│   │   │   │       └── About.tsx
│   │   │   └── index.ts
│   │   ├── expertise/
│   │   │   ├── components/
│   │   │   │   └── expertise-grid/
│   │   │   │       └── ExpertiseGrid.tsx
│   │   │   └── index.ts
│   │   ├── what-i-deliver/
│   │   │   ├── components/
│   │   │   │   └── deliver-row/
│   │   │   │       └── DeliverRow.tsx
│   │   │   └── index.ts
│   │   ├── case-studies/
│   │   │   ├── components/
│   │   │   │   ├── case-study-card/
│   │   │   │   │   ├── CaseStudyCard.tsx
│   │   │   │   │   └── CaseStudyCard.spec.tsx
│   │   │   │   └── case-study-article/
│   │   │   │       ├── CaseStudyArticle.tsx
│   │   │   │       └── CaseStudyArticle.spec.tsx
│   │   │   ├── caseStudy.schema.ts
│   │   │   ├── caseStudySource.ts
│   │   │   └── index.ts
│   │   ├── contact/
│   │   │   ├── components/
│   │   │   │   └── contact-form/
│   │   │   │       ├── ContactForm.tsx
│   │   │   │       ├── ContactForm.spec.tsx
│   │   │   │       └── index.ts
│   │   │   ├── contactDelivery.ts
│   │   │   ├── contactDelivery.netlify.ts
│   │   │   ├── contactForm.schema.ts
│   │   │   └── index.ts
│   │   └── trusted-by/
│   │       ├── components/
│   │       │   └── logo-marquee/
│   │       │       └── LogoMarquee.tsx
│   │       └── index.ts
│   ├── shared/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── button/
│   │   │   │   │   ├── Button.tsx
│   │   │   │   │   └── Button.spec.tsx
│   │   │   │   └── section-eyebrow/
│   │   │   │       └── SectionEyebrow.tsx
│   │   │   ├── layout/
│   │   │   │   └── container/
│   │   │   │       └── Container.tsx
│   │   │   └── site/
│   │   │       ├── site-navigation/
│   │   │       │   ├── SiteNavigation.tsx
│   │   │       │   └── SiteNavigation.spec.tsx
│   │   │       └── site-footer/
│   │   │           └── SiteFooter.tsx
│   │   ├── hooks/
│   │   │   ├── useReducedMotion.ts
│   │   │   └── useStickyNavigation.ts
│   │   ├── lib/
│   │   │   └── formatDate.ts
│   │   └── types/
│   │       └── locale.ts
│   ├── content/
│   │   ├── en/
│   │   │   ├── site.json
│   │   │   └── case-studies/
│   │   │       ├── vocapp.json
│   │   │       ├── vorwerk.json
│   │   │       └── guilds.json
│   │   ├── de/
│   │   │   └── ...
│   │   └── fr/
│   │       └── ...
│   └── i18n/
│       ├── routing.ts
│       ├── request.ts
│       └── navigation.ts
├── public/
│   ├── logos/
│   ├── fonts/ (only if a non-Google local font is ever added)
│   └── favicon.ico
├── reference/
│   └── prototype/ (read-only, unchanged, excluded from the deployed site)
├── tests/
│   ├── e2e/
│   ├── accessibility/
│   └── visual/
├── specs/
├── next.config.ts
├── tsconfig.json
└── package.json
```

Notable points about this blueprint:

- There is no `src/app/layout.tsx` at the root. `src/app/[locale]/layout.tsx` is the only layout that owns `<html>` and `<body>`; see section 8 for why.
- There is no `src/middleware.ts`. `src/proxy.ts` is the current Next.js 16 file convention for the same responsibility (previously named Middleware); see section 8.
- Every feature folder groups its components under a `components/` directory, each component in its own subdirectory, exactly like `shared/components` (section 5). Feature-specific schemas, hooks, helpers, and data-access files stay directly under the feature root, not inside `components/`, and are grouped into their own folder only once enough real files justify it.
- A feature root `index.ts` is a deliberate public interface, not an automatic convention; see section 7 for the rule and what it may and may not export.
- There is no `tailwind.config.ts` in this blueprint. Tailwind CSS 4 is configured CSS-first (section 13); a JavaScript config file is added later only if a specific technical need is identified and documented, and would then be loaded explicitly, not auto-detected.
- `src/i18n/routing.ts` distinguishes supported locales from published locales (section 8). Routing and static generation only produce publicly accessible routes for published locales, never for a supported-but-unapproved locale.

Only `en/` content is populated at first per `AGENTS.md` section 4 (English is authoritative and translations require approval). `de` and `fr` are supported locales from the start (their i18n configuration exists), but only `en` is a published locale (section 8) until German and French content is translated and approved. `generateStaticParams` and route resolution only produce publicly accessible pages for published locales, so `de`/`fr` are never publicly reachable before that approval, not merely excluded by convention.

---

## 4. Dependency-direction rules and feature boundaries

- `src/app` owns routing, layouts, metadata, and page composition. It may import from `src/features`, `src/shared`, `src/content`, and `src/i18n`. Page composition (assembling a route out of features) normally happens here, kept thin; it must not contain business logic.
- `src/features/*` own one portfolio capability each (home sections, case studies, contact). A feature may depend on `src/shared`, `src/content`, and `src/i18n`.
- `src/shared/*` must not contain domain-specific business behaviour. It contains only genuinely reusable code with no portfolio-specific meaning, and it must never import from `src/features` or `src/app`.
- Avoid direct feature-to-feature imports. If cross-feature access is ever genuinely needed, it must go through the depended-on feature's public interface (its root `index.ts`, section 7), never a reach into that feature's internal files. Document the interface where it is introduced. Importing a feature through its public interface must not expose another feature's internals as a side effect.
- Do not move a domain-specific component into `src/shared` merely because more than one feature happens to use it. Promotion to `shared` is justified by the component having no domain-specific meaning left, not by reuse count alone.
- Do not introduce a barrel-file convention (an `index.ts` that re-exports an entire folder's contents by default) beyond the selective, justified uses in section 7. Import from the specific file otherwise.
- `src/content` and `src/i18n` are leaf data and configuration. They do not import from `src/features`, `src/shared/components`, or `src/app`.
- `reference/prototype` is outside this dependency graph entirely. Nothing in `src` imports from it; it is a visual reference read by humans and agents, not a runtime dependency.

This gives a single allowed direction: `app -> features -> shared`, with `content` and `i18n` as data consumed from either `features` or `app`, and no feature ever importing another feature's internals without going through a documented public interface.

---

## 5. Component categories and ownership

| Category | Location | Contains | Example |
| --- | --- | --- | --- |
| UI | `shared/components/ui` | Foundational, brand-agnostic interface components with no portfolio-specific meaning | `button/Button.tsx`, `link/Link.tsx`, an `input/Input.tsx` |
| Layout | `shared/components/layout` | Structural components with no content opinions | `container/Container.tsx`, page-layout primitives |
| Site | `shared/components/site` | Reusable portfolio-specific compositions shared across routes, and generic-but-reusable compositions not tied to one feature's domain logic | `site-navigation/SiteNavigation.tsx`, `site-footer/SiteFooter.tsx`, a generic table or gallery primitive |
| Features | `features/*/components/*` | Portfolio-specific functionality and domain logic tied to one capability | `hero/components/hero/Hero.tsx`, `contact/components/contact-form/ContactForm.tsx`, `case-studies/components/case-study-article/CaseStudyArticle.tsx` |

Per the approved boundaries, `atoms`, `molecules`, `organisms`, and `patterns` are not used as folder names anywhere in this structure.

Feature components are not an exception to the component-folder convention: every component, whether in `shared/components` or inside a feature's `components/` directory, normally has its own directory, colocating its file, spec, and any component-specific subcomponents, types, or (later) stories:

```text
src/shared/components/
  ui/
    button/
      Button.tsx
      Button.spec.tsx
  layout/
    container/
      Container.tsx
  site/
    site-navigation/
      SiteNavigation.tsx
      SiteNavigation.spec.tsx

src/features/contact/
  components/
    contact-form/
      ContactForm.tsx
      ContactForm.spec.tsx
      index.ts
```

`site` deliberately covers two related but distinct things, and the distinction matters for where new code goes: portfolio-specific shared chrome that is not owned by any single feature (`SiteNavigation`, `SiteFooter`), and any genuinely generic composition (a form shell, a table, a gallery) that carries no business logic of its own. `ContactForm` is not an example of the latter: it owns contact-specific behaviour (validation, submission state, the delivery abstraction from section 2.1) and stays in `features/contact/components/contact-form`. If `ContactForm` is ever built on top of a shared, generic form-shell component with no contact-specific knowledge, that shell belongs in `shared/components/site`; the feature-specific composition around it does not move.

A component's category is decided by reusability and specificity, not visual complexity: `SectionEyebrow` (the eyebrow-label pattern identified in `specs/prototype-analysis.md` section 4) is `ui` because it carries no portfolio-specific content.

Each feature folder owns its own components, schemas, and data-access files (section 3). A feature does not reach into another feature's internals (section 4); if two features need the same piece and that piece has no domain-specific meaning, it is promoted to `shared`.

---

## 6. File and component naming conventions

- Directories use `kebab-case` (`case-studies`, `trusted-by`, `site-navigation`, `contact-form`).
- React component files use `PascalCase.tsx` (`CaseStudyCard.tsx`, `SiteNavigation.tsx`), each normally in its own `kebab-case` directory (section 5).
- Non-component TypeScript files use `camelCase.ts`, with no exceptions: `contactDelivery.ts`, `contactDelivery.netlify.ts`, `contactForm.schema.ts`, `caseStudySource.ts`, `caseStudy.schema.ts`, `formatDate.ts`.
- Hooks use the `useSomething.ts` form (`useReducedMotion.ts`, `useStickyNavigation.ts`), which is `camelCase.ts` with the `use` prefix, not a separate convention.
- Component tests use `ComponentName.spec.tsx`, colocated next to the component they test.
- Stories use `ComponentName.stories.tsx`, reserved for when Storybook is un-deferred; none are created now.
- Schemas use descriptive, `camelCase.schema.ts` names (`caseStudy.schema.ts`, `contactForm.schema.ts`), not generic names like `schema.ts` and not kebab-case (`case-study.schema.ts` is not used).
- Next.js special files retain their required framework names exactly as Next.js defines them (`layout.tsx`, `page.tsx`, `not-found.tsx`, `global-error.tsx`, `sitemap.ts`, `robots.ts`, `proxy.ts`), even where that name would not otherwise match a convention above.
- Routes use lowercase (`case-studies`, not `caseStudies`).
- Import alias: `@/*` resolves to `src/*` (section 8).

There is one alias, `@/*`; no additional aliases (`@features`, `@shared`, `@components`) are introduced unless a concrete need appears.

---

## 7. Selective index files

`index.ts` files are permitted only as deliberate public interfaces, not created automatically in every directory.

- A feature may expose its supported public interface through a feature-root `index.ts` (for example `features/contact/index.ts`), used by `src/app` and, where genuinely necessary, by other features (section 4).
- A component directory may use an `index.ts` when it provides a cleaner public import for that component (for example `features/contact/components/contact-form/index.ts` re-exporting `ContactForm`). This is added when it is useful, not by default for every component directory.
- A main component may be exported while its private subcomponents remain unexported.
- Internal implementation files use direct imports where that makes dependencies clearer, rather than importing everything through a barrel.
- Do not create a single barrel that exports every shared or application component.
- Do not mix unrelated Server and Client Component exports through a broad barrel; a barrel's exports should be coherent, not a dumping ground.
- Avoid circular dependencies; a feature-root `index.ts` importing from a component that itself imports from the feature root is a sign of one.
- Importing a feature through its public interface must not permit access to another feature's internal files. The public interface is the only supported entry point.

Example, following the contact feature's shape from section 3:

```text
src/features/contact/
  components/
    contact-form/
      ContactForm.tsx
      ContactForm.spec.tsx
      index.ts
  contactDelivery.ts
  contactDelivery.netlify.ts
  contactForm.schema.ts
  index.ts
```

The feature-root `index.ts` exports only the feature's public API, for example:

```ts
// features/contact/index.ts
export { ContactForm } from './components/contact-form';
```

so that `src/app` imports consistently through the single alias, for example:

```ts
import { ContactForm } from '@/features/contact';
```

`contactDelivery.ts`, `contactDelivery.netlify.ts`, and `contactForm.schema.ts` are not re-exported from the feature root unless something outside the feature genuinely needs them directly; today, nothing does.

---

## 8. Route, locale, and internationalization architecture

Routes live under `src/app/[locale]/...`, with `locale` constrained to `en`, `de`, and `fr` (`AGENTS.md` section 4). English is the authoritative source language.

### Supported locales versus published locales

Two related but distinct lists live in `src/i18n/routing.ts`:

- **Supported locales**: `en`, `de`, `fr`, defined via next-intl's `defineRouting`. This is the full, planned locale set; it drives message loading, the locale switcher, and which locale segments the application's i18n configuration understands.
- **Published locales**: a separate, explicitly maintained `publishedLocales` list, initially `['en']` only. This is the subset of supported locales whose content is translated and approved for public release, per `AGENTS.md` section 4.

Routing, `generateStaticParams`, and locale validation (below) are all driven by `publishedLocales`, not the full supported-locale list. A locale can be supported (the application knows how to render it once content exists) without being published (publicly reachable). Before the first production release, `en`, `de`, and `fr` must all be approved and added to `publishedLocales`; until then, only `en` is published, and `de`/`fr` remain supported-but-unpublished.

This section documents the current Next.js 16 and next-intl architecture for that requirement. Both `next/root-params` (stable without an experimental flag as of Next.js 16.3, per Next.js's own changelog and documentation) and next-intl's corresponding support for it (added in next-intl 4.13.5, which deprecated the older `setRequestLocale` approach) are very recently stabilized. Before scaffolding installs any package, `AGENTS.md` section 2's standing instruction to verify current tool and dependency guidance applies here specifically: confirm the exact current stable Next.js release (targeting Next.js 16, minimum 16.3 for non-experimental `next/root-params`) and the exact current next-intl release against their own release notes at that time, not against the versions cited in this document.

### Locale resolution without `setRequestLocale`

- `src/i18n/routing.ts` defines the supported locales and default locale via next-intl's `defineRouting`, unchanged in shape from before.
- `src/i18n/request.ts` reads the locale using `next/root-params`'s generated getter for the `[locale]` segment (for example `rootParams.locale()`) and validates it against `publishedLocales`, not the full supported-locale list, calling Next.js's `notFound()` when it does not match a published locale. This means a supported-but-unpublished locale (for example `de` before German is approved) is rejected exactly like an invalid locale, rather than trusting an unvalidated or merely-supported route parameter:

  ```ts
  // src/i18n/request.ts
  import * as rootParams from 'next/root-params';
  import { getRequestConfig } from 'next-intl/server';
  import { notFound } from 'next/navigation';
  import { publishedLocales } from './routing';

  export default getRequestConfig(async () => {
    const paramValue = await rootParams.locale();
    if (!publishedLocales.includes(paramValue as (typeof publishedLocales)[number])) {
      notFound();
    }
    return { locale: paramValue };
  });
  ```

- The legacy `setRequestLocale` call (previously invoked per-page to opt in to static rendering) is not used. Per next-intl's own migration guidance, it is no longer required for static rendering once `next/root-params` is in use, and is deprecated.
- `src/i18n/navigation.ts` continues to export next-intl's locale-aware `Link`, `redirect`, `usePathname`, and `useRouter`, wrapped for this project's configured locales. Application code never hard-codes a locale-aware URL by hand; it always goes through these typed helpers, so a locale prefix or a future localized pathname (below) is never duplicated or gotten wrong in more than one place.

### Static generation

- `src/app/[locale]/layout.tsx` calls `generateStaticParams`, returning only the currently published locales (`publishedLocales`, above), not the full supported-locale list. This is a standard Next.js App Router API, independent of the `setRequestLocale`/`next/root-params` change above. Only published locales are statically generated and therefore publicly reachable at build time; `de` and `fr` are not pre-rendered, and are not publicly accessible routes, until they are added to `publishedLocales` (section 3), consistent with `AGENTS.md` section 3's requirement to avoid unnecessary per-request rendering.
- The layout also sets `export const dynamicParams = false`, so a locale segment outside `publishedLocales` (for example `/de/...` before German is published) is not rendered on demand either. It resolves to not-found (below), the same as a genuinely invalid locale. This is what actually prevents an unapproved locale's content from being publicly accessible; it is enforced by the routing configuration, not left as a documentation-only convention.

### The root layout and document language

- `src/app/[locale]/layout.tsx` is the only layout that owns `<html>` and `<body>`, setting `lang` from the validated locale read via `next/root-params`:

  ```tsx
  // src/app/[locale]/layout.tsx
  import { locale } from 'next/root-params';

  export default async function RootLayout({ children }: { children: React.ReactNode }) {
    return (
      <html lang={await locale()}>
        <body>{children}</body>
      </html>
    );
  }
  ```

- There is no separate `src/app/layout.tsx` above it (section 3). Keeping one would either duplicate the `<html>`/`<body>` tags (invalid) or force a hard-coded, non-locale-aware `lang` attribute at the true root, which would prevent the document language from ever being set correctly per locale. Removing it is not a stylistic choice; it is required for correct `lang` behaviour once locale is only known one segment down.
- `src/app/global-error.tsx` is a Next.js special case that is exempt from this: per Next.js's own convention, a global error boundary supplies its own `<html>` and `<body>` because it can be triggered above the normal layout tree. It is not in conflict with there being no root `layout.tsx`.

### Root request redirect

The root `/` request is redirected to the default locale through `src/proxy.ts` (the current Next.js 16 name for what was previously `middleware.ts`; the underlying capability is unchanged), which wraps next-intl's own routing handler:

```ts
// src/proxy.ts
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)',
};
```

This is next-intl's documented approach, current as of its own example App Router project. On a first visit to `/`, it redirects based on the `Accept-Language` header (falling back to the default locale, `en`); on return visits it honours a cookie recording the visitor's chosen locale, so a visitor who switched to `de` is not redirected back to `en`. This is not a manual `redirect()` call written by this application; it is next-intl's routing handler applied to the incoming request before it reaches `src/app`.

### Not-found handling

Three distinct situations exist, and they are handled differently:

- **Known-locale missing content** (for example a case-study slug that does not exist): a route calls Next.js's `notFound()` from inside `src/app/[locale]/...`, which renders `src/app/[locale]/not-found.tsx`. This stays inside the already-validated locale, so it can be fully localized, use the correct `lang`, and link back to that locale's own home page.
- **Invalid locale segment** (for example `/xx/...`, where `xx` is not `en`, `de`, or `fr`): caught by the `hasLocale` check in `src/i18n/request.ts` above, which also calls `notFound()`. This is deliberately the same mechanism as the previous case; an invalid locale is treated as missing content within the attempted route, not as a special case requiring separate handling.
- **Genuinely unmatched paths** that do not resolve to the `[locale]` segment pattern at all: these fall through to Next.js's default synthetic not-found handling. This application's root layout does use a top-level dynamic `[locale]` segment, which is in fact one of the scenarios Next.js's experimental `global-not-found.tsx` file is documented to address. Version 1 intentionally defers adopting it anyway: it requires enabling `experimental.globalNotFound` in `next.config.ts`, and Next.js's default synthetic not-found handling is sufficient for this rare case without opting into an experimental feature this early. Known-locale missing content is unaffected by this deferral and continues to use the locale-aware `src/app/[locale]/not-found.tsx` described above. Adopting `global-not-found.tsx` for a branded top-level 404 remains available later as a separately justified and approved addition, not a limitation of this architecture.

Because this interaction between `next/root-params`, `proxy.ts`, and not-found rendering is new enough that both Next.js and next-intl stabilized their support for it very recently, it is called out here as an implementation-time verification point (section 22), not asserted as tested behaviour.

### Localized pathnames (future)

Representative routes today use one canonical, English-structured path per page (for example `/[locale]/case-studies/[slug]`), not translated path segments. If localized public pathnames are introduced later (for example `/de/kontakt` instead of `/de/contact`), next-intl's `pathnames` routing configuration provides the per-locale aliases while the canonical internal route definition stays single-sourced in `src/i18n/routing.ts`; the exact translated URL wording is content and translation territory requiring approval (`AGENTS.md` section 4), not an architecture decision made by this document.

### Scaffolding versus first production release

These are two different milestones and this architecture treats them differently:

- English may be implemented first during development. This is expected and does not block scaffolding.
- German and French may be prepared as supported locales as part of the i18n architecture during scaffolding (locale routing and messages wired, `de`/`fr` recognised by `next-intl`'s routing configuration) without their content existing yet, but they are not added to `publishedLocales`, so no `de`/`fr` route is statically generated or publicly reachable (above).
- Empty, placeholder, or incomplete locale routes must not be publicly released. A locale existing in the supported-locale configuration is not the same as that locale being published; only `publishedLocales` controls what is publicly reachable, per the static-generation and validation behaviour above.
- English, German, and French content must all be reviewed and approved, and each locale added to `publishedLocales`, before the first production release, not before scaffolding. Translations must preserve the meaning of the approved English source, per `AGENTS.md` section 4, rather than following it literally.
- Translation review supports a side-by-side comparison (content identifier, English source, translated content, language, review status, reviewer notes), per `AGENTS.md` section 4.
- German requires particular review attention for tone, meaning, and suitability for the DACH market, per `AGENTS.md` section 4.

Locale-aware navigation, metadata (`hreflang`, canonical URLs), and language selection are required by `AGENTS.md` section 18 and the workflow spec's initial quality targets; these are implemented against `next-intl` as described above (section 20.3).

---

## 9. Local content organization

`src/content` holds local, multilingual content for the first release (`AGENTS.md` section 3), organized by locale first and by content area second:

```text
src/content/
├── en/
│   ├── site.json          (nav labels, hero copy, about bio, expertise cards, contact copy)
│   └── case-studies/
│       ├── vocapp.json
│       ├── vorwerk.json
│       └── guilds.json
├── de/
│   └── ... (same shape, populated once translated and approved; see section 8)
└── fr/
    └── ... (same shape, populated once translated and approved; see section 8)
```

Content is read by `features/*` modules (for example `features/case-studies` reads `content/<locale>/case-studies/*.json`) and never by `shared` components, consistent with the dependency-direction rules in section 4.

Bio, positioning, employer and client names, and logos already approved in `specs/prototype-analysis.md` decision 4 can be carried into `en/site.json` directly. Case-study narrative content is not carried over; see section 10. A locale's content existing here is not sufficient for it to be publicly reachable; it must also be added to `publishedLocales` (section 8).

---

## 10. Case-study content model

The approved case studies and order are:

1. VocApp (a vocabulary application developed for AnzaKen)
2. Vorwerk
3. Guilds

None of the prototype's existing "AnzaKen" case-study narrative (role, timeline, stack, stats, quote) is approved VocApp content, per `specs/prototype-analysis.md` sections 2 and 3. The `#anzaken` markup structure may still be reused as a template; the facts inside it may not.

Per the Zod decision (section 2.2), the shape every case study must satisfy is defined as a Zod schema, not a plain TypeScript interface, with the type inferred from it:

```ts
// features/case-studies/caseStudy.schema.ts
import { z } from 'zod';

export const caseStudySchema = z.object({
  slug: z.enum(['vocapp', 'vorwerk', 'guilds']),
  order: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  title: z.string(),
  summary: z.string(),
  role: z.string(),
  timeline: z.string(),
  stack: z.array(z.string()),
  challenge: z.string(),
  approach: z.string(),
  outcome: z.string(),
  quote: z.object({ text: z.string(), attribution: z.string().optional() }).optional(),
  stats: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
  coverImage: z.object({ src: z.string(), alt: z.string() }),
});

export type CaseStudy = z.infer<typeof caseStudySchema>;
```

Local JSON content is parsed with `caseStudySchema` at the point it is read (section 11), so a malformed content file fails safely with a useful development-time error rather than reaching a page with missing or wrong-shaped data.

Until approved content exists for a given case study, its content file contains clearly identified development placeholders, per `AGENTS.md` section 11 ("clearly identified development placeholders that cannot be mistaken for confirmed professional claims"), not invented facts. The layout and project identity may be implemented ahead of final copy; see section 22 for tracking when the real content becomes available.

---

## 11. Future headless WordPress adapter boundary

`AGENTS.md` section 3 requires that local case-study data can be replaced by headless WordPress later without rewriting presentation components. This is achieved with a single data-access seam:

```ts
// features/case-studies/caseStudySource.ts
export async function getCaseStudy(slug: string, locale: Locale): Promise<CaseStudy> { ... }
export async function getAllCaseStudies(locale: Locale): Promise<CaseStudy[]> { ... }
```

`CaseStudyArticle` and `CaseStudyCard` call `getCaseStudy` / `getAllCaseStudies` and never read `src/content` directly. The first-release implementation reads local JSON, validated against `caseStudySchema` (section 10) as it is read. The Phase 2 implementation (per the workflow spec's Phase 2: Headless content management) calls the WordPress API instead, validates the response against the same `caseStudySchema` at that boundary per the Zod decision (section 2.2), and maps it onto the same `CaseStudy` type. Only `caseStudySource.ts` changes; every component built against `CaseStudy` is unaffected, and both implementations share one runtime guarantee about what shape the data is in.

---

## 12. Server and Client Component boundaries

Server Components are the default everywhere, per `AGENTS.md` section 3. A component becomes a Client Component only where interaction or a browser API is required:

| Component | Reason it is a Client Component |
| --- | --- |
| `SiteNavigation` (mobile toggle and the approved sticky-on-scroll behaviour, `specs/prototype-analysis.md` decision 8) | Reads scroll position, toggles open/closed state |
| Intro-sequence skip control (`specs/prototype-analysis.md` decision 9) | Listens for click/keyboard input, and for JavaScript-controlled timing that cannot be handled through CSS alone (section 17) |
| `ContactForm` | Manages loading/success/validation-error/submission-failure state (section 15) |
| Language switcher | Reads and sets the active locale route via `src/i18n/navigation.ts` (section 8) |

Note that `next/root-params` (section 8) is itself only usable in Server Components; it is not an option for any Client Component's locale awareness, which continues to come from next-intl's client-side hooks where needed.

Everything else, including the hero's static layers, the about/expertise/deliver sections, the case-study article, and the logo marquee's CSS-driven animation, renders as a Server Component. The marquee's hover pause and crossfade are pure CSS and do not require client-side JavaScript.

---

## 13. Tailwind theme and design-token organization

Tailwind CSS 4 uses CSS-first configuration. Per official Tailwind documentation, theme variables are declared with an `@theme` block in a CSS file after `@import "tailwindcss";`; a JavaScript configuration file is no longer auto-detected and, if one is ever genuinely needed (for example a legacy plugin with no CSS-first equivalent), it is loaded explicitly with `@config "./tailwind.config.js";` rather than assumed by default.

- `src/app/theme.css` (imported from `src/app/globals.css`, which is in turn imported from `src/app/[locale]/layout.tsx` per section 8) declares the design tokens measured in `specs/prototype-analysis.md` sections 5 and 6 as CSS custom properties inside `@theme`: the colour palette (dark backgrounds, light backgrounds, accent/mid-tone/muted reds, body text colours), the Montserrat/Roboto/Open Sans font families, the type scale (including the fluid `clamp()`-based values already used for headings), the spacing scale, sizing values, breakpoints, border values, shadow values, and motion/timing values (durations and easings used by the keyframes in section 17).
- The prototype remains the visual source of truth for every one of those tokens; this section organizes where they live, not what their values are.
- Breakpoints are configured from the prototype's six observed values (500, 560, 700, 1024, 1280, 1600), treated as reference measurements pending the final approval required by `specs/prototype-analysis.md` decision 7, not as a permanently fixed set.
- `src/app/globals.css` holds resets, `next/font` wiring, and any keyframes that are simplest to express outside Tailwind's utility classes (for example `kenBurns`, `marquee`, `introHold`, `logoPop`).
- CSS Modules are used only when technically justified, per `AGENTS.md` section 9. The candidates identified during the prototype analysis are the intro-sequence choreography and the Ken Burns/marquee animations, where multiple coordinated keyframes and pseudo-elements are clearer in a scoped stylesheet than in a long Tailwind class list. Each use is justified individually at implementation time, not assumed here.
- No `tailwind.config.ts` exists in the folder blueprint (section 3) unless a specific technical need is identified and documented at the time it arises.

---

## 14. Asset organization

`public/` contains only deployable static assets, per the approved boundary. Representative contents: `favicon.ico`, `logos/*.svg` (the trusted-by marquee logos, unchanged from the prototype), and optimized image sources for the hero, portrait, and contact background.

Two asset issues carried over from `specs/prototype-analysis.md` sections 5, 11, and 16 are asset-organization concerns, not architecture decisions:

- `hero.jpg` (1.8 MB at 1535x1024) needs recompression or a WebP/AVIF re-encode before it is placed in `public/`. This does not change its visual appearance.
- `portrait.jpg` (163x195px) is a pending replacement asset (decision 6); the current file is not fit to ship at production resolution.

`next/image` is used for raster photographs and other assets that benefit from optimisation: the hero, portrait, contact background, and case-study cover images. Each of these is given appropriate dimensions (explicit `width`/`height`, or `fill` with `sizes`), responsive sizing, and meaningful alternative text, directly closing the CLS risk noted in `specs/prototype-analysis.md` section 11. Where an image genuinely needs preloading, current `next/image` guidance is followed: the `preload` prop, used only for the actual LCP candidate (most likely the hero or portrait), not applied broadly.

SVG logos (the trusted-by marquee) retain their vector format. They are not run through `next/image`'s raster optimisation pipeline: a plain `<img>` element (or another justified method) with explicit dimensions and accessible alternative text is used instead. `next/image` and SVG logos are not implied to receive the same optimisation benefit; they are different kinds of asset with different handling.

Fonts are not placed in `public/fonts` unless a non-Google local font is ever introduced; see section 20.1's font decision.

---

## 15. Contact form and user-facing error handling

`AGENTS.md` section 13 requires handling: invalid or incomplete input, submission in progress, successful submission, failed submission, network failure, retry, an alternative direct-contact fallback, missing pages, and unexpected application errors. Section 2.1's approved decision fixes how submissions are delivered; this section wires that decision into the required states.

- **Delivery:** `ContactForm` calls the `contactDelivery.ts` abstraction (section 2.1), never Netlify directly. The first-release implementation (`contactDelivery.netlify.ts`) submits to Netlify Forms using its documented pattern: a form marked `data-netlify="true"` with a hidden `form-name` input, submitted either as a native POST or, for a single-page-style submission without a full navigation, an AJAX `fetch` to `/` with a URL-encoded body (Netlify Forms does not accept JSON).
- **Validation:** `features/contact/contactForm.schema.ts` is a Zod schema (section 2.2), validated on the client for immediate, accessible feedback. As section 2.1 states, this client-side check is not an authoritative security boundary; Netlify Forms is what actually receives and stores the data, with the known v1 limitation recorded there. This replaces the prototype's `required`-only validation and its placeholder-as-label pattern (`specs/prototype-analysis.md` section 9), adding real `<label>` elements per the production-improvement bucket in that document.
- **States:** `ContactForm` (a Client Component, section 12) tracks `idle | submitting | success | validation-error | submission-failure` locally and renders the corresponding state, replacing the prototype's synchronous `alert()` stub. Each state is presented accessibly (announced to assistive technology, not conveyed by colour or icon alone).
- **Spam protection:** a honeypot field (a hidden input with the `netlify-honeypot` attribute on the form) is used initially, per section 2.1; Netlify's alternative reCAPTCHA (`data-netlify-recaptcha="true"`) is adopted instead only if implementation-time research identifies a concrete reason to prefer it. The honeypot field is hidden using an accessible off-screen technique, not merely `display:none`, and is excluded from the tab order without breaking the visible form's label associations (section 17).
- **Alternative direct contact:** the approved email address and, once supplied, the phone numbers (deferred inputs, section 22) remain visible near the form as a fallback that does not depend on the form working.
- **Missing pages:** `src/app/[locale]/not-found.tsx` (section 8), an approved design extension per `specs/prototype-analysis.md` classification bucket 3, matching the prototype's visual language.
- **Unexpected application errors:** `src/app/global-error.tsx`, following `AGENTS.md` section 13's rule that production errors must not expose stack traces, secrets, internal paths, infrastructure details, or form contents.

All error-state and success-state designs require the screenshot-and-approval process defined in `AGENTS.md` section 13 before being considered final; this document only establishes where they live and how they are wired, not their final visual design.

---

## 16. Testing architecture

Per the approved boundary, component tests are colocated (`ComponentName.spec.tsx` next to `ComponentName.tsx`); end-to-end, accessibility, and visual tests live under the root `tests/` directory (`tests/e2e`, `tests/accessibility`, `tests/visual`).

Mapped against `AGENTS.md` section 19's required test types:

| Requirement | Location | Tooling |
| --- | --- | --- |
| Unit tests (locale/route helpers, content validation, metadata generation) | Colocated with the module under test (`src/i18n/routing.spec.ts`, `src/features/case-studies/caseStudy.schema.spec.ts`) | Vitest, see section 20.4 |
| Component/interaction tests (mobile nav, language selection, contact functionality, form validation, keyboard behaviour, error/success states) | Colocated (`SiteNavigation.spec.tsx`, `ContactForm.spec.tsx`) | Vitest + React Testing Library |
| End-to-end journeys (homepage, every case study, language switch, mobile menu, contact, CV download, page-load checks) | `tests/e2e` | Playwright |
| Accessibility checks | `tests/accessibility` | Playwright + axe-core |
| Visual comparison | `tests/visual` | Playwright screenshot assertions, see section 20.5 |

`ContactForm.spec.tsx` tests against the `contactDelivery.ts` abstraction (mocked), not against the live Netlify Forms endpoint, keeping component tests fast and independent of network access. A small number of `tests/e2e` cases may exercise the real Netlify Forms integration against a preview deployment where useful, separately from the component-level suite.

---

## 17. Accessibility and visual-regression approach

The target is WCAG 2.2 AA (`AGENTS.md` section 15). Automated checks do not replace manual review, per the same section.

- **Automated accessibility scanning:** Playwright's official accessibility-testing pattern pairs the test runner with the `axe-core` engine (via its dedicated Playwright integration) to scan rendered pages for automatically detectable violations, run from `tests/accessibility` against representative routes and states (including the contact form's error/success states and the mobile nav open state).
- **Manual review:** keyboard-only navigation, focus order, and zoom checks, as required by `AGENTS.md` section 19's pre-push checklist; automated scanning cannot verify these.
- **Honeypot accessibility:** the honeypot field (section 15) is hidden with an off-screen technique (for example an absolutely positioned, zero-size, non-scrolling utility class) rather than `display:none`, and is marked so it is not reachable by keyboard tab order, without disturbing the labels or tab order of the real fields around it.
- **Reduced motion, corrected approach:** CSS-driven behaviour uses the CSS `@media (prefers-reduced-motion: reduce)` query directly, not JavaScript. This covers the Ken Burns animation, the logo marquee, CSS transitions (including the sticky-navigation and mobile-navigation transitions), scroll indicators, and every other purely CSS-driven animation identified in `specs/prototype-analysis.md` section 8. Inside that media query, non-essential animation is disabled or substantially reduced while content visibility is preserved (an element that fades in still ends up visible; it simply does not animate the entrance). The shared `useReducedMotion` hook (reading `window.matchMedia('(prefers-reduced-motion: reduce)')`) is used only for JavaScript-controlled behaviour that cannot be handled through CSS alone: the intro sequence's timed sequencing and skip control, and any other JavaScript-driven timing. It is not described as the single source of truth for Server Components or CSS-only animations, since it cannot run in a Server Component and CSS-only animations do not need it. Playwright's `animations: 'disabled'` screenshot option (used in visual tests so infinite CSS animations like Ken Burns and the marquee do not make baselines flaky) is a visual-testing convenience only; it does not replace the actual reduced-motion implementation described above.
- **Visual regression:** see section 20.5 for the recommendation this project adopted (Playwright's built-in `toHaveScreenshot`).

---

## 18. Netlify deployment approach

Deployment uses Netlify's automatically managed Next.js Runtime (OpenNext-based). Per Netlify's current documentation, this works with no additional configuration on a Netlify build; there is no requirement to install or pin `@netlify/plugin-nextjs` for the first release. The project retains the standard, supported Next.js build output (no `output: 'export'` or other custom output) unless a documented requirement makes a custom output necessary later. A specific plugin version is pinned only if a documented compatibility problem requires it, not by default.

The deployment flow follows `AGENTS.md` section 26: implement locally, run required checks, create local commits, request approval to push. Once pushed, a Netlify preview deployment may run automatically; reviewing that preview does not require separate approval, but promoting the result to production is a separate, explicit approval step. This document does not configure `netlify.toml` or any build settings; that is implementation work gated on scaffolding approval.

---

## 19. Deferred analytics and monitoring

Per `AGENTS.md` section 27, the following are planned for later releases and are out of scope for this architecture and for v1:

- Analytics
- Interaction and conversion tracking
- Centralized error monitoring
- Centralized frontend and backend logs
- Automated uptime monitoring
- Production performance monitoring

No analytics or monitoring SDK is installed, configured, or referenced anywhere in the folder blueprint (section 3), the Client Component list (section 12), or the dependency policy this architecture assumes. Per `AGENTS.md` section 22, introducing any of the items above requires separate, explicit approval; this document does not grant it. The `global-error.tsx` handler described in section 15 logs nothing beyond what the Next.js default error boundary already does, and exposes none of the details `AGENTS.md` section 13 prohibits (stack traces, secrets, internal paths, infrastructure details, form contents). Netlify Forms' own submission storage (section 2.1) is not analytics or tracking; it is the approved delivery mechanism for a feature the site already requires.

---

## 20. Technical decision rationale

Each item below records the comparison of reasonable alternatives that led to an approved decision (section 21), and states what official documentation was checked. Nothing in this section is still pending; it explains the reasoning behind decisions already approved.

### 20.1 Font loading: `next/font/google`

**Alternatives considered:** (a) keep the prototype's `<link>` to `fonts.googleapis.com`/`fonts.gstatic.com`, (b) `next/font/google`, (c) download the font files once and self-host manually via `next/font/local`.

**Decision:** `next/font/google`, importing Montserrat, Roboto, and Open Sans directly in the root layout.

**Why:** Next.js's font documentation states that `next/font/google` downloads the font files at build time and self-hosts them alongside the rest of the static assets, so no requests are sent to Google by the browser at runtime. This directly resolves the render-blocking external font request flagged as a performance risk in `specs/prototype-analysis.md` section 11, with no manual asset management: option (c) would achieve the same runtime result but requires manually sourcing, licensing-checking, and maintaining the font files, which `next/font/google` already does automatically for any Google Font. Option (a), the prototype's current approach, is the one being replaced.

### 20.2 Image handling: `next/image` for raster assets only

**Alternatives considered:** (a) plain `<img>` tags for everything as in the prototype, (b) `next/image` for raster photographs with plain `<img>` retained for SVG logos.

**Decision:** (b), as documented in section 14.

**Why:** Next.js's image documentation confirms `next/image` reads files from `public/` by relative path, generates a responsive `srcset` from the `sizes` prop, and exposes a `preload` flag for the genuine LCP candidate. This closes three findings from `specs/prototype-analysis.md` at once: the missing explicit width/height (CLS risk, section 11), the oversized `hero.jpg` (resizing happens automatically per requested size, on top of the separate recompression noted in section 14), and gives an explicit mechanism (`preload`) for whichever of the hero or portrait is the actual LCP element. SVG logos are excluded from this because they are already resolution-independent vector assets; running them through the raster optimisation pipeline provides no benefit and is not implied anywhere in this document.

### 20.3 Localization routing: `next-intl`

**Alternatives considered:** (a) a hand-rolled `[locale]` segment with custom middleware/proxy and a bespoke translation loader, (b) `next-intl`.

**Decision:** `next-intl`, using its current `next/root-params`-based architecture (section 8).

**Why:** The Next.js App Router has no built-in i18n router (that mechanism was Pages-Router-only), so this needs a library or custom code either way. next-intl's own documentation and example App Router project show the exact `defineRouting`, `src/proxy.ts`, and `next/root-params` integration this project adopts (section 8), current as of next-intl 4.13.5. Building the equivalent locale negotiation, static-rendering compatibility, and type-safe message handling by hand would duplicate a well-maintained library for no architectural benefit at this project's scale.

### 20.4 Component/unit test runner: Vitest

**Alternatives considered:** (a) Jest (via Next.js's `next/jest` config helper), (b) Vitest with React Testing Library.

**Decision:** Vitest with React Testing Library.

**Why:** Next.js documents official first-party guides for both, so both are current, supported choices, not a case of one being outdated. The Vitest guide's example test (rendering a page and asserting on a heading with `@testing-library/react`) is a direct match for the component and route-level tests this project needs. Jest's guide requires an explicit manual mock for `next/font` imports to keep tests running; Vitest's native ESM support and generally faster watch-mode startup make it a better fit for a small, single-maintainer codebase where iteration speed matters more than Jest's longer ecosystem history.

### 20.5 Visual regression: Playwright's built-in screenshot comparison

**Alternatives considered:** (a) a third-party visual-testing service (for example a hosted screenshot-diffing product), (b) Playwright's built-in `toHaveScreenshot` assertion.

**Decision:** Playwright's built-in comparison.

**Why:** Playwright's own documentation shows `expect(locator).toHaveScreenshot()` and `expect(page).toHaveScreenshot()` with a configurable `maxDiffPixels` threshold, and specifically documents an `animations: 'disabled'` mode that freezes even infinite CSS animations so repeated screenshots are stable, which directly addresses the Ken Burns and marquee animations identified in the prototype analysis (and is a visual-testing convenience only, not the reduced-motion implementation itself; section 17). Storybook is deferred per the approved boundaries, which removes the main reason a third-party visual-testing service would usually be introduced. Since Playwright is already the mandated tool for end-to-end and accessibility testing (`AGENTS.md` section 19), using its built-in comparison avoids a second toolchain, a second account/service, and a second CI integration for a single-maintainer project's first release.

### 20.6 Whether to add a Server Action on top of Netlify Forms

**Note:** the delivery mechanism itself was decided directly by Lloyd (section 2.1: Netlify Forms). This is implementation guidance under that decision, not a separate ADR.

**Alternatives considered:** (a) `ContactForm` submits directly via the client-side `fetch` pattern Netlify's own documentation shows (URL-encoded POST to `/`), with Zod validation on the client only, (b) add a Next.js Server Action that re-validates with the same Zod schema server-side and then forwards to Netlify Forms, for defence-in-depth or any future orchestration need.

**Current guidance:** start with (a), the direct client-side submission through the `contactDelivery.ts` abstraction, and add (b) only if a concrete, separately approved server-side validation or orchestration requirement appears (section 2.1).

**Why:** Netlify's own documented integration pattern for JavaScript frameworks is the direct client-side `fetch` submission; it requires no additional server-side code to work correctly, and the abstraction in section 2.1 already isolates `ContactForm` from the delivery detail, so adding a Server Action later is a change inside `contactDelivery.ts`'s implementation, not a redesign of the form. Introducing a Server Action now, with no concrete need yet identified, would add a code path purely on the basis that Server Actions exist, which section 2.1 explicitly treats as insufficient justification on its own.

---

## 21. Architecture decision records

Recorded in the format required by `AGENTS.md` section 24. All eight decisions below are approved.

### ADR-001: Font loading via `next/font/google`

- **Context:** The prototype loads Montserrat, Roboto, and Open Sans from a render-blocking Google Fonts `<link>` (`specs/prototype-analysis.md` section 11).
- **Decision:** Use `next/font/google` for all three families.
- **Alternatives considered:** Keep the CDN `<link>`; manually self-host via `next/font/local`.
- **Reasoning:** `next/font/google` self-hosts automatically at build time with no manual asset management (section 20.1).
- **Consequences:** No runtime request to Google; fonts ship from the same origin as the deployment.
- **Status:** Approved.
- **Date:** 2026-08-09.

### ADR-002: Image handling via `next/image` for raster assets, plain `<img>` for SVG logos

- **Context:** The prototype uses plain `<img>` tags with no explicit dimensions (CLS risk) and an oversized hero image (section 20.2).
- **Decision:** Use `next/image` for the hero, portrait, contact background, and case-study cover images, with `preload` reserved for the genuine LCP candidate; keep SVG logos as plain `<img>` with explicit dimensions and alt text.
- **Alternatives considered:** Plain `<img>` tags with manually set dimensions for everything; running SVG logos through `next/image` as well.
- **Reasoning:** Built-in responsive `srcset` and enforced explicit sizing for raster assets; SVGs are already resolution-independent and gain nothing from raster optimisation.
- **Consequences:** Requires the Netlify Next.js Runtime (see ADR-004) to retain image optimization for raster assets.
- **Status:** Approved.
- **Date:** 2026-08-09.

### ADR-003: Localization routing via `next-intl`

- **Context:** The Next.js App Router has no built-in i18n router; the site needs `en`/`de`/`fr` routing with static rendering (section 20.3).
- **Decision:** Use `next-intl`, with its current `next/root-params`-based architecture described in section 8.
- **Alternatives considered:** A hand-rolled `[locale]` segment and custom proxy.
- **Reasoning:** Avoids duplicating a well-maintained library; documented compatibility with static rendering and the current Next.js 16 `next/root-params` API.
- **Consequences:** Adds one dependency; locale messages and routing config live in `src/i18n`, including the `publishedLocales` list that gates which supported locales are publicly reachable (section 8); the exact installed versions of Next.js and next-intl must be verified at scaffolding time given how recently this architecture stabilized (section 8).
- **Status:** Approved.
- **Date:** 2026-08-09.

### ADR-004: Deployment via Netlify's automatically managed Next.js Runtime

- **Context:** `AGENTS.md` section 3 requires a primarily pre-rendered, CDN-served first release (section 18).
- **Decision:** Use Netlify's automatically managed Next.js Runtime with the standard Next.js build output; do not install or pin `@netlify/plugin-nextjs` unless a documented compatibility problem requires it.
- **Alternatives considered:** `output: 'export'` static export; manually installing and pinning the Runtime plugin from the start.
- **Reasoning:** Netlify's current documentation states the Runtime works with no additional configuration on a Netlify build; it prefers static/CDN serving while keeping `next/image` optimization and `next-intl`'s static-rendering features, both of which static export would constrain.
- **Consequences:** Netlify builds depend on Netlify's managed Runtime rather than a project-pinned plugin version; a small serverless function exists for any non-static request.
- **Status:** Approved.
- **Date:** 2026-08-09.

### ADR-005: Component/unit testing via Vitest and React Testing Library

- **Context:** `AGENTS.md` section 19 mandates Playwright and axe-core for browser/accessibility testing but leaves the unit/component runner open (section 20.4).
- **Decision:** Use Vitest with React Testing Library.
- **Alternatives considered:** Jest via `next/jest`.
- **Reasoning:** Both are officially documented by Next.js; Vitest's faster watch mode suits a small, single-maintainer codebase.
- **Consequences:** Test files use Vitest's API (`vitest`, not `jest`), colocated per section 6's naming convention.
- **Status:** Approved.
- **Date:** 2026-08-09.

### ADR-006: Visual regression via Playwright's screenshot comparison

- **Context:** Storybook is deferred, and a visual-regression method is still needed to enforce the pixel-closeness requirement in `AGENTS.md` section 7 (section 20.5).
- **Decision:** Use Playwright's `toHaveScreenshot` with `animations: 'disabled'` for animated sections.
- **Alternatives considered:** A third-party hosted visual-testing service.
- **Reasoning:** Reuses the already-mandated Playwright toolchain; avoids a second service/account for a single-maintainer first release.
- **Consequences:** Screenshot baselines are committed to the repository and updated deliberately when a visual change is approved.
- **Status:** Approved.
- **Date:** 2026-08-09.

### ADR-007: Contact form delivery via Netlify Forms

- **Context:** The contact-form implementation approach was an explicitly open decision in the workflow spec (`specs/workflows/agentic-engineering-workflow.md` section 14). A Server Action alone does not deliver or store a submission.
- **Decision:** Use Netlify Forms as the version 1 delivery and storage mechanism, accessed only through a named `contactDelivery.ts` abstraction (section 2.1) so the implementation is replaceable later. A honeypot is the initial spam-protection mechanism.
- **Alternatives considered:** A Netlify Function called from the client; a Next.js Server Action treated as the delivery mechanism itself; Netlify's reCAPTCHA as the initial spam mechanism.
- **Reasoning:** Netlify Forms requires no application-hosted backend or database for v1; the abstraction keeps `ContactForm` and other components decoupled from the specific delivery choice, matching the pattern already used for the case-study data source (section 11).
- **Consequences:** The static HTML output must include the form markup Netlify's build-time detection requires (`data-netlify="true"` and a hidden `form-name` input); submissions are stored in Netlify's own forms dashboard, not in application-controlled storage; direct submissions are not protected by application-controlled server-side validation in v1 (section 2.1's recorded limitation).
- **Status:** Approved.
- **Date:** 2026-08-09.

### ADR-008: Runtime validation via Zod

- **Context:** TypeScript only checks types at compile time; the application accepts data at runtime from a user-submitted form, local content files, and (later) an external API (section 2.2).
- **Decision:** Use Zod at every point where information enters the application: contact-form submissions, local case-study JSON content, and future WordPress API responses.
- **Alternatives considered:** No runtime validation beyond TypeScript's compile-time types; a different runtime validation library.
- **Reasoning:** Zod schemas are reusable and TypeScript types can be inferred from them (`z.infer`), avoiding duplicated type definitions between a schema and a hand-written interface; it serves three distinct boundaries with one library rather than three.
- **Consequences:** Adds one dependency; every content and submission boundary must define or reuse a schema rather than trusting the shape of incoming data.
- **Status:** Approved.
- **Date:** 2026-08-09.

---

## 22. Remaining decisions and later implementation gates

### Architecture decisions

All eight architecture decisions (section 21) are approved. None currently block scaffolding.

### Implementation-time verification points

These are not open decisions; they are places where this document's guidance should be re-checked against whichever exact package versions are current at scaffolding time, because the underlying APIs stabilized very recently:

- The exact current stable Next.js version (16.3 or later, for non-experimental `next/root-params`) and next-intl version, per section 8.
- The precise interaction of `next/root-params`, `src/proxy.ts`, and not-found rendering for the three cases described in section 8, since this combination is new.

### Later implementation or content gates (do not block scaffolding)

These are identified here so the architecture shows where they plug in, without restructuring anything once they resolve:

- **Final breakpoint validation** (`specs/prototype-analysis.md` decision 7): fills in the final values in section 13's `@theme` breakpoint tokens; no structural change.
- **Intro-animation visual comparison and approval** (`specs/prototype-analysis.md` decision 9): confirms the choreography already described in section 17 and `specs/prototype-analysis.md` section 8; no structural change.
- **Sticky-navigation visual comparison and approval** (`specs/prototype-analysis.md` decision 8): confirms `SiteNavigation`'s behaviour already described in section 12; no structural change.
- **Error-state visual design** (section 15): fills in the visual treatment of the contact-form, 404, and unexpected-error states already wired in section 15; no structural change.
- **English CV file**: referenced by an existing download link in content (section 9); no structural change once supplied.
- **Future German CV file**: same content slot as the English CV, added once available; no structural change.
- **UK telephone number** and **German telephone number**: fill the contact section's content (section 9); no structural change.
- **Final VocApp, Vorwerk, and Guilds case-study content**: fills the placeholder content files described in section 10, validated by the same `caseStudySchema`; no structural change.

### Also out of scope for this architecture

- **The Agent SDK and cloud platform for a future runtime agent capability**, and **which portfolio feature will provide the first complete traceability chain**: both remain open per the workflow spec and are unrelated to this application's architecture.

---

## 23. Proposed scaffolding sequence

For reference only. None of these steps are performed by this document; they require separate approval to scaffold, per `AGENTS.md` section 5 and `CLAUDE.md`'s current-phase restrictions.

1. Verify the exact current stable Next.js (16.3 or later) and next-intl versions against their own release notes (section 8, section 22).
2. Scaffold the Next.js App Router project with `pnpm`, strict TypeScript, and the `@/*` alias.
3. Add Tailwind CSS 4 and the `@theme` tokens in `src/app/theme.css` (section 13); no `tailwind.config.ts` unless a specific need arises.
4. Add `next-intl` and the `src/i18n` routing configuration, listing `en`, `de`, and `fr` as supported locales but setting `publishedLocales` to `['en']` only until German and French content is approved (section 8), including `src/proxy.ts` and the `next/root-params`-based `src/i18n/request.ts`.
5. Populate `src/content/en` from the approved bio, positioning, and company/logo content already confirmed in `specs/prototype-analysis.md` decision 4.
6. Build `shared/components/ui`, `layout`, and `site` first, since `features` depends on them.
7. Build each `features/*` folder in prototype page order: hero, about, expertise, what-i-deliver, case-studies (with placeholder content per section 10), contact (including the `contactDelivery.ts` abstraction and its Netlify Forms implementation), trusted-by, each with a feature-root `index.ts` per section 7.
8. Wire the case-study data-access seam (section 11) against local content, validated with Zod (section 10).
9. Add the Vitest and Playwright configurations, and the `tests/e2e`, `tests/accessibility`, `tests/visual` suites.
10. Rely on Netlify's automatically managed Next.js Runtime (section 18). Request approval to push, per `AGENTS.md` section 26; an approved push may automatically create a Netlify preview without requiring a second approval. A manual external preview deployment and production promotion each require their own separate, explicit approval.

---

## 24. Glossary

Acronyms and short forms used throughout this document, expanded once here rather than repeatedly inline.

| Term | Meaning |
| --- | --- |
| AA | The "AA" conformance level within WCAG 2.2 (see WCAG below) |
| ADR | Architecture Decision Record |
| AJAX | Asynchronous JavaScript and XML (here, a `fetch`-based form submission without a full page navigation) |
| API | Application Programming Interface |
| AVIF | AV1 Image File Format, a modern compressed image format |
| CDN | Content Delivery Network |
| CI | Continuous Integration |
| CLS | Cumulative Layout Shift, a Core Web Vitals metric |
| CSS | Cascading Style Sheets |
| CV | Curriculum Vitae (the downloadable resume file) |
| DACH | Germany, Austria, and Switzerland (Deutschland, Österreich, Schweiz), the German-speaking market referenced for German-language review |
| ESM | ECMAScript Modules, JavaScript's native module format |
| HTML | HyperText Markup Language |
| i18n | Internationalization (a numeronym: "i", 18 letters, "n") |
| JSON | JavaScript Object Notation |
| LCP | Largest Contentful Paint, a Core Web Vitals metric |
| SDK | Software Development Kit |
| SVG | Scalable Vector Graphics |
| UI | User Interface |
| UK | United Kingdom |
| URL | Uniform Resource Locator |
| WCAG | Web Content Accessibility Guidelines |
