"use client";

import { useState, useMemo, useEffect } from "react";
import { ProjectDetail, Category } from "../data/projects";
import ConsultationModal from "./ConsultationModal";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ProjectInsightPanel from "./ProjectInsightPanel";
import HeroSlider from "./HeroSlider";
import StudioWorkflow from "./StudioWorkflow";
import { MIMARI_WORKFLOW, MATERIAL_WORKFLOW, UYGULAMA_WORKFLOW } from "../data/workflows";

interface DepartmentStudioProps {
  title: string;
  subtitle: string;
  eyebrow?: string;
  heroImage: string;
  mediaType?: 'image' | 'video';
  heroBlur?: number;
  heroOverlay?: number;
  images?: string[];
  projects: ProjectDetail[];
  categories?: { label: string; value: Category | string }[];
  focusAreas?: { title: string; icon: string; desc: string }[];
  products?: { title: string; image: string; category?: string; desc: string; price?: string; link?: string }[];
  workflowType?: 'design' | 'material' | 'execution';
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
  eyebrow = "DEQOIN | DESIGN STUDIO",
  heroImage, 
  mediaType = 'image',
  heroBlur = 0,
  heroOverlay = 30,
  images, 
  projects, 
  categories,
  focusAreas,
  products,
  workflowType = 'design'
}: DepartmentStudioProps) {
  const displayCategories = categories || DEFAULT_CATEGORIES;
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category | string>("ALL");
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [activeProjectSlug, setActiveProjectSlug] = useState<string | null>(null);
  const [activeProductCategory, setActiveProductCategory] = useState<string>("ALL");
  
  const heroSlides = images && images.length > 0 ? images : [heroImage, ...FALLBACK_SLIDES.filter(img => img !== heroImage)];

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "ALL" || project.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [projects, searchQuery, activeCategory]);

  const selectedProject = useMemo(
    () => filteredProjects.find((project) => project.slug === activeProjectSlug) ?? null,
    [activeProjectSlug, filteredProjects],
  );

  const productCategories = useMemo(() => {
    if (!products) return ["ALL"];
    const cats = new Set(products.map(p => p.category).filter((c): c is string => !!c));
    return ["ALL", ...Array.from(cats)];
  }, [products]);

  const filteredProductsList = useMemo(() => {
    if (!products) return [];
    if (activeProductCategory === "ALL") return products;
    return products.filter(p => p.category === activeProductCategory);
  }, [products, activeProductCategory]);

  useEffect(() => {
    if (!activeProjectSlug) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [activeProjectSlug]);

  const handleCategorySelect = (category: Category | string) => {
    setActiveCategory(category);
    setIsMobileDrawerOpen(false);
    if (window.innerWidth < 1024) {
      const gallery = document.querySelector('.studio-gallery');
      gallery?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <div className="detail-page-back-nav">
        <Link href="/" className="back-button-horizontal">
          <span className="material-symbols-outlined">arrow_back</span>
          <span>ANASAYFAYA DÖN</span>
        </Link>
      </div>
      <div className="studio-page studio-vertical-shell">
      <HeroSlider 
        slides={heroSlides.map((url, idx) => {
          const isVideo = (idx === 0 && mediaType === 'video') || url.toLowerCase().match(/\.(mp4|webm|ogg)$/) !== null;
          return {
            title: title,
            motto: subtitle,
            mediaUrl: url,
            image: !isVideo ? url : undefined,
            mediaType: isVideo ? 'video' : 'image',
            blur: heroBlur,
            overlay: heroOverlay
          };
        })} 
        onAppointmentClick={() => setIsConsultationOpen(true)}
      />

      {/* WORKFLOW SECTION */}
      <StudioWorkflow 
        steps={
          workflowType === 'material' ? MATERIAL_WORKFLOW(() => setIsConsultationOpen(true)) :
          workflowType === 'execution' ? UYGULAMA_WORKFLOW(() => setIsConsultationOpen(true)) :
          MIMARI_WORKFLOW(() => setIsConsultationOpen(true))
        } 
      />

      {/* RICH CONTENT SECTION: FOCUS AREAS */}
      <section className="rich-service-content studio-snap-point">
        <div className="rich-content-inner">

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

      {/* PRODUCTS SECTION */}
      {products && products.length > 0 && (
        <section className="studio-products-section">
          <div className="products-inner">
            <div className="products-header">
              <span className="section-small-label">ÜRÜN KOLEKSİYONU</span>
              <h2 className="products-section-title">TASARIM DETAYLARDA GİZLİDİR</h2>
              <div className="products-header-line" />
            </div>

            {productCategories.length > 2 && (
              <div className="product-filter-bar">
                {productCategories.map(cat => (
                  <button
                    key={cat}
                    className={`product-filter-chip ${activeProductCategory === cat ? 'active' : ''}`}
                    onClick={() => setActiveProductCategory(cat)}
                  >
                    {cat === 'ALL' ? 'TÜM KOLEKSİYON' : cat.toUpperCase()}
                  </button>
                ))}
              </div>
            )}

            <div className="products-collection-grid">
              {filteredProductsList.map((product, idx) => (
                <div key={idx} className="studio-product-card">
                  <div className="product-card-visual">
                    <img src={product.image} alt={product.title} />
                    <div className="product-card-overlay">
                      <div className="product-hover-content">
                        <p>{product.desc}</p>
                        {product.link && (
                          <Link href={product.link} className="product-more-btn">
                            İNCELE <span className="material-symbols-outlined">north_east</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="product-card-footer">
                    <div className="product-meta-main">
                      <h3>{product.title}</h3>
                      {product.price && <span className="product-price-tag">{product.price}</span>}
                    </div>
                    <div className="product-brand-line" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SEARCH & MOBILE FILTER BAR */}
      <div className="studio-search-container studio-snap-point">
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

        </aside>

        {/* GALLERY GRID */}
        <div className="studio-gallery studio-gallery-sensory">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <div
                key={project.slug}
                className="project-card-interactive project-card-interactive-sensory studio-snap-point"
                role="button"
                tabIndex={0}
                onClick={() => setActiveProjectSlug(project.slug)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setActiveProjectSlug(project.slug);
                  }
                }}
              >
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
                    <button
                      className="project-action-btn"
                      onClick={(event) => {
                        event.stopPropagation();
                        setIsConsultationOpen(true);
                      }}
                    >
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
      <ProjectInsightPanel project={selectedProject} onClose={() => setActiveProjectSlug(null)} />


      <style jsx>{`
        .rich-service-content { background: #080808; padding: 10rem 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #fff; }
        .rich-content-inner { max-width: 1400px; margin: 0 auto; padding: 0 5%; display: flex; flex-direction: column; gap: 8rem; }
        
        .service-vision-block { display: grid; grid-template-columns: 1fr 1.5fr; gap: 4rem; align-items: start; }
        .vision-tag { color: #a68966; font-size: 0.7rem; letter-spacing: 0.3em; font-weight: 800; }
        .vision-title { color: #fff; font-family: var(--font-display), sans-serif; font-size: 2.5rem; margin-top: 1rem; line-height: 1.2; letter-spacing: 0.05em; }
        .vision-text { color: rgba(255,255,255,0.78); font-size: 1.1rem; line-height: 1.8; white-space: pre-line; }

        .service-process-block { display: flex; flex-direction: column; gap: 4rem; }
        .process-main-title { color: #a68966; font-size: 0.75rem; letter-spacing: 0.4em; text-align: center; }
        .process-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; }
        .process-card { position: relative; padding: 2.5rem; background: #080808; border: 1px solid rgba(255,255,255,0.08); transition: 0.4s; }
        .process-num { font-family: var(--font-display), sans-serif; font-size: 3rem; color: rgba(166,137,102,0.1); position: absolute; top: 1rem; right: 1rem; }
        .process-step-title { color: #fff; font-size: 1rem; margin-bottom: 1rem; letter-spacing: 0.1em; }
        .process-step-desc { color: rgba(255,255,255,0.78); font-size: 0.85rem; line-height: 1.6; }
        .process-step-line { width: 40px; height: 1px; background: #a68966; margin-top: 2rem; }
        .process-card:hover { border-color: #a68966; background: rgba(166,137,102,0.03); transform: translateY(-10px); }

        .service-focus-block { background: #080808; padding: 5rem; border-radius: 2rem; border: 1px solid rgba(255,255,255,0.08); }
        .focus-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4rem; }
        .focus-card { display: flex; gap: 2rem; align-items: start; }
        .focus-icon { color: #a68966; font-size: 2.5rem; }
        .focus-info h4 { color: #fff; font-size: 0.9rem; letter-spacing: 0.1em; margin-bottom: 0.75rem; }
        .focus-info p { color: rgba(255,255,255,0.78); font-size: 0.8rem; line-height: 1.6; }

        .no-projects { text-align: center; padding: 10rem 0; color: rgba(255,255,255,0.6); letter-spacing: 0.1em; }

        :global(.studio-page .studio-hero-content h1),
        :global(.studio-page .studio-hero-content p),
        :global(.studio-page .project-card-info h3),
        :global(.studio-page .meta-item span),
        :global(.studio-page .project-action-btn) {
          color: #fff;
        }

        :global(.studio-page .meta-item label),
        :global(.studio-page .story-block p) {
          color: rgba(255,255,255,0.78);
        }

        :global(.studio-page .project-card-interactive-sensory),
        :global(.studio-page .project-card-info) {
          background: #080808;
        }

        :global(.studio-page .project-meta-row) {
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        @media (max-width: 1024px) {
          .service-vision-block { grid-template-columns: 1fr; gap: 2rem; }
          .process-grid { grid-template-columns: 1fr 1fr; }
          .focus-grid { grid-template-columns: 1fr; gap: 3rem; }
          .service-focus-block { padding: 3rem 2rem; }
        }

        @media (max-width: 767px) {
          .rich-service-content { padding: 5.5rem 0; }
          .rich-content-inner { padding: 0 1.25rem; gap: 3rem; }
          .vision-title { font-size: clamp(1.8rem, 9vw, 2.4rem); }
          .vision-text { font-size: 0.95rem; line-height: 1.75; }

          .service-process-block { gap: 1.5rem; }
          .process-grid { grid-template-columns: 1fr; gap: 1rem; }
          .process-card {
            padding: 1.4rem 1.1rem 1.25rem;
            min-width: 0;
            overflow-wrap: anywhere;
          }
          .process-num { font-size: 2.15rem; top: 0.8rem; right: 0.85rem; }
          .process-step-title {
            font-size: 0.9rem;
            line-height: 1.45;
            padding-right: 2.6rem;
          }
          .process-step-desc {
            font-size: 0.8rem;
            line-height: 1.65;
            overflow-wrap: anywhere;
          }
          .process-step-line { margin-top: 1.25rem; }

          .service-focus-block {
            padding: 1.5rem 1.1rem;
            border-radius: 1.25rem;
          }
          .focus-grid { gap: 1.5rem; }
          .focus-card { gap: 1rem; }
          .focus-icon { font-size: 2rem; }
          .focus-info h4 { font-size: 0.85rem; }
          .focus-info p {
            font-size: 0.78rem;
            line-height: 1.6;
            overflow-wrap: anywhere;
          }
        }

        /* NEW PRODUCTS SECTION STYLES */
        .studio-products-section {
          background: #080808;
          padding: 8rem 0 12rem;
          color: #fff;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .products-inner {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 5%;
        }

        .products-header {
          text-align: center;
          margin-bottom: 6rem;
        }

        .products-section-title {
          font-family: var(--font-smooch), sans-serif;
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 100;
          letter-spacing: 0.1em;
          margin-top: 1rem;
          text-transform: uppercase;
        }

        .products-header-line {
          width: 50px;
          height: 1px;
          background: #a68966;
          margin: 2.5rem auto;
        }

        .products-collection-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 3rem;
        }

        .studio-product-card {
           display: flex;
           flex-direction: column;
           gap: 1.5rem;
           transition: 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .product-card-visual {
          position: relative;
          aspect-ratio: 4 / 5;
          overflow: hidden;
          background: #111;
        }

        .product-card-visual img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .product-card-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          opacity: 0;
          transition: 0.4s;
          backdrop-filter: blur(5px);
        }

        .product-hover-content {
          text-align: center;
          transform: translateY(20px);
          transition: 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .product-hover-content p {
          font-size: 0.95rem;
          line-height: 1.8;
          color: rgba(255,255,255,0.8);
          margin-bottom: 2rem;
          font-weight: 300;
        }

        .product-more-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          color: #a68966;
          font-size: 0.75rem;
          letter-spacing: 0.2em;
          font-weight: 700;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #a68966;
        }

        .studio-product-card:hover .product-card-overlay { opacity: 1; }
        .studio-product-card:hover .product-hover-content { transform: translateY(0); }
        .studio-product-card:hover img { transform: scale(1.1) rotate(1deg); }

        .product-card-footer {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .product-meta-main {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }

        .product-card-footer h3 {
          font-family: var(--font-smooch), sans-serif;
          font-size: 1.8rem;
          font-weight: 300;
          letter-spacing: 0.1em;
          color: #fff;
          text-transform: uppercase;
        }

        .product-price-tag {
          font-size: 0.9rem;
          color: #a68966;
          font-family: var(--font-display);
          font-weight: 400;
        }

        .product-brand-line {
          width: 100%;
          height: 1px;
          background: linear-gradient(to right, #a68966 0%, rgba(255,255,255,0.05) 100%);
          opacity: 0.6;
        }

        .product-filter-bar {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          margin-bottom: 4rem;
          flex-wrap: wrap;
        }
        .product-filter-chip {
          background: transparent;
          border: 1px solid rgba(166,137,102,0.2);
          color: rgba(255,255,255,0.6);
          padding: 0.6rem 1.4rem;
          border-radius: 4px;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .product-filter-chip:hover { border-color: #a68966; color: #fff; }
        .product-filter-chip.active { background: #a68966; color: #000; border-color: #a68966; box-shadow: 0 5px 15px rgba(166,137,102,0.3); }

        @media (max-width: 1024px) {
          .products-collection-grid { grid-template-columns: 1fr 1fr; gap: 2rem; }
          .studio-product-card { gap: 1rem; }
        }

        @media (max-width: 767px) {
          .studio-products-section { padding: 5rem 0 8rem; }
          .products-header { margin-bottom: 3.5rem; }
          .products-collection-grid { grid-template-columns: 1fr; gap: 3rem; }
          .product-card-visual { aspect-ratio: 1; }
          .product-card-footer h3 { font-size: 1.5rem; }
          .product-card-overlay { padding: 2rem; }
        }
      `}</style>
    </div>
    </>
  );
}
