import type { LucideIcon } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { CalendarDays, Compass, Hammer, Layers, PenTool } from "lucide-react";

import type { WorkflowStep as MarqueeWorkflowStep } from "@/components/WorkflowMarquee";
import type { WorkflowStep as SectionWorkflowStep } from "@/components/WorkflowSection";

export type WorkflowProcessItem = {
  title: string;
  description: string;
  icon: string;
};

export type WorkflowContentDraft = {
  title: string;
  steps: WorkflowProcessItem[];
};

export type WorkflowScopeKind = "home" | "page" | "department";

export type WorkflowContentRecord = {
  scope?: string;
  kind?: WorkflowScopeKind;
  title?: string;
  steps?: unknown;
  source?: "workflow" | "legacy" | "default";
};

export const DEFAULT_WORKFLOW_TITLE = "İŞ AKIŞI";

export const DEFAULT_WORKFLOW_STEPS: WorkflowProcessItem[] = [
  {
    title: "Randevu",
    description: "Temas, zamanlama ve beklenti tek eksende toplanır.",
    icon: "CalendarDays",
  },
  {
    title: "Keşif",
    description: "Alan, ihtiyaç ve teknik sınırlar sakin bir analizle netleştirilir.",
    icon: "Compass",
  },
  {
    title: "Tasarım",
    description: "Kavramsal fikir, tipografik disiplin ve mekansal kurgu aynı hatta birleşir.",
    icon: "PenTool",
  },
  {
    title: "Malzeme",
    description: "Doku, yüzey ve detaylar teknik bir seçkiyle rafine edilir.",
    icon: "Layers",
  },
  {
    title: "Uygulama",
    description: "Sahadaki üretim, kontrol ve teslim ritmi ölçülü biçimde hayata geçirilir.",
    icon: "Hammer",
  },
];

type WorkflowIconOption = {
  key: string;
  label: string;
  description: string;
  icon: LucideIcon;
};

export const WORKFLOW_ICON_OPTIONS: WorkflowIconOption[] = [
  { key: "CalendarDays", label: "Randevu", description: "Takvim ve planlama", icon: CalendarDays },
  { key: "Compass", label: "Keşif", description: "Yön bulma ve analiz", icon: Compass },
  { key: "PenTool", label: "Tasarım", description: "Çizim ve konsept", icon: PenTool },
  { key: "Layers", label: "Katmanlar", description: "Doku ve katman", icon: Layers },
  { key: "Hammer", label: "Uygulama", description: "Saha ve üretim", icon: Hammer },
  { key: "Sparkles", label: "Yaratıcı", description: "Öne çıkan vurgu", icon: LucideIcons.Sparkles },
  { key: "ClipboardList", label: "Liste", description: "Kontrol ve plan", icon: LucideIcons.ClipboardList },
  { key: "DraftingCompass", label: "Teknik", description: "Mekansal teknik çizim", icon: LucideIcons.DraftingCompass },
  { key: "Route", label: "Rota", description: "Aşamalı ilerleyiş", icon: LucideIcons.Route },
  { key: "MapPinned", label: "Konum", description: "Yerinde keşif", icon: LucideIcons.MapPinned },
  { key: "ShieldCheck", label: "Onay", description: "Kalite ve doğrulama", icon: LucideIcons.ShieldCheck },
  { key: "Wrench", label: "Teknik", description: "Mekanik çözüm", icon: LucideIcons.Wrench },
  { key: "Box", label: "Üretim", description: "Malzeme ve teslim", icon: LucideIcons.Box },
];

const WORKFLOW_ICONS: LucideIcon[] = DEFAULT_WORKFLOW_STEPS.map((step) => {
  const option = WORKFLOW_ICON_OPTIONS.find((item) => item.key === step.icon);
  return option?.icon || Hammer;
});

const LUCIDE_ICON_LOOKUP = LucideIcons as unknown as Record<string, LucideIcon>;

const resolveWorkflowIconKey = (value: unknown, fallback: string): string => {
  const candidate = typeof value === "string" ? value.trim() : "";
  if (candidate && LUCIDE_ICON_LOOKUP[candidate]) {
    return candidate;
  }
  return fallback;
};

export const resolveWorkflowIconComponent = (value: unknown, index = 0): LucideIcon => {
  const fallbackKey = DEFAULT_WORKFLOW_STEPS[index % DEFAULT_WORKFLOW_STEPS.length]?.icon || DEFAULT_WORKFLOW_STEPS[0].icon;
  const iconKey = resolveWorkflowIconKey(value, fallbackKey);
  return LUCIDE_ICON_LOOKUP[iconKey] || WORKFLOW_ICONS[index % WORKFLOW_ICONS.length] || Hammer;
};

const normalizeWorkflowItem = (
  value: unknown,
  fallback: WorkflowProcessItem,
  index = 0,
): WorkflowProcessItem => {
  if (!value || typeof value !== "object") return { ...fallback };

  const candidate = value as Partial<WorkflowProcessItem> & { desc?: string };
  return {
    title: candidate.title?.toString() || fallback.title,
    description: candidate.description?.toString() || candidate.desc?.toString() || fallback.description,
    icon: resolveWorkflowIconKey(candidate.icon, fallback.icon || DEFAULT_WORKFLOW_STEPS[index % DEFAULT_WORKFLOW_STEPS.length]?.icon || DEFAULT_WORKFLOW_STEPS[0].icon),
  };
};

export const normalizeWorkflowSteps = (
  value: unknown,
  fallback: WorkflowProcessItem[] = DEFAULT_WORKFLOW_STEPS,
): WorkflowProcessItem[] => {
  if (!Array.isArray(value) || value.length === 0) {
    return fallback.map((item) => ({ ...item }));
  }

  return value.map((item, index) => normalizeWorkflowItem(item, fallback[index] || fallback[0], index));
};

export const workflowDraftFromProcess = (
  value: unknown,
  fallbackTitle: string = DEFAULT_WORKFLOW_TITLE,
  fallbackSteps: WorkflowProcessItem[] = DEFAULT_WORKFLOW_STEPS,
): WorkflowContentDraft => ({
  title: fallbackTitle,
  steps: normalizeWorkflowSteps(value, fallbackSteps),
});

export const workflowDraftFromRecord = (
  value: WorkflowContentRecord | null | undefined,
  fallbackTitle: string = DEFAULT_WORKFLOW_TITLE,
  fallbackSteps: WorkflowProcessItem[] = DEFAULT_WORKFLOW_STEPS,
): WorkflowContentDraft => {
  if (!value) {
    return {
      title: fallbackTitle,
      steps: normalizeWorkflowSteps(undefined, fallbackSteps),
    };
  }

  return {
    title: value.title?.toString() || fallbackTitle,
    steps: normalizeWorkflowSteps(value.steps, fallbackSteps),
  };
};

export const workflowScopeKindFromKey = (scope: string): WorkflowScopeKind => {
  if (scope === "home") return "home";
  if (scope.startsWith("department:")) return "department";
  return "page";
};

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
    icon: resolveWorkflowIconComponent(step.icon, index),
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
    icon: step.icon,
  }));

export const pageWorkflowSectionFromDraft = (workflow: WorkflowContentDraft) => ({
  id: "workflow",
  type: "workflow",
  title: workflow.title,
  process: departmentProcessFromWorkflow(workflow),
});
