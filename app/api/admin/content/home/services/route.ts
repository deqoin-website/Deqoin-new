import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import StudioCard from "@/models/StudioCard";

// Expected types: 'design', 'material', 'execution'
const DEFAULT_CARDS = [
  { 
    studioType: 'design', 
    title: 'Design Studio', 
    description: 'Mimari Tasarım', 
    icon: 'PenTool', 
    image: 'https://zzawgisa3efgdxnm.public.blob.vercel-storage.com/design-studio-home.png', 
    blur: 0,
    overlay: 30,
    order: 0 
  },
  { 
    studioType: 'material', 
    title: 'Material Studio', 
    description: 'Ürün ve Malzeme', 
    icon: 'Layers', 
    image: '/images/slider/tasarim_slide.png', 
    blur: 0,
    overlay: 30,
    order: 1 
  },
  { 
    studioType: 'execution', 
    title: 'Execution Studio', 
    description: 'Uygulama Hizmetleri', 
    icon: 'Hammer', 
    image: '/images/slider/uygulama_slide.png', 
    blur: 0,
    overlay: 30,
    order: 2 
  },
];

export async function GET() {
  try {
    await connectToDatabase();
    let cards = await StudioCard.find().sort({ order: 1 });
    
    // Seed if empty
    if (cards.length === 0) {
      cards = await StudioCard.insertMany(DEFAULT_CARDS);
    }

    return NextResponse.json(cards);
  } catch (error) {
    console.error("Studio Cards GET error:", error);
    return NextResponse.json({ error: "Failed to fetch studio cards" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const data = await request.json(); // Expected an array of 3 cards or specific map

    // Batch update logic
    if (Array.isArray(data)) {
      const promises = data.map(card => 
        StudioCard.findOneAndUpdate(
          { studioType: card.studioType }, 
          card, 
          { upsert: true, new: true }
        )
      );
      const updated = await Promise.all(promises);
      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
  } catch (error) {
    console.error("Studio Cards PUT error:", error);
    return NextResponse.json({ error: "Failed to update studio cards" }, { status: 500 });
  }
}
