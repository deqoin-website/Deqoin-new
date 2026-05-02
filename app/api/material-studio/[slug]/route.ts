import { NextResponse } from "next/server";

import { loadMaterialCategoryView } from "@/lib/material-catalog";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const data = await loadMaterialCategoryView(slug);

    if (!data.exists) {
      return NextResponse.json({ error: "Kategori bulunamadı." }, { status: 404 });
    }

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
  } catch (error) {
    console.error("Material category API error:", error);
    return NextResponse.json({ error: "Veri alınamadı." }, { status: 500 });
  }
}
