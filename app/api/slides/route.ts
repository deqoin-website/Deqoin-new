import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Slide from "@/models/Slide";

export async function GET() {
  try {
    await connectToDatabase();
    // Only fetch active slides
    const slides = await Slide.find({ active: true }).sort({ order: 1 });
    return NextResponse.json(slides);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch slides" }, { status: 500 });
  }
}
