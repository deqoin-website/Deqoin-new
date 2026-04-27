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

const AUTOPLAY_DELAY = 9000;
const SECTION_CLASS_NAME = "w-full min-h-screen !bg-zinc-950 py-24 overflow-hidden";

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
      className={cn("team-section snap-section relative", SECTION_CLASS_NAME, className)}
      style={{ backgroundColor: "#09090b" }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-6 md:px-16 mb-12 max-w-[1600px] mx-auto w-full z-10">
        <h2
          className="text-4xl md:text-5xl lg:text-7xl font-thin text-white uppercase tracking-[0.2em]"
          style={{ fontFamily: "Smooch Sans, sans-serif" }}
        >
          DEPARTMAN EKİPLERİ
        </h2>

        <Button
          asChild
          className="bg-white text-black hover:bg-zinc-200 rounded-full px-8 py-6 text-xl tracking-widest transition-all uppercase"
          style={{ fontFamily: "Smooch Sans, sans-serif" }}
        >
          <Link href="/departman-ekipleri">TÜM EKİPLERİ GÖR</Link>
        </Button>
      </div>

      <div className="mx-auto w-full max-w-[1600px] px-6 md:px-16">
        <Carousel
          className="w-full overflow-visible"
          opts={{ align: "center", loop: true, containScroll: false }}
          plugins={[autoplay]}
          setApi={setCarouselApi}
        >
          <CarouselContent className="-ml-4 items-stretch">
            {members.map((member, index) => {
              const slideImage =
                member.image || fallbackTeamMembers[index % fallbackTeamMembers.length]?.image || "";
              const categoryTitle = categoryTitleMap[member.category] ?? member.category;
              const isActive = index === activeIndex;
              const isAdjacent = Math.abs(index - activeIndex) === 1;

              return (
                <CarouselItem
                  key={member._id ?? member.id ?? `${member.name}-${index}`}
                  className="pl-4 md:basis-1/2 lg:basis-1/3"
                >
                  <div
                    className={[
                      "relative w-full h-[50vh] md:h-[60vh] lg:h-[65vh] rounded-2xl overflow-hidden group ml-0 md:ml-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                      isActive
                        ? "scale-100 opacity-100 shadow-2xl blur-0"
                        : isAdjacent
                          ? "scale-[0.94] opacity-60 blur-[1px]"
                          : "scale-[0.88] opacity-35 blur-[3px]",
                    ].join(" ")}
                  >
                    {slideImage ? (
                      <img
                        src={slideImage}
                        alt={member.name}
                        loading={index === 0 ? "eager" : "lazy"}
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : null}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

                    <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 flex flex-col gap-2 z-10">
                      <p
                        className="text-[10px] md:text-xs tracking-[0.3em] text-zinc-400 uppercase"
                        style={{ fontFamily: "Smooch Sans, sans-serif" }}
                      >
                        {categoryTitle}
                      </p>

                      <h3
                        className="text-5xl md:text-6xl font-thin text-white uppercase tracking-widest leading-none"
                        style={{ fontFamily: "Smooch Sans, sans-serif" }}
                      >
                        {member.name}
                      </h3>

                      <p
                        className="text-xs md:text-sm text-zinc-300 font-light tracking-[0.2em] uppercase mt-2"
                        style={{ fontFamily: "Smooch Sans, sans-serif" }}
                      >
                        {member.role}
                      </p>

                      {member.bio ? (
                        <motion.p
                          initial={false}
                          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.72, y: 10 }}
                          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                          className="mt-2 max-w-sm text-[0.95rem] leading-[1.35] tracking-[0.04em] text-white/80"
                          style={{ fontFamily: "Smooch Sans, sans-serif" }}
                        >
                          {member.bio}
                        </motion.p>
                      ) : null}
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>

          <CarouselPrevious className="left-2 md:left-4 border-white/15 bg-black/28 text-white backdrop-blur-md hover:bg-black/44 disabled:opacity-0" />
          <CarouselNext className="right-2 md:right-4 border-white/15 bg-black/28 text-white backdrop-blur-md hover:bg-black/44 disabled:opacity-0" />
        </Carousel>
      </div>
    </section>
  );
}
