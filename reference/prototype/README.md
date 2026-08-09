# Lloyd Ntim — Product Engineer Portfolio (prototype)

Static HTML/CSS/JS export of the design, using the Montserrat/Roboto/Open Sans font pairing. This is a **design reference**, not production code — recreate it in whatever stack the real site will run on (plain static site, Next.js, etc.), reusing its structure, copy, and visual spec below.

## Files
- `index.html` — one-page portfolio: nav, hero (intro video + Ken Burns background), About, Expertise, What I Deliver, Featured Work, Contact form, brand marquee, footer.
- `case-studies.html` — case study template, built out fully for **AnzaKen** only (`#anzaken`). Vorwerk and AOE case studies still need to be written — duplicate the AnzaKen section's structure (nav / header / cover image / article body / footer nav) with each project's own copy, matching the `id="vorwerk"` / `id="aoe"` anchors that `index.html`'s project cards already link to.
- `styles.css` — shared styles: resets, nav underline hover, brand-tile grayscale→color hover, marquee, contact form fields, keyframes.
- `script.js` — scroll-reveal (IntersectionObserver) for the "What I Deliver" rows, smooth in-page scrolling, contact form submit handler (currently a stub alert — wire to a real endpoint/email service).
- `assets/` — hero.jpg, portrait.jpg, contact-bg.jpg, logo.svg, logo-intro.mp4, `logos/` (13 brand logos, color + grayscale pairs).

Most styling is inline on elements (matches how it was designed) with only cross-cutting rules (keyframes, hover states, pseudo-elements) in `styles.css`. A production rebuild should extract inline styles into real CSS/component props as part of the recreation — don't ship the inline styles as-is.

## Known gaps to close in production
- **CV file**: `index.html`'s Download CV button points to `assets/cv.pdf`, which doesn't exist yet — add the real file at that path or update the link.
- **Vorwerk / AOE case studies**: content not written yet (see above).
- **Contact form**: no backend — `script.js` just alerts on submit.
- **Mobile layout**: now responsive (mobile-first, breakpoints at 560/700/1024/1600px) — hamburger nav below 700px, stacked grids on mobile, 2-col on tablet, full grids on desktop, capped content width (1520px) on ultra-wide screens. Spot-check on real devices before shipping; some inline styles (fixed font sizes, `nowrap`) were converted to classes with `clamp()`/media queries specifically so they'd scale — keep that pattern if you extend the page.
- **Brand marquee**: pure CSS `@keyframes marquee` scroll, pauses on `:hover` — fine to keep as-is or reimplement with a carousel library.

## Visual spec (for pixel accuracy)
- **Fonts**: Montserrat (headings, 700/600), Roboto (body), Open Sans (labels/eyebrows, letter-spacing 2px, uppercase).
- **Colors**: background `#151517` (dark sections), `#0e0e10` / `#1a1a1d` (darker panels), `#fbf9f6` (light sections), text `#f4f2ef` on dark / `#17171a` on light, accent red `#c1121f`, mid-tone red `#d43a47` (used once, "Product" in hero title), muted red `#e8636f` (eyebrow labels on dark).
- **Hero**: full-bleed photo (`hero.jpg`) with `blur(1.5px) saturate(.85)` + slow `kenBurns` scale animation, dark gradient + radial vignette overlays, centered white h1 at 82.5px/700 weight, intro video (`logo-intro.mp4`) plays fullscreen black-background on load then fades into the hero (`introHold`/`logoPop` keyframes, ~3.6s hold).
- **Section rhythm**: eyebrow label (2px red rule + uppercase Open Sans label) precedes every section heading.
- **Spacing**: 64px horizontal page padding throughout; 76–96px vertical section padding.
