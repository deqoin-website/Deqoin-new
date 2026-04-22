"use client";

import React from "react";
import Link from "next/link";
import { CalendarCheck2, Search, PenTool, Boxes, Hammer } from "lucide-react";

export type WorkflowStep = {
  id: string;
  title: string;
  description: string;
  href?: string;
};

const STEP_ICON_MAP: Record<string, React.ReactNode> = {
  "01": <CalendarCheck2 size={20} strokeWidth={1.8} />,
  "02": <Search size={20} strokeWidth={1.8} />,
  "03": <PenTool size={20} strokeWidth={1.8} />,
  "04": <Boxes size={20} strokeWidth={1.8} />,
  "05": <Hammer size={20} strokeWidth={1.8} />,
};

const workflowSteps: WorkflowStep[] = [
  {
    id: "01",
    title: "RANDEVU",
    description: "İhtiyaçları netleştirip süreci başlatırız.",
    href: "/iletisim",
  },
  {
    id: "02",
    title: "KEŞİF",
    description: "Mekanı yerinde analiz eder, veri toplarız.",
    href: "/kesif",
  },
  {
    id: "03",
    title: "TASARIM",
    description: "Konsepti ve çözüm dilini oluştururuz.",
    href: "/mimari",
  },
  {
    id: "04",
    title: "MALZEME",
    description: "Doğru malzeme ve yüzeyleri seçeriz.",
    href: "/materyal-studyo",
  },
  {
    id: "05",
    title: "UYGULAMA",
    description: "Projeyi sahada kontrollü biçimde uygularız.",
    href: "/uygulama",
  },
];

type WorkflowMarqueeProps = {
  steps?: WorkflowStep[];
  title?: string;
  className?: string;
};

export default function WorkflowMarquee({
  steps = workflowSteps,
  title = "İŞ AKIŞI",
  className = "",
}: WorkflowMarqueeProps) {
  return (
    <section className={`snap-section workflow-wrapper ${className}`}>
      <header className="workflow-header">
        <span className="section-small-label workflow-kicker">PROFESYONEL İŞ AKIŞI</span>
        <h2 className="workflow-title">{title}</h2>
        <div className="workflow-title-line" />
      </header>

      <div className="workflow-strip-shell">
        <div className="workflow-strip">
          {steps.map((step) => (
            <Link
              key={step.id}
              href={step.href || "/iletisim"}
              className="workflow-card"
            >
              <div className="workflow-card-top">
                <span className="workflow-card-icon-wrap">
                  {STEP_ICON_MAP[step.id] || <CalendarCheck2 size={20} strokeWidth={1.8} />}
                </span>
                <span className="workflow-step-num">{step.id}</span>
              </div>
              <div className="workflow-card-content">
                <h3 className="workflow-card-heading">{step.title}</h3>
                <p className="workflow-card-desc">{step.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
