"use client";

import React from "react";
import Link from "next/link";

export type WorkflowStep = {
  id: string;
  title: string;
  description: string;
  image: string;
  href?: string;
  backText?: string;
};

const workflowSteps: WorkflowStep[] = [
  {
    id: "01",
    title: "RANDEVU",
    description: "İlk temas. Vizyonunuzu ve beklentilerinizi anlamak için sessiz bir diyalog başlangıcı.",
    image: "/images/workflow/randevu-v4.svg",
    href: "/iletisim",
  },
  {
    id: "02",
    title: "KEŞİF",
    description: "Mekanın ruhunu okuma. Işık, gölge ve hacim potansiyellerinin derinlemesine analizi.",
    image: "/images/workflow/kesif-v4.svg",
    href: "/kesif",
  },
  {
    id: "03",
    title: "TASARIM",
    description: "Formun kurgulanması. Estetik ve fonksiyonun pürüzsüz bir monolitik yapıda birleşimi.",
    image: "/images/workflow/tasarim-v4.svg",
    href: "/mimari",
  },
  {
    id: "04",
    title: "MALZEME",
    description: "Dokuların seçimi. Kusursuz bir hissiyat yaratmak için özenle seçilmiş ham materyaller.",
    image: "/images/workflow/malzeme-v4.svg",
    href: "/materyal-studyo",
  },
  {
    id: "05",
    title: "UYGULAMA",
    description: "Vizyonun gerçeğe dönüşümü. Mimari bütünlüğü koruyan tavizsiz bir inşa süreci.",
    image: "/images/workflow/uygulama-v4.svg",
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
        <div className="workflow-hero-panel">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={steps[0]?.image || workflowSteps[0].image} alt={steps[0]?.title || workflowSteps[0].title} />
          <div className="workflow-hero-overlay" />
          <div className="workflow-hero-copy">
            <span className="workflow-hero-label">{steps[0]?.id || "01"}</span>
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
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={step.image} alt="" aria-hidden="true" />
                  </span>
                </div>
                <div className="workflow-card-content">
                  <h3 className="workflow-card-heading">{step.title}</h3>
                  <p className="workflow-card-desc">{step.description}</p>
                  {step.backText ? <p className="workflow-card-backtext">{step.backText}</p> : null}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
