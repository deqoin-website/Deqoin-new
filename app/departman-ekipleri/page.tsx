"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Lenis from "lenis";
import Autoplay from "embla-carousel-autoplay";
import { Loader2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";

const teamFilters = [
  { key: "all", title: "HEPSİ" },
  { key: "mimarlik", title: "Mimarlık" },
  { key: "ic-mimarlik", title: "İç Mimarlık" },
  { key: "restorasyon", title: "Restorasyon Mimarlığı" },
  { key: "peyzaj", title: "Peyzaj Mimarlığı" },
  { key: "insaat-muhendisligi", title: "İnşaat Mühendisliği" },
  { key: "elektrik-elektronik-muhendisligi", title: "Elektrik ve Elektronik Mühendisliği" },
  { key: "plan-proje", title: "Plan ve Proje" },
  { key: "uygulama", title: "Uygulama Departmanı" },
  { key: "malzeme", title: "Malzeme Departmanı" },
] as const;

export default function OurTeam() {
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTeamFilter, setActiveTeamFilter] = useState<(typeof teamFilters)[number]["key"]>("all");
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
      } catch (err) {
        console.error("Team fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  const filteredTeam = useMemo(() => {
    if (activeTeamFilter === "all") return teamMembers;
    return teamMembers.filter((item) => item.category === activeTeamFilter);
  }, [activeTeamFilter, teamMembers]);

  useEffect(() => {
    setActiveIndex(0);
  }, [activeTeamFilter, filteredTeam.length]);

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

  const autoplay = useMemo(
    () =>
      Autoplay({
        delay: 6000,
        stopOnInteraction: false,
        stopOnMouseEnter: false,
      }),
    [],
  );

  if (loading) {
    return (
      <div className="site-shell" style={{ height: "70vh", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "12rem" }}>
        <Loader2 className="animate-spin" size={48} color="#a68966" />
      </div>
    );
  }

  return (
    <main className="site-shell project-detail-shell" style={{ paddingTop: "12rem" }}>
      <div className="section-inner" style={{ paddingBottom: "6rem" }}>
        <div className="mb-14 text-center">
          <h1 style={{ fontFamily: "var(--font-smooch), sans-serif", fontSize: "clamp(4rem, 10vw, 8rem)", fontWeight: 100, color: "#fff", letterSpacing: "0.2em", textTransform: "uppercase", margin: 0 }}>
            DEPARTMAN EKİPLERİ
          </h1>
          <p style={{ fontFamily: "var(--font-smooch), sans-serif", fontSize: "0.8rem", letterSpacing: "0.4em", fontWeight: 300, color: "#fff", textTransform: "uppercase", marginTop: "1rem" }}>
            DEQOIN Studio Ekipleri
          </p>
        </div>

        <div className="mb-8 flex flex-wrap justify-center gap-3">
          {teamFilters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => setActiveTeamFilter(filter.key)}
              className={`rounded-full border px-4 py-2 font-[family-name:var(--font-smooch)] text-[0.72rem] uppercase tracking-[0.28em] transition-all ${
                activeTeamFilter === filter.key
                  ? "border-white bg-white text-black"
                  : "border-white/10 bg-white/5 text-white hover:bg-white/10"
              }`}
            >
              {filter.title}
            </button>
          ))}
        </div>

        <Carousel className="h-[100svh] w-full" opts={{ loop: true, align: "start" }} setApi={setCarouselApi} plugins={[autoplay]}>
          <CarouselContent className="h-[100svh]">
            {filteredTeam.map((member, index) => (
              <CarouselItem key={member._id ?? member.id ?? index} className="h-[100svh] basis-full">
                <motion.div
                  initial={{ opacity: 0.92, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="relative h-[100svh] w-full overflow-hidden bg-black"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading={index === 0 ? "eager" : "lazy"}
                  />

                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.16)_0%,rgba(0,0,0,0.34)_32%,rgba(0,0,0,0.7)_100%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.06),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.02),transparent_22%)]" />

                  <div className="absolute inset-0 z-10 flex flex-col justify-between px-4 py-4 sm:px-6 sm:py-6 lg:px-10 lg:py-8">
                    <div className="flex flex-col items-start gap-3">
                      <span className="font-[family-name:var(--font-smooch)] text-[0.72rem] uppercase tracking-[0.4em] text-white/60">
                        {String(activeIndex + 1).padStart(2, "0")} / {String(filteredTeam.length).padStart(2, "0")}
                      </span>
                      <Separator className="w-28 bg-white/10" />
                    </div>

                    <Card className="max-w-4xl border border-white/10 bg-black/28 backdrop-blur-xl">
                      <CardContent className="flex flex-col gap-4 p-5 sm:p-6 lg:p-8">
                        <div className="flex flex-col gap-2">
                          <span className="font-[family-name:var(--font-smooch)] text-[clamp(2rem,5vw,4rem)] font-normal leading-[0.95] tracking-[0.08em] text-white">
                            {member.name}
                          </span>
                          <p className="font-[family-name:var(--font-smooch)] text-[0.92rem] font-light uppercase tracking-[0.3em] text-white/75">
                            {member.role}
                          </p>
                        </div>

                        {member.bio ? (
                          <>
                            <Separator className="bg-white/10" />
                            <p className="max-w-3xl font-[family-name:var(--font-smooch)] text-[0.95rem] font-light leading-[1.35] tracking-[0.04em] text-white/80">
                              {member.bio}
                            </p>
                          </>
                        ) : null}

                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {member.socials?.linkedin ? (
                              <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" className="font-[family-name:var(--font-smooch)] text-[0.72rem] uppercase tracking-[0.28em] text-white/70">
                                LinkedIn
                              </a>
                            ) : null}
                            {member.socials?.instagram ? (
                              <a href={member.socials.instagram} target="_blank" rel="noopener noreferrer" className="font-[family-name:var(--font-smooch)] text-[0.72rem] uppercase tracking-[0.28em] text-white/70">
                                Instagram
                              </a>
                            ) : null}
                          </div>
                          <Link
                            href="/departman-ekipleri"
                            className="font-[family-name:var(--font-smooch)] text-[0.72rem] uppercase tracking-[0.3em] text-white/70 transition hover:text-white"
                          >
                            Profili Gör
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="mt-4 flex items-center justify-between px-2">
          <span className="font-[family-name:var(--font-smooch)] text-[0.78rem] uppercase tracking-[0.4em] text-white/60">
            {String(activeIndex + 1).padStart(2, "0")} / {String(filteredTeam.length).padStart(2, "0")}
          </span>
          <span className="font-[family-name:var(--font-smooch)] text-[0.68rem] uppercase tracking-[0.32em] text-white/45">
            Otomatik 06 sn
          </span>
        </div>
      </div>
    </main>
  );
}
