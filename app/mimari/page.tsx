"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ConsultationModal from "../../components/ConsultationModal";
import SwipeAppointmentButton from "../../components/SwipeAppointmentButton";

const heroSlides = [
  "/images/slider/mimari_slide.png",
  "/images/projects/gallery_1.png",
  "/images/slider/tasarim_slide.png",
  "/images/projects/gallery_2.png",
  "/images/slider/uygulama_slide.png",
];

const mimariSubCategories = [
  {
    href: "/mimari/insaat-muhendisligi",
    title: "Mühendislik",
    sideLabel: "Structural Strength",
    image: "/images/projects/gallery_1.png",
    blur: 0,
    overlay: 30,
    slug: "insaat-muhendisligi"
  },
  {
    href: "/mimari/mimarlik",
    title: "Mimarlık",
    sideLabel: "Structural Form",
    image: "/images/slider/mimari_slide.png",
    blur: 0,
    overlay: 30,
    slug: "mimarlik"
  },
  {
    href: "/mimari/elektrik-elektronik-muhendisligi",
    title: "Mekanik",
    sideLabel: "Power & Logic",
    image: "/images/projects/gallery_2.png",
    blur: 0,
    overlay: 30,
    slug: "elektrik-elektronik-muhendisligi"
  },
  {
    href: "/mimari/ic-mimarlik",
    title: "İç Mimarlık",
    sideLabel: "Interior Essence",
    image: "/images/about_interior.png",
    blur: 0,
    overlay: 30,
    slug: "ic-mimarlik"
  },
  {
    href: "/mimari/restorasyon",
    title: "Restorasyon",
    sideLabel: "Heritage Revival",
    image: "/images/projects/gallery_1.png",
    blur: 0,
    overlay: 30,
    slug: "restorasyon"
  },
  {
    href: "/mimari/peyzaj-mimarligi",
    title: "Peyzaj",
    sideLabel: "Natural Canvas",
    image: "/images/projects/gallery_2.png",
    blur: 0,
    overlay: 30,
    slug: "peyzaj-mimarligi"
  },
];

export default function MimariPage() {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState(heroSlides);
  const [categories, setCategories] = useState(mimariSubCategories);
  const [pageInfo, setPageInfo] = useState({ title: 'DESIGN STUDIO', subtitle: 'MİMARİ TASARIMIN GELECEĞİNİ ŞEKİLLENDİRİYORUZ' });
  const [heroVisual, setHeroVisual] = useState({ blur: 0, overlay: 30 });
  const [ctaSection, setCtaSection] = useState({
    image: '/images/slider/mimari_slide.png',
    blur: 0,
    overlay: 30,
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch('/api/content?page=mimari');
        const data = await res.json();
        if (data.sections) {
          const hero = data.sections.find((s: any) => s.id === 'hero');
          const cats = data.sections.find((s: any) => s.id === 'categories');
          
          if (hero) {
            if (hero.slides?.length > 0) setSlides(hero.slides);
            setPageInfo({ title: hero.title, subtitle: hero.subtitle });
            setHeroVisual({
              blur: hero.blur ?? 0,
              overlay: hero.overlay ?? 30,
            });
          }
          if (cats?.items?.length > 0) {
            setCategories(cats.items);
          }
          const cta = data.sections.find((s: any) => s.id === 'cta');
          if (cta) {
            setCtaSection({
              image: cta.image || '/images/slider/mimari_slide.png',
              blur: cta.blur ?? 0,
              overlay: cta.overlay ?? 30,
            });
          }
        }
      } catch (err) {
        console.error("Failed to fetch mimari content:", err);
      }
    };
    fetchContent();

    const timer = setInterval(() => {
      setSlides(current => {
        setCurrentSlide((prev) => (prev + 1) % current.length);
        return current;
      });
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="site-shell project-detail-shell">
      {/* ── DYNAMIC BLURRED HERO ── */}
      <section className="mimari-page-hero">
        <div className="mimari-hero-slider">
          {slides.map((img: string, idx: number) => (
            <div 
              key={idx} 
              className={`mimari-hero-slide ${idx === currentSlide ? 'active' : ''}`}
              style={{
                backgroundImage: `url(${img})`,
                filter: `blur(${heroVisual.blur}px)`,
              }}
            />
          ))}
        </div>
        
        {/* Glassmorphism Blur Overlay */}
        <div className="mimari-hero-blur-overlay" />
        <div className="mimari-hero-dark-overlay" style={{ background: `rgba(8, 8, 8, ${(heroVisual.overlay ?? 30) / 100})` }} />

        <div className="mimari-hero-content-centric">
          <span className="section-small-label" style={{ color: "#cca883", marginBottom: "1rem", display: "block" }}>
            CREATIVE VISION
          </span>
          <h1 className="mimari-hero-title-main">{pageInfo.title}</h1>
          <p className="mimari-hero-sub-main">
            {pageInfo.subtitle}
          </p>
          <div className="mimari-hero-line" />
        </div>
      </section>

      <section className="services-section" style={{ background: "transparent", paddingTop: "6rem" }}>
        
        <div className="services-grid">
          {categories.map((card) => (
            <Link key={card.title} href={card.href || `/mimari/${card.slug}`} className="service-card">
              <img src={card.image} alt={card.title} style={{ filter: `blur(${card.blur || 0}px)` }} />
              <div className="service-overlay" style={{ background: `rgba(0,0,0,${(card.overlay ?? 30) / 100})` }} />
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
          <img src={ctaSection.image} alt="CTA" style={{ filter: `blur(${ctaSection.blur ?? 0}px)` }} />
        </div>
        <div className="mimari-cta-overlay" style={{ background: `rgba(0,0,0,${(ctaSection.overlay ?? 30) / 100})` }} />
        <div className="mimari-cta-content">
          <span className="section-small-label" style={{ color: "#cca883" }}>BİR SONRAKI ADIM</span>
          <h2 className="mimari-cta-title">Mimari Vizyonunuzu Gerçeğe Dönüştürelim</h2>
          <p className="mimari-cta-sub">
            Hayalinizdeki projeyi uzman ekibimizle planlamak için profesyonel randevu oluşturun.
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
