import { NextResponse } from "next/server";

import connectToDatabase from "@/lib/mongodb";
import PageContent from "@/models/PageContent";
import Department from "@/models/Department";
import WorkflowContent from "@/models/WorkflowContent";
import {
  DEFAULT_WORKFLOW_STEPS,
  DEFAULT_WORKFLOW_TITLE,
  getWorkflowPresetForScope,
  isLegacyWorkflowDraft,
  normalizeWorkflowSteps,
  workflowDraftFromPageContent,
  workflowDraftFromProcess,
} from "@/lib/workflow-content";
import { getWorkflowPageNode, normalizeWorkflowScope } from "@/lib/workflow-pages";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const headers = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

type WorkflowResponse = {
  scope: string;
  route: string;
  label: string;
  description: string;
  kind: "home" | "page" | "department";
  title: string;
  steps: { title: string; description: string; icon: string }[];
  source: "workflow" | "legacy" | "default";
};

const resolveWorkflowKind = (route: string): WorkflowResponse["kind"] => {
  const depth = route.split("/").filter(Boolean).length;
  if (route === "/") return "home";
  return depth > 1 ? "department" : "page";
};

const responseFromDraft = (
  scope: string,
  title: string,
  steps: { title: string; description: string; icon: string }[],
  source: WorkflowResponse["source"],
): WorkflowResponse => {
  const page = getWorkflowPageNode(scope);
  return {
    scope,
    route: page.route,
    label: page.label,
    description: page.description,
    kind: resolveWorkflowKind(page.route),
    title,
    steps: normalizeWorkflowSteps(steps, DEFAULT_WORKFLOW_STEPS).map((step) => ({
      title: step.title,
      description: step.description,
      icon: step.icon,
    })),
    source,
  };
};

const defaultResponse = (scope = "/"): WorkflowResponse => {
  const page = getWorkflowPageNode(scope);
  const preset = getWorkflowPresetForScope(scope);
  if (preset) {
    return responseFromDraft(
      page.route,
      preset.title,
      preset.steps.map((step) => ({
        title: step.title,
        description: step.description,
        icon: step.icon,
      })),
      "default",
    );
  }

  return responseFromDraft(
    page.route,
    page.route === "/" ? DEFAULT_WORKFLOW_TITLE : `${page.label.toUpperCase()} AKIŞI`,
    normalizeWorkflowSteps(undefined, DEFAULT_WORKFLOW_STEPS).map((step) => ({
      title: step.title,
      description: step.description,
      icon: step.icon,
    })),
    "default",
  );
};

async function loadLegacyWorkflow(scope: string): Promise<WorkflowResponse | null> {
  const normalizedScope = normalizeWorkflowScope(scope);
  const page = getWorkflowPageNode(normalizedScope);

  if (normalizedScope === "/") {
    return null;
  }

  if (normalizedScope === "/kesif" || normalizedScope === "/hakkimizda" || normalizedScope === "/galeri" || normalizedScope === "/journal" || normalizedScope === "/iletisim" || normalizedScope.startsWith("/admin")) {
    return null;
  }

  await connectToDatabase();

  if (normalizedScope === "/mimari" || normalizedScope === "/materyal-studyo" || normalizedScope === "/uygulama") {
    const legacyPageKey =
      normalizedScope === "/mimari" ? "mimari" : normalizedScope === "/materyal-studyo" ? "material" : "execution";
    const [content] = await PageContent.collection
      .find({ page: legacyPageKey })
      .sort({ "metadata.updatedAt": -1, updatedAt: -1, createdAt: -1 })
      .limit(1)
      .toArray();

    if (content) {
      const draft = workflowDraftFromPageContent(content, DEFAULT_WORKFLOW_TITLE, DEFAULT_WORKFLOW_STEPS);
      if (getWorkflowPresetForScope(normalizedScope) && isLegacyWorkflowDraft(draft.steps)) {
        return null;
      }
      return responseFromDraft(normalizedScope, draft.title, draft.steps, "legacy");
    }
  }

  const slug = page.route.split("/").filter(Boolean).at(-1);
  if (!slug) return null;

  const department = await Department.findOne({ slug });
  if (department) {
    const draft = workflowDraftFromProcess(
      department.process || [],
      `${(department.title || slug).toString().toUpperCase()} AKIŞI`,
      DEFAULT_WORKFLOW_STEPS,
    );
    if (getWorkflowPresetForScope(normalizedScope) && isLegacyWorkflowDraft(draft.steps)) {
      return null;
    }
    return responseFromDraft(normalizedScope, draft.title, draft.steps, "legacy");
  }

  return null;
}

async function loadStoredWorkflow(scope: string) {
  const normalizedScope = normalizeWorkflowScope(scope);
  const candidates = [normalizedScope];

  if (normalizedScope === "/") {
    candidates.push("home");
  }

  if (normalizedScope === "/mimari") {
    candidates.push("page:mimari");
  }
  if (normalizedScope === "/materyal-studyo") {
    candidates.push("page:material");
  }
  if (normalizedScope === "/uygulama") {
    candidates.push("page:execution");
  }

  const slug = normalizedScope.split("/").filter(Boolean).at(-1);
  if (slug && normalizedScope.includes("/")) {
    candidates.push(`department:${slug}`);
  }

  for (const candidate of candidates) {
    const stored = await WorkflowContent.findOne({ scope: candidate });
    if (stored) {
      if (getWorkflowPresetForScope(normalizedScope) && isLegacyWorkflowDraft(stored.steps || [])) {
        return null;
      }

      return responseFromDraft(normalizedScope, stored.title, stored.steps || [], "workflow");
    }
  }

  return null;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const scope = normalizeWorkflowScope(searchParams.get("scope") || "/");

    await connectToDatabase();

    const stored = await loadStoredWorkflow(scope);
    if (stored) {
      return NextResponse.json(stored, { headers });
    }

    const legacy = await loadLegacyWorkflow(scope);
    if (legacy) {
      return NextResponse.json(legacy, { headers });
    }

    return NextResponse.json(defaultResponse(scope), { headers });
  } catch (error) {
    console.error("Workflow GET failed:", error);
    return NextResponse.json({ error: "Workflow verisi alınamadı." }, { status: 500 });
  }
}

async function writeWorkflow(request: Request) {
  await connectToDatabase();

  const body = await request.json().catch(() => null);
  const scope = normalizeWorkflowScope(body?.scope?.toString?.() || body?.key?.toString?.() || "");

  if (!scope) {
    return NextResponse.json({ error: "Scope is required" }, { status: 400 });
  }

  const page = getWorkflowPageNode(scope);
  const title = body?.title?.toString?.() || (scope === "/" ? DEFAULT_WORKFLOW_TITLE : `${page.label.toUpperCase()} AKIŞI`);
  const steps = normalizeWorkflowSteps(body?.steps, DEFAULT_WORKFLOW_STEPS);

  const updated = await WorkflowContent.findOneAndUpdate(
    { scope },
    {
      scope,
      kind: resolveWorkflowKind(scope),
      title,
      steps,
      metadata: { updatedAt: new Date() },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  return NextResponse.json(responseFromDraft(scope, updated.title, updated.steps || [], "workflow"), {
    headers,
  });
}

export async function PUT(request: Request) {
  try {
    return await writeWorkflow(request);
  } catch (error) {
    console.error("Workflow PUT failed:", error);
    return NextResponse.json({ error: "Workflow kaydedilemedi." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    return await writeWorkflow(request);
  } catch (error) {
    console.error("Workflow POST failed:", error);
    return NextResponse.json({ error: "Workflow kaydedilemedi." }, { status: 500 });
  }
}
