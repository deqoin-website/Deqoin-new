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
  articles: seoPackArticles,
};
