"use client";

import { useEffect, useMemo, useState } from "react";
import { Category, ProjectDetail } from "../data/projects";
import ConsultationModal from "./ConsultationModal";
import ProjectInsightPanel from "./ProjectInsightPanel";
import ProjectCard from "./ProjectCard";
import ProjectFilterSidebar from "./ProjectFilterSidebar";

type MaterialProjectShowcaseProps = {
  materialSlug?: string;
  executionUnitSlug?: string;
  materialTitle: string;
  projects: ProjectDetail[];
  customCategories?: { label: string; value: string }[];
};

const CATEGORY_LABELS: Record<Category, string> = {
  "luks-konut": "LÜKS KONUT",
  "ticari-yapi": "TİCARİ YAPI",
  "karma-kullanim": "KARMA KULLANIM",
  "kurumsal-alan": "KURUMSAL ALAN",
  "butik-otel": "BUTİK OTEL",
  "kultur-yapisi": "KÜLTÜR YAPISI",
  mimarlik: "MİMARLIK",
  "ic-mimarlik": "İÇ MİMARLIK",
  restorasyon: "RESTORASYON",
  peyzaj: "PEYZAJ",
};

export default function MaterialProjectShowcase({
  materialSlug,
  executionUnitSlug,
  materialTitle,
  projects,
  customCategories,
}: MaterialProjectShowcaseProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [activeProjectSlug, setActiveProjectSlug] = useState<string | null>(null);

  const studioProjects = useMemo(() => {
    if (materialSlug) {
      return projects.filter((project) => project.materials?.includes(materialSlug));
    }
    if (executionUnitSlug) {
      return projects.filter((project) => project.executionUnits?.includes(executionUnitSlug));
    }
    return [];
  }, [projects, materialSlug, executionUnitSlug]);

  const displayCategories = useMemo(() => {
    if (customCategories && customCategories.length > 0) {
      return [{ label: "TÜM PROJELER", value: "ALL" }, ...customCategories];
    }

    const categories = Array.from(new Set(studioProjects.map((project: ProjectDetail) => project.category)));
    return [
      { label: "TÜM PROJELER", value: "ALL" as const },
      ...categories.map((category) => ({
        label: CATEGORY_LABELS[category] ?? (category as string).toUpperCase(),
        value: category,
      })),
    ];
  }, [studioProjects, customCategories]);

  const filteredProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return studioProjects.filter((project: ProjectDetail) => {
      const matchesCategory = activeCategory === "ALL" || project.category === activeCategory;
      const matchesSearch =
        query === "" ||
        [
          project.title,
          project.description,
          project.client,
          project.vision,
          project.techDetails,
          project.story,
          project.label,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, studioProjects, searchQuery]);

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

  useEffect(() => {
    if (!isMobileDrawerOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileDrawerOpen]);

  const handleCategorySelect = (category: string) => {
    setActiveCategory(category);
    setIsMobileDrawerOpen(false);

    if (window.innerWidth < 1024) {
      document.querySelector(".studio-gallery")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (studioProjects.length === 0) {
    return null;
  }

  return (
    <>
      <section className="material-showcase-intro studio-snap-point">
        <span className="section-small-label">SEÇKİLİ PROJELER</span>
        <h2>{materialTitle} ile Hayat Bulan Mekanlar</h2>
        <p>
          Bu birimin hangi proje tiplerinde nasıl görev aldığını, Design Studio alt sayfalarındaki
          detay seviyesiyle inceleyin.
        </p>
      </section>

      <div className="mt-6 lg:hidden">
        <button className="mobile-filter-toggle w-full" onClick={() => setIsMobileDrawerOpen(true)}>
          <span className="material-symbols-outlined">tune</span>
          KATEGORİLER
          {activeCategory !== "ALL" && <span className="active-dot" />}
        </button>
      </div>

      <div
        className={`studio-mobile-drawer-overlay ${isMobileDrawerOpen ? "active" : ""}`}
        onClick={() => setIsMobileDrawerOpen(false)}
      />
      <div className={`studio-mobile-drawer ${isMobileDrawerOpen ? "active" : ""}`}>
        <div className="drawer-header">
          <h3>KATEGORİLER</h3>
          <button className="drawer-close" onClick={() => setIsMobileDrawerOpen(false)}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="drawer-content">
          <ul className="mobile-filter-list">
            {displayCategories.map((category: { label: string; value: string }) => (
              <li key={category.value} className="mobile-filter-item">
                <button
                  className={`mobile-filter-button ${activeCategory === category.value ? "active" : ""}`}
                  onClick={() => handleCategorySelect(category.value)}
                >
                  {category.label}
                  {activeCategory === category.value && (
                    <span className="material-symbols-outlined">check_small</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>

      </div>

      <section className="studio-main material-studio-main">
        <ProjectFilterSidebar
          activeCategory={activeCategory}
          categories={displayCategories.map((category: { label: string; value: string }) => ({
            label: category.label,
            value: category.value,
          }))}
          onCategoryChange={setActiveCategory}
          onSearchChange={setSearchQuery}
          searchPlaceholder={`${materialTitle} odaklı proje veya detay ara...`}
          searchValue={searchQuery}
          title="KATEGORİLER"
        />

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
            <div className="material-showcase-empty">
              <span className="material-symbols-outlined">search_off</span>
              <p>Aramanızla eşleşen bir uygulama bulunamadı.</p>
            </div>
          )}
        </div>
      </section>

      <ConsultationModal isOpen={isConsultationOpen} onClose={() => setIsConsultationOpen(false)} />
      <ProjectInsightPanel project={selectedProject} onClose={() => setActiveProjectSlug(null)} />
    </>
  );
}
