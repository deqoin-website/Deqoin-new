"use client";

import { Plus, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { JOURNAL_CONTENT_TYPES, JOURNAL_DEPARTMENTS, JOURNAL_PROJECT_TYPES, type JournalArticle } from "@/data/journal";
import { cn } from "@/lib/utils";
import { toTurkishUpperCase } from "@/lib/journal-content";

import { FieldGroup } from "./field-group";
import type { JournalArticleDraft } from "./journal-utils";

type JournalTaxonomyTabProps = {
  article: JournalArticleDraft;
  onUpdateArticle: (updater: (article: JournalArticleDraft) => JournalArticleDraft) => void;
};

export function JournalTaxonomyTab({ article, onUpdateArticle }: JournalTaxonomyTabProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
          <FieldGroup label="içerik türü">
            <Select
              value={article.articleType}
              onChange={(event) =>
                onUpdateArticle((current) => ({ ...current, articleType: event.target.value as JournalArticle["articleType"] }))
              }
            >
              {JOURNAL_CONTENT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {toTurkishUpperCase(type.label)}
                </option>
              ))}
            </Select>
          </FieldGroup>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center justify-between">
            <p className="text-[0.6rem] tracking-[0.08em] text-zinc-500 uppercase">departmanlar</p>
            <Badge variant="outline" className="border-white/10 bg-white/[0.04] text-zinc-300">
              ÇOKLU SEÇİM
            </Badge>
          </div>
          <div className="space-y-2">
            {JOURNAL_DEPARTMENTS.map((department) => {
              const active = article.departments.includes(department.value);

              return (
                <button
                  key={department.value}
                  type="button"
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition-colors",
                    active ? "border-white/20 bg-white/10 text-white" : "border-white/10 bg-black/10 text-zinc-300 hover:bg-white/[0.05]",
                  )}
                  onClick={() =>
                    onUpdateArticle((current) => ({
                      ...current,
                      departments: current.departments.includes(department.value)
                        ? current.departments.filter((value) => value !== department.value)
                        : [...current.departments, department.value],
                    }))
                  }
                >
                  <span className="uppercase">{toTurkishUpperCase(department.label)}</span>
                  <span className="text-xs text-zinc-500 uppercase">{active ? "aktif" : "pasif"}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center justify-between">
            <p className="text-[0.6rem] tracking-[0.08em] text-zinc-500 uppercase">proje tipleri</p>
            <Badge variant="outline" className="border-white/10 bg-white/[0.04] text-zinc-300">
              ÇOKLU SEÇİM
            </Badge>
          </div>
          <div className="space-y-2">
            {JOURNAL_PROJECT_TYPES.map((projectType) => {
              const active = article.projectTypes.includes(projectType.value);

              return (
                <button
                  key={projectType.value}
                  type="button"
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition-colors",
                    active ? "border-white/20 bg-white/10 text-white" : "border-white/10 bg-black/10 text-zinc-300 hover:bg-white/[0.05]",
                  )}
                  onClick={() =>
                    onUpdateArticle((current) => ({
                      ...current,
                      projectTypes: current.projectTypes.includes(projectType.value)
                        ? current.projectTypes.filter((value) => value !== projectType.value)
                        : [...current.projectTypes, projectType.value],
                    }))
                  }
                >
                  <span className="uppercase">{toTurkishUpperCase(projectType.label)}</span>
                  <span className="text-xs text-zinc-500 uppercase">{active ? "aktif" : "pasif"}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
          <FieldGroup label="ilgili proje slugları">
            <div className="space-y-3">
              {article.relatedProjectSlugs.map((slug, index) => (
                <div key={`${article.slug}-related-${index}`} className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
                  <Input
                    value={slug}
                    onChange={(event) =>
                      onUpdateArticle((current) => ({
                        ...current,
                        relatedProjectSlugs: current.relatedProjectSlugs.map((item, currentIndex) =>
                          currentIndex === index ? event.target.value : item,
                        ),
                      }))
                    }
                    placeholder="proje slug"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-11 w-11 border border-white/10 bg-white/[0.03] text-zinc-200 hover:bg-rose-500 hover:text-white"
                    onClick={() =>
                      onUpdateArticle((current) => ({
                        ...current,
                        relatedProjectSlugs: current.relatedProjectSlugs.filter((_, currentIndex) => currentIndex !== index),
                      }))
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="border border-white/10 bg-white/[0.03] text-zinc-200 hover:bg-white hover:text-zinc-950"
              onClick={() =>
                onUpdateArticle((current) => ({
                  ...current,
                  relatedProjectSlugs: [...current.relatedProjectSlugs, ""],
                }))
              }
            >
              <Plus className="mr-2 h-4 w-4" />
              slug ekle
            </Button>
          </FieldGroup>
        </div>

        <div className="space-y-2 rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
          <p className="text-[0.6rem] tracking-[0.08em] text-zinc-500 uppercase">seçili sınıflandırmalar</p>
          <div className="space-y-2 text-sm text-zinc-300">
            <p className="uppercase">departmanlar: {article.departments.map((item) => toTurkishUpperCase(item)).join(", ") || "boş"}</p>
            <p className="uppercase">proje tipleri: {article.projectTypes.map((item) => toTurkishUpperCase(item)).join(", ") || "boş"}</p>
            <p className="uppercase">ilgili slug sayısı: {article.relatedProjectSlugs.filter(Boolean).length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
