"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ScrollText } from "lucide-react";

export type WorkflowStep = {
  id: string;
  title: string;
  description: string;
  href?: string;
  icon?: ReactNode;
};

type WorkflowMarqueeProps = {
  steps?: WorkflowStep[];
  title?: string;
  className?: string;
};

const DEFAULT_STEPS: WorkflowStep[] = [
  {
    id: "01",
    title: "Quality Guarantee",
    description:
      "Her detay, malzeme seçimi ve uygulama aşaması premium kalite kontrolüyle ilerler. Sonuç, ölçülü ve uzun ömürlü bir iç mekan dili üretir.",
    href: "/iletisim",
  },
  {
    id: "02",
    title: "Spatial Planning",
    description:
      "Alan akışı, kullanım senaryoları ve dolaşım kurgusu net bir mimari mantıkla şekillendirilir. İşlev ve estetik aynı çizgide tutulur.",
    href: "/kesif",
  },
  {
    id: "03",
    title: "Detail Refinement",
    description:
      "Mobilya, yüzey ve ışık kararları tek bir sistem gibi çalışacak biçimde rafine edilir. Sessiz ama güçlü bir bütünlük hedeflenir.",
    href: "/mimari",
  },
];

export default function WorkflowMarquee({
  steps = DEFAULT_STEPS,
  title = "Working / Process",
  className = "",
}: WorkflowMarqueeProps) {
  const items = steps.slice(0, 3);

  return (
    <section className={`w-full bg-[#F5F1EA] px-4 py-16 md:px-8 lg:px-12 ${className}`.trim()}>
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 md:gap-0 md:block">
          <div className="flex flex-col gap-0 md:flex-row md:items-start">
            <div className="relative w-full overflow-hidden rounded-[2rem] bg-[#E7DDCF] md:h-[42rem] md:w-[42%] lg:w-[38%]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.3),_transparent_45%),linear-gradient(180deg,_rgba(255,255,255,0.08),_rgba(0,0,0,0.08))]" />
              <Image
                src="/images/about_interior.png"
                alt="Architectural interior placeholder"
                fill
                priority
                className="object-cover object-center mix-blend-multiply"
              />
              <div className="absolute inset-0 border border-white/30" />
              <div className="absolute left-4 top-4 rounded-full border border-white/50 bg-white/25 px-3 py-1 text-[0.7rem] font-light tracking-[0.35em] text-white/90 backdrop-blur-sm md:left-6 md:top-6">
                ARCHITECTURE
              </div>
              <div className="absolute bottom-4 left-4 max-w-[10rem] text-xs font-light uppercase tracking-[0.35em] text-white/85 md:bottom-6 md:left-6">
                Interior placeholder
              </div>
            </div>

            <div className="md:-ml-10 md:flex-1 md:pt-16 lg:-ml-14">
              <div className="rounded-[2rem] bg-white px-6 py-10 shadow-[0_30px_80px_rgba(35,28,20,0.08)] md:px-12 md:py-14 lg:px-16 lg:py-16">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-0">
                  {items.map((step, index) => (
                    <div
                      key={step.id}
                      className="border-b border-black/5 pb-8 md:border-b-0 md:border-r md:border-r-black/10 md:px-8 md:last:border-r-0 lg:px-10"
                    >
                      <Link
                        href={step.href || "#"}
                        className="group block h-full outline-none transition-transform duration-300 hover:-translate-y-1"
                      >
                        <div className="flex items-start gap-3">
                          <span className="mt-1 text-[#C19A6B] transition-transform duration-300 group-hover:scale-105">
                            {step.icon ?? <ScrollText className="h-6 w-6 stroke-[1.4]" />}
                          </span>
                          <span className="font-light leading-none tracking-[0.04em] text-[#C19A6B]">
                            <span className="text-4xl md:text-5xl lg:text-6xl">
                              {step.id || `0${index + 1}`}
                            </span>
                          </span>
                        </div>

                        <h3 className="mt-6 text-[1.05rem] font-medium tracking-[0.02em] text-[#171717] md:text-[1.1rem]">
                          {step.title}
                        </h3>

                        <p className="mt-4 max-w-sm text-sm leading-7 text-gray-500">
                          {step.description}
                        </p>
                      </Link>
                    </div>
                  ))}
                </div>

                <div className="mt-12 flex flex-wrap items-baseline gap-x-4 gap-y-2 border-t border-black/5 pt-10 md:mt-14 md:pt-12">
                  <span className="text-3xl font-bold tracking-tight text-[#121212] md:text-5xl lg:text-6xl">
                    Working
                  </span>
                  <span className="text-3xl font-light tracking-tight text-[#C19A6B] md:text-5xl lg:text-6xl">
                    Process
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-right text-[0.7rem] font-light tracking-[0.3em] text-[#9F8B75] md:hidden">
            QUIET LUXURY WORKFLOW
          </div>
        </div>
      </div>
    </section>
  );
}
