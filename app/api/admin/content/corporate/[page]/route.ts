import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import CorporateContent from "@/models/CorporateContent";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ page: string }> }
) {
  try {
    await connectToDatabase();
    const { page } = await params;

    const content = await CorporateContent.findOne({ page });
    
    // Provide some default structure if document doesn't exist yet
    if (!content) {
      return NextResponse.json({
        page,
        title: "",
        subtitle: "",
        description: "",
        stats: [
          { label: "DENEYİM", value: "10+ YIL" },
          { label: "TESLİM EDİLEN", value: "+240 PROJE" },
          { label: "UZMAN EKİP", value: "40+ KİŞİ" }
        ],
        sections: []
      });
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error("Corporate Content API GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ page: string }> }
) {
  try {
    await connectToDatabase();
    const { page } = await params;
    const data = await request.json();

    const updated = await CorporateContent.findOneAndUpdate(
      { page },
      { ...data, page, 'metadata.updatedAt': new Date() },
      { upsert: true, new: true }
    );

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Corporate Content API PUT Error:", error);
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
  }
}
