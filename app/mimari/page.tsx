"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ConsultationModal from "../../components/ConsultationModal";
import HeroSlider from "../../components/HeroSlider";
import Footer from "../../components/Footer";
import WorkflowSection from "../../components/WorkflowSection";
import NextStepCarouselSection from "../../components/NextStepCarouselSection";
import StudioVerticalCard from "../../components/StudioVerticalCard";
import { SLIDER_IMAGE_URLS } from "@/lib/slider-images";
import {
  DEFAULT_WORKFLOW_STEPS,
  DEFAULT_WORKFLOW_TITLE,
  workflowDraftFromPageContent,
  workflowStepsForSection,
} from "@/lib/workflow-content";

const heroSlides = [
  SLIDER_IMAGE_URLS.mimari,
  "/images/projects/gallery_1.png",
  SLIDER_IMAGE_URLS.material,
  "/images/projects/gallery_2.png",
  SLIDER_IMAGE_URLS.execution,
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
  {
    href: "/mimari/plan-proje",
    title: "Plan ve Proje",
    sideLabel: "Detail & Vision",
    image: "/images/slider/mimari_slide.png",
    blur: 0,
    overlay: 30,
    slug: "plan-proje",
  },
];

const categoryFallbackByKey: Record<string, string> = {
  muhendislik: "/images/workflow/muhendislik-custom.png",
  "insaat-muhendisligi": "/images/workflow/muhendislik-custom.png",
  mimarlik: "/images/workflow/mimarlik-custom.png",
  mekanik: "/images/workflow/mekanik-custom.png",
  "elektrik-elektronik-muhendisligi": "/images/workflow/mekanik-custom.png",
  icmimarlik: "/images/workflow/ic-mimarlik-custom.png",
  "ic-mimarlik": "/images/workflow/ic-mimarlik-custom.png",
  restorasyon: "/images/workflow/restorasyon-custom.png",
  peyzaj: "/images/workflow/peyzaj-custom.png",
  "peyzaj-mimarligi": "/images/workflow/peyzaj-custom.png",
  "plan-proje": "/images/slider/mimari_slide.png",
  planveproje: "/images/slider/mimari_slide.png",
};

function normalizeTitle(value?: string) {
  return (value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z]/g, "");
}

function normalizeKey(value?: string) {
  return (value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-]/g, "");
}

function resolveCategoryImage(card: any) {
  const normalizedSlug = normalizeKey(card?.slug || card?.href);
  const normalizedTitle = normalizeTitle(card?.title);
  return card?.image || categoryFallbackByKey[normalizedSlug] || categoryFallbackByKey[normalizedTitle] || "/images/workflow/mimarlik-custom.png";
}

function mergeCategories(items: any[]) {
  const incoming = Array.isArray(items) ? items : [];
  const lookup = new Map<string, any>();

  incoming.forEach((item) => {
    const key = normalizeKey(item?.slug || item?.href || item?.title);
    if (key) {
      lookup.set(key, item);
    }
  });

  const merged = mimariSubCategories.map((fallback) => {
    const key = normalizeKey(fallback.slug || fallback.href || fallback.title);
    const item = lookup.get(key) || lookup.get(normalizeTitle(fallback.title));
    const source = item || fallback;
    return {
      ...fallback,
      ...item,
      href: item?.href || fallback.href,
      slug: item?.slug || fallback.slug,
      image: resolveCategoryImage(source),
    };
  });

  const seen = new Set(merged.map((item) => normalizeKey(item.slug || item.href || item.title)));
  const extras = incoming
    .filter((item) => {
      const key = normalizeKey(item?.slug || item?.href || item?.title);
      return key && !seen.has(key);
    })
    .map((item) => ({
      ...item,
      image: resolveCategoryImage(item),
    }));

  return [...merged, ...extras];
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
  const [workflow, setWorkflow] = useState({
    title: DEFAULT_WORKFLOW_TITLE,
    steps: workflowStepsForSection(DEFAULT_WORKFLOW_STEPS),
  });
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
          const workflowSection = workflowDraftFromPageContent(data, DEFAULT_WORKFLOW_TITLE, DEFAULT_WORKFLOW_STEPS);
          
          if (hero) {
            if (hero.slides?.length > 0) setSlides(hero.slides);
            setPageInfo({ title: hero.title, subtitle: hero.subtitle });
            setHeroVisual({
              blur: 2,
              overlay: hero.overlay ?? 30,
            });
          }
          if (cats?.items?.length > 0) {
            setCategories(mergeCategories(cats.items));
          }
          if (workflowSection.steps.length > 0) {
            setWorkflow({
              title: workflowSection.title,
              steps: workflowStepsForSection(workflowSection.steps, DEFAULT_WORKFLOW_STEPS),
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
    <main className="site-shell project-detail-shell mimari-vertical-shell mimari-page">
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

      <WorkflowSection className="snap-section" title={workflow.title} steps={workflow.steps} />

      <section className="services-section snap-section gallery-snap-point" style={{ background: "transparent", paddingTop: "6rem", minHeight: "100svh" }}>
        
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
      <NextStepCarouselSection currentStudio="mimari" />

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
