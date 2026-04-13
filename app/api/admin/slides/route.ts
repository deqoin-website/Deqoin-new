import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Slide from "@/models/Slide";

export async function GET() {
  try {
    await connectToDatabase();
    const slides = await Slide.find({}).sort({ order: 1 });
    return NextResponse.json(slides);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch slides" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const newSlide = await Slide.create(body);
    return NextResponse.json(newSlide);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create slide" }, { status: 500 });
  }
}
