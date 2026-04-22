"use client";

import React from "react";
import Link from "next/link";
import { CalendarCheck2, Search, PenTool, Boxes, Hammer, Workflow as WorkflowIcon } from "lucide-react";

export type WorkflowStep = {
  id: string;
  title: string;
  description: string;
  image?: string;
  icon?: string;
  href?: string;
  backText?: string;
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
    description: "İlk temas. Vizyonunuzu ve beklentilerinizi anlamak için sessiz bir diyalog başlangıcı.",
    href: "/iletisim",
  },
  {
    id: "02",
    title: "KEŞİF",
    description: "Mekanın ruhunu okuma. Işık, gölge ve hacim potansiyellerinin derinlemesine analizi.",
    href: "/kesif",
  },
  {
    id: "03",
    title: "TASARIM",
    description: "Formun kurgulanması. Estetik ve fonksiyonun pürüzsüz bir monolitik yapıda birleşimi.",
    href: "/mimari",
  },
  {
    id: "04",
    title: "MALZEME",
    description: "Dokuların seçimi. Kusursuz bir hissiyat yaratmak için özenle seçilmiş ham materyaller.",
    href: "/materyal-studyo",
  },
  {
    id: "05",
    title: "UYGULAMA",
    description: "Vizyonun gerçeğe dönüşümü. Mimari bütünlüğü koruyan tavizsiz bir inşa süreci.",
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
      <div
        className="workflow-backdrop pointer-events-none"
        aria-hidden="true"
      />

      <header className="workflow-header">
        <span className="section-small-label workflow-kicker">PROFESYONEL İŞ AKIŞI</span>
        <h2 className="workflow-title">{title}</h2>
        <div className="workflow-title-line" />
      </header>

      <div className="workflow-layout">
        <div className="workflow-intro-panel">
          <div className="workflow-intro-badge">
            <WorkflowIcon size={28} strokeWidth={1.8} />
          </div>
          <div className="workflow-intro-copy">
            <span className="workflow-intro-step">{steps[0]?.id || "01"}</span>
            <h3>{steps[0]?.title || workflowSteps[0].title}</h3>
            <p>{steps[0]?.description || workflowSteps[0].description}</p>
          </div>
        </div>

        <div className="workflow-strip-shell">
          <div className="workflow-strip">
            {steps.map((step, index) => (
              <Link
                key={step.id}
                href={step.href || "/iletisim"}
                className={`workflow-card ${index % 2 === 1 ? "offset-down" : "offset-up"}`}
              >
                <div className="workflow-card-top">
                  <span className="workflow-step-num">{step.id}</span>
                  <span className="workflow-card-icon-wrap">
                    {STEP_ICON_MAP[step.id] || <WorkflowIcon size={20} strokeWidth={1.8} />}
                  </span>
                </div>
                <div className="workflow-card-content">
                  <h3 className="workflow-card-heading">{step.title}</h3>
                  <p className="workflow-card-desc">{step.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
