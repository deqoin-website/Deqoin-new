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
    <main className="site-shell project-detail-shell galeri-page gallery-vertical-shell" style={{ paddingTop: "8rem" }}>
      <div className="section-inner" style={{ paddingBottom: "6rem" }}>
        
        {/* HEADER SECTION */}
        <div className="galeri-header-section gallery-snap-point">
          <h1 className="galeri-title">GALERİ</h1>
          <p className="galeri-subtitle">
            Tüm Çalışmalarımız & Portfolyo
          </p>
        </div>

        {/* SEARCH & MOBILE FILTER BAR */}
        <div className="studio-search-container gallery-snap-point" style={{ position: 'sticky', top: '80px', zIndex: 100, background: 'rgba(10,10,10,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '4rem' }}>
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
          <div className="drawer-header">
            <h3>KATEGORİLER</h3>
            <button className="drawer-close" onClick={() => setIsMobileDrawerOpen(false)}>
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
