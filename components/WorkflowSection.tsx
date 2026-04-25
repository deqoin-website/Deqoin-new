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
        <Card className="group relative h-full overflow-hidden rounded-[1.2rem] border border-zinc-800 bg-zinc-900/95 shadow-[0_18px_50px_rgba(0,0,0,0.35)] transition-all duration-500 ease-out hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-[0_22px_60px_rgba(0,0,0,0.5)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(217,164,89,0.1),transparent_45%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_45%)] opacity-90" />
          <CardHeader className="relative flex h-full flex-col gap-3 p-4 md:p-[18px]">
            <div className="flex items-center justify-between gap-3">
              <Badge
                variant="outline"
                className="border-amber-500/25 bg-amber-500/8 text-[0.64rem] font-medium tracking-[0.26em] text-amber-300"
              >
                {step.id}
              </Badge>
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950/90 text-amber-400 transition-all duration-500 group-hover:border-amber-500/35 group-hover:text-amber-300">
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <CardTitle className="font-[family-name:var(--font-smooch)] text-[1.22rem] font-light leading-[0.92] tracking-[0.12em] text-white md:text-[1.35rem]">
              {step.title}
            </CardTitle>

            <Separator className="bg-gradient-to-r from-transparent via-amber-500/25 to-transparent" />

            <CardDescription className="max-w-[16rem] font-[family-name:var(--font-smooch)] text-[0.88rem] font-light leading-[1.55] tracking-[0.04em] text-zinc-300">
              {step.description}
            </CardDescription>

            <div className="mt-auto flex items-center justify-between pt-2">
              <span className="font-[family-name:var(--font-smooch)] text-[0.66rem] uppercase tracking-[0.3em] text-zinc-500">
                Quiet luxury
              </span>
              <ArrowUpRight className="h-4 w-4 text-amber-400 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
          </CardHeader>
        </Card>
      </HoverCardTrigger>

      <HoverCardContent className="border border-amber-500/15 bg-zinc-950/98 text-zinc-200">
        <p className="font-[family-name:var(--font-smooch)] text-[0.86rem] font-light leading-6 tracking-[0.04em]">
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(217,164,89,0.11),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.06),transparent_24%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
      </div>

      <div className="relative mx-auto flex h-full w-full max-w-[90rem] flex-col px-4 py-[8px] md:px-7 md:py-4 lg:px-9 lg:py-6">
        <Card className="relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-zinc-800 bg-zinc-900/80 shadow-[0_24px_70px_rgba(0,0,0,0.45)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(217,164,89,0.09),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.04),transparent_28%)]" />

          <CardHeader className="relative flex-none p-4 pb-3 md:p-5 md:pb-4">
            <div className="flex items-start justify-between gap-4">
              <div className="max-w-4xl">
                <Badge
                  variant="outline"
                  className="border-amber-500/25 bg-amber-500/8 text-[0.64rem] font-medium tracking-[0.28em] text-amber-300"
                >
                  İş Akış Süreci
                </Badge>
                <CardTitle className="mt-2.5 font-[family-name:var(--font-smooch)] text-[clamp(1.7rem,3.6vw,3rem)] font-light leading-[0.92] tracking-[0.14em] text-white">
                  Premium dark mode, beş adımlı akış
                </CardTitle>
                <CardDescription className="mt-2.5 max-w-3xl font-[family-name:var(--font-smooch)] text-[0.88rem] font-light leading-[1.6] tracking-[0.04em] text-zinc-300">
                  Orijinal 5 adımlı yapıyı koruyan, kompakt oranlı ve yatay timeline
                  diline sahip sessiz lüks bir workflow sistemi.
                </CardDescription>
              </div>

              <span className="hidden font-[family-name:var(--font-smooch)] text-xs uppercase tracking-[0.34em] text-zinc-500 md:block">
                Timeline
              </span>
            </div>

            <Separator className="mt-3 bg-gradient-to-r from-transparent via-amber-500/25 to-transparent" />

            <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
              {[
                { label: "STYLE", value: "Dark mode" },
                { label: "FLOW", value: "5 steps" },
                { label: "GLOW", value: "Amber detail" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[0.9rem] border border-zinc-800 bg-zinc-950/70 px-3.5 py-2.5"
                >
                  <p className="text-[0.61rem] uppercase tracking-[0.3em] text-zinc-500">
                    {item.label}
                  </p>
                  <p className="mt-1 font-[family-name:var(--font-smooch)] text-[0.88rem] font-light tracking-[0.1em] text-zinc-100">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </CardHeader>

          <CardContent className="relative flex flex-1 flex-col px-4 pb-4 pt-2 md:px-5 md:pb-5 md:pt-3">
            <div className="relative mb-3 hidden h-px w-full bg-gradient-to-r from-transparent via-amber-500/35 to-transparent lg:block">
              <div className="absolute left-[10%] top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-500/45 bg-zinc-900" />
              <div className="absolute left-[30%] top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-500/45 bg-zinc-900" />
              <div className="absolute left-[50%] top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-500/45 bg-zinc-900" />
              <div className="absolute left-[70%] top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-500/45 bg-zinc-900" />
              <div className="absolute left-[90%] top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-500/45 bg-zinc-900" />
            </div>

            <div className="flex flex-1 gap-3 overflow-x-auto pb-1 lg:grid lg:grid-cols-5 lg:gap-3 lg:overflow-visible">
              {WORKFLOW_STEPS.map((step, index) => (
                <div
                  key={step.id}
                  className={`min-w-[16rem] flex-1 lg:min-w-0 ${index < WORKFLOW_STEPS.length - 1 ? "lg:border-r lg:border-r-zinc-800" : ""} pr-0 lg:pr-3`}
                >
                  <WorkflowStepCard step={step} />
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between gap-4 border-t border-zinc-800 pt-3">
              <span className="font-[family-name:var(--font-smooch)] text-[0.66rem] uppercase tracking-[0.32em] text-zinc-500">
                Quiet luxury workflow
              </span>
              <ArrowUpRight className="h-4 w-4 text-amber-400" />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
