import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import StudioCard from "@/models/StudioCard";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const studioType = searchParams.get("studioType");

    const query = studioType ? { studioType } : {};
    
    // Sort by order field
    const cards = await StudioCard.find(query).sort({ order: 1, createdAt: -1 });
    
    return NextResponse.json(cards);
  } catch (error) {
    console.error("StudioCards fetch error:", error);
    return NextResponse.json({ error: "Veri alınamadı." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    
    const newDoc = await StudioCard.create(body);
    
    return NextResponse.json(newDoc, { status: 201 });
  } catch (error) {
    console.error("StudioCard create error:", error);
    return NextResponse.json({ error: "Oluşturulamadı." }, { status: 500 });
  }
}
