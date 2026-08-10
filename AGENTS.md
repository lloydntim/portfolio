# AGENTS.md

## 1. Project

This repository contains Lloyd Ntim’s multilingual online résumé and professional portfolio.

The website is intended for:

- Potential employers
- Recruiters
- Potential clients
- Organizations seeking an employee or professional service provider

The portfolio positions Lloyd across:

- Product Engineering
- Full-Stack Engineering
- Software Engineering
- Agentic Engineering

The primary visitor action is to review Lloyd’s experience and contact him about employment, contract work, or professional services.

The portfolio should communicate Lloyd’s practical use of:

- Agentic Engineering workflows
- Specification-driven development
- AI coding harnesses
- Technical documentation
- Human review and quality control

The first release should provide a focused, production-quality foundation that can be launched quickly and expanded incrementally.

## 2. Technology direction

The approved core technology direction is:

- TypeScript
- JavaScript
- Node.js
- Next.js
- React
- Next.js App Router
- React Server Components by default
- Tailwind CSS
- pnpm

Agents may recommend alternatives, but changes to the core stack require explicit approval.

Before recommending a tool, dependency, or implementation pattern, verify that the recommendation is current. Prefer official documentation and authoritative sources over remembered or outdated guidance.

## 3. Rendering and application scope

The first release should be primarily pre-rendered and served efficiently through a CDN.

Use:

- Static generation for portfolio pages
- Server Components by default
- Client Components only where browser interaction is required
- Minimal client-side JavaScript
- CSS-based animation where practical

Do not introduce per-request server rendering unless a specific requirement justifies it.

The first release stores content directly in the repository. Case-study content will be hard-coded initially.

The content architecture must make it possible to replace local case-study data with headless WordPress later without rewriting the presentation components.

Headless WordPress is planned for a later release and must not delay the initial launch.

## 4. Localization

The website should support:

- English
- German
- French

English is the authoritative source language.

German and French content must be translated from the approved English source. Translations must preserve meaning, professional tone, and natural phrasing rather than following the English text literally.

Translations require human approval before production.

Translation reviews should provide a side-by-side comparison containing:

- Content identifier
- English source
- Translated content
- Language
- Review status
- Reviewer notes when needed

German content requires particular attention to professional meaning and natural language.

## 5. Current project phase

The project is currently in the specification, prototype-analysis, and architecture-planning phase.

Before scaffolding the application, the agent must present:

- Recommended application architecture
- Proposed folder structure
- Rendering approach
- Localization structure
- Content structure
- Styling organization
- Testing strategy
- Deployment approach
- Important tradeoffs

Scaffolding requires Lloyd’s explicit approval.

After the architecture and implementation plan are approved, an agent may complete the approved work independently within the agreed scope.

## 6. Sources of truth

Use the following sources according to their area of authority:

- Lloyd’s approved instructions define current intent.
- Approved specifications define product behaviour and acceptance criteria.
- Approved architecture decisions define technical structure.
- The prototype defines visual appearance.
- Lloyd’s CV and confirmations define professional facts.
- Approved English content defines translation meaning.
- Existing implementation provides technical context but does not override approved requirements.

When two sources conflict:

1. Identify the exact conflict.
2. Show the conflicting requirements.
3. Do not implement the affected part.
4. Ask Lloyd which requirement should become authoritative.
5. Update the relevant documentation after the decision.

Do not silently reinterpret or overwrite an approved specification.

More recent instructions only supersede an older specification after the conflict has been acknowledged and the new decision confirmed.

## 7. Prototype rules

The files inside `reference/prototype/` are the visual design reference for the production site.

Treat this directory as read-only.

Do not:

- Modify prototype files without explicit approval
- Build the production application inside the prototype directory
- Treat prototype JavaScript as production-ready code
- Silently redesign or reinterpret the prototype
- Include the prototype directory in the deployed website

The prototype should remain committed to Git as a versioned design artifact.

The production implementation should be closely visually equivalent and almost pixel-perfect at agreed reference sizes.

Preserve:

- Colours
- Typography
- Images
- Spacing
- Proportions
- Layout
- Visual hierarchy
- Animation character
- Responsive behaviour

Internal organization may improve, but the visible appearance must not change without approval.

## 8. Responsive design and visual system

The implementation must be mobile-first.

Before defining final breakpoints, analyse the prototype’s existing breakpoints and responsive behaviour.

The implementation should:

- Use a consistent responsive grid
- Work between reference sizes, not only at exact screenshot dimensions
- Use an 8-point rhythm for primary layout and spacing
- Use 4-point increments for smaller adjustments
- Represent repeated visual values as design tokens
- Preserve accurate prototype measurements when the spacing scale would reduce visual fidelity
- Use fluid values where they improve responsive behaviour
- Avoid forcing typography, borders, or responsive widths into the spacing scale

Visible changes require:

1. A screenshot of the implementation
2. A side-by-side comparison with the prototype
3. An explanation of the difference
4. Lloyd’s approval

Approved design extensions and intentional differences must be recorded in a visual-deviation log.

## 9. Styling

Tailwind CSS is the primary styling system.

Use:

- Global theme tokens for colours, typography, spacing, breakpoints, shadows, and animation
- Global CSS for resets, fonts, shared foundations, and global element behaviour
- Tailwind utilities for normal component and responsive styling
- Exact values where necessary to reproduce the prototype

Avoid:

- Repeated arbitrary values when a design token is appropriate
- Unreadable or unnecessarily long class combinations
- Introducing another CSS framework
- Abstracting styles before a repeated pattern exists

CSS Modules may be used when Tailwind is not sufficient for complex, scoped styling or animation.

When introducing a CSS Module, explain why it is clearer or safer than the Tailwind equivalent.

CSS reorganization must not change the appearance of the prototype.

## 10. Content

General content in the prototype is approved for the initial production release.

Agents may use the prototype’s existing:

- Introduction
- Positioning
- Experience summary
- Contact text
- Employer and client names
- Company logos
- Email address
- Location
- LinkedIn profile
- GitHub profile

Changes to public content require human review.

The hourly or daily rate must not appear on the website. Rates are reserved for applications and direct conversations unless a later pricing feature is explicitly approved.

The first release will include:

- An English CV download
- A UK telephone number
- A German telephone number

Request the approved CV and telephone numbers when they are needed during implementation.

A German CV will be added later. Until it is available, the English CV must be labelled clearly as English.

Em dashes are prohibited in all content, documentation, code comments, commit messages, and agent reports unless Lloyd explicitly requests one.

## 11. Case studies

The approved case-study selection is:

1. VocApp, a vocabulary app for AnzaKen
2. Vorwerk
3. Guilds

The current case-study narratives in the prototype are not approved factual content.

Agents must not invent:

- Responsibilities
- Technologies
- Dates
- Metrics
- Outcomes
- Business impact
- User research
- Client statements
- Team structure
- Confidential implementation details

The case-study layouts and project identities may be implemented before final copy is supplied.

Request the final case-study content from Lloyd when it becomes necessary.

Until approved content is available, use clearly identified development placeholders that cannot be mistaken for confirmed professional claims.

## 12. Accessibility, security, performance, and design conflicts

When the prototype conflicts with accessibility, responsiveness, security, performance, or established browser behaviour:

1. Preserve the appearance where possible.
2. Explain the issue to Lloyd.
3. Describe its user or technical impact.
4. Propose the smallest appropriate adjustment.
5. Provide visual evidence when the adjustment is visible.
6. Request approval before making a visible change.

An agent may independently fix a non-visual accessibility, security, or performance problem when:

- It remains inside an approved task
- It does not change approved behaviour
- It does not introduce a high-risk dependency
- The change is documented and verified

## 13. Error handling

User-facing error handling is required in the first release.

Handle relevant states such as:

- Invalid or incomplete form input
- Submission in progress
- Successful submission
- Failed submission
- Network failure
- Retry
- Alternative direct contact
- Missing pages
- Unexpected application errors

The prototype does not define these states, so they are approved areas for a design extension.

Error-state designs must:

- Follow the prototype’s visual language
- Use the approved design tokens
- Follow accessibility and UX best practices
- Be shown through screenshots
- Receive approval before being considered final
- Be recorded in the visual-deviation log

Production errors must not expose:

- Stack traces
- Secrets
- Internal file paths
- Infrastructure details
- Sensitive request information
- Form contents

## 14. Engineering standards

Use strict TypeScript.

Avoid:

- `any` without a documented reason
- Unsafe type assertions
- Duplicated data structures
- Unnecessary client-side state
- Unnecessary dependencies
- Premature abstraction
- Dead code
- Unexplained configuration
- Large components with unrelated responsibilities

Prefer:

- Semantic HTML
- Server Components
- Clear component boundaries
- Descriptive naming
- Explicit data contracts
- Small focused functions
- Accessible native browser elements
- Framework and platform capabilities
- Straightforward code over clever code
- Comments that explain reasons and tradeoffs

Do not prescribe an arbitrary component length. Refactor when a component has multiple responsibilities, becomes difficult to understand, or cannot be tested effectively.

The exact folder structure and detailed code conventions will be proposed and approved before scaffolding.

Lloyd may provide existing folder structures and representative code as references.

## 15. Accessibility standard

Target WCAG 2.2 AA.

Include:

- Semantic document structure
- Keyboard-accessible navigation
- Logical focus order
- Visible focus states
- Appropriate colour contrast
- Meaningful image alternatives
- Proper form labels
- Accessible validation messages
- Reduced-motion support
- Zoom support
- Correct page language
- Appropriate landmarks and headings

Automated tools do not replace manual accessibility review.

## 16. Browser support

Support current versions of:

- Chrome
- Safari
- Firefox
- Edge
- Mobile Safari
- Mobile Chrome

The site should degrade safely if a newer browser capability is unavailable.

Do not add support for obsolete browsers without an explicit requirement.

## 17. Performance targets

Mobile performance is the primary benchmark.

For public pages, target:

- Lighthouse Performance: minimum 95, goal 100
- Lighthouse Accessibility: 100
- Lighthouse Best Practices: 100
- Lighthouse SEO: 100
- LCP: 2.5 seconds or less
- INP: 200 milliseconds or less
- CLS: 0.1 or less

Agents must not manipulate test conditions to produce misleading results.

If a target cannot be reached:

1. Report the measured result.
2. Explain the cause.
3. Describe the user impact.
4. Propose an improvement.
5. Record any accepted shortfall.

Optimize images, fonts, client-side JavaScript, caching, and layout stability.

## 18. SEO

The first release should include:

- Unique page titles
- Page descriptions
- Canonical URLs
- Language metadata
- `hreflang` relationships
- Open Graph metadata
- Social-sharing images
- Favicons
- `robots.txt`
- XML sitemap
- Semantic headings
- Descriptive links
- Appropriate structured data

Prefer Next.js built-in metadata and sitemap capabilities over additional dependencies.

Search Console registration and sitemap submission occur after production deployment.

## 19. Testing and validation

Testing should be proportional to risk and behaviour.

Use unit tests for meaningful logic such as:

- Locale and route helpers
- Content validation
- Metadata generation
- Data transformation
- WordPress data mapping in the later CMS phase

Use component or interaction tests for:

- Mobile navigation
- Language selection
- Contact functionality
- Form validation
- Keyboard behaviour
- Error and success states

Use a small set of end-to-end tests for critical journeys:

- Open the homepage
- Navigate to every case study
- Switch languages
- Use the mobile menu
- Access contact options
- Download the CV
- Confirm important pages load successfully

Do not test internal CSS class names or trivial implementation details.

Before completing a substantial stage or requesting permission to push, run all relevant checks:

- TypeScript checking
- Linting
- Automated tests
- Production build
- Broken-link checks
- Translation completeness
- Automated accessibility checks
- Manual keyboard checks
- Mobile and desktop visual comparison
- Secret and unintended-file review

Use Playwright and axe-core for browser and accessibility testing unless the approved architecture selects an equivalent approach.

Never claim that a test passed unless it was run successfully.

Report checks that could not run and explain why.

## 20. Specification-driven workflow

Documentation effort should be proportional to the change.

### Architecture and major features

Require:

- Written specification
- Acceptance criteria
- Implementation plan
- Risk assessment
- Testing approach
- Approval before implementation

### Normal features

Require:

- Concise feature specification
- Acceptance criteria
- Short implementation plan

### Small fixes and maintenance

Require:

- Clear task description
- Explanation of the cause
- Proportionate verification

Do not create large specifications for trivial copy or documentation corrections.

## 21. Agent workflow

For substantial work:

1. Read `AGENTS.md`.
2. Read the relevant approved specifications.
3. Inspect the current implementation.
4. Identify ambiguity and conflicts.
5. State assumptions.
6. Produce a bounded implementation plan.
7. Obtain approval when required.
8. Implement only the approved scope.
9. Write appropriate tests.
10. Run relevant validation.
11. Perform a self-review.
12. Update relevant documentation.
13. Produce a completion report.
14. Create focused local commits when authorized.
15. Request approval before pushing.

Claude Code is the primary implementation agent.

Claude must self-review substantial work before presenting it.

Codex provides an independent review of every pull request and explains architecture, code, findings, and tradeoffs when requested.

Important architecture, major features, releases, and security-sensitive work require focused review.

An agent review does not replace Lloyd’s approval at defined decision points.

## 22. Approval boundaries

Within an approved plan, an agent may:

- Create and edit project files
- Run the application locally
- Write and run tests
- Run builds and quality checks
- Produce screenshots and local previews
- Create focused local Git commits
- Install low-risk, straightforward development dependencies
- Update relevant technical documentation
- Fix non-visual accessibility, security, or performance issues within scope

Explicit approval is required before:

- Scaffolding the application
- Materially changing the folder structure
- Changing the core stack
- Changing architecture
- Changing the hosting provider
- Changing localization structure
- Changing the content-management approach
- Adding a complex or high-risk dependency
- Making a visible design change
- Changing public content
- Publishing professional facts
- Pushing to GitHub
- Merging a pull request
- Deploying or promoting to production
- Expanding beyond approved scope
- Introducing analytics, tracking, cookies, or monitoring

When uncertain whether an action is inside the approved scope, stop and ask.

## 23. Dependency policy

A low-risk dependency may be added within an approved implementation plan when it is:

- Actively maintained
- Compatible with the approved stack
- Current at the time of installation
- Necessary or clearly beneficial
- Small in scope
- Straightforward to remove
- Acceptably licensed
- Free from known significant security concerns

Request approval before adding a dependency that:

- Changes architecture
- Introduces a runtime service
- Has a large dependency tree
- Adds substantial client-side JavaScript
- Requires sensitive permissions
- Creates vendor lock-in
- Is difficult to remove
- Has unclear maintenance
- Has security or privacy implications

Record why each non-obvious dependency was selected.

## 24. Documentation

Document important architecture decisions in a decision log.

Each architecture decision should include:

- Context
- Decision
- Alternatives considered
- Reasoning
- Consequences
- Status
- Date

Record significant bugs and reusable findings in a troubleshooting or engineering-learnings document.

Bug records should include:

- Symptom
- Reproduction steps
- Root cause
- Solution
- Verification
- Regression test
- Reusable lesson

Record approved visual differences and design extensions in a visual-deviation log.

Documentation should be concise, useful, and maintained with the implementation.

## 25. Git workflow

Use Conventional Commits.

| Type       | Purpose                                |
| ---------- | -------------------------------------- |
| `feat`     | New user-facing feature                |
| `fix`      | Bug fix                                |
| `docs`     | Documentation only                     |
| `style`    | Formatting without behavioural change  |
| `refactor` | Internal change without new behaviour  |
| `test`     | Tests                                  |
| `chore`    | Tooling, maintenance, or configuration |
| `perf`     | Performance improvement                |
| `build`    | Build system or dependencies           |
| `ci`       | Continuous integration                 |

Keep commits focused and understandable.

Substantial features require:

- A short-lived feature branch
- A pull request
- Claude self-review
- Codex review
- Passing required checks
- Lloyd’s approval before pushing
- Lloyd’s approval before merging

Small, low-risk documentation and copy corrections may be committed directly to `main`, but pushing still requires approval.

Use merge commits for substantial pull requests so individual stage commits and the feature boundary remain traceable.

Rebase is permitted on a private local branch before it is pushed.

After a branch is shared or a pull request is opened:

- Do not rebase without approval.
- Do not force-push without approval.
- Do not rewrite published history.
- Use `git revert` to undo published work.

Reserve hotfix branches and commits for urgent production defects.

Do not commit:

- Secrets
- Local environment files
- Build output unless explicitly required
- Unrelated changes
- Temporary debugging files
- Unapproved generated content

Tag approved public releases using semantic versioning.

## 26. Deployment

The approved first-release hosting provider is Netlify.

Use preview deployments for review.

The deployment flow is:

1. Implement locally.
2. Run required checks.
3. Create local commits.
4. Request approval to push.
5. Allow the approved push to create a Netlify preview.
6. Review the hosted preview.
7. Request separate approval for production deployment.

The first release should use pre-rendered pages served from Netlify’s CDN so public pages do not depend on a sleeping server process.

Keep the application reasonably portable and avoid unnecessary Netlify-specific coupling.

## 27. Deferred features

The following are planned for later releases and must not delay version one:

- Headless WordPress
- Final German CV
- Analytics
- Interaction and conversion tracking
- Centralized error monitoring
- Centralized frontend and backend logs
- Automated uptime monitoring
- Production performance monitoring
- Pricing information

Do not install analytics or monitoring SDKs during version one without explicit approval.

## 28. Task completion report

For every substantial completed task, report:

- Objective
- What changed
- Why it changed
- Files affected
- Tests and checks performed
- Results
- Visual-comparison results
- Accessibility findings
- Performance findings
- Decisions made
- Documentation updated
- Known limitations
- Remaining work
- Required approvals
- Suggested Conventional Commit message

For bug fixes, additionally report:

- Symptom
- Reproduction steps
- Root cause
- Solution
- Regression test
- Reusable lesson

Keep reports factual. Do not claim checks, results, or approvals that did not occur.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes. APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev`. Verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
