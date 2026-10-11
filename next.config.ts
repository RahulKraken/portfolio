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
};

export default nextConfig;
