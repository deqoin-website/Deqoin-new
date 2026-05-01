"use client";

import type { LucideIcon } from "lucide-react";
import { CalendarDays, Compass, Hammer, Layers, PenTool } from "lucide-react";

import WorkflowSection, { type WorkflowStep as SectionWorkflowStep } from "./WorkflowSection";

export type WorkflowStep = {
  id: string;
  title: string;
  description: string;
  href?: string;
  icon?: LucideIcon;
};

type WorkflowMarqueeProps = {
  steps?: WorkflowStep[];
  title?: string;
  className?: string;
};

const DEFAULT_STEPS: WorkflowStep[] = [
  {
    id: "01",
    title: "Randevu",
    description: "Temas, zamanlama ve beklenti tek eksende toplanır.",
  },
  {
    id: "02",
    title: "Keşif",
    description: "Alan, ihtiyaç ve teknik sınırlar sakin bir analizle netleştirilir.",
  },
  {
    id: "03",
    title: "Tasarım",
    description: "Kavramsal fikir, tipografik disiplin ve mekansal kurgu aynı hatta birleşir.",
  },
  {
    id: "04",
    title: "Malzeme",
    description: "Doku, yüzey ve detaylar teknik bir seçkiyle rafine edilir.",
  },
  {
    id: "05",
    title: "Uygulama",
    description: "Sahadaki üretim, kontrol ve teslim ritmi ölçülü biçimde hayata geçirilir.",
  },
];

const ICONS = [CalendarDays, Compass, PenTool, Layers, Hammer];

export default function WorkflowMarquee({
  steps = DEFAULT_STEPS,
  title = "İŞ AKIŞI",
  className = "",
}: WorkflowMarqueeProps) {
  const sectionSteps: SectionWorkflowStep[] = steps.map((step, index) => ({
    id: step.id,
    title: step.title,
    description: step.description,
    icon: ICONS[index] ?? Hammer,
  }));

  return <WorkflowSection steps={sectionSteps} title={title} className={className} />;
}
