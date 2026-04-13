import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import StudioCard from "@/models/StudioCard";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();

    const updatedDoc = await StudioCard.findByIdAndUpdate(id, body, { new: true });
    
    if (!updatedDoc) {
      return NextResponse.json({ error: "Kart bulunamadı." }, { status: 404 });
    }
    
    return NextResponse.json(updatedDoc);
  } catch (error) {
    console.error("StudioCard update error:", error);
    return NextResponse.json({ error: "Güncelleme başarısız." }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    
    const deletedDoc = await StudioCard.findByIdAndDelete(id);
    if (!deletedDoc) {
      return NextResponse.json({ error: "Kart bulunamadı." }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("StudioCard delete error:", error);
    return NextResponse.json({ error: "Silme başarısız." }, { status: 500 });
  }
}
