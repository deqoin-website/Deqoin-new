import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Department from "@/models/Department";
import { mimariServices } from "@/data/mimari-hizmetler";
import { uygulamaBirimleri } from "@/data/uygulama-birimleri";
import { materyalKategorileri } from "@/data/materyal-studyo";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectToDatabase();
    const { slug } = await params;
    
    const doc = await Department.findOne({ slug });
    
    // Eğer veritabanında henüz bir kayıt yoksa (CMS'e henüz kaydedilmemişse),
    // Statik dosyalardan (mimari-hizmetler, uygulama-birimleri vb.) veriyi çekip önizleme olarak doldur.
    let fallbackData = null;
    if (!doc) {
      const allStatic = [...mimariServices, ...uygulamaBirimleri, ...materyalKategorileri];
      const match: any = allStatic.find((s: any) => s.slug === slug);

      if (match) {
        fallbackData = {
          slug: match.slug,
          title: match.title,
          sideLabel: match.sideLabel,
          description: match.description,
          image: match.image,
          sliderImages: match.sliderImages || [],
          categories: match.categories || [],
          // Eski yapıdaki longDescription satırlarını yeni process mantığına çeviriyoruz:
          process: match.process || (match.longDescription ? match.longDescription.content.map((c: string) => ({ title: "Açıklama Satırı", desc: c })) : []),
          focusAreas: match.focusAreas || []
        };
      }
    }

    if (!doc && !fallbackData) {
      return NextResponse.json({ error: "Departman bulunamadı." }, { status: 404 });
    }
    
    return NextResponse.json(doc || fallbackData);
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

    const updatedDoc = await Department.findOneAndUpdate(
      { slug },
      body,
      {
        upsert: true,
        returnDocument: 'after', // Ensure we get the updated document back without deprecated `new: true`.
      }
    );
    
    return NextResponse.json(updatedDoc);
  } catch (error) {
    console.error("Department update error:", error);
    return NextResponse.json({ error: "Güncelleme başarısız." }, { status: 500 });
  }
}
