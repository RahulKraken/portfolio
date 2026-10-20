# Personal site

A strip of photographs you move through by scrolling.

The previous homepage essay, *He doesn’t trust an instrument until he’s built it himself*, now lives at [`/notes/built-it-himself`](/notes/built-it-himself).

Stack: **Next.js (App Router)** · TypeScript · CSS. No CMS, no forms, no environment variables.

## Local

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build
npm start
```

Requires Node 20.9+.

## Deploy on Vercel

1. Import `RahulKraken/portfolio`.
2. Framework Preset: **Next.js**. Root Directory: empty. Output Directory: default. Production branch: **`develop`**.
3. No environment variables.
4. Attach `rahulkraken.com` under Project → Settings → Domains.

If a Git-authored preview fails on a Hobby private repo, Redeploy from the Vercel dashboard while logged in as the project owner.

## Copy and assets

The film is laid out in [`app/page.tsx`](app/page.tsx). Stills are in `public/photos/`; the scroll-scrubbed bursts are in `public/photos/seq/`. Originals live in `photos-raw/`, which is git-ignored. Replace `public/cv.pdf`.
