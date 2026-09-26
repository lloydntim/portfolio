# Visual deviation log

Approved visual differences from `reference/prototype/` and approved design extensions, per `AGENTS.md` sections 8, 13 and 24. The prototype stays the visual reference; an entry here records where production intentionally differs and who approved it.

Status values:

- **Approved**: Lloyd approved the difference. The visual baselines may treat it as correct.
- **Pending**: The change shipped, but no approval is recorded yet. Baselines must not be regenerated to include it until it is approved.
- **Unresolved**: The change looks unfinished or unintended. It needs a decision, not a baseline.

This log was started on 2026-09-26 while refreshing the Playwright visual baselines. Entries 1 to 8 are reconstructed from git history (`eafeab3..9071595`), not from approvals recorded at the time. Lloyd approved entries 1 to 7 on 2026-09-26 when the log was created.

---

## Entries

### 1. Hero content shifted down 80px

- **Area:** Homepage hero (title, subtitle and scroll cue), all widths
- **Prototype:** Hero content is centred in the hero block
- **Production:** Title and subtitle block, and the scroll cue, sit 80px lower (`top-20` in `HeroImage.tsx`)
- **Commit:** bdbbb46 (2026-08-10)
- **Status:** Approved
- **Approved by / date:** Lloyd, 2026-09-26

### 2. Desktop nav links enlarged by 20%

- **Area:** Site navigation, desktop (md and up)
- **Prototype:** Nav links are 14.5px
- **Production:** Nav links, the language trigger and the dropdown items are 17.4px
- **Commit:** aa1e6e7 (2026-08-10)
- **Status:** Approved
- **Approved by / date:** Lloyd, 2026-09-26

### 3. Language switcher

- **Area:** Site navigation, all widths
- **Prototype:** No language switcher
- **Production:** EN dropdown at the end of the desktop nav links, and an inline EN/DE/FR row inside the open mobile menu
- **Commits:** d86cef1, aa1e6e7 (2026-08-10)
- **Status:** Approved (design extension)
- **Approved by / date:** Lloyd, 2026-09-26

### 4. Active-section highlight in the nav

- **Area:** Site navigation, all widths
- **Prototype:** Red underline appears on hover and focus only
- **Production:** The link for the section currently in view also shows the underline and white text (`aria-current="page"`)
- **Commit:** a91cd70 (2026-08-10)
- **Status:** Approved (design extension)
- **Approved by / date:** Lloyd, 2026-09-26

### 5. Mobile nav logo doubled

- **Area:** Site navigation, mobile
- **Prototype:** Logo is 20px high
- **Production:** Logo is 26px high when the bar is sticky and 30px over the hero (the previous baseline had 13px and 15px)
- **Commit:** abe5a21 (2026-08-13)
- **Status:** Approved
- **Approved by / date:** Lloyd, 2026-09-26

### 6. Mobile About section order

- **Area:** Homepage About section, mobile
- **Prototype:** Heading, bio, CV button, portrait, checklist
- **Production:** Heading, portrait, bio, checklist, then the CV button row at the bottom
- **Commit:** 199724c (2026-08-13)
- **Status:** Approved
- **Approved by / date:** Lloyd, 2026-09-26

### 7. GitHub and LinkedIn icon buttons beside Download CV

- **Area:** Homepage About section, all widths
- **Prototype:** Download CV button only
- **Production:** Two square icon buttons follow the CV button, reusing the footer URLs. The CTA row is anchored to the bottom of the section on tablet
- **Commit:** ff25519 (2026-08-18)
- **Status:** Approved (design extension)
- **Approved by / date:** Lloyd, 2026-09-26

### 8. Mobile hero title enlarged, then fitted to the screen

- **Area:** Homepage hero title, below the xs breakpoint (500px)
- **Prototype:** 2.35rem, one line
- **Production:** The title is larger than the prototype and breaks onto two lines. Its size is `min(4.7rem, (100vw - 4rem) / 4.7)`, so it is 75px at most and shrinks so "Engineer" fits between the 2rem side paddings (69px at 390px, 66px at 375px, 63px at 360px, 54px at 320px)
- **Commits:** 9a8ab2a (2026-08-13) enlarged it to a fixed 4.7rem, which overhung its container at 390px and ran past the viewport edge at 375px and below. Its message says the title is "still oversized at 375px pending a follow-up". The fluid size is the follow-up, made in the PR that refreshed the visual baselines
- **Status:** Approved
- **Approved by / date:** Lloyd, 2026-09-26. The refreshed mobile homepage baseline includes it
