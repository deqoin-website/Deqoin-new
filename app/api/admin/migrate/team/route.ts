import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import TeamMember from "@/models/TeamMember";
import { teamMembers } from "@/data/team";

export async function GET() { return handleMigration(); }
export async function POST() { return handleMigration(); }

async function handleMigration() {
  try {
    await connectToDatabase();
    
    // Check if we already have members to avoid duplicates
    const count = await TeamMember.countDocuments();
    if (count > 0) {
      return NextResponse.json({ message: "Database already has team members. Skipping migration." });
    }

    const membersToInsert = teamMembers.map(m => ({
      name: m.name,
      role: m.role,
      category: m.category,
      image: m.image,
      order: m.id // Using their old IDs as initial order
    }));

    await TeamMember.insertMany(membersToInsert);

    return NextResponse.json({ message: "Team migration successful!", count: membersToInsert.length });
  } catch (error: any) {
    console.error("Migration error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
