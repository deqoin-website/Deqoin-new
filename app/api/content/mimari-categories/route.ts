import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import PageContent from "@/models/PageContent";
import { SLIDER_IMAGE_URLS } from "@/lib/slider-images";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DEFAULT_MIMARI_CATEGORIES = [
  {
    href: "/mimari/insaat-muhendisligi",
    title: "Mühendislik",
    sideLabel: "Structural Strength",
    image: "/images/workflow/muhendislik-custom.png",
    slug: "insaat-muhendisligi",
  },
  {
    href: "/mimari/mimarlik",
    title: "Mimarlık",
    sideLabel: "Structural Form",
    image: "/images/workflow/mimarlik-custom.png",
    slug: "mimarlik",
  },
  {
    href: "/mimari/elektrik-elektronik-muhendisligi",
    title: "Mekanik",
    sideLabel: "Power & Logic",
    image: "/images/workflow/mekanik-custom.png",
    slug: "elektrik-elektronik-muhendisligi",
  },
  {
    href: "/mimari/ic-mimarlik",
    title: "İç Mimarlık",
    sideLabel: "Interior Essence",
    image: "/images/workflow/ic-mimarlik-custom.png",
    slug: "ic-mimarlik",
  },
  {
    href: "/mimari/restorasyon",
    title: "Restorasyon",
    sideLabel: "Heritage Revival",
    image: "/images/workflow/restorasyon-custom.png",
    slug: "restorasyon",
  },
  {
    href: "/mimari/peyzaj-mimarligi",
    title: "Peyzaj",
    sideLabel: "Natural Canvas",
    image: "/images/workflow/peyzaj-custom.png",
    slug: "peyzaj-mimarligi",
  },
  {
    href: "/mimari/plan-proje",
    title: "Plan ve Proje",
    sideLabel: "Detail & Vision",
    image: "/images/slider/mimari_slide.png",
    slug: "plan-proje",
  },
];

const categoryFallbackByKey: Record<string, string> = {
  muhendislik: "/images/workflow/muhendislik-custom.png",
  "insaat-muhendisligi": "/images/workflow/muhendislik-custom.png",
  mimarlik: "/images/workflow/mimarlik-custom.png",
  mekanik: "/images/workflow/mekanik-custom.png",
  "elektrik-elektronik-muhendisligi": "/images/workflow/mekanik-custom.png",
  icmimarlik: "/images/workflow/ic-mimarlik-custom.png",
  "ic-mimarlik": "/images/workflow/ic-mimarlik-custom.png",
  restorasyon: "/images/workflow/restorasyon-custom.png",
  peyzaj: "/images/workflow/peyzaj-custom.png",
  "peyzaj-mimarligi": "/images/workflow/peyzaj-custom.png",
  "plan-proje": "/images/slider/mimari_slide.png",
  planveproje: "/images/slider/mimari_slide.png",
};

function normalizeTitle(value?: string) {
  return (value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z]/g, "");
}

function normalizeKey(value?: string) {
  return (value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-]/g, "");
}

function normalizeCategoryItem(item: any) {
  const normalizedSlug = normalizeKey(item?.slug || item?.href);
  const normalizedTitle = normalizeTitle(item?.title);
  return {
    ...item,
    image: item?.image || categoryFallbackByKey[normalizedSlug] || categoryFallbackByKey[normalizedTitle] || "/images/workflow/mimarlik-custom.png",
  };
}

function mergeCategories(items: any[]) {
  const incoming = Array.isArray(items) ? items : [];
  const lookup = new Map<string, any>();

  incoming.forEach((item) => {
    const key = normalizeKey(item?.slug || item?.href || item?.title);
    if (key) {
      lookup.set(key, item);
    }
  });

  const merged = DEFAULT_MIMARI_CATEGORIES.map((fallback) => {
    const key = normalizeKey(fallback.slug || fallback.href || fallback.title);
    const item = lookup.get(key) || lookup.get(normalizeTitle(fallback.title));
    const source = item || fallback;

    return {
      ...fallback,
      ...item,
      href: item?.href || fallback.href,
      slug: item?.slug || fallback.slug,
      image: normalizeCategoryItem(source).image,
    };
  });

  const seen = new Set(merged.map((item) => normalizeKey(item.slug || item.href || item.title)));
  const extras = incoming
    .filter((item) => {
      const key = normalizeKey(item?.slug || item?.href || item?.title);
      return key && !seen.has(key);
    })
    .map((item) => normalizeCategoryItem(item));

  return [...merged, ...extras];
}

function createDefaultSections() {
  return [
    {
      id: "hero",
      type: "hero",
      title: "DESIGN STUDIO",
      subtitle: "MİMARİ TASARIM",
      blur: 0,
      overlay: 30,
      slides: [SLIDER_IMAGE_URLS.mimari],
    },
    {
      id: "cta",
      type: "cta",
      image: SLIDER_IMAGE_URLS.mimari,
      blur: 0,
      overlay: 30,
    },
    {
      id: "categories",
      type: "categories",
      items: DEFAULT_MIMARI_CATEGORIES,
    },
  ];
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const items = Array.isArray(body?.items) ? body.items : [];
    const normalizedItems = mergeCategories(items);

    if (!items.length) {
      return NextResponse.json({ error: "Items are required" }, { status: 400 });
    }

    const now = new Date();
    const existing = await PageContent.collection.findOne({ page: "mimari" });
    const sections = Array.isArray(existing?.sections) && existing.sections.length > 0
      ? JSON.parse(JSON.stringify(existing.sections))
      : createDefaultSections();

    const categoriesSection = sections.find((section: any) => section.id === "categories");
    if (!categoriesSection) {
      sections.push({
        id: "categories",
        type: "categories",
        items: normalizedItems,
      });
    } else {
      categoriesSection.items = normalizedItems;
    }

    const nextDocument = {
      ...(existing || {}),
      page: "mimari",
      sections,
      metadata: {
        ...(existing?.metadata || {}),
        updatedAt: now,
      },
      updatedAt: now,
      createdAt: existing?.createdAt || now,
    };

    if (existing?._id) {
      await PageContent.collection.replaceOne({ _id: existing._id }, nextDocument, { upsert: true });
    } else {
      await PageContent.collection.insertOne(nextDocument);
    }

    const updated = await PageContent.collection.findOne({ page: "mimari" });

    return NextResponse.json(updated, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
  } catch (error: any) {
    console.error("[mimari-categories] save failed", error?.stack || error?.message || error);
    return NextResponse.json(
      {
        error: "Failed to save mimari categories",
        details: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}
