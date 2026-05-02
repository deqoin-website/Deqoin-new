import { getGalleryDetailSeo, getMaterialCategorySeo, getMaterialProductSeo, getMimariDetailSeo, getUygulamaDetailSeo } from "@/lib/seo-routes";

describe("seo routes", () => {
  it("keeps dynamic page titles within seo limits", async () => {
    const items = [
      getMimariDetailSeo("ic-mimarlik"),
      getUygulamaDetailSeo("boya-ekipleri"),
      await getGalleryDetailSeo("skyline-residence"),
      await getMaterialCategorySeo("aydinlatma"),
      await getMaterialProductSeo("aydinlatma", "hokasu-halo"),
    ];

    items.forEach((item) => {
      expect(item.title.length).toBeLessThanOrEqual(60);
      expect(item.description.length).toBeLessThanOrEqual(160);
      expect(item.title.toLowerCase()).toContain("deqoin");
    });
  });

  it("adds villa language to service seo", () => {
    expect(getMimariDetailSeo("mimarlik").description.toLowerCase()).toContain("villa");
    expect(getUygulamaDetailSeo("insaat-ekipleri").description.toLowerCase()).toContain("villa");
  });
});
