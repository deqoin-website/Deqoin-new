"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { mimariServices } from "../../../data/mimari-hizmetler";
import ConsultationModal from "../../../components/ConsultationModal";
import { useState } from "react";

type ServiceParams = {
  slug: string;
};

export default function MimariDetail({ params }: { params: Promise<ServiceParams> }) {
  const resolvedParams = use(params);
  const service = mimariServices.find((s) => s.slug === resolvedParams.slug);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  if (!service) return notFound();

  return (
    <main className="site-shell project-detail-shell">
      {/* ── STICKY TOPBAR ── */}
      <header className="detail-topbar-premium">
        <div className="topbar-inner">
          <Link href="/mimari" className="back-button-mini">
            <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>arrow_back</span>
            <span className="back-bt-text">Bölüm Listesi</span>
          </Link>
          <button 
            type="button" 
            className="premium-nav-cta"
            onClick={() => setIsConsultationOpen(true)}
          >
            RANDEVU TALEP EDİNİZ
          </button>
        </div>
      </header>

      {/* ── HERO SECTION ── */}
      <section className="project-detail-hero-premium">
        <div className="hero-bg" style={{ backgroundImage: `url(${service.image})` }}>
          <div className="hero-overlay-dark-v2" />
        </div>
        <div className="hero-title-wrapper-v2">
          <span className="section-small-label label-accent">{service.sideLabel}</span>
          <h1 className="project-title-large">{service.title}</h1>
          <div className="title-divider-line" />
          <button 
            type="button" 
            className="hero-cta cta-centered" 
            onClick={() => setIsConsultationOpen(true)}
          >
            <span className="hero-cta-text">RANDEVU TALEP EDİNİZ</span>
            <div className="hero-cta-circle">
              <span className="material-symbols-outlined">arrow_right_alt</span>
            </div>
          </button>
        </div>
      </section>

      <div className="project-detail-content-v2">
        {/* ── DESCRIPTION BLOCK ── */}
        <section className="desc-section-grid">
          <div className="desc-heading-side">
            <span className="section-small-label label-muted">HİZMET FELSEFESİ</span>
            <h2 className="desc-title-v2">Vizyoner Yaklaşım, Kusursuz Detaylar.</h2>
          </div>
          <div className="desc-content-side">
            {service.description.split('\n\n').map((para, i) => (
              <p key={i} className="desc-para-v2">
                {para}
              </p>
            ))}
          </div>
        </section>

        {/* ── FOCUS AREAS ── */}
        <section className="focus-areas-section-v2">
          <div className="section-header-centered">
            <span className="section-small-label centered-label">UZMANLIK ODAKLARI</span>
            <h2 className="section-title-large">Neleri Dönüştürüyoruz?</h2>
          </div>
          
          <div className="focus-areas-grid-v2">
            {service.focusAreas.map((area, idx) => (
              <div key={area.title} className="glass-card-v2">
                <span className="material-symbols-outlined icon-v2">{area.icon}</span>
                <h4 className="area-title-v2">{area.title}</h4>
                <p className="area-desc-v2">{area.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── PROCESS SECTION ── */}
        <section className="process-section-v2">
          <div className="process-header-row">
            <div>
              <span className="section-small-label">ÇALIŞMA DİSİPLİNİ</span>
              <h2 className="section-title-large">Tasarım Süreci</h2>
            </div>
            <div className="process-counter-v2">
              <span className="display-number">01—04</span>
            </div>
          </div>

          <div className="process-steps-grid-v2">
            {service.process.map((step, idx) => (
              <div key={step.title} className="process-step-v2">
                <div className="step-connector">
                  <span className="step-number-v2">{idx + 1}</span>
                  <div className="connector-line" />
                </div>
                <h5 className="step-title-v2">{step.title}</h5>
                <p className="step-desc-v2">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="final-cta-section-v2">
          <div className="final-cta-bg" style={{ backgroundImage: `url(${service.image})` }} />
          <div className="final-cta-content">
            <span className="section-small-label label-accent">BİR SONRAKİ ADIM</span>
            <h2 className="final-cta-heading">Hayalinizdeki Mimariyi<br />Gerçeğe Dönüştürelim.</h2>
            <button 
              type="button" 
              className="hero-cta cta-centered" 
              onClick={() => setIsConsultationOpen(true)}
            >
              <span className="hero-cta-text">RANDEVU TALEP EDİNİZ</span>
              <div className="hero-cta-circle">
                <span className="material-symbols-outlined">arrow_right_alt</span>
              </div>
            </button>
          </div>
        </section>
      </div>

      <ConsultationModal 
        isOpen={isConsultationOpen} 
        onClose={() => setIsConsultationOpen(false)} 
      />

      <style jsx>{`
        /* ── GLOBAL LAYOUT ── */
        .project-detail-shell {
          background-color: #0a0a0a;
          color: #fff;
        }

        /* ── TOPBAR ── */
        .detail-topbar-premium {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          padding: 1.5rem 2rem;
          background: rgba(10, 10, 10, 0.5);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .topbar-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
        }
        .back-button-mini {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: rgba(255,255,255,0.6);
          text-decoration: none;
          transition: color 0.3s;
        }
        .back-bt-text {
          font-size: 0.75rem;
          letter-spacing: 0.2em;
          font-weight: 500;
          text-transform: uppercase;
        }
        .premium-nav-cta {
          background: var(--accent-color);
          color: #000;
          border: none;
          padding: 0.6rem 1.2rem;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          border-radius: 2px;
          cursor: pointer;
          transition: transform 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
        }
        .premium-nav-cta:hover { transform: scale(0.96); }

        /* ── HERO ── */
        .project-detail-hero-premium {
          position: relative;
          height: 85vh;
          min-height: 600px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .hero-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          z-index: 0;
        }
        .hero-overlay-dark-v2 {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(10,10,10,0.4), rgba(10,10,10,1));
          z-index: 1;
        }
        .hero-title-wrapper-v2 {
          position: relative;
          z-index: 10;
          text-align: center;
          width: 100%;
          padding: 0 1.5rem;
          margin-top: 5rem;
        }
        .project-title-large {
          font-size: clamp(3.5rem, 10vw, 7rem);
          line-height: 0.9;
          letter-spacing: -0.02em;
          margin-bottom: 2rem;
          text-transform: uppercase;
        }
        .title-divider-line {
          width: 40px;
          height: 1px;
          background: rgba(255,255,255,0.3);
          margin: 0 auto 2.5rem;
        }
        .cta-centered { margin: 0 auto; }

        /* ── CONTENT ── */
        .project-detail-content-v2 {
          padding-top: 8rem;
          width: 100%;
        }
        .desc-section-grid {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 2rem;
        }
        .desc-heading-side { grid-column: 1 / span 4; }
        .desc-content-side { grid-column: 6 / span 7; }
        .desc-title-v2 {
          font-size: 2.5rem;
          line-height: 1.1;
          font-weight: 300;
          margin-top: 1.5rem;
        }
        .desc-para-v2 {
          margin-bottom: 2rem;
          font-size: 1.25rem;
          line-height: 1.7;
          color: rgba(255,255,255,0.8);
          font-weight: 300;
        }

        /* ── FOCUS AREAS ── */
        .focus-areas-section-v2 {
          background: rgba(255,255,255,0.02);
          padding: 10rem 2rem;
          margin-top: 8rem;
        }
        .section-header-centered {
          max-width: 1400px;
          margin: 0 auto 6rem;
          text-align: center;
        }
        .section-title-large {
          font-size: clamp(2.5rem, 5vw, 4rem);
          margin-top: 1.5rem;
        }
        .focus-areas-grid-v2 {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        .glass-card-v2 {
          padding: 4rem 3rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 4px;
          transition: all 0.4s ease;
        }
        .glass-card-v2:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.12);
          transform: translateY(-10px);
        }
        .icon-v2 { font-size: 3rem; color: var(--accent-color); margin-bottom: 2rem; display: block; }
        .area-title-v2 { font-size: 1.4rem; font-weight: 500; margin-bottom: 1rem; }
        .area-desc-v2 { font-size: 0.95rem; line-height: 1.6; color: rgba(255,255,255,0.5); }

        /* ── PROCESS ── */
        .process-section-v2 {
          padding: 10rem 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }
        .process-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 8rem;
        }
        .display-number {
          font-size: 5rem;
          font-weight: 100;
          font-family: var(--font-display);
          opacity: 0.3;
        }
        .process-steps-grid-v2 {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 3rem;
        }
        .process-step-v2 { position: relative; }
        .step-connector { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
        .step-number-v2 {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--accent-color);
          border: 1px solid var(--accent-color);
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .connector-line { flex: 1; height: 1px; background: rgba(255,255,255,0.1); }
        .step-title-v2 { font-size: 1.2rem; font-weight: 500; margin-bottom: 0.75rem; }
        .step-desc-v2 { font-size: 0.9rem; line-height: 1.6; color: rgba(255,255,255,0.4); }

        /* ── FINAL CTA ── */
        .final-cta-section-v2 {
          padding: 12rem 2rem;
          position: relative;
          overflow: hidden;
          text-align: center;
        }
        .final-cta-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          filter: brightness(0.3) grayscale(0.5);
          z-index: -1;
        }
        .final-cta-heading {
          font-size: clamp(2.5rem, 6vw, 5rem);
          line-height: 1;
          margin: 2rem 0 3rem;
        }

        .label-accent { color: var(--accent-color); margin-bottom: 1.5rem; display: block; }
        .label-muted { opacity: 0.4; }

        /* ── RESPONSIVE ── */
        @media (max-width: 1024px) {
          .desc-section-grid {
            grid-template-columns: 1fr;
          }
          .desc-heading-side, .desc-content-side {
            grid-column: 1 / -1;
          }
          .focus-areas-grid-v2 {
            grid-template-columns: repeat(2, 1fr);
          }
          .process-steps-grid-v2 {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .detail-topbar-premium {
            padding: 1rem 1.5rem;
          }
          .back-bt-text { display: none; }
          .project-detail-hero-premium { height: 75vh; }
          .project-title-large { font-size: 4rem; }
          .project-detail-content-v2 { padding-top: 5rem; }
          .desc-title-v2 { font-size: 2rem; }
          .desc-para-v2 { font-size: 1.1rem; }
          .focus-areas-section-v2 { padding: 6rem 1.5rem; }
          .focus-areas-grid-v2 { grid-template-columns: 1fr; }
          .process-section-v2 { padding: 6rem 1.5rem; }
          .process-header-row { flex-direction: column; align-items: flex-start; gap: 2rem; margin-bottom: 4rem; }
          .process-steps-grid-v2 { grid-template-columns: 1fr; gap: 4rem; }
          .final-cta-section-v2 { padding: 8rem 1.5rem; }
          .final-cta-heading { font-size: 3rem; }
        }
      `}</style>
    </main>
  );
}
