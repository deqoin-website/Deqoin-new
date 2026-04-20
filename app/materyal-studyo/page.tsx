"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ConsultationModal from "../../components/ConsultationModal";
import { Loader2 } from "lucide-react";
import SwipeAppointmentButton from "../../components/SwipeAppointmentButton";
import HeroSlider from "../../components/HeroSlider";
import WorkflowMarquee from "../../components/WorkflowMarquee";
import { MATERIAL_WORKFLOW } from "../../data/workflows";
import { materyalKategorileri } from "../../data/materyal-studyo";

const materialCategories = materyalKategorileri.filter((item) =>
  ["mobilya", "aydinlatma", "italyan-sivalar", "sanatsal-calismalar", "tugla-ve-tas"].includes(item.slug)
);

export default function MateryalStudyo() {
  const [content, setContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`/api/content?page=material&ts=${Date.now()}`, { cache: "no-store" });
        const data = await res.json();
        if (data && data.sections) setContent(data);
      } catch (err) {
        console.error("Failed to fetch material studio content:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrolled = window.scrollY;
        heroRef.current.style.transform = `translateY(${scrolled * 0.35}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="site-shell" style={{ height: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader2 className="animate-spin" size={48} color="#a68966" />
      </div>
    );
  }

  const heroSection = content?.sections?.find((s: any) => s.id === "hero");
  const heroBlur = 2;
  const heroOverlay = 30;
  const ctaSection = content?.sections?.find((s: any) => s.id === "cta");
  const ctaBlur = 2;
  const ctaOverlay = 30;

  return (
    <main className="site-shell project-detail-shell material-studio-page" style={{ background: "#0a0a0a" }}>
      <HeroSlider 
        slides={(heroSection?.slides?.length > 0 ? heroSection.slides : [materialCategories[0]?.image]).map((img: string) => ({
          title: heroSection?.title || "MATERIAL STUDIO",
          motto: "MALZEME",
          image: img,
          blur: heroBlur,
          overlay: heroOverlay
        }))} 
        onAppointmentClick={() => setIsConsultationOpen(true)}
        showScrollHint={true}
      />

      {/* WORKFLOW SECTION */}
      <WorkflowMarquee steps={MATERIAL_WORKFLOW} />



      <section className="services-section material-studio-collection" style={{ background: "transparent", paddingTop: "0" }}>
        <div className="material-studio-collection-shell material-studio-collection-inner" style={{ paddingTop: "0" }}>
          <div className="section-heading projects-heading">
            <div>
              <span className="section-small-label" style={{ color: "#cca883", marginBottom: "1rem", display: "block" }}>CATEGORY SELECTION</span>
              <h2 style={{ marginBottom: "0.5rem", textTransform: "uppercase", color: "#fff" }}>MATERIAL COLLECTION</h2>
              <div className="section-line" />
            </div>

          </div>

          <div className="services-grid material-studio-grid">
            {materialCategories.map((card) => (
              <Link key={card.slug} href={`/materyal-studyo/${card.slug}`} className="service-card">
                <img src={card.image} alt={card.title} />
                <div className="service-overlay" />
                <div className="service-copy">
                  <div>
                    <h3>{card.title}</h3>
                    <div className="service-line" />
                    <div className="service-cta">
                      <span>DETAYLARI GÖR</span>
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </div>
                  </div>
                  <span className="vertical-text">{card.sideLabel}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mimari-cta-banner">
        <div className="mimari-cta-bg">
          <img
            src={ctaSection?.image || materialCategories[0]?.image || "https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=80&w=2048&auto=format&fit=crop"}
            alt="CTA"
            style={{ filter: `blur(${ctaBlur}px)` }}
          />
        </div>
        <div className="mimari-cta-overlay" style={{ background: `rgba(0,0,0,${ctaOverlay / 100})` }} />
        <div className="mimari-cta-content">
          <span className="section-small-label" style={{ color: "#cca883" }}>BİR SONRAKİ ADIM</span>
          <h2 className="mimari-cta-title">Materyal Seçimini Projeye Dönüştürelim</h2>
          <p className="mimari-cta-sub">
            Seçtiğiniz kategori için en doğru teknik ve estetik kombinasyonu birlikte planlayalım.
          </p>
          <SwipeAppointmentButton onActivate={() => setIsConsultationOpen(true)} />
        </div>
      </section>

      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
      />
    </main>
  );
}
