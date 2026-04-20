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
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "02",
    title: "KEŞİF",
    description: "Mekanın potansiyelini ve ihtiyaçlarını yerinde okuruz.",
    image:
      "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "03",
    title: "TASARIM",
    description: "Denge, oran ve lüks dili tek bir kurguda birleşir.",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "04",
    title: "MALZEME",
    description: "Doku, kalite ve karakteri bir araya getiririz.",
    image:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "05",
    title: "UYGULAMA",
    description: "Tasarımı sahada hassasiyetle gerçeğe dönüştürürüz.",
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=80",
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
      className={`bg-[#0a0a0a] text-white h-screen min-h-screen flex flex-col justify-center overflow-hidden snap-start ${className}`}
    >
      <div className="mx-auto w-full max-w-7xl px-5 md:px-8">
        <div className="mb-10 flex flex-col items-center justify-center text-center">
          <span className="mb-4 text-[0.7rem] uppercase tracking-[0.45em] text-white/45">
            Deqoin
          </span>
          <h2 className="font-light tracking-[0.28em] text-white text-2xl md:text-4xl">
            {title}
          </h2>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-[#0a0a0a] to-transparent md:w-40" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-[#0a0a0a] to-transparent md:w-40" />

          <div className="workflow-marquee-track flex gap-6 w-max hover:[animation-play-state:paused]">
            {repeatedSteps.map((step, index) => (
              <article
                key={`${step.id}-${index}`}
                className="relative min-w-[320px] md:min-w-[400px] h-[500px] overflow-hidden rounded-[2rem] bg-[#111] shadow-[0_30px_90px_rgba(0,0,0,0.55)] shrink-0"
              >
                <img
                  src={step.image}
                  alt={step.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

                <div className="absolute bottom-0 left-0 p-8">
                  <div className="mb-2 text-6xl text-white/20 font-light leading-none">
                    {step.id}
                  </div>
                  <h3 className="text-[2rem] md:text-[2.4rem] font-extralight tracking-[0.28em] text-white uppercase leading-none">
                    {step.title}
                  </h3>
                  <p className="mt-4 max-w-[24ch] text-sm md:text-base leading-6 text-white/80">
                    {step.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .workflow-marquee-track:hover {
          animation-play-state: paused !important;
        }

        .workflow-marquee-track {
          animation-duration: ${duration}s;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          animation-name: ${animationName};
          will-change: transform;
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
