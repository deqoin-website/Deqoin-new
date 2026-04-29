"use client";

import type { LucideIcon } from "lucide-react";
import { CalendarDays, Compass, Hammer, Layers, PenTool } from "lucide-react";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export type WorkflowStep = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

const DEFAULT_WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: "01",
    title: "Randevu",
    description: "Temas, zamanlama ve beklenti tek eksende toplanır.",
    icon: CalendarDays,
  },
  {
    id: "02",
    title: "Keşif",
    description: "Alan, ihtiyaç ve teknik sınırlar sakin bir analizle netleştirilir.",
    icon: Compass,
  },
  {
    id: "03",
    title: "Tasarım",
    description: "Kavramsal fikir, tipografik disiplin ve mekansal kurgu aynı hatta birleşir.",
    icon: PenTool,
  },
  {
    id: "04",
    title: "Malzeme",
    description: "Doku, yüzey ve detaylar teknik bir seçkiyle rafine edilir.",
    icon: Layers,
  },
  {
    id: "05",
    title: "Uygulama",
    description: "Sahadaki üretim, kontrol ve teslim ritmi ölçülü biçimde hayata geçirilir.",
    icon: Hammer,
  },
];

function WorkflowStepCard({ step }: { step: WorkflowStep }) {
  const Icon = step.icon;

  return (
    <Card className="group relative w-full rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all duration-500 hover:bg-white/10 lg:p-8">
      <CardHeader className="relative flex h-full flex-col gap-5 p-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-red-500 backdrop-blur-md">
            <span className="font-[family-name:var(--font-smooch)] text-[1.35rem] font-normal leading-none tracking-[0.08em] text-red-500">
              {step.id}
            </span>
          </div>

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 backdrop-blur-md transition-colors duration-300 group-hover:bg-white/10">
            <Icon className="h-7 w-7 text-zinc-400" />
          </div>
        </div>

        <CardTitle className="font-[family-name:var(--font-smooch)] text-[1.4rem] font-normal leading-[0.92] tracking-[0.08em] text-gray-100 md:text-[1.75rem]">
          {step.title}
        </CardTitle>

        <Separator className="bg-zinc-800" />

        <CardDescription className="max-w-[20rem] font-[family-name:var(--font-smooch)] text-[1rem] font-light leading-[1.6] tracking-[0.03em] text-gray-300">
          {step.description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

function WorkflowMobileStep({ step }: { step: WorkflowStep }) {
  return (
    <div className="relative">
      <div className="absolute -left-2 top-8 z-10 flex h-4 w-4 items-center justify-center rounded-full border border-white/15 bg-zinc-950/90 backdrop-blur-md sm:top-9">
        <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
      </div>

      <div className="w-full min-w-0 pl-6 sm:pl-8">
        <WorkflowStepCard step={step} />
      </div>
    </div>
  );
}

type WorkflowSectionProps = {
  className?: string;
  title?: string;
  steps?: WorkflowStep[];
};

export default function WorkflowSection({
  className = "",
  title = "İŞ AKIŞI",
  steps = DEFAULT_WORKFLOW_STEPS,
}: WorkflowSectionProps) {
  return (
    <section
      className={`relative w-full pt-16 md:pt-20 lg:pt-24 pb-48 md:pb-64 bg-zinc-950 overflow-hidden flex flex-col items-center ${className}`.trim()}
      aria-label="İş Akış Süreci"
      style={{ fontFamily: "var(--font-smooch)" }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.05),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.03),transparent_24%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.028)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.028)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
      </div>

      <div className="w-full text-center mb-32 md:mb-48 relative z-30">
        <h2 className="text-4xl md:text-5xl font-thin tracking-[0.3em] text-white uppercase">
          {title}
        </h2>
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4 md:px-8 mt-12 md:mt-16">
        {/* MASAÜSTÜ YATAY ÇİZGİ (Tam Ortada) */}
        <div className="hidden md:block absolute top-1/2 left-4 right-4 h-[1px] bg-zinc-800 -translate-y-1/2 z-0" />

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8 relative z-10 items-center">
          {steps.map((step, index) => {
            const isTop = index % 2 === 0;
            const wrapperClassName = isTop
              ? "col-span-1 md:-translate-y-[60%] flex flex-col items-center"
              : "col-span-1 md:translate-y-[60%] flex flex-col items-center mt-12 md:mt-0";

            return (
              <div key={step.id} className={wrapperClassName}>
                <div className="md:hidden w-full">
                  <WorkflowMobileStep step={step} />
                </div>

                <div className="hidden w-full md:block">
                  <WorkflowStepCard step={step} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
