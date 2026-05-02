import { mimariServices } from "@/data/mimari-hizmetler";
import { projectsData } from "@/data/projects";
import { uygulamaBirimleri } from "@/data/uygulama-birimleri";
import { createDefaultJournalDraft } from "@/lib/journal-content";
import { getSiteSeoConfig } from "@/lib/site-seo";
import {
  getMaterialCategory,
  getMaterialProduct,
  resolveMaterialCategorySlug,
} from "@/data/materyal-urunleri";

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

export function getStaticSeo(pathname: string): SeoConfig {
  const base = getSiteSeoConfig(pathname);
  return {
    title: base.title,
    description: base.description,
    keywords: base.keywords,
  };
}

export function getMimariDetailSeo(slug: string): SeoConfig {
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

export function getUygulamaDetailSeo(slug: string): SeoConfig {
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
