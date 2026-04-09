import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import PageContent from "@/models/PageContent";

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
    const { page, sections } = data;

    const updatedContent = await PageContent.findOneAndUpdate(
      { page },
      { page, sections, 'metadata.updatedAt': new Date() },
      { upsert: true, new: true }
    );

    return NextResponse.json(updatedContent);
  } catch (error) {
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 });
  }
}
