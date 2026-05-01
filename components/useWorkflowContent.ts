import { useEffect, useState } from "react";

import type { WorkflowStep } from "./WorkflowSection";
import {
  DEFAULT_WORKFLOW_STEPS,
  DEFAULT_WORKFLOW_TITLE,
  workflowDraftFromRecord,
  workflowStepsForSection,
  type WorkflowContentDraft,
} from "@/lib/workflow-content";

export type WorkflowContent = {
  title: string;
  steps: WorkflowStep[];
};

const FALLBACK_WORKFLOW: WorkflowContent = {
  title: DEFAULT_WORKFLOW_TITLE,
  steps: workflowStepsForSection(DEFAULT_WORKFLOW_STEPS),
};

export function useWorkflowContent(scope = "home") {
  const [workflow, setWorkflow] = useState<WorkflowContent>(FALLBACK_WORKFLOW);
  const [draft, setDraft] = useState<WorkflowContentDraft>({
    title: DEFAULT_WORKFLOW_TITLE,
    steps: DEFAULT_WORKFLOW_STEPS,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    const loadWorkflow = async () => {
      setLoading(true);

      try {
        const res = await fetch(`/api/workflow?scope=${encodeURIComponent(scope)}`, { cache: "no-store" });
        if (!res.ok) return;

        const data = await res.json();
        const nextDraft = workflowDraftFromRecord(data, DEFAULT_WORKFLOW_TITLE, DEFAULT_WORKFLOW_STEPS);
        if (!active) return;

        setDraft(nextDraft);
        setWorkflow({
          title: nextDraft.title,
          steps: workflowStepsForSection(nextDraft.steps, DEFAULT_WORKFLOW_STEPS),
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
  }, [scope]);

  return {
    workflow,
    draft,
    loading,
    setWorkflow,
  };
}
