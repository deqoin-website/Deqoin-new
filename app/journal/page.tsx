"use client";

import { useMemo, useState } from "react";

import JournalCard from "@/components/JournalCard";
import JournalDrawer from "@/components/JournalDrawer";
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
  getJournalArticleBySlug,
  journalArticles,
} from "@/data/journal";

function toggleValue(values: string[], value: string) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

export default function JournalPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedProjectTypes, setSelectedProjectTypes] = useState<string[]>([]);
  const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>([]);
  const [selectedArticleSlug, setSelectedArticleSlug] = useState<string | null>(null);

  const visibleArticles = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return journalArticles.filter((article) => {
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
          .toLowerCase()
          .includes(query);

      const matchDepartments =
        selectedDepartments.length === 0 || article.departments.some((item) => selectedDepartments.includes(item));
      const matchProjectTypes =
        selectedProjectTypes.length === 0 || article.projectTypes.some((item) => selectedProjectTypes.includes(item));
      const matchContentTypes =
        selectedContentTypes.length === 0 || article.contentTypes.some((item) => selectedContentTypes.includes(item));

      return matchSearch && matchDepartments && matchProjectTypes && matchContentTypes;
    });
  }, [searchTerm, selectedContentTypes, selectedDepartments, selectedProjectTypes]);

  const selectedArticle = useMemo(
    () => (selectedArticleSlug ? getJournalArticleBySlug(selectedArticleSlug) : null),
    [selectedArticleSlug],
  );

  return (
    <main className="min-h-screen w-full bg-[#080808] pb-24 text-white">
      <section className="mx-auto w-full max-w-[1700px] px-6 pt-28 md:px-10 lg:px-16">
        <header className="mb-14 max-w-5xl space-y-5">
          <p className="text-[0.62rem] uppercase tracking-[0.55em] text-white/40">
            QUIET LUXURY / EDITORIAL ARCHIVE
          </p>
          <h1
            className="text-[clamp(4rem,9vw,9.5rem)] font-thin uppercase leading-[0.8] tracking-[0.12em] text-white"
            style={{ fontFamily: "Smooch Sans, sans-serif", fontWeight: 100 }}
          >
            JOURNAL
          </h1>
          <p
            className="max-w-4xl text-[0.82rem] uppercase tracking-[0.38em] text-white/58 md:text-[0.9rem]"
            style={{ fontFamily: "Smooch Sans, sans-serif" }}
          >
            SESSİZ LÜKSÜN MİMARİ OKUMASI, TEKNİK NOTLAR VE PROJE BAĞLANTILARIYLA BİR DERGİ ALGISINDA SUNULUR.
          </p>
        </header>

        <SidebarProvider defaultOpen>
          <div className="grid grid-cols-1 gap-12 w-full lg:grid-cols-[300px_minmax(0,1fr)]">
            <Sidebar collapsible="none" className="w-full border-none bg-transparent shadow-none">
              <SidebarContent className="sticky top-28 flex flex-col gap-10 bg-transparent">
                <div className="px-4 mb-8">
                  <SidebarInput
                    className="bg-zinc-900/50 border-zinc-800 text-white rounded-none focus-visible:ring-1 focus-visible:ring-zinc-700 h-12 text-xs font-light tracking-widest placeholder:text-zinc-600"
                    placeholder="MAKALE ARA..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                  />
                </div>

                <SidebarGroup>
                  <SidebarGroupLabel className="text-[10px] md:text-xs tracking-[0.4em] text-zinc-500 uppercase font-light mb-4 px-4 bg-transparent">
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
                              className="w-full text-left text-xs tracking-[0.3em] font-light uppercase"
                              onClick={() =>
                                setSelectedDepartments((current) => toggleValue(current, item.value))
                              }
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
                  <SidebarGroupLabel className="text-[10px] md:text-xs tracking-[0.4em] text-zinc-500 uppercase font-light mb-4 px-4 bg-transparent">
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
                              className="w-full text-left text-xs tracking-[0.3em] font-light uppercase"
                              onClick={() =>
                                setSelectedProjectTypes((current) => toggleValue(current, item.value))
                              }
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
                  <SidebarGroupLabel className="text-[10px] md:text-xs tracking-[0.4em] text-zinc-500 uppercase font-light mb-4 px-4 bg-transparent">
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
                              className="w-full text-left text-xs tracking-[0.3em] font-light uppercase"
                              onClick={() =>
                                setSelectedContentTypes((current) => toggleValue(current, item.value))
                              }
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
              {visibleArticles.length > 0 ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 md:gap-16 lg:gap-24 w-full">
                  {visibleArticles.map((article, index) => (
                    <JournalCard
                      key={article.slug}
                      article={article}
                      loading={index < 2 ? "eager" : "lazy"}
                      onClick={() => setSelectedArticleSlug(article.slug)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex min-h-[50vh] items-center justify-center text-center">
                  <p
                    className="max-w-3xl text-3xl font-thin uppercase tracking-[0.2em] text-white/40 md:text-5xl"
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
    </main>
  );
}
