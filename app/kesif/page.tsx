"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ConsultationModal from "../../components/ConsultationModal";
import SwipeAppointmentButton from "../../components/SwipeAppointmentButton";

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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="site-shell project-detail-shell">
      {/* ── HERO ── */}
      <section className="mimari-page-hero">
        <div className="mimari-hero-slider">
          {heroSlides.map((img, idx) => (
            <div 
              key={idx} 
              className={`mimari-hero-slide ${idx === currentSlide ? 'active' : ''}`}
              style={{
                backgroundImage: `url(${img})`,
                filter: `blur(2px)`,
              }}
            />
          ))}
        </div>
        
        <div className="mimari-hero-blur-overlay" />
        <div className="mimari-hero-dark-overlay" style={{ background: `rgba(8, 8, 8, 0.4)` }} />

        <div className="mimari-hero-content-centric">
          <span className="section-small-label" style={{ color: "#cca883", marginBottom: "1rem", display: "block" }}>
            DISCOVERY PHASE
          </span>
          <h1 className="mimari-hero-title-main">KEŞİF VE ANALİZ</h1>
          <p className="mimari-hero-sub-main">
            DOĞRU TASARIM, DOĞRU SORULARLA BAŞLAR. SÜRECİN TEMELİNİ SAĞLAM VERİLERLE KURGULUYORUZ.
          </p>
          <div className="mimari-hero-line" />
        </div>
      </section>

      {/* ── STAGES ── */}
      <section className="services-section" style={{ background: "transparent", paddingTop: "6rem" }}>
        <div className="services-grid">
          {kesifStages.map((stage) => (
            <div key={stage.title} className="service-card">
              <img src={stage.image} alt={stage.title} />
              <div className="service-overlay" style={{ background: `rgba(0,0,0,0.3)` }} />
              <div className="service-copy">
                <div>
                  <h3>{stage.title}</h3>
                  <div className="service-line" />
                  <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.7)", marginTop: "1rem", maxWidth: "300px" }}>
                    {stage.detail}
                  </p>
                </div>
                <span className="vertical-text">{stage.sideLabel}</span>
              </div>
            </div>
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
