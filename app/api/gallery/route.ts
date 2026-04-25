import { NextResponse } from "next/server";

import connectToDatabase from "@/lib/mongodb";
import PageContent from "@/models/PageContent";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SliderAsset = {
  src: string;
  alt: string;
  caption?: string;
  title?: string;
  description?: string;
};

type SliderPayload = {
  title?: string;
  buttonText?: string;
  buttonHref?: string;
  slides?: Array<string | SliderAsset>;
  images?: Array<string | SliderAsset>;
  gallery?: Array<string | SliderAsset>;
};

const DEFAULT_SLIDER = {
  title: "GALERİ",
  buttonText: "TÜM GALERİYİ GÖR",
  buttonHref: "/galeri",
  slides: [
    { src: "/images/projects/gallery_1.png", alt: "DEQOIN galeri görseli 1", caption: "01", title: "Residence Lobby", description: "Minimal yüzeyler, dengeli ışık ve sakin bir giriş atmosferi." },
    { src: "/images/projects/gallery_2.png", alt: "DEQOIN galeri görseli 2", caption: "02", title: "Material Study", description: "Doğal dokular, net detaylar ve kontrollü kontrast." },
    { src: "/images/slider/mimari_slide.png", alt: "DEQOIN galeri görseli 3", caption: "03", title: "Architectural Frame", description: "Mekanı tanımlayan sade çizgiler ve güçlü oranlar." },
    { src: "/images/slider/tasarim_slide.png", alt: "DEQOIN galeri görseli 4", caption: "04", title: "Design Detail", description: "Yüzey geçişleri ve dingin bir kompozisyon dili." },
    { src: "/images/slider/uygulama_slide.png", alt: "DEQOIN galeri görseli 5", caption: "05", title: "Execution Layer", description: "Uygulama kalitesi, temiz bitişler ve net sonuçlar." },
  ] satisfies SliderAsset[],
};

function toText(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function normalizeAssets(input: SliderPayload["slides"] = []): SliderAsset[] {
  return (input ?? [])
    .map((item, index) => {
      if (typeof item === "string") {
        const src = item.trim();
        if (!src) return null;
        return {
          src,
          alt: `${DEFAULT_SLIDER.title} görseli ${index + 1}`,
          caption: String(index + 1).padStart(2, "0"),
          title: `${DEFAULT_SLIDER.title} ${index + 1}`,
          description: `Otomatik oluşturulan proje özeti ${String(index + 1).padStart(2, "0")}.`,
        };
      }

      if (item && typeof item === "object") {
        const asset = item as any;
        const src = String(asset.src ?? asset.url ?? asset.image ?? "").trim();
        if (!src) return null;
        return {
          src,
          alt: toText(asset.alt ?? asset.imageAlt, `${DEFAULT_SLIDER.title} görseli ${index + 1}`),
          caption: toText(asset.caption, String(index + 1).padStart(2, "0")),
          title: toText(asset.title ?? asset.projectTitle, `${DEFAULT_SLIDER.title} ${index + 1}`),
          description: toText(
            asset.description ?? asset.subtitle,
            `Otomatik oluşturulan proje özeti ${String(index + 1).padStart(2, "0")}.`,
          ),
        };
      }

      return null;
    })
    .filter(Boolean) as SliderAsset[];
}

function readSliderHero(pageDoc: any) {
  const existing = Array.isArray(pageDoc?.sections)
    ? pageDoc.sections.find((section: any) => section.id === "sliderHero" || section.id === "gallery")
    : null;

  const rawSlides = Array.isArray(existing?.slides)
    ? existing.slides
    : Array.isArray(existing?.images)
      ? existing.images
      : Array.isArray(existing?.gallery)
        ? existing.gallery
        : [];

  const slides = normalizeAssets(rawSlides);

  return {
    title: toText(existing?.title, DEFAULT_SLIDER.title),
    buttonText: toText(existing?.buttonText, DEFAULT_SLIDER.buttonText),
    buttonHref: toText(existing?.buttonHref, DEFAULT_SLIDER.buttonHref),
    slides: slides.length > 0 ? slides : DEFAULT_SLIDER.slides,
  };
}

async function ensureHomePage() {
  const pageDoc = await PageContent.findOne({ page: "home" });
  if (pageDoc) return pageDoc;

  return PageContent.create({
    page: "home",
    sections: [
      {
        id: "sliderHero",
        type: "sliderHero",
        title: DEFAULT_SLIDER.title,
        buttonText: DEFAULT_SLIDER.buttonText,
        buttonHref: DEFAULT_SLIDER.buttonHref,
        slides: DEFAULT_SLIDER.slides,
      },
    ],
    metadata: { updatedAt: new Date() },
  });
}

export async function GET() {
  try {
    await connectToDatabase();
    const pageDoc = await ensureHomePage();
    return NextResponse.json(
      { sliderHero: readSliderHero(pageDoc) },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    );
  } catch (error) {
    console.error("Slider hero fetch error:", error);
    return NextResponse.json({ sliderHero: DEFAULT_SLIDER }, { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = (await request.json()) as SliderPayload;

    const title = toText(body.title, DEFAULT_SLIDER.title);
    const buttonText = toText(body.buttonText, DEFAULT_SLIDER.buttonText);
    const buttonHref = toText(body.buttonHref, DEFAULT_SLIDER.buttonHref);
    const slides = normalizeAssets(body.slides ?? body.images ?? body.gallery);

    const pageDoc = await ensureHomePage();
    const sections = Array.isArray(pageDoc.sections) ? [...pageDoc.sections] : [];
    const nextSection = {
      id: "sliderHero",
      type: "sliderHero",
      title,
      buttonText,
      buttonHref,
      slides,
    };

    const index = sections.findIndex((section: any) => section.id === "sliderHero" || section.id === "gallery");
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

    return NextResponse.json(
      { sliderHero: readSliderHero(pageDoc) },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      },
    );
  } catch (error: any) {
    console.error("Slider hero save error:", error);
    return NextResponse.json({ error: "Failed to save slider hero" }, { status: 500 });
  }
}
