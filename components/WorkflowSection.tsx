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
    <Card className="group relative h-full overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-[0_14px_36px_rgba(0,0,0,0.08)] transition-all duration-500 ease-out hover:-translate-y-1 hover:border-zinc-300 hover:shadow-[0_18px_46px_rgba(0,0,0,0.12)]">
      <CardHeader className="relative flex h-full flex-col gap-5 p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-zinc-100 text-zinc-900">
            <span className="font-[family-name:var(--font-smooch)] text-[1.35rem] font-normal leading-none tracking-[0.08em]">
              {step.id}
            </span>
          </div>

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-zinc-900 transition-colors duration-300 group-hover:bg-white">
            <Icon className="h-7 w-7" />
          </div>
        </div>

        <CardTitle className="font-[family-name:var(--font-smooch)] text-[1.4rem] font-normal leading-[0.92] tracking-[0.08em] text-zinc-950 md:text-[1.75rem]">
          {step.title}
        </CardTitle>

        <Separator className="bg-zinc-200" />

        <CardDescription className="max-w-[20rem] font-[family-name:var(--font-smooch)] text-[1rem] font-light leading-[1.6] tracking-[0.03em] text-zinc-700">
          {step.description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

function WorkflowMobileStep({
  step,
  align,
}: {
  step: WorkflowStep;
  align: "left" | "right";
}) {
  const isLeft = align === "left";

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_2.75rem_minmax(0,1fr)] items-center">
      <div
        className={`relative ${
          isLeft ? "justify-self-end pr-4" : "opacity-0"
        }`}
      >
        <div className="absolute right-0 top-1/2 h-px w-4 translate-x-full -translate-y-1/2 bg-zinc-500" />
        {isLeft ? <WorkflowStepCard step={step} /> : null}
      </div>

      <div className="relative flex items-center justify-center">
        <div className="relative z-10 flex h-4 w-4 items-center justify-center rounded-full border border-zinc-600 bg-zinc-950">
          <div className="h-1.5 w-1.5 rounded-full bg-zinc-200" />
        </div>
      </div>

      <div
        className={`relative ${
          isLeft ? "opacity-0" : "justify-self-start pl-4"
        }`}
      >
        <div className="absolute left-0 top-1/2 h-px w-4 -translate-x-full -translate-y-1/2 bg-zinc-500" />
        {!isLeft ? <WorkflowStepCard step={step} /> : null}
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
    <div className="relative h-full">
      <div
        className={`absolute left-1/2 top-1/2 z-20 flex h-4 w-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-500 bg-zinc-950`}
      >
        <div className="h-1.5 w-1.5 rounded-full bg-zinc-200" />
      </div>

      <div
        className={`absolute left-1/2 top-1/2 h-8 w-px -translate-x-1/2 ${
          isTop ? "-translate-y-full" : ""
        } bg-zinc-500`}
      />

      <div
        className={`absolute left-0 right-0 ${
          isTop ? "bottom-[calc(50%+2rem)]" : "top-[calc(50%+2rem)]"
        }`}
      >
        <div className="mx-auto max-w-[18rem]">
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
      className={`relative flex h-full w-full items-center overflow-hidden bg-zinc-950 text-white ${className}`.trim()}
      aria-label="İş Akış Süreci"
      style={{ fontFamily: "var(--font-smooch)" }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.05),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.03),transparent_24%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.028)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.028)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
      </div>

      <div className="relative mx-auto flex h-full w-full max-w-[90rem] flex-col px-4 py-[8px] md:px-7 md:py-4 lg:px-9 lg:py-6">
        <Card className="relative flex h-full flex-col overflow-hidden rounded-[1.6rem] border border-zinc-800 bg-zinc-900/80 shadow-[0_24px_70px_rgba(0,0,0,0.5)]">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent_42%)]" />

          <CardHeader className="relative flex-none p-4 pb-3 md:p-5 md:pb-4">
            <div className="max-w-4xl">
              <CardTitle className="mt-2.5 font-[family-name:var(--font-smooch)] text-[clamp(1.7rem,3.6vw,3rem)] font-normal leading-[0.92] tracking-[0.1em] text-white">
                İŞ AKIŞI
              </CardTitle>
            </div>

            <Separator className="mt-3 bg-zinc-700" />
          </CardHeader>

          <CardContent className="relative mt-24 flex flex-1 flex-col px-4 pb-4 pt-2 md:mt-24 md:px-5 md:pb-5 md:pt-3 lg:mt-24">
            <div className="lg:hidden">
              <div className="relative mx-auto max-w-6xl px-0 sm:px-2">
                <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-zinc-600" />
                <div className="space-y-5">
                  {WORKFLOW_STEPS.map((step, index) => (
                    <WorkflowMobileStep
                      key={step.id}
                      step={step}
                      align={index % 2 === 0 ? "left" : "right"}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block lg:h-[30rem]">
              <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-zinc-500/80" />

              <div className="grid h-full grid-cols-5 gap-6">
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
