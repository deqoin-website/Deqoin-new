"use client";

import type { ComponentType } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";
import { ArrowUpRight, Compass, Layers3, Sparkles, SquareStack, Target } from "lucide-react";

type WorkflowStep = {
  id: string;
  title: string;
  description: string;
  note: string;
  icon: ComponentType<{ className?: string }>;
};

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: "01",
    title: "Brief Alignment",
    description: "Kapsam, öncelik ve estetik yön tek cümlede sabitlenir.",
    note: "İlk temas noktası burada netleşir; gereksiz dallanmalar daha başlamadan elenir.",
    icon: Target,
  },
  {
    id: "02",
    title: "Flow Mapping",
    description: "Kullanıcı akışı, bilgi hiyerarşisi ve geçiş mantığı tasarlanır.",
    note: "İnce çizgilerle bağlanan zaman çizelgesi, bölümün ritmini görsel olarak taşır.",
    icon: Compass,
  },
  {
    id: "03",
    title: "Visual Refinement",
    description: "Tipografi, boşluk, ikon ve altın vurgular tek bir premium sistemde birleşir.",
    note: "Smooch Sans hiyerarşisi ve düşük kontrastlı yüzeyler lüks hissi güçlendirir.",
    icon: Sparkles,
  },
  {
    id: "04",
    title: "Launch Ready",
    description: "Son doğrulama tamamlanır, bölüm yayın ritmine hazır hale gelir.",
    note: "Bu aşama, yalnızca temiz bir sonuç değil, sürdürülebilir bir yapı bırakır.",
    icon: SquareStack,
  },
];

function WorkflowStepCard({ step, index }: { step: WorkflowStep; index: number }) {
  const Icon = step.icon;

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Card className="group relative overflow-hidden border-white/10 bg-white/[0.04] transition-all duration-500 ease-out hover:-translate-y-1 hover:border-amber-400/35 hover:bg-white/[0.06] hover:shadow-[0_30px_90px_rgba(0,0,0,0.48)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(198,159,95,0.14),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))]" />
          <CardContent className="relative flex gap-5 p-5 md:p-6">
            <div className="flex w-20 shrink-0 flex-col items-start gap-3">
              <Badge className="border-amber-400/25 bg-amber-400/10 text-amber-200">
                {step.id}
              </Badge>
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-zinc-950/70 text-amber-200 transition-all duration-500 group-hover:border-amber-400/35 group-hover:text-amber-100">
                <Icon className="h-5 w-5" />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="font-[family-name:var(--font-smooch)] text-[1.35rem] font-semibold tracking-[0.16em] text-zinc-50 md:text-[1.7rem]">
                    {step.title}
                  </CardTitle>
                  <CardDescription className="mt-2 max-w-xl font-[family-name:var(--font-smooch)] text-[0.98rem] font-light tracking-[0.05em] text-zinc-400 md:text-[1.08rem]">
                    {step.description}
                  </CardDescription>
                </div>

                <span className="font-[family-name:var(--font-smooch)] text-sm font-light tracking-[0.28em] text-amber-200/70">
                  0{index + 1}
                </span>
              </div>

              <Separator className="my-4 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              <div className="flex items-center justify-between gap-3">
                <span className="font-[family-name:var(--font-smooch)] text-[0.72rem] font-medium uppercase tracking-[0.28em] text-zinc-500">
                  Premium Path
                </span>
                <ArrowUpRight className="h-4 w-4 text-amber-200/60 transition-all duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-amber-100" />
              </div>
            </div>
          </CardContent>
        </Card>
      </HoverCardTrigger>

      <HoverCardContent className="border-amber-400/20 bg-zinc-950/97">
        <p className="font-[family-name:var(--font-smooch)] text-[0.95rem] font-light tracking-[0.04em] text-zinc-200">
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
      className={`relative flex h-full w-full items-center overflow-hidden bg-[#09090b] text-zinc-100 ${className}`.trim()}
      aria-label="İş Akış Süreci"
      style={{ fontFamily: "var(--font-smooch)" }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(198,159,95,0.16),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_24%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] opacity-20" />
      </div>

      <div className="relative mx-auto grid h-full w-full max-w-7xl grid-cols-1 gap-6 px-4 py-8 md:px-8 lg:grid-cols-[0.86fr_1.14fr] lg:gap-10 lg:px-10 lg:py-10">
        <div className="flex h-full flex-col justify-between gap-6">
          <Card className="relative h-full overflow-hidden border-white/10 bg-white/[0.04]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(198,159,95,0.16),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))]" />
            <CardHeader className="relative p-6 md:p-8">
              <Badge className="w-fit border-amber-400/25 bg-amber-400/10 text-amber-200">
                İş Akış Süreci
              </Badge>
              <CardTitle className="mt-4 max-w-xl font-[family-name:var(--font-smooch)] text-[2.3rem] font-light leading-[0.9] tracking-[0.16em] text-zinc-50 md:text-[3.5rem] lg:text-[4.25rem]">
                Sıfırdan kurulan, sessiz ama güçlü bir workflow alanı.
              </CardTitle>
              <CardDescription className="mt-5 max-w-[32rem] font-[family-name:var(--font-smooch)] text-[1rem] font-light leading-8 tracking-[0.04em] text-zinc-400 md:text-[1.08rem]">
                Minimal yüzeyler, altın detaylar ve net tipografik hiyerarşi ile tasarlanmış,
                gelecekteki yeni mantık için tamamen boş ama kimliği olan bir iskelet.
              </CardDescription>
            </CardHeader>

            <CardContent className="relative flex flex-col gap-5 p-6 pt-0 md:p-8 md:pt-0">
              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-[1.25rem] border border-white/10 bg-zinc-950/60 p-4">
                  <p className="text-[0.68rem] uppercase tracking-[0.28em] text-zinc-500">
                    Layout
                  </p>
                  <p className="mt-2 text-lg font-medium tracking-[0.12em] text-zinc-100">
                    100vh Snap
                  </p>
                </div>
                <div className="rounded-[1.25rem] border border-amber-400/15 bg-amber-400/8 p-4">
                  <p className="text-[0.68rem] uppercase tracking-[0.28em] text-amber-200/70">
                    Accent
                  </p>
                  <p className="mt-2 text-lg font-medium tracking-[0.12em] text-amber-100">
                    Gold Detail
                  </p>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-4">
                <div className="flex items-center gap-3">
                  <Layers3 className="h-4 w-4 text-amber-200/70" />
                  <span className="text-[0.68rem] uppercase tracking-[0.3em] text-zinc-500">
                    Intent
                  </span>
                </div>
                <p className="mt-3 max-w-[28rem] text-[0.96rem] font-light leading-7 tracking-[0.04em] text-zinc-300">
                  Klasik süsleme olmadan kurumsal, sofistike ve rafine bir anlatı.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="relative flex h-full min-h-0 flex-col justify-center">
          <div className="relative h-full rounded-[2rem] border border-white/8 bg-white/[0.03] p-4 md:p-6">
            <div className="absolute left-8 top-8 bottom-8 hidden w-px bg-gradient-to-b from-transparent via-amber-400/35 to-transparent lg:block" />
            <div className="absolute left-8 top-8 hidden h-4 w-4 rounded-full border border-amber-300/60 bg-zinc-900 lg:block" />
            <div className="absolute left-8 bottom-8 hidden h-4 w-4 rounded-full border border-amber-300/60 bg-zinc-900 lg:block" />

            <div className="flex h-full flex-col gap-4 lg:pl-12">
              <div className="flex items-center justify-between gap-4 px-1">
                <div>
                  <Badge className="border-white/10 bg-white/[0.04] text-zinc-200">
                    Timeline
                  </Badge>
                  <h2 className="mt-4 font-[family-name:var(--font-smooch)] text-[1.9rem] font-light tracking-[0.18em] text-zinc-50 md:text-[2.6rem]">
                    Fikirden teslimata uzanan akış
                  </h2>
                </div>
                <span className="hidden font-[family-name:var(--font-smooch)] text-xs uppercase tracking-[0.34em] text-zinc-500 md:block">
                  Workflow
                </span>
              </div>

              <Separator className="bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" />

              <div className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-2">
                {WORKFLOW_STEPS.map((step, index) => (
                  <WorkflowStepCard key={step.id} step={step} index={index} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
