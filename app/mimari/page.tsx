"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ConsultationModal from "../../components/ConsultationModal";
import SwipeAppointmentButton from "../../components/SwipeAppointmentButton";
import HeroSlider from "../../components/HeroSlider";
import Footer from "../../components/Footer";
import WorkflowMarquee from "../../components/WorkflowMarquee";
import { useWorkflowContent } from "../../components/useWorkflowContent";

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
    image: "/images/workflow/muhendislik-custom.png",
    blur: 0,
    overlay: 30,
    slug: "insaat-muhendisligi"
  },
  {
    href: "/mimari/mimarlik",
    title: "Mimarlık",
    sideLabel: "Structural Form",
    image: "/images/workflow/mimarlik-custom.png",
    blur: 0,
    overlay: 30,
    slug: "mimarlik"
  },
  {
    href: "/mimari/elektrik-elektronik-muhendisligi",
    title: "Mekanik",
    sideLabel: "Power & Logic",
    image: "/images/workflow/mekanik-custom.png",
    blur: 0,
    overlay: 30,
    slug: "elektrik-elektronik-muhendisligi"
  },
  {
    href: "/mimari/ic-mimarlik",
    title: "İç Mimarlık",
    sideLabel: "Interior Essence",
    image: "/images/workflow/ic-mimarlik-custom.png",
    blur: 0,
    overlay: 30,
    slug: "ic-mimarlik"
  },
  {
    href: "/mimari/restorasyon",
    title: "Restorasyon",
    sideLabel: "Heritage Revival",
    image: "/images/workflow/restorasyon-custom.png",
    blur: 0,
    overlay: 30,
    slug: "restorasyon"
  },
  {
    href: "/mimari/peyzaj-mimarligi",
    title: "Peyzaj",
    sideLabel: "Natural Canvas",
    image: "/images/workflow/mekanik-custom.png",
    blur: 0,
    overlay: 30,
    slug: "peyzaj-mimarligi"
  },
];

function withVersion(url?: string, version?: string) {
  if (!url) return "";
  if (!version) return url;
  return `${url}${url.includes("?") ? "&" : "?"}v=${encodeURIComponent(version)}`;
}

export default function MimariPage() {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState(heroSlides);
  const [categories, setCategories] = useState(mimariSubCategories);
  const [contentVersion, setContentVersion] = useState<string>("");
  const [pageInfo, setPageInfo] = useState({ title: 'DESIGN STUDIO', subtitle: 'MİMARİ TASARIMIN GELECEĞİNİ ŞEKİLLENDİRİYORUZ' });
  const [heroVisual, setHeroVisual] = useState({ blur: 2, overlay: 30 });
  const [ctaSection, setCtaSection] = useState({
    image: '/images/slider/mimari_slide.png',
    blur: 2,
    overlay: 30,
  });
  const { workflow } = useWorkflowContent();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`/api/content?page=mimari&ts=${Date.now()}`, { cache: 'no-store' });
        const data = await res.json();
        if (data?.metadata?.updatedAt) {
          setContentVersion(String(data.metadata.updatedAt));
        }
        if (data.sections) {
          const hero = data.sections.find((s: any) => s.id === 'hero');
          const cats = data.sections.find((s: any) => s.id === 'categories');
          
          if (hero) {
            if (hero.slides?.length > 0) setSlides(hero.slides);
            setPageInfo({ title: hero.title, subtitle: hero.subtitle });
            setHeroVisual({
              blur: 2,
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
              blur: 2,
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
    <main className="site-shell project-detail-shell mimari-vertical-shell">
      {/* ── DYNAMIC BLURRED HERO ── */}
      <HeroSlider 
        slides={slides.map(img => ({
          title: pageInfo.title,
          motto: "TASARIM",
          image: img,
          blur: heroVisual.blur,
          overlay: heroVisual.overlay
        }))} 
        onAppointmentClick={() => setIsConsultationOpen(true)}
        showScrollHint={true}
      />

      {/* WORKFLOW SECTION */}
      <WorkflowMarquee steps={workflow.steps} title={workflow.title} />

      <section className="services-section snap-section gallery-snap-point" style={{ background: "transparent", paddingTop: "6rem", minHeight: "100svh" }}>
        
        <div className="services-grid" style={{ gridAutoRows: "72vh" }}>
          {categories.map((card) => (
          <Link
              key={card.title}
              href={card.href || `/mimari/${card.slug}`}
              className="service-card"
              style={{ minHeight: "72vh" }}
            >
              <img src={withVersion(card.image, contentVersion)} alt={card.title} style={{ filter: `blur(${card.blur || 0}px)` }} />
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
      <section className="mimari-cta-banner snap-section gallery-snap-point" style={{ minHeight: "100svh" }}>
        <div className="mimari-cta-bg">
          <img src={withVersion(ctaSection.image, contentVersion)} alt="CTA" style={{ filter: `blur(${ctaSection.blur ?? 0}px)` }} />
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

      <section className="snap-section gallery-snap-point" style={{ minHeight: "100svh" }}>
        <Footer />
      </section>
    </main>
  );
}
