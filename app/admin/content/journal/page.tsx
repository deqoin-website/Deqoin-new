"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Loader2, Plus, RefreshCw, Save, Search, Eye, NotebookText } from "lucide-react";

import { useNotification } from "@/components/admin/AdminNotificationProvider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { JournalArticle } from "@/data/journal";
import {
  createDefaultJournalDraft,
  normalizeJournalDraft,
  serializeJournalDraft,
  toTurkishLowerCase,
  toTurkishUpperCase,
} from "@/lib/journal-content";

import { JournalDialogs } from "@/components/admin/journal/journal-dialogs";
import { JournalEditor } from "@/components/admin/journal/journal-editor";
import { JournalSidebar } from "@/components/admin/journal/journal-sidebar";
import {
  buildJournalCategories,
  clone,
  createEmptyArticle,
  ensureJournalDraft,
  slugify,
  stripArticle,
  type JournalArticleDraft,
  type JournalDraftState,
} from "@/components/admin/journal/journal-utils";
import { cn } from "@/lib/utils";

type ContentScope = "hero" | JournalArticle["articleType"];
type ContentStatus = "idle" | "loading" | "ok" | "error";

const PAGE_SIZE = 6;

function matchesQuery(article: JournalArticleDraft, query: string) {
  if (!query) return true;
  return [
    article.title,
    article.slug,
    article.deck,
    article.articleType,
    article.departments.join(" "),
    article.projectTypes.join(" "),
    article.relatedProjectSlugs.join(" "),
  ]
    .join(" ")
    .toLocaleLowerCase("tr-TR")
    .includes(query);
}

function formatCountLabel(value: number) {
  return value.toLocaleString("tr-TR");
}

function ArticleTable({
  articles,
  activeSlug,
  onSelectArticle,
  onDuplicateArticle,
  onDeleteArticle,
}: {
  articles: JournalArticleDraft[];
  activeSlug: string;
  onSelectArticle: (article: JournalArticleDraft) => void;
  onDuplicateArticle: (article: JournalArticleDraft) => void;
  onDeleteArticle: (article: JournalArticleDraft) => void;
}) {
  if (articles.length === 0) {
    return (
      <Card className="border-white/10 bg-white/[0.03] shadow-none">
        <CardContent className="px-6 py-14 text-sm uppercase text-zinc-400">
          bu filtre için içerik bulunamadı.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-white/10 bg-white/[0.03] shadow-none">
      <CardContent className="overflow-x-auto p-0">
        <table className="min-w-full border-separate border-spacing-0">
          <thead className="sticky top-0 z-10 bg-[color:var(--admin-bg)]/90 backdrop-blur">
            <tr className="text-left text-[0.62rem] tracking-[0.08em] text-zinc-500 uppercase">
              <th className="border-b border-white/10 px-5 py-4 font-medium">başlık</th>
              <th className="border-b border-white/10 px-5 py-4 font-medium">slug</th>
              <th className="border-b border-white/10 px-5 py-4 font-medium">kategori</th>
              <th className="border-b border-white/10 px-5 py-4 font-medium">yayın</th>
              <th className="border-b border-white/10 px-5 py-4 font-medium">okuma</th>
              <th className="border-b border-white/10 px-5 py-4 font-medium">durum</th>
              <th className="border-b border-white/10 px-5 py-4 font-medium">işlem</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => {
              const isActive = activeSlug === article.slug;

              return (
                <tr
                  key={article.slug}
                  className={cn(
                    "cursor-pointer transition-colors hover:bg-white/[0.04]",
                    isActive && "bg-white/[0.08]",
                  )}
                  onClick={() => onSelectArticle(article)}
                >
                  <td className="border-b border-white/10 px-5 py-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-white">{toTurkishLowerCase(article.title)}</p>
                      <p className="text-xs text-zinc-500">{toTurkishLowerCase(article.deck)}</p>
                    </div>
                  </td>
                  <td className="border-b border-white/10 px-5 py-4 text-sm text-zinc-300">{article.slug}</td>
                  <td className="border-b border-white/10 px-5 py-4">
                    <Badge variant="outline" className="border-white/10 bg-white/[0.04] text-zinc-300">
                      {toTurkishLowerCase(article.articleType)}
                    </Badge>
                  </td>
                  <td className="border-b border-white/10 px-5 py-4 text-sm text-zinc-400">{toTurkishLowerCase(article.publishedAt)}</td>
                  <td className="border-b border-white/10 px-5 py-4 text-sm text-zinc-400">{toTurkishLowerCase(article.readTime)}</td>
                  <td className="border-b border-white/10 px-5 py-4">
                    <span className="text-xs tracking-[0.08em] text-[color:var(--admin-accent)] uppercase">aktif</span>
                  </td>
                  <td className="border-b border-white/10 px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-9 border border-white/10 bg-white/[0.03] uppercase text-zinc-200 hover:bg-white hover:text-zinc-950"
                        onClick={(event) => {
                          event.stopPropagation();
                          onSelectArticle(article);
                        }}
                        >
                        aç
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-9 border border-white/10 bg-white/[0.03] uppercase text-zinc-200 hover:bg-white hover:text-zinc-950"
                        onClick={(event) => {
                          event.stopPropagation();
                          onDuplicateArticle(article);
                        }}
                        >
                        kopyala
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-9 border border-rose-500/20 bg-rose-500/10 uppercase text-rose-100 hover:bg-rose-500 hover:text-white"
                        onClick={(event) => {
                          event.stopPropagation();
                          onDeleteArticle(article);
                        }}
                        >
                        sil
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

function HeroSettingsCard({
  draft,
  onChange,
  featuredArticle,
}: {
  draft: JournalDraftState;
  onChange: (updater: (current: JournalDraftState) => JournalDraftState) => void;
  featuredArticle: JournalArticleDraft | null;
}) {
  return (
    <Card className="border-white/10 bg-white/[0.03] shadow-none">
      <CardHeader className="space-y-2 border-b border-white/10">
        <CardTitle className="text-sm font-medium tracking-[0.08em] text-white uppercase">sayfa kahramanı</CardTitle>
        <CardDescription className="uppercase text-zinc-400">
          ana journal sayfasının vitrin başlığı, alt metni ve öne çıkan içeriği.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <div className="space-y-4 rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-[0.6rem] tracking-[0.08em] text-zinc-500 uppercase">sayfa başlığı</p>
                <Input
                  value={draft.pageTitle}
                  onChange={(event) => onChange((current) => ({ ...current, pageTitle: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <p className="text-[0.6rem] tracking-[0.08em] text-zinc-500 uppercase">öne çıkan makale</p>
                <Select
                  value={draft.hero.featuredArticleSlug}
                  onChange={(event) =>
                    onChange((current) => ({
                      ...current,
                      hero: { ...current.hero, featuredArticleSlug: event.target.value },
                    }))
                  }
                >
                  {draft.articles.map((article) => (
                    <option key={article.slug} value={article.slug}>
                      {toTurkishUpperCase(article.title)}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[0.6rem] tracking-[0.08em] text-zinc-500 uppercase">başlık</p>
              <Input
                value={draft.hero.title}
                onChange={(event) => onChange((current) => ({ ...current, hero: { ...current.hero, title: event.target.value } }))}
              />
            </div>

            <div className="space-y-2">
              <p className="text-[0.6rem] tracking-[0.08em] text-zinc-500 uppercase">alt başlık</p>
              <Input
                value={draft.hero.subtitle}
                onChange={(event) => onChange((current) => ({ ...current, hero: { ...current.hero, subtitle: event.target.value } }))}
              />
            </div>

            <div className="space-y-2">
              <p className="text-[0.6rem] tracking-[0.08em] text-zinc-500 uppercase">açıklama</p>
              <Textarea
                value={draft.hero.description}
                onChange={(event) => onChange((current) => ({ ...current, hero: { ...current.hero, description: event.target.value } }))}
                className="min-h-[170px] bg-white/[0.03] text-white placeholder:text-zinc-500"
              />
            </div>
          </div>

          <div className="space-y-4">
            <Card className="overflow-hidden border-white/10 bg-black/20 shadow-none">
              <div className="relative aspect-[16/10] border-b border-white/10 bg-white/[0.02]">
                {featuredArticle?.coverImage ? (
                  <Image src={featuredArticle.coverImage} alt={featuredArticle.title} fill className="object-cover" />
                ) : (
                <div className="flex h-full items-center justify-center uppercase text-zinc-500">önizleme yok</div>
              )}
            </div>
            <CardContent className="space-y-3 p-4">
              <p className="text-[0.6rem] tracking-[0.08em] text-zinc-500 uppercase">vitrin önizlemesi</p>
                <p className="text-sm uppercase text-zinc-300">
                  {featuredArticle ? toTurkishUpperCase(featuredArticle.title) : "özel içerik seçilmedi"}
                </p>
                <p className="text-sm uppercase leading-7 text-zinc-400">{draft.hero.description}</p>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/[0.03] shadow-none">
              <CardContent className="space-y-3 p-4 text-sm uppercase leading-7 text-zinc-400">
                <p>sayfa kahramanı paneli artık sidebar üstünde sabit bir link ile açılır.</p>
                <p>aktif kategori görünümünden bağımsızdır ve ayrı bir vitrin yüzeyi olarak çalışır.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function JournalAdminPage() {
  const { showToast } = useNotification();
  const [draft, setDraft] = useState<JournalDraftState>(() => ensureJournalDraft(createDefaultJournalDraft()));
  const [activeView, setActiveView] = useState<ContentScope>("hero");
  const [selectedArticleSlug, setSelectedArticleSlug] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [editorTab, setEditorTab] = useState("meta");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isImportingSeoPack, setIsImportingSeoPack] = useState(false);
  const [apiStatus, setApiStatus] = useState<ContentStatus>("idle");
  const [hasDirtyState, setHasDirtyState] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [draggedBlockIndex, setDraggedBlockIndex] = useState<number | null>(null);
  const [blockDropTargetIndex, setBlockDropTargetIndex] = useState<number | null>(null);

  const categories = useMemo(() => buildJournalCategories(draft.articles), [draft.articles]);

  const setNextDraft = (updater: (current: JournalDraftState) => JournalDraftState) => {
    setDraft((current) => {
      const next = updater(current);
      setHasDirtyState(true);
      return next;
    });
  };

  const uploadJournalImage = async (file: File) => {
    setIsUploadingImage(true);
    try {
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: "POST",
        body: file,
      });

      const payload = await response.json().catch(() => null);
      const uploadedUrl = payload?.url || payload?.secure_url || payload?.downloadUrl;

      if (!response.ok || !uploadedUrl) {
        throw new Error(payload?.error || "Upload failed");
      }

      return uploadedUrl as string;
    } finally {
      setIsUploadingImage(false);
    }
  };

  const fetchContent = useCallback(async () => {
    setIsLoading(true);
    setApiStatus("loading");

    try {
      const response = await fetch("/api/admin/journal", { cache: "no-store" });
      const payload = await response.json().catch(() => null);
      const normalized = normalizeJournalDraft(response.ok ? payload : null);
      const nextDraft = ensureJournalDraft(normalized);

      setDraft(nextDraft);
      setActiveView(nextDraft.articles[0]?.articleType ?? "hero");
      setSelectedArticleSlug(nextDraft.articles[0]?.slug ?? "");
      setCurrentPage(0);
      setEditorTab("meta");
      setHasDirtyState(false);
      setApiStatus(response.ok ? "ok" : "error");

      if (!response.ok) {
        showToast("journal içeriği için varsayılan veri yüklendi.", "warning");
      }
    } catch (error) {
      console.error("Journal admin load error:", error);
      const fallback = ensureJournalDraft(createDefaultJournalDraft());
      setDraft(fallback);
      setActiveView(fallback.articles[0]?.articleType ?? "hero");
      setSelectedArticleSlug(fallback.articles[0]?.slug ?? "");
      setCurrentPage(0);
      setEditorTab("meta");
      setHasDirtyState(false);
      setApiStatus("error");
      showToast("journal içerikleri yüklenemedi, varsayılan veri gösteriliyor.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    void fetchContent();
  }, [fetchContent]);

  useEffect(() => {
    setCurrentPage(0);
  }, [activeView, searchTerm]);

  const visibleArticles = useMemo(() => {
    const scopeArticles = activeView === "hero" ? draft.articles : draft.articles.filter((article) => article.articleType === activeView);
    const query = toTurkishLowerCase(searchTerm.trim());
    return scopeArticles.filter((article) => matchesQuery(article, query));
  }, [activeView, draft.articles, searchTerm]);

  useEffect(() => {
    if (activeView === "hero") return;
    if (visibleArticles.length === 0) {
      setSelectedArticleSlug("");
      return;
    }

    if (!selectedArticleSlug || !visibleArticles.some((article) => article.slug === selectedArticleSlug)) {
      setSelectedArticleSlug(visibleArticles[0].slug);
    }
  }, [activeView, selectedArticleSlug, visibleArticles]);

  const pageCount = Math.max(1, Math.ceil(visibleArticles.length / PAGE_SIZE));
  const currentPageSafe = Math.min(currentPage, pageCount - 1);
  const paginatedArticles = visibleArticles.slice(currentPageSafe * PAGE_SIZE, (currentPageSafe + 1) * PAGE_SIZE);

  const selectedArticle =
    draft.articles.find((article) => article.slug === selectedArticleSlug) ??
    (activeView !== "hero" ? visibleArticles[0] ?? null : null);

  const featuredArticle =
    draft.articles.find((article) => article.slug === draft.hero.featuredArticleSlug) ?? draft.articles[0] ?? null;

  const patchSelectedArticle = (updater: (article: JournalArticleDraft) => JournalArticleDraft) => {
    if (!selectedArticle) return;

    setNextDraft((current) => ({
      ...current,
      articles: current.articles.map((article) => (article.slug === selectedArticle.slug ? updater(article) : article)),
    }));
  };

  const addArticle = () => {
    const nextArticle = createEmptyArticle(draft.articles.length);
    setNextDraft((current) => ({
      ...current,
      articles: [...current.articles, nextArticle],
      hero: { ...current.hero, featuredArticleSlug: current.hero.featuredArticleSlug || nextArticle.slug },
    }));
    setActiveView(nextArticle.articleType);
    setSelectedArticleSlug(nextArticle.slug);
    setEditorTab("meta");
  };

  const selectArticle = (article: JournalArticleDraft) => {
    setActiveView(article.articleType);
    setSelectedArticleSlug(article.slug);
    setEditorTab("meta");
  };

  const duplicateArticle = (article: JournalArticleDraft) => {
    const copy = clone(article);
    copy.slug = slugify(`${copy.slug}-copy`);
    copy.title = `${copy.title} / kopya`;
    copy.sections = copy.sections.map((section, index) => ({ ...section, id: `${section.type}-copy-${index}-${Date.now().toString(36)}` }));

    setNextDraft((current) => {
      const articleIndex = current.articles.findIndex((item) => item.slug === article.slug);
      if (articleIndex < 0) return current;

      const articles = [...current.articles];
      articles.splice(articleIndex + 1, 0, copy);
      return { ...current, articles };
    });
  };

  const deleteArticle = (article: JournalArticleDraft) => {
    setNextDraft((current) => {
      if (current.articles.length <= 1) return current;

      const articles = current.articles.filter((item) => item.slug !== article.slug);
      return {
        ...current,
        articles,
        hero: {
          ...current.hero,
          featuredArticleSlug:
            current.hero.featuredArticleSlug === article.slug ? articles[0]?.slug || "" : current.hero.featuredArticleSlug,
        },
      };
    });

    if (selectedArticleSlug === article.slug) {
      setSelectedArticleSlug("");
    }
  };

  const saveJournal = async () => {
    setIsSaving(true);
    setApiStatus("loading");

    try {
      const payload = serializeJournalDraft({
        pageTitle: draft.pageTitle,
        hero: clone(draft.hero),
        articles: draft.articles.map(stripArticle),
      });

      const response = await fetch("/api/admin/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Save failed with ${response.status}`);
      }

      const responseData = await response.json().catch(() => null);
      const normalized = normalizeJournalDraft(responseData ?? payload);
      const nextDraft = ensureJournalDraft(normalized);

      setDraft(nextDraft);
      setActiveView(nextDraft.articles[0]?.articleType ?? "hero");
      setSelectedArticleSlug(nextDraft.articles[0]?.slug ?? "");
      setCurrentPage(0);
      setHasDirtyState(false);
      setApiStatus("ok");
      showToast("journal içeriği kaydedildi.", "success");
    } catch (error) {
      console.error("Journal save error:", error);
      setApiStatus("error");
      showToast("journal içeriği kaydedilemedi.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const loadSeoPack = async () => {
    setIsImportingSeoPack(true);
    setApiStatus("loading");

    try {
      const response = await fetch("/api/admin/journal/seo-pack", { cache: "no-store" });
      const payload = await response.json().catch(() => null);
      const normalized = normalizeJournalDraft(response.ok ? payload : null);
      const nextDraft = ensureJournalDraft(normalized);

      setDraft(nextDraft);
      setActiveView(nextDraft.articles[0]?.articleType ?? "hero");
      setSelectedArticleSlug(nextDraft.articles[0]?.slug ?? "");
      setCurrentPage(0);
      setEditorTab("meta");
      setHasDirtyState(true);
      setApiStatus(response.ok ? "ok" : "error");

      if (!response.ok) {
        showToast("SEO paketi yüklenemedi.", "error");
        return;
      }

      showToast("SEO paketi editöre yüklendi. İstersen şimdi kaydedebilirsin.", "success");
    } catch (error) {
      console.error("Journal SEO pack load error:", error);
      setApiStatus("error");
      showToast("SEO paketi yüklenemedi.", "error");
    } finally {
      setIsImportingSeoPack(false);
    }
  };

  const refreshDraft = async () => {
    await fetchContent();
    showToast("journal taslağı yenilendi.", "info");
  };

  const activeCategory = activeView === "hero" ? null : categories.find((category) => category.type === activeView) ?? null;
  const tableTotalPages = Math.max(1, Math.ceil(visibleArticles.length / PAGE_SIZE));
  const tablePageLabel = `${currentPageSafe + 1} / ${tableTotalPages}`;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-[color:var(--admin-accent)]" />
      </div>
    );
  }

  return (
    <div className="flex min-h-[100dvh] bg-[color:var(--admin-bg)] text-white">
      <JournalSidebar
        categories={categories}
        activeType={activeView}
        activeArticleSlug={selectedArticleSlug}
        onSelectHero={() => setActiveView("hero")}
        onSelectCategory={(type) => setActiveView(type as ContentScope)}
        onSelectArticle={selectArticle}
        onCreateArticle={addArticle}
      />

      <main className="min-w-0 flex-1 px-4 py-4 md:px-6 md:py-6">
        <div className="mx-auto flex max-w-[1520px] flex-col gap-5">
          <Card className="border-white/10 bg-white/[0.03] shadow-none">
            <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="border-white/10 bg-white/[0.04] text-zinc-300">
                    journal cms
                  </Badge>
                  <Badge variant="outline" className="border-white/10 bg-white/[0.04] text-zinc-300">
                    {apiStatus === "ok" ? "api bağlı" : apiStatus === "loading" ? "senkronize ediliyor" : apiStatus === "error" ? "yerel taslak" : "hazır"}
                  </Badge>
                  {hasDirtyState && (
                    <Badge variant="outline" className="border-amber-500/20 bg-amber-500/10 text-amber-100">
                      kaydedilmemiş değişiklik
                    </Badge>
                  )}
                  {isUploadingImage && (
                    <Badge variant="outline" className="border-sky-500/20 bg-sky-500/10 text-sky-100">
                      görsel yükleniyor
                    </Badge>
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-[0.6rem] tracking-[0.08em] text-zinc-500 uppercase">editoryal yönetim paneli</p>
                  <h2 className="text-3xl font-medium tracking-[0.02em] text-white uppercase md:text-5xl">journal içerikleri</h2>
                  <p className="max-w-3xl text-sm leading-7 text-zinc-400">
                    içerik tiplerine göre hiyerarşik sidebar, kategori bazlı tablo ve tab ile ayrılmış düzenleme akışı.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                  <Button
                  type="button"
                  variant="ghost"
                  className="border border-white/10 bg-white/[0.03] text-zinc-200 uppercase hover:bg-white hover:text-zinc-950"
                  onClick={() => setNotesOpen(true)}
                >
                  <NotebookText className="mr-2 h-4 w-4" />
                  hızlı notlar
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="border border-white/10 bg-white/[0.03] text-zinc-200 uppercase hover:bg-white hover:text-zinc-950"
                  onClick={() => setPreviewOpen(true)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  önizleme
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="border border-white/10 bg-white/[0.03] text-zinc-200 uppercase hover:bg-white hover:text-zinc-950"
                  onClick={loadSeoPack}
                  disabled={isImportingSeoPack}
                >
                  {isImportingSeoPack ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                  seo paketi yükle
                </Button>
                <Button
                  type="button"
                  className="bg-white uppercase text-zinc-950 hover:bg-zinc-200"
                  onClick={saveJournal}
                  disabled={isSaving}
                >
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  kaydet
                </Button>
              </div>
            </CardContent>
          </Card>

          {activeView === "hero" ? (
          <HeroSettingsCard
            draft={draft}
            onChange={setNextDraft}
            featuredArticle={featuredArticle}
          />
          ) : (
            <>
              <Card className="border-white/10 bg-white/[0.03] shadow-none">
                <CardHeader className="space-y-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-sm font-medium tracking-[0.08em] text-white uppercase">
                        {activeCategory ? toTurkishUpperCase(activeCategory.label) : toTurkishUpperCase(activeView)}
                      </CardTitle>
                      <CardDescription className="uppercase text-zinc-400">
                        seçili kategoriye ait makaleler tablo görünümünde listelenir. satıra tıklayın, düzenleyici alanda açılır.
                      </CardDescription>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="relative w-full min-w-[260px] lg:w-[320px]">
                        <Input
                          value={searchTerm}
                          onChange={(event) => setSearchTerm(event.target.value)}
                          placeholder="başlık, slug, etiket"
                          className="pl-10"
                        />
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        className="border border-white/10 bg-white/[0.03] uppercase text-zinc-200 hover:bg-white hover:text-zinc-950"
                        onClick={addArticle}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        yeni makale
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-4">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-[0.55rem] tracking-[0.08em] text-zinc-500 uppercase">makale</p>
                      <p className="mt-2 text-xl text-white">{formatCountLabel(visibleArticles.length)}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-[0.55rem] tracking-[0.08em] text-zinc-500 uppercase">sayfa</p>
                      <p className="mt-2 text-xl text-white">{tablePageLabel}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-[0.55rem] tracking-[0.08em] text-zinc-500 uppercase">kategori</p>
                      <p className="mt-2 text-xl text-white">{activeCategory ? toTurkishUpperCase(activeCategory.label) : toTurkishUpperCase(activeView)}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-[0.55rem] tracking-[0.08em] text-zinc-500 uppercase">durum</p>
                      <p className="mt-2 text-xl text-white">{hasDirtyState ? "düzenlendi" : "hazır"}</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ArticleTable
                    articles={paginatedArticles}
                    activeSlug={selectedArticleSlug}
                    onSelectArticle={selectArticle}
                    onDuplicateArticle={duplicateArticle}
                    onDeleteArticle={deleteArticle}
                  />

                  {tableTotalPages > 1 && (
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-sm uppercase text-zinc-400">
                        {visibleArticles.length} içerikten {currentPageSafe * PAGE_SIZE + 1}-{Math.min((currentPageSafe + 1) * PAGE_SIZE, visibleArticles.length)} arası gösteriliyor.
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          className="border border-white/10 bg-white/[0.03] uppercase text-zinc-200 hover:bg-white hover:text-zinc-950"
                          onClick={() => setCurrentPage((current) => Math.max(0, current - 1))}
                          disabled={currentPageSafe === 0}
                        >
                          önceki
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          className="border border-white/10 bg-white/[0.03] uppercase text-zinc-200 hover:bg-white hover:text-zinc-950"
                          onClick={() => setCurrentPage((current) => Math.min(tableTotalPages - 1, current + 1))}
                          disabled={currentPageSafe >= tableTotalPages - 1}
                        >
                          sonraki
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <JournalEditor
                article={selectedArticle}
                draft={draft}
                activeTab={editorTab}
                onTabChange={setEditorTab}
                onUpdateArticle={patchSelectedArticle}
                onUploadImage={uploadJournalImage}
                draggedBlockIndex={draggedBlockIndex}
                blockDropTargetIndex={blockDropTargetIndex}
                onStartBlockDrag={setDraggedBlockIndex}
                onSetBlockDropTarget={setBlockDropTargetIndex}
              />
            </>
          )}

          <Card className="border-white/10 bg-white/[0.03] shadow-none">
            <CardContent className="flex flex-col gap-3 p-5 text-sm uppercase text-zinc-400 lg:flex-row lg:items-start">
              <div className="rounded-full border border-white/10 bg-white/[0.04] p-2 text-[color:var(--admin-accent)]">
                <RefreshCw className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <p>hiyerarşik sidebar, kategori tablosu ve tab’lı editor artık tek sayfa üzerinde birlikte çalışır.</p>
                <p>quick notes ve preview alanları editör dışına alınarak dialog yüzeyinde tetiklenir.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <JournalDialogs
        notesOpen={notesOpen}
        onNotesOpenChange={setNotesOpen}
        previewOpen={previewOpen}
        onPreviewOpenChange={setPreviewOpen}
        article={selectedArticle}
      />
    </div>
  );
}
