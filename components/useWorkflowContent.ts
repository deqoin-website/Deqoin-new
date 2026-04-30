import { useEffect, useState } from "react";

import type { WorkflowStep } from "./WorkflowMarquee";
import {
  DEFAULT_WORKFLOW_STEPS,
  DEFAULT_WORKFLOW_TITLE,
  workflowDraftFromPageContent,
  workflowStepsForMarquee,
} from "@/lib/workflow-content";

export type WorkflowContent = {
  title: string;
  steps: WorkflowStep[];
};

const FALLBACK_WORKFLOW: WorkflowContent = {
  title: DEFAULT_WORKFLOW_TITLE,
  steps: workflowStepsForMarquee(DEFAULT_WORKFLOW_STEPS),
};

export function useWorkflowContent(page = "kesif") {
  const [workflow, setWorkflow] = useState<WorkflowContent>(FALLBACK_WORKFLOW);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    const loadWorkflow = async () => {
      setLoading(true);

      try {
        const res = await fetch(`/api/content?page=${page}`, { cache: "no-store" });
        if (!res.ok) return;

        const data = await res.json();
        const draft = workflowDraftFromPageContent(data, DEFAULT_WORKFLOW_TITLE, DEFAULT_WORKFLOW_STEPS);
        if (!active) return;

        setWorkflow({
          title: draft.title,
          steps: workflowStepsForMarquee(draft.steps, DEFAULT_WORKFLOW_STEPS),
        });
      } catch (error) {
        console.error("Workflow content load error:", error);
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadWorkflow();

    return () => {
      active = false;
    };
  }, [page]);

  return {
    workflow,
    loading,
    setWorkflow,
  };
}
