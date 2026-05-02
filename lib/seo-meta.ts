export type SeoMeta = {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
  canonicalPath: string;
  noIndex: boolean;
  schemaType: string;
};

export const EMPTY_SEO_META: SeoMeta = {
  title: "",
  description: "",
  keywords: "",
  ogImage: "",
  canonicalPath: "",
  noIndex: false,
  schemaType: "",
};

function textOr(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function boolOr(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

export function normalizeSeoMeta(value: any, fallback: Partial<SeoMeta> = {}): SeoMeta {
  return {
    title: textOr(value?.title, textOr(fallback.title, "")),
    description: textOr(value?.description, textOr(fallback.description, "")),
    keywords: textOr(value?.keywords, textOr(fallback.keywords, "")),
    ogImage: textOr(value?.ogImage, textOr(fallback.ogImage, "")),
    canonicalPath: textOr(value?.canonicalPath, textOr(fallback.canonicalPath, "")),
    noIndex: boolOr(value?.noIndex, boolOr(fallback.noIndex, false)),
    schemaType: textOr(value?.schemaType, textOr(fallback.schemaType, "")),
  };
}

export function seoKeywordsToArray(value?: string) {
  return (value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
