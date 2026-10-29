import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/writing", destination: "/notes", permanent: false },
      { source: "/writing/:slug", destination: "/notes", permanent: false },
      { source: "/notes/:slug", destination: "/notes", permanent: false },
      { source: "/blog", destination: "/notes", permanent: false },
      // Old room hashes → Five Prints chapters (track is a real route now)
      { source: "/strength", destination: "/lift", permanent: false },
      { source: "/music", destination: "/guitar", permanent: false },
      { source: "/building", destination: "/build", permanent: false },
      { source: "/engineering", destination: "/build", permanent: false },
      { source: "/:gone(contact|credits)", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
