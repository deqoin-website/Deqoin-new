import {
  alignMaterialGalleryCrops,
  buildSavedMaterialProductDraft,
  createEmptyMaterialProduct,
  dedupeMaterialGallery,
  getLegacyStudioProductsFromMaterialCatalog,
  mapLegacyStudioProductToMaterialProduct,
  mapMaterialProductToLegacyStudioProduct,
  normalizeMaterialProduct,
  normalizeMaterialCrop,
  removeMaterialGalleryImage,
  reorderMaterialGallery,
  slugifyMaterial,
} from "@/lib/material-admin";

describe("material admin helpers", () => {
  it("creates a clean empty product draft without stock counts", () => {
    const draft = createEmptyMaterialProduct("aydinlatma");

    expect(draft.brandName).toBe("deqoin");
    expect(draft.stockLabel).toBe("Stokta");
    expect(draft.stockStatus).toBe("available");
    expect(draft.gallery.length).toBeGreaterThan(0);
    expect(draft).not.toHaveProperty("stockCount");
  });

  it("normalizes a product with category defaults and gallery crops", () => {
    const product = normalizeMaterialProduct(
      {
        slug: "hokasu-arc",
        title: "Hokasu Arc",
        image: "/images/material-studio/generated/aydinlatma/hokasu-arc-hero.svg",
        gallery: [
          "/images/material-studio/generated/aydinlatma/hokasu-arc-hero.svg",
          "/images/material-studio/generated/aydinlatma/hokasu-arc-gallery-1.svg",
        ],
        stockStatus: "limited",
        stockLabel: "Sınırlı stok",
      },
      "aydinlatma",
    );

    expect(product.slug).toBe("hokasu-arc");
    expect(product.categorySlug).toBe("aydinlatma");
    expect(product.heroImage).toContain("hokasu-arc-hero.svg");
    expect(product.gallery).toHaveLength(2);
    expect(product.galleryCrops).toHaveLength(2);
    expect(product.stockStatus).toBe("limited");
    expect(product.stockLabel).toBe("Sınırlı stok");
  });

  it("builds a saved product draft with unique gallery images and generated slug", () => {
    const saved = buildSavedMaterialProductDraft(
      {
        slug: "",
        categorySlug: "aydinlatma",
        brandName: "",
        title: "Hokasu Arc Deluxe",
        shortInfo: "Kısa bilgi",
        sku: "HOK-ARC-01",
        description: "Detaylı açıklama",
        heroImage: "/images/material-studio/generated/aydinlatma/hokasu-arc-hero.svg",
        heroCrop: { x: 60, y: 40, zoom: 1.2 },
        gallery: [
          "/images/material-studio/generated/aydinlatma/hokasu-arc-hero.svg",
          "/images/material-studio/generated/aydinlatma/hokasu-arc-hero.svg",
          "/images/material-studio/generated/aydinlatma/hokasu-arc-gallery-1.svg",
        ],
        galleryCrops: [
          { x: 60, y: 40, zoom: 1.2 },
          { x: 50, y: 50, zoom: 1 },
          { x: 40, y: 60, zoom: 1.1 },
        ],
        details: [{ label: "Ebat", value: "120 x 30 cm" }, { label: "", value: "" }],
        technicalDetails: [{ label: "Menşei", value: "İtalya" }, { label: "", value: "" }],
        applicationAreas: ["Salon"],
        techTags: ["Lineer", "Alüminyum"],
        stockStatus: "available",
        stockLabel: "Stokta",
        ctaVariant: "request-sample",
        ctaLabel: "Numune İste",
        filterValues: {
          "renk-tonu": ["Sıcak beyaz"],
          "yuzey-tipi": ["Mat"],
          "kullanim-alani": ["Salon"],
        },
      },
      "aydinlatma",
      9,
    );

    expect(saved.slug).toBe("hokasu-arc-deluxe");
    expect(saved.brandName).toBe("deqoin");
    expect(saved.gallery[0]).toContain("hokasu-arc-hero.svg");
    expect(saved.gallery).toHaveLength(2);
    expect(saved.details).toHaveLength(1);
    expect(saved.technicalDetails).toHaveLength(1);
    expect(saved).not.toHaveProperty("stockCount");
  });

  it("reorders and removes gallery items without losing crop alignment", () => {
    const gallery = ["a.svg", "b.svg", "c.svg"];
    const crops = [
      normalizeMaterialCrop({ x: 10, y: 10, zoom: 1 }),
      normalizeMaterialCrop({ x: 20, y: 20, zoom: 1.1 }),
      normalizeMaterialCrop({ x: 30, y: 30, zoom: 1.2 }),
    ];

    const reordered = reorderMaterialGallery(gallery, crops, 0, 2);
    expect(reordered.gallery).toEqual(["b.svg", "c.svg", "a.svg"]);
    expect(reordered.crops[2]).toEqual(crops[0]);

    const removed = removeMaterialGalleryImage(reordered.gallery, reordered.crops, 1, "fallback.svg");
    expect(removed.gallery).toEqual(["b.svg", "a.svg"]);
    expect(removed.heroImage).toBe("b.svg");
  });

  it("deduplicates galleries and keeps crop arrays aligned", () => {
    const gallery = dedupeMaterialGallery([" a.svg ", "a.svg", "b.svg"]);
    expect(gallery).toEqual(["a.svg", "b.svg"]);

    const crops = alignMaterialGalleryCrops(gallery, [{ x: 10, y: 10, zoom: 1 }]);
    expect(crops).toHaveLength(2);
    expect(crops[0]).toEqual({ x: 10, y: 10, zoom: 1 });
    expect(crops[1]).toEqual({ x: 50, y: 50, zoom: 1 });
    expect(slugifyMaterial("Hokasu Arc Deluxe")).toBe("hokasu-arc-deluxe");
  });

  it("bridges material catalog items to the legacy studio card shape and back", () => {
    const catalogProducts = getLegacyStudioProductsFromMaterialCatalog("aydinlatma");
    expect(catalogProducts).toHaveLength(10);
    expect(catalogProducts[0]).toHaveProperty("title");
    expect(catalogProducts[0]).toHaveProperty("link");

    const legacyCard = mapMaterialProductToLegacyStudioProduct(
      {
        slug: "hokasu-arc",
        categorySlug: "aydinlatma",
        title: "Hokasu Arc",
        brandName: "hokasu",
        heroImage: "/images/material-studio/generated/aydinlatma/hokasu-arc-hero.svg",
        gallery: ["/images/material-studio/generated/aydinlatma/hokasu-arc-hero.svg"],
        shortInfo: "Lineer",
        sku: "HOK-ARC",
        description: "Aydınlatma ürünü",
        details: [],
        filterValues: {
          "renk-tonu": [],
          "yuzey-tipi": [],
          "kullanim-alani": [],
        },
        technicalDetails: [],
        applicationAreas: [],
        stockStatus: "available",
        stockLabel: "Stokta",
        techTags: ["Lineer"],
        ctaVariant: "get-info",
        ctaLabel: "Bilgi Al",
      },
    );

    expect(legacyCard.category).toBe("Lineer");
    expect(legacyCard.price).toBe("Stokta");
    expect(legacyCard.link).toBe("/materyal-studyo/aydinlatma/hokasu-arc");

    const roundTrip = mapLegacyStudioProductToMaterialProduct(
      legacyCard,
      "aydinlatma",
      undefined,
      0,
    );

    expect(roundTrip.title).toBe("Hokasu Arc");
    expect(roundTrip.categorySlug).toBe("aydinlatma");
    expect(roundTrip.stockLabel).toBe("Stokta");
    expect(roundTrip.description).toBe("Aydınlatma ürünü");
  });
});
