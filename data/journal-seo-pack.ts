import journalSeoPack from "./journal-seo-pack.json";
import type { JournalArticle } from "@/data/journal";
import type { JournalPageDraft } from "@/lib/journal-content";

type SeoPackArticle = JournalArticle & {
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    coverPrompt?: string;
  };
};

const seoPackArticles = (journalSeoPack.articles as SeoPackArticle[]).map(({ seo: _seo, ...article }) => article);

export const journalSeoPackArticles: JournalArticle[] = seoPackArticles;

export const journalSeoPackDraft: JournalPageDraft = {
  pageTitle: journalSeoPack.pageTitle,
  hero: journalSeoPack.hero,
  seoMeta: {
    title: "deqoin journal | nevşehir mimarlık ve uygulama notları",
    description: "deqoin journal içinde iç mimarlık, uygulama ve materyal notlarını inceleyin.",
    keywords: "deqoin, journal, nevşehir iç mimarlık, kapadokya mimarlık, uygulama notları",
    ogImage: "/images/logo-new.jpeg",
    canonicalPath: "/journal",
    noIndex: false,
    schemaType: "Article",
  },
  articles: seoPackArticles,
};
