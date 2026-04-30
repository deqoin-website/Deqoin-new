import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import CorporateContent from "@/models/CorporateContent";
import { CURRENT_ABOUT_CONTENT, createAboutDefaultContent, isLegacyAboutContent } from "@/lib/about-content";

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
      const fallback = page === "about" ? createAboutDefaultContent() : {
        page,
        title: "",
        subtitle: "",
        description: "",
        stats: [],
        sections: [],
      };

      return NextResponse.json({
        ...fallback,
      });
    }

    if (page === "about" && isLegacyAboutContent(content)) {
      const updated = await CorporateContent.findOneAndUpdate(
        { page: "about" },
        {
          ...CURRENT_ABOUT_CONTENT,
          metadata: {
            ...(content.metadata || {}),
            updatedAt: new Date(),
          },
        },
        { upsert: true, returnDocument: "after", runValidators: true }
      );

      return NextResponse.json(updated);
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
    const { metadata, ...rest } = data ?? {};

    const updated = await CorporateContent.findOneAndUpdate(
      { page },
      {
        $set: {
          ...rest,
          page,
          metadata: {
            ...(metadata || {}),
            updatedAt: new Date(),
          },
        },
      },
      { upsert: true, returnDocument: 'after', runValidators: true }
    );

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Corporate Content API PUT Error:", error);
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
  }
}
