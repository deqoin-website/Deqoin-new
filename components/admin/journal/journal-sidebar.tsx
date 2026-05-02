"use client";

import * as React from "react";
import { ChevronDown, ChevronRight, FileText, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { JournalArticleDraft, JournalCategoryNode } from "./journal-utils";

type JournalSidebarProps = {
  categories: JournalCategoryNode[];
  activeType: string | "hero";
  activeArticleSlug: string;
  onSelectHero: () => void;
  onSelectCategory: (type: string) => void;
  onSelectArticle: (article: JournalArticleDraft) => void;
  onCreateArticle: () => void;
};

export function JournalSidebar({
  categories,
  activeType,
  activeArticleSlug,
  onSelectHero,
  onSelectCategory,
  onSelectArticle,
  onCreateArticle,
}: JournalSidebarProps) {
  const [openCategory, setOpenCategory] = React.useState<string | null>(
    activeType === "hero" ? categories[0]?.type ?? null : activeType,
  );

  React.useEffect(() => {
    if (activeType === "hero") return;
    setOpenCategory(activeType);
  }, [activeType]);

  return (
    <aside className="sticky top-0 flex h-[100dvh] w-full max-w-[340px] flex-col border-r border-white/10 bg-[color:var(--admin-bg)]/95 px-4 py-4 backdrop-blur-xl">
      <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4 shadow-[0_20px_70px_rgba(0,0,0,0.25)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[0.62rem] tracking-[0.42em] text-zinc-500">journal admin</p>
            <h1 className="mt-2 text-xl font-medium tracking-[0.08em] text-white">içerik havuzu</h1>
          </div>
          <Button
            type="button"
            size="icon"
            className="h-10 w-10 rounded-2xl border border-white/10 bg-white/[0.05] text-white hover:bg-white hover:text-zinc-950"
            variant="ghost"
            onClick={onCreateArticle}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <Button
          type="button"
          variant="ghost"
          className={`mt-4 flex h-auto w-full items-center justify-between rounded-2xl border px-4 py-3 text-left ${
            activeType === "hero" ? "border-white/20 bg-white/10 text-white" : "border-white/10 bg-white/[0.03] text-zinc-300"
          }`}
          onClick={onSelectHero}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/20">
              <FileText className="h-4 w-4" />
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-medium">sayfa kahramanı</p>
              <p className="text-xs text-zinc-400">ana journal vitrin ayarları</p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-zinc-500" />
        </Button>
      </div>

      <div className="mt-4 flex-1 overflow-y-auto pr-1">
        <div className="space-y-3">
          {categories.map((category) => {
            const isCategoryActive = activeType === category.type;
            const isOpen = openCategory === category.type || isCategoryActive;

            return (
              <div key={category.type} className="overflow-hidden rounded-[1.4rem] border border-white/10 bg-white/[0.03]">
                <button
                  type="button"
                  className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors ${
                    isCategoryActive ? "bg-white/[0.06] text-white" : "text-zinc-300 hover:bg-white/[0.04]"
                  }`}
                  onClick={() => {
                    setOpenCategory(isOpen ? null : category.type);
                    onSelectCategory(category.type);
                  }}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="min-w-0 flex-1 truncate text-sm font-medium">{category.label.toLowerCase()}</span>
                    <Badge variant="outline" className="border-white/10 bg-white/[0.04] text-[10px] text-zinc-300">
                      {category.count}
                    </Badge>
                  </div>
                  <ChevronDown className={`h-4 w-4 shrink-0 text-zinc-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>

                {isOpen && (
                  <div className="space-y-2 border-t border-white/10 bg-white/[0.02] p-3">
                    <button
                      type="button"
                      className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition-colors ${
                        isCategoryActive ? "border-white/20 bg-white/10 text-white" : "border-white/10 bg-black/10 text-zinc-300 hover:bg-white/[0.05]"
                      }`}
                      onClick={() => onSelectCategory(category.type)}
                    >
                      <span>listeyi aç</span>
                      <span className="text-[0.7rem] text-zinc-500">{category.articles.length} makale</span>
                    </button>

                    <div className="space-y-1">
                      {category.articles.map((article) => {
                        const isActive = activeArticleSlug === article.slug;

                        return (
                          <button
                            key={article.slug}
                            type="button"
                            className={`flex w-full items-start gap-3 rounded-xl border px-3 py-2 text-left transition-colors ${
                              isActive ? "border-white/20 bg-white/10 text-white" : "border-white/10 bg-black/10 text-zinc-300 hover:bg-white/[0.05]"
                            }`}
                            onClick={() => onSelectArticle(article)}
                          >
                            <div className="mt-0.5 h-2 w-2 rounded-full bg-[color:var(--admin-accent)]" />
                            <div className="min-w-0 space-y-1">
                              <p className="truncate text-sm font-medium">{article.title.toLowerCase()}</p>
                              <p className="truncate text-xs text-zinc-500">{article.slug}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
