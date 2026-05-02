"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import Footer from "@/components/Footer";
import JournalCard from "@/components/JournalCard";
import JournalDrawer from "@/components/JournalDrawer";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import {
  JOURNAL_CONTENT_TYPES,
  JOURNAL_DEPARTMENTS,
  JOURNAL_PROJECT_TYPES,
} from "@/data/journal";
import { createDefaultJournalDraft, normalizeJournalDraft, toTurkishLowerCase } from "@/lib/journal-content";

function toggleValue(values: string[], value: string) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

const ARTICLES_PER_PAGE = 6;

function buildPageNumbers(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);
  return Array.from(pages)
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);
}

export default function JournalPage() {
  const [pageContent, setPageContent] = useState(() => createDefaultJournalDraft());
  const [contentStatus, setContentStatus] = useState<"loading" | "ok" | "error">("loading");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedProjectTypes, setSelectedProjectTypes] = useState<string[]>([]);
  const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>([]);
  const [selectedArticleSlug, setSelectedArticleSlug] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const hasInitializedArticleSelection = useRef(false);

  const visibleArticles = useMemo(() => {
    const query = toTurkishLowerCase(searchTerm.trim());

    return pageContent.articles.filter((article) => {
      const matchSearch =
        query.length === 0 ||
        [
          article.title,
          article.deck,
          article.intro,
          article.departments.join(" "),
          article.projectTypes.join(" "),
          article.contentTypes.join(" "),
        ]
          .join(" ")
          .toLocaleLowerCase("tr-TR")
          .includes(query);

      const matchDepartments =
        selectedDepartments.length === 0 || article.departments.some((item) => selectedDepartments.includes(item));
      const matchProjectTypes =
        selectedProjectTypes.length === 0 || article.projectTypes.some((item) => selectedProjectTypes.includes(item));
      const matchContentTypes =
        selectedContentTypes.length === 0 || article.contentTypes.some((item) => selectedContentTypes.includes(item));

      return matchSearch && matchDepartments && matchProjectTypes && matchContentTypes;
    });
  }, [pageContent.articles, searchTerm, selectedContentTypes, selectedDepartments, selectedProjectTypes]);

  const totalPages = Math.max(1, Math.ceil(visibleArticles.length / ARTICLES_PER_PAGE));
  const pageNumbers = useMemo(() => buildPageNumbers(currentPage, totalPages), [currentPage, totalPages]);
  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * ARTICLES_PER_PAGE;
    return visibleArticles.slice(start, start + ARTICLES_PER_PAGE);
  }, [currentPage, visibleArticles]);

  const selectedArticle = useMemo(
    () => (selectedArticleSlug ? pageContent.articles.find((article) => article.slug === selectedArticleSlug) ?? null : null),
    [pageContent.articles, selectedArticleSlug],
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedContentTypes, selectedDepartments, selectedProjectTypes]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    let active = true;

    const loadPage = async () => {
      try {
        setContentStatus("loading");
        const res = await fetch("/api/journal", { cache: "no-store" });
        const data = await res.json().catch(() => null);
        if (!active) return;

        const normalized = normalizeJournalDraft(res.ok ? data : null);
        setPageContent(normalized);
        setContentStatus(res.ok ? "ok" : "error");
      } catch {
        if (!active) return;
        setPageContent(createDefaultJournalDraft());
        setContentStatus("error");
      }
    };

    void loadPage();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (pageContent.articles.length === 0) {
      hasInitializedArticleSelection.current = false;
      setSelectedArticleSlug(null);
      return;
    }

    if (!hasInitializedArticleSelection.current) {
      hasInitializedArticleSelection.current = true;
      setSelectedArticleSlug(pageContent.articles[0].slug);
      return;
    }

    if (selectedArticleSlug && !pageContent.articles.some((article) => article.slug === selectedArticleSlug)) {
      setSelectedArticleSlug(pageContent.articles[0].slug);
    }
  }, [pageContent.articles, selectedArticleSlug]);

  useEffect(() => {
    if (!isMobileFiltersOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileFiltersOpen]);

  return (
    <main className="min-h-screen w-full bg-[#080808] pb-24 text-white">
      <section className="mx-auto w-full max-w-[1700px] px-6 pt-28 md:px-10 lg:px-16">
        <header className="mb-14 max-w-5xl space-y-5">
          <p className="text-[0.62rem] uppercase tracking-[0.12em] text-white/40">
            {pageContent.hero.subtitle}
          </p>
          <h1
            className="text-[clamp(4rem,9vw,9.5rem)] font-thin uppercase leading-[0.8] tracking-[0.04em] text-white"
            style={{ fontFamily: "Smooch Sans, sans-serif", fontWeight: 100 }}
          >
            {pageContent.hero.title}
          </h1>
          <p
            className="max-w-4xl text-[0.82rem] tracking-[0.08em] text-white/58 md:text-[0.9rem]"
            style={{ fontFamily: "Smooch Sans, sans-serif" }}
          >
            {pageContent.hero.description}
          </p>
          <div className="flex flex-wrap items-center gap-3 text-[0.58rem] tracking-[0.08em] text-white/40">
            <span>{pageContent.hero.subtitle}</span>
            <span className="hidden md:inline">/</span>
            <span>{contentStatus === "ok" ? "api senkron" : contentStatus === "error" ? "fallback veri" : "yükleniyor"}</span>
          </div>
        </header>

        <div className="lg:hidden mb-8">
          <button
            type="button"
            className="mobile-filter-toggle w-full"
            onClick={() => setIsMobileFiltersOpen(true)}
          >
            <span className="material-symbols-outlined">tune</span>
            KATEGORİLER
            {(selectedDepartments.length > 0 || selectedProjectTypes.length > 0 || selectedContentTypes.length > 0) && (
              <span className="active-dot" />
            )}
          </button>
        </div>

        <div
          className={`studio-mobile-drawer-overlay ${isMobileFiltersOpen ? "active" : ""}`}
          onClick={() => setIsMobileFiltersOpen(false)}
        />

        <div className={`studio-mobile-drawer ${isMobileFiltersOpen ? "active" : ""} lg:hidden`}>
          <div className="drawer-header">
            <h3>KATEGORİLER</h3>
            <button className="drawer-close" type="button" onClick={() => setIsMobileFiltersOpen(false)}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="drawer-content">
            <div className="px-4 mb-8">
              <SidebarInput
                className="bg-zinc-900/50 border-zinc-800 text-white rounded-none focus-visible:ring-1 focus-visible:ring-zinc-700 h-12 text-xs font-light tracking-[0.02em] placeholder:text-zinc-600"
                placeholder="MAKALE ARA..."
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <div className="px-4 flex flex-col gap-8 pb-8">
              <SidebarGroup>
                <SidebarGroupLabel className="text-[10px] md:text-xs tracking-[0.08em] text-zinc-500 uppercase font-light mb-4 px-4 bg-transparent">
                  DEPARTMANLAR
                </SidebarGroupLabel>
                <SidebarMenu>
                  {JOURNAL_DEPARTMENTS.map((item) => {
                    const isActive = selectedDepartments.includes(item.value);

                    return (
                      <SidebarMenuItem key={item.value}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          className="rounded-none hover:bg-zinc-900/60 hover:text-white text-zinc-400 transition-colors h-10 px-4"
                        >
                          <button
                            type="button"
                            className="w-full text-left text-xs tracking-[0.02em] font-light uppercase"
                            onClick={() => {
                              setCurrentPage(1);
                              setSelectedDepartments((current) => toggleValue(current, item.value));
                            }}
                          >
                            {item.label}
                          </button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroup>

              <SidebarGroup>
                <SidebarGroupLabel className="text-[10px] md:text-xs tracking-[0.08em] text-zinc-500 uppercase font-light mb-4 px-4 bg-transparent">
                  PROJE TÜRLERİ
                </SidebarGroupLabel>
                <SidebarMenu>
                  {JOURNAL_PROJECT_TYPES.map((item) => {
                    const isActive = selectedProjectTypes.includes(item.value);

                    return (
                      <SidebarMenuItem key={item.value}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          className="rounded-none hover:bg-zinc-900/60 hover:text-white text-zinc-400 transition-colors h-10 px-4"
                        >
                          <button
                            type="button"
                            className="w-full text-left text-xs tracking-[0.02em] font-light uppercase"
                            onClick={() => {
                              setCurrentPage(1);
                              setSelectedProjectTypes((current) => toggleValue(current, item.value));
                            }}
                          >
                            {item.label}
                          </button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroup>

              <SidebarGroup>
                <SidebarGroupLabel className="text-[10px] md:text-xs tracking-[0.08em] text-zinc-500 uppercase font-light mb-4 px-4 bg-transparent">
                  İÇERİK TÜRÜ
                </SidebarGroupLabel>
                <SidebarMenu>
                  {JOURNAL_CONTENT_TYPES.map((item) => {
                    const isActive = selectedContentTypes.includes(item.value);

                    return (
                      <SidebarMenuItem key={item.value}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          className="rounded-none hover:bg-zinc-900/60 hover:text-white text-zinc-400 transition-colors h-10 px-4"
                        >
                          <button
                            type="button"
                            className="w-full text-left text-xs tracking-[0.02em] font-light uppercase"
                            onClick={() => {
                              setCurrentPage(1);
                              setSelectedContentTypes((current) => toggleValue(current, item.value));
                            }}
                          >
                            {item.label}
                          </button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroup>
            </div>
          </div>
        </div>

        <SidebarProvider defaultOpen>
          <div className="grid grid-cols-1 gap-12 w-full lg:grid-cols-[300px_minmax(0,1fr)]">
            <Sidebar collapsible="none" className="hidden w-full border-none bg-transparent shadow-none lg:block">
              <SidebarContent className="sticky top-28 flex flex-col gap-10 bg-transparent">
                <div className="px-4 mb-8">
                  <SidebarInput
                    className="bg-zinc-900/50 border-zinc-800 text-white rounded-none focus-visible:ring-1 focus-visible:ring-zinc-700 h-12 text-xs font-light tracking-[0.02em] placeholder:text-zinc-600"
                    placeholder="MAKALE ARA..."
                    value={searchTerm}
                    onChange={(event) => {
                      setSearchTerm(event.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>

                <SidebarGroup>
                  <SidebarGroupLabel className="text-[10px] md:text-xs tracking-[0.08em] text-zinc-500 uppercase font-light mb-4 px-4 bg-transparent">
                    DEPARTMANLAR
                  </SidebarGroupLabel>
                  <SidebarMenu>
                    {JOURNAL_DEPARTMENTS.map((item) => {
                      const isActive = selectedDepartments.includes(item.value);

                      return (
                        <SidebarMenuItem key={item.value}>
                          <SidebarMenuButton
                            asChild
                            isActive={isActive}
                            className="rounded-none hover:bg-zinc-900/60 hover:text-white text-zinc-400 transition-colors h-10 px-4"
                          >
                            <button
                              type="button"
                              className="w-full text-left text-xs tracking-[0.02em] font-light uppercase"
                              onClick={() => {
                                setCurrentPage(1);
                                setSelectedDepartments((current) => toggleValue(current, item.value));
                              }}
                            >
                              {item.label}
                            </button>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroup>

                <SidebarGroup>
                  <SidebarGroupLabel className="text-[10px] md:text-xs tracking-[0.08em] text-zinc-500 uppercase font-light mb-4 px-4 bg-transparent">
                    PROJE TÜRLERİ
                  </SidebarGroupLabel>
                  <SidebarMenu>
                    {JOURNAL_PROJECT_TYPES.map((item) => {
                      const isActive = selectedProjectTypes.includes(item.value);

                      return (
                        <SidebarMenuItem key={item.value}>
                          <SidebarMenuButton
                            asChild
                            isActive={isActive}
                            className="rounded-none hover:bg-zinc-900/60 hover:text-white text-zinc-400 transition-colors h-10 px-4"
                          >
                            <button
                              type="button"
                              className="w-full text-left text-xs tracking-[0.02em] font-light uppercase"
                              onClick={() => {
                                setCurrentPage(1);
                                setSelectedProjectTypes((current) => toggleValue(current, item.value));
                              }}
                            >
                              {item.label}
                            </button>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroup>

                <SidebarGroup>
                  <SidebarGroupLabel className="text-[10px] md:text-xs tracking-[0.08em] text-zinc-500 uppercase font-light mb-4 px-4 bg-transparent">
                    İÇERİK TÜRÜ
                  </SidebarGroupLabel>
                  <SidebarMenu>
                    {JOURNAL_CONTENT_TYPES.map((item) => {
                      const isActive = selectedContentTypes.includes(item.value);

                      return (
                        <SidebarMenuItem key={item.value}>
                          <SidebarMenuButton
                            asChild
                            isActive={isActive}
                            className="rounded-none hover:bg-zinc-900/60 hover:text-white text-zinc-400 transition-colors h-10 px-4"
                          >
                            <button
                              type="button"
                              className="w-full text-left text-xs tracking-[0.02em] font-light uppercase"
                              onClick={() => {
                                setCurrentPage(1);
                                setSelectedContentTypes((current) => toggleValue(current, item.value));
                              }}
                            >
                              {item.label}
                            </button>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroup>
              </SidebarContent>
            </Sidebar>

            <div className="flex min-h-0 flex-col gap-8">
              {paginatedArticles.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 md:gap-16 lg:gap-24 w-full">
                    {paginatedArticles.map((article, index) => (
                      <JournalCard
                        key={article.slug}
                        article={article}
                        loading={index < 2 ? "eager" : "lazy"}
                        onClick={() => setSelectedArticleSlug(article.slug)}
                      />
                    ))}
                  </div>

                  <div className="flex flex-col items-center gap-4 pt-8">
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <Button
                        type="button"
                        variant="ghost"
                        className="rounded-none border border-zinc-800 bg-transparent px-4 py-2 text-[10px] uppercase tracking-[0.08em] text-zinc-400 hover:bg-zinc-900 hover:text-white disabled:opacity-30"
                        onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                        disabled={currentPage === 1}
                      >
                        ÖNCEKİ
                      </Button>

                      {pageNumbers.map((page) => (
                        <Button
                          key={page}
                          type="button"
                          variant="ghost"
                          onClick={() => setCurrentPage(page)}
                          className={`rounded-none border px-4 py-2 text-[10px] uppercase tracking-[0.08em] ${
                            page === currentPage
                              ? "border-white bg-white text-zinc-950 hover:bg-white hover:text-zinc-950"
                              : "border-zinc-800 bg-transparent text-zinc-500 hover:bg-zinc-900 hover:text-white"
                          }`}
                        >
                          {String(page).padStart(2, "0")}
                        </Button>
                      ))}

                      <Button
                        type="button"
                        variant="ghost"
                        className="rounded-none border border-zinc-800 bg-transparent px-4 py-2 text-[10px] uppercase tracking-[0.08em] text-zinc-400 hover:bg-zinc-900 hover:text-white disabled:opacity-30"
                        onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                        disabled={currentPage === totalPages}
                      >
                        SONRAKİ
                      </Button>
                    </div>

                    <p className="text-[10px] uppercase tracking-[0.08em] text-zinc-500">
                      SAYFA {String(currentPage).padStart(2, "0")} / {String(totalPages).padStart(2, "0")}
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex min-h-[50vh] items-center justify-center text-center">
                  <p
                    className="max-w-3xl text-3xl font-thin uppercase tracking-[0.04em] text-white/40 md:text-5xl"
                    style={{ fontFamily: "Smooch Sans, sans-serif" }}
                  >
                    ARADIĞINIZ KRİTERLERE UYGUN MAKALE BULUNAMADI.
                  </p>
                </div>
              )}
            </div>
          </div>
        </SidebarProvider>
      </section>

      <JournalDrawer article={selectedArticle} onClose={() => setSelectedArticleSlug(null)} />
      <Footer />
    </main>
  );
}
