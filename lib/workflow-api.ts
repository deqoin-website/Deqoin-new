import { normalizeWorkflowScope } from "@/lib/workflow-pages";
import type { WorkflowContentDraft, WorkflowContentRecord } from "@/lib/workflow-content";

export type WorkflowApiResponse = WorkflowContentRecord & {
  scope: string;
  route?: string;
  label?: string;
  description?: string;
};

export class WorkflowApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "WorkflowApiError";
    this.status = status;
  }
}

const parseErrorMessage = async (response: Response) => {
  try {
    const payload = await response.json();
    return payload?.error?.toString?.() || response.statusText || "Workflow API isteği başarısız oldu.";
  } catch {
    return response.statusText || "Workflow API isteği başarısız oldu.";
  }
};

export async function fetchWorkflow(scope: string): Promise<WorkflowApiResponse> {
  const normalizedScope = normalizeWorkflowScope(scope);
  const response = await fetch(`/api/workflow?scope=${encodeURIComponent(normalizedScope)}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new WorkflowApiError(await parseErrorMessage(response), response.status);
  }

  return response.json();
}

export async function saveWorkflow(scope: string, draft: WorkflowContentDraft, method: "PUT" | "POST" = "PUT") {
  const normalizedScope = normalizeWorkflowScope(scope);
  const response = await fetch("/api/workflow", {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      scope: normalizedScope,
      title: draft.title,
      steps: draft.steps,
    }),
  });

  if (!response.ok) {
    throw new WorkflowApiError(await parseErrorMessage(response), response.status);
  }

  return response.json() as Promise<WorkflowApiResponse>;
}

