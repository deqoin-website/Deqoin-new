"use client";

import { useMemo, useState } from "react";

import JournalCard from "@/components/JournalCard";
import JournalDrawer from "@/components/JournalDrawer";
import ProjectFilterSidebar, { type FilterGroup } from "@/components/ProjectFilterSidebar";
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

  const filterGroups: FilterGroup[] = useMemo(
    () => [
      {
        title: "DEPARTMANLAR",
        description: "MİMARİ OKUMA KATMANLARI",
        options: JOURNAL_DEPARTMENTS.map((item) => ({ label: item.label, value: item.value })),
        selectedValues: selectedDepartments,
        onToggle: (value) => setSelectedDepartments((current) => toggleValue(current, value)),
      },
      {
        title: "PROJE TÜRLERİ",
        description: "GALERİ KATEGORİLERİYLE SENKRON",
        options: JOURNAL_PROJECT_TYPES.map((item) => ({ label: item.label, value: item.value })),
        selectedValues: selectedProjectTypes,
        onToggle: (value) => setSelectedProjectTypes((current) => toggleValue(current, value)),
      },
      {
        title: "İÇERİK TÜRÜ",
        description: "EDITORYAL KATEGORİLER",
        options: JOURNAL_CONTENT_TYPES.map((item) => ({ label: item.label, value: item.value })),
        selectedValues: selectedContentTypes,
        onToggle: (value) => setSelectedContentTypes((current) => toggleValue(current, value)),
      },
    ],
    [selectedContentTypes, selectedDepartments, selectedProjectTypes],
  );

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

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[300px_minmax(0,1fr)]">
          <ProjectFilterSidebar
            className="hidden lg:flex"
            title="JOURNAL"
            searchPlaceholder="MAKALE ARA"
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            groups={filterGroups}
          />

          <div className="flex min-h-0 flex-col gap-8">
            <div className="lg:hidden">
              <ProjectFilterSidebar
                title="JOURNAL"
                searchPlaceholder="MAKALE ARA"
                searchValue={searchTerm}
                onSearchChange={setSearchTerm}
                groups={filterGroups}
              />
            </div>

            {visibleArticles.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {visibleArticles.map((article, index) => (
                  <div key={article.slug} className={index === 0 ? "sm:col-span-2 xl:col-span-2" : ""}>
                    <JournalCard
                      article={article}
                      loading={index < 2 ? "eager" : "lazy"}
                      onClick={() => setSelectedArticleSlug(article.slug)}
                    />
                  </div>
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
      </section>

      <JournalDrawer article={selectedArticle} onClose={() => setSelectedArticleSlug(null)} />
    </main>
  );
}
