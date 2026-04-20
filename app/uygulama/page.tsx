"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import ConsultationModal from "../../components/ConsultationModal";
import { Loader2 } from "lucide-react";
import SwipeAppointmentButton from "../../components/SwipeAppointmentButton";
import { uygulamaBirimleri } from "../../data/uygulama-birimleri";
import HeroSlider from "../../components/HeroSlider";
import WorkflowMarquee from "../../components/WorkflowMarquee";
import { useWorkflowContent } from "../../components/useWorkflowContent";

const executionCategories = uygulamaBirimleri.filter((item) =>
  [
    "insaat-ekipleri",
    "siva-ve-alci-ekipleri",
    "boya-ekipleri",
    "duvar-sanatcilari",
    "ressamlar",
    "heykeltiraslar",
  ].includes(item.slug)
);

export default function UygulamaPage() {
  const [content, setContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { workflow } = useWorkflowContent();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`/api/content?page=execution&ts=${Date.now()}`, { cache: 'no-store' });
        const data = await res.json();
        if (data && data.sections) {
          setContent(data);
        }
      } catch (err) {
        console.error("Failed to fetch execution content:", err);
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
        heroRef.current.style.transform = `translateY(${scrolled * 0.4}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="site-shell" style={{ height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="animate-spin" size={48} color="#a68966" />
      </div>
    );
  }

  const heroSection = content?.sections?.find((s: any) => s.id === 'hero');
  const heroBlur = 2;
  const heroOverlay = 30;
  const ctaSection = content?.sections?.find((s: any) => s.id === 'cta');
  const ctaBlur = 2;
  const ctaOverlay = 30;
  return (
    <main className="site-shell project-detail-shell material-studio-page" style={{ background: "#0a0a0a" }}>

      {/* HERO */}
      <HeroSlider 
        slides={(heroSection?.slides?.length > 0 ? heroSection.slides : [executionCategories[0]?.image]).map((img: string) => ({
          title: heroSection?.title || "EXECUTION STUDIO",
          motto: "UYGULAMA",
          image: img,
          blur: heroBlur,
          overlay: heroOverlay
        }))} 
        onAppointmentClick={() => setIsConsultationOpen(true)}
        showScrollHint={true}
      />

      {/* WORKFLOW SECTION */}
      <WorkflowMarquee steps={workflow.steps} title={workflow.title} />

      {/* MANİFESTO */}


      <section className="services-section material-studio-collection" style={{ background: "transparent", paddingTop: "0" }}>
        <div className="material-studio-collection-shell material-studio-collection-inner" style={{ paddingTop: "0" }}>
          <div className="section-heading projects-heading">
            <div>
              <span className="section-small-label" style={{ color: "#cca883", marginBottom: "1rem", display: "block" }}>EXECUTION TEAMS</span>
              <h2 style={{ marginBottom: "0.5rem", textTransform: "uppercase", color: "#fff" }}>UYGULAMA KOLEKSİYONU</h2>
              <p style={{ maxWidth: "42rem", color: "rgba(255,255,255,0.6)", lineHeight: "1.8", margin: "0 0 1.5rem" }}>
                Teknik disiplin ile sanatsal uygulamayı aynı sahada buluşturan uzman ekiplerimizi, kendi sayfalarında detaylı biçimde inceleyin.
              </p>
              <div className="section-line" />
            </div>
          </div>

          <div className="services-grid material-studio-grid" style={{ gridAutoRows: "72vh" }}>
            {executionCategories.map((card) => (
              <Link
                key={card.slug}
                href={`/uygulama/${card.slug}`}
                className="service-card"
                style={{ minHeight: "72vh" }}
              >
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

      {/* CTA BANNER */}
      <section className="mimari-cta-banner">
        <div className="mimari-cta-bg">
          <img
            src={ctaSection?.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuDbQTBOayjmIt4JzHbORA9-NQOes7Uaoo4WrcuGAAwzEXJzUo0V4OeCDNGGyxzFDBzG1_DbgXDr5aROetwtqZ4iPhEiaV39HyWZ67_PbpZY6a2KYJHEC2_-3JaDiLZ_71qMkfLsbA991AHjCOdDh70fnYJ3lWy-tXN7nbh5DnUk-PZt4xV5nniOugFFMI4ACHWAkPu85H_YU43TPpuqCiveXM-RLOTvgub4LA47ECVZBRKJhuyDW83lyXynnNyLY1ieUH6-gh23YZs"}
            alt="CTA"
            style={{ filter: `blur(${ctaBlur}px)` }}
          />
        </div>
        <div className="mimari-cta-overlay" style={{ background: `rgba(0,0,0,${ctaOverlay / 100})` }} />
        <div className="mimari-cta-content">
          <span className="section-small-label" style={{ color: "#cca883" }}>BİR SONRAKI ADIM</span>
          <h2 className="mimari-cta-title">Kusursuz Uygulama İçin Başlayalım</h2>
          <p className="mimari-cta-sub">
            İnşaat, yüzey, boya ve sanatsal ekipleri tek çatı altında kurgulayıp projenizi kontrollü biçimde hayata geçirelim.
          </p>
          <SwipeAppointmentButton onActivate={() => setIsConsultationOpen(true)} />
        </div>
      </section>

      {/* DİĞER HİZMETLER */}
      <section className="mimari-other-services">
        <div className="mimari-section-inner">
          <span className="section-small-label">DİĞER HİZMETLERİMİZ</span>
          <div className="mimari-other-grid">
            <Link href="/mimari" className="mimari-other-card">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbQTBOayjmIt4JzHbORA9-NQOes7Uaoo4WrcuGAAwzEXJzUo0V4OeCDNGGyxzFDBzG1_DbgXDr5aROetwtqZ4iPhEiaV39HyWZ67_PbpZY6a2KYJHEC2_-3JaDiLZ_71qMkfLsbA991AHjCOdDh70fnYJ3lWy-tXN7nbh5DnUk-PZt4xV5nniOugFFMI4ACHWAkPu85H_YU43TPpuqCiveXM-RLOTvgub4LA47ECVZBRKJhuyDW83lyXynnNyLY1ieUH6-gh23YZs" alt="Mimari" />
              <div className="mimari-other-overlay" />
              <div className="mimari-other-copy">
                <h3>Design Studio</h3>
                <span className="vertical-text">Structural Integrity</span>
              </div>
            </Link>
            <Link href="/materyal-studyo" className="mimari-other-card">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVUCHLvB4gqKIu87ZlNcr3oZLDY1XgwMEMQcp-pzAUlFS1Nn-nmjan1oheeXLiJ94VJmZA_oBfMSPF7jZZuVG47cEkP7h1goKj5Y9WgqVshN-x4CHN0Cdm1zFfAK5KszWNO6pl8w1-gfW6Wb3njqQOsjkQ8-pCuF6dDd8ggmvjFL-N9m4Fe4Lj-pi8WbEEAKONv-Sz-Yl9wNOSPvazMnMZ5Gjdm2myTHVi_vIL4aoeENqkME8bn_RKrHn4r6XvpVXXxsRugi5gKPU" alt="Malzeme" />
              <div className="mimari-other-overlay" />
              <div className="mimari-other-copy">
                <h3>Material Studio</h3>
                <span className="vertical-text">Aesthetic Soul</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <ConsultationModal 
        isOpen={isConsultationOpen} 
        onClose={() => setIsConsultationOpen(false)} 
      />
    </main>
  );
}
