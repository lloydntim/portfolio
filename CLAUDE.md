# CLAUDE.md

This file provides Claude Code with project-specific working instructions.

## Required reading

Before planning or changing anything, read:

1. `AGENTS.md`
2. Relevant approved specifications in `specs/`
3. Relevant architecture decisions and documentation
4. Existing implementation files related to the task

`AGENTS.md` contains the primary repository-wide agent instructions. Do not duplicate or override those rules here.

## Current phase

The project is currently in specification, prototype-analysis, and architecture-planning.

Do not:

- Scaffold the Next.js application
- Install application dependencies
- Select the final folder structure
- Begin production implementation
- Modify public content
- Modify the prototype
- Deploy the website

These actions require an approved specification and explicit permission.

## Prototype

Treat `reference/prototype/` as a read-only visual design reference.

The prototype defines:

- Visual appearance
- Colours
- Typography
- Images
- Layout
- Spacing
- Responsive direction
- Animation character

Do not modify files inside the prototype directory unless explicitly instructed.

Do not treat prototype JavaScript, accessibility, error handling, or application structure as production-ready.

The production implementation should reproduce the prototype closely while using maintainable, accessible, and production-quality code.

## Current case studies

Use this order and spelling:

1. VocApp
2. Vorwerk
3. Guilds

VocApp is a vocabulary application developed for AnzaKen.

The current case-study narratives are not approved factual content. Do not copy them into production or invent replacement claims.

Request approved case-study content from Lloyd when it becomes necessary.

## Planning

For substantial work:

1. Inspect the relevant files.
2. Read the relevant specification.
3. Identify missing information and conflicts.
4. State assumptions.
5. Propose a bounded implementation plan.
6. Wait for approval when required.
7. Implement only the approved scope.

When requirements conflict or are ambiguous, show the conflict and ask Lloyd before implementation.

## Implementation

After a plan is approved, you may:

- Create and edit files within the approved scope
- Write appropriate tests
- Run validation
- Update relevant documentation
- Create focused local Git commits

Follow the architecture, coding, testing, content, accessibility, performance, and Git rules in `AGENTS.md`.

Use:

- TypeScript
- Next.js App Router
- React Server Components by default
- Tailwind CSS
- pnpm
- Minimal client-side JavaScript

Verify current tool and dependency guidance using official documentation before recommending or installing anything.

## Review

Before presenting substantial work:

1. Review the complete diff.
2. Check that the implementation matches the approved specification.
3. Run all relevant tests and validation.
4. Check for unintended file changes.
5. Check for unsupported professional claims.
6. Check that the prototype remains unchanged.
7. Report any limitations or unresolved decisions.

Never claim a test passed unless it was run successfully.

Codex will provide an independent review of every pull request.

## Git and deployment

You may create focused local commits after completing an approved stage.

Do not:

- Push to GitHub without approval
- Merge a pull request without approval
- Deploy to production without approval
- Force-push without approval
- Rewrite shared history
- Commit secrets or local environment files

Netlify is the approved hosting direction, but deployment configuration will be finalized during architecture planning.

## Communication

Explain important decisions clearly and in plain language.

For substantial completed work, report:

- What changed
- Why it changed
- Files affected
- Tests and checks performed
- Results
- Visual comparison results
- Accessibility and performance findings
- Documentation updated
- Known limitations
- Remaining work
- Required approvals

Do not use em dashes unless Lloyd explicitly requests them.
