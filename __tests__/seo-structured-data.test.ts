import {
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  buildLocalBusinessJsonLd,
  buildProductJsonLd,
  buildServiceJsonLd,
  buildWebPageJsonLd,
} from "@/lib/seo-structured-data";

describe("seo structured data", () => {
  it("builds absolute breadcrumb and page schemas", () => {
    const page = buildWebPageJsonLd({
      name: "Mimari Tasarım | deqoin",
      description: "Villa projeleri için mimari tasarım hizmeti.",
      url: "/mimari",
    });

    const breadcrumb = buildBreadcrumbJsonLd([
      { name: "Ana Sayfa", url: "/" },
      { name: "Mimari", url: "/mimari" },
    ]);

    expect(page["@type"]).toBe("WebPage");
    expect(page.url).toContain("/mimari");
    expect(breadcrumb.itemListElement).toHaveLength(2);
  });

  it("builds service, product, article and local business schemas", () => {
    const service = buildServiceJsonLd({
      name: "Villa Tasarımı",
      description: "Sade ve uygulanabilir villa projeleri.",
      url: "/mimari/villa",
    });
    const product = buildProductJsonLd({
      name: "Aydınlatma",
      description: "Mekan için teknik aydınlatma çözümü.",
      url: "/materyal-studyo/aydinlatma/linea",
      sku: "L-001",
      category: "Aydınlatma",
    });
    const article = buildArticleJsonLd({
      name: "Nevşehir'de iç mimarlık",
      description: "Yerel proje kararları için kısa rehber.",
      url: "/journal/nevsehirde-ic-mimarlik",
    });
    const localBusiness = buildLocalBusinessJsonLd();

    expect(service["@type"]).toBe("Service");
    expect(product["@type"]).toBe("Product");
    expect(article["@type"]).toBe("Article");
    expect(localBusiness["@type"]).toEqual(["LocalBusiness", "ProfessionalService"]);
  });
});
