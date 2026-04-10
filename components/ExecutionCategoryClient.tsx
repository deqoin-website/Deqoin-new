"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ConsultationModal from "./ConsultationModal";
import MaterialProjectShowcase from "./MaterialProjectShowcase";
import { UygulamaBirimi } from "../data/uygulama-birimleri";
import { projectsData } from "../data/projects";

type ExecutionCategoryClientProps = {
  unit: UygulamaBirimi;
};

export default function ExecutionCategoryClient({ unit }: ExecutionCategoryClientProps) {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroSlides = unit.sliderImages && unit.sliderImages.length > 0 
    ? unit.sliderImages 
    : [unit.image];

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  return (
    <>
      <section className="studio-hero">
        <div className="studio-hero-slider">
          {heroSlides.map((img, idx) => (
            <div 
              key={idx} 
              className={`studio-hero-slide ${idx === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
        </div>

        <div className="studio-hero-blur-overlay" />
        <div className="studio-hero-dark-overlay" />

        <div className="studio-hero-content">
          <span className="section-small-label" style={{ color: "#cca883", marginBottom: "1rem", display: "block" }}>
            EXECUTION STUDIO — UYGULAMA HİZMETLERİ
          </span>
          <h1>{unit.title.toUpperCase()}</h1>
          <p>Mimari Vizyonu Gerçeğe Dönüştüren Teknik Kadro.</p>
          <div className="studio-hero-line" />
          
          <div className="mimari-hero-actions" style={{ justifyContent: "center", marginTop: "3rem" }}>
            <button type="button" className="hero-cta appointment-cta" onClick={() => setIsConsultationOpen(true)}>
              <span className="hero-cta-text">RANDEVU TALEP EDİNİZ</span>
              <div className="hero-cta-circle">
                <span className="material-symbols-outlined">event_available</span>
              </div>
            </button>
            <Link href={`/galeri`} className="mimari-ghost-btn">
              <span>Galeriyi İncele</span>
              <span className="material-symbols-outlined">east</span>
            </Link>
          </div>
        </div>

        <div className="mimari-hero-scroll-hint">
          <span className="vertical-text">Detayları Gör</span>
          <div className="scroll-line" />
        </div>
      </section>

      <section className="mimari-manifesto">
        <div className="mimari-manifesto-inner">
          <div className="mimari-manifesto-label">
            <span className="vertical-text">{unit.sideLabel}</span>
          </div>
          <div className="mimari-manifesto-body">
            <span className="section-small-label">BİRİM VİZYONUMUZ</span>
            <h2 className="mimari-quote" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", lineHeight: "1.2", marginBottom: "3rem" }}>
              {unit.longDescription?.title}
            </h2>
            <div className="mimari-manifesto-text">
              {unit.longDescription?.content.map((paragraph, index) => (
                <p key={index} style={{ marginBottom: "2rem" }}>
                  {paragraph.split("**").map((part, i) => (i % 2 === 1 ? <strong key={i} style={{ color: "#fff" }}>{part}</strong> : part))}
                </p>
              ))}
            </div>

            <div style={{ marginTop: "4rem" }}>
              <button type="button" className="hero-cta appointment-cta" onClick={() => setIsConsultationOpen(true)}>
                <span className="hero-cta-text">RANDEVU TALEP EDİNİZ</span>
                <div className="hero-cta-circle">
                  <span className="material-symbols-outlined">event_available</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      <MaterialProjectShowcase 
        executionUnitSlug={unit.slug} 
        materialTitle={unit.title} 
        projects={projectsData} 
        customCategories={unit.categories} 
      />

      <section style={{ padding: "4rem 2rem", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <Link href="/uygulama" className="mimari-ghost-btn" style={{ margin: "0 auto" }}>
          <span className="material-symbols-outlined" style={{ marginRight: "1rem", transform: "rotate(180deg)" }}>arrow_right_alt</span>
          <span>Execution Studio Ana Sayfası</span>
        </Link>
      </section>

      <ConsultationModal isOpen={isConsultationOpen} onClose={() => setIsConsultationOpen(false)} />
    </>
  );
}
