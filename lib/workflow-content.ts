import type { LucideIcon } from "lucide-react";
import { CalendarDays, Compass, Hammer, Layers, PenTool } from "lucide-react";

import type { WorkflowStep as MarqueeWorkflowStep } from "@/components/WorkflowMarquee";
import type { WorkflowStep as SectionWorkflowStep } from "@/components/WorkflowSection";

export type WorkflowProcessItem = {
  title: string;
  description: string;
};

export type WorkflowContentDraft = {
  title: string;
  steps: WorkflowProcessItem[];
};

export const DEFAULT_WORKFLOW_TITLE = "İŞ AKIŞI";

export const DEFAULT_WORKFLOW_STEPS: WorkflowProcessItem[] = [
  {
    title: "Randevu",
    description: "Temas, zamanlama ve beklenti tek eksende toplanır.",
  },
  {
    title: "Keşif",
    description: "Alan, ihtiyaç ve teknik sınırlar sakin bir analizle netleştirilir.",
  },
  {
    title: "Tasarım",
    description: "Kavramsal fikir, tipografik disiplin ve mekansal kurgu aynı hatta birleşir.",
  },
  {
    title: "Malzeme",
    description: "Doku, yüzey ve detaylar teknik bir seçkiyle rafine edilir.",
  },
  {
    title: "Uygulama",
    description: "Sahadaki üretim, kontrol ve teslim ritmi ölçülü biçimde hayata geçirilir.",
  },
];

const WORKFLOW_ICONS: LucideIcon[] = [CalendarDays, Compass, PenTool, Layers, Hammer];

const normalizeWorkflowItem = (value: unknown, fallback: WorkflowProcessItem): WorkflowProcessItem => {
  if (!value || typeof value !== "object") return { ...fallback };

  const candidate = value as Partial<WorkflowProcessItem> & { desc?: string };
  return {
    title: candidate.title?.toString() || fallback.title,
    description: candidate.description?.toString() || candidate.desc?.toString() || fallback.description,
  };
};

export const normalizeWorkflowSteps = (
  value: unknown,
  fallback: WorkflowProcessItem[] = DEFAULT_WORKFLOW_STEPS,
): WorkflowProcessItem[] => {
  if (!Array.isArray(value) || value.length === 0) {
    return fallback.map((item) => ({ ...item }));
  }

  return value.map((item, index) => normalizeWorkflowItem(item, fallback[index] || fallback[0]));
};

export const workflowDraftFromProcess = (
  value: unknown,
  fallbackTitle: string = DEFAULT_WORKFLOW_TITLE,
  fallbackSteps: WorkflowProcessItem[] = DEFAULT_WORKFLOW_STEPS,
): WorkflowContentDraft => ({
  title: fallbackTitle,
  steps: normalizeWorkflowSteps(value, fallbackSteps),
});

export const workflowDraftFromPageContent = (
  value: any,
  fallbackTitle: string = DEFAULT_WORKFLOW_TITLE,
  fallbackSteps: WorkflowProcessItem[] = DEFAULT_WORKFLOW_STEPS,
): WorkflowContentDraft => {
  const sections = Array.isArray(value?.sections) ? value.sections : [];
  const workflowSection =
    sections.find((section: any) => section?.id === "workflow" || section?.type === "workflow") || null;

  const title =
    workflowSection?.title?.toString() ||
    value?.title?.toString() ||
    fallbackTitle;

  return {
    title,
    steps: normalizeWorkflowSteps(
      workflowSection?.process || workflowSection?.content?.steps || workflowSection?.steps || value?.process,
      fallbackSteps,
    ),
  };
};

export const workflowStepsForSection = (
  value: unknown,
  fallback: WorkflowProcessItem[] = DEFAULT_WORKFLOW_STEPS,
): SectionWorkflowStep[] =>
  normalizeWorkflowSteps(value, fallback).map((step, index) => ({
    id: String(index + 1).padStart(2, "0"),
    title: step.title,
    description: step.description,
    icon: WORKFLOW_ICONS[index % WORKFLOW_ICONS.length] || Hammer,
  }));

export const workflowStepsForMarquee = (
  value: unknown,
  fallback: WorkflowProcessItem[] = DEFAULT_WORKFLOW_STEPS,
): MarqueeWorkflowStep[] =>
  normalizeWorkflowSteps(value, fallback).map((step, index) => ({
    id: String(index + 1).padStart(2, "0"),
    title: step.title,
    description: step.description,
  }));

export const departmentProcessFromWorkflow = (workflow: WorkflowContentDraft) =>
  workflow.steps.map((step) => ({
    title: step.title,
    desc: step.description,
  }));

export const pageWorkflowSectionFromDraft = (workflow: WorkflowContentDraft) => ({
  id: "workflow",
  type: "workflow",
  title: workflow.title,
  process: departmentProcessFromWorkflow(workflow),
});
