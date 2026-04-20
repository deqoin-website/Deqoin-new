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
      image: "/images/workflow/randevu.svg?v=3",
    },
    {
      id: "02",
      title: "KEŞİF",
      description: "İhtiyaçları ve potansiyeli yerinde okuruz.",
      image: "/images/workflow/kesif.svg?v=3",
    },
    {
      id: "03",
      title: "TASARIM",
      description: "Vizyonu mimari bir dile dönüştürürüz.",
      image: "/images/workflow/tasarim.svg?v=3",
    },
    {
      id: "04",
      title: "MALZEME",
      description: "Doku, kalite ve karakteri seçeriz.",
      image: "/images/workflow/malzeme.svg?v=3",
    },
    {
      id: "05",
      title: "UYGULAMA",
      description: "Tasarıyı sahada gerçeğe dönüştürürüz.",
      image: "/images/workflow/uygulama.svg?v=3",
    },
  ],
};

function normalizeWorkflow(workflow: any) {
  const defaultSteps = DEFAULT_WORKFLOW.steps;
  const steps = Array.isArray(workflow?.steps) ? workflow.steps : [];

  return {
    key: "home-workflow",
    title: workflow?.title || DEFAULT_WORKFLOW.title,
    steps: defaultSteps.map((defaultStep, index) => {
      const current = steps[index] || {};
      const image =
        typeof current.image === "string" && current.image.startsWith("/images/workflow/")
          ? `${current.image.split("?")[0]}?v=3`
          : defaultStep.image;

      return {
        id: current.id || defaultStep.id,
        title: current.title || defaultStep.title,
        description: current.description || defaultStep.description,
        image,
      };
    }),
  };
}

export async function GET() {
  try {
    await connectToDatabase();
    let workflow = await WorkflowContent.findOne({ key: "home-workflow" });

    const normalized = normalizeWorkflow(workflow || DEFAULT_WORKFLOW);

    if (!workflow) {
      workflow = await WorkflowContent.create({
        ...normalized,
        metadata: {
          updatedAt: new Date(),
          lastUpdatedBy: "system",
        },
      });
    } else {
      workflow = await WorkflowContent.findOneAndUpdate(
        { key: "home-workflow" },
        {
          ...normalized,
          metadata: {
            updatedAt: new Date(),
            lastUpdatedBy: "system",
          },
        },
        { new: true }
      );
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
        steps: body.steps.map((step: any) => ({
          ...step,
          image: typeof step.image === "string" && step.image.startsWith("/images/workflow/")
            ? `${step.image.split("?")[0]}?v=3`
            : step.image,
        })),
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
