# Demo accounts, shared flow, and Manizales map

## Objective

Make the local demo flow persist across its role workspaces using pre-seeded demo profiles and a small browser-local data store, and replace the schematic service map with an OpenStreetMap view of Manizales and neutral neighborhood reference markers.

## Problem

The current role views keep independent component state, so donor offers and Edil/Admin actions do not form a shared flow and disappear on navigation or reload. The service directory uses arbitrary schematic positions rather than a real city map.

## Why

The user requested a data store connected to demo accounts, at least Edil, Donor, and Administrator profiles (or profile creation), a complete simulated workflow, and a free-use map of Manizales. The user selected OpenStreetMap tile and one-time Nominatim coordinate access, and chose neutral reference-point labels because repository evidence does not substantiate neighborhood-level vulnerability classifications.

## Scope

- Add fictional pre-seeded demo profiles and a versioned, browser-local JSON store shared by the frontend role views.
- Connect a coherent donation-offer lifecycle and Edil-to-Administrator volunteer-event moderation through the shared store; show received donations in agent inventory.
- Persist demo changes across role navigation and page reloads on the same browser origin; provide a clear reset to initial demo data.
- Add an OpenStreetMap basemap with markers for Samaria, La Isla access reference, and Bosques del Norte, retaining an accessible textual list.
- Store coordinate results locally; never query Nominatim at runtime.
- Clearly label points as neighborhood reference markers, not as a vulnerability classification or official boundary.

## Authorized scope

`app/frontend/`, `app/database/` demo seed data, and narrowly relevant README/ODD documentation. No production backend, remote database, real authentication, real user data, external service beyond the explicitly authorized OpenStreetMap tile and one-time Nominatim lookup endpoints, payments, or delivery dispatch. Do not modify the approved HTML mockup, unrelated data downloader, or research materials.

## Constraints and decisions

- Database approach: fictional JSON seed imported into a typed local browser store (localStorage), keyed by stable demo account IDs. This keeps the demo single-browser and offline-capable apart from map tiles; it is not a production database or cross-device account system.
- Profiles: seed Donante, Edil, Agente, and Administrador accounts. Choosing a profile is explicitly a demo identity switch, not authentication or authorization.
- Flow: donor creates a contribution offer; assigned Edil accepts/rejects and confirms actual receipt; confirmed receipt updates the shared demo inventory; account and status history remain visible to relevant workspaces. Volunteer-event submission and moderation also share state across Edil/Admin views.
- Store only fictional sample identities and records; do not reuse household-level research data.
- Map provider: OpenStreetMap standard tile service. Include visible OSM attribution and an accessible location list; handle tile loading failure gracefully.
- Coordinate provenance: Nominatim one-time lookup result. Samaria: `5.0789850, -75.4864590` (neighbourhood node). Bosques del Norte: `5.0829919, -75.4892998` (neighbourhood node). La Isla lookup returned the mapped access stairs rather than a neighborhood centroid: `5.0631788, -75.5177450`; label it as an access/reference point and disclose that it is not an official boundary or centroid.
- Labels: “Barrios de referencia para la demo”; no claim that the named places have a verified vulnerability classification. Repository-only evidence challenge found no substantiating source.
- Remote scope: user authorized unauthenticated tile access to `https://tile.openstreetmap.org` and one-time coordinate search at `https://nominatim.openstreetmap.org`; no Google Maps access or API key.
- TDD: strict RED → GREEN → REFACTOR, carried forward from the user's explicit project/session choice. Test runner: Vitest; command `npm run test -- --run`. Build/typecheck: `npm run build`.
- Branch: `feat/demo-database-map`.
- Delivery strategy: `ask-on-risk`. Forecast: over 400 authored lines across persistence, shared role workflows, fixtures, map, tests, and docs. Chain strategy: `stacked-to-main` (user-selected); no PR or push authorized.

## Tasks

- [x] **ALIM-DEMO-001 — Add seeded profiles and shared browser-local workflow** *(implementation complete; interactive verification partial)*
  - Route: delegated direct, one writer.
  - Trigger evidence: access routing, multiple role workspaces, data models, persistence, tests, seed JSON, and README require coordinated non-trivial changes.
  - Acceptance criteria:
    - Access screen offers the seeded demo profiles and identifies profile switching as demo-only, not authentication.
    - A versioned local store initializes from fictional JSON data and persists across reloads on the same browser origin; reset restores known seed data.
    - Donor offers, Edil decisions/receipt confirmation, Agent inventory, and Admin/Edil volunteer moderation share stable account-linked records across role views.
    - Commitment, appointment/acceptance, dispatch, and confirmed receipt remain distinct states; only confirmed receipt changes demo inventory.
    - Invalid/stale IDs and malformed persisted JSON degrade safely to initial demo state without exposing browser storage data as secure.
    - Strict TDD tests prove RED first, shared cross-role transitions, persistence/reload behavior, reset behavior, and the demo-only boundary.
  - Checks:
    - `npm run test -- --run` — PASS: 1 test file, 16 tests.
    - `npm run build` — PASS: TypeScript check and Vite production build.
    - `git diff --check` — PASS.
    - Runtime: Vite on `127.0.0.1:5173` returned the app HTML (HTTP 200). The requested interactive browser walkthrough (including hard reload and reset) was not completed: no interactive browser control is available in this environment; no automation dependency was added. Port 5173 was already occupied; the attempted foreground start selected 5174 and was stopped by the command timeout.
  - Rollback boundary: revert this work-unit commit to remove the demo local store, fictional fixtures/profile selection, shared donor/Edil/Agent/Admin workflows, related tests, and README notes; preserve the public frontend, existing service directory and all later map work.
  - Evidence: RED observed before implementation: 5 of 16 tests failed on missing profile selection, donor offer, shared persisted actions and reset (plus updated old transient-state assertions). GREEN: final 16/16 tests passed. Build passed as above. Runtime browser interaction remains unverified; no claim of complete manual walkthrough.
  - Authored changed-line count: 380 total (328 additions + 52 deletions) in the work-unit snapshot, including this task record.
  - Commit: pending final commit hash.

- [ ] **ALIM-DEMO-002 — Show Manizales with reference neighborhood markers**
  - Route: delegated direct, one writer after ALIM-DEMO-001.
  - Trigger evidence: map tiles, location fixtures, map component, responsive styles, attribution, and tests span multiple files.
  - Acceptance criteria:
    - Show Manizales with the three locally stored OSM-derived reference points and visible source attribution.
    - Identify La Isla as the mapped access reference because no neighborhood centroid was returned.
    - Markers/list entries are keyboard accessible and synchronized; list remains usable if map tiles fail.
    - No neighborhood is labeled “vulnerable”; the UI explains that these are reference points, not an official vulnerability classification or boundary.
    - Tile requests use only the user-authorized OSM endpoint; Nominatim is not queried at runtime.
    - Strict TDD tests cover marker data, selection/list behavior, attribution, and graceful tile failure.
  - Checks:
    - `npm run test -- --run`
    - `npm run build`
    - Manual map/list and responsive check.
  - Rollback boundary: remove map component, markers, map-specific styles/tests and README notes; preserve the shared demo store/workflow.

## Progress and evidence

- Current state: ALIM-DEMO-001 implementation complete with browser-local shared profiles/flows; interactive browser verification is partial. ALIM-DEMO-002 remains untouched and not started. User approved neutral reference labels, local browser persistence and OSM/Nominatim endpoints.
- Coordinate lookup: one initial query per requested place; La Isla returned only its mapped access stairs. A single narrower follow-up still returned that same access feature, so the UI must disclose this limitation.
- TDD: strict mode; RED observed before production implementation (5 failed tests); GREEN: `npm run test -- --run` passed 16 tests.
- Verification: test/build/diff check passed. Dev-server HTML smoke request returned successfully; interactive donor → Edil → Agent and event moderation/reload/reset walkthrough was not performed because no interactive browser control is available.
- Commits: ALIM-DEMO-001 Conventional Commit hash and final authored line count pending final commit snapshot.
- Next step: implement ALIM-DEMO-002 separately; do not create PRs or push without authorization.
