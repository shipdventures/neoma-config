---
name: Release process
description: Feature branches → PR → merge to main → version bump on main. Never bump version on feature branches.
type: project
---

Release process for @neoma/config:
1. Create a new branch
2. Do the work, including updating the changelog under `[Unreleased]`
3. Add, commit, push, open PR
4. Once approved, merge into main
5. Once back on main, bump the version

**Why:** Version bumps are a separate post-merge concern, not part of feature work.
**How to apply:** Never include version bumps in feature branch PRs. Changelog updates go under `[Unreleased]`.
