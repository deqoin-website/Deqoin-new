import { NextResponse } from "next/server";

import connectToDatabase from "@/lib/mongodb";
import PageContent from "@/models/PageContent";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type GalleryItem = {
  src: string;
  alt: string;
  caption?: string;
};

type GalleryPayload = {
  title?: string;
  buttonText?: string;
  buttonHref?: string;
  images?: Array<string | GalleryItem>;
  gallery?: Array<string | GalleryItem>;
};

const DEFAULT_GALLERY = {
  title: "GALERİ",
  buttonText: "TÜM GALERİYİ GÖR",
  buttonHref: "/galeri",
  images: [
    { src: "/images/projects/gallery_1.png", alt: "DEQOIN galeri görseli 1", caption: "01" },
    { src: "/images/projects/gallery_2.png", alt: "DEQOIN galeri görseli 2", caption: "02" },
    { src: "/images/slider/mimari_slide.png", alt: "DEQOIN galeri görseli 3", caption: "03" },
    { src: "/images/slider/tasarim_slide.png", alt: "DEQOIN galeri görseli 4", caption: "04" },
    { src: "/images/slider/uygulama_slide.png", alt: "DEQOIN galeri görseli 5", caption: "05" },
  ] satisfies GalleryItem[],
};

function normalizeImages(input: GalleryPayload["images"] = []): string[] {
  return (input ?? [])
    .map((item) => {
      if (typeof item === "string") return item.trim();
      if (item && typeof item === "object") return String(item.src ?? "").trim();
      return "";
    })
    .filter(Boolean);
}

function toText(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function readGallerySection(pageDoc: any) {
  const existing = Array.isArray(pageDoc?.sections)
    ? pageDoc.sections.find((section: any) => section.id === "gallery")
    : null;

  const gallery = Array.isArray(existing?.gallery) ? existing.gallery.filter(Boolean) : [];

  return {
    title: toText(existing?.title, DEFAULT_GALLERY.title),
    buttonText: toText(existing?.buttonText, DEFAULT_GALLERY.buttonText),
    buttonHref: toText(existing?.buttonHref, DEFAULT_GALLERY.buttonHref),
    images:
      gallery.length > 0
        ? gallery.map((src: string, index: number) => ({
            src,
            alt: existing?.title ? `${existing.title} görseli ${index + 1}` : `GALERİ görseli ${index + 1}`,
            caption: String(index + 1).padStart(2, "0"),
          }))
        : DEFAULT_GALLERY.images,
  };
}

async function ensureHomePage() {
  const pageDoc = await PageContent.findOne({ page: "home" });
  if (pageDoc) return pageDoc;

  return PageContent.create({
    page: "home",
    sections: [
      {
        id: "gallery",
        type: "gallery",
        title: DEFAULT_GALLERY.title,
        buttonText: DEFAULT_GALLERY.buttonText,
        buttonHref: DEFAULT_GALLERY.buttonHref,
        gallery: DEFAULT_GALLERY.images.map((item) => item.src),
      },
    ],
    metadata: { updatedAt: new Date() },
  });
}

export async function GET() {
  try {
    await connectToDatabase();
    const pageDoc = await ensureHomePage();
    return NextResponse.json({ gallery: readGallerySection(pageDoc) }, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("Gallery fetch error:", error);
    return NextResponse.json({ gallery: DEFAULT_GALLERY }, { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = (await request.json()) as GalleryPayload;

    const title = toText(body.title, DEFAULT_GALLERY.title);
    const buttonText = toText(body.buttonText, DEFAULT_GALLERY.buttonText);
    const buttonHref = toText(body.buttonHref, DEFAULT_GALLERY.buttonHref);
    const images = normalizeImages(body.images ?? body.gallery);

    const pageDoc = await ensureHomePage();
    const sections = Array.isArray(pageDoc.sections) ? [...pageDoc.sections] : [];
    const nextSection = {
      id: "gallery",
      type: "gallery",
      title,
      buttonText,
      buttonHref,
      gallery: images,
    };

    const index = sections.findIndex((section: any) => section.id === "gallery");
    if (index >= 0) {
      sections[index] = { ...sections[index], ...nextSection };
    } else {
      sections.push(nextSection);
    }

    pageDoc.sections = sections;
    pageDoc.metadata = {
      ...(pageDoc.metadata || {}),
      updatedAt: new Date(),
    };
    await pageDoc.save();

    return NextResponse.json({ gallery: readGallerySection(pageDoc) }, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
  } catch (error: any) {
    console.error("Gallery save error:", error);
    return NextResponse.json({ error: "Failed to save gallery" }, { status: 500 });
  }
}
