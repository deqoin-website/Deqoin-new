import connectToDatabase from "@/lib/mongodb";
import { mimariServices } from "@/data/mimari-hizmetler";
import { projectsData } from "@/data/projects";
import { uygulamaBirimleri } from "@/data/uygulama-birimleri";
import { createDefaultJournalDraft } from "@/lib/journal-content";
import { getSiteSeoConfig } from "@/lib/site-seo";
import Department from "@/models/Department";
import Project from "@/models/Project";
import JournalContent from "@/models/JournalContent";
import {
  getMaterialCategory,
  getMaterialProduct,
  resolveMaterialCategorySlug,
} from "@/data/materyal-urunleri";
import { normalizeSeoMeta, seoKeywordsToArray } from "@/lib/seo-meta";

type SeoConfig = {
  title: string;
  description: string;
  keywords: string[];
};

const truncate = (value: string, max = 160) => {
  const text = value.trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
};

const baseKeywords = [
  "deqoin",
  "nevşehir iç mimarlık",
  "kapadokya iç mimarlık",
  "villa projesi",
  "villa tasarımı",
];

function seoFromMeta(meta?: any, fallback?: Partial<SeoConfig>) {
  const normalized = normalizeSeoMeta(meta, {
    title: fallback?.title || "",
    description: fallback?.description || "",
    keywords: fallback?.keywords?.join(", ") || "",
    ogImage: "",
    canonicalPath: "",
    noIndex: false,
    schemaType: "",
  });

  return {
    title: normalized.title || fallback?.title || "",
    description: normalized.description || fallback?.description || "",
    keywords: seoKeywordsToArray(normalized.keywords).length > 0
      ? [...new Set([...baseKeywords, ...seoKeywordsToArray(normalized.keywords)])]
      : fallback?.keywords || [...baseKeywords],
    ogImage: normalized.ogImage,
    canonicalPath: normalized.canonicalPath,
    noIndex: normalized.noIndex,
    schemaType: normalized.schemaType,
  };
}

export function getStaticSeo(pathname: string): SeoConfig {
  const base = getSiteSeoConfig(pathname);
  return {
    title: base.title,
    description: base.description,
    keywords: base.keywords,
  };
}

export async function getMimariDetailSeo(slug: string): Promise<SeoConfig> {
  try {
    await connectToDatabase();
    const doc = await Department.findOne({ slug }).lean();
    if (doc?.seoMeta) {
      const seo = seoFromMeta(doc.seoMeta, {
        title: `${doc.title || "Mimari"} | deqoin`,
        description: doc.description || "Mimari hizmet detaylarını inceleyin.",
        keywords: [...baseKeywords, "mimari tasarım", "villa mimarlık", "projelendirme"],
      });
      return {
        title: seo.title,
        description: seo.description,
        keywords: seo.keywords,
      };
    }
  } catch {
    // Static fallback below.
  }

  const service = mimariServices.find((item) => item.slug === slug);
  const titleBase = service?.title || "Mimari";
  const titleMap: Record<string, string> = {
    mimarlik: "Mimarlık | Villa ve Mimari Proje | deqoin",
    "ic-mimarlik": "İç Mimarlık | Villa ve İç Mekan Tasarımı | deqoin",
    restorasyon: "Restorasyon | Tarihi Yapı ve Villa Dönüşümü | deqoin",
    "peyzaj-mimarligi": "Peyzaj Mimarlığı | Villa Bahçesi ve Dış Mekan | deqoin",
    "insaat-muhendisligi": "İnşaat Mühendisliği | Villa ve Yapı Projeleri | deqoin",
    "elektrik-elektronik-muhendisligi": "Mekanik Mühendisliği | Villa Otomasyon ve Altyapı | deqoin",
  };

  const descriptionMap: Record<string, string> = {
    mimarlik: "Villa, konut ve ticari yapılar için mimari proje ve tasarım hizmeti. Detayları inceleyin.",
    "ic-mimarlik": "Villa ve iç mekanlar için sade, net ve uygulanabilir iç mimarlık çözümleri. Hemen inceleyin.",
    restorasyon: "Tarihi yapı, villa ve özel konutlarda restorasyon ve dönüşüm hizmetleri. Detayları görün.",
    "peyzaj-mimarligi": "Villa bahçesi ve dış mekanlar için peyzaj tasarımı. Uygun çözümü inceleyin.",
    "insaat-muhendisligi": "Villa ve yapı projelerinde mühendislik, statik ve projelendirme hizmeti. Çözümü inceleyin.",
    "elektrik-elektronik-muhendisligi": "Villa otomasyon, altyapı ve mekanik sistemleri için teknik çözümler. Detayları görün.",
  };

  return {
    title: titleMap[slug] || `${titleBase} | deqoin`,
    description: truncate(descriptionMap[slug] || service?.description?.replace(/\s+/g, " ").split(".")[0] || "Mimari hizmet detaylarını inceleyin.", 155),
    keywords: [...baseKeywords, "mimari tasarım", "villa mimarlık", "projelendirme"],
  };
}

export async function getUygulamaDetailSeo(slug: string): Promise<SeoConfig> {
  try {
    await connectToDatabase();
    const doc = await Department.findOne({ slug }).lean();
    if (doc?.seoMeta) {
      const seo = seoFromMeta(doc.seoMeta, {
        title: `${doc.title || "Uygulama"} | deqoin`,
        description: doc.description || "Uygulama hizmet detaylarını inceleyin.",
        keywords: [...baseKeywords, "uygulama ekibi", "şantiye yönetimi", "villa uygulaması"],
      });
      return {
        title: seo.title,
        description: seo.description,
        keywords: seo.keywords,
      };
    }
  } catch {
    // Static fallback below.
  }

  const service = uygulamaBirimleri.find((item) => item.slug === slug);
  const titleMap: Record<string, string> = {
    "insaat-ekipleri": "İnşaat Ekipleri | Villa ve Şantiye Uygulaması | deqoin",
    "siva-ve-alci-ekipleri": "Sıva ve Alçı Ekipleri | İç Mekan Uygulaması | deqoin",
    "boya-ekipleri": "Boya Ekipleri | İtalyan Boya Uygulaması | deqoin",
    "duvar-sanatcilari": "Duvar Sanatçıları | Dekoratif Yüzey Uygulaması | deqoin",
    ressamlar: "Ressamlar | Özel Duvar ve Renk Uygulamaları | deqoin",
    heykeltiraslar: "Heykeltıraşlar | Özel Form ve Uygulama Detayları | deqoin",
  };

  const descriptionMap: Record<string, string> = {
    "insaat-ekipleri": "Villa ve yapı projelerinde saha uygulaması, ekip yönetimi ve şantiye takibi. Detayları inceleyin.",
    "siva-ve-alci-ekipleri": "İç mekanlarda sıva ve alçı uygulamaları için teknik ekip desteği. Hemen inceleyin.",
    "boya-ekipleri": "İtalyan boya ve dekoratif boya uygulamaları için saha ekibi. Çözümü görün.",
    "duvar-sanatcilari": "Dekoratif duvar ve yüzey uygulamaları için uzman ekipler. Detayları inceleyin.",
    ressamlar: "Özel duvar resimleri ve renk uygulamaları için ekip hizmeti. Projeyi görün.",
    heykeltiraslar: "Özel form, rölyef ve heykelsi uygulamalar için ekip çözümleri. Detayları görün.",
  };

  return {
    title: titleMap[slug] || `${service?.title || "Uygulama"} | deqoin`,
    description: truncate(descriptionMap[slug] || service?.description || "Uygulama hizmet detaylarını inceleyin.", 155),
    keywords: [...baseKeywords, "uygulama ekibi", "şantiye yönetimi", "villa uygulaması"],
  };
}

export async function getGalleryDetailSeo(slug: string): Promise<SeoConfig> {
  try {
    await connectToDatabase();
    const doc = await Project.findOne({ slug }).lean();
    if (doc?.seoMeta) {
      const seo = seoFromMeta(doc.seoMeta, {
        title: `${doc.title || "Proje"} | Proje Galerisi | deqoin`,
        description: doc.description || "Proje galerisi.",
        keywords: [...baseKeywords, "proje galerisi", "mimari referans", "villa referansları"],
      });
      return {
        title: seo.title,
        description: seo.description,
        keywords: seo.keywords,
      };
    }
  } catch {
    // Static fallback below.
  }

  const project = projectsData.find((item) => item.slug === slug);

  if (!project) {
    return getStaticSeo("/galeri");
  }

  return {
    title: `${project.title} | Proje Galerisi | deqoin`,
    description: truncate(
      `Villa, konut ve mimari proje referansı. ${project.label} kategorisindeki çalışmayı inceleyin ve detayları görün.`,
      155,
    ),
    keywords: [...baseKeywords, "proje galerisi", "mimari referans", "villa referansları"],
  };
}

export async function getJournalDetailSeo(slug: string): Promise<SeoConfig> {
  try {
    await connectToDatabase();
    const doc = await JournalContent.findOne({ page: "journal" }).lean();
    const seoMeta = doc?.seoMeta;
    const draft = createDefaultJournalDraft();
    const article = draft.articles.find((item) => item.slug === slug);
    const dbArticle = Array.isArray(doc?.articles) ? doc.articles.find((item: any) => item?.slug === slug) : null;

    if (dbArticle?.seoMeta || seoMeta) {
      const seo = seoFromMeta(dbArticle?.seoMeta || seoMeta, {
        title: `${dbArticle?.title || article?.title || "deqoin journal"} | deqoin`,
        description: dbArticle?.deck || article?.deck || "Mimari ve uygulama notlarını inceleyin.",
        keywords: [...baseKeywords, "mimari içerik", "journal", "uygulama notları"],
      });
      return {
        title: seo.title,
        description: seo.description,
        keywords: seo.keywords,
      };
    }
  } catch {
    // Static fallback below.
  }

  const draft = createDefaultJournalDraft();
  const article = draft.articles.find((item) => item.slug === slug);

  if (!article) {
    return getStaticSeo("/journal");
  }

  return {
    title: `${article.title} | deqoin Journal`,
    description: truncate(article.deck || article.intro || "Mimari ve uygulama notlarını inceleyin.", 155),
    keywords: [...baseKeywords, "mimari içerik", "journal", "uygulama notları"],
  };
}

export async function getMaterialCategorySeo(categorySlug: string): Promise<SeoConfig> {
  const resolvedSlug = resolveMaterialCategorySlug(categorySlug);
  const category = getMaterialCategory(resolvedSlug);
  try {
    await connectToDatabase();
    const doc = await Department.findOne({ slug: resolvedSlug }).lean();
    if (doc?.seoMeta) {
      const seo = seoFromMeta(doc.seoMeta, {
        title: `${doc.title || category?.title || resolvedSlug} | Materyal Stüdyo | deqoin`,
        description: doc.description || category?.description || "Materyal stüdyo içeriğini inceleyin.",
        keywords: [...baseKeywords, "materyal stüdyosu", "mimari malzeme"],
      });
      return {
        title: seo.title,
        description: seo.description,
        keywords: seo.keywords,
      };
    }
  } catch {
    // Static fallback below.
  }

  if (!category) {
    return getStaticSeo("/materyal-studyo");
  }

  return {
    title: `${category.title} | Materyal Stüdyo | deqoin`,
    description: truncate(
      `${category.description} Villa ve iç mekan projeleri için ürünleri inceleyin.`,
      155,
    ),
    keywords: [...baseKeywords, "materyal stüdyosu", "mimari malzeme", category.title.toLowerCase()],
  };
}

export async function getMaterialProductSeo(categorySlug: string, productSlug: string): Promise<SeoConfig> {
  const resolvedSlug = resolveMaterialCategorySlug(categorySlug);
  const product = getMaterialProduct(resolvedSlug, productSlug);
  const category = getMaterialCategory(resolvedSlug);
  try {
    await connectToDatabase();
    const doc = await Department.findOne({ slug: resolvedSlug }).lean();
    const dbProduct = Array.isArray(doc?.products) ? doc.products.find((item: any) => item?.slug === productSlug) : null;
    if (dbProduct?.seoMeta || doc?.seoMeta) {
      const seo = seoFromMeta(dbProduct?.seoMeta || doc.seoMeta, {
        title: `${dbProduct?.title || product?.title || category?.title || "Materyal"} | deqoin`,
        description: dbProduct?.shortInfo || product?.shortInfo || product?.description || "Ürün detaylarını inceleyin.",
        keywords: [...baseKeywords, "materyal stüdyosu", "mimari malzeme"],
      });
      return {
        title: seo.title,
        description: seo.description,
        keywords: seo.keywords,
      };
    }
  } catch {
    // Static fallback below.
  }

  if (!product || !category) {
    return getStaticSeo("/materyal-studyo");
  }

  return {
    title: `${product.title} | ${category.title} | deqoin`,
    description: truncate(
      `${product.shortInfo}. ${product.description} Villa ve iç mekan projeleri için teknik detayları inceleyin.`,
      155,
    ),
    keywords: [
      ...baseKeywords,
      "materyal stüdyosu",
      "mimari malzeme",
      product.title.toLowerCase(),
      category.title.toLowerCase(),
    ],
  };
}
