import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Department from "@/models/Department";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectToDatabase();
    const { slug } = await params;
    
    const doc = await Department.findOne({ slug });
    if (!doc) {
      return NextResponse.json({ error: "Departman bulunamadı." }, { status: 404 });
    }
    
    return NextResponse.json(doc);
  } catch (error) {
    console.error("Department fetch GET error:", error);
    return NextResponse.json({ error: "Veri alınamadı." }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectToDatabase();
    const { slug } = await params;
    const body = await request.json();

    const updatedDoc = await Department.findOneAndUpdate({ slug }, body, { 
      new: true, 
      upsert: true // Eğer bu slug'a sahip bir kayıt yoksa yeni yaratır. "upsert" CMS geçişlerinde hayat kurtarır.
    });
    
    return NextResponse.json(updatedDoc);
  } catch (error) {
    console.error("Department update error:", error);
    return NextResponse.json({ error: "Güncelleme başarısız." }, { status: 500 });
  }
}
