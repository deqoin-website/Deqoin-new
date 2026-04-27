"use client";

import { useEffect, useState } from "react";
import ConsultationModal from "../components/ConsultationModal";
import HeroSlider from "../components/HeroSlider";
import WorkflowSection from "../components/WorkflowSection";
import GallerySection from "../components/GallerySection";
import HomeDepartmentTeamsSection from "../components/HomeDepartmentTeamsSection";
import Footer from "@/components/Footer";
import AboutShowcaseSection from "@/components/AboutShowcaseSection";

const SERVICE_CARD_IMAGE_BY_TYPE: Record<string, string> = {
  design: "https://zzawgisa3efgdxnm.public.blob.vercel-storage.com/design-studio-home.png",
  material: "https://zzawgisa3efgdxnm.public.blob.vercel-storage.com/material-studio-home.png",
  execution: "https://zzawgisa3efgdxnm.public.blob.vercel-storage.com/execution-studio-home.png",
};

export default function Page() {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [slides, setSlides] = useState<any[]>([]);

  const [serviceCards, setServiceCards] = useState<any[]>([
    {
      href: "/mimari",
      title: "Design Studio",
      subTitle: "Mimari Tasarım",
      sideLabel: "Structural Integrity",
      image: SERVICE_CARD_IMAGE_BY_TYPE.design,
    },
    {
      href: "/materyal-studyo",
      title: "Material Studio",
      subTitle: "Ürün ve Malzeme",
      sideLabel: "Aesthetic Soul",
      image: SERVICE_CARD_IMAGE_BY_TYPE.material,
    },
    {
      href: "/uygulama",
      title: "Execution Studio",
      subTitle: "Uygulama Hizmetleri",
      sideLabel: "Precision Craft",
      image: SERVICE_CARD_IMAGE_BY_TYPE.execution,
    },
  ]);
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await fetch('/api/slides');
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
            const uniqueSlides = data.filter(
              (slide: any, index: number, array: any[]) =>
                array.findIndex((candidate: any) => candidate.mediaUrl === slide.mediaUrl) === index,
            );

            setSlides(uniqueSlides.map((s: any) => ({
              ...s,
              image: s.mediaUrl,
              motto: s.subtitle,
              mediaType: s.mediaType || 'image'
            })));
          }
        }
      } catch (err) {
        console.error("Failed to fetch dynamic slides:", err);
      }
    };

    const fetchServiceCards = async () => {
      try {
        const res = await fetch('/api/admin/content/home/services');
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
             const mapped = data.map((card: any) => ({
                href: card.studioType === 'design' ? '/mimari' : card.studioType === 'material' ? '/materyal-studyo' : '/uygulama',
                title: card.title,
                subTitle: card.description,
                image: SERVICE_CARD_IMAGE_BY_TYPE[card.studioType] || SERVICE_CARD_IMAGE_BY_TYPE.execution,
                sideLabel: card.studioType === 'design' ? 'Structural Integrity' : card.studioType === 'material' ? 'Aesthetic Soul' : 'Precision Craft',
                blur: card.blur || 0,
                overlay: card.overlay ?? 30
             }));
             setServiceCards(mapped);
          }
        }
      } catch (err) {
        console.error("Failed to fetch studio cards:", err);
      }
    };

    fetchSlides();
    fetchServiceCards();
  }, []);

  return (
    <main
      className="homepage-snap-shell"
    >
      <HeroSlider 
        slides={slides} 
        onAppointmentClick={() => setIsConsultationOpen(true)} 
      />

        <WorkflowSection className="snap-section homepage-workflow-section" />

        <GallerySection className="snap-section homepage-section-v2" />

        <section className="services-section snap-section homepage-section-v2">
          <div className="section-header-area">
            <div className="section-heading-v2">
              <span className="section-small-label" style={{ letterSpacing: "0.5em", color: "#cca883", fontSize: "0.75rem", marginBottom: "0.5rem", display: "block" }}>STUDIO SELECTION</span>
              <h2 style={{ 
                fontFamily: "var(--font-smooch), sans-serif", 
                fontSize: "clamp(2.5rem, 8vw, 5.5rem)", 
                fontWeight: 100, 
                letterSpacing: "0.15em",
                marginBottom: "0.2rem", 
                textTransform: "uppercase", 
                color: "#fff",
                lineHeight: "1"
              }}>DESIGN & COLLECTION</h2>
              <div className="section-line" style={{ background: "#fff", width: '100px', height: '1px', opacity: 0.3 }} />
            </div>
          </div>
          
          <div className="section-content-area" style={{ padding: '0' }}>
            <div className="services-grid hide-scrollbar" style={{ width: '100%', height: '100%' }}>
              {serviceCards.map((card) => (
                <a
                  key={card.title}
                  href={card.href}
                  className={`service-card relative w-full h-[64vh] md:h-[78vh] lg:h-[85vh] rounded-none overflow-hidden group cursor-pointer border-r border-zinc-900/50 ${card.title === "Material Studio" ? "service-card-material-highlight" : ""}`}
                >
                  <img 
                    src={card.image} 
                    alt={card.title} 
                    style={{ filter: `blur(${card.blur || 0}px)` }}
                  />
                  <div 
                    className="service-overlay" 
                    style={{ background: `rgba(0,0,0,${(card.overlay ?? 30) / 100})` }}
                  />
                  <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 lg:p-10 flex flex-col gap-2 z-10">
                    <h3
                      className="text-5xl md:text-5xl lg:text-8xl font-thin text-white uppercase tracking-widest leading-none drop-shadow-lg"
                      style={{ fontFamily: "Smooch Sans, sans-serif", fontWeight: 100 }}
                      lang="en"
                    >
                      {card.title.toLocaleUpperCase("en-US")}
                    </h3>

                    {"subTitle" in card && (
                      <p className="text-xs md:text-xs lg:text-sm tracking-[0.3em] text-zinc-300 font-light uppercase mt-2 drop-shadow-md">
                        {card.subTitle}
                      </p>
                    )}

                    <div className="flex items-center gap-2 mt-4 text-xs tracking-[0.2em] text-white/80 uppercase font-light group-hover:text-white transition-colors">
                      <span>DETAYLARI GÖR</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>


        <AboutShowcaseSection />

        <HomeDepartmentTeamsSection className="homepage-team-section" />

      <Footer />

      <ConsultationModal 
        isOpen={isConsultationOpen} 
        onClose={() => setIsConsultationOpen(false)} 
      />
    </main>
  );
}
