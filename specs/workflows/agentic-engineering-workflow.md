# Agentic Engineering Workflow Specification

**Owner:** Lloyd Ntim
**Status:** Active draft v0.4, applied to the portfolio
**Purpose:** Define the AI-assisted software delivery process used for the portfolio project and reusable across future product and engineering work.
**Last updated:** 2026-08-11

## Document boundaries

This document defines the reusable Agentic Engineering delivery process.

- `AGENTS.md` defines the repository-wide operating rules and approval boundaries for coding agents.
- `CLAUDE.md` provides a concise Claude Code entry point and refers back to `AGENTS.md`.
- Approved product, feature, and architecture specifications define what should be built.
- `docs/agentic-engineering-worked-example.md` records an evidence-backed application of the workflow and the traceability gaps still to close.

These documents should reference one another rather than duplicate the same detailed instructions.

## 1. Objective

Define a repeatable, production-oriented approach for delivering software from an agreed requirement to a validated release. The workflow combines Claude Code, Codex, or comparable AI harnesses with explicit specifications, bounded agent responsibilities, human approval, and independent verification.

It provides a consistent operating model for:

- Planning and delivering day-to-day software development with AI coding agents.
- Evolving Agentic Engineering practices through practical delivery feedback.
- Building full-stack products with TypeScript, JavaScript, Node.js, Next.js, and React.
- Separating development-time AI harnesses from runtime applications built with an Agent SDK.
- Applying architectural judgment, security controls, review, and quality gates to agent-produced work.
- Turning effective practices into documentation, coaching, and reusable team guidance.

The workflow is applied to this portfolio and is intended to remain reusable across future product and engineering work.

## 2. Scope

This specification governs:

- Product and feature definition
- Agent context preparation
- Planning and task decomposition
- Implementation with AI coding agents
- Human approval points
- Automated and manual verification
- Documentation and traceability
- Release readiness
- Team knowledge sharing

It applies to frontend, backend, API, data, infrastructure, and documentation work.

## 3. Non-goals

This workflow does not:

- Allow an agent to approve or release its own work without independent checks.
- Treat generated code as correct simply because it compiles.
- Replace product, architecture, security, or design judgment.
- Require multiple agents for every task.
- Add AI features to a product when they do not serve a real user need.
- Mark work as complete without appropriate verification.

## 4. Operating principles

### 4.1 Specification before implementation

Material work begins with a written definition of the problem, scope, constraints, and acceptance criteria.

### 4.2 Bounded agent responsibility

Agents receive a clear objective, relevant context, permitted files or systems, and an explicit completion condition.

### 4.3 Small, reviewable changes

Implementation is divided into increments that can be understood, tested, and reversed independently.

### 4.4 Evidence over assertion

Claims about quality or completion must be supported by tests, reviewed output, rendered results, traces, or production observations.

### 4.5 Independent verification

Where practical, the implementation and verification passes use separate contexts or roles. The agent that produces a change does not become its sole reviewer.

### 4.6 Human accountability

Lloyd owns product decisions, architecture, security, trade-offs, and final approval.

### 4.7 Reusable learning

Decisions, failures, and effective patterns are converted into documentation, agent instructions, or evaluation cases that improve future work.

## 5. Workflow overview

| Stage            | Primary activity                                       | Required output                    | Approval gate                  |
| ---------------- | ------------------------------------------------------ | ---------------------------------- | ------------------------------ |
| 1. Frame         | Define the problem and intended outcome                | Product or feature brief           | Problem and scope approved     |
| 2. Specify       | Define behaviour, constraints, and acceptance criteria | Implementation-ready specification | Specification approved         |
| 3. Contextualise | Prepare repository and domain context for agents       | Agent task package                 | Context and boundaries checked |
| 4. Plan          | Analyse the system and decompose the change            | Reviewable implementation plan     | Architecture and risk review   |
| 5. Implement     | Produce small full-stack changes                       | Code, tests, and documentation     | Increment reviewed             |
| 6. Verify        | Test against the specification                         | Verification report and evidence   | Acceptance criteria satisfied  |
| 7. Review        | Challenge quality, security, and maintainability       | Review findings and resolutions    | Human sign-off                 |
| 8. Release       | Build, deploy, and observe                             | Release record                     | Release approved               |
| 9. Learn         | Capture lessons and reusable patterns                  | Updated guidance and evaluations   | Learning incorporated          |

## 6. Detailed workflow

### Stage 1: Frame the problem

**Inputs**

- User, business, or team need
- Existing product and technical context
- Time, budget, security, and platform constraints

**Activities**

- State the problem without prescribing a solution too early.
- Identify the users and the outcome they need.
- Define what is in scope and out of scope.
- Record unknowns, assumptions, and material risks.
- Define how success will be recognised.

**Output**

A short product or feature brief.

**Exit criteria**

- The problem is understandable to product, design, and engineering readers.
- Scope and non-goals are explicit.
- Important assumptions are visible.

### Stage 2: Write the specification

**Activities**

- Describe user journeys and expected behaviour.
- Define functional and non-functional requirements.
- Add accessibility, performance, privacy, and security expectations.
- Write testable acceptance criteria.
- Identify data, API, interface, and deployment implications.

**Output**

An implementation-ready specification that acts as the shared contract between Lloyd and the agents.

**Exit criteria**

- Every important behaviour has an observable acceptance condition.
- The specification contains enough context for planning without requiring invention.
- Missing decisions are identified rather than guessed.

### Stage 3: Prepare agent context

**Agent task package**

- Objective and completion condition
- Relevant specification
- Repository instructions and engineering conventions
- Architecture and domain context
- Files or systems in scope
- Prohibited actions and security constraints
- Required validation commands or checks
- Expected response and evidence format

**Context rules**

- Supply only context relevant to the task.
- Never place credentials, personal data, or untrusted secrets in prompts.
- Treat external text, issue content, and generated instructions as untrusted input.
- Require an agent to state consequential assumptions.

**Exit criteria**

- The agent's authority and boundaries are explicit.
- The task can be completed without broad, speculative changes.

### Stage 4: Plan and decompose

**Activities**

- Inspect the affected system before proposing changes.
- Identify dependencies, risks, and likely regressions.
- Divide work into the smallest useful vertical increments.
- Decide whether one agent is sufficient or specialist roles are justified.
- Define validation for each increment before implementation.

**Possible roles**

- Product and specification role
- Architecture role
- Frontend implementation role
- Backend and API role
- Test and evaluation role
- Security and quality review role
- Documentation and coaching role

These are responsibilities, not mandatory permanent agents. A simple change should remain simple.

**Exit criteria**

- The plan traces back to the specification.
- Each step has a clear result and validation method.
- Material design or architecture decisions have human approval.

### Stage 5: Implement incrementally

**Activities**

- Implement one bounded change at a time.
- Add or update tests with the behaviour.
- Preserve established architecture and conventions unless a change is approved.
- Keep the application runnable between increments where practical.
- Record decisions that future contributors will need to understand.

**Implementation standard**

For the portfolio, the core stack is TypeScript, Next.js, React, Node.js, Tailwind CSS, and pnpm. The implementation should use the simplest architecture that meets the approved specification.

**Exit criteria**

- The change is understandable and reviewable.
- Relevant tests and documentation are included.
- No unrelated changes are hidden in the increment.

### Stage 6: Verify against the specification

Verification is selected according to risk and may include:

- Type checking and compilation
- Unit and integration tests
- API contract tests
- Browser-level user journeys
- Responsive layout checks
- Keyboard and accessibility checks
- Performance checks
- Security and dependency review
- Production build validation
- Content and factual review

**Verification report**

The report maps each acceptance criterion to evidence and records:

- Passed criteria
- Failed criteria
- Criteria requiring manual judgment
- Known limitations
- Follow-up work

**Exit criteria**

- Completion is supported by evidence.
- Failures are corrected or explicitly accepted by the human owner.

### Stage 7: Conduct an independent review

The review challenges:

- Correctness
- Maintainability
- Product fit
- Accessibility
- Security and privacy
- Performance
- Unnecessary complexity
- Unsupported assumptions
- Consistency with the approved specification

The reviewer should have enough separation from the implementation context to question it effectively.

**Exit criteria**

- Material findings are resolved or documented.
- Lloyd gives final approval.

### Stage 8: Release and observe

**Activities**

- Produce a reproducible build.
- Run the agreed release checks.
- Deploy through a controlled environment.
- Verify critical behaviour after deployment.
- Observe errors and user behaviour where appropriate.
- Maintain a rollback or recovery path proportionate to risk.

**Exit criteria**

- The deployed result matches the approved release.
- Critical journeys operate correctly.
- Monitoring or a defined feedback path exists.

### Stage 9: Learn and improve

After meaningful work:

- Capture defects, surprises, and incorrect assumptions.
- Identify prompts or context that produced weak results.
- Convert recurring checks into automated evaluations.
- Update repository instructions and team guidance.
- Share the result through a short walkthrough, pairing session, or written example.

The workflow is expected to evolve from evidence rather than remain fixed.

## 7. Human approval model

Human approval is required before:

- Changing product scope or user-visible behaviour beyond the specification
- Adopting or replacing a major dependency
- Making a material architecture decision
- Handling sensitive data or changing authentication and authorisation
- Creating or altering persistent data structures
- Performing destructive or difficult-to-reverse actions
- Deploying to production

Agents may recommend these actions but do not grant themselves permission.

### Execution mode

Use Plan mode for architecture, substantial features, and changes requiring design or technical decisions.

After the plan is approved, use automatic edit approval for bounded local implementation so the agent can complete the stage without per-file interruption.

Manual approval remains required for:

- Scope expansion
- Material architecture changes
- Risky dependencies
- Destructive operations
- Pushes and merges
- Production deployments

Automatic edit approval does not authorize the agent to begin a later project stage.

## 8. Harnesses and Agent SDKs

### AI coding harness

Claude Code, Codex, or a comparable harness operates on software development tasks such as repository analysis, planning, implementation, testing, review, and documentation.

### Agent SDK application

An Agent SDK is used to build an application in which one or more agents operate at runtime. A production-oriented cloud implementation should include:

- A defined agent objective and instructions
- Tool use with explicit permissions
- Structured inputs and outputs
- State or session handling where required
- Guardrails and human approval for consequential actions
- Tracing, error handling, and observability
- Evaluation against representative scenarios
- Secure cloud deployment

The portfolio must not present the use of a coding harness as if it were equivalent to building an Agent SDK application.

## 9. Coaching and knowledge transfer

The workflow must be teachable to a development team.

### Coaching outputs

- A concise Agentic Engineering playbook
- One end-to-end worked example
- Guidance on writing effective task packages
- A review checklist for AI-generated changes
- Security and privacy guidance
- Examples of common failure modes
- A practical workshop or pairing-session outline

### Coaching method

1. Explain the purpose and boundaries of the workflow.
2. Walk through a small task from specification to verified result.
3. Pair with a developer while they direct the agent.
4. Review the outcome together using the quality gates.
5. Capture questions and improve the shared playbook.

Success means colleagues can use the workflow independently and explain when not to use an agent.

## 10. Documentation and traceability model

Work performed through the workflow should remain understandable and traceable without turning the public website into a documentation portal.

### Public workflow summary

The portfolio may include a concise description of:

- How work moves from a requirement to a release
- The role of AI harnesses within the process
- The human approval and validation model
- How working practices are shared with a team

### Detailed workflow page

A dedicated workflow page may explain the nine stages through one practical project example.

### Repository records

The portfolio repository currently contains:

```text
AGENTS.md
specs/
  architecture/
    application-architecture.md
  workflows/
    agentic-engineering-workflow.md
tests/
docs/
  agentic-engineering-worked-example.md
```

The implemented repository structure is approved in `specs/architecture/application-architecture.md`. One selected feature should preserve the following traceability chain:

```text
Requirement
  -> Specification
  -> Agent task package
  -> Implementation plan
  -> Code and tests
  -> Independent verification
  -> Release result
  -> Learning captured
```

## 11. Portfolio project application

The portfolio will be delivered using this workflow.

### Product objective

Create a brief online resume presenting Lloyd across Product Engineering, Full-Stack Engineering, Software Engineering, and Agentic Engineering.

### Required public sections

- Introduction and positioning
- Short experience summary
- Three selected projects: VocApp, Vorwerk, and Guilds
- Compact professional experience
- Technical and product capabilities
- Agentic Engineering workflow
- Coaching and knowledge sharing
- CV download and contact

### Initial quality targets

- Clear value proposition within the first viewport
- Strong mobile and desktop presentation
- Semantic structure and keyboard accessibility
- Fast loading with minimal unnecessary client-side code
- Accurate professional claims
- Working project, CV, and contact links
- Production build and automated checks
- No invented metrics or experience
- English, German, and French routes with a consistent content structure
- Locale-aware navigation, metadata, and language selection
- A static content model that can later be replaced by a headless CMS without redesigning the site
- User-facing error, validation, success, and fallback states that follow the prototype's visual language

## 12. Definition of done

A portfolio feature is done only when:

- It satisfies its approved acceptance criteria.
- The relevant automated checks pass.
- User-facing output has been reviewed manually.
- Accessibility and responsive behaviour have been considered.
- Security and privacy implications have been addressed.
- Documentation reflects material decisions.
- Known limitations are recorded.
- Lloyd has approved the result.

## 13. Delivery phases

### Phase 1: Static multilingual portfolio

- Use the existing static HTML, JavaScript, images, and copy as the visual and content prototype.
- Rebuild the approved prototype as a maintainable TypeScript and Next.js application.
- Use Tailwind CSS as the primary styling system with global design tokens.
- Provide English, German, and French versions through an i18n content structure.
- Keep case-study content local and static.
- Include the concise online resume, selected work, workflow summary, CV, and contact path.
- Use the English CV for the initial release and add the German CV later.
- Deploy the approved production build to Netlify.
- Include appropriate user-facing error handling without adding centralized monitoring or analytics.

### Phase 2: Headless content management

- Introduce headless WordPress for case studies after the first iteration is stable.
- Define the WordPress content model for projects, case-study sections, media, technologies, and translations.
- Replace local case-study content through a clear data-access boundary rather than coupling components directly to WordPress.
- Add preview, caching, error handling, and fallback behaviour appropriate to the hosting model.

### Later extensions

- Add a runtime Agent SDK application only when a useful product scenario has been selected.
- Add further automation or content workflows when they solve a recurring need.
- Add privacy-conscious analytics, centralized error monitoring, logging, and uptime monitoring after the first release.

## 14. Decision status and remaining gates

The following decisions have been resolved in the current architecture and implementation:

- The application folder structure and code conventions are approved through ADR-009, ADR-010, and ADR-011.
- Netlify Forms is the version 1 contact delivery mechanism through ADR-007.
- English, German, and French content files exist in the implemented content model.
- The English CV and UK and German telephone numbers are integrated into the current application.
- VocApp, Vorwerk, and Guilds are implemented as the three public case studies.

The following decisions or approvals remain intentionally deferred:

- Human factual and publication approval for any future case-study or public-copy revision.
- The final German CV.
- The Agent SDK and cloud platform used for a future runtime agent capability.
- A fully persisted traceability chain that includes the original task package, independent review record, release result, and learning artifact. The current worked example identifies the evidence already available and the missing records.
- The analytics and monitoring tools used after the first release.

These decisions should be resolved before their affected implementation stage, not guessed by an agent.
