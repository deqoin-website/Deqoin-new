import type { MetadataRoute } from "next";

import { createDefaultJournalDraft } from "@/lib/journal-content";
import { materialProducts, materyalKategorileri } from "@/data/materyal-urunleri";
import { mimariServices } from "@/data/mimari-hizmetler";
import { projectsData } from "@/data/projects";
import { uygulamaBirimleri } from "@/data/uygulama-birimleri";
import { normalizeSeoMeta } from "@/lib/seo-meta";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
  process.env.VERCEL_URL?.trim() ||
  "https://www.deqoin.com";

const siteOrigin = SITE_URL.startsWith("http") ? SITE_URL : `https://${SITE_URL}`;

function absoluteUrl(path: string) {
  return new URL(path.startsWith("/") ? path : `/${path}`, siteOrigin).toString();
}

function now() {
  return new Date();
}

function buildRoutes(departmentDocs: any[], projectDocs: any[], journalDoc: any): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: now(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...[
      "/hakkimizda",
      "/mimari",
      "/uygulama",
      "/materyal-studyo",
      "/galeri",
      "/journal",
      "/iletisim",
      "/tasarim",
      "/departman-ekipleri",
      "/kesif",
      "/faaliyet-alanlarimiz",
    ].map((path) => ({
      url: absoluteUrl(path),
      lastModified: now(),
      changeFrequency: "monthly" as const,
        priority: 0.8,
    })),
  ];

  const departmentMap = new Map((Array.isArray(departmentDocs) ? departmentDocs : []).map((doc: any) => [doc.slug, doc]));

  for (const service of mimariServices) {
    const doc = departmentMap.get(service.slug);
    const seo = normalizeSeoMeta(doc?.seoMeta || (service as any).seoMeta);
    if (seo.noIndex) continue;
    routes.push({
      url: absoluteUrl(`/mimari/${service.slug}`),
      lastModified: now(),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  for (const item of uygulamaBirimleri) {
    const doc = departmentMap.get(item.slug);
    const seo = normalizeSeoMeta(doc?.seoMeta || (item as any).seoMeta);
    if (seo.noIndex) continue;
    routes.push({
      url: absoluteUrl(`/uygulama/${item.slug}`),
      lastModified: now(),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  const visibleProjects = (Array.isArray(projectDocs) && projectDocs.length > 0 ? projectDocs : projectsData) as any[];
  for (const project of visibleProjects) {
    const seo = normalizeSeoMeta(project.seoMeta);
    if (seo.noIndex) continue;
    routes.push({
      url: absoluteUrl(`/galeri/${project.slug}`),
      lastModified: now(),
      changeFrequency: "monthly",
      priority: 0.65,
    });
  }

  const journalArticles = Array.isArray(journalDoc?.articles) && journalDoc.articles.length > 0
    ? journalDoc.articles
    : createDefaultJournalDraft().articles;
  for (const article of journalArticles as any[]) {
    const seo = normalizeSeoMeta(article.seoMeta);
    if (seo.noIndex) continue;
    routes.push({
      url: absoluteUrl(`/journal/${article.slug}`),
      lastModified: now(),
      changeFrequency: "monthly",
      priority: 0.65,
    });
  }

  for (const category of materyalKategorileri) {
    const doc = departmentMap.get(category.slug);
    const seo = normalizeSeoMeta(doc?.seoMeta || (category as any).seoMeta);
    if (seo.noIndex) continue;
    routes.push({
      url: absoluteUrl(`/materyal-studyo/${category.slug}`),
      lastModified: now(),
      changeFrequency: "monthly",
      priority: 0.75,
    });
  }

  const materialDocs = Array.isArray(departmentDocs) ? departmentDocs.filter((doc: any) => doc.slug && materyalKategorileri.some((cat) => cat.slug === doc.slug)) : [];
  const visibleProducts = materialDocs.length > 0
    ? materialDocs.flatMap((dept: any) => (Array.isArray(dept.products) ? dept.products.map((item: any) => ({ ...item, categorySlug: dept.slug })) : []))
    : materialProducts;
  for (const product of visibleProducts as any[]) {
    const seo = normalizeSeoMeta(product.seoMeta);
    if (seo.noIndex) continue;
    if (!product.categorySlug || !product.slug) continue;
    routes.push({
      url: absoluteUrl(`/materyal-studyo/${product.categorySlug}/${product.slug}`),
      lastModified: now(),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return routes;
}

async function buildDynamicRoutes() {
  const [
    { default: connectToDatabase },
    { default: Department },
    { default: Project },
    { default: JournalContent },
  ] = await Promise.all([
    import("@/lib/mongodb"),
    import("@/models/Department"),
    import("@/models/Project"),
    import("@/models/JournalContent"),
  ]);

  const [departmentDocs, projectDocs, journalDoc] = await Promise.all([
    connectToDatabase()
      .then(() => Department.find({}).lean())
      .catch(() => []),
    connectToDatabase()
      .then(() => Project.find({}).lean())
      .catch(() => []),
    connectToDatabase()
      .then(() => JournalContent.findOne({ page: "journal" }).lean())
      .catch(() => null),
  ]);

  return buildRoutes(departmentDocs, projectDocs, journalDoc);
}

export default function sitemap(): MetadataRoute.Sitemap | Promise<MetadataRoute.Sitemap> {
  if (process.env.NODE_ENV === "test") {
    return buildRoutes([], [], null);
  }

  return buildDynamicRoutes();
}
