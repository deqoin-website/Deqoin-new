"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { uygulamaBirimleri } from "../../../data/uygulama-birimleri";
import { useState, useRef, useEffect } from "react";
import ConsultationModal from "../../../components/ConsultationModal";

export default function UygulamaBirimiPage({ params }: { params: { slug: string } }) {
  const unit = uygulamaBirimleri.find((u) => u.slug === params.slug);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

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

  if (!unit) {
    notFound();
  }

  return (
    <main className="site-shell project-detail-shell" style={{ background: "#0a0a0a" }}>
      {/* HERO */}
      <section className="mimari-hero">
        <div className="mimari-hero-bg" ref={heroRef}>
          <img src={unit.image} alt={unit.title} />
        </div>
        <div className="mimari-hero-overlay" />
        <div className="mimari-hero-content">
          <span className="mimari-hero-tag">
            EXECUTION STUDIO — <span style={{ fontSize: "1.35rem", opacity: 0.9, fontWeight: 400 }}>UYGULAMA HİZMETLERİ</span>
          </span>
          <h1 className="mimari-hero-title">{unit.title.toUpperCase()}</h1>
          <p className="mimari-hero-sub">
            Mimari Vizyonu Gerçeğe Dönüştüren Teknik Kadro.
          </p>
          <div className="mimari-hero-actions">
            <button type="button" className="hero-cta" onClick={() => setIsConsultationOpen(true)}>
              <span className="hero-cta-text">RANDEVU TALEP EDİNİZ</span>
              <div className="hero-cta-circle">
                <span className="material-symbols-outlined">arrow_right_alt</span>
              </div>
            </button>
          </div>
        </div>
        <div className="mimari-hero-scroll-hint">
          <span className="vertical-text">Detayları Gör</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* MANİFESTO SECTION */}
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
                  {paragraph}
                </p>
              ))}
            </div>
            
            <div style={{ marginTop: "4rem" }}>
               <button type="button" className="hero-cta" onClick={() => setIsConsultationOpen(true)}>
                <span className="hero-cta-text">RANDEVU TALEP EDİNİZ</span>
                <div className="hero-cta-circle">
                  <span className="material-symbols-outlined">arrow_right_alt</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="mimari-cta-banner">
        <div className="mimari-cta-bg">
          <img src={unit.image} alt="CTA" />
        </div>
        <div className="mimari-cta-overlay" />
        <div className="mimari-cta-content">
          <span className="section-small-label" style={{ color: "#cca883" }}>UYGULAMA SÜRECİ</span>
          <h2 className="mimari-cta-title">Kusursuz Bir Şantiye Deneyimi</h2>
          <p className="mimari-cta-sub">
            Mimari vizyonunuzu milimetrik hassasiyetle hayata geçirmek için randevu oluşturun.
          </p>
          <button type="button" className="hero-cta" onClick={() => setIsConsultationOpen(true)}>
            <span className="hero-cta-text">RANDEVU OLUŞTUR</span>
            <div className="hero-cta-circle">
              <span className="material-symbols-outlined">calendar_today</span>
            </div>
          </button>
        </div>
      </section>

      {/* BACK TO APP */}
      <section style={{ padding: "4rem 2rem", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
         <Link href="/uygulama" className="mimari-ghost-btn" style={{ margin: "0 auto" }}>
            <span className="material-symbols-outlined" style={{ marginRight: "1rem", transform: "rotate(180deg)" }}>arrow_right_alt</span>
            <span>Execution Studio Ana Sayfası</span>
          </Link>
      </section>

      <ConsultationModal 
        isOpen={isConsultationOpen} 
        onClose={() => setIsConsultationOpen(false)} 
      />
    </main>
  );
}
