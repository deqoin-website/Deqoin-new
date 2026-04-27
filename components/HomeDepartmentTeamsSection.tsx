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

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.02),transparent_28%)]" />

                  <div className="absolute inset-0 flex flex-col justify-end">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

                    <div className="relative z-10 w-full max-w-[1400px] mx-auto px-8 md:px-16 pb-12 md:pb-24 flex flex-col md:flex-row justify-between items-end gap-8">
                      <motion.div
                        initial={false}
                        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.72, y: 24 }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col gap-2"
                      >
                        <p className="text-xs md:text-sm tracking-[0.3em] text-zinc-400 uppercase">
                          {categoryTitle}
                        </p>
                        <h2 className="text-6xl md:text-8xl font-thin text-white font-smooch tracking-wide">
                          {member.name}
                        </h2>
                        <p className="text-sm md:text-lg text-zinc-300 tracking-[0.2em] font-light">
                          {member.role}
                        </p>
                        {member.bio ? (
                          <p className="mt-2 max-w-2xl font-[family-name:var(--font-smooch)] text-[1rem] font-light leading-[1.3] tracking-[0.04em] text-white/82 sm:text-[1.08rem] lg:text-[1.18rem]">
                            {member.bio}
                          </p>
                        ) : null}
                      </motion.div>

                      <motion.div
                        initial={false}
                        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.72, y: 20 }}
                        transition={{ duration: 0.65, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col items-end gap-4"
                      >
                        <span className="text-[10px] md:text-xs tracking-[0.3em] text-zinc-400">
                          OTOMATİK 05.5 SN
                        </span>
                        <Button
                          asChild
                          variant="outline"
                          className="bg-white text-black hover:bg-zinc-200 hover:text-black rounded-full px-8 py-6 text-sm md:text-base tracking-widest transition-all duration-300"
                        >
                          <Link href="/departman-ekipleri">TÜM EKİPLERİ GÖR</Link>
                        </Button>
                      </motion.div>
                    </div>
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
