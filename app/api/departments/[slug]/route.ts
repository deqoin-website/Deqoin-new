import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Department from "@/models/Department";
import { mimariServices } from "@/data/mimari-hizmetler";
import { uygulamaBirimleri } from "@/data/uygulama-birimleri";
import { materyalKategorileri } from "@/data/materyal-studyo";

/**
 * Public API for fetching Department data.
 * Merges DB content with static fallback to ensure the site never breaks.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectToDatabase();
    const { slug } = await params;

    // 1. Check DB first
    const doc = await Department.findOne({ slug });
    
    if (doc) {
      return NextResponse.json(doc);
    }

    // 2. Fallback to static if no DB entry exists
    const allStatic = [...mimariServices, ...uygulamaBirimleri, ...materyalKategorileri];
    const match: any = allStatic.find((s: any) => s.slug === slug);

    if (match) {
      const fallbackData = {
        slug: match.slug,
        title: match.title,
        sideLabel: match.sideLabel,
        description: match.description,
        image: match.image,
        sliderImages: match.sliderImages || [],
        categories: match.categories || [],
        process: match.process || (match.longDescription ? match.longDescription.content.map((c: string) => ({ title: "Açıklama Satırı", desc: c })) : []),
        focusAreas: match.focusAreas || []
      };
      return NextResponse.json(fallbackData);
    }

    return NextResponse.json({ error: "Departman bulunamadı." }, { status: 404 });
  } catch (error) {
    console.error("Public Department API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
