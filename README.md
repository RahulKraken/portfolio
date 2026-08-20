# Rahul Kumar — personal site

An identity-first personal site: rider, maker, musician, self-built. Not a resume. Built from the [Portfolio Website](https://app.notion.com/p/3c21644e44b681678cd5eba1291b8d12) brief in Notion.

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

Requires Node 20+.

## Deploy on Vercel

1. Push this repo to GitHub (already: `RahulKraken/portfolio`).
2. In [Vercel](https://vercel.com/new), **Import** the repository.
3. Vercel detects Next.js. Leave the defaults:
   - Framework Preset: Next.js
   - Build Command: `next build`
   - Output: default (no extra `vercel.json` needed)
   - Environment variables: none
4. Deploy. Attach `rahulkraken.com` under Project → Settings → Domains if you want the existing domain on this site.

That’s the whole pipeline. Subsequent pushes to the production branch rebuild automatically.

## Edit copy

All names, email, quotes, and section text live in [`lib/site.ts`](lib/site.ts). Visual language is in [`app/globals.css`](app/globals.css).
