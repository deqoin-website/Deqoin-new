import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Project from "@/models/Project";
import { projectsData } from "@/data/projects";

export async function POST() {
  try {
    await connectToDatabase();
    const PageContent = (await import("@/models/PageContent")).default;
    
    let importedCount = 0;
    
    // Seed Projects
    for (const data of projectsData) {
      const exists = await Project.findOne({ slug: data.slug });
      if (!exists) {
        await Project.create(data);
        importedCount++;
      }
    }

    let message = `${importedCount} proje başarıyla işlendi.`;

    // Seed Home Page Content
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
      message += " Ana sayfa seeder çalıştı.";
    }

    // Seed Mimari Page Content
    const mimariExists = await PageContent.findOne({ page: 'mimari' });
    if (!mimariExists) {
      const { mimariServices } = await import("@/data/mimari-hizmetler");
      await PageContent.create({
        page: 'mimari',
        sections: [
          {
            id: 'hero',
            type: 'hero',
            title: 'DESIGN STUDIO',
            subtitle: 'MİMARİ TASARIMIN GELECEĞİNİ ŞEKİLLENDİRİYORUZ',
            slides: ['/images/slider/mimari_slide.png', '/images/slider/tasarim_slide.png']
          },
          {
            id: 'categories',
            type: 'grid',
            items: mimariServices.map(s => ({
              title: s.title,
              sideLabel: s.sideLabel,
              image: s.image,
              slug: s.slug
            }))
          }
        ]
      });
      message += " Mimari ana sayfa ayarlandı.";
    }

    // Seed Individual Service Details
    const { mimariServices } = await import("@/data/mimari-hizmetler");
    for (const s of mimariServices) {
      const sExists = await PageContent.findOne({ page: `service-${s.slug}` });
      if (!sExists) {
        await PageContent.create({
          page: `service-${s.slug}`,
          sections: [
            {
              id: 'detail',
              type: 'gallery-detail',
              title: s.title,
              subtitle: s.sideLabel,
              description: s.description,
              heroImage: s.image,
              gallery: s.sliderImages || [s.image, "/images/projects/gallery_1.png"],
              process: s.process,
              focusAreas: s.focusAreas,
              categories: s.categories
            }
          ]
        });
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: message + " Tüm hizmet içerikleri hazır.",
    });
  } catch (error: any) {
    console.error("Migration error:", error);
    return NextResponse.json({ 
      error: "Migration failed", 
      details: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}
