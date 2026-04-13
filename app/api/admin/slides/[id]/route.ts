import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Slide from "@/models/Slide";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();

    const updated = await Slide.findByIdAndUpdate(id, body, { new: true });
    if (!updated) return NextResponse.json({ error: "Slide not found" }, { status: 404 });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update slide" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const deleted = await Slide.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: "Slide not found" }, { status: 404 });

    return NextResponse.json({ message: "Slide deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete slide" }, { status: 500 });
  }
}
