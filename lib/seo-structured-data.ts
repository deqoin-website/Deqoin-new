const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
  process.env.VERCEL_URL?.trim() ||
  "https://www.deqoin.com";

const siteOrigin = SITE_URL.startsWith("http") ? SITE_URL : `https://${SITE_URL}`;

function absoluteUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return new URL(path.startsWith("/") ? path : `/${path}`, siteOrigin).toString();
}

function cleanText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function resolveHeadline(value: string) {
  return cleanText(value).replace(/\s+\|\s+deqoin$/i, "");
}

export type JsonLdSchema = Record<string, unknown>;

export function buildOrganizationJsonLd(logoPath = "/images/logo-new.jpeg"): JsonLdSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "deqoin",
    url: absoluteUrl("/"),
    logo: absoluteUrl(logoPath),
    areaServed: ["Nevşehir", "Kapadokya", "Türkiye"],
  };
}

export function buildLocalBusinessJsonLd(logoPath = "/images/logo-new.jpeg"): JsonLdSchema {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ProfessionalService"],
    name: "deqoin",
    url: absoluteUrl("/"),
    image: absoluteUrl(logoPath),
    description:
      "Nevşehir ve Kapadokya merkezli iç mimarlık, uygulama ve mimari materyal stüdyosu.",
    areaServed: ["Nevşehir", "Kapadokya", "Türkiye"],
    serviceType: ["İç Mimarlık", "Uygulama", "İtalyan Boya", "Materyal Stüdyo"],
  };
}

export function buildWebSiteJsonLd(): JsonLdSchema {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "deqoin",
    url: absoluteUrl("/"),
    inLanguage: "tr-TR",
    publisher: buildOrganizationJsonLd(),
  };
}

export function buildWebPageJsonLd(params: {
  name: string;
  description: string;
  url: string;
  image?: string;
}): JsonLdSchema {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: cleanText(params.name),
    headline: resolveHeadline(params.name),
    description: cleanText(params.description),
    url: absoluteUrl(params.url),
    image: params.image ? absoluteUrl(params.image) : undefined,
    inLanguage: "tr-TR",
  };
}

export function buildBreadcrumbJsonLd(items: Array<{ name: string; url: string }>): JsonLdSchema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: cleanText(item.name),
      item: absoluteUrl(item.url),
    })),
  };
}

export function buildServiceJsonLd(params: {
  name: string;
  description: string;
  url: string;
  image?: string;
}): JsonLdSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: cleanText(params.name),
    description: cleanText(params.description),
    url: absoluteUrl(params.url),
    image: params.image ? absoluteUrl(params.image) : undefined,
    provider: buildOrganizationJsonLd(),
    areaServed: ["Nevşehir", "Kapadokya", "Türkiye"],
    serviceType: cleanText(params.name),
  };
}

export function buildProductJsonLd(params: {
  name: string;
  description: string;
  url: string;
  image?: string | string[];
  sku?: string;
  category?: string;
  brand?: string;
}): JsonLdSchema {
  const images = Array.isArray(params.image)
    ? params.image
        .map((item) => (item ? absoluteUrl(item) : ""))
        .filter(Boolean)
    : params.image
      ? [absoluteUrl(params.image)]
      : [];

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: cleanText(params.name),
    description: cleanText(params.description),
    url: absoluteUrl(params.url),
    image: images.length > 0 ? images : undefined,
    sku: params.sku ? cleanText(params.sku) : undefined,
    category: params.category ? cleanText(params.category) : undefined,
    brand: {
      "@type": "Brand",
      name: cleanText(params.brand || "deqoin"),
    },
  };
}

export function buildArticleJsonLd(params: {
  name: string;
  description: string;
  url: string;
  image?: string;
}): JsonLdSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: cleanText(params.name),
    description: cleanText(params.description),
    url: absoluteUrl(params.url),
    image: params.image ? absoluteUrl(params.image) : undefined,
    author: buildOrganizationJsonLd(),
    publisher: buildOrganizationJsonLd(),
    inLanguage: "tr-TR",
  };
}
