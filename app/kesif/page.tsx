"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ConsultationModal from "../../components/ConsultationModal";
import SwipeAppointmentButton from "../../components/SwipeAppointmentButton";
import HeroSlider from "../../components/HeroSlider";
import WorkflowMarquee from "../../components/WorkflowMarquee";
import { useWorkflowContent } from "../../components/useWorkflowContent";
import StudioVerticalCard from "../../components/StudioVerticalCard";

const heroSlides = [
  "/images/slider/mimari_slide.png",
  "/images/projects/gallery_1.png",
  "/images/slider/tasarim_slide.png",
];

const kesifStages = [
  {
    title: "Saha Analizi",
    sideLabel: "Site Analysis",
    image: "/images/projects/gallery_1.png",
    detail: "Projenin uygulanacağı alanın topografik, çevresel ve teknik verilerinin yerinde incelenmesi.",
    slug: "saha-analizi"
  },
  {
    title: "İhtiyaç Programı",
    sideLabel: "Client Briefing",
    image: "/images/slider/mimari_slide.png",
    detail: "Kullanıcı beklentilerinin, yaşam senaryolarının ve fonksiyonel gereksinimlerin detaylandırılması.",
    slug: "ihtiyac-programi"
  },
  {
    title: "Teknik Fizibilite",
    sideLabel: "Feasibility",
    image: "/images/projects/gallery_2.png",
    detail: "Bütçe, zaman ve yasal mevzuat çerçevesinde projenin hayata geçirilme olanaklarının değerlendirilmesi.",
    slug: "teknik-fizibilite"
  },
  {
    title: "Konsept Öncesi",
    sideLabel: "Pre-Concept",
    image: "/images/about_interior.png",
    detail: "Keşif verileri ışığında tasarımın temel rotasının ve mimari kimliğin ön çalışma olarak kurgulanması.",
    slug: "konsept-oncesi"
  }
];

export default function KesifPage() {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { workflow } = useWorkflowContent();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="site-shell project-detail-shell">
      {/* ── HERO ── */}
      <HeroSlider 
        slides={heroSlides.map(img => ({
          title: "KEŞİF VE ANALİZ",
          motto: "DISCOVERY PHASE",
          image: img,
          blur: 2,
          overlay: 40
        }))} 
        onAppointmentClick={() => setIsConsultationOpen(true)}
      />

      {/* WORKFLOW SECTION */}
      <WorkflowMarquee steps={workflow.steps} title={workflow.title} />

      {/* ── STAGES ── */}
      <section className="services-section" style={{ background: "transparent", paddingTop: "6rem" }}>
        <div className="services-grid">
          {kesifStages.map((stage) => (
            <StudioVerticalCard
              key={stage.title}
              image={stage.image}
              title={stage.title.toUpperCase()}
              sideLabel={stage.sideLabel}
              overlay={30}
            />
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="mimari-cta-banner">
        <div className="mimari-cta-bg">
          <img src="/images/slider/mimari_slide.png" alt="CTA" style={{ filter: `blur(2px)` }} />
        </div>
        <div className="mimari-cta-overlay" style={{ background: `rgba(0,0,0,0.4)` }} />
        <div className="mimari-cta-content">
          <span className="section-small-label" style={{ color: "#cca883" }}>BİR SONRAKI ADIM</span>
          <h2 className="mimari-cta-title">Sahanızı Beraber Keşfedelim</h2>
          <p className="mimari-cta-sub">
            Projenizin potansiyelini yerinde görmek ve doğru stratejiyi belirlemek için keşif randevusu oluşturun.
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
