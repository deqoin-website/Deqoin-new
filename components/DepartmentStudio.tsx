"use client";

import { useState, useMemo, useEffect } from "react";
import { ProjectDetail, Category } from "../data/projects";
import ConsultationModal from "./ConsultationModal";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import StudioBackButton from "./StudioBackButton";
import ProjectInsightPanel from "./ProjectInsightPanel";
import ProjectCard from "./ProjectCard";
import ProjectFilterSidebar from "./ProjectFilterSidebar";
import HeroSlider from "./HeroSlider";
import WorkflowSection, { type WorkflowStep } from "./WorkflowSection";
import PageNumberNavigator, { type PageNavItem } from "./PageNumberNavigator";
import { CalendarDays, Compass, Hammer, Layers, PenTool } from "lucide-react";

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

const WORKFLOW_VARIANTS: Record<NonNullable<DepartmentStudioProps["workflowType"]>, WorkflowStep[]> = {
  design: [
    {
      id: "01",
      title: "Randevu",
      description: "İhtiyaçlar, hedefler ve beklentiler tek bir çerçevede toplanır.",
      icon: CalendarDays,
    },
    {
      id: "02",
      title: "Keşif",
      description: "Alan, program ve teknik sınırlar yerinde analiz edilir.",
      icon: Compass,
    },
    {
      id: "03",
      title: "Tasarım",
      description: "Kavramsal dil, mekansal kurgu ve detay kararları birleştirilir.",
      icon: PenTool,
    },
    {
      id: "04",
      title: "Malzeme",
      description: "Yüzey, doku ve ürün seçimleri rafine edilir.",
      icon: Layers,
    },
    {
      id: "05",
      title: "Uygulama",
      description: "Sahada üretim, kontrol ve teslim süreci yönetilir.",
      icon: Hammer,
    },
  ],
  material: [
    {
      id: "01",
      title: "Randevu",
      description: "Malzeme hedefleri, kullanım senaryosu ve bütçe çerçevesi belirlenir.",
      icon: CalendarDays,
    },
    {
      id: "02",
      title: "Keşif",
      description: "Doku, performans ve dayanım ihtiyaçları teknik olarak değerlendirilir.",
      icon: Compass,
    },
    {
      id: "03",
      title: "Tasarım",
      description: "Uygun yüzey ve birleşim kararlarıyla güçlü bir dil kurulur.",
      icon: PenTool,
    },
    {
      id: "04",
      title: "Malzeme",
      description: "Numune, varyasyon ve final seçimler netleştirilir.",
      icon: Layers,
    },
    {
      id: "05",
      title: "Uygulama",
      description: "Seçilen malzemeler kontrollü şekilde projeye aktarılır.",
      icon: Hammer,
    },
  ],
  execution: [
    {
      id: "01",
      title: "Randevu",
      description: "Saha başlangıcı, beklenti ve teslim takvimi planlanır.",
      icon: CalendarDays,
    },
    {
      id: "02",
      title: "Keşif",
      description: "Uygulama sahası, metraj ve üretim koşulları incelenir.",
      icon: Compass,
    },
    {
      id: "03",
      title: "Tasarım",
      description: "Uygulanabilir detaylar ve montaj düzeni netleştirilir.",
      icon: PenTool,
    },
    {
      id: "04",
      title: "Malzeme",
      description: "Tedarik, kalite ve saha koordinasyonu eşleştirilir.",
      icon: Layers,
    },
    {
      id: "05",
      title: "Uygulama",
      description: "İş programı kontrollü biçimde sahaya uygulanır.",
      icon: Hammer,
    },
  ],
};

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
  const workflowSteps = WORKFLOW_VARIANTS[workflowType];
  
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

  const pageNavItems: PageNavItem[] = useMemo(() => {
    const items: PageNavItem[] = [
      { id: "studio-hero", label: "01", title: "HERO" },
      { id: "studio-workflow", label: "02", title: "WORKFLOW" },
      { id: "studio-insights", label: "03", title: "CONTENT" },
    ];

    if (products && products.length > 0) {
      items.push({ id: "studio-products", label: "04", title: "PRODUCTS" });
      items.push({ id: "studio-gallery", label: "05", title: "GALLERY" });
    } else {
      items.push({ id: "studio-gallery", label: "04", title: "GALLERY" });
    }

    return items;
  }, [products]);

  useEffect(() => {
    if (!activeProjectSlug) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [activeProjectSlug]);

  useEffect(() => {
    if (!isMobileDrawerOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileDrawerOpen]);

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
      <StudioBackButton />
      <div className="studio-page studio-vertical-shell">

      <section id="studio-hero">
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
      </section>

      <div className="mt-6 lg:hidden">
        <button
          type="button"
          className="mobile-filter-toggle w-full"
          onClick={() => setIsMobileDrawerOpen(true)}
        >
          <span className="material-symbols-outlined">tune</span>
          KATEGORİLER
          {activeCategory !== "ALL" && <span className="active-dot" />}
        </button>
      </div>

      {/* WORKFLOW SECTION */}
      <section id="studio-workflow">
        <WorkflowSection steps={workflowSteps} className="snap-section" />
      </section>

      {/* RICH CONTENT SECTION: FOCUS AREAS */}
      <section id="studio-insights" className="rich-service-content studio-snap-point">
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
        <section id="studio-products" className="studio-products-section">
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

      <div id="studio-gallery" className="studio-main">
        <ProjectFilterSidebar
          activeCategory={activeCategory}
          categories={displayCategories.map((cat) => ({ label: cat.label, value: String(cat.value) }))}
          onCategoryChange={(value) => setActiveCategory(value)}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Proje ara (örn: Skyline, Rezidans...)"
          searchValue={searchQuery}
          title="KATEGORİLER"
        />

        {/* GALLERY GRID */}
        <div className="studio-gallery studio-gallery-sensory">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <ProjectCard
                key={project.slug}
                image={project.coverImage}
                title={project.title}
                category={project.label}
                onClick={() => setActiveProjectSlug(project.slug)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setActiveProjectSlug(project.slug);
                  }
                }}
              />
            ))
          ) : (
            <div className="no-projects">Aramanızla eşleşen proje bulunamadı.</div>
          )}
        </div>
      </div>

      <PageNumberNavigator items={pageNavItems} className="pb-12" />

      <ConsultationModal 
        isOpen={isConsultationOpen} 
        onClose={() => setIsConsultationOpen(false)} 
      />
      <ProjectInsightPanel project={selectedProject} onClose={() => setActiveProjectSlug(null)} />


      <style jsx global>{`
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
