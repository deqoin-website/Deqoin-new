"use client";

import { useState, useMemo, useEffect } from "react";
import { ProjectDetail, Category } from "../data/projects";
import ConsultationModal from "./ConsultationModal";

interface DepartmentStudioProps {
  title: string;
  subtitle: string;
  heroImage: string;
  images?: string[];
  projects: ProjectDetail[];
  categories?: { label: string; value: Category | string }[];
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

export default function DepartmentStudio({ title, subtitle, heroImage, images, projects, categories }: DepartmentStudioProps) {
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
    // Smooth scroll to results on mobile if background is scrolled
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
          <span className="section-small-label" style={{ color: "#cca883", marginBottom: "1rem", display: "block" }}>
            EXCELLENCE IN DESIGN
          </span>
          <h1>{title}</h1>
          <p>{subtitle}</p>
          <div className="studio-hero-line" />
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

        {/* MOBILE FILTER TOGGLE */}
        <button 
          className="mobile-filter-toggle"
          onClick={() => setIsMobileDrawerOpen(true)}
        >
          <span className="material-symbols-outlined">tune</span>
          FİLTRELE
          {activeCategory !== "ALL" && <span className="active-dot"></span>}
        </button>
      </div>

      {/* MOBILE DRAWER (OFF-CANVAS) */}
      <div className={`studio-mobile-drawer-overlay ${isMobileDrawerOpen ? 'active' : ''}`} onClick={() => setIsMobileDrawerOpen(false)} />
      <div className={`studio-mobile-drawer ${isMobileDrawerOpen ? 'active' : ''}`}>
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
          <p>Uzman ekibimizle profesyonel sürecinizi hemen planlayın.</p>
          <button className="hero-cta" onClick={() => {
            setIsMobileDrawerOpen(false);
            setIsConsultationOpen(true);
          }}>
            <span className="hero-cta-text">RANDEVU TALEP ET</span>
            <div className="hero-cta-circle">
              <span className="material-symbols-outlined">event_available</span>
            </div>
          </button>
        </div>
      </div>

      <div className="studio-main">
        {/* SIDEBAR FILTERS (DESKTOP) */}
        <aside className="studio-sidebar">
          <div className="filter-group">
            <h4>KATEGORİLER</h4>
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
            <h4>RANDEVU PLANI</h4>
            <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", lineHeight: "1.6", marginBottom: "2rem" }}>
              Projeniz için profesyonel bir yaklaşım mı arıyorsunuz? Uzman ekibimizle süreci hemen planlayın.
            </p>
            <button className="hero-cta" onClick={() => setIsConsultationOpen(true)}>
              <span className="hero-cta-text">RANDEVU TALEP ET</span>
              <div className="hero-cta-circle">
                <span className="material-symbols-outlined">event_available</span>
              </div>
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
                    <div className="meta-item">
                      <label>MÜŞTERİ</label>
                      <span>{project.client}</span>
                    </div>
                    <div className="meta-item">
                      <label>YIL</label>
                      <span>{project.year}</span>
                    </div>
                    <div className="meta-item">
                      <label>ALAN</label>
                      <span>{project.area}</span>
                    </div>
                  </div>

                  <div className="project-story-section">
                    <div className="story-block">
                      <h5>MİMARİ VİZYON</h5>
                      <p>{project.vision}</p>
                    </div>
                    <div className="story-block">
                      <h5>TEKNİK DETAYLAR</h5>
                      <p>{project.techDetails}</p>
                    </div>
                    <div className="story-block">
                      <h5>MEKANSAL KURGU</h5>
                      <p>{project.story}</p>
                    </div>
                  </div>

                  <div className="project-card-footer">
                    <button className="project-action-btn" onClick={() => setIsConsultationOpen(true)}>
                      SÜRECİ BAŞLAT
                      <span className="material-symbols-outlined">arrow_right_alt</span>
                    </button>
                    <span style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em" }}>
                      DEQOIN © {project.year}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: "center", padding: "10rem 0", color: "rgba(255,255,255,0.3)" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "3rem", marginBottom: "1rem" }}>search_off</span>
              <p>Aramanızla eşleşen bir proje bulunamadı.</p>
            </div>
          )}
        </div>
      </div>

      <ConsultationModal 
        isOpen={isConsultationOpen} 
        onClose={() => setIsConsultationOpen(false)} 
      />
    </div>
  );
}
