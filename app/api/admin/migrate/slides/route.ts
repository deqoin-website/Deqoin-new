import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Slide from "@/models/Slide";
import { SLIDER_IMAGE_URLS } from "@/lib/slider-images";

const initialSlides = [
  {
    title: "DESIGN STUDIO",
    subtitle: "TASARIM",
    mediaUrl: SLIDER_IMAGE_URLS.mimari,
    mediaType: 'image',
    blur: 0,
    overlay: 30,
    order: 0,
    active: true
  },
  {
    title: "MATERIAL STUDIO",
    subtitle: "MALZEME",
    mediaUrl: SLIDER_IMAGE_URLS.material,
    mediaType: 'image',
    blur: 0,
    overlay: 30,
    order: 1,
    active: true
  },
  {
    title: "EXECUTION STUDIO",
    subtitle: "UYGULAMA",
    mediaUrl: SLIDER_IMAGE_URLS.execution,
    mediaType: 'image',
    blur: 0,
    overlay: 30,
    order: 2,
    active: true
  }
];

export async function GET() {
  try {
    await connectToDatabase();
    
    // Check if slides already exist to avoid duplicates
    const count = await Slide.countDocuments();
    if (count > 0) {
      return NextResponse.json({ message: "Slides already migrated", count });
    }

    await Slide.insertMany(initialSlides);
    
    return NextResponse.json({ 
      success: true, 
      message: "Initial slides migrated successfully", 
      count: initialSlides.length 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
