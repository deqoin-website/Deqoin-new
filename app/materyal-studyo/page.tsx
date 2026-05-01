"use client";

import { useEffect, useRef, useState } from "react";
import ConsultationModal from "../../components/ConsultationModal";
import { Loader2 } from "lucide-react";
import HeroSlider from "../../components/HeroSlider";
import WorkflowSection from "../../components/WorkflowSection";
import NextStepCarouselSection from "../../components/NextStepCarouselSection";
import StudioVerticalCard from "../../components/StudioVerticalCard";
import { useWorkflowContent } from "@/components/useWorkflowContent";
import { materyalKategorileri } from "../../data/materyal-studyo";

const materialCategories = materyalKategorileri;
const materialImageBySlug = Object.fromEntries(
  materyalKategorileri.map((category) => [category.slug, category.image])
);

const normalizeKey = (value?: string) =>
  (value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-]/g, "");

const mergeMaterialCategories = (items: any[]) => {
  const incoming = Array.isArray(items) ? items : [];
  const lookup = new Map<string, any>();

  incoming.forEach((item) => {
    const key = normalizeKey(item?.slug || item?.href || item?.title);
    if (key) {
      lookup.set(key, item);
    }
  });

  const merged = materialCategories.map((fallback) => {
    const key = normalizeKey(fallback.slug || fallback.title);
    const item = lookup.get(key);
    const source = item || fallback;
    return {
      ...fallback,
      ...item,
      slug: item?.slug || fallback.slug,
      image: materialImageBySlug[source.slug] || source.image,
    };
  });

  const seen = new Set(merged.map((item) => normalizeKey(item.slug || item.title)));
  const extras = incoming
    .filter((item) => {
      const key = normalizeKey(item?.slug || item?.href || item?.title);
      return key && !seen.has(key);
    })
    .map((item) => ({
      ...item,
      image: materialImageBySlug[item?.slug] || item?.image,
    }));

  return [...merged, ...extras];
};

export default function MateryalStudyo() {
  const [content, setContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { workflow } = useWorkflowContent("page:material");

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`/api/content?page=material&ts=${Date.now()}`, { cache: "no-store" });
        const data = await res.json();
        if (data && data.sections) {
          setContent(data);
        }
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
  const heroBlur = 2;
  const heroOverlay = 30;
  const categorySection = content?.sections?.find((s: any) => s.id === "categories");
  const categoryItems = mergeMaterialCategories(categorySection?.items?.length > 0 ? categorySection.items : materialCategories);

  return (
    <main className="site-shell project-detail-shell material-studio-page materyal-studyo-page" style={{ background: "#0a0a0a" }}>
      <HeroSlider 
        slides={(heroSection?.slides?.length > 0 ? heroSection.slides : [materialCategories[0]?.image]).map((img: string) => ({
          title: heroSection?.title || "MATERIAL STUDIO",
          motto: "MALZEME",
          image: img,
          blur: heroBlur,
          overlay: heroOverlay
        }))} 
        onAppointmentClick={() => setIsConsultationOpen(true)}
        showScrollHint={true}
      />

      <WorkflowSection className="snap-section" title={workflow.title} steps={workflow.steps} />

      <section className="services-section material-studio-collection" style={{ background: "transparent", paddingTop: "0" }}>
        <div className="material-studio-collection-shell material-studio-collection-inner" style={{ paddingTop: "0" }}>
          <div className="section-heading projects-heading">
            <div>
              <span className="section-small-label" style={{ color: "#cca883", marginBottom: "1rem", display: "block" }}>CATEGORY SELECTION</span>
              <h2 style={{ marginBottom: "0.5rem", textTransform: "uppercase", color: "#fff" }}>MATERIAL COLLECTION</h2>
              <div className="section-line" />
            </div>
          </div>

          <div className="services-grid material-studio-grid materyal-studyo-grid">
            {categoryItems.map((card: any) => (
              <StudioVerticalCard
                key={card.slug}
                href={`/materyal-studyo/${card.slug}`}
                image={card.image}
                title={card.title}
                sideLabel={card.sideLabel}
              />
            ))}
          </div>
        </div>
      </section>

      <NextStepCarouselSection currentStudio="materyal-studyo" />

      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
      />
    </main>
  );
}
