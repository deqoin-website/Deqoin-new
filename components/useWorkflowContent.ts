import { useEffect, useState } from "react";

import type { WorkflowStep } from "./WorkflowSection";
import { fetchWorkflow } from "@/lib/workflow-api";
import {
  DEFAULT_WORKFLOW_STEPS,
  DEFAULT_WORKFLOW_TITLE,
  cloneWorkflowDraft,
  getWorkflowFallbackDraftForScope,
  workflowDraftFromRecord,
  workflowStepsForSection,
  type WorkflowContentDraft,
} from "@/lib/workflow-content";
import { normalizeWorkflowScope } from "@/lib/workflow-pages";

export type WorkflowContent = {
  title: string;
  steps: WorkflowStep[];
};

export function useWorkflowContent(scope = "home") {
  const scopeFallbackDraft = getWorkflowFallbackDraftForScope(scope);
  const scopeFallbackWorkflow = {
    title: scopeFallbackDraft.title,
    steps: workflowStepsForSection(scopeFallbackDraft.steps, DEFAULT_WORKFLOW_STEPS),
  };
  const [workflow, setWorkflow] = useState<WorkflowContent>(scopeFallbackWorkflow);
  const [draft, setDraft] = useState<WorkflowContentDraft>(cloneWorkflowDraft(scopeFallbackDraft));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    const loadWorkflow = async () => {
      setLoading(true);

      try {
        const data = await fetchWorkflow(normalizeWorkflowScope(scope));
        const nextDraft = workflowDraftFromRecord(data, DEFAULT_WORKFLOW_TITLE, DEFAULT_WORKFLOW_STEPS);
        if (!active) return;

        setDraft(nextDraft);
        setWorkflow({
          title: nextDraft.title,
          steps: workflowStepsForSection(nextDraft.steps, DEFAULT_WORKFLOW_STEPS),
        });
      } catch (error) {
        console.error("Workflow content load error:", error);
        if (!active) return;

        const fallbackDraft = getWorkflowFallbackDraftForScope(scope);
        setDraft(cloneWorkflowDraft(fallbackDraft));
        setWorkflow({
          title: fallbackDraft.title,
          steps: workflowStepsForSection(fallbackDraft.steps, DEFAULT_WORKFLOW_STEPS),
        });
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
