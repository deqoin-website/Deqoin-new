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
];

export default function OurTeam() {
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTeamFilter, setActiveTeamFilter] = useState("all");
  const [carouselApi, setCarouselApi] = useState<any>(null);
  const [activeMemberIndex, setActiveMemberIndex] = useState(0);

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
    setActiveMemberIndex(0);
  }, [activeTeamFilter, filteredTeam.length]);

  useEffect(() => {
    if (!carouselApi) return;
    const handleSelect = () => setActiveMemberIndex(carouselApi.selectedScrollSnap());
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
        <div style={{ marginBottom: "5rem", textAlign: "center" }}>
          <h1 style={{ fontFamily: "var(--font-smooch), sans-serif", fontSize: "clamp(4rem, 10vw, 8rem)", fontWeight: 100, color: "#fff", letterSpacing: "0.2em", textTransform: "uppercase", margin: 0 }}>DEPARTMAN EKİPLERİ</h1>
          <p style={{ fontFamily: "var(--font-display), sans-serif", fontSize: "0.8rem", letterSpacing: "0.4em", fontWeight: 300, color: "#fff", textTransform: "uppercase", marginTop: "1rem" }}>
            DEQOIN Studio Ekipleri
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem", marginBottom: "4rem" }}>
          <div className="filter-bar" style={{ justifyContent: "center" }}>
            {teamFilters.map((filter) => (
              <button
                key={filter.key}
                type="button"
                className={`filter-button ${activeTeamFilter === filter.key ? "active" : ""}`}
                onClick={() => setActiveTeamFilter(filter.key)}
              >
                <span className="filter-border" style={{ borderColor: "var(--line)" }} />
                <span className="filter-text" style={{ color: "#fff" }}>{filter.title}</span>
              </button>
            ))}
          </div>
        </div>

        <Carousel className="mt-10" opts={{ loop: true, align: "start" }} setApi={setCarouselApi} plugins={[autoplay]}>
          <CarouselContent>
            {filteredTeam.map((member) => (
              <CarouselItem key={member._id} className="basis-full lg:basis-1/2 2xl:basis-1/3">
                <motion.div initial={{ opacity: 0.92, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
                  <Link href="/departman-ekipleri" className="team-card-gallery block">
                    <Card className="overflow-hidden border border-white/10 bg-zinc-950/70 text-white shadow-[0_24px_70px_rgba(0,0,0,0.45)] backdrop-blur-xl">
                      <div className="relative aspect-[4/5] overflow-hidden">
                        <img src={member.image} alt={member.name} className="h-full w-full object-cover" />
                        <div className="team-overlay absolute inset-0" />
                        <div className="team-card-badge">{member.role}</div>
                      </div>
                      <CardContent className="flex flex-col gap-4 p-5">
                        <div className="team-card-copy">
                          <h3 className="font-[family-name:var(--font-smooch)] text-3xl font-normal tracking-[0.08em]">{member.name}</h3>
                          <p className="font-[family-name:var(--font-smooch)] text-sm uppercase tracking-[0.28em] text-white/70">{member.role}</p>
                          {member.bio && <p className="team-bio-mini">{member.bio}</p>}
                        </div>
                        <Separator className="bg-white/10" />
                        <div className="team-card-footer flex items-center justify-between">
                          <div className="team-socials flex gap-3">
                            {member.socials?.linkedin && (
                              <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">
                                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>link</span>
                              </a>
                            )}
                            {member.socials?.instagram && (
                              <a href={member.socials.instagram} target="_blank" rel="noopener noreferrer" className="social-link">
                                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>photo_camera</span>
                              </a>
                            )}
                          </div>
                          <span className="material-symbols-outlined">arrow_outward</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="mt-4 flex items-center justify-between px-2">
          <span className="font-[family-name:var(--font-smooch)] text-[0.78rem] uppercase tracking-[0.4em] text-white/60">
            {String(activeMemberIndex + 1).padStart(2, "0")} / {String(filteredTeam.length).padStart(2, "0")}
          </span>
          <span className="font-[family-name:var(--font-smooch)] text-[0.68rem] uppercase tracking-[0.32em] text-white/45">
            Otomatik 06 sn
          </span>
        </div>
      </div>
    </main>
  );
}
