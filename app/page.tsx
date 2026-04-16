"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { projectsData } from "../data/projects";
import { teamFilters, teamMembers } from "../data/team";
import ConsultationModal from "../components/ConsultationModal";
import ProjectInsightPanel from "../components/ProjectInsightPanel";
import SwipeAppointmentButton from "../components/SwipeAppointmentButton";

export default function Page() {
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroDirection, setHeroDirection] = useState(0);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [activeTeamFilter, setActiveTeamFilter] = useState<(typeof teamFilters)[number]["key"]>("all");
  const [slides, setSlides] = useState<any[]>([]);
  const [projectIndex, setProjectIndex] = useState(0);
  const [projectDirection, setProjectDirection] = useState(1);
  const [projectProgressKey, setProjectProgressKey] = useState(0);
  const [activeProjectPanelSlug, setActiveProjectPanelSlug] = useState<string | null>(null);
  const [teamSlideIndex, setTeamSlideIndex] = useState(0);
  const [teamSlideDirection, setTeamSlideDirection] = useState(1);
  const [heroIntroReady, setHeroIntroReady] = useState(false);
  const heroTouchStartX = useRef<number | null>(null);
  const heroTouchStartY = useRef<number | null>(null);
  const projectTouchStartX = useRef<number | null>(null);
  const projectTouchStartY = useRef<number | null>(null);
  const projectIndexRef = useRef(0);
  const homepageSnapLockRef = useRef(false);
  const homepageTouchStartYRef = useRef<number | null>(null);
  const teamTouchStartX = useRef<number | null>(null);
  const teamTouchStartY = useRef<number | null>(null);
  const projectWheelLockRef = useRef(false);
  const teamWheelLockRef = useRef(false);

  const [serviceCards, setServiceCards] = useState<any[]>([
    {
      href: "/mimari",
      title: "Design Studio",
      subTitle: "Mimari Tasarım",
      sideLabel: "Structural Integrity",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDbQTBOayjmIt4JzHbORA9-NQOes7Uaoo4WrcuGAAwzEXJzUo0V4OeCDNGGyxzFDBzG1_DbgXDr5aROetwtqZ4iPhEiaV39HyWZ67_PbpZY6a2KYJHEC2_-3JaDiLZ_71qMkfLsbA991AHjCOdDh70fnYJ3lWy-tXN7nbh5DnUk-PZt4xV5nniOugFFMI4ACHWAkPu85H_YU43TPpuqCiveXM-RLOTvgub4LA47ECVZBRKJhuyDW83lyXynnNyLY1ieUH6-gh23YZs",
    },
    {
      href: "/materyal-studyo",
      title: "Material Studio",
      subTitle: "Ürün ve Malzeme",
      sideLabel: "Aesthetic Soul",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCVUCHLvB4gqKIu87ZlNcr3oZLDY1XgwMEMQcp-pzAUlFS1Nn-nmjan1oheeXLiJ94VJmZA_oBfMSPF7jZZuVG47cEkP7h1goKj5Y9WgqVshN-x4CHN0Cdm1zFfAK5KszWNO6pl8w1-gfW6Wb3njqQOsjkQ8-pCuF6dDd8ggmvjFL-N9m4Fe4Lj-pi8WbEEAKONv-Sz-Yl9wNOSPvazMnMZ5Gjdm2myTHVi_vIL4aoeENqkME8bn_RKrHn4r6XvpVXXxsRugi5gKPU",
    },
    {
      href: "/uygulama",
      title: "Execution Studio",
      subTitle: "Uygulama Hizmetleri",
      sideLabel: "Precision Craft",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBg-MKl4zF6vfhExOXkEX-PKVlktOgQYI9EevfKIIYXVJ2wtmRpvybiQLaOtQdeYc_lIPrntEOUrCatq_Efo6fw-z-0-6TilLvAsA4tcYK-QcbjqdetFT2T2EreDjugTzsElsUeoEqEM9i_daWDWBBOJXiZvrjMKWtS2z5I5ZuzOLXWozpZ8MroEnEj5yRtFuaubPctxfeO_ZAZ5E5Tawo9b6yB5w0pmG4_axQCW--XoR8nAAImAE_M5UpM2vFx3tuR2ePYvZ-VmaY",
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
            setHeroIndex(0);
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
                image: card.image || (card.studioType === 'design' ? '/images/slider/mimari_slide.png' : card.studioType === 'material' ? '/images/slider/tasarim_slide.png' : '/images/slider/uygulama_slide.png'),
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

    const introTimer = window.setTimeout(() => setHeroIntroReady(true), 220);

    const interval = window.setInterval(() => {
      setSlides(current => {
        if (current.length > 0) {
          setHeroIndex((idx) => (idx + 1) % current.length);
        }
        return current;
      });
    }, 8000);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(introTimer);
    };
  }, []);

  const filteredProjects = useMemo(() => projectsData, []);
  useEffect(() => {
    projectIndexRef.current = projectIndex;
  }, [projectIndex]);

  const selectedProject = useMemo(
    () => filteredProjects.find((project) => project.slug === activeProjectPanelSlug) ?? null,
    [activeProjectPanelSlug, filteredProjects],
  );

  const filteredTeam = useMemo(() => {
    if (activeTeamFilter === "all") return teamMembers;
    return teamMembers.filter((item) => item.category === activeTeamFilter);
  }, [activeTeamFilter]);

  const currentProject = filteredProjects[projectIndex];
  const currentTeamMember = filteredTeam[teamSlideIndex];
  const currentHeroSlide = slides[heroIndex];

  useEffect(() => {
    projectIndexRef.current = projectIndex;
  }, [projectIndex]);

  const heroProgressStyle = {
    width: "100%",
    animation: "progressFill 8s linear infinite",
  };

  useEffect(() => {
    if (filteredProjects.length === 0 || activeProjectPanelSlug) return;

    const interval = window.setInterval(() => {
      setProjectDirection(1);
      setProjectIndex((current) => (current + 1) % filteredProjects.length);
      setProjectProgressKey((current) => current + 1);
    }, 7000);

    return () => window.clearInterval(interval);
  }, [activeProjectPanelSlug, filteredProjects.length]);

  useEffect(() => {
    if (!activeProjectPanelSlug) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [activeProjectPanelSlug]);

  useEffect(() => {
    const getSnapSections = () =>
      Array.from(
        document.querySelectorAll<HTMLElement>(
          ".homepage-snap-shell .snap-section, .homepage-footer-snap",
        ),
      );

    const getHeaderOffset = () => {
      const topbar = document.querySelector<HTMLElement>(".topbar-nav");
      return topbar?.offsetHeight ?? 80;
    };

    const getClosestSectionIndex = (sections: HTMLElement[]) => {
      const headerOffset = getHeaderOffset();
      const viewportAnchor = window.scrollY + headerOffset + 12;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      sections.forEach((section, index) => {
        const sectionTop = Math.max(0, section.offsetTop - headerOffset);
        const distance = Math.abs(sectionTop - viewportAnchor);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      return closestIndex;
    };

    const snapToSection = (direction: 1 | -1) => {
      const sections = getSnapSections();
      if (sections.length === 0) return;

      const currentIndex = getClosestSectionIndex(sections);
      const nextIndex = Math.min(
        sections.length - 1,
        Math.max(0, currentIndex + direction),
      );

      if (nextIndex === currentIndex) return;

      const headerOffset = getHeaderOffset();
      const documentHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      const targetTop = Math.max(
        0,
        Math.min(
          sections[nextIndex].offsetTop - headerOffset,
          documentHeight - viewportHeight,
        ),
      );

      homepageSnapLockRef.current = true;
      window.scrollTo({ top: targetTop, behavior: "smooth" });

      window.setTimeout(() => {
        homepageSnapLockRef.current = false;
      }, 850);
    };

    const handleWheel = (event: WheelEvent) => {
      if (homepageSnapLockRef.current || activeProjectPanelSlug || isConsultationOpen) return;
      if (Math.abs(event.deltaY) < 24) return;

      event.preventDefault();
      snapToSection(event.deltaY > 0 ? 1 : -1);
    };

    const handleTouchStart = (event: TouchEvent) => {
      homepageTouchStartYRef.current = event.touches[0]?.clientY ?? null;
    };

    const handleTouchEnd = (event: TouchEvent) => {
      if (homepageSnapLockRef.current || activeProjectPanelSlug || isConsultationOpen) return;

      const startY = homepageTouchStartYRef.current;
      homepageTouchStartYRef.current = null;
      if (startY == null) return;

      const endY = event.changedTouches[0]?.clientY ?? startY;
      const deltaY = startY - endY;
      if (Math.abs(deltaY) < 52) return;

      snapToSection(deltaY > 0 ? 1 : -1);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [activeProjectPanelSlug, isConsultationOpen]);

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

  const navigateHero = (direction: number) => {
    if (slides.length === 0) return;
    setHeroDirection(direction);
    setHeroIndex((current) => (current + direction + slides.length) % slides.length);
  };

  const handleHeroTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    const touch = event.touches[0];
    heroTouchStartX.current = touch.clientX;
    heroTouchStartY.current = touch.clientY;
  };

  const handleHeroTouchEnd = (event: React.TouchEvent<HTMLElement>) => {
    const startX = heroTouchStartX.current;
    const startY = heroTouchStartY.current;

    heroTouchStartX.current = null;
    heroTouchStartY.current = null;

    if (startX == null || startY == null) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;

    if (Math.abs(deltaX) < 50 || Math.abs(deltaX) < Math.abs(deltaY)) return;
    navigateHero(deltaX < 0 ? 1 : -1);
  };

  const navigateProject = (direction: number) => {
    if (filteredProjects.length === 0) return;
    const nextIndex =
      (projectIndexRef.current + direction + filteredProjects.length) % filteredProjects.length;

    setProjectDirection(direction);
    setProjectProgressKey((current) => current + 1);
    setProjectIndex(nextIndex);
  };

  const jumpToProject = (nextIndex: number) => {
    if (filteredProjects.length === 0) return;
    if (nextIndex === projectIndexRef.current) return;

    setProjectDirection(nextIndex > projectIndexRef.current ? 1 : -1);
    setProjectProgressKey((current) => current + 1);
    setProjectIndex(nextIndex);
  };

  const openProjectPanel = (slug: string) => {
    setActiveProjectPanelSlug(slug);
  };

  const handleProjectTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    const touch = event.touches[0];
    projectTouchStartX.current = touch.clientX;
    projectTouchStartY.current = touch.clientY;
  };

  const handleProjectTouchEnd = (event: React.TouchEvent<HTMLElement>) => {
    const startX = projectTouchStartX.current;
    const startY = projectTouchStartY.current;

    projectTouchStartX.current = null;
    projectTouchStartY.current = null;

    if (startX == null || startY == null) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;

    if (Math.abs(deltaX) < 50 || Math.abs(deltaX) < Math.abs(deltaY)) return;
    navigateProject(deltaX < 0 ? 1 : -1);
  };

  const navigateTeamSlide = (direction: number) => {
    if (filteredTeam.length === 0) return;
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

  const handleProjectWheel = (event: React.WheelEvent<HTMLElement>) => {
    if (projectWheelLockRef.current || filteredProjects.length === 0) return;
    if (Math.abs(event.deltaY) < 20 && Math.abs(event.deltaX) < 20) return;

    event.preventDefault();

    const direction = Math.abs(event.deltaY) > Math.abs(event.deltaX)
      ? Math.sign(event.deltaY)
      : Math.sign(event.deltaX);

    if (direction === 0) return;

    projectWheelLockRef.current = true;
    navigateProject(direction > 0 ? 1 : -1);

    window.setTimeout(() => {
      projectWheelLockRef.current = false;
    }, 900);
  };


  return (
    <main
      className={`site-shell experiential-shell homepage-snap-shell ${
        activeProjectPanelSlug ? "project-panel-open" : ""
      }`}
    >
      <div className="site-shell-content">
        <section
          className="hero-section snap-section"
          id="hero-slider"
          onTouchStart={handleHeroTouchStart}
          onTouchEnd={handleHeroTouchEnd}
        >
        <div className="hero-slide active" style={{ backgroundColor: "#000" }}>
          {currentHeroSlide?.mediaType === "image" && (
            <motion.div
              className="hero-slide-media"
              initial={{
                opacity: 0,
                scale: 1.12,
                filter: `blur(${Math.max((currentHeroSlide?.blur || 0), 2) + 10}px) brightness(0.26) saturate(0.88)`,
              }}
              animate={{
                opacity: heroIntroReady ? 1 : 0,
                scale: 1.02,
                filter: `blur(${Math.max((currentHeroSlide?.blur ?? 0), 2)}px) brightness(0.44) saturate(0.92)`,
              }}
              transition={{ duration: 1.35, ease: [0.77, 0, 0.175, 1] }}
              style={{
                backgroundImage: `url(${currentHeroSlide?.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />
          )}
          {currentHeroSlide?.mediaType === "video" && (
            <motion.video
              className="hero-video"
              autoPlay
              muted
              loop
              playsInline
              initial={{ opacity: 0, scale: 1.1, filter: "blur(18px) brightness(0.28)" }}
              animate={{ opacity: heroIntroReady ? 1 : 0, scale: 1.02, filter: "blur(0px) brightness(0.42)" }}
              transition={{ duration: 1.35, ease: [0.77, 0, 0.175, 1] }}
            >
              <source src={currentHeroSlide?.mediaUrl} />
            </motion.video>
          )}
          <div className="hero-overlay" style={{ background: `rgba(0,0,0,${Math.max((slides[heroIndex]?.overlay ?? 30), 42) / 100})` }} />
        </div>

        <div className="hero-content" style={{ textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "3rem", height: "100%", width: "100%" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
            <span
              className="hero-studio-label"
              style={{
                fontFamily: "var(--font-display), sans-serif",
                fontWeight: 500,
                textTransform: "uppercase",
                paddingLeft: "0.6em",
              }}
            >
              {slides[heroIndex]?.motto}
            </span>
            <h1 style={{ 
              fontFamily: "var(--font-smooch), sans-serif", 
              fontSize: "clamp(4.5rem, 12vw, 11rem)", 
              fontStyle: "normal", 
              fontWeight: 100, 
              color: "#ffffff", 
              letterSpacing: "0.2em", 
              textTransform: "uppercase", 
              margin: 0, 
              lineHeight: "0.9",
              textShadow: "0 15px 50px rgba(0,0,0,0.9)",
              paddingLeft: "0.2em"
            }}>
              {slides[heroIndex]?.title}
            </h1>
          </div>
          <SwipeAppointmentButton
            onActivate={() => setIsConsultationOpen(true)}
            style={{ marginTop: "1rem", position: "relative", zIndex: 100 }}
          />
        </div>

        <div className="hero-meta">
          <div className="hero-count">
            <span>{String(heroIndex + 1).padStart(2, "0")}</span>
            <div />
            <small>{String(slides.length).padStart(2, "0")}</small>
          </div>
          <p className="vertical-text">{slides[heroIndex]?.title}</p>
        </div>

        <div className="hero-progress">
          <div key={heroIndex} style={heroProgressStyle} />
        </div>
        </section>

        {/* ── DESIGN & BUILD PROCESS SECTION ── */}
        <section className="process-section snap-section">
        <div className="process-header">
          <h2>İŞ AKIŞI</h2>
          <div className="section-line" />
        </div>

        <div className="process-timeline">
          {[
            { id: "01", icon: "event_note", title: "Randevu", detail: "Kusursuz sürecin ilk adımı." },
            { id: "02", icon: "manage_search", title: "Keşif", detail: "İhtiyaçların ve potansiyelin öngörülmesi." },
            { id: "03", icon: "draw", title: "Tasarım", detail: "Vizyonun ve mimari kimliğin kurgulanması." },
            { id: "04", icon: "layers", title: "Malzeme", detail: "Projeye özel premium donatıların entegrasyonu." },
            { id: "05", icon: "precision_manufacturing", title: "Uygulama", detail: "Tüm değerlerinizi ortaya koyan usta işi inşa süreci." }
          ].map((step, idx) => (
            <div key={idx} className="process-step">
              <div className="step-number">
                <span
                  className="material-symbols-outlined step-icon"
                  style={{ fontVariationSettings: "'FILL' 0, 'wght' 200, 'opsz' 24" }}
                >
                  {step.icon}
                </span>
                <span className="step-id">{step.id}</span>
              </div>
              <div className="step-content">
                <h3>{step.title}</h3>
                <p>{step.detail}</p>
              </div>
            </div>
          ))}
        </div>
        </section>

        <section className="services-section snap-section homepage-section homepage-services-section">
        <div className="section-inner homepage-section-inner homepage-services-inner">
          <div className="section-heading">
            <div>
              <span className="section-small-label" style={{ letterSpacing: "0.5em", color: "#cca883", fontSize: "0.75rem", marginBottom: "1rem", display: "block" }}>STUDIO SELECTION</span>
              <h2 style={{ marginBottom: "0.5rem", textTransform: "uppercase", color: "#000" }}>DESIGN & COLLECTION</h2>
              <span style={{ 
                fontFamily: "var(--font-display), sans-serif", 
                fontSize: "1.1rem", 
                color: "rgba(255,255,255,0.7)", 
                letterSpacing: "0.3em", 
                textTransform: "uppercase",
                display: "block",
                marginBottom: "1.5rem"
              }}>
                TASARIM VE KOLEKSİYON
              </span>
              <div className="section-line" style={{ background: "#fff" }} />
            </div>
          </div>
        </div>
        <div className="services-grid">
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
                    <p style={{ fontSize: "1.4rem", color: "rgba(255,255,255,0.8)", marginTop: "0.7rem", letterSpacing: "0.24em", textTransform: "uppercase", lineHeight: 1 }}>{card.subTitle}</p>
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
        </section>


        <section className="projects-section snap-section homepage-section homepage-projects-section" id="galeri">
        <div className="section-inner homepage-section-inner">
          <div className="section-heading projects-heading">
            <div>
              <h2>Galeri</h2>
              <div className="section-line" />
            </div>
            <div className="project-slider-controls">
              <div className="project-slider-counter">
                <span>{String(projectIndex + 1).padStart(2, "0")}</span>
                <small>{String(filteredProjects.length).padStart(2, "0")}</small>
              </div>
              <div className="project-slider-dots" aria-label="Proje slider göstergeleri">
                {filteredProjects.map((project, idx) => (
                  <button
                    key={project.slug}
                    type="button"
                    className={`project-slider-dot ${idx === projectIndex ? "active" : ""}`}
                    onClick={() => jumpToProject(idx)}
                    aria-label={`${project.title} projesine git`}
                  />
                ))}
              </div>
              <div className="carousel-buttons project-slider-arrows">
                <button type="button" onClick={() => navigateProject(-1)} aria-label="Önceki proje">
                  <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <button type="button" onClick={() => navigateProject(1)} aria-label="Sonraki proje">
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          <div
            className="project-slider-window"
            onTouchStart={handleProjectTouchStart}
            onTouchEnd={handleProjectTouchEnd}
          >
            <div className="project-slider-progress" aria-hidden="true">
              <motion.span
                key={projectProgressKey}
                className="project-slider-progress-fill"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 4.8, ease: "linear" }}
              />
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={filteredProjects[projectIndex]?.slug}
                className="project-slide"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.12}
                onDragEnd={(_, info) => {
                  const threshold = 60;
                  if (info.offset.x < -threshold) navigateProject(1);
                  if (info.offset.x > threshold) navigateProject(-1);
                }}
                initial={{
                  opacity: 0,
                  x: projectDirection >= 0 ? 120 : -120,
                  scale: 1.08,
                  filter: "blur(16px) saturate(0.8)",
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                  scale: 1,
                  filter: "blur(0px) saturate(1)",
                }}
                exit={{
                  opacity: 0,
                  x: projectDirection >= 0 ? -120 : 120,
                  scale: 0.98,
                  filter: "blur(10px) saturate(0.85)",
                }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              >
                <button
                  type="button"
                  className="project-card project-card-full project-card-trigger"
                  onClick={() => currentProject && openProjectPanel(currentProject.slug)}
                  aria-label={`${currentProject?.title ?? "Proje"} bilgilerini aç`}
                >
                  <motion.div
                    className="project-slide-parallax"
                    style={currentProject?.coverImage ? { backgroundImage: `url(${currentProject.coverImage})` } : undefined}
                    initial={{ scale: 1.08, x: projectDirection >= 0 ? -30 : 30 }}
                    animate={{ scale: 1.16, x: 0 }}
                    exit={{ scale: 1.08, x: projectDirection >= 0 ? 30 : -30 }}
                    transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                  />
                  {currentProject?.coverImage ? (
                    <img src={currentProject.coverImage} alt={currentProject.title} />
                  ) : null}
                  <div className="project-overlay" />
                  <div className="project-slide-glow" />
                  <div className="project-slide-copy">
                    <span className="vertical-text">{currentProject?.label}</span>
                    <div>
                      <h4>{currentProject?.title}</h4>
                      <span className="project-slide-cta">
                        <span className="project-slide-cta-line" aria-hidden="true" />
                        <span>PROJE BİLGİSİ</span>
                        <span className="material-symbols-outlined project-slide-cta-icon" aria-hidden="true">arrow_forward</span>
                      </span>
                    </div>
                  </div>
                </button>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="homepage-section-cta">
            <Link href="/galeri" className="premium-all-btn">
              <span className="premium-btn-text">TÜM GALERİYİ GÖR</span>
              <span className="material-symbols-outlined premium-btn-icon">east</span>
            </Link>
          </div>
        </div>
        </section>

        <section className="about-section snap-section homepage-section homepage-about-section" id="about-us">
        <div className="section-inner homepage-section-inner about-grid homepage-about-grid">
          <div className="about-copy">
            <div>
              <h2>Geleneklerin ötesinde.</h2>
              <div className="section-line" />
            </div>
            <div className="about-text">
              <div className="about-label-row">
                <span className="vertical-text">Atölye Felsefesi</span>
                <p>
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
                  src="/images/about_interior.png"
                  alt="Atmospheric architectural interior DEQOIN philosophy masterpiece"
                />
              </div>
            </div>
          </div>
        </div>
        </section>

        <section className="team-section snap-section homepage-section homepage-team-section" id="departman-ekipleri">
        <div className="section-inner homepage-section-inner">
          <div className="section-heading projects-heading">
            <div>
              <h2>Departman Ekipleri</h2>
              <div className="section-line" />
            </div>
          </div>
          <div className="team-mobile-slider team-home-mobile-slider" onTouchStart={handleTeamTouchStart} onTouchEnd={handleTeamTouchEnd}>
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

          <div className="homepage-section-cta">
            <Link href="/departman-ekipleri" className="premium-all-btn">
              <span className="premium-btn-text">TÜM EKİPLERİ GÖR</span>
              <span className="material-symbols-outlined premium-btn-icon">east</span>
            </Link>
          </div>
        </div>
        </section>
      </div>

      <ProjectInsightPanel project={selectedProject} onClose={() => setActiveProjectPanelSlug(null)} />

      <ConsultationModal 
        isOpen={isConsultationOpen} 
        onClose={() => setIsConsultationOpen(false)} 
      />
    </main>
  );
}
