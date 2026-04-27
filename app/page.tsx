"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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


        <section className="w-full min-h-screen bg-zinc-950 text-white">
          <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col gap-12 px-6 py-24 sm:px-10 lg:grid lg:grid-cols-2 lg:gap-28 lg:px-16 lg:py-28">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              variants={{
                hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="order-1 flex flex-col gap-8 lg:justify-center lg:pr-8"
            >
              <h2
                className="max-w-3xl text-[clamp(4.5rem,9vw,7.75rem)] font-thin leading-[0.9] tracking-[-0.06em] text-white"
                style={{ fontFamily: "var(--font-smooch), sans-serif" }}
              >
                Sizin hikayeniz, sizin mekanınız.
              </h2>

              <p
                className="max-w-2xl text-[clamp(1.35rem,2vw,1.75rem)] font-light leading-[1.7] tracking-[-0.02em] text-zinc-300"
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
                  asChild
                  variant="ghost"
                  className="h-auto rounded-none bg-transparent px-0 py-0 text-[1.15rem] font-light tracking-[0.14em] text-white hover:bg-transparent hover:text-zinc-300"
                >
                  <Link href="/faaliyet-alanlarimiz" style={{ fontFamily: "var(--font-smooch), sans-serif" }}>
                    Design &amp; Collection -&gt;
                  </Link>
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
              className="order-2 lg:order-none lg:pt-8"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-900 sm:aspect-[16/10] lg:aspect-[4/5]">
                <img
                  src="/images/about_interior.png"
                  alt="deqoin atölye ve kütüphane iç mekanı"
                  className="h-full w-full object-cover object-center"
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
