"use client";

import React from "react";

export type WorkflowStep = {
  id: string;
  title: string;
  description: string;
  image: string;
};

const defaultSteps: WorkflowStep[] = [
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
    description: "Mekanın potansiyelini, ışığını ve ritmini okuruz.",
    image:
      "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "03",
    title: "TASARIM",
    description: "Lüks, işlev ve oranı aynı dilde birleştiririz.",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "04",
    title: "MALZEME",
    description: "Doku, kalite ve dayanıklılık ekseninde seçim yaparız.",
    image:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "05",
    title: "UYGULAMA",
    description: "Detayı kontrol eder, tasarımı gerçeğe dönüştürürüz.",
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
  },
];

type WorkflowMarqueeProps = {
  steps?: WorkflowStep[];
  title?: string;
  direction?: "left" | "right";
  speed?: number;
  className?: string;
};

export default function WorkflowMarquee({
  steps = defaultSteps,
  title = "İŞ AKIŞI",
  direction = "left",
  speed = 34,
  className = "",
}: WorkflowMarqueeProps) {
  const repeatedSteps = React.useMemo(() => [...steps, ...steps], [steps]);
  const duration = Math.max(18, speed);
  const animationName = direction === "left" ? "workflow-marquee-left" : "workflow-marquee-right";

  return (
    <section
      className={`snap-start overflow-hidden bg-[#050505] py-16 text-white ${className}`}
    >
      <div className="mx-auto mb-8 flex w-full max-w-7xl items-end justify-between px-5 md:px-8">
        <div className="space-y-3">
          <p className="text-[0.7rem] uppercase tracking-[0.45em] text-white/45">
            Workflow
          </p>
          <h2 className="font-light tracking-[0.28em] text-white/92 text-2xl md:text-4xl">
            {title}
          </h2>
        </div>
        <div className="hidden h-px flex-1 bg-gradient-to-r from-white/20 via-white/5 to-transparent md:ml-8 md:block" />
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-[#050505] to-transparent md:w-40" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-[#050505] to-transparent md:w-40" />

        <div
          className="workflow-marquee-track flex w-max gap-5 px-5 md:gap-6 md:px-8"
          style={
            {
              animationName,
              animationDuration: `${duration}s`,
              animationTimingFunction: "linear",
              animationIterationCount: "infinite",
              animationPlayState: "running",
              willChange: "transform",
            } as React.CSSProperties
          }
        >
          {repeatedSteps.map((step, index) => (
            <article
              key={`${step.id}-${index}`}
              className="group relative h-[420px] w-[82vw] overflow-hidden rounded-[2rem] bg-[#0d0d0d] shadow-[0_30px_90px_rgba(0,0,0,0.5)] sm:w-[360px] md:h-[460px] md:w-[320px] lg:w-[360px]"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.04]"
                style={{ backgroundImage: `url(${step.image})` }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/5" />
              <div className="absolute inset-0 bg-black/18" />

              <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-7">
                <div className="flex justify-end">
                  <span className="text-xs font-light tracking-[0.5em] text-white/80">
                    {step.id}
                  </span>
                </div>

                <div className="max-w-[78%]">
                  <h3 className="text-[2.2rem] leading-none font-extralight tracking-[0.28em] text-white md:text-[2.8rem]">
                    {step.title}
                  </h3>
                  <p className="mt-4 max-w-[22ch] text-sm leading-6 text-white/72 md:text-[0.95rem]">
                    {step.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .workflow-marquee-track:hover {
          animation-play-state: paused !important;
        }

        @keyframes workflow-marquee-left {
          from {
            transform: translateX(0%);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @keyframes workflow-marquee-right {
          from {
            transform: translateX(-50%);
          }
          to {
            transform: translateX(0%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .workflow-marquee-track {
            animation: none !important;
            transform: translateX(0) !important;
          }
        }
      `}</style>
    </section>
  );
}
