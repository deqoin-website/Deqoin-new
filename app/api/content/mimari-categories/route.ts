import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import PageContent from "@/models/PageContent";

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
];

const categoryFallbackByTitle: Record<string, string> = {
  muhendislik: "/images/workflow/muhendislik-custom.png",
  mimarlik: "/images/workflow/mimarlik-custom.png",
  mekanik: "/images/workflow/mekanik-custom.png",
  icmimarlik: "/images/workflow/ic-mimarlik-custom.png",
  restorasyon: "/images/workflow/restorasyon-custom.png",
  peyzaj: "/images/workflow/peyzaj-custom.png",
};

function normalizeTitle(value?: string) {
  return (value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z]/g, "");
}

function normalizeCategoryItem(item: any) {
  const normalizedTitle = normalizeTitle(item?.title);
  return {
    ...item,
    image: item?.image || categoryFallbackByTitle[normalizedTitle] || "/images/workflow/mimarlik-custom.png",
  };
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
      slides: ["/images/slider/mimari_slide.png"],
    },
    {
      id: "cta",
      type: "cta",
      image: "/images/slider/mimari_slide.png",
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
    const normalizedItems = items.map(normalizeCategoryItem);

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
