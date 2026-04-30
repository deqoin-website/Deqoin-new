import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import CorporateContent from "@/models/CorporateContent";
import { CURRENT_ABOUT_CONTENT } from "@/lib/about-content";

export async function GET() {
  try {
    await connectToDatabase();
    
    // Always upsert the initial data for the about page.
    const updated = await CorporateContent.findOneAndUpdate(
      { page: 'about' },
      {
        ...CURRENT_ABOUT_CONTENT,
        metadata: { updatedAt: new Date() },
      },
      { upsert: true, returnDocument: 'after' }
    );
    
    return NextResponse.json({ 
      success: true, 
      message: "About data migrated successfully", 
      data: updated 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
