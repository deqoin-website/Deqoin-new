import type { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
  process.env.VERCEL_URL?.trim() ||
  "https://www.deqoin.com";

const siteOrigin = SITE_URL.startsWith("http") ? SITE_URL : `https://${SITE_URL}`;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/maintenance", "/test-upload"],
      },
    ],
    sitemap: `${siteOrigin}/sitemap.xml`,
  };
}
