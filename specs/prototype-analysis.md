# Prototype Analysis

**Status:** Active reference v0.3, prototype decisions resolved
**Scope:** Read-only analysis of `reference/prototype/` (`index.html`, `case-studies.html`, `script.js`, `styles.css`, `README.md`, `assets/`).
**Method:** Full read of every source file plus file-level inspection of assets (size, pixel dimensions). No dev server was run and no prototype file was modified.

This document is analysis only. It does not propose a folder structure or begin implementation, per `AGENTS.md` section 5.

## Decisions applied in this revision (v0.2)

1. Approved case studies and order: VocApp (a vocabulary application developed for AnzaKen), Vorwerk, Guilds.
2. The prototype's existing "AnzaKen" case-study narrative is not approved VocApp content and must not be reused.
3. AOE is not a featured case study. AOE may remain in the trusted-by logo marquee.
4. The existing bio, company names, employer names, and supplied logos are approved for the initial release.
5. The production application now includes public case-study content, the English CV, and UK and German telephone numbers. The later German CV remains deferred.
6. The production application uses a replacement high-resolution portrait while the original low-resolution prototype asset remains unchanged as a read-only reference.
7. The six observed prototype breakpoints are reference measurements, not a fixed list that must all be preserved before architecture review. The final responsive system must preserve the prototype's visual behaviour and requires approval.
8. Navigation behaviour is approved: original position over the hero, sticky on scroll, returning to the original state at the top, preserving the prototype's visual style, with no sliding motion under reduced motion. This is an approved design extension requiring visual verification.
9. Intro animation behaviour is approved: preserve the existing choreography on the first visit per browser session, allow a click/keyboard skip, bypass entirely under reduced motion, and design the skip control to match the prototype. This is included in visual and interaction testing.

---

## 1. Pages and sections

### `index.html` (one page, in DOM order)

| Section | Anchor | Contents |
| --- | --- | --- |
| Intro overlay | n/a | Full-screen black overlay, plays `logo-intro.mp4`, holds 3.6s, then fades out |
| Nav | n/a | Logo, hamburger toggle (< 700px), links: Home / About / Services / Projects / Contact |
| Hero | n/a | Full-bleed photo background (Ken Burns), h1 "Product Engineer", subhead, scroll indicator |
| About | `#about` | Eyebrow, heading, bio paragraph, CV download link, portrait image, 4-item checklist |
| Expertise | `#services` | Eyebrow, 4-card grid (Product Engineering, Spec-Driven Development, Backend & APIs, Data & Cloud) |
| What I Deliver | n/a | Eyebrow, intro paragraph, 4 numbered rows (Build / Improve / Accelerate / Transform), scroll-reveal animated |
| Featured Work | `#projects` | Eyebrow, heading, 3 project cards (AnzaKen, Vorwerk, AOE), each linking to `case-studies.html#<id>` |
| Contact | `#contact` | Eyebrow, heading, availability line, location line, contact form (name/email/message) |
| Trusted by (marquee) | n/a | "TRUSTED BY TEAMS AT" label, infinite-scroll logo marquee (14 logos, doubled for loop) |
| Footer | n/a | Copyright, GitHub, LinkedIn, email |

### `case-studies.html` (template, one case study built)

| Section | Anchor | Contents |
| --- | --- | --- |
| Nav | n/a | Same nav markup, static (no intro/animation), links back to `index.html` |
| Header | `#anzaken` | Eyebrow "CASE STUDY", h1 title, intro paragraph, Role/Timeline/Stack meta row |
| Cover image | n/a | Placeholder block |
| Article | n/a | Intro paragraph, Challenge section, screenshot placeholder, Approach section, pull quote, Outcome section, 3-stat row |
| Footer nav | n/a | "Back to projects" link, static text "Next: Vorwerk" (not a link) |
| Footer | n/a | Copyright, email |

Only `#anzaken` is built. An HTML comment at the bottom of the file states Vorwerk and AOE case studies still need to be written, replicating the same structure with `id="vorwerk"` / `id="aoe"`. Per the decisions above, the project structure for case studies 1 to 3 is now VocApp, Vorwerk, and Guilds: the existing `#anzaken` markup is a structural template only, not approved VocApp content, and the existing `#aoe` reference is no longer part of the featured case-study set (see section 3).

---

## 2. Content inventory (as it exists today, verbatim/paraphrased)

The bio, company names, employer names, and supplied logos listed below are approved for the initial release (decision 4). Case-study narrative content is addressed separately in section 3, since it is not covered by that approval.

- **Positioning:** "Product Engineer" (hero), "Full-stack engineer with a product mindset" (about heading)
- **Bio:** "I build and scale digital products for enterprise and consumer brands including E.ON, Kia, Deutsche Bank, Sony and Vorwerk, pairing deep React/Next.js expertise with robust backend and system design."
- **Checklist claims:** 15+ years experience; Product & system thinking; End-to-end ownership; Pragmatic, maintainable code
- **Expertise cards:** Product Engineering; Spec-Driven Development (mentions Claude Code, Codex); Backend & APIs (Node.js, Python, REST/GraphQL); Data & Cloud (PostgreSQL, MongoDB, Redis, AWS, Docker)
- **What I Deliver:** Build (end-to-end product engineering); Improve (product modernisation & architecture); Accelerate (AI products & rapid prototyping); Transform (embedded engineering & collaboration)
- **Projects (index cards):** AnzaKen (agritech platform, mobile app + API + analytics dashboard); Vorwerk (connected-appliance experiences); AOE (enterprise commerce/digital platforms)
- **AnzaKen case study (full):** role "Full-stack & product engineer", timeline "8 months", stack "React Native, Node.js, PostgreSQL"; Challenge/Approach/Outcome narrative about smallholder farmers, offline-first sync, payment reconciliation, analytics dashboard; a pull quote; stats "3 regions", "8mo idea to launch", "1st financing partner onboarded"
- **Contact:** "Let's build something." / "Currently available full-time for permanent or freelance work." / "Based across the DACH region & UK, commuting between the two, and available remotely."
- **Trusted-by logos:** E.ON, Kia, Deutsche Bank, Sony, Vorwerk, Skyscanner, Harrods, AKQA, AOE, Heycar, Native Instruments, Ryanair, Waitrose (13 distinct brands)
- **Footer:** "© 2026 Lloyd Ntim", GitHub, LinkedIn, `info@lloydntim.com`
- **Missing from the prototype:** UK and German phone numbers. Both are present in the released production application.

The AnzaKen case-study narrative (role, timeline, stack, stats, quote) is not approved factual content and is not approved VocApp content. See section 3.

---

## 3. Case-study project mapping (resolved)

`AGENTS.md` section 11 and `CLAUDE.md` state the approved case-study selection and order is:

1. VocApp (a vocabulary application developed for a client called AnzaKen)
2. Vorwerk
3. Guilds

The prototype's actual, fully-written case study is for a project it calls "AnzaKen" itself: an agritech marketplace platform for smallholder farmers (React Native, Node.js, PostgreSQL), which is a different product, domain, and narrative from VocApp. The prototype's third project is "AOE" (enterprise commerce platforms), not Guilds. Guilds does not appear anywhere in the prototype: no card, no anchor, no copy.

This has now been resolved by decisions 1 to 3:

| Approved (`AGENTS.md`) | Prototype today | Resolution |
| --- | --- | --- |
| 1. VocApp (built for client AnzaKen) | "AnzaKen" as the case study itself (agritech marketplace) | The prototype's AnzaKen narrative is not approved VocApp content. The production application contains the current approved VocApp copy. The `#anzaken` markup may still serve as a structural reference. |
| 2. Vorwerk | Vorwerk (card exists, case-study copy not written) | Identity confirmed. The production application contains the current approved case-study copy. |
| 3. Guilds | AOE | AOE is not a featured case study. The production application contains the current approved Guilds copy. AOE remains in the trusted-by logo marquee (section 2). |

No further decision is needed on case-study identity, order, or first-release copy. Future factual or copy changes remain subject to approval.

---

## 4. Reusable component candidates

| Candidate | Evidence | Notes |
| --- | --- | --- |
| `SectionEyebrow` (rule + uppercase label) | Repeated identically 7+ times (about, expertise, deliver, projects, contact, case-study header, case-study article sub-sections) | Highest-value extraction. Only the label text and colour (accent vs muted-red) vary |
| `SiteNav` | Duplicated in full between `index.html` and `case-studies.html`, with only `href` targets and an inline `position:static` override differing | Needs prop for "in-page anchors" vs "cross-page links" mode, plus the approved sticky-on-scroll behaviour (decision 8) |
| `SiteFooter` | Duplicated between both pages | Trivial extraction |
| `Hero` | Single use today, but has many independent layered pieces (bg, tint, gradient, vignette, glow, title, sub, scroll indicator) worth componentising for maintainability | |
| `IconStat` / checklist row | 4 near-identical rows in About (icon + label) | |
| `ExpertiseCard` | 4 identical-structure cards in `.tech-grid` | |
| `DeliverRow` | 4 identical-structure numbered rows | |
| `ProjectCard` | 3 identical-structure cards | |
| `LogoTile` (marquee item) | 14 logos, repeated bw/color crossfade markup, one variant for "solo" (single-image) logos | |
| `CaseStudyStat` | 3 stat blocks in the AnzaKen-structured case study | Will repeat once Vorwerk and Guilds are written |
| `CaseStudyHeader` / `CaseStudyArticle` | Only one instance exists. The prototype's own trailing comment says it should be duplicated for Vorwerk and AOE | The approved case-study set replaces AOE with Guilds (section 3), so the component should be built to support VocApp, Vorwerk, and Guilds. The prototype comment itself does not mention Guilds |
| Inline SVG icon set | Clock/layers/shield/gear/download/location/GitHub/LinkedIn icons all inlined per-use | Candidate for a shared icon component or sprite |
| `ContactForm` | Single use, but isolating it clarifies where validation/success/error states attach | |

---

## 5. Colours, fonts, typography, images

### Colours (from `README.md` visual spec, cross-checked against markup)

| Token | Hex | Usage |
| --- | --- | --- |
| Dark background | `#151517` | Body background, dark sections |
| Darker panel | `#0e0e10` | Deliver section, contact overlay base |
| Darker panel (alt) | `#1a1a1d` | Expertise cards |
| Light background | `#fbf9f6` | About, projects sections, case-study article body |
| Text on dark | `#f4f2ef` | Headings/body on dark sections |
| Text on light | `#17171a` | Headings on light sections |
| Accent red | `#c1121f` | Links, buttons, eyebrow rules, accents |
| Accent red hover | `#e8636f` (link hover), `#a30f1a` (button hover) | Interactive states |
| Mid-tone red | `#d43a47` | Used once, for the word "Product" in the hero title |
| Muted red | `#e8636f` | Eyebrow labels on dark sections |
| Body text (dark theme, muted) | `#a8a6a3` | Card/paragraph text on dark backgrounds |
| Body text (light theme) | `#3d3d42`, `#55534e` | Paragraph text on light backgrounds |
| Footer text | `#7d7b78` | See accessibility section 10: a contrast concern |

### Fonts

- **Montserrat** (400/500/600/700/800/900): headings, buttons, stat numbers
- **Roboto** (400 to 700): body text, form fields
- **Open Sans** (400 to 700): eyebrow labels and small meta text, always uppercase with 1 to 2px letter-spacing

Loaded via a single Google Fonts CSS2 `<link>` with `preconnect` hints (see performance section 11).

### Type scale observed

- Hero h1: `2.35rem`, stepping up to `3rem` (500px), `3.75rem` (700px), `4.5rem` (1024px), `5.15625rem` (1280px). Weight 700, line-height 1.05.
- Case-study h1: `clamp(2rem, 7vw, 3.375rem)`
- Section h2: mix of fixed `27px` (About) and `clamp(1.75rem,4vw,2.5rem)` (Projects) / `clamp(1.9rem,6vw,2.75rem)` (Contact): an inconsistent method for what is visually the same heading level
- Deliver row h3: fixed `30px`
- Case-study h2: `clamp(1.4rem, 4vw, 1.875rem)`
- Body copy: `14.5px` to `17px` depending on section
- Eyebrow labels: `13px`, uppercase, 2px letter-spacing, weight 600

### Images / video assets

| Asset | Dimensions | File size | Note |
| --- | --- | --- | --- |
| `hero.jpg` | 1535x1024 | 1.8 MB | Heavy for its resolution. Has `blur(1.5px)` and `saturate(.85)` applied at render time, so a lower-fidelity, more-compressed source would look identical: a good optimisation candidate |
| `contact-bg.jpg` | 2192x1461 | 160 KB | Already reasonably compressed |
| `portrait.jpg` | **163x195** | 4.3 KB | Too small for production use at the prototype's display size. The production application uses the approved replacement `public/cv-photo.webp` while this prototype asset remains unchanged. |
| `logo-intro.mp4` | n/a | 149 KB | Autoplays muted on every `index.html` load |
| `logo.svg` + 13 brand logos (bw + color pairs, some solo) | n/a | 1.2 to 16 KB each | Sony's pair is the largest (16 KB each). Rest are small |

---

## 6. Spacing, measurements, grid behaviour

- **Horizontal page padding:** 20px (mobile), 40px (>= 700px), 64px (>= 1024px), applied via `.container`, `.nav-inner`, `.hero`
- **Max content width:** 1360px, expanding to 1520px at >= 1600px
- **Vertical section rhythm:** 52px (mobile), 68px (>= 700px), 76px (>= 1024px) for `.section`; 64/80/96px for `.section-deliver`
- **Grid gaps:** commonly 14 to 24px (small), 32 to 48px (large row/column gaps)
- **8-point / 4-point rhythm audit:** Most spacing values are clean multiples of 4 (16, 20, 24, 28, 32, 40, 44, 48, 64, 68, 76, 80, 96). A meaningful minority are not: `14px`, `18px`, `22px`, `26px`, `34px`, `36px` appear repeatedly for gaps and margins. Per `AGENTS.md` section 8, these off-scale values should be reviewed individually: some may be intentional fine-tuning worth preserving as exact values, others may be safe to round onto the 4pt scale without visible difference.

---

## 7. Breakpoints and responsive behaviour

`README.md` states the breakpoints are 560 / 700 / 1024 / 1600px. The CSS actually defines six distinct breakpoints, listed below as reference measurements rather than a fixed list that must all be preserved before architecture review (decision 7). The final responsive system must preserve the prototype's visual behaviour and requires approval.

| Breakpoint | Used for |
| --- | --- |
| 500px | Hero title font-size step only |
| 560px | Tech grid (1 to 2 col), contact name-row (1 to 2 col), case-study stats (1 to 3 col) |
| 700px | Primary breakpoint: container padding, nav (hamburger to inline), hero sizing, about grid, deliver-row layout, project-card layout, section padding, logo-tile size |
| 1024px | Secondary breakpoint: container padding, tech grid (to 4 col), deliver-row (3-col), project-card (3-col + auto), about-grid (3-col) |
| 1280px | Hero title font-size step and min-height adjustment only |
| 1600px | Container max-width cap (ultra-wide) |

The gap between the documented breakpoint list and the implementation is noted for the architecture review, where the final approach (whether to formalise 500/1280 as named fine-tuning points, or fold them into the primary four) will be decided.

### Behaviour summary by range

- **< 700px (mobile):** hamburger nav (slide-down panel, `max-height` transition), single-column grids throughout, stacked about layout, stacked deliver rows, stacked project cards, smaller logo tiles
- **700 to 1023px (tablet):** inline nav, 2-column tech grid, 2-column about grid (portrait beside text, checklist spans both columns), 2-column deliver rows (number and content merged into column 2), 2-column project cards
- **>= 1024px (desktop):** 4-column tech grid, 3-column about grid, 3-column deliver rows, 3-column project cards, larger section padding
- **>= 1600px:** content max-width capped at 1520px so lines don't over-stretch on ultra-wide monitors

---

## 8. Animations and interactions

| Animation | Trigger / duration | Reduced-motion requirement |
| --- | --- | --- |
| `introHold` / `logoPop` (intro video overlay) | Page load, ~3.6s hold | Bypass the intro entirely; go straight to the resolved hero state (decision 9) |
| `fadeUp` (hero entrance animations: nav, hero title, hero sub, hero scroll indicator) | Page load, staggered 3.5s to 4.1s delays | Show the content immediately without the fade/translate entrance |
| `kenBurns` (hero background scale) | Infinite, 18s alternate | Show a static hero frame; no continuous zoom |
| `lineDrop` (scroll indicator animation) | Infinite, 1.8s | Show a static scroll indicator; no moving line |
| `marquee` (logo marquee scroll) | Infinite, 46s linear, pauses on `:hover` | Stop the continuous scroll; the logos remain visible without automatic motion |
| Scroll-reveal (`data-reveal`, IntersectionObserver in `script.js`) | On scroll into view | Already implemented today: `script.js` checks `prefers-reduced-motion` and shows content immediately without the reveal transition |
| Smooth scrolling (`scrollIntoView({behavior:'smooth'})`) | Anchor link click | `scrollIntoView`'s smooth behaviour does not check the user's preference on its own. Production code must check `prefers-reduced-motion` explicitly and use instant scrolling (`behavior:'auto'`) when reduced motion is requested |
| Mobile navigation transition (open/close) | Click, CSS `max-height` transition | Keep the open/closed state change and functionality; remove or minimize the animated height transition |
| Logo tile bw/color crossfade | `:hover`, 0.3s opacity transition | Hover-triggered state change, not continuous motion; not part of this requirement |
| Sticky navigation transition (approved extension, decision 8) | Scroll past original nav position, and return to top | Keep the state change (original to sticky, and back); remove or minimize sliding motion (decision 8) |

Reduced-motion support is an engineering requirement for the production implementation, not an unresolved design decision. It covers the intro animation, hero entrance animations, the Ken Burns animation, the scroll indicator animation, the logo marquee, smooth scrolling, the mobile navigation transition, the sticky navigation transition, and the scroll-reveal animation. In every case, the underlying state change and functionality must be preserved (the intro still resolves to the hero, the nav still opens and closes, the page still scrolls to its target, the sticky nav still switches state) while nonessential movement is removed or minimized when `prefers-reduced-motion: reduce` is set. Today, only the scroll-reveal implements this; the rest are implementation work for the production build, not open decisions.

---

## 9. Navigation and contact behaviour

- **Nav positioning (prototype today):** `.site-nav` is `position: absolute`, not `fixed` or `sticky`. It scrolls away with the page after the hero and does not reappear. There is no persistent navigation while scrolling.
- **Nav positioning (approved, decision 8):** begin in the original prototype position over the hero, switch to a sticky nav once the original position scrolls out of view, and return to the original state when the user scrolls back to the top. Preserve the prototype's visual style, avoid sliding motion under reduced motion, and treat this as an approved design extension requiring visual verification.
- **Cross-page nav:** `case-studies.html`'s nav links point back to `index.html` and `index.html#section`; `index.html`'s nav links point to same-page anchors. The two navs are separately hand-maintained copies with different `href` targets, not a shared or parameterised component.
- **Case-study footer nav:** "Back to projects" is a real link. "Next: Vorwerk" is plain text, not a link, even though the target section is planned.
- **Contact form:** three fields (name, email, message), native `required` validation only. Inputs use `placeholder` text as the only label: there are no associated `<label>` elements. Submit is intercepted in `script.js`, shows a native `alert()`, and resets the form. There is no real backend, no in-page success/error state, and no distinction between validation failure and submission failure.
- **Footer contact "links":** GitHub and LinkedIn are `<span>` elements containing an icon and text, not `<a href>` elements. They are not actually clickable or navigable. The email is plain text, not a `mailto:` link.

---

## 10. Accessibility gaps

- **No landmark elements.** Nav, hero, sections, and footer are all `<div>`s. There is no `<header>`, `<nav>`, `<main>`, or `<footer>` anywhere in either page. Headings (`h1`/`h2`/`h3`) are used correctly where present, which is a good foundation to build semantic landmarks around.
- **Expertise cards use `<div>` for their titles**, not a heading element, while the visually-equivalent Deliver rows correctly use `<h3>`. This is an inconsistency, not just a gap.
- **Form fields have no `<label>`.** Placeholder text is not an accessible substitute per WCAG 2.2. There is also no accessible error/success messaging or `aria-live` region for submission feedback.
- **Reduced motion is only partially honoured today** (see section 8, which sets out the full reduced-motion requirement across nine animations and transitions). Only the scroll-reveal implements it today; closing the remaining gaps is production implementation work, not an open design decision.
- **Duplicate alt text per marquee logo.** Each brand renders as two stacked `<img>` elements (bw and color) with identical `alt` text, so a screen reader will announce the same brand name twice per tile: 28 announcements for 14 logos, before the intentional DOM duplication for the seamless loop doubles it again to 56.
- **Nav toggle button is implemented well.** `aria-label`, `aria-expanded`, and `aria-controls` are all present and correctly wired in `script.js`. This is worth preserving as-is.
- **Colour contrast (measured, WCAG 2.2 relative-luminance formula):**
  - Footer text `#7d7b78` on `#151517`: 4.32:1, which fails the 4.5:1 AA threshold for normal-size text.
  - Eyebrow labels (`#e8636f` on `#151517`/`#0e0e10`, `#c1121f` on `#fbf9f6`): 5.6 to 5.92:1, passes AA.
  - Body copy on both light and dark sections: 7.1 to 10.3:1, passes AA comfortably.
  - The mid-tone red hero word (`#d43a47`) sits over a photographic background with a gradient and vignette rather than a flat colour, so its effective contrast varies by scroll position and cannot be fully verified by formula alone. Worth a manual spot-check once the hero photo is finalised, though as large (>= 24px) bold text it only needs to clear 3:1.
- **`logo-intro.mp4` autoplay** has no user control to skip or dismiss it today. Decision 9 approves adding a click/keyboard skip control designed to match the prototype.

---

## 11. Performance risks

- **`hero.jpg` is 1.8 MB** at a relatively modest 1535x1024: heavy for a background image that additionally receives a `blur()` filter (fine detail is invisible anyway). A recompressed or resized WebP or AVIF source would very likely cut this substantially.
- **`portrait.jpg` is only 163x195px**, undersized for its display width (up to 280px, roughly 560px at 2x). The released application resolves this prototype limitation with `public/cv-photo.webp` at 1055x1266px.
- **Google Fonts loaded via a render-blocking `<link>`** to `fonts.googleapis.com` and `fonts.gstatic.com` rather than self-hosted. `next/font` can self-host and eliminate this extra origin and request round-trip in the production build.
- **Marquee duplicates the full 14-logo, 28-image set to 56 `<img>` tags** in the DOM for the seamless CSS-only loop: real, if modest, extra weight and DOM size.
- **No explicit width/height attributes on `<img>` tags** (portrait, logos): a CLS risk until intrinsic size is otherwise reserved.
- **Three infinite CSS animations run permanently** (`kenBurns`, `marquee`, `lineDrop`) regardless of viewport visibility or reduced-motion preference: minor but avoidable CPU/battery cost.
- **`logo-intro.mp4`** adds 149 KB and, per decision 9, plays once per browser session going forward rather than on every load, which also reduces the average performance cost for returning visitors within a session.

---

## 12. SEO gaps

- No `<meta name="description">` on either page.
- No canonical URL, no Open Graph or Twitter Card metadata, no social-sharing image.
- No favicon `<link>`.
- No structured data (for example, `Person`/`ProfilePage` JSON-LD).
- No `robots.txt` or sitemap (expected for a static prototype, required for production per `AGENTS.md` section 18).
- No `hreflang` (expected: this is a pre-localization, English-only prototype).
- Page `<title>` elements are present and distinct between the two pages, which is a good foundation.
- Heading hierarchy is mostly clean (h1 to h2 to h3) but the Expertise cards' use of `<div>` instead of a heading (see section 10) also weakens SEO structure, not just accessibility.

---

## 13. Missing loading, success, validation, empty, and error states

None of these exist in the prototype today:

- No loading/in-progress state for the contact form (submit is synchronous and instant via `alert()`).
- No success state beyond the browser-native `alert()`.
- No validation error states beyond the browser's default `required` tooltip.
- No network-failure or retry handling.
- No missing-page (404) treatment.
- No empty-state design (not currently applicable: there are no dynamic/collection views in the static prototype, but this will matter once case studies are content-modelled).

`AGENTS.md` section 13 already treats this entire category as an approved area for design extension rather than a prototype defect. These states need to be designed to match the prototype's visual language, not discovered as bugs.

---

## 14. Technically weak prototype behaviour needing production treatment

- Styling is driven almost entirely by inline styles on individual elements, with only cross-cutting rules (keyframes, hover states, pseudo-elements, responsive grid layout) in `styles.css`. The prototype's own README already flags this as something to extract, not ship as-is.
- Nav and footer markup is duplicated between `index.html` and `case-studies.html` rather than shared.
- Nav is not sticky or fixed in the prototype (see section 9); decision 8 approves a sticky-on-scroll extension.
- Contact form has no backend and no real feedback states (see sections 9 and 13).
- Case-study "Next" link is static text, not an actual link, even though the destination anchor is already planned.
- Intro video sequence replays on every page load in the prototype today; decision 9 approves once-per-session playback with a skip control.
- Marquee bw/color crossfade duplicates every logo as two stacked `<img>` elements: this duplicates image requests and, left as-is, duplicates alt-text announcements to assistive technology (see section 10). The production implementation must announce each brand once to assistive technology, hide decorative duplicate images from assistive technology, preserve the black-and-white to colour visual transition, and be selected after comparing it visually with the prototype.

---

## 15. Visual details that must be preserved

(See also the "Preserve" bucket below. This list is the same information organised for quick designer/engineer reference.)

- Exact colour palette (section 5) and font pairing (Montserrat, Roboto, Open Sans)
- Hero treatment: full-bleed blurred/saturated photo, Ken Burns zoom, gradient and vignette overlays, centered large title with the "Product" word in the mid-tone red, intro video sequence and its fade-to-hero handoff (choreography preserved per decision 9)
- Eyebrow-label pattern (rule and uppercase label) preceding every section heading
- Section background rhythm (dark, light, dark, light, dark, white marquee)
- Brand marquee behaviour: grayscale-to-color crossfade on hover, pause-on-hover, infinite scroll
- Responsive grid transitions across breakpoints, treated as reference measurements per decision 7, with the final system requiring approval
- Numbered "What I Deliver" row treatment and its scroll-reveal animation
- Case-study page structure: eyebrow, title, intro, meta row, cover, article with pull quote, stats, footer nav
- Nav's original position over the hero, preserved as the starting state before the sticky transition (decision 8)

---

## 16. Differences between the prototype and approved requirements

- **Case-study project mapping** is resolved (section 3): the production application includes approved public content for VocApp, Vorwerk, and Guilds.
- **UK and German phone numbers do not appear in the prototype**, but both are present in the production application.
- **The prototype CV link points to a missing `assets/cv.pdf` file**, but the production application includes the approved English CV.
- **The prototype portrait is too small for production use** (section 5/11), so the production application uses the approved high-resolution replacement.
- **Hourly/daily rate correctly does not appear anywhere**, matching the requirement in `AGENTS.md` section 10. No change needed.
- **No localization structure exists**, which is expected at this stage. English, German, and French routes are a later, separately-planned requirement, not a prototype defect.

---

## Classification

### 1. Visual requirements that must be preserved

- Colour palette, font pairing, and type scale (section 5)
- Hero treatment in full, including the intro video sequence's visual choreography (section 15)
- Eyebrow-label pattern before every section heading
- Section background colour rhythm
- Brand marquee visual behaviour (grayscale/color crossfade, pause-on-hover, infinite scroll)
- The prototype's responsive layout behaviour across its breakpoints, treated as reference measurements (section 7); the final breakpoint set requires architecture-review approval
- Case-study page visual structure (header, cover, article, pull quote, stats, footer nav)
- Spacing and proportions at the values catalogued in section 6, including the off-4pt-scale values that may be intentional fine-tuning
- Nav's original over-the-hero position as the starting state, per the approved sticky-nav behaviour (decision 8)

### 2. Production improvements that should not visibly change the design

- Extracting inline styles into real CSS/Tailwind tokens and component props
- Adding semantic landmark elements (`<header>`, `<nav>`, `<main>`, `<footer>`) around the existing visual structure
- Converting the Expertise card titles from `<div>` to a heading element to match Deliver rows
- Adding `<label>` elements for the contact form fields (visually hidden if needed to preserve the current placeholder-driven look)
- Making GitHub/LinkedIn footer items real `<a href>` links and the email a `mailto:` link
- Making the case-study "Next" footer link a real link
- Optimising `hero.jpg`, without changing its visual appearance
- Self-hosting fonts via `next/font` instead of the Google Fonts CDN link
- Adding explicit width/height (or aspect-ratio) to image elements to eliminate CLS risk
- Implementing the reduced-motion engineering requirement (section 8) across all nine listed animations and transitions: intro animation, hero entrance animations, Ken Burns, scroll indicator, logo marquee, smooth scrolling, mobile navigation transition, sticky navigation transition, and scroll-reveal (already implemented for scroll-reveal)
- Fixing the logo marquee's accessibility duplication so that each brand is announced once to assistive technology and the decorative duplicate images are hidden from assistive technology, while preserving the black-and-white to colour visual transition. The specific implementation should be selected after comparing it visually with the prototype
- Raising the footer text colour's contrast ratio above 4.32:1 to clear the AA 4.5:1 threshold (a small, likely visually negligible colour adjustment)
- Templating the nav and footer once instead of hand-duplicating them per page

### 3. Proposed design extensions that require approval

- Sticky navigation behaviour (decision 8): approved in principle, with the resulting visual implementation still requiring the standard screenshot and side-by-side verification before being considered final.
- Intro animation skip control and once-per-session playback (decision 9): approved in principle, with the skip-control design still requiring the standard visual verification before being considered final.
- Designing the full set of contact-form states: in-progress, success, validation error, submission failure, network failure, retry, and an alternative direct-contact fallback (required by `AGENTS.md` section 13, and pre-approved there as a design-extension area rather than something to guess silently).
- Designing a missing-page (404) treatment.
- Any visual treatment for empty states once case-study content becomes data-modelled.

### 4. Content status and future approvals

- The production application contains the current approved public case-study content for VocApp, Vorwerk, and Guilds. None of the prototype's original AnzaKen narrative, stats, or quote should be reused as factual content.
- UK and German phone numbers are present in the production contact section.
- The approved English CV is present in the production application.
- The later German CV: deferred input, out of scope for the first release.
- The production application uses a high-resolution replacement portrait.

The existing bio, company/employer names, and supplied logos are approved for the initial release and are not included in this list (decision 4).

---

## 17. Open decisions and deferred inputs

### Open decisions

None remain from this analysis. The case-study project mapping (previously the main open conflict), navigation behaviour, and intro animation behaviour have all been resolved by the decisions recorded at the top of this document.

### Deferred inputs and current implementation status

The current application now includes:

- Public case-study content for VocApp, Vorwerk, and Guilds.
- The English CV file.
- UK and German telephone numbers.
- A replacement portrait image.

Future revisions to those public assets and claims still require Lloyd's approval. The final German CV remains deferred.
