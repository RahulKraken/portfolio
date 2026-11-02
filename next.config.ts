import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/writing", destination: "/notes", permanent: false },
      { source: "/writing/:slug", destination: "/notes", permanent: false },
      { source: "/notes/:slug", destination: "/notes", permanent: false },
      { source: "/blog", destination: "/notes", permanent: false },
      // Rooms used to be standalone pages
      { source: "/:room(track|strength|music|building|engineering)", destination: "/#:room", permanent: false },
      { source: "/:gone(contact|credits)", destination: "/", permanent: false },
    ];
  },
  // Preview only (preview/look-closer): serve the static "Look closer" mock as the home page.
  // beforeFiles runs ahead of app/page.tsx, so closing the PR restores the current home page untouched.
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/", destination: "/look-closer/index.html" },
        { source: "/look-closer", destination: "/look-closer/index.html" },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
