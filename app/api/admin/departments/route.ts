import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Department from "@/models/Department";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const deps = await Department.find({});
    return NextResponse.json(deps);
  } catch (error) {
    console.error("Departments fetch error:", error);
    return NextResponse.json({ error: "Veri alınamadı." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const newDoc = await Department.create(body);
    return NextResponse.json(newDoc, { status: 201 });
  } catch (error) {
    console.error("Department create error:", error);
    return NextResponse.json({ error: "Oluşturulamadı." }, { status: 500 });
  }
}
