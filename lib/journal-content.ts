import {
  JOURNAL_CONTENT_TYPES,
  JOURNAL_DEPARTMENTS,
  JOURNAL_PROJECT_TYPES,
  journalArticles,
  type JournalArticle,
  type JournalContentType,
  type JournalDepartment,
  type JournalProjectType,
  type JournalSection,
} from "@/data/journal";

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
  title: "JOURNAL",
  subtitle: "QUIET LUXURY / EDITORIAL ARCHIVE",
  description:
    "SESSİZ LÜKSÜN MİMARİ OKUMASI, TEKNİK NOTLAR VE PROJE BAĞLANTILARIYLA BİR DERGİ ALGISINDA SUNULUR.",
  featuredArticleSlug: journalArticles[0]?.slug ?? "",
};

const departmentValues = new Set(JOURNAL_DEPARTMENTS.map((item) => item.value));
const projectTypeValues = new Set(JOURNAL_PROJECT_TYPES.map((item) => item.value));
const contentTypeValues = new Set(JOURNAL_CONTENT_TYPES.map((item) => item.value));

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function stringOr(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
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
    case "image":
      return {
        type: "image",
        src: stringOr(section.src, ""),
        alt: stringOr(section.alt, `Journal section image ${index + 1}`),
        caption: typeof section.caption === "string" && section.caption.trim() ? section.caption.trim() : undefined,
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
      ? article.relatedProjectSlugs.filter((value: unknown): value is string => typeof value === "string" && value.trim()).map((value: string) => value.trim())
      : [...base.relatedProjectSlugs],
    intro: stringOr(article?.intro, base.intro),
    sections: Array.isArray(article?.sections) && article.sections.length > 0
      ? article.sections.map((section: any, sectionIndex: number) => normalizeSection(section, sectionIndex))
      : base.sections.map((section, sectionIndex) => normalizeSection(section, sectionIndex)),
  };
}

export function cloneJournalArticles(articles: JournalArticle[]) {
  return articles.map((article) => clone(article));
}

export function createDefaultJournalDraft(): JournalPageDraft {
  const articles = cloneJournalArticles(journalArticles);
  return {
    pageTitle: "JOURNAL",
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
  const fallbackArticles = cloneJournalArticles(journalArticles);
  const sourceArticles = rawArticles.length > 0 ? rawArticles : fallbackArticles;
  const articles = sourceArticles.map((article, index) => normalizeArticle(article, fallbackArticles[index] ?? fallbackArticles[0], index));

  return {
    pageTitle: stringOr(payload?.title, "JOURNAL"),
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
