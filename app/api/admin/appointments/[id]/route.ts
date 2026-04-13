import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Appointment from "@/models/Appointment";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    // Resolve params first if this causes synchronous access issues in some Next.js versions, but usually it works if we await params if Next 15 requires it. Next 15 requires awaiting params
    const { id } = await params;
    const body = await request.json();

    const updatedDoc = await Appointment.findByIdAndUpdate(id, body, { new: true });
    
    if (!updatedDoc) {
      return NextResponse.json({ error: "Talep bulunamadı." }, { status: 404 });
    }
    
    return NextResponse.json(updatedDoc);
  } catch (error) {
    console.error("Appointment update error:", error);
    return NextResponse.json({ error: "Güncelleme başarısız." }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    
    const deletedDoc = await Appointment.findByIdAndDelete(id);
    if (!deletedDoc) {
      return NextResponse.json({ error: "Talep bulunamadı." }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Appointment delete error:", error);
    return NextResponse.json({ error: "Silme başarısız." }, { status: 500 });
  }
}
