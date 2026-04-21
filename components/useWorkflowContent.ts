"use client";

import { useEffect, useState } from "react";
import type { WorkflowStep } from "./WorkflowMarquee";

export type WorkflowContent = {
  title: string;
  steps: WorkflowStep[];
};

const FALLBACK_WORKFLOW: WorkflowContent = {
  title: "İŞ AKIŞI",
  steps: [],
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
        setWorkflow({
          title: json?.title || "İŞ AKIŞI",
          steps: Array.isArray(json?.steps) ? json.steps : [],
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
