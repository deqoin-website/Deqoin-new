import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import WorkflowContent from "@/models/WorkflowContent";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DEFAULT_WORKFLOW = {
  key: "home-workflow",
  title: "İŞ AKIŞI",
  steps: [
    {
      id: "01",
      title: "RANDEVU",
      description: "Kusursuz sürecin ilk adımı.",
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "02",
      title: "KEŞİF",
      description: "İhtiyaçları ve potansiyeli yerinde okuruz.",
      image:
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "03",
      title: "TASARIM",
      description: "Vizyonu mimari bir dile dönüştürürüz.",
      image:
        "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "04",
      title: "MALZEME",
      description: "Doku, kalite ve karakteri seçeriz.",
      image:
        "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "05",
      title: "UYGULAMA",
      description: "Tasarıyı sahada gerçeğe dönüştürürüz.",
      image:
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
    },
  ],
};

export async function GET() {
  try {
    await connectToDatabase();
    let workflow = await WorkflowContent.findOne({ key: "home-workflow" });

    if (!workflow) {
      workflow = await WorkflowContent.create(DEFAULT_WORKFLOW);
    }

    return NextResponse.json(workflow, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch workflow" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const now = new Date();

    if (!body?.steps || !Array.isArray(body.steps)) {
      return NextResponse.json({ error: "steps array is required" }, { status: 400 });
    }

    const updated = await WorkflowContent.findOneAndUpdate(
      { key: "home-workflow" },
      {
        key: "home-workflow",
        title: body.title || "İŞ AKIŞI",
        steps: body.steps,
        metadata: {
          updatedAt: now,
          lastUpdatedBy: body.lastUpdatedBy || "admin",
        },
      },
      { upsert: true, new: true }
    );

    return NextResponse.json(updated, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to save workflow" }, { status: 500 });
  }
}
