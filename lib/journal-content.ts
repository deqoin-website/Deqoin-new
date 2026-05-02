import {
  JOURNAL_CONTENT_TYPES,
  JOURNAL_DEPARTMENTS,
  JOURNAL_PROJECT_TYPES,
  journalArticles,
  type JournalImageAsset,
  type JournalArticle,
  type JournalContentType,
  type JournalDepartment,
  type JournalProjectType,
  type JournalSection,
} from "@/data/journal";
import { journalSeoPackArticles } from "@/data/journal-seo-pack";

export type JournalHeroDraft = {
  title: string;
  subtitle: string;
  description: string;
  featuredArticleSlug: string;
};

export type JournalPageDraft = {
  pageTitle: string;
  hero: JournalHeroDraft;
  articles: JournalArticle[];
};

type JournalCmsSection = {
  id?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  type?: string;
  content?: {
    featuredArticleSlug?: string;
    articles?: JournalArticle[];
  };
};

type JournalModelPayload = {
  page?: string;
  title?: string;
  hero?: {
    title?: string;
    subtitle?: string;
    description?: string;
    featuredArticleSlug?: string;
  };
  articles?: JournalArticle[];
  sections?: JournalCmsSection[];
};

const DEFAULT_HERO: JournalHeroDraft = {
  title: "journal",
  subtitle: "deqoin journal / editorial archive",
  description:
    "deqoin journal, iç mimarlık, mekan tasarımı ve uygulama notlarını sade bir blog diliyle bir araya getirir.",
  featuredArticleSlug: journalSeoPackArticles[0]?.slug ?? journalArticles[0]?.slug ?? "",
};

const LEGACY_JOURNAL_SLUGS = new Set([
  "sukun-cizgi-skyline-residence",
  "malzeme-sessizligi-lumina-gallery",
  "kurumsal-akis-nexus",
  "karma-kullanim-vertex",
  "ticari-cephe-obsidian",
]);

const departmentValues = new Set(JOURNAL_DEPARTMENTS.map((item) => item.value));
const projectTypeValues = new Set(JOURNAL_PROJECT_TYPES.map((item) => item.value));
const contentTypeValues = new Set(JOURNAL_CONTENT_TYPES.map((item) => item.value));

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

export function normalizeJournalText(value: unknown) {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

export function toTurkishLowerCase(value: string) {
  return value.toLocaleLowerCase("tr-TR");
}

export function toTurkishUpperCase(value: string) {
  return value.toLocaleUpperCase("tr-TR");
}

function stringOr(value: unknown, fallback: string) {
  const normalized = normalizeJournalText(value);
  return normalized || fallback;
}

function normalizeGalleryItem(item: any, index: number): JournalImageAsset {
  if (typeof item === "string") {
    return {
      src: stringOr(item, ""),
      alt: `Journal gallery image ${index + 1}`,
    };
  }

  return {
    src: stringOr(item?.src ?? item?.url, ""),
    alt: stringOr(item?.alt, `Journal gallery image ${index + 1}`),
    caption: typeof item?.caption === "string" && item.caption.trim() ? item.caption.trim() : undefined,
  };
}

function pickAllowedValue<T extends string>(value: unknown, allowed: Set<T>, fallback: T) {
  return typeof value === "string" && allowed.has(value as T) ? (value as T) : fallback;
}

function pickAllowedList<T extends string>(value: unknown, allowed: Set<T>, fallback: T[]) {
  if (!Array.isArray(value)) return [...fallback];
  const next = value.filter((item): item is T => typeof item === "string" && allowed.has(item as T));
  return next.length > 0 ? next : [...fallback];
}

function normalizeSection(section: any, index: number): JournalSection {
  if (!section || typeof section !== "object") {
    return {
      type: "paragraph",
      body: "",
    };
  }

  switch (section.type) {
    case "heading":
      return {
        type: "heading",
        level: section.level === 3 ? 3 : 2,
        text: stringOr(section.text ?? section.body, `Journal heading ${index + 1}`),
      };
    case "list":
      return {
        type: "list",
        items: Array.isArray(section.items)
          ? section.items.map((item: unknown) => stringOr(item, "")).filter((item: string) => Boolean(item))
          : [],
      };
    case "image":
      return {
        type: "image",
        src: stringOr(section.src, ""),
        alt: stringOr(section.alt, `Journal section image ${index + 1}`),
        caption: typeof section.caption === "string" && section.caption.trim() ? section.caption.trim() : undefined,
        gallery: Array.isArray(section.gallery) ? section.gallery.map((item: any, galleryIndex: number) => normalizeGalleryItem(item, galleryIndex)).filter((item: JournalImageAsset) => Boolean(item.src)) : [],
      };
    case "technical":
      return {
        type: "technical",
        items: Array.isArray(section.items)
          ? section.items.map((item: any) => ({
              label: stringOr(item?.label, "BAŞLIK"),
              value: stringOr(item?.value, "DEĞER"),
            }))
          : [],
      };
    case "related":
      return {
        type: "related",
        title: stringOr(section.title, "İLGİLİ PROJE BAĞLANTILARI"),
        items: Array.isArray(section.items)
          ? section.items.map((item: any) => ({
              slug: stringOr(item?.slug, ""),
              title: stringOr(item?.title, "YENİ BAŞLIK"),
              label: stringOr(item?.label, "PROJE"),
            }))
          : [],
      };
    case "paragraph":
    default:
      return {
        type: "paragraph",
        body: stringOr(section.body, ""),
      };
  }
}

function normalizeArticle(article: any, fallback: JournalArticle, index: number): JournalArticle {
  const base = clone(fallback);
  return {
    ...base,
    slug: stringOr(article?.slug, base.slug || `journal-entry-${index + 1}`),
    title: stringOr(article?.title, base.title || `JOURNAL ENTRY ${index + 1}`),
    deck: stringOr(article?.deck, base.deck),
    coverImage: stringOr(article?.coverImage, base.coverImage),
    publishedAt: stringOr(article?.publishedAt, base.publishedAt),
    readTime: stringOr(article?.readTime, base.readTime),
    articleType: pickAllowedValue<JournalContentType>(article?.articleType, contentTypeValues, base.articleType),
    departments: pickAllowedList<JournalDepartment>(article?.departments, departmentValues, base.departments),
    projectTypes: pickAllowedList<JournalProjectType>(article?.projectTypes, projectTypeValues, base.projectTypes),
    contentTypes: pickAllowedList<JournalContentType>(article?.contentTypes, contentTypeValues, base.contentTypes),
    relatedProjectSlugs: Array.isArray(article?.relatedProjectSlugs)
      ? article.relatedProjectSlugs
          .filter((value: unknown): value is string => typeof value === "string" && value.trim().length > 0)
          .map((value: string) => value.replace(/\s+/g, " ").trim())
      : [...base.relatedProjectSlugs],
    intro: stringOr(article?.intro, base.intro),
    sections: Array.isArray(article?.sections) && article.sections.length > 0
      ? article.sections.map((section: any, sectionIndex: number) => normalizeSection(section, sectionIndex))
      : base.sections.map((section, sectionIndex) => normalizeSection(section, sectionIndex)),
  };
}

function shouldUseCuratedDefaults(rawArticles: any[]) {
  if (rawArticles.length === 0) return true;
  return rawArticles.every((article) => typeof article?.slug === "string" && LEGACY_JOURNAL_SLUGS.has(article.slug));
}

export function cloneJournalArticles(articles: JournalArticle[]) {
  return articles.map((article) => clone(article));
}

export function createDefaultJournalDraft(): JournalPageDraft {
  const articles = cloneJournalArticles(journalSeoPackArticles.length > 0 ? journalSeoPackArticles : journalArticles);
  return {
    pageTitle: "journal",
    hero: {
      ...DEFAULT_HERO,
      featuredArticleSlug: articles[0]?.slug ?? "",
    },
    articles,
  };
}

export function normalizeJournalDraft(payload: any): JournalPageDraft {
  const directHero = payload?.hero;
  const directArticles = Array.isArray(payload?.articles) ? payload.articles : [];

  const section = Array.isArray(payload?.sections)
    ? (payload.sections.find((item: any) => item?.id === "journal" || item?.type === "journal") as JournalCmsSection | undefined) ||
      (payload.sections[0] as JournalCmsSection | undefined)
    : undefined;

  const rawArticles = directArticles.length > 0
    ? directArticles
    : Array.isArray(section?.content?.articles)
      ? section.content.articles
      : [];
  const fallbackArticles = cloneJournalArticles(journalSeoPackArticles.length > 0 ? journalSeoPackArticles : journalArticles);
  if (shouldUseCuratedDefaults(rawArticles)) {
    return createDefaultJournalDraft();
  }
  const sourceArticles: any[] = rawArticles.length > 0 ? rawArticles : fallbackArticles;
  const articles = sourceArticles.map((article: any, index: number) =>
    normalizeArticle(article, fallbackArticles[index] ?? fallbackArticles[0], index),
  );

  return {
    pageTitle: stringOr(payload?.title, "journal"),
    hero: {
      title: stringOr(directHero?.title, stringOr(section?.title, DEFAULT_HERO.title)),
      subtitle: stringOr(directHero?.subtitle, stringOr(section?.subtitle, DEFAULT_HERO.subtitle)),
      description: stringOr(directHero?.description, stringOr(section?.description, DEFAULT_HERO.description)),
      featuredArticleSlug: stringOr(
        directHero?.featuredArticleSlug,
        stringOr(section?.content?.featuredArticleSlug, articles[0]?.slug ?? DEFAULT_HERO.featuredArticleSlug),
      ),
    },
    articles,
  };
}

export function serializeJournalDraft(draft: JournalPageDraft) {
  return {
    page: "journal",
    title: draft.pageTitle,
    hero: {
      title: draft.hero.title,
      subtitle: draft.hero.subtitle,
      description: draft.hero.description,
      featuredArticleSlug: draft.hero.featuredArticleSlug,
    },
    articles: draft.articles,
  };
}

export function getJournalArticleFromDraft(draft: JournalPageDraft, slug: string) {
  return draft.articles.find((article) => article.slug === slug) ?? null;
}

export { DEFAULT_HERO as DEFAULT_JOURNAL_HERO };
