"use client";

import { useRef, useEffect, useState } from "react";
import ConsultationModal from "../../components/ConsultationModal";
import { Loader2 } from "lucide-react";
import { uygulamaBirimleri } from "../../data/uygulama-birimleri";
import StudioVerticalCard from "../../components/StudioVerticalCard";
import HeroSlider from "../../components/HeroSlider";
import WorkflowSection from "../../components/WorkflowSection";
import NextStepCarouselSection from "../../components/NextStepCarouselSection";
import { useWorkflowContent } from "@/components/useWorkflowContent";

const executionCategories = uygulamaBirimleri.filter((item) =>
  [
    "insaat-ekipleri",
    "siva-ve-alci-ekipleri",
    "boya-ekipleri",
    "duvar-sanatcilari",
    "ressamlar",
    "heykeltiraslar",
  ].includes(item.slug)
);

export default function UygulamaPage() {
  const [content, setContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { workflow } = useWorkflowContent("page:execution");

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`/api/content?page=execution&ts=${Date.now()}`, { cache: 'no-store' });
        const data = await res.json();
        if (data && data.sections) {
          setContent(data);
        }
      } catch (err) {
        console.error("Failed to fetch execution content:", err);
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
        heroRef.current.style.transform = `translateY(${scrolled * 0.4}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="site-shell" style={{ height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="animate-spin" size={48} color="#a68966" />
      </div>
    );
  }

  const heroSection = content?.sections?.find((s: any) => s.id === 'hero');
  const heroBlur = 2;
  const heroOverlay = 30;
  return (
    <main className="site-shell project-detail-shell material-studio-page uygulama-page" style={{ background: "#0a0a0a" }}>

      {/* HERO */}
      <HeroSlider 
        slides={(heroSection?.slides?.length > 0 ? heroSection.slides : [executionCategories[0]?.image]).map((img: string) => ({
          title: heroSection?.title || "EXECUTION STUDIO",
          motto: "UYGULAMA",
          image: img,
          blur: heroBlur,
          overlay: heroOverlay
        }))} 
        onAppointmentClick={() => setIsConsultationOpen(true)}
        showScrollHint={true}
      />

      <WorkflowSection className="snap-section" title={workflow.title} steps={workflow.steps} />

      {/* MANİFESTO */}


      <section className="services-section material-studio-collection" style={{ background: "transparent", paddingTop: "0" }}>
        <div className="material-studio-collection-shell material-studio-collection-inner" style={{ paddingTop: "0" }}>
          <div className="section-heading projects-heading">
            <div>
              <span className="section-small-label" style={{ color: "#cca883", marginBottom: "1rem", display: "block" }}>EXECUTION TEAMS</span>
              <h2 style={{ marginBottom: "0.5rem", textTransform: "uppercase", color: "#fff" }}>UYGULAMA KOLEKSİYONU</h2>
              <p style={{ maxWidth: "42rem", color: "rgba(255,255,255,0.6)", lineHeight: "1.8", margin: "0 0 1.5rem" }}>
                Teknik disiplin ile sanatsal uygulamayı aynı sahada buluşturan uzman ekiplerimizi, kendi sayfalarında detaylı biçimde inceleyin.
              </p>
              <div className="section-line" />
            </div>
          </div>

          <div className="services-grid material-studio-grid uygulama-grid">
            {executionCategories.map((card) => (
              <StudioVerticalCard
                key={card.slug}
                href={`/uygulama/${card.slug}`}
                image={card.image}
                title={card.title}
                sideLabel={card.sideLabel}
              />
            ))}
          </div>
        </div>
      </section>

      <NextStepCarouselSection currentStudio="uygulama" />

      <ConsultationModal 
        isOpen={isConsultationOpen} 
        onClose={() => setIsConsultationOpen(false)} 
      />
    </main>
  );
}
