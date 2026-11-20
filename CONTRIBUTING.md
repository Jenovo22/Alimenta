# Contributing to Alimenta

Alimenta is in an early documentation and discovery stage. Contributions should clarify the project without turning assumptions into product requirements or technical commitments.

## Before making a change

1. Read the [project overview](README.md) and [product brief](docs/product-brief.md).
2. Identify the supplied context, proposal, assumption, or decision affected by the change.
3. Confirm that the change stays within the current work definition or discuss the new scope before implementation.

## Keep contributions focused

- Use one branch for one coherent work unit.
- Branch from the current accepted baseline and use a short descriptive name, such as `docs/clarify-prototype-questions`.
- Keep documentation, decision context, and relevant verification together.
- Avoid unrelated cleanup or speculative files.
- Do not commit local tooling state, secrets, generated output, or personal data.

## Commit expectations

Commits should represent a reviewable outcome rather than a file category. Use a concise Conventional Commit message, for example:

```text
docs: clarify prototype validation questions
```

Keep each commit understandable and reversible on its own. Do not add AI attribution or co-author trailers. A remote contribution is not required until the repository owner requests it.

## Documentation expectations

- Write repository artifacts in clear, neutral English.
- Lead with the conclusion or action, then provide supporting detail.
- Distinguish observed or supplied context from proposals and assumptions.
- Use respectful, person-centered language and avoid unsupported impact claims.
- Link to the source of an existing project decision when one exists.
- Check headings, lists, tables, and relative links after editing.

## Decision boundaries

Do not invent product or technical decisions to fill a gap. In particular, do not select or imply:

- a technology stack, architecture, deployment platform, or dependency;
- payment or financial flows;
- logistics, storage, or delivery responsibilities;
- food-safety processes or assurances; or
- beneficiary identity, eligibility, or data models.

Record unresolved matters as assumptions or focused questions in the [product brief](docs/product-brief.md). Decisions should be made only after the relevant context, participants, ownership, and tradeoffs are understood.

## Review checklist

- [ ] The change has one clear purpose.
- [ ] Statements are labeled as supplied context, proposals, assumptions, or decisions where needed.
- [ ] No out-of-scope product or technical behavior is implied.
- [ ] Documentation uses clear, neutral English.
- [ ] Relative links resolve and formatting is coherent.
- [ ] `git diff --check` passes.
