import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/writing", destination: "/notes", permanent: false },
      { source: "/writing/:slug", destination: "/notes/:slug", permanent: false },
      { source: "/blog", destination: "/notes", permanent: false },
    ];
  },
};

export default nextConfig;
