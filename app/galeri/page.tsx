"use client";

import { useMemo, useState } from "react";

import ProjectCard from "@/components/ProjectCard";
import ProjectInsightPanel from "@/components/ProjectInsightPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
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

const DEPARTMENTS = [
  "HEPSİ",
  "MİMARİ TASARIM",
  "MATERYAL STÜDYO",
  "UYGULAMA HİZMETLERİ",
  "MÜHENDİSLİK",
] as const;

type DepartmentKey = (typeof DEPARTMENTS)[number];

function getCategoryLabel(category: string) {
  return CATEGORY_LABELS[category] ?? category.toUpperCase();
}

function buildFilterButtonClass(isActive: boolean) {
  return cn(
    "w-full justify-start rounded-none px-0 py-2 text-left text-lg font-thin uppercase tracking-[0.25em] transition-colors hover:bg-transparent",
    isActive
      ? "bg-zinc-900/50 text-white hover:bg-zinc-900/50 hover:text-white"
      : "text-zinc-500 hover:text-white",
  );
}

export default function GaleriPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("HEPSİ");
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentKey>("HEPSİ");
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const [selectedProjectSlug, setSelectedProjectSlug] = useState<string | null>(null);

  const categories = useMemo(
    () => [
      "HEPSİ",
      ...Array.from(new Set(projectsData.map((project) => getCategoryLabel(project.category)))),
    ],
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

        <div className="mx-auto mt-12 grid grid-cols-1 gap-12 lg:grid-cols-5">
          <aside className="hidden h-fit flex-col gap-2 lg:sticky lg:top-32 lg:col-span-1 lg:flex">
            {categories.map((category) => {
              const isActive = selectedCategory === category;

              return (
                <Button
                  key={category}
                  type="button"
                  variant="ghost"
                  onClick={() => setSelectedCategory(category)}
                  className={buildFilterButtonClass(isActive)}
                  style={{ fontFamily: "Smooch Sans, sans-serif" }}
                >
                  {category}
                </Button>
              );
            })}

            <div className="mt-16 flex flex-col gap-6">
              <h3
                className="text-xs font-light uppercase tracking-[0.3em] text-red-500"
                style={{ fontFamily: "Smooch Sans, sans-serif" }}
              >
                DEPARTMANLAR
              </h3>
              <ul className="flex flex-col gap-4">
                {DEPARTMENTS.map((dept) => {
                  const isActive = selectedDepartment === dept;

                  return (
                    <li key={dept}>
                      <button
                        type="button"
                        onClick={() => setSelectedDepartment(dept)}
                        className={buildFilterButtonClass(isActive)}
                        style={{ fontFamily: "Smooch Sans, sans-serif" }}
                      >
                        {dept}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>

          <div className="lg:col-span-4">
            <div className="rounded-none border border-zinc-800/70 bg-zinc-950/30 px-4 md:px-5">
              <Input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="ARAMA"
                className="border-0 bg-transparent px-0 text-base uppercase tracking-[0.3em] placeholder:text-zinc-600 focus-visible:ring-0"
                style={{ fontFamily: "Smooch Sans, sans-serif" }}
              />
            </div>

            <div className="mt-6 lg:hidden">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsMobileCategoriesOpen((current) => !current)}
                className="w-full justify-between rounded-none border border-zinc-800/70 bg-transparent px-0 py-3 text-left text-lg font-thin uppercase tracking-[0.25em] text-white hover:bg-transparent"
                style={{ fontFamily: "Smooch Sans, sans-serif" }}
              >
                <span>Filtreler</span>
                <span className="text-zinc-500" aria-hidden="true">
                  {isMobileCategoriesOpen ? "−" : "+"}
                </span>
              </Button>

              {isMobileCategoriesOpen && (
                <div className="mt-3 flex flex-col gap-10">
                  <div className="flex flex-col gap-2">
                    {categories.map((category) => {
                      const isActive = selectedCategory === category;

                      return (
                        <Button
                          key={category}
                          type="button"
                          variant="ghost"
                          onClick={() => setSelectedCategory(category)}
                          className={buildFilterButtonClass(isActive)}
                          style={{ fontFamily: "Smooch Sans, sans-serif" }}
                        >
                          {category}
                        </Button>
                      );
                    })}
                  </div>

                  <div className="flex flex-col gap-6">
                    <h3
                      className="text-xs font-light uppercase tracking-[0.3em] text-red-500"
                      style={{ fontFamily: "Smooch Sans, sans-serif" }}
                    >
                      DEPARTMANLAR
                    </h3>
                    <ul className="flex flex-col gap-4">
                      {DEPARTMENTS.map((dept) => {
                        const isActive = selectedDepartment === dept;

                        return (
                          <li key={dept}>
                            <button
                              type="button"
                              onClick={() => setSelectedDepartment(dept)}
                              className={buildFilterButtonClass(isActive)}
                              style={{ fontFamily: "Smooch Sans, sans-serif" }}
                            >
                              {dept}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {visibleProjects.length > 0 ? (
              <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
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
                  Aradığınız kriterlere uygun proje bulunamadı.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <ProjectInsightPanel project={selectedProject} onClose={() => setSelectedProjectSlug(null)} />
    </main>
  );
}
