"use client";

import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  Compass,
  Hammer,
  Layers,
  PenTool,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";

type WorkflowStep = {
  id: string;
  title: string;
  description: string;
  note: string;
  icon: LucideIcon;
};

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: "01",
    title: "Randevu",
    description: "Temas, zamanlama ve beklenti tek eksende toplanır.",
    note: "İlk temas ve zamanlama tek bir akışta sadeleştirilir.",
    icon: CalendarDays,
  },
  {
    id: "02",
    title: "Keşif",
    description: "Alan, ihtiyaç ve teknik sınırlar sakin bir analizle netleştirilir.",
    note: "Bu adımda bakış açıları sadeleşir, yön kaybolmadan okunur.",
    icon: Compass,
  },
  {
    id: "03",
    title: "Tasarım",
    description: "Kavramsal fikir, tipografik disiplin ve mekansal kurgu aynı hatta birleşir.",
    note: "Kavramsal kurgu, ölçü ve oran üzerinden netleşir.",
    icon: PenTool,
  },
  {
    id: "04",
    title: "Malzeme",
    description: "Doku, yüzey ve detaylar teknik bir seçkiyle rafine edilir.",
    note: "Malzeme seçimi, yüzey ve doku üzerinden okunur.",
    icon: Layers,
  },
  {
    id: "05",
    title: "Uygulama",
    description: "Sahadaki üretim, kontrol ve teslim ritmi ölçülü biçimde hayata geçirilir.",
    note: "Saha süreci, tasarım kararlarını koruyarak ilerler.",
    icon: Hammer,
  },
];

function WorkflowStepCard({ step }: { step: WorkflowStep }) {
  const Icon = step.icon;

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Card className="group relative h-full overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-[0_14px_40px_rgba(0,0,0,0.08)] transition-all duration-500 ease-out hover:-translate-y-1 hover:border-zinc-300 hover:shadow-[0_18px_48px_rgba(0,0,0,0.12)]">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,255,255,1))]" />

          <CardHeader className="relative flex h-full flex-col gap-3 p-4 md:p-5">
            <div className="flex items-start justify-between gap-4">
              <Badge
                variant="outline"
                className="border-zinc-300 bg-zinc-100 text-[0.64rem] font-medium tracking-[0.28em] text-zinc-700"
              >
                {step.id}
              </Badge>
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-300 bg-white text-zinc-800 transition-all duration-500 group-hover:border-zinc-400 group-hover:bg-zinc-50">
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <CardTitle className="font-[family-name:var(--font-smooch)] text-[1.2rem] font-normal leading-[0.92] tracking-[0.08em] text-zinc-950 md:text-[1.35rem]">
              {step.title}
            </CardTitle>

            <Separator className="bg-gradient-to-r from-transparent via-zinc-300 to-transparent" />

            <CardDescription className="max-w-[18rem] font-[family-name:var(--font-smooch)] text-[0.88rem] font-light leading-[1.55] tracking-[0.04em] text-zinc-700">
              {step.description}
            </CardDescription>
          </CardHeader>
        </Card>
      </HoverCardTrigger>

      <HoverCardContent className="border border-zinc-200 bg-white text-zinc-800 shadow-[0_20px_50px_rgba(0,0,0,0.12)]">
        <p className="font-[family-name:var(--font-smooch)] text-[0.84rem] font-light leading-6 tracking-[0.04em]">
          {step.note}
        </p>
      </HoverCardContent>
    </HoverCard>
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
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
      </div>

      <div className="relative mx-auto flex h-full w-full max-w-[90rem] flex-col px-4 py-[8px] md:px-7 md:py-4 lg:px-9 lg:py-6">
        <Card className="relative flex h-full flex-col overflow-hidden rounded-[1.6rem] border border-zinc-800 bg-zinc-900/78 shadow-[0_24px_70px_rgba(0,0,0,0.5)]">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent_42%)]" />

          <CardHeader className="relative flex-none p-4 pb-3 md:p-5 md:pb-4">
            <div className="flex items-start justify-between gap-4">
              <div className="max-w-4xl">
                <Badge
                  variant="outline"
                  className="border-zinc-700 bg-zinc-800/60 text-[0.64rem] font-medium tracking-[0.28em] text-zinc-300"
                >
                  İŞ AKIŞI
                </Badge>
                <CardTitle className="mt-2.5 font-[family-name:var(--font-smooch)] text-[clamp(1.7rem,3.6vw,3rem)] font-normal leading-[0.92] tracking-[0.1em] text-white">
                  DEQOIN İŞ AKIŞI
                </CardTitle>
                <CardDescription className="mt-2.5 max-w-3xl font-[family-name:var(--font-smooch)] text-[0.88rem] font-light leading-[1.6] tracking-[0.04em] text-zinc-300">
                  Orijinal 5 adımlı yapıyı koruyan, net bir dikey akış ve sade bir tasarım ile kurgulanan iş akış sistemi.
                </CardDescription>
              </div>
            </div>

            <Separator className="mt-3 bg-gradient-to-r from-transparent via-zinc-600 to-transparent" />
          </CardHeader>

          <CardContent className="relative flex flex-1 flex-col px-4 pb-4 pt-2 md:px-5 md:pb-5 md:pt-3">
            <div className="lg:hidden">
              <div className="relative">
                <div className="absolute left-[1.05rem] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-zinc-500 to-transparent" />
                <div className="grid gap-3">
                  {WORKFLOW_STEPS.map((step) => (
                    <div
                      key={step.id}
                      className="grid grid-cols-[2.2rem_minmax(0,1fr)] gap-3"
                    >
                      <div className="relative flex justify-center">
                        <div className="relative z-10 mt-5 flex h-5 w-5 items-center justify-center rounded-full border border-zinc-500 bg-zinc-950">
                          <div className="h-1.5 w-1.5 rounded-full bg-zinc-200" />
                        </div>
                      </div>

                      <WorkflowStepCard step={step} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block lg:h-[24rem]">
              <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-zinc-500 to-transparent" />

              <div className="grid h-full grid-cols-5 gap-4">
                {WORKFLOW_STEPS.map((step, index) => {
                  const isOdd = index % 2 === 0;

                  return (
                    <div key={step.id} className="relative h-full">
                      <div className="absolute left-1/2 top-1/2 z-20 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-500 bg-zinc-950">
                        <div className="h-1.5 w-1.5 rounded-full bg-zinc-200" />
                      </div>

                      <div
                        className={`absolute left-0 right-0 ${isOdd ? "top-0" : "bottom-0"}`}
                      >
                        <div className={`${isOdd ? "pb-12" : "pt-12"}`}>
                          <WorkflowStepCard step={step} />
                        </div>
                      </div>
                    </div>
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
