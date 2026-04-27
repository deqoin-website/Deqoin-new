"use client";

import { useEffect, useMemo, useState } from "react";
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
      className={cn("team-section snap-section relative overflow-hidden bg-zinc-950 text-white", className)}
    >
      <Carousel
        className="w-full md:max-w-7xl md:mx-auto md:h-[80vh] md:rounded-3xl md:overflow-hidden md:shadow-2xl h-[100dvh] md:bg-zinc-950"
        opts={{ align: "start", loop: true }}
        plugins={[autoplay]}
        setApi={setCarouselApi}
      >
        <CarouselContent className="h-[100dvh] md:h-[80vh]">
          {members.map((member, index) => {
            const slideImage =
              member.image || fallbackTeamMembers[index % fallbackTeamMembers.length]?.image || "";
            const categoryTitle = categoryTitleMap[member.category] ?? member.category;
            const isActive = index === activeIndex;

            return (
              <CarouselItem
                key={member._id ?? member.id ?? `${member.name}-${index}`}
                className="basis-full h-[100dvh] md:h-[80vh]"
              >
                <div className="relative w-full h-[100dvh] md:h-[80vh] md:max-w-7xl mx-auto md:rounded-3xl overflow-hidden bg-zinc-950">
                  {slideImage ? (
                    <img
                      src={slideImage}
                      alt={member.name}
                      loading={index === 0 ? "eager" : "lazy"}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : null}

                  <div className="absolute inset-0 flex flex-col justify-end">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

                    <div className="relative z-10 w-full px-6 md:px-16 pb-12 md:pb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                      <motion.div
                        initial={false}
                        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.72, y: 24 }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col gap-2"
                      >
                        <p className="text-xs tracking-[0.3em] text-zinc-400 uppercase">
                          {categoryTitle}
                        </p>
                        <h2
                          className="text-5xl md:text-7xl font-thin text-white uppercase tracking-widest"
                          style={{ fontFamily: "Smooch Sans, sans-serif" }}
                        >
                          {member.name}
                        </h2>
                        <p className="text-sm md:text-base text-zinc-300 font-light tracking-[0.2em] uppercase">
                          {member.role}
                        </p>
                        {member.bio ? (
                          <p
                            className="mt-2 max-w-2xl font-light leading-[1.3] tracking-[0.04em] text-white/82"
                            style={{ fontFamily: "Smooch Sans, sans-serif" }}
                          >
                            {member.bio}
                          </p>
                        ) : null}
                      </motion.div>

                      <motion.div
                        initial={false}
                        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.72, y: 20 }}
                        transition={{ duration: 0.65, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col items-start md:items-end gap-4 w-full md:w-auto"
                      >
                        <span className="hidden md:block text-[10px] md:text-xs tracking-[0.3em] text-zinc-400 uppercase">
                          OTOMATİK 05.5 SN
                        </span>
                        <Button
                          className="bg-white text-black hover:bg-zinc-200 hover:text-black rounded-full px-8 py-6 text-xs md:text-sm tracking-widest uppercase transition-all w-full md:w-auto shadow-lg"
                        >
                          TÜM EKİPLERİ GÖR
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
