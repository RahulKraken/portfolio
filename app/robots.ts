import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/lab", "/lab/"] },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
