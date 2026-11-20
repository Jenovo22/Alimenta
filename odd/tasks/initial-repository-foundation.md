# Initial repository foundation

## Objective

Create a clear, lightweight repository foundation that explains Alimenta's social purpose and prepares the project for a later prototype definition without prematurely choosing a technical architecture.

## Problem

The repository has no project-facing documentation or collaboration baseline. Contributors need a shared understanding of the problem, intended users, initial boundaries, and the decisions that remain open.

## Why

Alimenta aims to connect community food-aid organizers with suppliers and individual donors while helping organizers coordinate inventories across initiatives. A documented foundation prevents the prototype from drifting away from that outcome.

## Scope

- Add an accessible project README.
- Capture the initial product context, actors, goals, assumptions, and open questions.
- Add basic repository hygiene and contribution guidance appropriate for an early prototype.
- Avoid selecting a technology stack or defining implementation architecture before the prototype is contextualized.

## Authorized scope

Documentation and repository-foundation files only. No application source code, dependencies, remote operations, deployment setup, or technical stack decisions.

## Constraints

- Technical artifacts use clear, neutral English.
- Treat vulnerable populations respectfully and avoid unsupported impact claims.
- Do not imply that Alimenta handles payments, logistics, food-safety certification, or beneficiary data unless later requirements explicitly establish those capabilities.
- Keep the structure easy to extend after the prototype discussion.

## Delivery

- Strategy: `ask-on-risk`
- Forecast: under 400 authored changed lines.
- Branch: `docs/initial-foundation`
- TDD: not applicable to this documentation-only foundation; structural checks are required.

## Tasks

- [x] **ALIM-001 — Establish the project narrative**
  - Route: delegated direct.
  - Trigger evidence: the work prepares and writes multiple non-trivial documentation files.
  - Acceptance criteria:
    - The README leads with what Alimenta is, who it serves, and its current stage.
    - The product brief distinguishes verified context, initial proposal, assumptions, exclusions, and open decisions.
    - Content does not invent prototype functionality or a technical stack.
  - Checks:
    - Read back every created Markdown file.
    - Confirm headings and internal links are coherent.

- [x] **ALIM-002 — Add repository collaboration hygiene**
  - Route: delegated direct as part of the same bounded documentation work unit.
  - Trigger evidence: repository hygiene must stay consistent with the narrative files.
  - Acceptance criteria:
    - Contribution guidance explains the early-stage workflow and documentation expectations.
    - Ignore rules exclude local tooling state without hiding future source files.
    - Repository structure is documented and ready for the prototype phase.
  - Checks:
    - `git diff --check`
    - Verify ignored local state with `git status --short --ignored`.

## Progress and evidence

- Current state: both documentation tasks completed.
- Verification: `git diff --check` passed; all Markdown files were structurally read back; README and contribution links resolve; `.atl/` and `.codegraph/` are ignored as intended.
- Commit: pending.
- Next step: create the work-unit commit and record its identity.
