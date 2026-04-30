import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import PageContent from "@/models/PageContent";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
      const [content] = await PageContent.collection
        .find({ page })
        .sort({ "metadata.updatedAt": -1, updatedAt: -1, createdAt: -1 })
        .limit(1)
        .toArray();
      return NextResponse.json(content || { page, sections: [] }, {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      });
    }

    const allContent = await PageContent.collection.find({}).toArray();
    return NextResponse.json(allContent, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const data = await request.json();
    const page = data.page;
    const title = data.title;
    const sections = stripMongoFields(data.sections || []);

    if (!page) {
      return NextResponse.json({ error: "Page is required" }, { status: 400 });
    }

    const now = new Date();
    await PageContent.collection.deleteMany({ page });
    const inserted = await PageContent.collection.insertOne({
      page,
      title,
      sections,
      metadata: { updatedAt: now },
      createdAt: now,
      updatedAt: now,
    });

    const updatedContent = await PageContent.collection.findOne({ _id: inserted.insertedId });
    return NextResponse.json(updatedContent, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
  } catch (error) {
    console.error("Failed to save content:", error);
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const data = await request.json();
    const page = data.page;
    const title = data.title;
    const sections = stripMongoFields(data.sections || []);

    if (!page) {
      return NextResponse.json({ error: "Page is required" }, { status: 400 });
    }

    const now = new Date();
    await PageContent.collection.deleteMany({ page });
    const inserted = await PageContent.collection.insertOne({
      page,
      title,
      sections,
      metadata: { updatedAt: now },
      createdAt: now,
      updatedAt: now,
    });

    const updatedContent = await PageContent.collection.findOne({ _id: inserted.insertedId });
    return NextResponse.json(updatedContent, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
  } catch (error) {
    console.error("Failed to update content:", error);
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
  }
}
