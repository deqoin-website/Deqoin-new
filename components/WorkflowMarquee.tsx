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
    <section className={`snap-section w-full min-h-screen md:min-h-svh flex flex-col items-center justify-center bg-[#0E0E0E] relative overflow-hidden ${className}`}>
      {/* Background Glow similar to design */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 0%, rgba(14,14,14,0.1) 40%, rgba(10,10,10,1) 100%)"
        }}
      />

      {/* Header */}
      <header className="relative z-10 flex flex-col items-center mb-12 md:mb-24 lg:mb-32">
        <h2 className="font-headline text-4xl md:text-5xl font-light tracking-[0.3em] uppercase text-white mb-6">
          {title}
        </h2>
        <div className="h-[1px] w-64 bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
      </header>

      {/* Grid / Horizontal Scroll Area */}
      <div className="relative z-10 w-full max-w-[2000px] px-6 md:px-12">
        <div className="flex flex-col md:flex-row gap-8 md:gap-6 lg:gap-10 justify-center items-center md:items-stretch overflow-visible">
          {steps.map((step, index) => {
            // Alternating offsets for cards
            const offsetClass = index % 2 === 1 ? "md:translate-y-12 lg:translate-y-16" : "md:-translate-y-4";
            
            return (
              <Link
                key={step.id}
                href={step.href || "/iletisim"}
                className={`group block relative w-full max-w-[380px] md:w-[18vw] lg:w-[16vw] aspect-[3/4] md:h-auto overflow-hidden bg-[#1C1B1B] border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.3)] transition-all duration-700 hover:border-white/20 ${offsetClass}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={step.image}
                  alt={step.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent opacity-90" />
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 p-6 lg:p-10 flex flex-col z-10 w-full">
                  <span className="font-headline text-xs lg:text-sm text-white/40 tracking-[0.2em] mb-2 font-light">
                    {step.id}
                  </span>
                  <h3 className="font-headline text-xl lg:text-2xl font-light tracking-[0.15em] text-white uppercase mb-3">
                    {step.title}
                  </h3>
                  <p className="font-body text-white/60 leading-relaxed text-xs lg:text-sm tracking-[0.02em] max-w-[20ch] md:max-w-none">
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
