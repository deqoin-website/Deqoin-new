import { NextResponse } from "next/server";

import { loadMaterialProductView } from "@/lib/material-catalog";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string; "urun-slug": string }> },
) {
  try {
    const { slug, ["urun-slug"]: productSlug } = await params;
    const data = await loadMaterialProductView(slug, productSlug);

    if (!data.exists || !data.product) {
      return NextResponse.json({ error: "Ürün bulunamadı." }, { status: 404 });
    }

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
  } catch (error) {
    console.error("Material product API error:", error);
    return NextResponse.json({ error: "Veri alınamadı." }, { status: 500 });
  }
}
