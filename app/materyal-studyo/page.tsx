"use client";

import { useEffect, useRef, useState } from "react";
import ConsultationModal from "../../components/ConsultationModal";
import { Loader2 } from "lucide-react";
import HeroSlider from "../../components/HeroSlider";
import WorkflowSection from "../../components/WorkflowSection";
import NextStepCarouselSection from "../../components/NextStepCarouselSection";
import StudioVerticalCard from "../../components/StudioVerticalCard";
import { materyalKategorileri } from "../../data/materyal-studyo";

const materialCategories = materyalKategorileri;
const materialImageBySlug = Object.fromEntries(
  materyalKategorileri.map((category) => [category.slug, category.image])
);

export default function MateryalStudyo() {
  const [content, setContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`/api/content?page=material&ts=${Date.now()}`, { cache: "no-store" });
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
  const heroBlur = 2;
  const heroOverlay = 30;
  const categoryItems = (content?.sections?.find((s: any) => s.id === "categories")?.items?.length > 0
    ? content.sections.find((s: any) => s.id === "categories").items
    : materialCategories
  ).map((card: any) => ({
    ...card,
    image: materialImageBySlug[card.slug] || card.image,
  }));

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

      <WorkflowSection className="snap-section" />

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
