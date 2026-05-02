import sitemap from "@/app/sitemap";

const siteOrigin =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
  process.env.VERCEL_URL?.trim() ||
  "https://www.deqoin.com";

const absoluteUrl = (path: string) => new URL(path, siteOrigin.startsWith("http") ? siteOrigin : `https://${siteOrigin}`).toString();

describe("sitemap", () => {
  it("includes public routes and excludes admin routes", () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toContain(absoluteUrl("/"));
    expect(urls).toContain(absoluteUrl("/mimari"));
    expect(urls).toContain(absoluteUrl("/uygulama"));
    expect(urls).toContain(absoluteUrl("/materyal-studyo"));
    expect(urls).toContain(absoluteUrl("/journal"));
    expect(urls.some((url) => url.includes("/admin"))).toBe(false);
    expect(urls.some((url) => url.includes("/maintenance"))).toBe(false);
    expect(urls.some((url) => url.includes("/test-upload"))).toBe(false);
    expect(entries.length).toBeGreaterThan(40);
  });
});
