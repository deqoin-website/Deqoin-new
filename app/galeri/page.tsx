"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProjectCard from "@/components/ProjectCard";
import { cn } from "@/lib/utils";

const categories = [
  { key: "all", title: "HEPSİ" },
  { key: "ic-mimari", title: "İÇ MİMARİ" },
  { key: "konut", title: "KONUT" },
  { key: "ticari", title: "TİCARİ" },
  { key: "restorasyon", title: "RESTORASYON" },
  { key: "peyzaj", title: "PEYZAJ" },
  { key: "otel", title: "OTEL" },
  { key: "kurumsal", title: "KURUMSAL" },
] as const;

const projects = [
  { id: 1, category: "ic-mimari", title: "BOSPHORUS VİLLA", image: "/images/projects/gallery_1.png" },
  { id: 2, category: "konut", title: "NOIR RESIDENCE", image: "/images/projects/gallery_2.png" },
  { id: 3, category: "ticari", title: "ATELIER HOUSE", image: "/images/projects/gallery_1.png" },
  { id: 4, category: "restorasyon", title: "HERITAGE COURT", image: "/images/projects/gallery_2.png" },
  { id: 5, category: "peyzaj", title: "MIRROR GARDEN", image: "/images/projects/gallery_1.png" },
  { id: 6, category: "kurumsal", title: "SILENT OFFICE", image: "/images/projects/gallery_2.png" },
] as const;

type CategoryKey = (typeof categories)[number]["key"];

export default function GaleriPage() {
  const [activeFilter, setActiveFilter] = useState<CategoryKey>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);

  const visibleProjects = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesCategory = activeFilter === "all" || project.category === activeFilter;
      const matchesSearch =
        query.length === 0 ||
        project.title.toLowerCase().includes(query) ||
        project.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [activeFilter, searchTerm]);

  return (
    <main className="min-h-screen w-full bg-zinc-950 pb-24 text-white">
      <section className="mx-auto w-full max-w-[1600px] px-6 md:px-16 pt-28">
        <header className="mb-10">
          <h1
            className="text-6xl md:text-8xl font-thin tracking-[0.3em] text-white uppercase leading-none"
            style={{ fontFamily: "Smooch Sans, sans-serif" }}
          >
            GALERİ
          </h1>
          <p
            className="mt-4 text-sm tracking-[0.4em] text-zinc-400 uppercase"
            style={{ fontFamily: "Smooch Sans, sans-serif" }}
          >
            TÜM ÇALIŞMALARIMIZ & PORTFOLYO
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 max-w-[1600px] mx-auto px-0 mt-12">
          <aside className="hidden lg:flex lg:col-span-1 sticky top-32 h-fit flex-col gap-2">
            {categories.map((category) => {
              const isActive = activeFilter === category.key;

              return (
                <Button
                  key={category.key}
                  type="button"
                  variant="ghost"
                  onClick={() => setActiveFilter(category.key)}
                  className={cn(
                    "w-full justify-start rounded-none px-0 py-2 text-left text-lg md:text-xl font-thin uppercase tracking-[0.25em] transition-colors hover:bg-transparent",
                    isActive
                      ? "bg-zinc-900/50 text-white hover:bg-zinc-900/50 hover:text-white"
                      : "text-zinc-500 hover:text-white",
                  )}
                  style={{ fontFamily: "Smooch Sans, sans-serif" }}
                >
                  {category.title}
                </Button>
              );
            })}
          </aside>

          <div className="lg:col-span-4">
            <div className="rounded-xl border border-zinc-800/70 bg-zinc-950/30 px-4 md:px-5">
              <Input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ARAMA"
                className="border-0 bg-transparent px-0 text-base tracking-[0.3em] uppercase placeholder:text-zinc-600 focus-visible:ring-0"
                style={{ fontFamily: "Smooch Sans, sans-serif" }}
              />
            </div>

            <div className="mt-6 lg:hidden">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsMobileCategoriesOpen((current) => !current)}
                className={cn(
                  "w-full justify-between rounded-none border border-zinc-800/70 bg-transparent px-0 py-3 text-left text-lg font-thin uppercase tracking-[0.25em] text-white hover:bg-transparent",
                )}
                style={{ fontFamily: "Smooch Sans, sans-serif" }}
              >
                <span>Kategoriler</span>
                <span className="text-zinc-500" aria-hidden="true">
                  {isMobileCategoriesOpen ? "−" : "+"}
                </span>
              </Button>

              {isMobileCategoriesOpen && (
                <div className="mt-3 flex flex-col gap-2">
                  {categories.map((category) => {
                    const isActive = activeFilter === category.key;

                    return (
                      <Button
                        key={category.key}
                        type="button"
                        variant="ghost"
                        onClick={() => setActiveFilter(category.key)}
                        className={cn(
                          "w-full justify-start rounded-none px-0 py-2 text-left text-lg font-thin uppercase tracking-[0.25em] transition-colors hover:bg-transparent",
                          isActive
                            ? "bg-zinc-900/50 text-white hover:bg-zinc-900/50 hover:text-white"
                            : "text-zinc-500 hover:text-white",
                        )}
                        style={{ fontFamily: "Smooch Sans, sans-serif" }}
                      >
                        {category.title}
                      </Button>
                    );
                  })}
                </div>
              )}
            </div>

            {visibleProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-12">
                {visibleProjects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    image={project.image}
                    title={project.title}
                    category={categories.find((category) => category.key === project.category)?.title ?? "İÇ MİMARİ"}
                    loading={index < 2 ? "eager" : "lazy"}
                  />
                ))}
              </div>
            ) : (
              <div className="flex min-h-[50vh] items-center justify-center text-center">
                <p
                  className="text-3xl md:text-5xl font-thin tracking-[0.18em] text-zinc-300"
                  style={{ fontFamily: "Smooch Sans, sans-serif" }}
                >
                  Aradığınız kriterlere uygun proje bulunamadı.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
