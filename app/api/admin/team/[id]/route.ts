import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import TeamMember from "@/models/TeamMember";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();

    const updated = await TeamMember.findByIdAndUpdate(id, body, { new: true });
    if (!updated) return NextResponse.json({ error: "Member not found" }, { status: 404 });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update member" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const deleted = await TeamMember.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: "Member not found" }, { status: 404 });

    return NextResponse.json({ message: "Member deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete member" }, { status: 500 });
  }
}
