import { getMaterialFilterGroups, materialProducts, materyalKategorileri, resolveMaterialCategorySlug } from "@/data/materyal-urunleri";

describe("material catalog data", () => {
  it("keeps every material category at ten products", () => {
    const categories = materyalKategorileri.map((category) => category.slug);
    for (const categorySlug of categories) {
      const products = materialProducts.filter((product) => product.categorySlug === categorySlug);
      expect(products).toHaveLength(10);
    }
  });

  it("keeps product slugs unique across the full catalog", () => {
    const slugs = materialProducts.map((product) => product.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("uses lighting-specific filters for the lighting category", () => {
    expect(resolveMaterialCategorySlug("aydinlatma")).toBe("aydinlatma");

    const groups = getMaterialFilterGroups("aydinlatma");
    expect(groups.map((group) => group.title)).toEqual(["Işık Tonu", "Armatür Formu", "Kullanım Alanı"]);
    expect(groups[0].options.map((option) => option.value)).toEqual(["sıcak beyaz", "nötr beyaz", "soğuk beyaz"]);
    expect(groups[1].options.map((option) => option.value)).toContain("lineer");
  });
});
