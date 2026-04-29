"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ConsultationModal from "../../components/ConsultationModal";
import HeroSlider from "../../components/HeroSlider";
import Footer from "../../components/Footer";
import WorkflowSection from "../../components/WorkflowSection";
import NextStepCarouselSection from "../../components/NextStepCarouselSection";
import StudioVerticalCard from "../../components/StudioVerticalCard";

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
    image: "/images/workflow/peyzaj-custom.png",
    blur: 0,
    overlay: 30,
    slug: "peyzaj-mimarligi"
  },
];

const categoryFallbackByTitle: Record<string, string> = {
  muhendislik: "/images/workflow/muhendislik-custom.png",
  mimarlik: "/images/workflow/mimarlik-custom.png",
  mekanik: "/images/workflow/mekanik-custom.png",
  icmimarlik: "/images/workflow/ic-mimarlik-custom.png",
  restorasyon: "/images/workflow/restorasyon-custom.png",
  peyzaj: "/images/workflow/peyzaj-custom.png",
};

function normalizeTitle(value?: string) {
  return (value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z]/g, "");
}

function resolveCategoryImage(card: any) {
  const normalizedTitle = normalizeTitle(card?.title);
  return card?.image || categoryFallbackByTitle[normalizedTitle] || "/images/workflow/mimarlik-custom.png";
}

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
            setCategories(cats.items.map((item: any) => ({
              ...item,
              image: resolveCategoryImage(item),
            })));
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
    <main className="site-shell project-detail-shell mimari-vertical-shell mimari-page studio-snap-shell">
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
        className="snap-section snap-start w-full min-h-screen flex flex-col justify-center relative"
      />

      <WorkflowSection className="snap-section snap-start w-full min-h-screen flex flex-col justify-center relative" />

      <section className="services-section snap-section snap-start w-full min-h-screen flex flex-col justify-center relative gallery-snap-point" style={{ background: "transparent", paddingTop: "6rem", minHeight: "100svh" }}>
        
        <div className="services-grid mimari-grid">
          {categories.map((card) => (
            <StudioVerticalCard
              key={card.title}
              href={card.href || `/mimari/${card.slug}`}
              image={withVersion(resolveCategoryImage(card), contentVersion)}
              title={card.title.toUpperCase()}
              sideLabel={card.sideLabel}
              blur={card.blur || 0}
              overlay={card.overlay ?? 30}
            />
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <NextStepCarouselSection
        currentStudio="mimari"
        className="snap-section snap-start w-full min-h-screen flex flex-col justify-center items-center relative px-4 md:px-8 bg-[#080808] text-white border-t border-white/8"
      />

      <ConsultationModal 
        isOpen={isConsultationOpen} 
        onClose={() => setIsConsultationOpen(false)} 
      />

      <section className="snap-section snap-start w-full min-h-screen flex flex-col justify-center relative gallery-snap-point" style={{ minHeight: "100svh" }}>
        <Footer />
      </section>
    </main>
  );
}
