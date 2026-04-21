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
    <section className={`flex-grow pt-40 pb-32 px-6 md:px-12 overflow-hidden flex flex-col items-center bg-[#0E0E0E] ${className}`}>
      {/* Header */}
      <header className="flex flex-col items-center mb-24 md:mb-32">
        <h2 className="font-headline text-4xl font-light tracking-[0.3em] uppercase text-white mb-6">
          {title}
        </h2>
        <div className="h-[1px] w-64 bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
      </header>

      {/* Grid */}
      <div className="flex flex-col md:flex-row gap-12 md:gap-8 lg:gap-12 w-full max-w-[2000px] justify-center items-center md:items-stretch">
        {steps.map((step, index) => {
          // Determine offsets exactly like the design
          const offsetClass = index % 2 === 1 ? "md:translate-y-16 translate-x-4 md:translate-x-0" : "md:-translate-y-4 -translate-x-4 md:-translate-x-0";
          
          return (
            <Link
              key={step.id}
              href={step.href || "/iletisim"}
              className={`group block relative w-[85%] md:w-[400px] h-[500px] md:h-[600px] overflow-hidden bg-[#1C1B1B] border border-[#474747]/10 shadow-[0_0_60px_rgba(198,198,199,0.05)] transition-transform duration-700 hover:border-[#474747]/30 ${offsetClass}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={step.image}
                alt={step.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-10 flex flex-col z-10 w-full">
                <span className="font-headline text-sm text-[#c6c6c6]/50 tracking-[0.2em] mb-2 font-light">
                  {step.id}
                </span>
                <h3 className="font-headline text-2xl font-light tracking-[0.15em] text-white uppercase mb-3">
                  {step.title}
                </h3>
                <p className="font-body text-[#c6c6c6] leading-relaxed text-sm tracking-[0.02em]">
                  {step.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
