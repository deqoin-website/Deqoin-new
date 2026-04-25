import type { WorkflowStep } from "./WorkflowMarquee";
import { WORKFLOW_STEPS } from "../data/workflows";

export type WorkflowContent = {
  title: string;
  steps: WorkflowStep[];
};

const FALLBACK_WORKFLOW: WorkflowContent = {
  title: "İŞ AKIŞI",
  steps: WORKFLOW_STEPS,
};

export function useWorkflowContent() {
  return {
    workflow: FALLBACK_WORKFLOW,
    loading: false,
    setWorkflow: () => undefined,
  };
}
