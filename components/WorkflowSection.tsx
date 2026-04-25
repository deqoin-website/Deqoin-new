"use client";

import Image from "next/image";
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
        <Card className="group h-full !overflow-hidden !rounded-[1.35rem] !border-black/10 !bg-white/85 !shadow-[0_20px_50px_rgba(34,24,14,0.06)] !backdrop-blur-none transition-all duration-500 ease-out hover:-translate-y-1 hover:!border-amber-400/35 hover:!shadow-[0_26px_60px_rgba(34,24,14,0.1)]">
          <CardHeader className="flex h-full flex-col gap-4 p-6 md:p-6">
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

            <CardDescription className="max-w-[22rem] font-[family-name:var(--font-smooch)] text-[1rem] font-light leading-8 tracking-[0.04em] text-zinc-600">
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

      <div className="relative mx-auto grid h-full w-full max-w-7xl grid-cols-1 gap-4 px-4 py-4 md:px-8 md:py-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-5 lg:px-10 lg:py-10">
        <Card className="relative min-h-[18rem] overflow-hidden !rounded-[2rem] !border-white/60 !bg-[#e7dccf] !shadow-[0_24px_60px_rgba(34,24,14,0.08)] lg:min-h-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.24),transparent_40%),linear-gradient(180deg,rgba(255,255,255,0.1),rgba(0,0,0,0.08))]" />
          <Image
            src="/images/about_interior.png"
            alt="Workflow reference interior"
            fill
            priority
            className="object-cover object-center mix-blend-multiply opacity-85"
          />
          <div className="absolute inset-0 border border-white/40" />

          <CardContent className="relative flex h-full flex-col justify-between p-6 md:p-8">
            <div className="flex items-start justify-between gap-4">
              <Badge className="border-amber-400/25 bg-amber-400/12 text-amber-900">
                İş Akış Süreci
              </Badge>
              <span className="font-[family-name:var(--font-smooch)] text-xs uppercase tracking-[0.32em] text-zinc-700/70">
                Material inspired
              </span>
            </div>

            <div className="max-w-xl">
              <h2 className="mt-8 font-[family-name:var(--font-smooch)] text-[clamp(2.5rem,5.4vw,4.8rem)] font-light leading-[0.88] tracking-[0.15em] text-zinc-950">
                Sessiz ama net bir akış.
              </h2>
              <p className="mt-5 max-w-lg font-[family-name:var(--font-smooch)] text-[1rem] font-light leading-8 tracking-[0.04em] text-zinc-700">
                Materyal Studio altındaki split layout hissini koruyan, ancak home
                sayfada daha kontrollü ve kurumsal duran bir workflow kurgusu.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 border-t border-white/45 pt-5">
              {[
                { label: "LAYOUT", value: "100vh" },
                { label: "UI KIT", value: "shadcn" },
                { label: "ACCENT", value: "Gold" },
              ].map((item) => (
                <div key={item.label} className="rounded-[1.15rem] border border-white/35 bg-white/45 px-4 py-4 backdrop-blur-sm">
                  <p className="text-[0.62rem] uppercase tracking-[0.3em] text-zinc-500">
                    {item.label}
                  </p>
                  <p className="mt-2 font-[family-name:var(--font-smooch)] text-[1.05rem] font-light tracking-[0.1em] text-zinc-950">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden !rounded-[2rem] !border-white/70 !bg-[#fbf8f2] !shadow-[0_24px_70px_rgba(34,24,14,0.08)]">
          <div className="absolute inset-x-8 top-28 hidden h-px bg-gradient-to-r from-transparent via-amber-400/35 to-transparent md:block" />
          <div className="absolute left-[calc(33.333%-0.35rem)] top-[6.95rem] hidden h-3.5 w-3.5 rounded-full border border-amber-500/40 bg-[#fbf8f2] md:block" />
          <div className="absolute left-[calc(66.666%-0.35rem)] top-[6.95rem] hidden h-3.5 w-3.5 rounded-full border border-amber-500/40 bg-[#fbf8f2] md:block" />

          <CardHeader className="relative p-6 md:p-8">
            <div className="flex flex-col gap-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Badge
                    variant="outline"
                    className="!border-black/10 !bg-white !text-[0.66rem] !font-medium !tracking-[0.28em] !text-zinc-500"
                  >
                    Timeline
                  </Badge>
                  <CardTitle className="mt-4 max-w-3xl font-[family-name:var(--font-smooch)] text-[clamp(2rem,4vw,3.8rem)] font-light leading-[0.9] tracking-[0.14em] text-zinc-950">
                    Fikirden teslimata uzanan akış
                  </CardTitle>
                  <CardDescription className="mt-4 max-w-2xl font-[family-name:var(--font-smooch)] text-[1rem] font-light leading-8 tracking-[0.04em] text-zinc-600">
                    Referanstaki ölçülü düzeni alıp, home workflow için daha açık bir
                    anlatı ve daha net bir adım yapısına dönüştürüyorum.
                  </CardDescription>
                </div>

                <span className="hidden font-[family-name:var(--font-smooch)] text-xs uppercase tracking-[0.34em] text-zinc-400 md:block">
                  Workflow
                </span>
              </div>

              <Separator className="bg-gradient-to-r from-transparent via-black/10 to-transparent" />
            </div>
          </CardHeader>

          <CardContent className="relative flex flex-1 flex-col p-6 pt-0 md:p-8 md:pt-0">
            <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-3 md:gap-0">
              {WORKFLOW_STEPS.map((step, index) => (
                <div
                  key={step.id}
                  className={`relative ${index < WORKFLOW_STEPS.length - 1 ? "md:border-r md:border-r-black/10" : ""} border-b border-black/10 md:border-b-0 md:px-5 md:py-2 md:first:pl-0 md:last:pr-0`}
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
