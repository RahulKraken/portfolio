# Repository map

Organized on 21 October 2026. Remote: `git@github.com:RahulKraken/portfolio.git`.
GitHub's default branch is `develop`.

## Active work

- `develop`: local pointer aligned with `origin/develop` at `950cbc9` during cleanup.
- `codex/interactive-room`: new working branch from that baseline. Contains
  organization documentation and the design brief; no 3D implementation yet.

Feature branches should track their own remote branch, not `origin/develop`.

```sh
git fetch origin --prune
git switch codex/interactive-room
git status --short --branch
```

## Preserved experiments

- `codex/archive-refine-2026-10-21`: snapshot of the previously uncommitted
  `refine` checkout, including staged deletions, new components, and public images.
  Commit `21bfadb`. Local `refine` is an alias for this snapshot.
- `codex/archive-paper-2026-10-21`: recovered paper experiment, including CSS,
  components, JSON, and images saved in the stash's untracked tree. Commit `892b69c`.
  Local `paper` is an alias for this snapshot.
- `redesign`: older showcase version at `79ae2a3`, also in `develop` history.

The original stash `fdebf0e` is retained. Normal application fails because
`app/page.tsx` appears in both its tracked and untracked trees. Recovery verified
the duplicate entries were identical, combined the trees using a temporary index,
and committed the result on the paper archive branch. No stash was dropped or
applied over the active checkout.

```sh
git show codex/archive-refine-2026-10-21:app/page.tsx
git show codex/archive-paper-2026-10-21:app/page.tsx
```

## Remote proposals

- [Draft PR #6: v5 editorial homepage](https://github.com/RahulKraken/portfolio/pull/6):
  `cursor/v5-homepage-185e`, tip `3a0045f` at cleanup time.
- [Draft PR #7: design labs](https://github.com/RahulKraken/portfolio/pull/7):
  `cursor/lab-directions-5739`, tip `a87e54a` at cleanup time.

These remain separate proposals. Other `origin/cursor/*` branches are retained.
Several changes were squash-merged, so ancestry alone cannot establish which
branches contain unique work. No remote branches or PRs were deleted, merged,
or closed during organization.

## Local-only material

- `photos-raw/`: approximately 4.6 GB of originals, ignored. Archive branches
  preserve published derivatives, not these originals.
- `.claude/` and generated `CLAUDE.md`: retained locally and excluded through
  `.git/info/exclude`; not application source.
- `.next/`, `node_modules/`, environment files, and local Vercel configuration:
  remain ignored by the project.
- `next-env.d.ts`: currently tracked and rewritten by Next.js between development
  and production builds. Inspect its diff before committing.

For future published model assets, record source, license, required attribution,
and any generation/editing notes alongside the asset documentation.
