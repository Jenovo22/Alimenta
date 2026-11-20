# Manizales data download

## Goal

Provide a reproducible, documented download of the authorized Socrata dataset for municipality code `17001` (Manizales), preserving the requested fields in versionable CSV/JSON output without introducing an application stack.

## Decisions

- Deliver a portable download script plus source documentation.
- Store outputs as generated CSV/JSON and keep them out of Git unless explicitly requested.
- Use the supplied Socrata dataset `ab8a-uwf7` and filter exactly to `cod_mpio=17001`.
- The requester authorized all supplied fields, including `hog001`–`hog027`, for this iteration.

## Tasks

- [x] Confirm the accessible Socrata endpoint and response schema.
- [x] Implement a dependency-free, reproducible downloader with validation, pagination, retries, and generated CSV/JSON output.
- [x] Document usage, source, privacy handling, and verification checks.
- [x] Run focused structural checks; live schema verification remains blocked by network DNS in the environment.

## Evidence

- `python3 -m unittest discover -s tests -p 'test_manizales_downloader.py' -v`: 4 tests passed.
- `git diff --check`: passed.
- Live API access was not available in this environment; the downloader uses `https://www.datos.gov.co/resource/ab8a-uwf7.json`, the supplied host's public resource endpoint.
- Work-unit commit: `79d2d70` (`feat(data): add reproducible Manizales Socrata download`).

## Non-goals

- Selecting a broader application architecture or database technology.
- Adding beneficiary identity or eligibility models.
- Committing downloaded household records.
