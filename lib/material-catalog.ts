import connectToDatabase from "@/lib/mongodb";
import Department from "@/models/Department";
import {
  getMaterialCategory,
  getMaterialProduct,
  getMaterialProductsByCategory,
  resolveMaterialCategorySlug,
  type MaterialProduct,
} from "@/data/materyal-urunleri";

type DepartmentProduct = {
  slug?: string;
  categorySlug?: string;
  title?: string;
  brandName?: string;
  image?: string;
  heroImage?: string;
  gallery?: string[];
  shortInfo?: string;
  sku?: string;
  description?: string;
  details?: { label: string; value: string }[];
  filterValues?: Record<string, string[]>;
  technicalDetails?: { label: string; value: string }[];
  applicationAreas?: string[];
  stockStatus?: MaterialProduct["stockStatus"];
  stockLabel?: string;
  techTags?: string[];
  ctaVariant?: MaterialProduct["ctaVariant"];
  ctaLabel?: string;
};

type DepartmentDocument = {
  slug?: string;
  title?: string;
  sideLabel?: string;
  description?: string;
  image?: string;
  sliderImages?: string[];
  categories?: { label: string; value: string }[];
  products?: DepartmentProduct[];
};

function normalizeStatus(status?: MaterialProduct["stockStatus"]) {
  if (status === "limited") return status;
  if (status === "made-to-order") return status;
  return "available";
}

function fallbackStockLabel(status: MaterialProduct["stockStatus"]) {
  switch (status) {
    case "limited":
      return "Sınırlı stok";
    case "made-to-order":
      return "Siparişe özel";
    default:
      return "Stokta";
  }
}

function fallbackCtaLabel(variant: MaterialProduct["ctaVariant"]) {
  switch (variant) {
    case "request-sample":
      return "Numune İste";
    case "request-quote":
      return "Teklif Al";
    default:
      return "Bilgi Al";
  }
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeProduct(product: DepartmentProduct | MaterialProduct, categorySlug: string): MaterialProduct {
  const fallback = product.slug ? getMaterialProduct(categorySlug, product.slug) : null;
  const productImage = "image" in product ? product.image : undefined;
  const heroImage = product.heroImage || productImage || fallback?.heroImage || "";
  const gallery = Array.isArray(product.gallery) && product.gallery.length > 0
    ? product.gallery
    : fallback?.gallery || (heroImage ? [heroImage] : []);
  const stockStatus = normalizeStatus(product.stockStatus || fallback?.stockStatus);
  const ctaVariant = product.ctaVariant || fallback?.ctaVariant || "get-info";

  return {
    slug: product.slug || fallback?.slug || slugify(product.title || categorySlug) || `urun-${categorySlug}`,
    categorySlug: product.categorySlug || categorySlug,
    brandName: product.brandName || fallback?.brandName || "",
    title: product.title || fallback?.title || "Materyal",
    heroImage,
    gallery,
    shortInfo: product.shortInfo || fallback?.shortInfo || "Teknik yüzey",
    sku: product.sku || fallback?.sku || "",
    description: product.description || fallback?.description || "",
    details: product.details || fallback?.details || [],
    filterValues: product.filterValues || fallback?.filterValues || {
      "renk-tonu": [],
      "yuzey-tipi": [],
      "kullanim-alani": [],
    },
    technicalDetails: product.technicalDetails || fallback?.technicalDetails || [],
    applicationAreas: product.applicationAreas || fallback?.applicationAreas || [],
    stockStatus,
    stockLabel: product.stockLabel || fallback?.stockLabel || fallbackStockLabel(stockStatus),
    techTags: product.techTags || fallback?.techTags || [],
    ctaVariant,
    ctaLabel: product.ctaLabel || fallback?.ctaLabel || fallbackCtaLabel(ctaVariant),
  };
}

export async function loadMaterialCategoryView(categorySlug: string) {
  const resolvedSlug = resolveMaterialCategorySlug(categorySlug);
  const staticCategory = getMaterialCategory(resolvedSlug);

  await connectToDatabase();
  const department = (await Department.findOne({ slug: resolvedSlug }).lean()) as DepartmentDocument | null;
  const exists = Boolean(staticCategory || department);

  const category = {
    slug: resolvedSlug,
    title: department?.title || staticCategory?.title || resolvedSlug,
    sideLabel: department?.sideLabel || staticCategory?.sideLabel || "Material Studio",
    description: department?.description || staticCategory?.description || "",
    image: department?.image || staticCategory?.image || "",
    sliderImages: department?.sliderImages?.length ? department.sliderImages : staticCategory?.sliderImages || [],
    categories: department?.categories?.length ? department.categories : staticCategory?.categories || [],
  };

  const productsSource = department?.products?.length ? department.products : getMaterialProductsByCategory(resolvedSlug);
  const products = productsSource.map((product) => normalizeProduct(product, resolvedSlug));

  return { category, products, exists };
}

export async function loadMaterialProductView(categorySlug: string, productSlug: string) {
  const resolvedSlug = resolveMaterialCategorySlug(categorySlug);
  const { category, products, exists } = await loadMaterialCategoryView(resolvedSlug);
  const product = products.find((item) => item.slug === productSlug) || null;
  const relatedProducts = products.filter((item) => item.slug !== productSlug).slice(0, 4);

  return { category, product, relatedProducts, exists };
}
