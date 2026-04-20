"use client";

import React from "react";
export type WorkflowStep = {
  id: string;
  title: string;
  description: string;
};

const defaultSteps: WorkflowStep[] = [
  {
    id: "01",
    title: "RANDEVU",
    description: "Kusursuz sürecin ilk adımı.",
  },
  {
    id: "02",
    title: "KEŞİF",
    description: "Mekanın potansiyelini ve ihtiyaçlarını yerinde okuruz.",
  },
  {
    id: "03",
    title: "TASARIM",
    description: "Denge, oran ve lüks dili tek bir kurguda birleşir.",
  },
  {
    id: "04",
    title: "MALZEME",
    description: "Doku, kalite ve karakteri bir araya getiririz.",
  },
  {
    id: "05",
    title: "UYGULAMA",
    description: "Tasarımı sahada hassasiyetle gerçeğe dönüştürürüz.",
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
        <div className="w-full text-center mb-12">
          <h2 className="text-4xl font-light tracking-widest">{title}</h2>
          <div className="w-12 h-[1px] bg-white/50 mx-auto mt-4" />
        </div>

        <div className="relative">
          <div className="workflow-marquee-track flex gap-6 w-max px-4 hover:[animation-play-state:paused]">
            {repeatedSteps.map((step, index) => (
              <article
                key={`${step.id}-${index}`}
                className="w-[320px] md:w-[400px] h-[500px] shrink-0 relative bg-zinc-900 border border-white/10 overflow-hidden group"
              >
                <div className="absolute inset-0 bg-[#111] group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />

                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <span className="text-6xl text-white/10 font-light block mb-2">
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
