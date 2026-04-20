"use client";

import React from "react";

export type WorkflowStep = {
  id: string;
  title: string;
  description: string;
  image: string;
};

const workflowSteps: WorkflowStep[] = [
  {
    id: "01",
    title: "RANDEVU",
    description: "Kusursuz sürecin ilk adımı.",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "02",
    title: "KEŞİF",
    description: "İhtiyaçları ve potansiyeli yerinde okuruz.",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "03",
    title: "TASARIM",
    description: "Vizyonu mimari bir dile dönüştürürüz.",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "04",
    title: "MALZEME",
    description: "Doku, kalite ve karakteri seçeriz.",
    image:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "05",
    title: "UYGULAMA",
    description: "Tasarıyı sahada gerçeğe dönüştürürüz.",
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
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
    <section
      className={`w-full h-screen bg-[#080808] text-white flex flex-col justify-center overflow-hidden relative ${className}`}
    >
      <div className="w-full text-center mb-12">
        <h2 className="text-4xl font-light tracking-widest">{title}</h2>
        <div className="w-12 h-[1px] bg-white/50 mx-auto mt-4" />
      </div>

      <div className="w-full">
        <div className="mx-auto grid w-full max-w-[92rem] grid-cols-1 gap-6 px-4 sm:grid-cols-2 xl:grid-cols-5">
          {steps.map((step) => (
            <article
              key={step.id}
              className="group relative h-[500px] overflow-hidden bg-zinc-900 border border-white/10"
            >
              <img
                src={step.image}
                alt={step.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

              <div className="absolute bottom-0 left-0 p-8 w-full">
                <span className="text-6xl text-white/20 font-light block mb-2">
                  {step.id}
                </span>
                <h3 className="text-2xl font-medium tracking-wide mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-400">{step.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
