"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Lenis from "lenis";
import Autoplay from "embla-carousel-autoplay";

import { teamFilters, teamMembers as fallbackTeamMembers } from "@/data/team";
import { Button } from "@/components/ui/button";
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

const AUTOPLAY_DELAY = 5500;

export default function HomeDepartmentTeamsSection({ className }: { className?: string }) {
  const [members, setMembers] = useState<TeamMember[]>(fallbackTeamMembers);
  const [activeIndex, setActiveIndex] = useState(0);
  const [carouselApi, setCarouselApi] = useState<any>(null);

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
        // Keep fallback content when the API is unavailable.
      }
    };

    fetchMembers();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const shell = document.querySelector(".homepage-snap-shell");
    if (shell) return;

    const lenis = new Lenis({
      autoRaf: true,
      smoothWheel: true,
      syncTouch: false,
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  const autoplay = useMemo(
    () =>
      Autoplay({
        delay: AUTOPLAY_DELAY,
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
      className={cn("team-section snap-section relative overflow-hidden bg-black text-white", className)}
    >
      <Carousel
        className="h-screen w-full"
        opts={{ align: "start", loop: true }}
        plugins={[autoplay]}
        setApi={setCarouselApi}
      >
        <CarouselContent className="h-screen">
          {members.map((member, index) => {
            const slideImage =
              member.image || fallbackTeamMembers[index % fallbackTeamMembers.length]?.image || "";
            const categoryTitle = categoryTitleMap[member.category] ?? member.category;
            const isActive = index === activeIndex;

            return (
              <CarouselItem
                key={member._id ?? member.id ?? `${member.name}-${index}`}
                className="min-h-screen h-screen basis-full"
              >
                <div className="relative min-h-screen h-full w-full overflow-hidden bg-zinc-950">
                  {slideImage ? (
                    <img
                      src={slideImage}
                      alt={member.name}
                      loading={index === 0 ? "eager" : "lazy"}
                      className="absolute inset-0 h-full w-full object-cover object-center"
                    />
                  ) : null}

                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.18)_0%,rgba(0,0,0,0.32)_30%,rgba(0,0,0,0.82)_100%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.02),transparent_28%)]" />

                  <div className="absolute inset-0 z-10 flex h-full flex-col justify-between px-4 py-5 sm:px-6 sm:py-6 lg:px-10 lg:py-8">
                    <div className="flex items-start justify-between gap-4">
                      <motion.div
                        initial={false}
                        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.45, y: -8 }}
                        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col gap-3"
                      >
                        <span className="font-[family-name:var(--font-smooch)] text-[0.78rem] uppercase tracking-[0.46em] text-white/70">
                          Departman Ekipleri
                        </span>
                        <Separator className="w-24 bg-white/15" />
                      </motion.div>

                      <motion.div
                        initial={false}
                        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.5, y: -8 }}
                        transition={{ duration: 0.55, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
                        className="text-right"
                      >
                        <span className="font-[family-name:var(--font-smooch)] text-[0.82rem] uppercase tracking-[0.34em] text-white/68">
                          {String(activeIndex + 1).padStart(2, "0")} / {String(members.length).padStart(2, "0")}
                        </span>
                      </motion.div>
                    </div>

                    <div className="flex w-full items-end justify-between gap-6">
                      <motion.div
                        initial={false}
                        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.72, y: 24 }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="max-w-4xl"
                      >
                        <motion.p
                          initial={false}
                          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.6, y: 12 }}
                          transition={{ duration: 0.55, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                          className="mb-3 font-[family-name:var(--font-smooch)] text-[0.86rem] uppercase tracking-[0.4em] text-white/60 sm:text-[0.92rem]"
                        >
                          {categoryTitle}
                        </motion.p>

                        <motion.h2
                          initial={false}
                          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.68, y: 16 }}
                          transition={{ duration: 0.65, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                          className="max-w-4xl font-[family-name:var(--font-smooch)] text-[clamp(3rem,9vw,7rem)] font-light uppercase leading-[0.84] tracking-[0.08em] text-white"
                        >
                          {member.name}
                        </motion.h2>

                        <motion.p
                          initial={false}
                          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.66, y: 16 }}
                          transition={{ duration: 0.65, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                          className="mt-3 font-[family-name:var(--font-smooch)] text-[1rem] uppercase tracking-[0.3em] text-white/76 sm:text-[1.08rem] lg:text-[1.15rem]"
                        >
                          {member.role}
                        </motion.p>

                        {member.bio ? (
                          <motion.p
                            initial={false}
                            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.58, y: 18 }}
                            transition={{ duration: 0.7, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
                            className="mt-4 max-w-2xl font-[family-name:var(--font-smooch)] text-[1rem] font-light leading-[1.3] tracking-[0.04em] text-white/82 sm:text-[1.08rem] lg:text-[1.18rem]"
                          >
                            {member.bio}
                          </motion.p>
                        ) : null}
                      </motion.div>

                      <motion.div
                        initial={false}
                        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.72, y: 20 }}
                        transition={{ duration: 0.65, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
                        className="hidden shrink-0 flex-col items-end gap-4 lg:flex"
                      >
                        <span className="font-[family-name:var(--font-smooch)] text-[0.78rem] uppercase tracking-[0.34em] text-white/50">
                          Otomatik 05.5 sn
                        </span>
                        <Button
                          asChild
                          variant="outline"
                          className="border-white/12 bg-white/95 font-[family-name:var(--font-smooch)] text-[0.86rem] uppercase tracking-[0.28em] text-black hover:bg-white"
                        >
                          <Link href="/departman-ekipleri">TUM EKIPLERI GOR</Link>
                        </Button>
                      </motion.div>
                    </div>

                    <motion.div
                      initial={false}
                      animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.74, y: 16 }}
                      transition={{ duration: 0.55, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
                      className="flex items-center justify-between gap-4 lg:hidden"
                    >
                      <span className="font-[family-name:var(--font-smooch)] text-[0.76rem] uppercase tracking-[0.34em] text-white/52">
                        Otomatik 05.5 sn
                      </span>
                      <Button
                        asChild
                        variant="outline"
                        className="border-white/12 bg-white/95 font-[family-name:var(--font-smooch)] text-[0.8rem] uppercase tracking-[0.24em] text-black hover:bg-white"
                      >
                        <Link href="/departman-ekipleri">TUM EKIPLERI GOR</Link>
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        <CarouselPrevious className="left-4 border-white/15 bg-black/28 text-white backdrop-blur-md hover:bg-black/44 disabled:opacity-0 sm:left-6 lg:left-8" />
        <CarouselNext className="right-4 border-white/15 bg-black/28 text-white backdrop-blur-md hover:bg-black/44 disabled:opacity-0 sm:right-6 lg:right-8" />
      </Carousel>
    </section>
  );
}
