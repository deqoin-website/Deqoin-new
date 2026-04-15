import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import PageContent from "@/models/PageContent";

function stripMongoFields(value: any): any {
  if (Array.isArray(value)) {
    return value.map(stripMongoFields);
  }

  if (value && typeof value === "object") {
    const cleaned: Record<string, any> = {};
    for (const [key, nestedValue] of Object.entries(value)) {
      if (key === "_id" || key === "__v" || key === "createdAt" || key === "updatedAt") {
        continue;
      }
      cleaned[key] = stripMongoFields(nestedValue);
    }
    return cleaned;
  }

  return value;
}

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page");

    if (page) {
      const content = await PageContent.findOne({ page });
      return NextResponse.json(content || { page, sections: [] });
    }

    const allContent = await PageContent.find({});
    return NextResponse.json(allContent);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const data = await request.json();
    const page = data.page;
    const sections = stripMongoFields(data.sections || []);

    const updatedContent = await PageContent.findOneAndUpdate(
      { page },
      { page, sections, 'metadata.updatedAt': new Date() },
      { upsert: true, new: true }
    );

    return NextResponse.json(updatedContent);
  } catch (error) {
    console.error("Failed to save content:", error);
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 });
  }
}
