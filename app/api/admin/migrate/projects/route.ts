import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";
import { projectsData } from "@/data/projects";

export async function GET() {
  await dbConnect();

  try {
    const results = [];
    
    for (const proj of projectsData) {
      // Slug ile kontrol et, varsa güncelle yoksa ekle (upsert)
      const updatedProject = await Project.findOneAndUpdate(
        { slug: proj.slug },
        { 
          $set: {
            title: proj.title,
            label: proj.label,
            categories: proj.category ? [proj.category] : [],
            coverImage: proj.coverImage,
            client: proj.client,
            year: proj.year,
            area: proj.area,
            description: proj.description,
            vision: proj.vision,
            techDetails: proj.techDetails,
            story: proj.story,
            gallery: proj.gallery.map(url => ({ url, imageAlt: '', caption: '' })),
            publishTargets: {
               designStudio: true, // Varsayılan olarak aktarılanlar mimari stüdyoda görünür
               materialStudio: proj.materials && proj.materials.length > 0,
               executionStudio: proj.executionUnits && proj.executionUnits.length > 0
            }
          }
        },
        { upsert: true, new: true }
      );
      results.push(updatedProject);
    }

    return NextResponse.json({ 
      success: true, 
      message: `${results.length} proje başarıyla aktarıldı/güncellendi.`,
      count: results.length 
    });
  } catch (error: any) {
    console.error("Project migration error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
