"use client";

import { useEffect, useMemo, useState } from "react";

import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import ProjectInsightPanel from "@/components/ProjectInsightPanel";
import ProjectFilterSidebar, { type FilterGroup } from "@/components/ProjectFilterSidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { projectsData, type ProjectDetail } from "@/data/projects";
import { getGalleryCategoryLabel, normalizeGalleryProject, textOrFallback } from "@/lib/gallery-shared";

type PageContent = {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaHref: string;
};

const DEFAULT_PAGE_CONTENT: PageContent = {
  title: "GALERİ",
  subtitle: "TÜM ÇALIŞMALARIMIZ & PORTFOLYO",
  description: "Filtrelenebilir proje havuzu, detay modalı ve seçili kartların gelişmiş anlatımı.",
  ctaText: "GALERİYİ KEŞFET",
  ctaHref: "/galeri",
};

const DEPARTMENTS = ["HEPSİ", "MİMARİ TASARIM", "MATERYAL STÜDYO", "UYGULAMA HİZMETLERİ", "MÜHENDİSLİK"] as const;

function normalizePageContent(payload: any): PageContent {
  const hero = Array.isArray(payload?.sections)
    ? payload.sections.find((section: any) => section?.id === "hero") || payload.sections[0]
    : null;

  return {
    title: textOrFallback(hero?.title, DEFAULT_PAGE_CONTENT.title),
    subtitle: textOrFallback(hero?.subtitle, DEFAULT_PAGE_CONTENT.subtitle),
    description: textOrFallback(hero?.description, DEFAULT_PAGE_CONTENT.description),
    ctaText: textOrFallback(hero?.content?.ctaText, DEFAULT_PAGE_CONTENT.ctaText),
    ctaHref: textOrFallback(hero?.content?.ctaHref, DEFAULT_PAGE_CONTENT.ctaHref),
  };
}

export default function GaleriPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("HEPSİ");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("HEPSİ");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProjectSlug, setSelectedProjectSlug] = useState<string | null>(null);
  const [projects, setProjects] = useState<ProjectDetail[]>(projectsData);
  const [pageContent, setPageContent] = useState<PageContent>(DEFAULT_PAGE_CONTENT);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadGallery = async () => {
      setIsLoading(true);

      try {
        const [projectsRes, contentRes] = await Promise.all([
          fetch("/api/projects", { cache: "no-store" }),
          fetch("/api/content?page=galeri", { cache: "no-store" }),
        ]);

        const projectPayload = await projectsRes.json().catch(() => null);
        const contentPayload = await contentRes.json().catch(() => null);

        if (!active) return;

        const normalizedProjects = Array.isArray(projectPayload) && projectPayload.length > 0
          ? projectPayload.map((item: any) => normalizeGalleryProject(item))
          : projectsData.map((item) => normalizeGalleryProject(item));

        setProjects(normalizedProjects);
        setPageContent(normalizePageContent(contentRes.ok ? contentPayload : null));
      } catch (error) {
        if (!active) return;
        setProjects(projectsData.map((item) => normalizeGalleryProject(item)));
        setPageContent(DEFAULT_PAGE_CONTENT);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void loadGallery();

    return () => {
      active = false;
    };
  }, []);

  const categories = useMemo(
    () => ["HEPSİ", ...Array.from(new Set(projects.map((project) => getGalleryCategoryLabel(project.category))))],
    [projects],
  );

  const visibleProjects = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return projects.filter((project) => {
      const matchCategory = selectedCategory === "HEPSİ" || getGalleryCategoryLabel(project.category) === selectedCategory;
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
  }, [projects, searchTerm, selectedCategory, selectedDepartment]);

  const selectedProject = useMemo(
    () => projects.find((project) => project.slug === selectedProjectSlug) ?? null,
    [projects, selectedProjectSlug],
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
        <header className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.45em] text-zinc-500" style={{ fontFamily: "Smooch Sans, sans-serif" }}>
              {pageContent.subtitle}
            </p>
            <h1
              className="mt-4 text-6xl font-thin uppercase leading-none tracking-[0.3em] text-white md:text-8xl"
              style={{ fontFamily: "Smooch Sans, sans-serif" }}
            >
              {pageContent.title}
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-400 md:text-base">
              {pageContent.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Badge className="border border-white/10 bg-white/5 text-white/80">
              {visibleProjects.length} proje
            </Badge>
            <Button asChild className="bg-white text-zinc-950 hover:bg-white/90">
              <a href={pageContent.ctaHref}>{pageContent.ctaText}</a>
            </Button>
          </div>
        </header>

        <Card className="mb-8 border-white/10 bg-white/[0.04] backdrop-blur-sm">
          <CardContent className="grid gap-4 p-4 md:grid-cols-3 md:p-6">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-zinc-500">Anlık Filtre</p>
              <p className="mt-2 text-sm text-white/90">Kartlar kategori, departman ve arama metnine göre filtrelenir.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-zinc-500">Detay Modalı</p>
              <p className="mt-2 text-sm text-white/90">Seçilen proje aynı modal bileşeniyle detaylı gösterilir.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-zinc-500">API Kaynağı</p>
              <p className="mt-2 text-sm text-white/90">İçerik /api/content?page=galeri ve /api/projects üzerinden okunur.</p>
            </div>
          </CardContent>
        </Card>

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

            {isLoading ? (
              <div className="grid min-h-[40vh] place-items-center rounded-3xl border border-white/10 bg-white/[0.04]">
                <div className="flex items-center gap-3 text-white/60">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Galeri yükleniyor...</span>
                </div>
              </div>
            ) : visibleProjects.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {visibleProjects.map((project, index) => (
                  <ProjectCard
                    key={project.slug}
                    image={project.coverImage}
                    title={project.title}
                    category={getGalleryCategoryLabel(project.category)}
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
      <Separator className="my-12 bg-white/10" />
      <Footer />
    </main>
  );
}
