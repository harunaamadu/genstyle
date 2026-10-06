import type { MetadataRoute } from "next";
import { siteUrl } from "@/data/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/cart", "/checkout", "/orders", "/login", "/register", "/api/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}