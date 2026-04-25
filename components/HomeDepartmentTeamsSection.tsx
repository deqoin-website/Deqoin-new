"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Lenis from "lenis";
import Autoplay from "embla-carousel-autoplay";

import { teamFilters, teamMembers as fallbackTeamMembers } from "@/data/team";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type TeamMember = {
  _id?: string;
  id?: string | number;
  name: string;
  role: string;
  category: string;
  image?: string;
  bio?: string;
};

const categoryTitleMap = Object.fromEntries(
  teamFilters
    .filter((filter) => filter.key !== "all")
    .map((filter) => [filter.key, filter.title]),
) as Record<string, string>;

export default function HomeDepartmentTeamsSection({ className }: { className?: string }) {
  const [members, setMembers] = useState<TeamMember[]>(fallbackTeamMembers);
  const [activeIndex, setActiveIndex] = useState(0);
  const [carouselApi, setCarouselApi] = useState<any>(null);

  useEffect(() => {
    const activeWindow = window as Window & { __deqoinHomeLenis?: Lenis };

    if (activeWindow.__deqoinHomeLenis) return;

    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      syncTouch: true,
    });

    activeWindow.__deqoinHomeLenis = lenis;

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = window.requestAnimationFrame(raf);
    };

    frame = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(frame);
      lenis.destroy();
      if (activeWindow.__deqoinHomeLenis === lenis) {
        delete activeWindow.__deqoinHomeLenis;
      }
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchMembers = async () => {
      try {
        const response = await fetch("/api/admin/team", { cache: "no-store" });
        if (!response.ok) return;
        const data = await response.json();
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          setMembers(data);
        }
      } catch {
        // Keep fallback content when API is unavailable.
      }
    };

    fetchMembers();

    return () => {
      cancelled = true;
    };
  }, []);

  const autoplay = useMemo(
    () =>
      Autoplay({
        delay: 5500,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    [],
  );

  useEffect(() => {
    if (!carouselApi) return;

    const syncIndex = () => setActiveIndex(carouselApi.selectedScrollSnap());

    syncIndex();
    carouselApi.on("select", syncIndex);
    carouselApi.on("reInit", syncIndex);

    return () => {
      carouselApi.off("select", syncIndex);
      carouselApi.off("reInit", syncIndex);
    };
  }, [carouselApi]);

  return (
    <section
      id="departman-ekipleri"
      className={cn(
        "team-section snap-section homepage-section-v2 relative overflow-hidden bg-black text-white",
        className,
      )}
    >
      <Carousel
        className="h-screen w-full"
        opts={{ align: "start", loop: true }}
        plugins={[autoplay]}
        setApi={setCarouselApi}
      >
        <CarouselContent className="h-screen">
          {members.map((member, index) => {
            const categoryTitle = categoryTitleMap[member.category] ?? member.category;
            const slideImage = member.image || fallbackTeamMembers[index % fallbackTeamMembers.length]?.image || "";
            const isActive = activeIndex === index;

            return (
              <CarouselItem key={member._id ?? member.id ?? `${member.name}-${index}`} className="h-screen basis-full">
                <div className="relative h-screen w-full overflow-hidden bg-zinc-950">
                  {slideImage ? (
                    <img
                      src={slideImage}
                      alt={member.name}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                  ) : null}

                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.16)_0%,rgba(0,0,0,0.32)_32%,rgba(0,0,0,0.84)_100%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.03),transparent_28%)]" />

                  <div className="absolute inset-0 z-10 flex h-full flex-col justify-between px-4 py-5 sm:px-6 sm:py-6 lg:px-10 lg:py-8">
                    <div className="flex items-start justify-between gap-4">
                      <motion.div
                        initial={false}
                        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.45, y: -8 }}
                        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col gap-3"
                      >
                        <span className="font-[family-name:var(--font-smooch)] text-[0.78rem] uppercase tracking-[0.5em] text-white/70">
                          Departman Ekipleri
                        </span>
                        <Separator className="w-28 bg-white/15" />
                      </motion.div>

                      <motion.div
                        initial={false}
                        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.45, y: -8 }}
                        transition={{ duration: 0.55, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
                        className="text-right"
                      >
                        <span className="font-[family-name:var(--font-smooch)] text-[0.8rem] uppercase tracking-[0.36em] text-white/65">
                          {String(activeIndex + 1).padStart(2, "0")} / {String(members.length).padStart(2, "0")}
                        </span>
                      </motion.div>
                    </div>

                    <motion.div
                      initial={false}
                      animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.7, y: 18 }}
                      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                      className="w-full"
                    >
                      <Card className="w-full max-w-4xl border-white/10 bg-black/30 shadow-[0_24px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl">
                        <CardContent className="flex flex-col gap-5 p-5 sm:p-6 lg:p-8">
                          <div className="flex flex-col gap-2">
                            <span className="font-[family-name:var(--font-smooch)] text-[0.8rem] uppercase tracking-[0.38em] text-white/60">
                              {categoryTitle}
                            </span>
                            <motion.h2
                              initial={false}
                              animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.65, y: 10 }}
                              transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                              className="font-[family-name:var(--font-smooch)] text-[clamp(2.8rem,8vw,6.5rem)] font-light uppercase leading-[0.86] tracking-[0.08em] text-white"
                            >
                              {member.name}
                            </motion.h2>
                            <motion.p
                              initial={false}
                              animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.65, y: 10 }}
                              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                              className="font-[family-name:var(--font-smooch)] text-[1rem] uppercase tracking-[0.32em] text-white/76 sm:text-[1.1rem]"
                            >
                              {member.role}
                            </motion.p>
                          </div>

                          {member.bio ? (
                            <>
                              <Separator className="bg-white/10" />
                              <motion.p
                                initial={false}
                                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.55, y: 12 }}
                                transition={{ duration: 0.6, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
                                className="max-w-3xl font-[family-name:var(--font-smooch)] text-[1rem] font-light leading-[1.35] tracking-[0.04em] text-white/82 sm:text-[1.05rem] lg:text-[1.15rem]"
                              >
                                {member.bio}
                              </motion.p>
                            </>
                          ) : null}

                          <div className="flex items-center justify-between gap-4 pt-1">
                            <span className="font-[family-name:var(--font-smooch)] text-[0.76rem] uppercase tracking-[0.34em] text-white/52">
                              Otomatik 05.5 sn
                            </span>
                            <Button
                              asChild
                              variant="outline"
                              className="border-white/15 bg-white/95 font-[family-name:var(--font-smooch)] text-[0.85rem] uppercase tracking-[0.28em] text-black hover:bg-white"
                            >
                              <Link href="/departman-ekipleri">TUM EKIPLERI GOR</Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        <CarouselPrevious className="left-4 border-white/15 bg-black/30 text-white backdrop-blur-md hover:bg-black/45 disabled:opacity-0 sm:left-6 lg:left-8" />
        <CarouselNext className="right-4 border-white/15 bg-black/30 text-white backdrop-blur-md hover:bg-black/45 disabled:opacity-0 sm:right-6 lg:right-8" />
      </Carousel>
    </section>
  );
}
