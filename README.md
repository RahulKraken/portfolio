# Rahul Kumar — personal site

He doesn’t trust an instrument until he’s built it himself. Built from the v2 brief on the [Portfolio Website](https://app.notion.com/p/3c21644e44b681678cd5eba1291b8d12) Notion page.

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
2. Framework Preset: **Next.js**. Root Directory: empty. Output Directory: default.
3. No environment variables.
4. Attach `rahulkraken.com` under Project → Settings → Domains if you want that domain on this site.

If a Git-authored preview fails on a Hobby private repo, Redeploy from the Vercel dashboard while logged in as the project owner.

Copy lives in [`app/page.tsx`](app/page.tsx) and [`lib/site.ts`](lib/site.ts).
