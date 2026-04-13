import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import TeamMember from "@/models/TeamMember";

export async function GET() {
  try {
    await connectToDatabase();
    const members = await TeamMember.find({}).sort({ order: 1, createdAt: -1 });
    return NextResponse.json(members);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch team" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const newMember = await TeamMember.create(body);
    return NextResponse.json(newMember);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create member" }, { status: 500 });
  }
}
