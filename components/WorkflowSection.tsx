"use client";

import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight,
  CalendarDays,
  Compass,
  HardHat,
  Layers3,
  PencilRuler,
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
    description: "Lüks bir başlangıç için temas, zamanlama ve beklenti tek eksende toplanır.",
    note: "Başlangıç anı temizdir; ilk iletişim gereksiz katmanlardan arındırılır.",
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
    note: "Form, boşluk ve altın vurgu birlikte çalışır; dil premium kalır.",
    icon: PencilRuler,
  },
  {
    id: "04",
    title: "Malzeme",
    description: "Doku, yüzey ve detaylar teknik bir seçkiyle rafine edilir.",
    note: "Materyal dili, sessiz ama güçlü bir karakter üretir.",
    icon: Layers3,
  },
  {
    id: "05",
    title: "Uygulama",
    description: "Sahadaki üretim, kontrol ve teslim ritmi ölçülü biçimde hayata geçirilir.",
    note: "Sonuç, tasarım niyetini sahada bozmadan tamamlar.",
    icon: HardHat,
  },
];

function WorkflowStepCard({ step }: { step: WorkflowStep }) {
  const Icon = step.icon;

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Card className="group relative h-full overflow-hidden rounded-[1.5rem] border border-zinc-200/80 bg-white/95 shadow-[0_20px_50px_rgba(0,0,0,0.12)] backdrop-blur-sm transition-all duration-500 ease-out hover:-translate-y-1 hover:border-amber-500/35 hover:shadow-[0_28px_70px_rgba(0,0,0,0.16)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(217,164,89,0.08),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,255,255,0.98))]" />

          <CardHeader className="relative flex h-full flex-col gap-3 p-4 md:p-5">
            <div className="flex items-start justify-between gap-4">
              <Badge
                variant="outline"
                className="border-amber-500/20 bg-amber-50 text-[0.64rem] font-medium tracking-[0.28em] text-amber-700"
              >
                {step.id}
              </Badge>
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-amber-200 bg-amber-50 text-amber-600 transition-all duration-500 group-hover:border-amber-300 group-hover:bg-amber-100 group-hover:text-amber-700">
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <CardTitle className="font-[family-name:var(--font-smooch)] text-[1.2rem] font-light leading-[0.92] tracking-[0.1em] text-zinc-950 md:text-[1.35rem]">
              {step.title}
            </CardTitle>

            <Separator className="bg-gradient-to-r from-transparent via-amber-500/25 to-transparent" />

            <CardDescription className="max-w-[18rem] font-[family-name:var(--font-smooch)] text-[0.88rem] font-light leading-[1.55] tracking-[0.04em] text-zinc-700">
              {step.description}
            </CardDescription>

            <div className="mt-auto flex items-center justify-end pt-2">
              <ArrowUpRight className="h-4 w-4 text-amber-500 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
          </CardHeader>
        </Card>
      </HoverCardTrigger>

      <HoverCardContent className="border border-amber-200 bg-white text-zinc-800 shadow-[0_20px_50px_rgba(0,0,0,0.14)]">
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(217,164,89,0.12),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.05),transparent_24%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-18" />
      </div>

      <div className="relative mx-auto flex h-full w-full max-w-[90rem] flex-col px-4 py-[8px] md:px-7 md:py-4 lg:px-9 lg:py-6">
        <Card className="relative flex h-full flex-col overflow-hidden rounded-[1.6rem] border border-zinc-800 bg-zinc-900/78 shadow-[0_24px_70px_rgba(0,0,0,0.5)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(217,164,89,0.1),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.05),transparent_28%)]" />

          <CardHeader className="relative flex-none p-4 pb-3 md:p-5 md:pb-4">
            <div className="flex items-start justify-between gap-4">
              <div className="max-w-4xl">
                <Badge
                  variant="outline"
                  className="border-amber-500/25 bg-amber-500/8 text-[0.64rem] font-medium tracking-[0.28em] text-amber-300"
                >
                  İş Akış Süreci
                </Badge>
                <CardTitle className="mt-2.5 font-[family-name:var(--font-smooch)] text-[clamp(1.7rem,3.6vw,3rem)] font-light leading-[0.92] tracking-[0.12em] text-white">
                  Dark timeline, yatay desktop akışı
                </CardTitle>
                <CardDescription className="mt-2.5 max-w-3xl font-[family-name:var(--font-smooch)] text-[0.88rem] font-light leading-[1.6] tracking-[0.04em] text-zinc-300">
                  Beş adımlı yapıyı koruyan, desktop ve webde yatay timeline;
                  mobilde dikey akış sunan, beyaz kartlı ve gold aksanlı bir kurgu.
                </CardDescription>
              </div>
            </div>

            <Separator className="mt-3 bg-gradient-to-r from-transparent via-amber-500/25 to-transparent" />
          </CardHeader>

          <CardContent className="relative flex flex-1 flex-col px-4 pb-4 pt-2 md:px-5 md:pb-5 md:pt-3">
            <div className="lg:hidden">
              <div className="relative">
                <div className="absolute left-[1.05rem] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-amber-500/45 to-transparent" />
                <div className="grid gap-3">
                  {WORKFLOW_STEPS.map((step) => (
                    <div
                      key={step.id}
                      className="grid grid-cols-[2.2rem_minmax(0,1fr)] gap-3"
                    >
                      <div className="relative flex justify-center">
                        <div className="relative z-10 mt-5 flex h-5 w-5 items-center justify-center rounded-full border border-amber-500/45 bg-zinc-950 shadow-[0_0_18px_rgba(217,164,89,0.22)]">
                          <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                        </div>
                      </div>

                      <WorkflowStepCard step={step} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block lg:h-[24rem]">
              <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-amber-500/45 to-transparent" />

              <div className="grid h-full grid-cols-5 gap-4">
                {WORKFLOW_STEPS.map((step, index) => {
                  const isOdd = index % 2 === 0;

                  return (
                    <div key={step.id} className="relative h-full">
                      <div className="absolute left-1/2 top-1/2 z-20 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-amber-500/45 bg-zinc-950 shadow-[0_0_18px_rgba(217,164,89,0.22)]">
                        <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
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
