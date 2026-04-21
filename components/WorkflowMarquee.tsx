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
      {/* Background Glow similar to design */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 0%, rgba(14,14,14,0.1) 40%, rgba(10,10,10,1) 100%)",
          position: "absolute",
          inset: 0,
          pointerEvents: "none"
        }}
      />

      {/* Header */}
      <header className="relative z-10 workflow-header" style={{ position: 'relative', zIndex: 10 }}>
        <h2 className="workflow-title">
          {title}
        </h2>
        <div className="workflow-title-line"></div>
      </header>

      {/* Grid Area */}
      <div className="relative z-10 w-full overflow-visible" style={{ position: 'relative', zIndex: 10, width: '100%', overflow: 'visible' }}>
        <div className="workflow-grid">
          {steps.map((step, index) => {
            // Alternating offsets for cards
            const offsetClass = index % 2 === 1 ? "offset-down" : "offset-up";
            
            return (
              <Link
                key={step.id}
                href={step.href || "/iletisim"}
                className={`workflow-card group ${offsetClass}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={step.image}
                  alt={step.title}
                />
                {/* Gradient Overlay */}
                <div className="workflow-card-overlay" />
                
                {/* Content */}
                <div className="workflow-card-content">
                  <span className="workflow-step-num">
                    {step.id}
                  </span>
                  <h3 className="workflow-card-heading">
                    {step.title}
                  </h3>
                  <p className="workflow-card-desc">
                    {step.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
