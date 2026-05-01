"use client";

import { useMemo, useState } from "react";

import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import ProjectInsightPanel from "@/components/ProjectInsightPanel";
import ProjectFilterSidebar, { type FilterGroup } from "@/components/ProjectFilterSidebar";
import { projectsData } from "@/data/projects";

const CATEGORY_LABELS: Record<string, string> = {
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

const DEPARTMENTS = ["HEPSİ", "MİMARİ TASARIM", "MATERYAL STÜDYO", "UYGULAMA HİZMETLERİ", "MÜHENDİSLİK"] as const;

function getCategoryLabel(category: string) {
  return CATEGORY_LABELS[category] ?? category.toUpperCase();
}

export default function GaleriPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("HEPSİ");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("HEPSİ");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProjectSlug, setSelectedProjectSlug] = useState<string | null>(null);

  const categories = useMemo(
    () => ["HEPSİ", ...Array.from(new Set(projectsData.map((project) => getCategoryLabel(project.category))))],
    [],
  );

  const visibleProjects = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return projectsData.filter((project) => {
      const matchCategory = selectedCategory === "HEPSİ" || getCategoryLabel(project.category) === selectedCategory;
      const matchDepartment = selectedDepartment === "HEPSİ" || project.department === selectedDepartment;
      const matchSearch =
        query.length === 0 ||
        [
          project.title,
          project.label,
          project.client,
          project.description,
          project.vision,
          project.techDetails,
          project.story,
          project.department,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);

      return matchCategory && matchDepartment && matchSearch;
    });
  }, [searchTerm, selectedCategory, selectedDepartment]);

  const selectedProject = useMemo(
    () => projectsData.find((project) => project.slug === selectedProjectSlug) ?? null,
    [selectedProjectSlug],
  );

  const filterGroups: FilterGroup[] = [
    {
      title: "KATEGORİLER",
      options: categories.map((category) => ({ label: category, value: category })),
      selectedValues: [selectedCategory],
      onToggle: setSelectedCategory,
    },
    {
      title: "DEPARTMANLAR",
      options: DEPARTMENTS.map((department) => ({ label: department, value: department })),
      selectedValues: [selectedDepartment],
      onToggle: setSelectedDepartment,
    },
  ];

  return (
    <main className="min-h-screen w-full bg-zinc-950 pb-24 text-white">
      <section className="mx-auto w-full max-w-[1600px] px-6 pt-28 md:px-16">
        <header className="mb-10">
          <h1
            className="text-6xl font-thin uppercase leading-none tracking-[0.3em] text-white md:text-8xl"
            style={{ fontFamily: "Smooch Sans, sans-serif" }}
          >
            GALERİ
          </h1>
          <p
            className="mt-4 text-sm uppercase tracking-[0.4em] text-zinc-400"
            style={{ fontFamily: "Smooch Sans, sans-serif" }}
          >
            TÜM ÇALIŞMALARIMIZ & PORTFOLYO
          </p>
        </header>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[280px_minmax(0,1fr)]">
          <ProjectFilterSidebar
            className="hidden lg:flex"
            title="FİLTRELER"
            searchPlaceholder="PROJE ARA"
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            groups={filterGroups}
          />

          <div className="flex flex-col gap-8">
            <div className="lg:hidden">
              <ProjectFilterSidebar
                title="FİLTRELER"
                searchPlaceholder="PROJE ARA"
                searchValue={searchTerm}
                onSearchChange={setSearchTerm}
                groups={filterGroups}
              />
            </div>

            {visibleProjects.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {visibleProjects.map((project, index) => (
                  <ProjectCard
                    key={project.slug}
                    image={project.coverImage}
                    title={project.title}
                    category={getCategoryLabel(project.category)}
                    loading={index < 2 ? "eager" : "lazy"}
                    onClick={() => setSelectedProjectSlug(project.slug)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelectedProjectSlug(project.slug);
                      }
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="flex min-h-[50vh] items-center justify-center text-center">
                <p
                  className="text-3xl font-thin tracking-[0.18em] text-zinc-300 md:text-5xl"
                  style={{ fontFamily: "Smooch Sans, sans-serif" }}
                >
                  ARADIĞINIZ KRİTERLERE UYGUN PROJE BULUNAMADI.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <ProjectInsightPanel project={selectedProject} onClose={() => setSelectedProjectSlug(null)} />
      <Footer />
    </main>
  );
}
