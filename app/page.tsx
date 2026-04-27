"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import ConsultationModal from "../components/ConsultationModal";
import HeroSlider from "../components/HeroSlider";
import WorkflowSection from "../components/WorkflowSection";
import GallerySection from "../components/GallerySection";
import HomeDepartmentTeamsSection from "../components/HomeDepartmentTeamsSection";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const SERVICE_CARD_IMAGE_BY_TYPE: Record<string, string> = {
  design: "https://zzawgisa3efgdxnm.public.blob.vercel-storage.com/design-studio-home.png",
  material: "https://zzawgisa3efgdxnm.public.blob.vercel-storage.com/material-studio-home.png",
  execution: "https://zzawgisa3efgdxnm.public.blob.vercel-storage.com/execution-studio-home.png",
};

export default function Page() {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [slides, setSlides] = useState<any[]>([]);
  const shouldReduceMotion = useReducedMotion();
  const router = useRouter();

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
            <div className="services-grid" style={{ width: '100%', height: '100%' }}>
              {serviceCards.map((card) => (
                <a
                  key={card.title}
                  href={card.href}
                  className={`service-card ${card.title === "Material Studio" ? "service-card-material-highlight" : ""}`}
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
                  <div className="service-copy">
                    <div>
                      <h3>{card.title}</h3>
                      {"subTitle" in card && (
                        <p style={{ fontSize: "1.2rem", color: "rgba(255,255,255,0.8)", marginTop: "0.5rem", letterSpacing: "0.2em", textTransform: "uppercase", lineHeight: 1 }}>{card.subTitle}</p>
                      )}
                      <div className="service-line" />
                      <div className="service-cta">
                        <span>DETAYLARI GÖR</span>
                        <span className="material-symbols-outlined">arrow_forward</span>
                      </div>
                    </div>
                    <span className="vertical-text">{card.sideLabel}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>


        <section className="w-full h-screen snap-center snap-always flex items-center justify-center overflow-hidden bg-zinc-950 text-white">
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 px-6 md:px-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              variants={{
                hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="order-1 flex flex-col justify-center lg:pr-8"
            >
              <h2
                className="text-6xl md:text-8xl font-thin text-white tracking-tight mb-6"
                style={{ fontFamily: "var(--font-smooch), sans-serif" }}
              >
                Sizin hikayeniz, sizin mekanınız.
              </h2>

              <p
                className="text-xl md:text-2xl text-zinc-400 font-light leading-relaxed mb-8"
                style={{ fontFamily: "var(--font-smooch), sans-serif" }}
              >
                Biz deqoin'i kurarken tek bir inancımız vardı: Bir ev, sadece dört duvar ve eşyalardan
                ibaret olamaz. Bu yüzden mimarinin teknik gücünü, sizin kişisel zevklerinizle ve yaşam
                tarzınızla harmanlıyoruz. Hayatınıza dokunan, içinde kendinizi huzurlu hissedeceğiniz ve
                yıllara meydan okuyan sıcak yaşam alanları tasarlıyoruz. Kısacası, sizin hikayenizi
                mekanlara yansıtıyoruz.
              </p>

              <div>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full text-zinc-300 border-zinc-700 hover:bg-zinc-100 hover:text-black transition-all"
                  onClick={() => router.push("/faaliyet-alanlarimiz")}
                >
                  <span style={{ fontFamily: "var(--font-smooch), sans-serif" }}>Design &amp; Collection -&gt;</span>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
              variants={{
                hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="order-2 lg:order-none"
            >
              <div className="relative w-full h-[50vh] md:h-[70vh] rounded-2xl overflow-hidden">
                <img
                  src="/images/about_interior.png"
                  alt="deqoin atölye ve kütüphane iç mekanı"
                  className="object-cover w-full h-full"
                />
              </div>
            </motion.div>
          </div>
        </section>

        <HomeDepartmentTeamsSection className="homepage-team-section" />

      <Footer />

      <ConsultationModal 
        isOpen={isConsultationOpen} 
        onClose={() => setIsConsultationOpen(false)} 
      />
    </main>
  );
}
