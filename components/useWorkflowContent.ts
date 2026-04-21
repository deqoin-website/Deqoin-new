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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        const res = await fetch("/api/workflow", { cache: "no-store", signal: controller.signal });
        if (!res.ok) throw new Error("workflow fetch failed");
        const json = await res.json();
        const steps = Array.isArray(json?.steps) && json.steps.length > 0 ? json.steps : WORKFLOW_STEPS;
        setWorkflow({
          title: json?.title || "İŞ AKIŞI",
          steps,
        });
      } catch {
        setWorkflow(FALLBACK_WORKFLOW);
      } finally {
        setLoading(false);
      }
    };

    void load();
    return () => controller.abort();
  }, []);

  return { workflow, loading };
}
