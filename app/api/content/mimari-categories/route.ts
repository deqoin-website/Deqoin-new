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
    image: "/images/projects/gallery_1.png",
    slug: "insaat-muhendisligi",
  },
  {
    href: "/mimari/mimarlik",
    title: "Mimarlık",
    sideLabel: "Structural Form",
    image: "/images/slider/mimari_slide.png",
    slug: "mimarlik",
  },
  {
    href: "/mimari/elektrik-elektronik-muhendisligi",
    title: "Mekanik",
    sideLabel: "Power & Logic",
    image: "/images/projects/gallery_2.png",
    slug: "elektrik-elektronik-muhendisligi",
  },
  {
    href: "/mimari/ic-mimarlik",
    title: "İç Mimarlık",
    sideLabel: "Interior Essence",
    image: "/images/about_interior.png",
    slug: "ic-mimarlik",
  },
  {
    href: "/mimari/restorasyon",
    title: "Restorasyon",
    sideLabel: "Heritage Revival",
    image: "/images/projects/gallery_1.png",
    slug: "restorasyon",
  },
  {
    href: "/mimari/peyzaj-mimarligi",
    title: "Peyzaj",
    sideLabel: "Natural Canvas",
    image: "/images/projects/gallery_2.png",
    slug: "peyzaj-mimarligi",
  },
];

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
        items,
      });
    } else {
      categoriesSection.items = items;
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
