"use client";

import * as React from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { type JournalSection } from "@/data/journal";
import { toTurkishUpperCase } from "@/lib/journal-content";

import { FieldGroup } from "./field-group";
import { SectionCard } from "./section-card";
import { SectionDropTarget } from "./section-drop-target";
import type { JournalArticleDraft, JournalSectionDraft } from "./journal-utils";
import { createEmptySection, moveArrayItem, reorderArray } from "./journal-utils";

type JournalBuilderTabProps = {
  article: JournalArticleDraft;
  onUpdateArticle: (updater: (article: JournalArticleDraft) => JournalArticleDraft) => void;
  onUploadImage: (file: File) => Promise<string>;
  draggedBlockIndex: number | null;
  blockDropTargetIndex: number | null;
  onStartBlockDrag: (index: number | null) => void;
  onSetBlockDropTarget: (index: number | null) => void;
};

const SECTION_OPTIONS: Array<{ value: JournalSection["type"]; label: string; description: string }> = [
  { value: "paragraph", label: "paragraf", description: "uzun editoryal metin" },
  { value: "image", label: "görsel", description: "tam genişlik medya bloğu" },
  { value: "technical", label: "teknik maddeler", description: "özellik ve not listesi" },
  { value: "related", label: "ilişkili proje", description: "proje bağlantıları" },
];

export function JournalBuilderTab({
  article,
  onUpdateArticle,
  onUploadImage,
  draggedBlockIndex,
  blockDropTargetIndex,
  onStartBlockDrag,
  onSetBlockDropTarget,
}: JournalBuilderTabProps) {
  const [newBlockType, setNewBlockType] = React.useState<JournalSection["type"]>("paragraph");

  const addBlock = () => {
    onUpdateArticle((current) => ({
      ...current,
      sections: [...current.sections, createEmptySection(newBlockType)],
    }));
  };

  const duplicateBlock = (sectionIndex: number) => {
    onUpdateArticle((current) => {
      const section = current.sections[sectionIndex];
      if (!section) return current;

      const copy: JournalSectionDraft = {
        ...(section as JournalSectionDraft),
        id: `${section.type}-copy-${Date.now().toString(36)}`,
      };
      const sections = [...current.sections];
      sections.splice(sectionIndex + 1, 0, copy);
      return { ...current, sections };
    });
  };

  const moveBlock = (sectionIndex: number, direction: "up" | "down") => {
    onUpdateArticle((current) => ({
      ...current,
      sections: moveArrayItem(current.sections, sectionIndex, direction) as JournalSectionDraft[],
    }));
  };

  const reorderBlock = (fromIndex: number, toIndex: number) => {
    onUpdateArticle((current) => ({
      ...current,
      sections: reorderArray(current.sections, fromIndex, toIndex) as JournalSectionDraft[],
    }));
    onSetBlockDropTarget(null);
    onStartBlockDrag(null);
  };

  const updateBlock = (sectionIndex: number, nextSection: JournalSectionDraft) => {
    onUpdateArticle((current) => ({
      ...current,
      sections: current.sections.map((section, index) => (index === sectionIndex ? nextSection : section)),
    }));
  };

  const removeBlock = (sectionIndex: number) => {
    onUpdateArticle((current) => ({
      ...current,
      sections: current.sections.filter((_, index) => index !== sectionIndex),
    }));
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)]">
      <div className="space-y-4 rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
        <FieldGroup label="yeni blok" helper="blok türünü seçip hızlıca yeni içerik ekleyin.">
          <Select value={newBlockType} onChange={(event) => setNewBlockType(event.target.value as JournalSection["type"])}>
            {SECTION_OPTIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {toTurkishUpperCase(item.label)}
              </option>
            ))}
          </Select>
        </FieldGroup>

        <Button type="button" className="w-full bg-white uppercase text-zinc-950 hover:bg-zinc-200" onClick={addBlock}>
          <Plus className="mr-2 h-4 w-4" />
          blok ekle
        </Button>

        <div className="space-y-2">
          {SECTION_OPTIONS.map((option) => (
            <div key={option.value} className="rounded-xl border border-white/10 bg-black/10 px-3 py-2">
              <p className="text-sm uppercase text-white">{toTurkishUpperCase(option.label)}</p>
              <p className="text-xs uppercase text-zinc-500">{option.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {article.sections.length === 0 ? (
          <Card className="border-white/10 bg-white/[0.03] shadow-none">
            <CardContent className="px-6 py-16 text-center uppercase text-zinc-400">henüz blok yok. soldan yeni blok ekleyin.</CardContent>
          </Card>
        ) : (
          <>
            {article.sections.map((section, sectionIndex) => {
              const isDragging = draggedBlockIndex === sectionIndex;
              const dropActive = blockDropTargetIndex === sectionIndex;

              return (
                <React.Fragment key={section.id}>
                  <SectionDropTarget
                    index={sectionIndex}
                    active={dropActive}
                    onDropItem={() => {
                      const fromIndex = draggedBlockIndex ?? sectionIndex;
                      if (fromIndex === sectionIndex) {
                        onSetBlockDropTarget(null);
                        onStartBlockDrag(null);
                        return;
                      }
                      reorderBlock(fromIndex, sectionIndex);
                    }}
                    onDragEnter={() => onSetBlockDropTarget(sectionIndex)}
                    onDragLeave={() => onSetBlockDropTarget(null)}
                  />
                  <SectionCard
                    section={section}
                    index={sectionIndex}
                    onChange={(nextSection) => updateBlock(sectionIndex, nextSection)}
                    onMove={(direction) => moveBlock(sectionIndex, direction)}
                    onDuplicate={() => duplicateBlock(sectionIndex)}
                    onRemove={() => removeBlock(sectionIndex)}
                    onUploadImage={onUploadImage}
                    onDragStart={() => onStartBlockDrag(sectionIndex)}
                    onDragEnd={() => {
                      onStartBlockDrag(null);
                      onSetBlockDropTarget(null);
                    }}
                    isDragging={isDragging}
                  />
                </React.Fragment>
              );
            })}
            <SectionDropTarget
              index={article.sections.length}
              active={blockDropTargetIndex === article.sections.length}
              onDropItem={() => {
                if (draggedBlockIndex === null) {
                  onSetBlockDropTarget(null);
                  return;
                }
                reorderBlock(draggedBlockIndex, article.sections.length);
              }}
              onDragEnter={() => onSetBlockDropTarget(article.sections.length)}
              onDragLeave={() => onSetBlockDropTarget(null)}
            />
          </>
        )}
      </div>
    </div>
  );
}
