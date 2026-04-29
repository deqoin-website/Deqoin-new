"use client";

import type { LucideIcon } from "lucide-react";
import { CalendarDays, Compass, Hammer, Layers, PenTool } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="group relative h-full overflow-hidden rounded-xl border border-white/10 bg-white/5 p-8 backdrop-blur-md transition-all duration-500 hover:bg-white/10">
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

function WorkflowDesktopStep({
  step,
  align,
}: {
  step: WorkflowStep;
  align: "top" | "bottom";
}) {
  const isTop = align === "top";

  return (
    <div className="relative mx-auto h-full w-full lg:w-[18rem] md:w-[70%] sm:w-[80%]">
      <div
        className="absolute left-1/2 z-20 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full border border-white/15 bg-zinc-950/90 backdrop-blur-md lg:top-1/2 lg:-translate-y-1/2"
      >
        <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
      </div>

      <div
        className={`absolute left-1/2 h-8 w-px -translate-x-1/2 bg-white/15 lg:top-1/2 ${
          isTop ? "lg:-translate-y-full" : "lg:translate-y-0"
        }`}
      />

      <div
        className={`absolute left-0 right-0 ${
          isTop ? "lg:bottom-[calc(50%+2rem)]" : "lg:top-[calc(50%+2rem)]"
        }`}
      >
        <div className="w-full mx-auto">
          <WorkflowStepCard step={step} />
        </div>
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
      className={`w-full min-h-screen bg-zinc-950 flex flex-col justify-center items-center pt-24 md:pt-32 pb-40 md:pb-56 lg:pb-72 overflow-x-hidden ${className}`.trim()}
      aria-label="İş Akış Süreci"
      style={{ fontFamily: "var(--font-smooch)" }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.05),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.03),transparent_24%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.028)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.028)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
      </div>

      <div className="relative mx-auto w-full max-w-[1600px] xl:max-w-[1800px]">
        <div className="relative flex h-full flex-col overflow-hidden rounded-[1.6rem]">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent_42%)]" />

          <CardHeader className="relative flex-none p-4 pb-3 md:p-5 md:pb-4">
            <div className="mx-auto max-w-4xl text-center">
              <CardTitle className="mt-2.5 text-center font-[family-name:var(--font-smooch)] text-[clamp(2.1rem,8vw,3rem)] font-normal leading-[0.92] tracking-[0.1em] text-white md:text-[clamp(1.7rem,3.6vw,3rem)]">
                {title}
              </CardTitle>
            </div>

            <Separator className="mt-3 bg-zinc-700" />
          </CardHeader>

          <CardContent className="relative mt-0 mb-32 flex flex-1 flex-col px-4 pb-4 pt-2 md:mt-0 md:mb-48 md:px-5 md:pb-5 md:pt-3 lg:mb-56 lg:mt-24">
            <div className="lg:hidden">
              <div className="relative mx-auto max-w-6xl px-0 sm:px-2">
                <div className="space-y-5 border-l border-white/10 pl-6 sm:pl-8">
                  {steps.map((step) => (
                    <WorkflowMobileStep key={step.id} step={step} />
                  ))}
                </div>
              </div>
            </div>

            <div className="relative hidden lg:flex lg:h-[30rem]">
              <div className="absolute left-0 right-0 top-1/2 hidden h-px -translate-y-1/2 bg-zinc-500/80 lg:block" />

              <div className="flex flex-col lg:flex-row items-center justify-center gap-6 md:gap-10 lg:gap-4 relative w-full">
                {steps.map((step, index) => {
                  const isOdd = index % 2 === 0;

                  return (
                    <WorkflowDesktopStep
                      key={step.id}
                      step={step}
                      align={isOdd ? "top" : "bottom"}
                    />
                  );
                })}
              </div>
            </div>
          </CardContent>
        </div>
      </div>
    </section>
  );
}
