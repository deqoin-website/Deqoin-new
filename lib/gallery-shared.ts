import { type Category, type ProjectDetail } from "@/data/projects";

export type PublishTargets = {
  designStudio?: boolean;
  materialStudio?: boolean;
  executionStudio?: boolean;
};

export type GalleryProjectRecord = {
  _id?: string;
  slug?: string;
  title?: string;
  label?: string;
  categories?: string[];
  publishTargets?: PublishTargets;
  department?: string;
  coverImage?: string;
  client?: string;
  year?: string;
  area?: string;
  studio?: string;
  leadArchitects?: string;
  sustainability?: string;
  location?: string;
  description?: string;
  vision?: string;
  techDetails?: string;
  story?: string;
  gallery?: Array<string | { url?: string; src?: string }>;
  materials?: string[];
  executionUnits?: string[];
};

const CATEGORY_LABELS: Record<string, string> = {
  "luks-konut": "LÜKS KONUT",
  "ticari-yapi": "TİCARİ YAPI",
  "karma-kullanim": "KARMA KULLANIM",
  "kurumsal-alan": "KURUMSAL ALAN",
  "butik-otel": "BUTİK OTEL",
  "kultur-yapisi": "KÜLTÜR YAPISI",
  mimarlik: "MİMARLIK",
  "ic-mimarlik": "İÇ MİMARLIK",
  restorasyon: "RESTORASYON",
  peyzaj: "PEYZAJ",
};

const CATEGORY_LOOKUP: Record<string, Category> = {
  "luks-konut": "luks-konut",
  lukskonut: "luks-konut",
  "ticari-yapi": "ticari-yapi",
  ticariyapi: "ticari-yapi",
  "karma-kullanim": "karma-kullanim",
  karmakullanim: "karma-kullanim",
  "kurumsal-alan": "kurumsal-alan",
  kurumsalalan: "kurumsal-alan",
  "butik-otel": "butik-otel",
  butikotel: "butik-otel",
  "kultur-yapisi": "kultur-yapisi",
  kulturyapisi: "kultur-yapisi",
  mimarlik: "mimarlik",
  "ic-mimarlik": "ic-mimarlik",
  icmimarlik: "ic-mimarlik",
  restorasyon: "restorasyon",
  peyzaj: "peyzaj",
};

const DEPARTMENT_LABELS = {
  designStudio: "MİMARİ TASARIM",
  materialStudio: "MATERYAL STÜDYO",
  executionStudio: "UYGULAMA HİZMETLERİ",
} as const;

export function textOrFallback(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getGalleryDepartmentOptions() {
  return Object.values(DEPARTMENT_LABELS);
}

export function getGalleryCategoryLabel(category: string) {
  return CATEGORY_LABELS[category] || category.toUpperCase();
}

function inferCategory(record: GalleryProjectRecord): Category {
  const raw = record.categories?.find(Boolean) || record.label || record.title || "";
  const normalized = slugify(raw);
  return CATEGORY_LOOKUP[normalized] || CATEGORY_LOOKUP[slugify(record.label || "")] || "mimarlik";
}

function inferDepartment(record: GalleryProjectRecord) {
  if (record.department && record.department.trim()) {
    return record.department.trim();
  }

  if (record.publishTargets?.materialStudio) return DEPARTMENT_LABELS.materialStudio;
  if (record.publishTargets?.executionStudio) return DEPARTMENT_LABELS.executionStudio;
  if (record.publishTargets?.designStudio) return DEPARTMENT_LABELS.designStudio;

  return DEPARTMENT_LABELS.designStudio;
}

function normalizeGalleryImages(gallery: GalleryProjectRecord["gallery"]) {
  const items = Array.isArray(gallery) ? gallery : [];

  return items
    .map((item) => {
      if (typeof item === "string") {
        const src = item.trim();
        return src || null;
      }

      const src = String(item?.url ?? item?.src ?? "").trim();
      if (!src) return null;
      return src;
    })
    .filter(Boolean) as string[];
}

export function normalizeGalleryProject(record: GalleryProjectRecord | ProjectDetail): ProjectDetail {
  const category = "category" in record ? record.category : inferCategory(record);
  const department =
    ("department" in record && record.department ? record.department : inferDepartment(record)) as ProjectDetail["department"];

  const rawGallery = Array.isArray((record as GalleryProjectRecord).gallery)
    ? (record as GalleryProjectRecord).gallery
    : Array.isArray((record as ProjectDetail).gallery)
      ? (record as ProjectDetail).gallery
      : [];
  const gallery = normalizeGalleryImages(rawGallery);

  return {
    slug: textOrFallback(record.slug, slugify(record.title || record.label || "galeri")),
    title: textOrFallback(record.title, "BAŞLIKSIZ PROJE"),
    label: textOrFallback(record.label, "PROJE"),
    category,
    department,
    coverImage: textOrFallback(record.coverImage, "/images/projects/gallery_1.png"),
    client: textOrFallback(record.client, "-"),
    year: textOrFallback(record.year, "-"),
    area: textOrFallback(record.area, "-"),
    studio: textOrFallback(record.studio, ""),
    leadArchitects: textOrFallback(record.leadArchitects, ""),
    sustainability: textOrFallback(record.sustainability, ""),
    location: textOrFallback(record.location, ""),
    description: textOrFallback(record.description, ""),
    vision: textOrFallback(record.vision, ""),
    techDetails: textOrFallback(record.techDetails, ""),
    story: textOrFallback(record.story, ""),
    gallery: gallery.length > 0 ? gallery : [textOrFallback(record.coverImage, "/images/projects/gallery_1.png")],
    materials: Array.isArray(record.materials) ? record.materials : [],
    executionUnits: Array.isArray(record.executionUnits) ? record.executionUnits : [],
  };
}
