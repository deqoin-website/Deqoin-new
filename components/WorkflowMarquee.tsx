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
    <section className={`workflow-section snap-section ${className}`}>
      <div className="workflow-bg-glow" />

      <header className="workflow-header">
        <h2>{title}</h2>
        <div className="workflow-header-line"></div>
      </header>

      <div className="workflow-grid-container">
        <div className="workflow-grid">
          {steps.map((step, index) => {
            return (
              <Link
                key={step.id}
                href={step.href || "/iletisim"}
                className={`workflow-card ${index % 2 === 1 ? 'workflow-card-odd' : 'workflow-card-even'}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={step.image}
                  alt={step.title}
                  className="workflow-card-img"
                />
                <div className="workflow-card-overlay" />
                
                <div className="workflow-card-content">
                  <span className="workflow-card-number">{step.id}</span>
                  <h3 className="workflow-card-title">{step.title}</h3>
                  <p className="workflow-card-desc">{step.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
