"use client";

import { useState, useMemo, useEffect } from "react";
import { ProjectDetail, Category } from "../data/projects";
import ConsultationModal from "./ConsultationModal";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface DepartmentStudioProps {
  title: string;
  subtitle: string;
  description?: string;
  heroImage: string;
  images?: string[];
  projects: ProjectDetail[];
  categories?: { label: string; value: Category | string }[];
  process?: { title: string; desc: string }[];
  focusAreas?: { title: string; icon: string; desc: string }[];
}

const FALLBACK_SLIDES = [
  "/images/slider/mimari_slide.png",
  "/images/projects/gallery_1.png",
  "/images/slider/tasarim_slide.png",
  "/images/projects/gallery_2.png",
  "/images/slider/uygulama_slide.png",
];

const DEFAULT_CATEGORIES: { label: string; value: Category | string }[] = [
  { label: "TÜM PROJELER", value: "ALL" },
  { label: "LÜKS KONUT", value: "luks-konut" },
  { label: "TİCARİ YAPI", value: "ticari-yapi" },
  { label: "KARMA KULLANIM", value: "karma-kullanim" },
  { label: "KURUMSAL ALAN", value: "kurumsal-alan" },
  { label: "BUTİK OTEL", value: "butik-otel" },
  { label: "KÜLTÜR YAPISI", value: "kultur-yapisi" },
];

export default function DepartmentStudio({ 
  title, 
  subtitle, 
  description,
  heroImage, 
  images, 
  projects, 
  categories,
  process,
  focusAreas
}: DepartmentStudioProps) {
  const displayCategories = categories || DEFAULT_CATEGORIES;
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category | string>("ALL");
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroSlides = images && images.length > 0 ? images : [heroImage, ...FALLBACK_SLIDES.filter(img => img !== heroImage)];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "ALL" || project.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [projects, searchQuery, activeCategory]);

  const handleCategorySelect = (category: Category | string) => {
    setActiveCategory(category);
    setIsMobileDrawerOpen(false);
    if (window.innerWidth < 1024) {
      const gallery = document.querySelector('.studio-gallery');
      gallery?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="studio-page">
      {/* FULL-SCREEN HERO SLIDER */}
      <section className="studio-hero">
        <div className="studio-hero-slider">
          {heroSlides.map((img: string, idx: number) => (
            <div 
              key={idx} 
              className={`studio-hero-slide ${idx === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
        </div>

        <div className="studio-hero-blur-overlay" />
        <div className="studio-hero-dark-overlay" />

        <div className="studio-hero-content">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-small-label" 
            style={{ color: "#cca883", marginBottom: "1rem", display: "inline-block", letterSpacing: "0.2em" }}
          >
            DEQOIN | DESIGN STUDIO
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {subtitle}
          </motion.p>
          <div className="studio-hero-line" />
        </div>
      </section>

      {/* RICH CONTENT SECTION: VISION & PROCESS */}
      <section className="rich-service-content">
        <div className="rich-content-inner">
          {description && (
            <div className="service-vision-block">
               <div className="vision-header">
                 <span className="vision-tag">HİZMET VİZYONU</span>
                 <h2 className="vision-title">Fikirlerin Mimari Gerçekliğe Dönüşümü</h2>
               </div>
               <p className="vision-text">{description}</p>
            </div>
          )}

          {process && process.length > 0 && (
            <div className="service-process-block">
              <h3 className="process-main-title">İŞ SÜRECİMİZ</h3>
              <div className="process-grid">
                {process.map((step, idx) => (
                  <div key={idx} className="process-card">
                    <span className="process-num">0{idx + 1}</span>
                    <h4 className="process-step-title">{step.title}</h4>
                    <p className="process-step-desc">{step.desc}</p>
                    <div className="process-step-line" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {focusAreas && focusAreas.length > 0 && (
            <div className="service-focus-block">
               <div className="focus-grid">
                  {focusAreas.map((area, idx) => (
                    <div key={idx} className="focus-card">
                      <span className="material-symbols-outlined focus-icon">{area.icon}</span>
                      <div className="focus-info">
                        <h4>{area.title}</h4>
                        <p>{area.desc}</p>
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          )}
        </div>
      </section>

      {/* SEARCH & MOBILE FILTER BAR */}
      <div className="studio-search-container">
        <div className="studio-search-bar">
          <span className="material-symbols-outlined">search</span>
          <input 
            type="text" 
            placeholder="Proje ara (örn: Skyline, Rezidans...)" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button 
          className="mobile-filter-toggle"
          onClick={() => setIsMobileDrawerOpen(true)}
        >
          <span className="material-symbols-outlined">tune</span>
          FİLTRELE
          {activeCategory !== "ALL" && <span className="active-dot"></span>}
        </button>
      </div>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {isMobileDrawerOpen && (
          <>
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="studio-mobile-drawer-overlay active" 
               onClick={() => setIsMobileDrawerOpen(false)} 
            />
            <motion.div 
               initial={{ x: "100%" }}
               animate={{ x: 0 }}
               exit={{ x: "100%" }}
               transition={{ type: "spring", damping: 25, stiffness: 200 }}
               className="studio-mobile-drawer active"
            >
              <div className="drawer-header">
                <h3>KATEGORİLER</h3>
                <button className="drawer-close" onClick={() => setIsMobileDrawerOpen(false)}>
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="drawer-content">
                <ul className="mobile-filter-list">
                  {displayCategories.map((cat) => (
                    <li key={cat.value} className="mobile-filter-item">
                      <button 
                        className={`mobile-filter-button ${activeCategory === cat.value ? 'active' : ''}`}
                        onClick={() => handleCategorySelect(cat.value)}
                      >
                        {cat.label}
                        {activeCategory === cat.value && <span className="material-symbols-outlined">check_small</span>}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="drawer-footer">
                <button className="hero-cta" onClick={() => {
                  setIsMobileDrawerOpen(false);
                  setIsConsultationOpen(true);
                }}>
                  <span className="hero-cta-text">RANDEVU TALEP ET</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="studio-main">
        {/* SIDEBAR FILTERS (DESKTOP) */}
        <aside className="studio-sidebar">
          <div className="filter-group">
            <h4 style={{ letterSpacing: "0.2em", fontSize: "0.7rem", color: "#a68966", marginBottom: "2rem" }}>KATEGORİLER</h4>
            <ul className="filter-list">
              {displayCategories.map((cat) => (
                <li key={cat.value} className="filter-item">
                  <button 
                    className={`filter-button ${activeCategory === cat.value ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat.value)}
                  >
                    {cat.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="filter-group" style={{ marginTop: "4rem" }}>
            <h4 style={{ letterSpacing: "0.2em", fontSize: "0.7rem", color: "#a68966", marginBottom: "1rem" }}>RANDEVU PLANI</h4>
            <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", lineHeight: "1.6", marginBottom: "2rem" }}>
              Projeniz için profesyonel bir yaklaşım mı arıyorsunuz? Uzman ekibimizle süreci hemen planlayın.
            </p>
            <button className="hero-cta" onClick={() => setIsConsultationOpen(true)}>
              <span className="hero-cta-text">RANDEVU TALEP ET</span>
            </button>
          </div>
        </aside>

        {/* GALLERY GRID */}
        <div className="studio-gallery">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <div key={project.slug} className="project-card-interactive">
                <div className="project-card-img">
                  <img src={project.coverImage} alt={project.title} />
                  <div className="project-card-badge">{project.label}</div>
                </div>
                
                <div className="project-card-info">
                  <h3>{project.title}</h3>
                  <div className="project-meta-row">
                    <div className="meta-item"><label>MÜŞTERİ</label><span>{project.client}</span></div>
                    <div className="meta-item"><label>YIL</label><span>{project.year}</span></div>
                    <div className="meta-item"><label>ALAN</label><span>{project.area}</span></div>
                  </div>
                  <div className="project-story-section">
                    <div className="story-block"><h5>MİMARİ VİZYON</h5><p>{project.vision}</p></div>
                    <div className="story-block"><h5>TEKNİK DETAYLAR</h5><p>{project.techDetails}</p></div>
                  </div>
                  <div className="project-card-footer">
                    <button className="project-action-btn" onClick={() => setIsConsultationOpen(true)}>
                      SÜRECİ BAŞLAT <span className="material-symbols-outlined">arrow_right_alt</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-projects">Aramanızla eşleşen proje bulunamadı.</div>
          )}
        </div>
      </div>

      <ConsultationModal 
        isOpen={isConsultationOpen} 
        onClose={() => setIsConsultationOpen(false)} 
      />


      <style jsx>{`
        .rich-service-content { background: #080808; padding: 10rem 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .rich-content-inner { max-width: 1400px; margin: 0 auto; padding: 0 5%; display: flex; flex-direction: column; gap: 8rem; }
        
        .service-vision-block { display: grid; grid-template-columns: 1fr 1.5fr; gap: 4rem; align-items: start; }
        .vision-tag { color: #a68966; font-size: 0.7rem; letter-spacing: 0.3em; font-weight: 800; }
        .vision-title { color: #fff; font-family: var(--font-display), sans-serif; font-size: 2.5rem; margin-top: 1rem; line-height: 1.2; letter-spacing: 0.05em; }
        .vision-text { color: rgba(255,255,255,0.6); font-size: 1.1rem; line-height: 1.8; white-space: pre-line; }

        .service-process-block { display: flex; flex-direction: column; gap: 4rem; }
        .process-main-title { color: #a68966; font-size: 0.75rem; letter-spacing: 0.4em; text-align: center; }
        .process-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; }
        .process-card { position: relative; padding: 2.5rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); transition: 0.4s; }
        .process-num { font-family: var(--font-display), sans-serif; font-size: 3rem; color: rgba(166,137,102,0.1); position: absolute; top: 1rem; right: 1rem; }
        .process-step-title { color: #fff; font-size: 1rem; margin-bottom: 1rem; letter-spacing: 0.1em; }
        .process-step-desc { color: rgba(255,255,255,0.4); font-size: 0.85rem; line-height: 1.6; }
        .process-step-line { width: 40px; height: 1px; background: #a68966; margin-top: 2rem; }
        .process-card:hover { border-color: #a68966; background: rgba(166,137,102,0.03); transform: translateY(-10px); }

        .service-focus-block { background: rgba(166,137,102,0.03); padding: 5rem; border-radius: 2rem; }
        .focus-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4rem; }
        .focus-card { display: flex; gap: 2rem; align-items: start; }
        .focus-icon { color: #a68966; font-size: 2.5rem; }
        .focus-info h4 { color: #fff; font-size: 0.9rem; letter-spacing: 0.1em; margin-bottom: 0.75rem; }
        .focus-info p { color: rgba(255,255,255,0.4); font-size: 0.8rem; line-height: 1.6; }

        .no-projects { text-align: center; padding: 10rem 0; color: rgba(255,255,255,0.2); letter-spacing: 0.1em; }

        @media (max-width: 1024px) {
          .service-vision-block { grid-template-columns: 1fr; gap: 2rem; }
          .process-grid { grid-template-columns: 1fr 1fr; }
          .focus-grid { grid-template-columns: 1fr; gap: 3rem; }
          .service-focus-block { padding: 3rem 2rem; }
        }
      `}</style>
    </div>
  );
}
