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
      image: "/images/workflow/randevu-v4.svg",
    },
    {
      id: "02",
      title: "KEŞİF",
      description: "İhtiyaçları ve potansiyeli yerinde okuruz.",
      image: "/images/workflow/kesif-v4.svg",
    },
    {
      id: "03",
      title: "TASARIM",
      description: "Vizyonu mimari bir dile dönüştürürüz.",
      image: "/images/workflow/tasarim-v4.svg",
    },
    {
      id: "04",
      title: "MALZEME",
      description: "Doku, kalite ve karakteri seçeriz.",
      image: "/images/workflow/malzeme-v4.svg",
    },
    {
      id: "05",
      title: "UYGULAMA",
      description: "Tasarıyı sahada gerçeğe dönüştürürüz.",
      image: "/images/workflow/uygulama-v4.svg",
    },
  ],
};

const WORKFLOW_IMAGE_MAP: Record<string, string> = {
  "/images/workflow/randevu.svg": "/images/workflow/randevu-v4.svg",
  "/images/workflow/kesif.svg": "/images/workflow/kesif-v4.svg",
  "/images/workflow/tasarim.svg": "/images/workflow/tasarim-v4.svg",
  "/images/workflow/malzeme.svg": "/images/workflow/malzeme-v4.svg",
  "/images/workflow/uygulama.svg": "/images/workflow/uygulama-v4.svg",
  "/images/workflow/randevu.svg?v=3": "/images/workflow/randevu-v4.svg",
  "/images/workflow/kesif.svg?v=3": "/images/workflow/kesif-v4.svg",
  "/images/workflow/tasarim.svg?v=3": "/images/workflow/tasarim-v4.svg",
  "/images/workflow/malzeme.svg?v=3": "/images/workflow/malzeme-v4.svg",
  "/images/workflow/uygulama.svg?v=3": "/images/workflow/uygulama-v4.svg",
  "/images/workflow/randevu-v3.svg": "/images/workflow/randevu-v4.svg",
  "/images/workflow/kesif-v3.svg": "/images/workflow/kesif-v4.svg",
  "/images/workflow/tasarim-v3.svg": "/images/workflow/tasarim-v4.svg",
  "/images/workflow/malzeme-v3.svg": "/images/workflow/malzeme-v4.svg",
  "/images/workflow/uygulama-v3.svg": "/images/workflow/uygulama-v4.svg",
  "/images/workflow/randevu-v4.svg": "/images/workflow/randevu-v4.svg",
  "/images/workflow/kesif-v4.svg": "/images/workflow/kesif-v4.svg",
  "/images/workflow/tasarim-v4.svg": "/images/workflow/tasarim-v4.svg",
  "/images/workflow/malzeme-v4.svg": "/images/workflow/malzeme-v4.svg",
  "/images/workflow/uygulama-v4.svg": "/images/workflow/uygulama-v4.svg",
};

function normalizeWorkflowImage(image: unknown, fallback: string) {
  if (typeof image !== "string") return fallback;
  const base = image.split("?")[0];
  if (WORKFLOW_IMAGE_MAP[image]) return WORKFLOW_IMAGE_MAP[image];
  if (WORKFLOW_IMAGE_MAP[base]) return WORKFLOW_IMAGE_MAP[base];
  if (image.trim()) return image;
  return fallback;
}

function normalizeStep(step: any, fallbackStep: (typeof DEFAULT_WORKFLOW.steps)[number]) {
  return {
    id: step?.id || fallbackStep.id,
    title: step?.title || fallbackStep.title,
    description: step?.description || fallbackStep.description,
    image: normalizeWorkflowImage(step?.image, fallbackStep.image),
  };
}

function normalizeWorkflow(workflow: any) {
  const defaultSteps = DEFAULT_WORKFLOW.steps;
  const steps = Array.isArray(workflow?.steps) ? workflow.steps : [];

  return {
    key: "home-workflow",
    title: workflow?.title || DEFAULT_WORKFLOW.title,
    steps: defaultSteps.map((defaultStep, index) => normalizeStep(steps[index] || {}, defaultStep)),
  };
}

function responseWithDefaults(overrides: Partial<typeof DEFAULT_WORKFLOW> = {}) {
  return NextResponse.json(
    {
      ...DEFAULT_WORKFLOW,
      ...overrides,
      steps: Array.isArray(overrides.steps) && overrides.steps.length > 0 ? overrides.steps : DEFAULT_WORKFLOW.steps,
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    }
  );
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
    console.error("Workflow GET failed:", error);
    return responseWithDefaults();
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const now = new Date();

    if (!body?.steps || !Array.isArray(body.steps)) {
      return responseWithDefaults();
    }

    const updated = await WorkflowContent.findOneAndUpdate(
      { key: "home-workflow" },
      {
        key: "home-workflow",
        title: body.title || "İŞ AKIŞI",
        steps: body.steps.map((step: any, index: number) => normalizeStep(step, DEFAULT_WORKFLOW.steps[index] || DEFAULT_WORKFLOW.steps[0])),
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
    console.error("Workflow PUT failed:", error);
    return responseWithDefaults();
  }
}
