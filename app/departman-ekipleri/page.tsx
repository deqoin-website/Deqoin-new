"use client";

import { useEffect, useMemo, useState } from "react";

import Lenis from "lenis";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";

type TeamMember = {
  _id?: string;
  id?: string;
  name: string;
  role: string;
  bio?: string;
  image: string;
  socials?: {
    linkedin?: string;
    instagram?: string;
  };
};

export default function OurTeam() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [carouselApi, setCarouselApi] = useState<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    let frame = 0;

    const raf = (time: number) => {
      lenis.raf(time);
      frame = window.requestAnimationFrame(raf);
    };

    frame = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch("/api/admin/team");
        if (res.ok) {
          const data = await res.json();
          setTeamMembers(data);
        }
      } catch (error) {
        console.error("Team fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  const autoplay = useMemo(
    () =>
      Autoplay({
        delay: 6000,
        stopOnInteraction: false,
        stopOnMouseEnter: false,
      }),
    [],
  );

  useEffect(() => {
    if (!carouselApi) return;

    const handleSelect = () => setActiveIndex(carouselApi.selectedScrollSnap());
    handleSelect();
    carouselApi.on("select", handleSelect);
    carouselApi.on("reInit", handleSelect);

    return () => {
      carouselApi.off("select", handleSelect);
      carouselApi.off("reInit", handleSelect);
    };
  }, [carouselApi]);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-black pt-48">
        <Loader2 className="animate-spin text-white/70" size={44} />
      </div>
    );
  }

  return (
    <main className="bg-zinc-950 text-white">
      <section className="relative h-[100svh] w-full overflow-hidden">
        <Carousel className="h-[100svh] w-full" opts={{ loop: true, align: "start" }} setApi={setCarouselApi} plugins={[autoplay]}>
          <CarouselContent className="h-[100svh]">
            {teamMembers.map((member, index) => (
              <CarouselItem key={member._id ?? member.id ?? index} className="h-[100svh] basis-full">
                <motion.div
                  initial={{ opacity: 0.9, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="relative h-[100svh] w-full overflow-hidden bg-black"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading={index === 0 ? "eager" : "lazy"}
                  />

                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.18)_0%,rgba(0,0,0,0.34)_35%,rgba(0,0,0,0.76)_100%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.06),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.02),transparent_26%)]" />

                  <div className="absolute inset-0 z-10 flex h-full w-full flex-col justify-between px-4 py-4 sm:px-6 sm:py-6 lg:px-10 lg:py-8">
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col gap-3">
                        <span className="font-[family-name:var(--font-smooch)] text-[0.72rem] uppercase tracking-[0.42em] text-white/60">
                          DEPARTMAN EKİPLERİ
                        </span>
                        <Separator className="w-28 bg-white/10" />
                      </div>

                      <span className="font-[family-name:var(--font-smooch)] text-[0.72rem] uppercase tracking-[0.4em] text-white/60">
                        {String(activeIndex + 1).padStart(2, "0")} / {String(teamMembers.length).padStart(2, "0")}
                      </span>
                    </div>

                    <Card className="max-w-4xl border border-white/10 bg-black/30 backdrop-blur-xl">
                      <CardContent className="flex flex-col gap-4 p-5 sm:p-6 lg:p-8">
                        <div className="flex flex-col gap-2">
                          <span className="font-[family-name:var(--font-smooch)] text-[clamp(2.2rem,5vw,4.4rem)] font-normal leading-[0.92] tracking-[0.08em] text-white">
                            {member.name}
                          </span>
                          <p className="font-[family-name:var(--font-smooch)] text-[0.92rem] font-light uppercase tracking-[0.32em] text-white/78">
                            {member.role}
                          </p>
                        </div>

                        {member.bio ? (
                          <>
                            <Separator className="bg-white/10" />
                            <p className="max-w-3xl font-[family-name:var(--font-smooch)] text-[0.95rem] font-light leading-[1.4] tracking-[0.04em] text-white/82">
                              {member.bio}
                            </p>
                          </>
                        ) : null}

                        <div className="mt-2 flex items-center justify-between gap-4">
                          <div className="flex flex-wrap items-center gap-3">
                            {member.socials?.linkedin ? (
                              <a
                                href={member.socials.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-[family-name:var(--font-smooch)] text-[0.72rem] uppercase tracking-[0.28em] text-white/70 transition hover:text-white"
                              >
                                LinkedIn
                              </a>
                            ) : null}
                            {member.socials?.instagram ? (
                              <a
                                href={member.socials.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-[family-name:var(--font-smooch)] text-[0.72rem] uppercase tracking-[0.28em] text-white/70 transition hover:text-white"
                              >
                                Instagram
                              </a>
                            ) : null}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>
    </main>
  );
}
