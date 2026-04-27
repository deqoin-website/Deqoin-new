"use client";

import type { LucideIcon } from "lucide-react";
import { CalendarDays, Compass, Hammer, Layers, PenTool } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type WorkflowStep = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

const WORKFLOW_STEPS: WorkflowStep[] = [
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
    <Card className="group relative h-full overflow-hidden rounded-xl border border-zinc-800 bg-[#1A1A1A] shadow-[0_14px_36px_rgba(0,0,0,0.28)] transition-all duration-500 ease-out hover:-translate-y-1 hover:border-zinc-700 hover:shadow-[0_18px_46px_rgba(0,0,0,0.4)]">
      <CardHeader className="relative flex h-full flex-col gap-5 p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-zinc-100">
            <span className="font-[family-name:var(--font-smooch)] text-[1.35rem] font-normal leading-none tracking-[0.08em]">
              {step.id}
            </span>
          </div>

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950 text-zinc-100 transition-colors duration-300 group-hover:bg-zinc-900">
            <Icon className="h-7 w-7" />
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
    <div className="relative pl-10 sm:pl-12">
      <div className="absolute left-2.5 top-0 bottom-0 w-px bg-zinc-700 sm:left-3.5" />
      <div className="absolute left-2.5 top-7 z-10 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full border border-zinc-700 bg-zinc-950 sm:left-3.5">
        <div className="h-1.5 w-1.5 rounded-full bg-zinc-200" />
      </div>

      <div className="w-full min-w-0">
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
    <div className="relative w-full sm:w-[80%] md:w-[70%] lg:w-[18rem] mx-auto h-full">
      <div
        className={`absolute left-1/2 z-20 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full border border-zinc-500 bg-zinc-950 lg:top-1/2 lg:-translate-y-1/2`}
      >
        <div className="h-1.5 w-1.5 rounded-full bg-zinc-200" />
      </div>

      <div
        className={`absolute left-1/2 h-8 w-px -translate-x-1/2 bg-zinc-500 lg:top-1/2 ${
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
};

export default function WorkflowSection({
  className = "",
}: WorkflowSectionProps) {
  return (
    <section
      className={`w-full min-h-screen bg-zinc-950 flex flex-col justify-center items-center py-24 md:py-32 overflow-hidden ${className}`.trim()}
      aria-label="İş Akış Süreci"
      style={{ fontFamily: "var(--font-smooch)" }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.05),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.03),transparent_24%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.028)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.028)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
      </div>

      <div className="w-full max-w-[1600px] xl:max-w-[1800px] mx-auto bg-zinc-900/30 rounded-3xl p-8 md:p-16 lg:p-24 relative border border-zinc-800/50 shadow-2xl">
        <Card className="relative flex h-full flex-col overflow-hidden rounded-[1.6rem] border border-zinc-900 bg-black shadow-[0_24px_70px_rgba(0,0,0,0.5)]">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent_42%)]" />

          <CardHeader className="relative flex-none p-4 pb-3 md:p-5 md:pb-4">
            <div className="max-w-4xl">
              <CardTitle className="mt-2.5 font-[family-name:var(--font-smooch)] text-[clamp(2.1rem,8vw,3rem)] font-normal leading-[0.92] tracking-[0.1em] text-white md:text-[clamp(1.7rem,3.6vw,3rem)]">
                İŞ AKIŞI
              </CardTitle>
            </div>

            <Separator className="mt-3 bg-zinc-700" />
          </CardHeader>

          <CardContent className="relative mt-0 flex flex-1 flex-col px-4 pb-4 pt-2 md:mt-0 md:px-5 md:pb-5 md:pt-3 lg:mt-24">
            <div className="lg:hidden">
              <div className="relative mx-auto max-w-6xl px-0 sm:px-2">
                <div className="space-y-5">
                  {WORKFLOW_STEPS.map((step) => (
                    <WorkflowMobileStep key={step.id} step={step} />
                  ))}
                </div>
              </div>
            </div>

            <div className="relative hidden lg:flex lg:h-[30rem]">
              <div className="absolute left-0 right-0 top-1/2 hidden h-px -translate-y-1/2 bg-zinc-500/80 lg:block" />

              <div className="flex flex-col lg:flex-row items-center justify-center gap-6 md:gap-10 lg:gap-4 relative w-full">
                {WORKFLOW_STEPS.map((step, index) => {
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
        </Card>
      </div>
    </section>
  );
}
