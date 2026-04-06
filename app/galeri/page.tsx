"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { projectsData } from "../../data/projects";

const categories = [
  { key: "all", title: "HEPSİ" },
  { key: "konut", title: "KONUT" },
  { key: "ticari", title: "TİCARİ" },
  { key: "ic-mimari", title: "İÇ MİMARİ" },
  { key: "restorasyon", title: "RESTORASYON" },
] as const;

export default function AllProjects() {
  const searchParams = useSearchParams();
  const materialParam = searchParams.get("material");
  
  const [activeFilter, setActiveFilter] = useState<(typeof categories)[number]["key"]>("all");
  const [searchTerm, setSearchTerm] = useState("");

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

  return (
    <main className="site-shell project-detail-shell" style={{ paddingTop: "8rem" }}>
      <div className="section-inner" style={{ paddingBottom: "6rem" }}>
        <div style={{ marginBottom: "3rem", textAlign: "center" }}>
          <h1 style={{ fontFamily: "var(--font-smooch), sans-serif", fontSize: "clamp(4rem, 10vw, 8rem)", fontWeight: 100, color: "#fff", letterSpacing: "0.2em", textTransform: "uppercase", margin: 0 }}>GALERİ</h1>
          <p style={{ fontFamily: "var(--font-display), sans-serif", fontSize: "0.8rem", letterSpacing: "0.4em", fontWeight: 300, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", marginTop: "1rem" }}>
            Tüm Çalışmalarımız
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem", marginBottom: "4rem" }}>
          <div className="search-container" style={{ width: "100%", maxWidth: "400px", position: "relative" }}>
            <span className="material-symbols-outlined" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.5)", fontSize: "1.2rem" }}>search</span>
            <input 
              type="text" 
              placeholder="Galeri, Şehir veya Detay Ara..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: "100%", padding: "1rem 1rem 1rem 3rem", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "30px", color: "white", outline: "none", fontFamily: "var(--font-body)" }}
            />
          </div>

          <div className="filter-bar" style={{ justifyContent: "center" }}>
            {categories.map((filter) => (
              <button
                key={filter.key}
                type="button"
                className={`filter-button ${activeFilter === filter.key ? "active" : ""}`}
                onClick={() => setActiveFilter(filter.key)}
              >
                <span className="filter-border" style={{ borderColor: 'rgba(255,255,255,0.2)' }} />
                <span className="filter-text" style={{ color: 'white' }}>{filter.title}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="project-grid">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <Link href={`/galeri/${project.slug}`} className="project-card" key={project.slug}>
                <img src={project.coverImage} alt={project.title} />
                <div className="project-overlay" />
                <h4>{project.title}</h4>
                <p className="vertical-text">{project.label}</p>
              </Link>
            ))
          ) : (
            <p style={{ textAlign: "center", color: "rgba(255,255,255,0.5)", width: "100%", gridColumn: "1 / -1", minHeight: "20vh" }}>Aradığınız kriterlere veya kelimeye uygun içerik bulunamadı.</p>
          )}
        </div>
      </div>
    </main>
  );
}
