import { SLIDER_IMAGE_URLS } from "@/lib/slider-images";
import {
  getMaterialProductsByCategory,
  materialProducts,
  resolveMaterialCategorySlug,
  type MaterialProduct,
} from "@/data/materyal-urunleri";

export type MaterialCropState = { x: number; y: number; zoom: number };

export type MaterialProductDraft = {
  slug: string;
  categorySlug: string;
  brandName: string;
  title: string;
  shortInfo: string;
  sku: string;
  description: string;
  heroImage: string;
  heroCrop: MaterialCropState;
  gallery: string[];
  galleryCrops: MaterialCropState[];
  details: { label: string; value: string }[];
  technicalDetails: { label: string; value: string }[];
  applicationAreas: string[];
  techTags: string[];
  stockStatus: MaterialProduct["stockStatus"];
  stockLabel: string;
  ctaVariant: MaterialProduct["ctaVariant"];
  ctaLabel: string;
  filterValues: {
    "renk-tonu": string[];
    "yuzey-tipi": string[];
    "kullanim-alani": string[];
  };
};

export type LegacyStudioProduct = {
  title: string;
  image: string;
  category: string;
  desc: string;
  price: string;
  link: string;
};

export function slugifyMaterial(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizeMaterialCrop(value?: Partial<MaterialCropState>): MaterialCropState {
  return {
    x: Math.min(100, Math.max(0, Number(value?.x ?? 50))),
    y: Math.min(100, Math.max(0, Number(value?.y ?? 50))),
    zoom: Math.min(2, Math.max(1, Number(value?.zoom ?? 1))),
  };
}

export function dedupeMaterialGallery(items: string[]) {
  return Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)));
}

export function alignMaterialGalleryCrops(gallery: string[], crops?: MaterialCropState[]) {
  const next = gallery.map((_, index) => normalizeMaterialCrop(crops?.[index]));
  return next.length > 0 ? next : [normalizeMaterialCrop()];
}

export function createEmptyMaterialProduct(categorySlug: string): MaterialProductDraft {
  const resolved = resolveMaterialCategorySlug(categorySlug);
  const fallback = materialProducts.find((item) => item.categorySlug === resolved);

  return {
    slug: "",
    categorySlug: resolved,
    brandName: "deqoin",
    title: "",
    shortInfo: "",
    sku: "",
    description: "",
    heroImage: fallback?.heroImage || SLIDER_IMAGE_URLS.material,
    heroCrop: { x: 50, y: 50, zoom: 1 },
    gallery: fallback?.gallery?.length ? fallback.gallery : [fallback?.heroImage || SLIDER_IMAGE_URLS.material],
    galleryCrops: alignMaterialGalleryCrops(
      fallback?.gallery?.length ? fallback.gallery : [fallback?.heroImage || SLIDER_IMAGE_URLS.material],
    ),
    details: [
      { label: "Ebat", value: "" },
      { label: "Kalınlık", value: "" },
    ],
    technicalDetails: [
      { label: "Menşei", value: "" },
      { label: "Yüzey", value: "" },
    ],
    applicationAreas: [],
    techTags: [],
    stockStatus: "available",
    stockLabel: "Stokta",
    ctaVariant: "request-sample",
    ctaLabel: "Numune İste",
    filterValues: {
      "renk-tonu": [],
      "yuzey-tipi": [],
      "kullanim-alani": [],
    },
  };
}

export function normalizeMaterialProduct(value: any, categorySlug: string): MaterialProductDraft {
  const resolved = resolveMaterialCategorySlug(categorySlug);
  const seed = materialProducts.find((item) => item.slug === value?.slug && item.categorySlug === resolved)
    || materialProducts.find((item) => item.categorySlug === resolved)
    || createEmptyMaterialProduct(resolved);

  return {
    slug: value?.slug || seed.slug || slugifyMaterial(value?.title || "urun"),
    categorySlug: value?.categorySlug || resolved,
    brandName: value?.brandName || seed.brandName || "deqoin",
    title: value?.title || seed.title || "",
    shortInfo: value?.shortInfo || seed.shortInfo || "",
    sku: value?.sku || seed.sku || "",
    description: value?.description || seed.description || "",
    heroImage: value?.heroImage || value?.image || seed.heroImage || SLIDER_IMAGE_URLS.material,
    heroCrop: normalizeMaterialCrop(value?.heroCrop || seed.heroCrop),
    gallery: Array.isArray(value?.gallery) && value.gallery.length > 0 ? value.gallery.filter(Boolean) : seed.gallery || [seed.heroImage],
    galleryCrops: alignMaterialGalleryCrops(
      Array.isArray(value?.gallery) && value.gallery.length > 0 ? value.gallery.filter(Boolean) : seed.gallery || [seed.heroImage],
      Array.isArray(value?.galleryCrops) ? value.galleryCrops : undefined,
    ),
    details: Array.isArray(value?.details) && value.details.length > 0 ? value.details : seed.details,
    technicalDetails:
      Array.isArray(value?.technicalDetails) && value.technicalDetails.length > 0
        ? value.technicalDetails
        : seed.technicalDetails,
    applicationAreas:
      Array.isArray(value?.applicationAreas) && value.applicationAreas.length > 0
        ? value.applicationAreas
        : seed.applicationAreas,
    techTags: Array.isArray(value?.techTags) && value.techTags.length > 0 ? value.techTags : seed.techTags,
    stockStatus: value?.stockStatus || seed.stockStatus || "available",
    stockLabel: value?.stockLabel || seed.stockLabel || "Stokta",
    ctaVariant: value?.ctaVariant || seed.ctaVariant || "request-sample",
    ctaLabel: value?.ctaLabel || seed.ctaLabel || "Numune İste",
    filterValues: {
      "renk-tonu": Array.isArray(value?.filterValues?.["renk-tonu"]) ? value.filterValues["renk-tonu"] : seed.filterValues["renk-tonu"],
      "yuzey-tipi": Array.isArray(value?.filterValues?.["yuzey-tipi"]) ? value.filterValues["yuzey-tipi"] : seed.filterValues["yuzey-tipi"],
      "kullanim-alani": Array.isArray(value?.filterValues?.["kullanim-alani"]) ? value.filterValues["kullanim-alani"] : seed.filterValues["kullanim-alani"],
    },
  };
}

export function buildSavedMaterialProductDraft(
  productDraft: MaterialProductDraft,
  categorySlug: string,
  productCount: number,
) {
  const nextHeroImage = productDraft.gallery[0] || productDraft.heroImage || SLIDER_IMAGE_URLS.material;
  const nextGallery = dedupeMaterialGallery([nextHeroImage, ...productDraft.gallery]);
  const nextGalleryCrops = alignMaterialGalleryCrops(nextGallery, productDraft.galleryCrops);

  return {
    ...productDraft,
    slug: slugifyMaterial(productDraft.slug || productDraft.title || `urun-${productCount + 1}`),
    categorySlug,
    brandName: productDraft.brandName || "deqoin",
    heroImage: nextGallery[0] || nextHeroImage,
    heroCrop: nextGalleryCrops[0] || normalizeMaterialCrop(productDraft.heroCrop),
    gallery: nextGallery,
    galleryCrops: nextGalleryCrops,
    details: productDraft.details.filter((item) => item.label || item.value),
    technicalDetails: productDraft.technicalDetails.filter((item) => item.label || item.value),
  };
}

export function reorderMaterialGallery(
  gallery: string[],
  crops: MaterialCropState[],
  fromIndex: number,
  toIndex: number,
) {
  if (fromIndex === toIndex) return { gallery, crops };
  if (fromIndex < 0 || fromIndex >= gallery.length) return { gallery, crops };
  if (toIndex < 0 || toIndex >= gallery.length) return { gallery, crops };

  const nextGallery = [...gallery];
  const nextCrops = [...crops];
  const [movedImage] = nextGallery.splice(fromIndex, 1);
  const [movedCrop] = nextCrops.splice(fromIndex, 1);
  nextGallery.splice(toIndex, 0, movedImage);
  nextCrops.splice(toIndex, 0, movedCrop || normalizeMaterialCrop());

  return {
    gallery: nextGallery,
    crops: nextCrops,
  };
}

export function mapMaterialProductToLegacyStudioProduct(product: MaterialProduct): LegacyStudioProduct {
  return {
    title: product.title,
    image: product.heroImage,
    category: product.shortInfo || product.techTags?.[0] || product.stockLabel || "",
    desc: product.description || product.technicalDetails?.[0]?.value || "",
    price: product.stockLabel || product.ctaLabel || "",
    link: `/materyal-studyo/${product.categorySlug}/${product.slug}`,
  };
}

export function getLegacyStudioProductsFromMaterialCatalog(categorySlug: string) {
  return getMaterialProductsByCategory(categorySlug).map(mapMaterialProductToLegacyStudioProduct);
}

export function mapLegacyStudioProductToMaterialProduct(
  product: LegacyStudioProduct,
  categorySlug: string,
  fallback?: MaterialProduct,
  index = 0,
): MaterialProduct {
  const resolvedSlug = resolveMaterialCategorySlug(categorySlug);
  const fallbackSlug = fallback?.slug || slugifyMaterial(product.title || `urun-${index + 1}`);

  return {
    slug: fallbackSlug,
    categorySlug: resolvedSlug,
    title: product.title || fallback?.title || "Materyal",
    brandName: fallback?.brandName || "deqoin",
    heroImage: product.image || fallback?.heroImage || SLIDER_IMAGE_URLS.material,
    gallery: fallback?.gallery?.length ? fallback.gallery : [product.image || fallback?.heroImage || SLIDER_IMAGE_URLS.material],
    shortInfo: product.category || fallback?.shortInfo || "",
    sku: fallback?.sku || slugifyMaterial(product.title || `urun-${index + 1}`).toUpperCase(),
    description: product.desc || fallback?.description || "",
    details: fallback?.details || [],
    filterValues: fallback?.filterValues || {
      "renk-tonu": [],
      "yuzey-tipi": [],
      "kullanim-alani": [],
    },
    technicalDetails: fallback?.technicalDetails || [],
    applicationAreas: fallback?.applicationAreas || [],
    stockStatus: fallback?.stockStatus || "available",
    stockLabel: product.price || fallback?.stockLabel || "Stokta",
    techTags: fallback?.techTags || [],
    ctaVariant: fallback?.ctaVariant || "get-info",
    ctaLabel: fallback?.ctaLabel || "Bilgi Al",
  };
}

export function removeMaterialGalleryImage(
  gallery: string[],
  crops: MaterialCropState[],
  index: number,
  heroImage: string,
) {
  const next = gallery.filter((_, current) => current !== index);
  const nextCrops = crops.filter((_, current) => current !== index);
  const nextGallery = next.length > 0 ? next : [heroImage];
  const nextGalleryCrops = next.length > 0 ? (nextCrops.length > 0 ? nextCrops : [normalizeMaterialCrop()]) : [normalizeMaterialCrop()];

  return {
    gallery: nextGallery,
    crops: alignMaterialGalleryCrops(nextGallery, nextGalleryCrops),
    heroImage: nextGallery[0],
    heroCrop: nextGalleryCrops[0] || normalizeMaterialCrop(),
  };
}
