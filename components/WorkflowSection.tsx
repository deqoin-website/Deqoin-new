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

const ROW_OFFSET_STYLES = [
  "lg:pt-0",
  "lg:pt-8",
  "lg:pt-4",
  "lg:pt-10",
  "lg:pt-6",
];

function WorkflowStepCard({ step }: { step: WorkflowStep }) {
  const Icon = step.icon;

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Card className="group relative h-full overflow-hidden rounded-[1.5rem] border border-zinc-800/90 bg-zinc-900/80 shadow-[0_18px_50px_rgba(0,0,0,0.42)] backdrop-blur-md transition-all duration-500 ease-out hover:-translate-y-1 hover:border-amber-500/35 hover:shadow-[0_26px_72px_rgba(0,0,0,0.58)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(217,164,89,0.12),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.025),transparent_42%)]" />
          <CardHeader className="relative flex h-full flex-col gap-3 p-4 md:p-5">
            <div className="flex items-start justify-between gap-4">
              <Badge
                variant="outline"
                className="border-amber-500/25 bg-amber-500/8 text-[0.64rem] font-medium tracking-[0.28em] text-amber-300"
              >
                {step.id}
              </Badge>

              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950/90 text-amber-400 transition-all duration-500 group-hover:border-amber-500/40 group-hover:text-amber-300">
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <CardTitle className="font-[family-name:var(--font-smooch)] text-[1.2rem] font-light leading-[0.92] tracking-[0.1em] text-white md:text-[1.35rem]">
              {step.title}
            </CardTitle>

            <Separator className="bg-gradient-to-r from-transparent via-amber-500/25 to-transparent" />

            <CardDescription className="max-w-[18rem] font-[family-name:var(--font-smooch)] text-[0.88rem] font-light leading-[1.55] tracking-[0.04em] text-zinc-300">
              {step.description}
            </CardDescription>

            <div className="mt-auto flex items-center justify-between pt-2">
              <span className="font-[family-name:var(--font-smooch)] text-[0.66rem] uppercase tracking-[0.3em] text-zinc-500">
                Premium flow
              </span>
              <ArrowUpRight className="h-4 w-4 text-amber-400 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
          </CardHeader>
        </Card>
      </HoverCardTrigger>

      <HoverCardContent className="border border-amber-500/15 bg-zinc-950/98 text-zinc-200">
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
      className={`relative flex h-full w-full items-center overflow-hidden bg-black text-white ${className}`.trim()}
      aria-label="İş Akış Süreci"
      style={{ fontFamily: "var(--font-smooch)" }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(217,164,89,0.13),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.07),transparent_24%)]" />
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
                  Deep premium workflow, beş adımlı yapı
                </CardTitle>
                <CardDescription className="mt-2.5 max-w-3xl font-[family-name:var(--font-smooch)] text-[0.88rem] font-light leading-[1.6] tracking-[0.04em] text-zinc-300">
                  Orijinal beş adımı koruyan, Safari benzeri derinlik hissi taşıyan
                  ve kart şablonu gibi görünmeyen dikey timeline kurgusu.
                </CardDescription>
              </div>

              <span className="hidden font-[family-name:var(--font-smooch)] text-xs uppercase tracking-[0.34em] text-zinc-500 md:block">
                Timeline
              </span>
            </div>

            <Separator className="mt-3 bg-gradient-to-r from-transparent via-amber-500/25 to-transparent" />
          </CardHeader>

          <CardContent className="relative flex flex-1 flex-col px-4 pb-4 pt-2 md:px-5 md:pb-5 md:pt-3">
            <div className="relative flex-1">
              <div className="absolute left-[1.1rem] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-amber-500/45 to-transparent lg:left-1/2 lg:-translate-x-1/2" />

              <div className="relative grid gap-3 lg:gap-4">
                {WORKFLOW_STEPS.map((step, index) => {
                  const isLeft = index % 2 === 0;
                  const offsetStyle = ROW_OFFSET_STYLES[index] ?? "";

                  return (
                    <div
                      key={step.id}
                      className={`grid grid-cols-[2.25rem_minmax(0,1fr)] gap-3 lg:grid-cols-[minmax(0,1fr)_5.5rem_minmax(0,1fr)] lg:gap-5 ${offsetStyle}`}
                    >
                      <div className="relative flex items-start justify-center lg:col-start-2">
                        <div className="relative z-10 mt-6 flex h-5 w-5 items-center justify-center rounded-full border border-amber-500/45 bg-zinc-950 shadow-[0_0_18px_rgba(217,164,89,0.22)]">
                          <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                        </div>
                      </div>

                      <div
                        className={`relative ${isLeft ? "lg:col-start-1 lg:justify-self-end" : "lg:col-start-3 lg:justify-self-start"} lg:col-span-1`}
                      >
                        <div className={`max-w-[33rem] ${isLeft ? "lg:pr-6" : "lg:pl-6"}`}>
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
