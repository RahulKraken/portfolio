# Rahul Kumar — personal site

The existing editorial portfolio, now preparing for an interactive workspace redesign.
The 3D implementation has not started.

Active branch: `codex/interactive-room`. Shared baseline: `develop`.
See [repository map](docs/repository.md) for preserved experiments and draft PRs,
and [design brief](docs/interactive-room.md) for the new direction.

Stack: **Next.js (App Router)** · TypeScript · CSS. No CMS, no forms, no environment variables.

## Local

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
If another project uses port 3000, run `npm run dev -- --port 3001`.

```bash
npm run build
npm start
npm run lint
```

Requires Node 20.9+.

## Deploy on Vercel

These are the existing deployment instructions; hosting settings were not independently
verified during repository cleanup. Work on the feature branch and review before merging
into `develop`. Feature pushes may create previews if the integration is enabled.

1. Import `RahulKraken/portfolio`.
2. Framework Preset: **Next.js**. Root Directory: empty. Output Directory: default. Production branch: **`develop`**.
3. No environment variables.
4. Attach `rahulkraken.com` under Project → Settings → Domains.

If a Git-authored preview fails on a Hobby private repo, Redeploy from the Vercel dashboard while logged in as the project owner.

## Copy and assets

The homepage is in `app/page.tsx`, shared UI in `components/`, and existing home
components in `components/home/`. Site details, projects, and engineering copy live
in `lib/`. Published images live in `public/photos/`, with current flipbook frames
under `public/photos/print/seq/`.

Originals live in `photos-raw/`, which is git-ignored and is not backed up by Git
pushes. Verify `public/cv.pdf` before linking it in the redesign. `/notes` is
currently empty; historical essay URLs redirect there, rather than serving an essay.
