import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import PageContent from "@/models/PageContent";
import Department from "@/models/Department";
import WorkflowContent from "@/models/WorkflowContent";
import {
  DEFAULT_WORKFLOW_STEPS,
  DEFAULT_WORKFLOW_TITLE,
  workflowDraftFromPageContent,
  workflowDraftFromProcess,
  workflowScopeKindFromKey,
  normalizeWorkflowSteps,
} from "@/lib/workflow-content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type WorkflowResponse = {
  scope: string;
  kind: "home" | "page" | "department";
  title: string;
  steps: { title: string; description: string; icon: string }[];
  source: "workflow" | "legacy" | "default";
};

const defaultResponse = (scope = "home"): WorkflowResponse => ({
  scope,
  kind: workflowScopeKindFromKey(scope),
  title: scope === "home" ? DEFAULT_WORKFLOW_TITLE : `${scope.replace(/^(page:|department:)/, "").toUpperCase()} AKIŞI`,
  steps: normalizeWorkflowSteps(undefined, DEFAULT_WORKFLOW_STEPS).map((step) => ({
    title: step.title,
    description: step.description,
    icon: step.icon,
  })),
  source: "default",
});

const toResponse = (
  scope: string,
  data: { title?: string; steps?: { title: string; description: string; icon: string }[] },
  source: WorkflowResponse["source"],
): WorkflowResponse => ({
  scope,
  kind: workflowScopeKindFromKey(scope),
  title: data.title || DEFAULT_WORKFLOW_TITLE,
  steps: normalizeWorkflowSteps(data.steps, DEFAULT_WORKFLOW_STEPS).map((step) => ({
    title: step.title,
    description: step.description,
    icon: step.icon,
  })),
  source,
});

async function loadLegacyWorkflow(scope: string): Promise<WorkflowResponse | null> {
  const kind = workflowScopeKindFromKey(scope);
  const connection = await connectToDatabase();
  const db = connection?.connection?.db;

  if (!db) return null;

  if (kind === "home") {
    return null;
  }

  if (kind === "page") {
    const page = scope.replace(/^page:/, "");
    const [content] = await PageContent.collection
      .find({ page })
      .sort({ "metadata.updatedAt": -1, updatedAt: -1, createdAt: -1 })
      .limit(1)
      .toArray();

    if (!content) return null;

    const draft = workflowDraftFromPageContent(content, DEFAULT_WORKFLOW_TITLE, DEFAULT_WORKFLOW_STEPS);
    return toResponse(scope, { title: draft.title, steps: draft.steps }, "legacy");
  }

  const slug = scope.replace(/^department:/, "");
  const department = await Department.findOne({ slug });
  if (!department) return null;

  const draft = workflowDraftFromProcess(
    department.process || [],
    `${(department.title || slug).toString().toUpperCase()} AKIŞI`,
    DEFAULT_WORKFLOW_STEPS,
  );

  return toResponse(scope, { title: draft.title, steps: draft.steps }, "legacy");
}

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const scope = searchParams.get("scope") || "home";

    const stored = await WorkflowContent.findOne({ scope });
    if (stored) {
      return NextResponse.json(toResponse(scope, stored.toObject(), "workflow"), {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      });
    }

    if (scope !== "home") {
      const home = await WorkflowContent.findOne({ scope: "home" });
      if (home) {
        return NextResponse.json(toResponse("home", home.toObject(), "workflow"), {
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
        });
      }
    }

    const legacy = await loadLegacyWorkflow(scope);
    if (legacy) {
      return NextResponse.json(legacy, {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      });
    }

    return NextResponse.json(defaultResponse(scope), {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
  } catch (error) {
    console.error("Workflow GET failed:", error);
    return NextResponse.json(defaultResponse("home"));
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json().catch(() => null);
    const scope = body?.scope?.toString?.() || body?.key?.toString?.() || "";

    if (!scope) {
      return NextResponse.json({ error: "Scope is required" }, { status: 400 });
    }

    const kind = workflowScopeKindFromKey(scope);
    const title = body?.title?.toString?.() || (scope === "home" ? DEFAULT_WORKFLOW_TITLE : `${scope.replace(/^(page:|department:)/, "").toUpperCase()} AKIŞI`);
    const steps = normalizeWorkflowSteps(body?.steps, DEFAULT_WORKFLOW_STEPS);

    const updated = await WorkflowContent.findOneAndUpdate(
      { scope },
      {
        scope,
        kind,
        title,
        steps,
        metadata: { updatedAt: new Date() },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    return NextResponse.json(toResponse(scope, updated.toObject(), "workflow"), {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
  } catch (error) {
    console.error("Workflow PUT failed:", error);
    return NextResponse.json({ error: "Workflow kaydedilemedi." }, { status: 500 });
  }
}
