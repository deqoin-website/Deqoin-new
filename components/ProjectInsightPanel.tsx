"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ChevronDown, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { ProjectDetail } from "../data/projects";

type ProjectInsightPanelProps = {
  project: ProjectDetail | null;
  onClose: () => void;
  className?: string;
};

type DetailRow = {
  label: string;
  value: string;
};

function DetailCard({ label, value }: DetailRow) {
  return (
    <Card className="rounded-none border-white/10 bg-white/[0.04] shadow-none backdrop-blur-sm transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.06]">
      <div className="flex h-full flex-col gap-2 p-4 md:p-5">
        <span className="font-[family-name:var(--font-smooch)] text-[0.64rem] uppercase tracking-[0.42em] text-white/45">
          {label}
        </span>
        <p className="font-[family-name:var(--font-smooch)] text-[0.95rem] leading-[1.4] tracking-[0.06em] text-white/92 md:text-[1.08rem]">
          {value}
        </p>
      </div>
    </Card>
  );
}

export default function ProjectInsightPanel({
  project,
  onClose,
  className = "",
}: ProjectInsightPanelProps) {
  const prefersReducedMotion = useReducedMotion();

  const galleryImages = useMemo(() => {
    if (!project) return [];
    return project.gallery?.length > 0 ? project.gallery : [project.coverImage];
  }, [project]);

  const detailRows = useMemo<DetailRow[]>(() => {
    if (!project) return [];

    return [
      { label: "MÜŞTERİ", value: project.client || "-" },
      { label: "YIL", value: project.year || "-" },
      { label: "PROJE ALANI", value: project.area || "-" },
      { label: "STÜDYO", value: project.studio || project.label || "-" },
      { label: "BAŞ MİMARLAR", value: project.leadArchitects || "DEQOIN DESIGN STUDIO" },
      { label: "SÜRDÜRÜLEBİLİRLİK", value: project.sustainability || project.techDetails || "-" },
    ];
  }, [project]);

  useEffect(() => {
    if (!project) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, project]);

  return (
    <AnimatePresence>
      {project ? (
        <>
          <motion.button
            type="button"
            className={cn(
              "fixed inset-0 z-50 bg-black/82 backdrop-blur-[28px] transition-opacity",
              className,
            )}
            aria-label="Proje detay penceresini kapat"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0.1 : 0.28, ease: [0.16, 1, 0.3, 1] }}
          />

          <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 md:p-6">
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label={`${project.title} proje detayları`}
              className="relative flex h-[100svh] w-full items-center justify-center md:h-[min(92svh,980px)] md:max-h-[92svh] md:w-[min(96vw,1600px)]"
              initial={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : {
                      opacity: 0,
                      y: 30,
                      scale: 0.985,
                    }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : {
                      opacity: 0,
                      y: 18,
                      scale: 0.985,
                    }
              }
              transition={{ duration: prefersReducedMotion ? 0.1 : 0.52, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="relative flex h-full w-full overflow-hidden rounded-none border border-white/10 bg-[#080808] text-white shadow-[0_40px_140px_rgba(0,0,0,0.72)]">
                <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.9)_1px,transparent_0)] [background-size:18px_18px]" />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),transparent_18%,rgba(0,0,0,0.08))]" />

                <div className="grid h-full w-full min-h-0 grid-cols-1 lg:grid-cols-[1.07fr_0.93fr]">
                  <section className="flex min-h-0 flex-col border-b border-white/10 lg:border-b-0 lg:border-r lg:border-white/10">
                    <div className="group relative min-h-[42svh] flex-1 overflow-hidden bg-black">
                      <img
                        src={project.coverImage}
                        alt={project.title}
                        className="h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.24)_32%,rgba(0,0,0,0.86)_100%)]" />
                      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4 md:p-6">
                        <div className="space-y-1">
                          <p className="font-[family-name:var(--font-smooch)] text-[0.68rem] uppercase tracking-[0.52em] text-white/55">
                            DEQOIN
                          </p>
                          <p className="font-[family-name:var(--font-smooch)] text-[0.62rem] uppercase tracking-[0.44em] text-white/42">
                            PROJECT ARCHIVE
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="hidden rounded-none border border-white/10 bg-white/[0.04] px-3 py-2 font-[family-name:var(--font-smooch)] text-[0.62rem] uppercase tracking-[0.36em] text-white/65 md:inline-flex">
                            {project.label}
                          </span>
                          <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-none border border-white/10 bg-white/[0.05] text-white/80 transition-all duration-300 hover:border-white/30 hover:bg-white hover:text-zinc-950"
                            aria-label="Kapat"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="absolute inset-x-0 bottom-0 p-4 md:p-6 lg:p-8">
                        <p className="mb-3 font-[family-name:var(--font-smooch)] text-[0.68rem] uppercase tracking-[0.4em] text-white/55">
                          {project.location || "İSTANBUL, TÜRKİYE"}
                        </p>
                        <h3
                          className="max-w-3xl font-[family-name:var(--font-smooch)] text-[clamp(2.8rem,6vw,5.7rem)] font-thin uppercase leading-[0.82] tracking-[0.08em] text-white drop-shadow-[0_14px_30px_rgba(0,0,0,0.45)]"
                          style={{ fontWeight: 100 }}
                        >
                          {project.title}
                        </h3>
                      </div>
                    </div>

                    <div className="hidden border-t border-white/10 bg-black/35 lg:block">
                      <div className="grid grid-cols-4 gap-0">
                        {galleryImages.slice(0, 4).map((image, index) => (
                          <div key={`${project.slug}-thumb-${index}`} className="relative aspect-[4/3] overflow-hidden rounded-none border-r border-white/8 last:border-r-0">
                            <img
                              src={image}
                              alt={`${project.title} görsel ${index + 1}`}
                              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>

                  <section className="flex min-h-0 flex-col bg-black/55">
                    <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 md:px-7 md:py-5">
                      <div>
                        <p className="font-[family-name:var(--font-smooch)] text-[0.62rem] uppercase tracking-[0.5em] text-white/45">
                          PROJE DETAYI
                        </p>
                        <p className="mt-2 max-w-sm font-[family-name:var(--font-smooch)] text-[0.72rem] uppercase tracking-[0.24em] text-white/70">
                          Sofistike, veriye dayalı ve merkezde hizalanmış detay deneyimi
                        </p>
                      </div>
                      <span className="hidden font-[family-name:var(--font-smooch)] text-[0.62rem] uppercase tracking-[0.5em] text-white/38 md:inline-flex">
                        QUIET LUXURY
                      </span>
                    </div>

                    <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 md:px-7 md:py-7 lg:px-8 lg:py-8">
                      <div className="mb-6 space-y-3">
                        <p className="font-[family-name:var(--font-smooch)] text-[0.68rem] uppercase tracking-[0.42em] text-white/46">
                          {project.label}
                        </p>
                        <h4
                          className="max-w-2xl font-[family-name:var(--font-smooch)] text-[clamp(2.2rem,4vw,4.3rem)] font-thin uppercase leading-[0.88] tracking-[0.06em] text-white"
                          style={{ fontWeight: 100 }}
                        >
                          {project.title}
                        </h4>
                        <p className="max-w-2xl text-sm leading-7 text-white/70 md:text-[0.98rem]">
                          {project.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        {detailRows.map((row) => (
                          <DetailCard key={row.label} {...row} />
                        ))}
                      </div>

                      <div className="mt-6 space-y-3">
                        <details className="group rounded-none border border-white/10 bg-white/[0.03] transition-colors duration-300 open:bg-white/[0.05]">
                          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 md:px-5">
                            <span className="font-[family-name:var(--font-smooch)] text-[0.7rem] uppercase tracking-[0.42em] text-white/70">
                              PROJE VİZYONU
                            </span>
                            <ChevronDown className="h-4 w-4 text-white/45 transition-transform duration-300 group-open:rotate-180" />
                          </summary>
                          <div className="border-t border-white/10 px-4 pb-4 pt-3 md:px-5">
                            <p className="max-w-3xl text-sm leading-7 text-white/72 md:text-[0.98rem]">
                              {project.vision}
                            </p>
                          </div>
                        </details>

                        <details className="group rounded-none border border-white/10 bg-white/[0.03] transition-colors duration-300 open:bg-white/[0.05]">
                          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 md:px-5">
                            <span className="font-[family-name:var(--font-smooch)] text-[0.7rem] uppercase tracking-[0.42em] text-white/70">
                              TEKNİK OMURGA
                            </span>
                            <ChevronDown className="h-4 w-4 text-white/45 transition-transform duration-300 group-open:rotate-180" />
                          </summary>
                          <div className="border-t border-white/10 px-4 pb-4 pt-3 md:px-5">
                            <p className="max-w-3xl text-sm leading-7 text-white/72 md:text-[0.98rem]">
                              {project.techDetails}
                            </p>
                          </div>
                        </details>

                        <details className="group rounded-none border border-white/10 bg-white/[0.03] transition-colors duration-300 open:bg-white/[0.05]">
                          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 md:px-5">
                            <span className="font-[family-name:var(--font-smooch)] text-[0.7rem] uppercase tracking-[0.42em] text-white/70">
                              MEKANSAL KURGU
                            </span>
                            <ChevronDown className="h-4 w-4 text-white/45 transition-transform duration-300 group-open:rotate-180" />
                          </summary>
                          <div className="border-t border-white/10 px-4 pb-4 pt-3 md:px-5">
                            <p className="max-w-3xl text-sm leading-7 text-white/72 md:text-[0.98rem]">
                              {project.story}
                            </p>
                          </div>
                        </details>
                      </div>

                      <div className="mt-6 lg:hidden">
                        <div className="mb-3 flex items-center justify-between">
                          <span className="font-[family-name:var(--font-smooch)] text-[0.66rem] uppercase tracking-[0.42em] text-white/45">
                            GALERİ KARELERİ
                          </span>
                          <span className="font-[family-name:var(--font-smooch)] text-[0.62rem] uppercase tracking-[0.4em] text-white/35">
                            SWIPE
                          </span>
                        </div>

                        <Carousel className="w-full">
                          <CarouselContent className="-ml-4">
                            {galleryImages.map((image, index) => (
                              <CarouselItem key={`${project.slug}-mobile-${index}`} className="pl-4">
                                <div className="relative aspect-[4/3] overflow-hidden rounded-none border border-white/10 bg-black">
                                  <img
                                    src={image}
                                    alt={`${project.title} galeri ${index + 1}`}
                                    className="h-full w-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                                </div>
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                          <div className="mt-3 flex items-center justify-between">
                            <CarouselPrevious className="static translate-y-0 rounded-none border-white/10 bg-white/[0.05] text-white hover:bg-white hover:text-zinc-950" />
                            <CarouselNext className="static translate-y-0 rounded-none border-white/10 bg-white/[0.05] text-white hover:bg-white hover:text-zinc-950" />
                          </div>
                        </Carousel>
                      </div>
                    </div>

                    <div className="sticky bottom-0 border-t border-white/10 bg-[#080808]/96 px-5 py-4 backdrop-blur-xl md:px-7 md:py-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="font-[family-name:var(--font-smooch)] text-[0.62rem] uppercase tracking-[0.42em] text-white/38">
                          Detay penceresi merkezi olarak tasarlandı
                        </p>

                        <div className="flex flex-col gap-3 sm:flex-row">
                          <Button
                            asChild
                            className="h-11 rounded-none border border-white/10 bg-white/5 px-5 font-[family-name:var(--font-smooch)] text-[0.68rem] uppercase tracking-[0.34em] text-white transition-all duration-300 hover:bg-white hover:text-zinc-950"
                          >
                            <Link href={`/galeri/${project.slug}`}>
                              <span>DETAYLARI İNCELE</span>
                              <ArrowUpRight className="h-4 w-4" />
                            </Link>
                          </Button>

                          <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="h-11 rounded-none border-white/10 bg-white/[0.03] font-[family-name:var(--font-smooch)] text-[0.68rem] uppercase tracking-[0.34em] text-white transition-all duration-300 hover:bg-white hover:text-zinc-950"
                          >
                            KAPAT
                          </Button>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </motion.aside>
          </div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
