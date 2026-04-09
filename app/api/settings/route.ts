import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Settings from "@/models/Settings";

export async function GET() {
  try {
    await connectToDatabase();
    let settings = await Settings.findOne({ key: "site-settings" });
    
    // Default settings if none exist
    if (!settings) {
      settings = await Settings.create({
        key: "site-settings",
        logoUrl: "/images/logo-new.jpeg",
        studioName: "DEQOIN | Architectural Studio"
      });
    }
    
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const data = await request.json();
    
    const settings = await Settings.findOneAndUpdate(
      { key: "site-settings" },
      { ...data, key: "site-settings" },
      { upsert: true, new: true }
    );
    
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
