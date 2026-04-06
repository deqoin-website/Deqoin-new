"use client";

import { useState } from "react";
import Link from "next/link";
import ConsultationModal from "../../components/ConsultationModal";

const mimariSubCategories = [
  {
    href: "/mimari/mimarlik",
    title: "Mimarlık",
    sideLabel: "Structural Form",
    image: "/images/slider/mimari_slide.png",
  },
  {
    href: "/mimari/ic-mimarlik",
    title: "İç Mimarlık",
    sideLabel: "Interior Essence",
    image: "/images/about_interior.png",
  },
  {
    href: "/mimari/restorasyon",
    title: "Restorasyon Mimarlığı",
    sideLabel: "Heritage Revival",
    image: "/images/projects/gallery_1.png",
  },
  {
    href: "/mimari/peyzaj-mimarligi",
    title: "Peyzaj Mimarlığı",
    sideLabel: "Natural Canvas",
    image: "/images/projects/gallery_2.png",
  },
  {
    href: "/mimari/insaat-muhendisligi",
    title: "İnşaat Mühendisliği",
    sideLabel: "Structural Strength",
    image: "/images/projects/gallery_1.png",
  },
  {
    href: "/mimari/elektrik-elektronik-muhendisligi",
    title: "Elektrik ve Elektronik Mühendisliği",
    sideLabel: "Power & Logic",
    image: "/images/projects/gallery_2.png",
  },
  {
    href: "/mimari/plan-proje",
    title: "Plan ve Proje",
    sideLabel: "Detail & Vision",
    image: "/images/slider/mimari_slide.png",
  },
];

export default function MimariPage() {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  return (
    <main className="site-shell project-detail-shell" style={{ paddingTop: "12rem" }}>
      <section className="services-section" style={{ background: "transparent" }}>
        <div style={{ padding: "0 2rem", marginBottom: "8rem", textAlign: "center" }}>
          <h1 style={{ fontFamily: "var(--font-smooch), sans-serif", fontSize: "clamp(5rem, 15vw, 10rem)", fontWeight: 100, color: "#fff", letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>DESIGN STUDIO</h1>
          <p style={{ fontFamily: "var(--font-display), sans-serif", fontSize: "1.4rem", letterSpacing: "0.5em", fontWeight: 300, color: "rgba(255,255,255,0.8)", textTransform: "uppercase", marginTop: "1rem" }}>
            MİMARİ TASARIM
          </p>
        </div>
        
        <div className="services-grid">
          {mimariSubCategories.map((card) => (
            <Link key={card.title} href={card.href} className="service-card">
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
      </section>

      {/* CTA BANNER */}
      <section className="mimari-cta-banner">
        <div className="mimari-cta-bg">
          <img src="/images/slider/mimari_slide.png" alt="CTA" />
        </div>
        <div className="mimari-cta-overlay" />
        <div className="mimari-cta-content">
          <span className="section-small-label" style={{ color: "#cca883" }}>BİR SONRAKI ADIM</span>
          <h2 className="mimari-cta-title">Mimari Vizyonunuzu Gerçeğe Dönüştürelim</h2>
          <p className="mimari-cta-sub">
            Hayalinizdeki projeyi uzman ekibimizle planlamak için ücretsiz danışmanlık randevusu alın.
          </p>
          <button type="button" className="hero-cta" onClick={() => setIsConsultationOpen(true)}>
            <span className="hero-cta-text">ÜCRETSİZ DANIŞMANLIK AL</span>
            <div className="hero-cta-circle">
              <span className="material-symbols-outlined">arrow_right_alt</span>
            </div>
          </button>
        </div>
      </section>

      <ConsultationModal 
        isOpen={isConsultationOpen} 
        onClose={() => setIsConsultationOpen(false)} 
      />
    </main>
  );
}
