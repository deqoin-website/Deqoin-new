"use client";

import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, Compass, Sparkles, Target } from "lucide-react";

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
    title: "Brief Alignment",
    description: "Kapsam, ritim ve estetik yön tek satırda sabitlenir.",
    note: "Materyal Studio altındaki sakin kurgu burada daha okunaklı bir iş akışına dönüştürülür.",
    icon: Target,
  },
  {
    id: "02",
    title: "Flow Mapping",
    description: "Bilgi hiyerarşisi, dolaşım ve geçiş mantığı net bir sistem kurar.",
    note: "İnce ayarlı çizgiler ve boşluklar, referanstaki dengeli kompozisyonu korur.",
    icon: Compass,
  },
  {
    id: "03",
    title: "Detail Refinement",
    description: "Tipografi, boşluk ve gold vurgu aynı düzen içinde rafine edilir.",
    note: "Son dokunuş, section'ı gösterişli değil; ölçülü ve premium hale getirir.",
    icon: Sparkles,
  },
];

function WorkflowStepCard({ step }: { step: WorkflowStep }) {
  const Icon = step.icon;

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Card className="group h-full !overflow-hidden !rounded-[1.6rem] !border-black/10 !bg-white/88 !shadow-[0_20px_50px_rgba(34,24,14,0.06)] !backdrop-blur-none transition-all duration-500 ease-out hover:-translate-y-1 hover:!border-amber-400/35 hover:!shadow-[0_26px_60px_rgba(34,24,14,0.1)]">
          <CardHeader className="flex h-full flex-col gap-5 p-6 md:p-7">
            <div className="flex items-center justify-between gap-4">
              <Badge
                variant="outline"
                className="!border-amber-400/30 !bg-white !text-[0.68rem] !font-medium !tracking-[0.26em] !text-amber-700"
              >
                {step.id}
              </Badge>
              <Icon className="h-5 w-5 text-amber-600 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-amber-500" />
            </div>

            <CardTitle className="font-[family-name:var(--font-smooch)] text-[1.55rem] font-light leading-[0.95] tracking-[0.12em] text-zinc-950 md:text-[1.75rem]">
              {step.title}
            </CardTitle>

            <Separator className="bg-gradient-to-r from-transparent via-black/10 to-transparent" />

            <CardDescription className="max-w-[23rem] font-[family-name:var(--font-smooch)] text-[1.05rem] font-light leading-8 tracking-[0.04em] text-zinc-600">
              {step.description}
            </CardDescription>

            <div className="mt-auto flex items-center justify-between pt-2">
              <span className="font-[family-name:var(--font-smooch)] text-[0.68rem] uppercase tracking-[0.28em] text-zinc-400">
                View detail
              </span>
              <ArrowUpRight className="h-4 w-4 text-amber-600 transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
          </CardHeader>
        </Card>
      </HoverCardTrigger>

      <HoverCardContent className="border-amber-400/20 bg-zinc-950/98 text-zinc-200">
        <p className="font-[family-name:var(--font-smooch)] text-[0.95rem] font-light leading-7 tracking-[0.04em]">
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
      className={`relative flex h-full w-full items-center overflow-hidden bg-[#f4ede4] text-zinc-950 ${className}`.trim()}
      aria-label="İş Akış Süreci"
      style={{ fontFamily: "var(--font-smooch)" }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(198,159,95,0.18),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(17,17,17,0.06),transparent_22%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(17,17,17,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(17,17,17,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-35" />
      </div>

      <div className="relative mx-auto flex h-full w-full max-w-[96rem] flex-col px-4 py-4 md:px-8 md:py-6 lg:px-10 lg:py-10">
        <Card className="relative flex h-full flex-col overflow-hidden !rounded-[2rem] !border-white/70 !bg-[#fbf8f2] !shadow-[0_24px_70px_rgba(34,24,14,0.08)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(198,159,95,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(17,17,17,0.04),transparent_30%)]" />
          <CardHeader className="relative flex-none p-6 pb-4 md:p-8 md:pb-5">
            <div className="flex items-start justify-between gap-4">
              <div className="max-w-4xl">
                <Badge
                  variant="outline"
                  className="!border-amber-400/30 !bg-white !text-[0.66rem] !font-medium !tracking-[0.28em] !text-amber-700"
                >
                  İş Akış Süreci
                </Badge>
                <CardTitle className="mt-4 font-[family-name:var(--font-smooch)] text-[clamp(2.4rem,5vw,4.8rem)] font-light leading-[0.88] tracking-[0.14em] text-zinc-950">
                  Fikirden teslimata uzanan akış
                </CardTitle>
                <CardDescription className="mt-4 max-w-3xl font-[family-name:var(--font-smooch)] text-[1rem] font-light leading-8 tracking-[0.04em] text-zinc-600">
                  Materyal Studio’daki ölçülü ritmi koruyup, görseli kaldırarak
                  workflow’u tüm genişliğe yayan daha okunaklı bir kurgu.
                </CardDescription>
              </div>

              <span className="hidden font-[family-name:var(--font-smooch)] text-xs uppercase tracking-[0.34em] text-zinc-400 md:block">
                Workflow
              </span>
            </div>

            <Separator className="mt-5 bg-gradient-to-r from-transparent via-black/10 to-transparent" />

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { label: "LAYOUT", value: "Full width" },
                { label: "TIMELINE", value: "Connected" },
                { label: "ACCENT", value: "Gold detail" },
              ].map((item) => (
                <div key={item.label} className="rounded-[1.15rem] border border-black/10 bg-white px-4 py-4">
                  <p className="text-[0.62rem] uppercase tracking-[0.3em] text-zinc-500">
                    {item.label}
                  </p>
                  <p className="mt-2 font-[family-name:var(--font-smooch)] text-[1.05rem] font-light tracking-[0.1em] text-zinc-950">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </CardHeader>

          <CardContent className="relative flex flex-1 flex-col px-6 pb-6 pt-4 md:px-8 md:pb-8 md:pt-5">
            <div className="relative mb-5 hidden h-px w-full bg-gradient-to-r from-transparent via-amber-400/35 to-transparent md:block">
              <div className="absolute left-[16.66%] top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-500/40 bg-[#fbf8f2]" />
              <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-500/40 bg-[#fbf8f2]" />
              <div className="absolute left-[83.33%] top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-500/40 bg-[#fbf8f2]" />
            </div>

            <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
              {WORKFLOW_STEPS.map((step, index) => (
                <div
                  key={step.id}
                  className={`relative ${index < WORKFLOW_STEPS.length - 1 ? "md:border-r md:border-r-black/10" : ""} border-b border-black/10 md:border-b-0 md:px-2 md:py-0`}
                >
                  <WorkflowStepCard step={step} />
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between gap-4 border-t border-black/10 pt-5">
              <span className="font-[family-name:var(--font-smooch)] text-[0.68rem] uppercase tracking-[0.3em] text-zinc-500">
                Quiet luxury workflow
              </span>
              <ArrowUpRight className="h-4 w-4 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
