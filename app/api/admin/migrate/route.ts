import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/mongodb";
import Project from "@/models/Project";
import User from "@/models/User";
import { projectsData } from "@/data/projects";
import bcrypt from "bcryptjs";
import { SLIDER_IMAGE_URLS } from "@/lib/slider-images";

/**
 * MIGRATION API V3 - BYPASSING MONGOOSE CACHE & VALIDATION
 * This script seeds all three studios (Design, Material, Execution) directly 
 * into the database collections to avoid persistent Schema/Cast errors.
 */
export async function POST() {
  try {
    await connectToDatabase();
    
    // We'll use the collection directly to bypass Mongoose validation issues
    const db = mongoose.connection.db;
    if (!db) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
    }
    const contents = db.collection('pagecontents');
    
    let importedCount = 0;
    
    // 1. Seed Projects (Model based creation is fine for Project usually)
    for (const data of projectsData) {
      const exists = await Project.findOne({ slug: data.slug });
      if (!exists) {
        await Project.create(data);
        importedCount++;
      }
    }

    let message = `${importedCount} proje işlendi. `;

    // 1.1 Seed Root User from .env
    const adminUser = process.env.ADMIN_USERNAME;
    const adminPass = process.env.ADMIN_PASSWORD;

    if (adminUser && adminPass) {
      const userExists = await User.findOne({ username: adminUser });
      if (!userExists) {
        const hashedPassword = await bcrypt.hash(adminPass, 10);
        await User.create({
          username: adminUser,
          password: hashedPassword,
          name: "Sistem Yöneticisi",
          role: "admin"
        });
        message += "Root kullanıcı oluşturuldu. ";
      } else {
        message += "Root kullanıcı zaten mevcut. ";
      }
    }

    // Helper to upsert page content
    const upsertPage = async (pageId: string, sections: any[]) => {
      // Check if exists
      const exists = await contents.findOne({ page: pageId });
      if (!exists) {
        await contents.insertOne({
          page: pageId,
          sections: sections,
          metadata: {
            updatedAt: new Date()
          },
          createdAt: new Date(),
          updatedAt: new Date()
        });
        return true;
      }
      return false;
    };

    // 2. Seed Home
    const homeAdded = await upsertPage('home', [
      {
        id: 'hero',
        type: 'hero',
        title: 'Ana Sayfa Slider',
        content: {
          slides: [
            {
              image: SLIDER_IMAGE_URLS.mimari,
              title: "DESIGN STUDIO",
              motto: "Estetik ve Fonksiyonun Mimari Uyumu",
              buttonText: "DESIGN STUDIO İÇİN İLETİŞİM",
              caption: "Design Studio"
            },
            {
              image: SLIDER_IMAGE_URLS.material,
              title: "MATERIAL STUDIO",
              motto: "Dokunulabilir Lüks, Zamansız Detaylar",
              buttonText: "MATERIAL STUDIO İÇİN İLETİŞİM",
              caption: "Material Studio"
            },
            {
              image: SLIDER_IMAGE_URLS.execution,
              title: "EXECUTION STUDIO",
              motto: "Hayallerin Kusursuz İnşası",
              buttonText: "EXECUTION STUDIO İÇİN İLETİŞİM",
              caption: "Execution Studio"
            }
          ]
        }
      }
    ]);
    if (homeAdded) message += " Home ayarlandı.";

    // 3. Seed Mimari
    const { mimariServices } = await import("@/data/mimari-hizmetler");
    const mimariAdded = await upsertPage('mimari', [
      {
        id: 'hero',
        type: 'hero',
        title: 'DESIGN STUDIO',
        subtitle: 'MİMARİ TASARIMIN GELECEĞİNİ ŞEKİLLENDİRİYORUZ',
        slides: [
          SLIDER_IMAGE_URLS.mimari,
          SLIDER_IMAGE_URLS.material
        ]
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
    ]);
    if (mimariAdded) message += " Mimari ayarlandı.";

    // 4. Seed Material
    const { materyalKategorileri } = await import("@/data/materyal-studyo");
    const materialAdded = await upsertPage('material', [
      {
        id: 'hero',
        type: 'hero',
        title: 'MATERIAL STUDIO',
        subtitle: 'ÜRÜN VE MALZEME ÜSTÜNLÜĞÜ',
        slides: ['https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=80&w=2048&auto=format&fit=crop']
      },
      {
        id: 'categories',
        type: 'grid',
        items: materyalKategorileri.map(s => ({
          title: s.title,
          sideLabel: s.sideLabel,
          image: s.image,
          slug: s.slug
        }))
      }
    ]);
    if (materialAdded) message += " Material ayarlandı.";

    // 5. Seed Execution
    const { uygulamaBirimleri } = await import("@/data/uygulama-birimleri");
    const executionAdded = await upsertPage('execution', [
      {
        id: 'hero',
        type: 'hero',
        title: 'EXECUTION STUDIO',
        subtitle: 'KUSURSUZ UYGULAMA VE TEKNİK DİSİPLİN',
        slides: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBg-MKl4zF6vfhExOXkEX-PKVlktOgQYI9EevfKIIYXVJ2wtmRpvybiQLaOtQdeYc_lIPrntEOUrCatq_Efo6fw-z-0-6TilLvAsA4tcYK-QcbjqdetFT2T2EreDjugTzsElsUeoEqEM9i_daWDWBBOJXiZvrjMKWtS2z5I5ZuzOLXWozpZ8MroEnEj5yRtFuaubPctxfeO_ZAZ5E5Tawo9b6yB5w0pmG4_axQCW--XoR8nAAImAE_M5UpM2vFx3tuR2ePYvZ-VmaY']
      },
      {
        id: 'categories',
        type: 'grid',
        items: uygulamaBirimleri.map(s => ({
          title: s.title,
          sideLabel: s.sideLabel,
          image: s.image,
          slug: s.slug
        }))
      }
    ]);
    if (executionAdded) message += " Execution ayarlandı.";

    // 6. Seed Sub-Services
    const all = [
      ...mimariServices.map(s => ({...s, prefix: 'service'})),
      ...materyalKategorileri.map(s => ({...s, prefix: 'service'})),
      ...uygulamaBirimleri.map(s => ({...s, prefix: 'service'}))
    ];

    for (const s of all) {
      const pageId = `${s.prefix}-${s.slug}`;
      const desc = (s as any).longDescription 
        ? (s as any).longDescription.content.join('\n\n') 
        : s.description;

      await upsertPage(pageId, [
        {
          id: 'detail',
          type: 'gallery-detail',
          title: s.title,
          subtitle: s.sideLabel,
          description: desc,
          heroImage: s.image,
          gallery: s.sliderImages || [s.image],
          process: (s as any).process || [],
          focusAreas: (s as any).focusAreas || [],
          categories: s.categories || [{ label: 'TÜM PROJELER', value: 'ALL' }]
        }
      ]);
    }

    return NextResponse.json({ success: true, message: message + " Tüm stüdyolar başarıyla aktarıldı." });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Failed", details: err.message }, { status: 500 });
  }
}
