# Frontend from approved mockup

## Objective

Implement Alimenta's frontend demo in React, TypeScript, and Vite, using the approved HTML mockup, the design guidelines, and the consolidated project proposal as the behavioral and visual references.

## Problem

The repository contains a detailed interactive mockup and an empty `app/frontend/` scaffold, but no application code. The team needs a frontend implementation that preserves the agreed presentation and can demonstrate documented user journeys without claiming backend capabilities.

## Why

The user explicitly authorized frontend implementation and approved React + TypeScript + Vite, strict TDD, Vitest with React Testing Library, and unauthenticated dependency downloads from the public npm registry for this project only.

## Scope

- Build the frontend exclusively within `app/frontend/` and update relevant project documentation to identify what is implemented and how to run and test it.
- Follow `docs/diseño/AGENTS.md`, `docs/diseño/lineamientos_diseno.md`, the approved `docs/diseño/Mockup_Alimenta_Taste_v7_Jornadas_Voluntariado.html`, and current `docs/propuesta.md`.
- Implement documented public and role-based demonstration screens and interactions that fit the frontend-only boundary.
- Use fictional client-side demo data and transient browser state only where the reference calls for demonstration behavior.
- Keep the mockup reference immutable.

## Authorized scope

`app/frontend/` plus narrowly necessary README documentation for frontend setup and status. No backend, API service, server, database, deployment, external map/data API, production authentication, real persistence, or edits to the approved mockup. Do not modify unrelated existing data scripts/tests or other design/reference materials.

## Constraints and decisions

- Framework: React + TypeScript + Vite — explicitly approved by the user.
- TDD: strict RED → GREEN → REFACTOR — explicitly selected by the user.
- Test runner: Vitest with a DOM environment and React Testing Library — explicitly approved by the user.
- Dependency access: unauthenticated npm downloads from `https://registry.npmjs.org`, limited to this project's frontend — explicitly approved by the user.
- Runtime baseline observed: Node `v24.18.0`, npm `11.16.0`.
- Preserve Spanish product language and the mockup's role terminology (`donante`, `edil`, `agente`, `administrador`).
- Keep the global top navigation; no sidebar. The allies section remains on the public home, not a separate page. Carousels remain manually controlled with no autoplay.
- Keep role selection demo-only; do not imply real authentication or server authorization.
- Use fictitious sample information, not real beneficiary identities, needs, or operational availability.
- Do not represent the user-requested frontend as a functioning backend, live inventory, confirmed donation, actual delivery, or validated social impact.
- Honor keyboard interaction, visible focus, reduced motion, non-color-only status, labeled controls/errors, and list alternatives to map pins.
- Keep existing application folders outside the frontend unchanged; do not create `deploy/` or `compose.yaml`.
- TDD evidence source: explicit user selection. Exact runner: Vitest. Focused command: `npm run test -- --run`; production/type-check command: `npm run build`.
- Delivery strategy: `ask-on-risk`. Chain strategy: `stacked-to-main` (user-selected). Forecast: likely over 400 authored changed lines because this work covers the public experience, role workspaces, responsive styling, and behavior tests. Reassess actual task boundaries and running count before commits.

## Tasks

- [x] **ALIM-UI-001 — Build the public frontend foundation** *(implementation complete; visual review limitation recorded)*
  - Route: delegated direct, single writer.
  - Trigger evidence: implementation research spans the mockup, design instructions, product proposal, React setup, tests, styles, and documentation; writing touches multiple non-trivial files.
  - Acceptance criteria:
    - React/Vite/TypeScript app boots from `app/frontend/` with documented scripts.
    - TDD RED is observed before production implementation; focused tests cover routing/navigation, public landing, service directory filtering/list alternative, and the manually controlled allies carousel.
    - Responsive public home and directory faithfully reflect the approved mockup and approved design constraints.
    - Accessible semantic controls, labels, keyboard/focus behavior, reduced motion, and non-color-only states are present.
    - Any map/need examples are clearly fictional, static client-side demo data; no external services or backend calls.
    - README accurately documents implemented scope, demo-only limitations, and frontend setup/tests.
  - Checks:
    - `npm run test -- --run`
    - `npm run build`
    - Manual responsive/readback check at the documented widths: 1440, 1024, 768, 390, and 320 px.
  - Rollback boundary: remove the frontend app/tooling and associated README implementation notes; preserve all unrelated repository material.

- [ ] **ALIM-UI-002 — Implement frontend-only role demonstrations**
  - Route: delegated direct, same single writer.
  - Trigger evidence: role workflows and tests span multiple non-trivial frontend modules.
  - Acceptance criteria:
    - Demo workspaces cover donor, edil, agent, and administrator reference views, including volunteer-event submission and moderation as shown in the approved mockup.
    - Relevant mockup interactions work through local transient state and clearly communicate that no server action or real submission occurred.
    - Tests exercise principal role-navigation and form/interaction behavior, including the documented boundary that commitments, appointments, dispatches, and confirmed receipts are distinct.
    - UI does not expose beneficiary-sensitive information or present demo data as live.
    - The mockup HTML remains unchanged and no backend/API/persistence is introduced.
  - Checks:
    - `npm run test -- --run`
    - `npm run build`
    - Manual keyboard and responsive interaction check.
  - Rollback boundary: remove role-workspace frontend behavior and its tests only; preserve public frontend foundation.

## Progress and evidence

- Current state: public React/Vite/TypeScript client implemented with public routes, manual allies carousel, static fictional service directory, accessible filters/list alternative, and no role workspaces.
- TDD RED: observed before app implementation. `npm run test -- --run` exited non-zero because `src/app/App` did not yet exist; Vitest reported `Failed to resolve import "./app/App"` and 0 tests collected.
- TDD GREEN: after implementation and test-query refinement, `npm run test -- --run` passed: 1 test file, 5 tests. Final verification is recorded below.
- Dependency install: `npm install --registry=https://registry.npmjs.org --no-audit --no-fund` succeeded (`added 97 packages in 48s`); React type packages were then installed from the same registry (`added 3 packages in 1s`). Exact versions are locked in `app/frontend/package-lock.json`.
- Verification: `npm run test -- --run` passed (1 file, 5 tests); `npm run build` passed (TypeScript check plus Vite production build, 27 modules; JS 273.66 kB / 86.17 kB gzip). Node `v24.18.0`; npm `11.16.0`.
- Responsive/accessibility review: automated DOM tests cover keyboard-operable buttons/links, labels, visible list alternative, selected states, and live result/slide updates. Chromium headless screenshots were attempted for 1440, 1024, 768, 390, and 320 px plus directory at 390 px; snap Chromium logged screenshot writes, but the resulting files were inaccessible to the workspace for visual inspection. Visual overflow/capture review therefore remains unverified.
- Commits: implementation work-unit hash pending; will be recorded after commit.
- Next step: ALIM-UI-002 remains separate and unimplemented; no push or PR created.
