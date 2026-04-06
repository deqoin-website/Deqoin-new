"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { materyalKategorileri } from "../../../data/materyal-studyo";
import { useState, useRef, useEffect } from "react";
import ConsultationModal from "../../../components/ConsultationModal";

export default function MateryalKategoriPage({ params }: { params: { slug: string } }) {
  const category = materyalKategorileri.find((c) => c.slug === params.slug);
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

  if (!category) {
    notFound();
  }

  return (
    <main className="site-shell project-detail-shell" style={{ background: "#0a0a0a" }}>
      {/* HERO */}
      <section className="mimari-hero">
        <div className="mimari-hero-bg" ref={heroRef}>
          <img src={category.image} alt={category.title} />
        </div>
        <div className="mimari-hero-overlay" />
        <div className="mimari-hero-content">
          <span className="mimari-hero-tag">
            MATERIAL STUDIO — <span style={{ fontSize: "1.35rem", opacity: 0.9, fontWeight: 400 }}>ÜRÜN & MALZEME</span>
          </span>
          <h1 className="mimari-hero-title">{category.title.toUpperCase()}</h1>
          <p className="mimari-hero-sub">
            Mimari Vizyonu Tamamlayan Üst Segment Çözümler.
          </p>
          <div className="mimari-hero-actions">
            <button type="button" className="hero-cta" onClick={() => setIsConsultationOpen(true)}>
              <span className="hero-cta-text">RANDEVU TALEP EDİNİZ</span>
              <div className="hero-cta-circle">
                <span className="material-symbols-outlined">arrow_right_alt</span>
              </div>
            </button>
            <Link href={`/galeri?material=${category.slug}`} className="mimari-ghost-btn">
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

      {/* NO RETAIL NOTICE */}
      <div className="no-retail-notice" style={{ marginTop: "4rem", marginBottom: "0" }}>
        <div className="notice-inner">
          <span className="material-symbols-outlined">info</span>
          <p>BU ÜRÜN GRUBU YALNIZCA KENDİ PROJELERİMİZ İÇİN ENTEGRE EDİLMEKTEDİR; PERAKENDE SATIŞIMIZ YOKTUR.</p>
        </div>
      </div>

      {/* MANİFESTO SECTION */}
      <section className="mimari-manifesto">
        <div className="mimari-manifesto-inner">
          <div className="mimari-manifesto-label">
            <span className="vertical-text">{category.sideLabel}</span>
          </div>
          <div className="mimari-manifesto-body">
            <span className="section-small-label">VİZYONUMUZ</span>
            <h2 className="mimari-quote" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", lineHeight: "1.2", marginBottom: "3rem" }}>
              {category.longDescription?.title}
            </h2>
            <div className="mimari-manifesto-text">
              {category.longDescription?.content.map((paragraph, index) => (
                <p key={index} style={{ marginBottom: "2rem" }}>
                  {paragraph.split("**").map((part, i) => i % 2 === 1 ? <strong key={i} style={{ color: "#fff" }}>{part}</strong> : part)}
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

      {/* GALLERY CTA */}
      <section className="mimari-cta-banner">
        <div className="mimari-cta-bg">
          <img src={category.image} alt="CTA" />
        </div>
        <div className="mimari-cta-overlay" />
        <div className="mimari-cta-content">
          <span className="section-small-label" style={{ color: "#cca883" }}>PORTFOLYO</span>
          <h2 className="mimari-cta-title">{category.title} Uygulamalarımız</h2>
          <p className="mimari-cta-sub">
            Bu malzemenin seçkin projelerimizde nasıl hayat bulduğunu keşfetmek için galerimizi ziyaret edin.
          </p>
          <Link href={`/galeri?material=${category.slug}`} className="hero-cta">
            <span className="hero-cta-text">GALERİYİ İNCELE</span>
            <div className="hero-cta-circle">
              <span className="material-symbols-outlined">grid_view</span>
            </div>
          </Link>
        </div>
      </section>

      {/* BACK TO STUDIO */}
      <section style={{ padding: "4rem 2rem", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
         <Link href="/materyal-studyo" className="mimari-ghost-btn" style={{ margin: "0 auto" }}>
            <span className="material-symbols-outlined" style={{ marginRight: "1rem", transform: "rotate(180deg)" }}>arrow_right_alt</span>
            <span>Material Studio Ana Sayfası</span>
          </Link>
      </section>

      <ConsultationModal 
        isOpen={isConsultationOpen} 
        onClose={() => setIsConsultationOpen(false)} 
      />
    </main>
  );
}
