"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ConsultationModal from "../../components/ConsultationModal";
import { Loader2 } from "lucide-react";
import SwipeAppointmentButton from "../../components/SwipeAppointmentButton";

export default function MateryalStudyo() {
  const [content, setContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch("/api/content?page=material");
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
  const catSection = content?.sections?.find((s: any) => s.id === "categories");

  return (
    <main className="site-shell project-detail-shell" style={{ background: "#0a0a0a" }}>
      <section className="mimari-page-hero">
        <div className="mimari-hero-slider">
          <div
            className="mimari-hero-slide active"
            ref={heroRef}
            style={{
              backgroundImage: `url(${heroSection?.slides?.[0] || "https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=80&w=2048&auto=format&fit=crop"})`,
            }}
          />
        </div>
        <div className="mimari-hero-blur-overlay" />
        <div className="mimari-hero-dark-overlay" />

        <div className="mimari-hero-content-centric">
          <span className="section-small-label" style={{ color: "#cca883", marginBottom: "1rem", display: "block" }}>
            CREATIVE VISION
          </span>
          <h1 className="mimari-hero-title-main">{heroSection?.title || "MATERIAL STUDIO"}</h1>
          <p className="mimari-hero-sub-main">
            {heroSection?.subtitle || "ÜRÜN VE MALZEME"}
          </p>
          <div className="mimari-hero-line" />
          <div className="mimari-hero-actions" style={{ justifyContent: "center", marginTop: "3rem" }}>
            <SwipeAppointmentButton onActivate={() => setIsConsultationOpen(true)} />
            <Link href="/galeri?material=mobilya" className="mimari-ghost-btn">
              <span>GALERİYİ İNCELE</span>
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
            <span className="vertical-text">{heroSection?.sideLabel || "Bespoke Material World"}</span>
          </div>
          <div className="mimari-manifesto-body">
            <span className="section-small-label">VİZYONUMUZ</span>
            <h2 className="mimari-quote" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", lineHeight: "1.2", marginBottom: "3rem" }}>
              {heroSection?.title || "Material Studio"} ile hayat bulan mekanlar
            </h2>
            <div className="mimari-manifesto-text">
              {(heroSection?.content || [
                "Burada sergilenen ürün grupları yalnızca kendi projelerimiz ve özel tasarımlarımız için kullanılmaktadır.",
                "Malzeme, doku ve formu aynı mimari disiplin içinde ele alıyor; projeye uygun, seçkin yüzey ve obje kurguları oluşturuyoruz.",
                "İhtiyacınıza uygun materyal senaryosunu birlikte netleştirmek için ekibimizle iletişime geçebilirsiniz.",
              ]).map((paragraph: string, index: number) => (
                <p key={index} style={{ marginBottom: "2rem" }}>{paragraph}</p>
              ))}
            </div>

            <div style={{ marginTop: "4rem" }}>
              <SwipeAppointmentButton onActivate={() => setIsConsultationOpen(true)} />
            </div>
          </div>
        </div>
      </section>

      <section className="services-section" style={{ background: "transparent", paddingTop: "0" }}>
        <div className="services-grid">
          {(catSection?.items || []).map((card: any) => (
            <Link key={card.title} href={`/materyal-studyo/${card.slug}`} className="service-card">
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

      <section className="mimari-cta-banner">
        <div className="mimari-cta-bg">
          <img src="https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=80&w=2048&auto=format&fit=crop" alt="CTA" />
        </div>
        <div className="mimari-cta-overlay" />
        <div className="mimari-cta-content">
          <span className="section-small-label" style={{ color: "#cca883" }}>BİR SONRAKİ ADIM</span>
          <h2 className="mimari-cta-title">Projeye Özel Materyal Kurgusuna Başlayalım</h2>
          <p className="mimari-cta-sub">
            Seçkin malzeme portföyümüzü ve sanatsal yaklaşımımızı projenize taşıyalım.
          </p>
          <SwipeAppointmentButton onActivate={() => setIsConsultationOpen(true)} />
        </div>
      </section>

      <section className="mimari-other-services">
        <div className="mimari-section-inner">
          <span className="section-small-label">DİĞER HİZMETLERİMİZ</span>
          <div className="mimari-other-grid">
            <Link href="/mimari" className="mimari-other-card">
              <img src="/images/slider/mimari_slide.png" alt="Design Studio" />
              <div className="mimari-other-overlay" />
              <div className="mimari-other-copy">
                <h3>Design Studio</h3>
                <span className="vertical-text">Structural Integrity</span>
              </div>
            </Link>
            <Link href="/uygulama" className="mimari-other-card">
              <img src="/images/slider/uygulama_slide.png" alt="Execution Studio" />
              <div className="mimari-other-overlay" />
              <div className="mimari-other-copy">
                <h3>Execution Studio</h3>
                <span className="vertical-text">Precision Craft</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

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
