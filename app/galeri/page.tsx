"use client";

import { useState, useMemo, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ProjectInsightPanel from "../../components/ProjectInsightPanel";
import { ProjectDetail } from "../../data/projects";

const categories = [
  { key: "all", title: "HEPSİ", sideLabel: "Selection" },
  { key: "konut", title: "KONUT", sideLabel: "Residential" },
  { key: "ticari", title: "TİCARİ", sideLabel: "Commercial" },
  { key: "ic-mimari", title: "İÇ MİMARİ", sideLabel: "Interiors" },
  { key: "restorasyon", title: "RESTORASYON", sideLabel: "Revival" },
  { key: "karma-kullanim", title: "KARMA KULLANIM", sideLabel: "Mixed-Use" },
  { key: "kurursal-alan", title: "KURUMSAL", sideLabel: "Corporate" },
  { key: "butik-otel", title: "OTEL", sideLabel: "Boutique" },
  { key: "kultur-yapisi", title: "KÜLTÜR", sideLabel: "Culture" },
  { key: "peyzaj", title: "PEYZAJ", sideLabel: "Landscape" },
] as const;

function GaleriContent() {
  const searchParams = useSearchParams();
  const materialParam = searchParams?.get("material") ?? null;
  
  const [projectsData, setProjectsData] = useState<ProjectDetail[]>([]);
  const [activeFilter, setActiveFilter] = useState<(typeof categories)[number]["key"]>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeProjectSlug, setActiveProjectSlug] = useState<string | null>(null);

  // Fetch projects from MongoDB
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        setProjectsData(data);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    let result = projectsData;
    
    // Category filter
    if (activeFilter !== "all" && !materialParam) {
      result = result.filter(p => p.category === activeFilter);
    }
    
    // Material filter (from URL)
    if (materialParam) {
      result = result.filter(p => p.materials?.includes(materialParam));
    }
    
    // Search filter
    if (searchTerm.trim() !== "") {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(lowerSearch) || 
        p.description.toLowerCase().includes(lowerSearch)
      );
    }
    
    return result;
  }, [activeFilter, searchTerm, materialParam]);

  const selectedProject = useMemo(
    () => filteredProjects.find((project) => project.slug === activeProjectSlug) ?? null,
    [activeProjectSlug, filteredProjects],
  );

  useEffect(() => {
    if (!activeProjectSlug) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [activeProjectSlug]);

  const handleCategorySelect = (key: (typeof categories)[number]["key"]) => {
    setActiveFilter(key);
    setIsMobileDrawerOpen(false);
  };

  return (
    <main className="site-shell project-detail-shell galeri-page gallery-vertical-shell">
      <div className="section-inner" style={{ paddingBottom: "6rem" }}>
        
        {/* HEADER SECTION */}
        <div className="galeri-header-section gallery-snap-point">
          <h1 className="galeri-title">GALERİ</h1>
          <p className="galeri-subtitle">
            Tüm Çalışmalarımız & Portfolyo
          </p>
        </div>

        {/* SEARCH & MOBILE FILTER BAR */}
        <div className="studio-search-container gallery-snap-point galeri-filter-bar" style={{ position: 'sticky', top: '80px', zIndex: 100, background: 'rgba(10,10,10,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '4rem' }}>
          <div className="studio-search-bar">
            <span className="material-symbols-outlined">search</span>
            <input 
              type="text" 
              placeholder="Galeri, Şehir veya Detay Ara..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button 
            className="mobile-filter-toggle"
            onClick={() => setIsMobileDrawerOpen(true)}
          >
            <span className="material-symbols-outlined">tune</span>
            FİLTRELE
            {activeFilter !== "all" && <span className="active-dot"></span>}
          </button>
        </div>

        {/* MOBILE DRAWER */}
        <div className={`studio-mobile-drawer-overlay ${isMobileDrawerOpen ? 'active' : ''}`} onClick={() => setIsMobileDrawerOpen(false)} />
        <div className={`studio-mobile-drawer ${isMobileDrawerOpen ? 'active' : ''}`}>
          <div className="drawer-header galeri-drawer-header">
            <h3>KATEGORİLER</h3>
            <button className="drawer-close galeri-drawer-close" onClick={() => setIsMobileDrawerOpen(false)} aria-label="Filtreleri kapat">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="drawer-content">
            <ul className="mobile-filter-list">
              {categories.map((filter) => (
                <li key={filter.key} className="mobile-filter-item">
                  <button 
                    className={`mobile-filter-button ${activeFilter === filter.key ? 'active' : ''}`}
                    onClick={() => handleCategorySelect(filter.key)}
                  >
                    {filter.title}
                    {activeFilter === filter.key && <span className="material-symbols-outlined">check_small</span>}
                  </button>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className="studio-main">
          
          {/* SIDEBAR (DESKTOP) */}
          <aside className="studio-sidebar" style={{ position: 'sticky', top: '180px' }}>
            <div className="filter-group">
              <h4 style={{ fontSize: '0.7rem', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.3)', marginBottom: '2rem' }}>KATEGORİLER</h4>
              <ul className="filter-list" style={{ listStyle: 'none', padding: 0 }}>
                {categories.map((filter) => (
                  <li key={filter.key} style={{ marginBottom: '1rem' }}>
                    <button 
                      className={`filter-button ${activeFilter === filter.key ? "active" : ""}`}
                      onClick={() => setActiveFilter(filter.key)}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: activeFilter === filter.key ? '#fff' : 'rgba(255,255,255,0.4)',
                        fontFamily: 'var(--font-display)',
                        fontSize: '0.8rem',
                        letterSpacing: '0.2em',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem'
                      }}
                    >
                      <span style={{ 
                        width: '4px', 
                        height: '4px', 
                        borderRadius: '50%', 
                        background: '#cca883', 
                        opacity: activeFilter === filter.key ? 1 : 0,
                        transition: 'all 0.3s ease'
                      }} />
                      {filter.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

          </aside>

          {/* PROJECT GRID */}
          <div className="project-grid project-grid-sensory" style={{ marginTop: 0 }}>
            {isLoading ? (
               <div style={{ textAlign: "center", padding: "10rem 0", gridColumn: '1/-1', color: '#cca883' }}>YÜKLENİYOR...</div>
            ) : filteredProjects.length > 0 ? (
               filteredProjects.map((project) => (
                <button
                  type="button"
                  className="project-card project-card-trigger project-card-gallery-sensory gallery-snap-point"
                  key={project.slug}
                  onClick={() => setActiveProjectSlug(project.slug)}
                  aria-label={`${project.title} proje bilgisini aç`}
                >
                  <img src={project.coverImage} alt={project.title} />
                  <div className="project-overlay" />
                  <div className="project-slide-glow" />
                  <h4>{project.title}</h4>
                  <p className="vertical-text">{project.label}</p>
                </button>
              ))
            ) : (
              <div style={{ textAlign: "center", padding: "10rem 0", color: "rgba(255,255,255,0.3)", gridColumn: '1/-1' }}>
                <span className="material-symbols-outlined" style={{ fontSize: "3rem", marginBottom: "1rem" }}>search_off</span>
                <p>Aradığınız kriterlere uygun proje bulunamadı.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <ProjectInsightPanel project={selectedProject} onClose={() => setActiveProjectSlug(null)} />

      <style jsx>{`
        .galeri-page {
          background: #080808;
          color: #fff;
          padding-top: 12rem;
        }

        .galeri-header-section {
          margin-bottom: 2rem;
        }

        .galeri-title {
          font-family: var(--font-display), sans-serif;
          font-size: clamp(2.6rem, 7vw, 5.5rem);
          font-weight: 200;
          letter-spacing: 0.1em;
          color: #fff;
          line-height: 0.95;
          margin: 0;
          text-transform: uppercase;
        }

        .galeri-subtitle {
          color: #cca883;
          max-width: 30rem;
          line-height: 1.6;
          letter-spacing: 0.35em;
          font-size: 0.72rem;
          text-transform: uppercase;
          margin-top: 1rem;
        }

        .galeri-page .studio-search-container {
          background: rgba(8, 8, 8, 0.82) !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .galeri-page .studio-search-bar {
          background: rgba(18, 18, 18, 0.9);
        }

        .galeri-page .studio-search-bar input,
        .galeri-page .studio-search-bar input::placeholder,
        .galeri-page .studio-search-bar .material-symbols-outlined {
          color: #cca883;
        }

        .galeri-page .mobile-filter-toggle,
        .galeri-page .filter-button,
        .galeri-page .mobile-filter-button,
        .galeri-page .drawer-header h3 {
          color: #fff;
        }

        .galeri-page .filter-group h4,
        .galeri-page .mobile-filter-button:hover,
        .galeri-page .filter-button:hover,
        .galeri-page .mobile-filter-button .material-symbols-outlined,
        .galeri-page .filter-button.active::after {
          color: #cca883;
        }

        .galeri-page .project-card-gallery-sensory h4,
        .galeri-page .project-card-gallery-sensory .vertical-text {
          color: #fff;
          text-shadow: 0 2px 18px rgba(0, 0, 0, 0.35);
        }

        .galeri-page .project-card-gallery-sensory .project-overlay {
          background: linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.68));
        }

        .galeri-page .project-card-gallery-sensory .project-slide-glow {
          filter: blur(0px);
          opacity: 0.85;
        }

        .galeri-page .project-detail-sheet {
          color: #fff;
        }

        @media (max-width: 1024px) {
          .galeri-page .project-grid {
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          }
        }

        @media (max-width: 767px) {
          .galeri-page {
            overflow-x: hidden;
            padding-top: 9rem;
          }

          .galeri-page .section-inner {
            padding-top: 3.5rem;
            padding-left: 1rem;
            padding-right: 1rem;
          }

          .galeri-header-section {
            margin-bottom: 1.5rem;
          }

          .galeri-title {
            font-size: clamp(2.2rem, 12vw, 3.4rem);
            letter-spacing: 0.08em;
          }

          .galeri-subtitle {
            font-size: 0.62rem;
            letter-spacing: 0.28em;
            max-width: 100%;
          }

          .galeri-page .studio-search-container {
            position: sticky !important;
            top: 6rem !important;
            margin-bottom: 2rem;
            padding-left: 0;
            padding-right: 0;
            z-index: 110;
          }

          .galeri-page .studio-search-bar {
            padding: 0.35rem 1rem;
          }

          .galeri-page .studio-search-bar input {
            font-size: 0.85rem;
            letter-spacing: 0.04em;
          }

          .galeri-page .mobile-filter-toggle {
            width: 100%;
            padding: 1rem;
            letter-spacing: 0.22em;
          }

          .galeri-page .studio-main {
            gap: 1.5rem;
          }

          .galeri-page .studio-sidebar {
            display: none;
          }

          .galeri-page .project-grid.project-grid-sensory {
            width: 100%;
            margin-left: 0;
            margin-right: 0;
            padding: 0;
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .galeri-page .project-card-gallery-sensory {
            height: 72svh;
            min-height: 72svh;
            border-radius: 1.1rem !important;
          }

          .galeri-page .project-card-gallery-sensory h4 {
            left: 0.9rem;
            right: auto;
            bottom: 1.15rem;
            font-size: 1rem;
            max-width: 68vw;
            text-align: left;
          }

          .galeri-page .project-card-gallery-sensory p,
          .galeri-page .project-card-gallery-sensory .vertical-text {
            top: 0.9rem;
            right: 0.9rem;
            bottom: auto;
            left: auto;
            font-size: 0.56rem;
            letter-spacing: 0.34em;
            max-width: min(45vw, 10rem);
            text-align: right;
          }

          .galeri-page .studio-mobile-drawer {
            width: min(88vw, 340px);
            z-index: 2200;
          }

          .galeri-page .studio-mobile-drawer-overlay {
            z-index: 2190;
          }

          .galeri-page .galeri-drawer-header {
            padding: 6.5rem 1.25rem 1.5rem;
          }

          .galeri-page .galeri-drawer-close {
            width: 2.75rem;
            height: 2.75rem;
            display: grid;
            place-items: center;
            color: #fff;
            border: 1px solid rgba(255,255,255,0.12);
            background: rgba(255,255,255,0.04);
            border-radius: 999px;
          }

          .galeri-page .galeri-drawer-close .material-symbols-outlined {
            color: #fff;
            font-size: 1.25rem;
          }

          .galeri-page .studio-mobile-drawer-overlay {
            top: 0;
          }
        }
      `}</style>
    </main>
  );
}

export default function AllProjects() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0a0a0a' }}></div>}>
      <GaleriContent />
    </Suspense>
  );
}
