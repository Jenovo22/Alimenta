# Merge Manizales downloader into primary branch

## Goal
Merge the existing Manizales Socrata downloader commit into the repository's primary branch, `docs/initial-foundation`, without changing `Documentos-prototipos`, then publish the result.

## Tasks
- [x] Reconcile local feature commit with updated `origin/docs/initial-foundation`.
- [x] Run focused tests and inspect the merge; confirm `Documentos-prototipos` remains untouched relative to the target branch.
- [ ] Push the merged result to `docs/initial-foundation` and record the resulting commit.

## Evidence
- User authorized updating and merging into `docs/initial-foundation` and publishing it.
- Merge commit: `3e87d00` (`feat(data): merge Manizales downloader into primary branch`), parents `127a66a` and `d79cd34`.
- `python3 -m unittest discover -s tests -p 'test_manizales_downloader.py' -v`: 4 tests passed.
- `git diff --check`: passed.
- Candidate diff vs `origin/docs/initial-foundation`: 5 files, 282 insertions, 1 deletion; no `Documentos-prototipos/` paths.
- The pre-existing untracked LibreOffice lock file was not modified.
