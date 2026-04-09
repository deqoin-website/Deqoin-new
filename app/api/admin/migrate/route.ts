import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Project from "@/models/Project";
import { projectsData } from "@/data/projects";

export async function POST() {
  try {
    await connectToDatabase();
    
    let importedCount = 0;
    
    for (const data of projectsData) {
      const exists = await Project.findOne({ slug: data.slug });
      if (!exists) {
        await Project.create(data);
        importedCount++;
      }
    }

    // Seed Home Page Content
    const PageContent = (await import("@/models/PageContent")).default;
    const homeExists = await PageContent.findOne({ page: 'home' });
    if (!homeExists) {
      await PageContent.create({
        page: 'home',
        sections: [
          {
            id: 'hero',
            type: 'hero',
            title: 'Ana Sayfa Slider',
            content: {
              slides: [
                {
                  image: "/images/slider/mimari_slide.png",
                  title: "DESIGN STUDIO",
                  motto: "Estetik ve Fonksiyonun Mimari Uyumu",
                  buttonText: "DESIGN STUDIO İÇİN RANDEVU TALEP EDİNİZ",
                  caption: "Design Studio"
                },
                {
                  image: "/images/slider/tasarim_slide.png",
                  title: "MATERIAL STUDIO",
                  motto: "Dokunulabilir Lüks, Zamansız Detaylar",
                  buttonText: "MATERIAL STUDIO İÇİN RANDEVU TALEP EDİNİZ",
                  caption: "Material Studio"
                },
                {
                  image: "/images/slider/uygulama_slide.png",
                  title: "EXECUTION STUDIO",
                  motto: "Hayallerin Kusursuz İnşası",
                  buttonText: "EXECUTION STUDIO İÇİN RANDEVU TALEP EDİNİZ",
                  caption: "Execution Studio"
                }
              ]
            }
          }
        ]
      });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `${importedCount} proje ve ana sayfa ayarları başarıyla içeri aktarıldı.`,
      total: projectsData.length
    });
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json({ error: "Migration failed" }, { status: 500 });
  }
}
