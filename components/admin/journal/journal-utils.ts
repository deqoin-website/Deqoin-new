import { JOURNAL_CONTENT_TYPES, type JournalArticle, type JournalContentType, type JournalSection } from "@/data/journal";

export type JournalCategoryNode = {
  type: JournalContentType;
  label: string;
  count: number;
  articles: JournalArticleDraft[];
};

export type JournalSectionDraft = JournalSection & { id: string };

export type JournalArticleDraft = Omit<JournalArticle, "sections"> & {
  sections: JournalSectionDraft[];
};

export type JournalDraftState = {
  pageTitle: string;
  hero: {
    title: string;
    subtitle: string;
    description: string;
    featuredArticleSlug: string;
  };
  seoMeta: {
    title: string;
    description: string;
    keywords: string;
    ogImage: string;
    canonicalPath: string;
    noIndex: boolean;
    schemaType: string;
  };
  articles: JournalArticleDraft[];
};

const createId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`;

export function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

export function slugify(value: string) {
  return (
    value
      .toLocaleLowerCase("tr-TR")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || `journal-entry-${Date.now().toString(36)}`
  );
}

export function createSectionId(type: JournalSection["type"], index: number) {
  return createId(`${type}-${index + 1}`);
}

export function attachSectionIds(sections: JournalSection[]): JournalSectionDraft[] {
  return sections.map((section, index) => ({
    ...clone(section),
    id: createSectionId(section.type, index),
  }));
}

export function createEmptySection(type: JournalSection["type"]): JournalSectionDraft {
  switch (type) {
    case "heading":
      return { id: createId("heading"), type, level: 2, text: "başlık" };
    case "list":
      return { id: createId("list"), type, items: ["madde 1"] };
    case "image":
      return { id: createId("image"), type, src: "", alt: "journal görseli", caption: "", gallery: [] };
    case "technical":
      return { id: createId("technical"), type, items: [{ label: "başlık", value: "değer" }] };
    case "related":
      return {
        id: createId("related"),
        type,
        title: "ilgili proje bağlantıları",
        items: [{ slug: "", title: "yeni proje", label: "proje" }],
      };
    case "paragraph":
    default:
      return { id: createId("paragraph"), type: "paragraph", body: "" };
  }
}

export function createEmptyArticle(index: number): JournalArticleDraft {
  return {
    slug: `journal-entry-${index + 1}`,
    title: `yeni journal makalesi ${index + 1}`,
    deck: "journal arşivi için kısa editoryal özet.",
    coverImage: "/images/projects/gallery_1.png",
    publishedAt: "28 nisan 2026",
    readTime: "05 dk",
    articleType: "İÇGÖRÜLER",
    departments: ["MİMARİ"],
    projectTypes: ["KONUT"],
    contentTypes: ["İÇGÖRÜLER"],
    relatedProjectSlugs: [],
    intro: "bu makale için giriş metnini buraya yazın.",
    seoMeta: {
      title: "",
      description: "",
      keywords: "",
      ogImage: "",
      canonicalPath: "",
      noIndex: false,
      schemaType: "",
    },
    sections: attachSectionIds([
      {
        type: "paragraph",
        body: "içerik bloklarını buradan oluşturun.",
      },
    ]),
  };
}

export function ensureJournalDraft(value: { pageTitle: string; hero: JournalDraftState["hero"]; seoMeta?: JournalDraftState["seoMeta"]; articles: JournalArticle[] }): JournalDraftState {
  return {
    ...clone(value),
    seoMeta: (value as any).seoMeta || {
      title: "",
      description: "",
      keywords: "",
      ogImage: "",
      canonicalPath: "/journal",
      noIndex: false,
      schemaType: "Article",
    },
    articles: value.articles.map((article, index) => ({
      ...clone(article),
      slug: article.slug || `journal-entry-${index + 1}`,
      sections: attachSectionIds(article.sections),
    })),
  };
}

export function stripArticle(article: JournalArticleDraft): JournalArticle {
  return {
    ...clone(article),
    sections: article.sections.map((section) => {
      const { id: _id, ...rest } = section;
      return rest;
    }),
  };
}

export function moveArrayItem<T>(values: T[], index: number, direction: "up" | "down") {
  const target = direction === "up" ? index - 1 : index + 1;
  if (target < 0 || target >= values.length) return values;
  const next = [...values];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export function reorderArray<T>(values: T[], fromIndex: number, toIndex: number) {
  if (fromIndex === toIndex) return values;
  if (fromIndex < 0 || toIndex < 0 || fromIndex >= values.length || toIndex > values.length) return values;
  const next = [...values];
  const [moved] = next.splice(fromIndex, 1);
  const targetIndex = Math.max(0, Math.min(toIndex, next.length));
  next.splice(targetIndex, 0, moved);
  return next;
}

export function buildJournalCategories(articles: JournalArticleDraft[]): JournalCategoryNode[] {
  return JOURNAL_CONTENT_TYPES.map((type) => {
    const categoryArticles = articles.filter((article) => article.articleType === type.value);
    return {
      type: type.value,
      label: type.label,
      count: categoryArticles.length,
      articles: categoryArticles,
    };
  });
}

export function updateArrayItem<T>(values: T[], index: number, nextValue: T) {
  return values.map((item, currentIndex) => (currentIndex === index ? nextValue : item));
}
