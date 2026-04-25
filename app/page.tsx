"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { teamFilters, teamMembers } from "../data/team";
import ConsultationModal from "../components/ConsultationModal";
import SwipeAppointmentButton from "../components/SwipeAppointmentButton";
import HeroSlider from "../components/HeroSlider";
import WorkflowSection from "../components/WorkflowSection";
import GallerySection from "../components/GallerySection";
import Footer from "@/components/Footer";

const SERVICE_CARD_IMAGE_BY_TYPE: Record<string, string> = {
  design: "https://zzawgisa3efgdxnm.public.blob.vercel-storage.com/design-studio-home.png",
  material: "https://zzawgisa3efgdxnm.public.blob.vercel-storage.com/material-studio-home.png",
  execution: "https://zzawgisa3efgdxnm.public.blob.vercel-storage.com/execution-studio-home.png",
};

export default function Page() {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [activeTeamFilter, setActiveTeamFilter] = useState<(typeof teamFilters)[number]["key"]>("all");
  const [slides, setSlides] = useState<any[]>([]);
  const [teamSlideIndex, setTeamSlideIndex] = useState(0);
  const [teamSlideDirection, setTeamSlideDirection] = useState(1);
  const teamTouchStartX = useRef<number | null>(null);
  const teamTouchStartY = useRef<number | null>(null);
  const teamWheelLockRef = useRef(false);
  const flipAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    flipAudioRef.current = new Audio("/sounds/page-flip.mp3");
    flipAudioRef.current.volume = 0.25;
    flipAudioRef.current.load();
  }, []);

  const playFlipSound = () => {
    if (!flipAudioRef.current) return;
    const sound = flipAudioRef.current.cloneNode() as HTMLAudioElement;
    sound.volume = 0.25;
    sound.play().catch(() => {});
  };

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

  const filteredTeam = useMemo(() => {
    if (activeTeamFilter === "all") return teamMembers;
    return teamMembers.filter((item) => item.category === activeTeamFilter);
  }, [activeTeamFilter]);
  const currentTeamMember = filteredTeam[teamSlideIndex];

  useEffect(() => {
    if (filteredTeam.length === 0) return;
    setTeamSlideIndex(0);
  }, [activeTeamFilter, filteredTeam.length]);

  useEffect(() => {
    if (filteredTeam.length === 0) return;

    const interval = window.setInterval(() => {
      setTeamSlideDirection(1);
      setTeamSlideIndex((current) => (current + 1) % filteredTeam.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [filteredTeam.length]);

  const navigateTeamSlide = (direction: number) => {
    if (filteredTeam.length === 0) return;
    playFlipSound();
    setTeamSlideDirection(direction);
    setTeamSlideIndex((current) => (current + direction + filteredTeam.length) % filteredTeam.length);
  };

  const handleTeamTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    const touch = event.touches[0];
    teamTouchStartX.current = touch.clientX;
    teamTouchStartY.current = touch.clientY;
  };

  const handleTeamTouchEnd = (event: React.TouchEvent<HTMLElement>) => {
    const startX = teamTouchStartX.current;
    const startY = teamTouchStartY.current;
    teamTouchStartX.current = null;
    teamTouchStartY.current = null;
    if (startX == null || startY == null) return;
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;
    if (Math.abs(deltaX) < 50 || Math.abs(deltaX) < Math.abs(deltaY)) return;
    navigateTeamSlide(deltaX < 0 ? 1 : -1);
  };

  const handleTeamWheel = (event: React.WheelEvent<HTMLElement>) => {
    if (teamWheelLockRef.current || filteredTeam.length === 0) return;
    if (Math.abs(event.deltaY) < 20 && Math.abs(event.deltaX) < 20) return;
    const direction = Math.abs(event.deltaY) > Math.abs(event.deltaX)
      ? Math.sign(event.deltaY)
      : Math.sign(event.deltaX);
    if (direction === 0) return;
    teamWheelLockRef.current = true;
    navigateTeamSlide(direction > 0 ? 1 : -1);
    window.setTimeout(() => {
      teamWheelLockRef.current = false;
    }, 850);
  };

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


        <section className="about-section snap-section homepage-section-v2" id="about-us">
          <div className="section-header-area">
            <div>
              <h2 style={{ 
                fontFamily: "var(--font-smooch), sans-serif", 
                fontSize: "clamp(2.2rem, 6vw, 4.5rem)", 
                fontWeight: 100, 
                letterSpacing: "0.12em",
                color: "#fff",
                lineHeight: "1.1"
              }}>Geleneklerin ötesinde.</h2>
              <div className="section-line" />
            </div>
          </div>
          
          <div className="section-content-area">
            <div className="section-inner about-grid homepage-about-grid" style={{ padding: 0 }}>
              <div className="about-copy">
                <div className="about-text">
                  <div className="about-label-row">
                    <span className="vertical-text">Atölye Felsefesi</span>
                    <p style={{ color: "#fff" }}>
                      Mimarlığın yaşayan bir varlık olduğu ilkesiyle kurulan DEQOIN, yapı
                      mühendisliğinin soğuk hassasiyetini, kişiye özel iç mekanların sıcak ruhuyla
                      birleştiriyor. Biz sadece ev inşa etmiyoruz; atmosferler kurguluyoruz. Her proje
                      benzersiz bir monolittir; kimliğin ve zamansızlığın tekil, uyumlu bir ifadesidir.
                    </p>
                  </div>
                  <div className="homepage-copy-cta">
                    <Link href="/faaliyet-alanlarimiz" className="premium-all-btn">
                      <span className="premium-btn-text">Design & Collection</span>
                      <span className="material-symbols-outlined premium-btn-icon">east</span>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="about-visual">
                <div className="about-frame">
                  <div className="about-image-wrap">
                    <img
                      src="https://zzawgisa3efgdxnm.public.blob.vercel-storage.com/hakkimizda-home.png"
                      alt="Atmospheric architectural interior DEQOIN philosophy masterpiece"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="team-section snap-section homepage-section-v2" id="departman-ekipleri">
          <div className="section-header-area">
            <div className="section-heading-v2">
              <h2 style={{ 
                fontFamily: "var(--font-smooch), sans-serif", 
                fontSize: "clamp(2.5rem, 8vw, 5.5rem)", 
                fontWeight: 100, 
                letterSpacing: "0.15em",
                color: "#fff",
                lineHeight: "1"
              }}>Departman Ekipleri</h2>
              <div className="section-line" />
            </div>
          </div>
          
          <div className="section-content-area" style={{ padding: '0' }}>
            <div className="team-mobile-slider team-home-mobile-slider desktop-only-team-slider" onTouchStart={handleTeamTouchStart} onTouchEnd={handleTeamTouchEnd} style={{ width: '100%', height: '100%' }}>
              <button type="button" className="team-slider-arrow team-slider-arrow-left" onClick={() => navigateTeamSlide(-1)} aria-label="Önceki ekip">
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <button type="button" className="team-slider-arrow team-slider-arrow-right" onClick={() => navigateTeamSlide(1)} aria-label="Sonraki ekip">
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={filteredTeam[teamSlideIndex]?.id}
                  className="team-mobile-slide"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.12}
                  onDragEnd={(_, info) => {
                    const threshold = 60;
                    if (info.offset.x < -threshold) navigateTeamSlide(1);
                    if (info.offset.x > threshold) navigateTeamSlide(-1);
                  }}
                  initial={{
                    opacity: 0,
                    x: teamSlideDirection >= 0 ? 100 : -100,
                    scale: 1.05,
                    filter: "blur(10px) saturate(0.9)",
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    scale: 1,
                    filter: "blur(0px) saturate(1)",
                  }}
                  exit={{
                    opacity: 0,
                    x: teamSlideDirection >= 0 ? -100 : 100,
                    scale: 0.98,
                    filter: "blur(8px) saturate(0.9)",
                  }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link href={currentTeamMember ? "/departman-ekipleri" : "#"} className="team-card-gallery team-mobile-card">
                    <div className="team-card-img">
                      {currentTeamMember?.image ? (
                        <img src={currentTeamMember.image} alt={currentTeamMember.name} />
                      ) : null}
                      <div className="team-overlay" />
                      <div className="team-card-content">
                        <span className="team-card-role-vertical">{currentTeamMember?.role}</span>
                        <div className="team-card-copy">
                          <h3>{currentTeamMember?.name}</h3>
                        </div>
                        <div className="team-card-footer">
                          <span className="team-card-index">{String(teamSlideIndex + 1).padStart(2, "0")}</span>
                          <span className="material-symbols-outlined">arrow_outward</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mobile-only-team-slider">
              {filteredTeam.map((member, idx) => (
                <Link key={member.id} href="/departman-ekipleri" className="team-native-card">
                  <div className="team-native-img">
                    {member.image ? <img src={member.image} alt={member.name} /> : null}
                  </div>
                  <div className="team-native-overlay" />
                  <div className="team-native-content">
                    <span className="team-native-role">{member.role}</span>
                    <h3>{member.name}</h3>
                    <div className="team-native-footer">
                      <span className="team-native-idx">{String(idx + 1).padStart(2, "0")}</span>
                      <span className="material-symbols-outlined">arrow_outward</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
          <div style={{ position: 'absolute', bottom: '4rem', left: '0', right: '0', display: 'flex', justifyContent: 'center', pointerEvents: 'none', zIndex: 10 }}>
            <Link href="/departman-ekipleri" className="premium-all-btn" style={{ pointerEvents: 'auto' }}>
              <span className="premium-btn-text">TÜM EKİPLERİ GÖR</span>
              <span className="material-symbols-outlined premium-btn-icon">east</span>
            </Link>
          </div>
        </section>

      <Footer />

      <ConsultationModal 
        isOpen={isConsultationOpen} 
        onClose={() => setIsConsultationOpen(false)} 
      />
    </main>
  );
}
