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
      description: "İhtiyaçları netleştiririz.",
    },
    {
      id: "02",
      title: "KEŞİF",
      description: "Mekanı yerinde analiz ederiz.",
    },
    {
      id: "03",
      title: "TASARIM",
      description: "Konsept ve çözüm dili oluştururuz.",
    },
    {
      id: "04",
      title: "MALZEME",
      description: "Doğru yüzey ve materyali seçeriz.",
    },
    {
      id: "05",
      title: "UYGULAMA",
      description: "Sahada kontrollü biçimde uygularız.",
    },
  ],
};

function normalizeStep(step: any, fallbackStep: (typeof DEFAULT_WORKFLOW.steps)[number]) {
  return {
    id: step?.id || fallbackStep.id,
    title: step?.title || fallbackStep.title,
    description: step?.description || fallbackStep.description,
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
