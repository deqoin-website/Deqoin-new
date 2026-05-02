import { getSiteSeoConfig } from "@/lib/site-seo";

describe("site seo", () => {
  it("returns villa-aware seo for core service pages", () => {
    const mimari = getSiteSeoConfig("/mimari");
    const uygulama = getSiteSeoConfig("/uygulama");
    const materyal = getSiteSeoConfig("/materyal-studyo");

    expect(mimari.title.length).toBeLessThanOrEqual(60);
    expect(uygulama.title.length).toBeLessThanOrEqual(60);
    expect(materyal.title.length).toBeLessThanOrEqual(60);

    expect(mimari.description.toLowerCase()).toContain("villa");
    expect(uygulama.description.toLowerCase()).toContain("villa");
    expect(materyal.description.toLowerCase()).toContain("villa");
  });

  it("returns local seo for home and contact pages", () => {
    const home = getSiteSeoConfig("/");
    const contact = getSiteSeoConfig("/iletisim");

    expect(home.title).toContain("deqoin");
    expect(home.keywords.join(",")).toContain("kapadokya iç mimarlık");
    expect(contact.description).toContain("Nevşehir");
  });
});
