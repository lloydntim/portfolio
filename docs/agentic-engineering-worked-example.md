# Agentic Engineering Worked Example

## Netlify Forms integration migration

**Owner:** Lloyd Ntim

**Status:** Evidence-backed example, with traceability gaps recorded

**Related change:** Pull request 4, commit `e82391e`

**Purpose:** Demonstrate how the repository's AI-assisted workflow handled a real platform integration failure without overstating the evidence that was retained.

## 1. Why this example matters

The portfolio contact form crosses several platform boundaries:

- A React client component collects and validates user input.
- A project-owned delivery abstraction keeps the UI independent from the provider.
- Netlify Forms receives and stores the submission.
- Netlify's managed Next.js runtime performs build-time form discovery.
- The static deployment must register the form even though the interactive form is rendered by React.

This made the feature a useful test of specification-driven development, provider integration, failure diagnosis, agent-assisted implementation, human ownership, and reusable learning.

## 2. Traceability chain

| Workflow artifact | Repository evidence | Status |
| --- | --- | --- |
| Requirement | `AGENTS.md` sections 13, 19, and 26 require form error handling, critical-journey validation, and Netlify deployment. | Present |
| Architecture decision | ADR-007 selects Netlify Forms behind a replaceable delivery boundary and records alternatives and limitations. | Present |
| Agent task package | The exact original prompt and bounded task package were not persisted. | Missing |
| Implementation | `contactDelivery.netlify.ts` posts URL-encoded data through the project-owned delivery abstraction. | Present |
| Platform failure | The build reported that the managed Netlify runtime required migration steps because it could not discover client-rendered form markup. | Present in commit history |
| Corrective change | `public/__forms.html` registers the form statically and the delivery implementation posts to that endpoint. | Present |
| Automated tests | Contact form component tests cover invalid input, successful delivery, and a failed delivery result. Provider-specific submission and retry coverage remain improvements. | Partial |
| Independent review | The repository defines Codex review as required, but a standalone review artifact for this specific pull request was not persisted. | Missing |
| Human-controlled merge | The change is recorded as a Lloyd-owned commit with Claude co-authorship and was merged through pull request 4. | Present |
| Release result | The merge is recorded, but a dedicated preview or production verification report was not persisted beside the change. | Partial |
| Learning | This document captures the integration lesson and the missing evidence to retain next time. | Present |

## 3. Requirement and constraints

The form needed to support:

- Client-side validation with accessible messages.
- Submission progress, success, delivery failure, network failure, and retry behavior.
- A honeypot for basic spam protection.
- Netlify Forms as the version 1 delivery and storage provider.
- No application-hosted database or unnecessary server action.
- A replaceable delivery implementation so the React form would not be coupled directly to Netlify.
- A primarily pre-rendered deployment through Netlify's managed Next.js runtime.

The approved architecture captured these constraints before the migration issue appeared. That mattered because the fix could preserve the intended boundary instead of redesigning the form around a provider-specific failure.

## 4. Initial design

The application separated the UI from the provider:

```text
ContactForm
    -> contactDelivery.ts
        -> contactDelivery.netlify.ts
            -> Netlify Forms
```

`ContactForm` imports only the project-owned delivery module. The Netlify implementation converts accepted form data into the URL-encoded format expected by Netlify Forms and returns a small result union that the UI can handle without knowing provider details.

This is a modest but important platform design choice. It isolates an external service behind an application contract and makes a later provider replacement possible without redesigning the form.

## 5. Failure discovered

The initial integration depended on form markup that was rendered by the React client component. Under the OpenNext-based Netlify runtime, build-time form detection could not see that markup and reported that migration steps were required.

The issue was not ordinary form validation or a browser-side defect. It was a build-time integration mismatch between:

- React's rendering boundary.
- Next.js output.
- Netlify's static form discovery.
- The managed runtime's current behavior.

## 6. Agent-assisted correction

Commit `e82391e` records Claude Sonnet 5 as a co-author and Lloyd as the human author and owner.

The correction:

1. Added `public/__forms.html` with a hidden static form matching the real contact form's field names.
2. Preserved the existing React form and project-owned delivery abstraction.
3. Changed the Netlify adapter to post to `/__forms.html` instead of `/`.
4. Documented why the otherwise unusual hidden file exists.

The fix remained bounded to the provider integration. It did not change the visual form, validation schema, public fields, or overall architecture.

## 7. Verification evidence

The current repository contains automated contact-form tests for:

- Required-field and invalid-email validation in one invalid-input scenario.
- Successful submission.
- A failed delivery result using the `network-error` result variant.

The component suite does not yet separately exercise provider rejection, visible submission progress, or a corrected retry. Those remain worthwhile regression tests for this integration.

The broader project also provides type checking, linting, unit tests, end-to-end tests, accessibility scans, visual regression checks, and a production build command.

The original migration commit explains the build failure and implementation correction. A dedicated verification report for the pull request was not retained, so this example does not claim an unrecorded test result.

## 8. Human accountability

The repository's operating model keeps consequential decisions with Lloyd:

- Netlify Forms was selected through an approved architecture decision.
- Claude assisted with the implementation.
- Lloyd remained the commit author and controlled the merge.
- The agent did not approve its own architecture, push, merge, or production deployment.

This division of responsibility is central to the workflow. AI participation is visible, but accountability is not delegated to the tool.

## 9. Reusable learning

### Symptom

The Netlify build could not register a form rendered only through the React client component and requested migration steps.

### Root cause

Netlify Forms discovers form structure from static build output. The managed Next.js runtime could not discover markup that existed only inside the client-rendered component.

### Solution

Provide a hidden static HTML form with the same field contract and submit accepted client data to that registered endpoint through the existing delivery adapter.

### Regression protection

- Keep `public/__forms.html` field names aligned with the contact schema and submitted payload.
- Retain component tests for validation, success, and failure, and add explicit progress and retry coverage.
- Include a production build and preview form submission in release verification.

### Broader lesson

An external platform integration can fail outside the application's runtime path. Provider-specific build behavior must be treated as part of the integration contract, documented at the adapter boundary, and verified in the deployment environment.

## 10. Improvements for the next worked example

For the next substantial feature, persist the following beside the implementation:

1. The approved feature brief and acceptance criteria.
2. The exact bounded agent task package.
3. The implementation plan.
4. A verification report mapping acceptance criteria to evidence.
5. The independent review findings and resolutions.
6. The preview or production verification result.
7. The reusable learning added to repository guidance.

Persisting these artifacts will convert the workflow from a strong documented practice into a fully auditable example that another team can adopt.
