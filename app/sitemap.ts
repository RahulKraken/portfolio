import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/track",
    "/strength",
    "/music",
    "/building",
    "/engineering",
    "/contact",
    "/credits",
    "/list-100",
    "/notes",
    "/notes/built-it-himself",
  ];
  return paths.map((path, i) => {
    const entry: MetadataRoute.Sitemap[number] = {
      url: `${site.url}${path}`,
      lastModified: new Date("2026-10-10"),
      changeFrequency: "monthly",
      priority: i === 0 ? 1 : 0.6,
    };
    return entry;
  });
}
