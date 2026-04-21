"use client";

import { useEffect, useState } from "react";
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
  const [workflow, setWorkflow] = useState<WorkflowContent>(FALLBACK_WORKFLOW);

  useEffect(() => {
    let cancelled = false;

    const fetchWorkflow = async () => {
      try {
        const res = await fetch("/api/workflow", { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        if (cancelled || !json) return;

        const steps = Array.isArray(json.steps) && json.steps.length > 0 ? json.steps : WORKFLOW_STEPS;
        setWorkflow({
          title: json.title || FALLBACK_WORKFLOW.title,
          steps,
        });
      } catch (error) {
        console.error("Failed to fetch workflow content:", error);
      }
    };

    void fetchWorkflow();

    return () => {
      cancelled = true;
    };
  }, []);

  return { workflow, loading: false, setWorkflow };
}
