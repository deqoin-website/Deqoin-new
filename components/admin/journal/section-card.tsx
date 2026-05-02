"use client";

import { useMemo } from "react";
import { ArrowDown, ArrowUp, Copy, GripVertical, Plus, Trash2 } from "lucide-react";

import { AdminImageDropzone } from "@/components/admin/AdminImageDropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import { FieldGroup } from "./field-group";
import type { JournalSectionDraft } from "./journal-utils";
import { updateArrayItem } from "./journal-utils";

type SectionCardProps = {
  section: JournalSectionDraft;
  index: number;
  onChange: (section: JournalSectionDraft) => void;
  onMove: (direction: "up" | "down") => void;
  onDuplicate: () => void;
  onRemove: () => void;
  onUploadImage: (file: File) => Promise<string>;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  isDragging?: boolean;
};

const SECTION_LABELS: Record<JournalSectionDraft["type"], string> = {
  paragraph: "paragraf",
  image: "görsel",
  technical: "teknik maddeler",
  related: "ilişkili proje",
};

export function SectionCard({
  section,
  index,
  onChange,
  onMove,
  onDuplicate,
  onRemove,
  onUploadImage,
  onDragStart,
  onDragEnd,
  isDragging = false,
}: SectionCardProps) {
  const sectionLabel = useMemo(() => SECTION_LABELS[section.type], [section.type]);

  return (
    <Card
      draggable
      onDragStart={(event) => {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", String(index));
        onDragStart?.();
      }}
      onDragEnd={() => onDragEnd?.()}
      className={cn(
        "border-white/10 bg-white/[0.04] shadow-none transition-all duration-200",
        isDragging && "scale-[0.99] border-white/20 bg-white/[0.08] opacity-80",
      )}
    >
      <CardContent className="space-y-5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={cn("flex h-10 w-10 items-center justify-center rounded-2xl border", isDragging ? "border-white/30 bg-white text-zinc-950" : "border-white/10 bg-white/[0.04] text-white")}>
              <GripVertical className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[0.6rem] tracking-[0.32em] text-zinc-500">blok {String(index + 1).padStart(2, "0")}</p>
              <p className="text-sm text-white">{sectionLabel}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" variant="ghost" size="sm" className="border border-white/10 bg-white/[0.03] text-zinc-200 hover:bg-white hover:text-zinc-950" onClick={onDuplicate}>
              <Copy className="mr-2 h-4 w-4" />
              kopyala
            </Button>
            <Button type="button" variant="ghost" size="sm" className="border border-white/10 bg-white/[0.03] text-zinc-200 hover:bg-white hover:text-zinc-950" onClick={() => onMove("up")}>
              <ArrowUp className="mr-2 h-4 w-4" />
              yukarı
            </Button>
            <Button type="button" variant="ghost" size="sm" className="border border-white/10 bg-white/[0.03] text-zinc-200 hover:bg-white hover:text-zinc-950" onClick={() => onMove("down")}>
              <ArrowDown className="mr-2 h-4 w-4" />
              aşağı
            </Button>
            <Button type="button" variant="ghost" size="sm" className="border border-rose-500/20 bg-rose-500/10 text-rose-100 hover:bg-rose-500 hover:text-white" onClick={onRemove}>
              <Trash2 className="mr-2 h-4 w-4" />
              sil
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/10 px-3 py-2">
          <span className="text-[0.58rem] tracking-[0.3em] text-zinc-500">sürüklemek için sol ikon alanını kullan</span>
          <span className="text-[0.58rem] tracking-[0.28em] text-zinc-500">drag handle</span>
        </div>

        {section.type === "paragraph" && (
          <Textarea
            value={section.body}
            onChange={(event) => onChange({ ...section, body: event.target.value })}
            className="min-h-[180px] bg-white/[0.03] text-[15px] leading-8 text-white placeholder:text-zinc-500"
            placeholder="paragraf metnini yazın..."
          />
        )}

        {section.type === "image" && (
          <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
            <AdminImageDropzone
              accept="image/*"
              aspectClassName="aspect-[16/10]"
              buttonLabel="görsel ekle"
              className="min-h-[320px] border-white/10 bg-white/[0.03]"
              description="görseli yükleyin ya da url ile değiştirin."
              emptySubtitle="journal görsel bloğu."
              emptyTitle="görsel"
              onFileSelect={async (file) => {
                const url = await onUploadImage(file);
                onChange({ ...section, src: url });
              }}
              previewAlt={section.alt || "journal görseli"}
              previewUrl={section.src}
              title="görsel bloğu"
            />

            <div className="space-y-4 rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
              <FieldGroup label="görsel url">
                <Input
                  value={section.src}
                  onChange={(event) => onChange({ ...section, src: event.target.value })}
                  placeholder="https://..."
                />
              </FieldGroup>
              <FieldGroup label="alt metin">
                <Input
                  value={section.alt}
                  onChange={(event) => onChange({ ...section, alt: event.target.value })}
                  placeholder="görsel açıklaması"
                />
              </FieldGroup>
              <FieldGroup label="caption">
                <Input
                  value={section.caption || ""}
                  onChange={(event) => onChange({ ...section, caption: event.target.value })}
                  placeholder="kısa açıklama"
                />
              </FieldGroup>
            </div>
          </div>
        )}

        {section.type === "technical" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[0.6rem] tracking-[0.32em] text-zinc-500">teknik maddeler</p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="border border-white/10 bg-white/[0.03] text-zinc-200 hover:bg-white hover:text-zinc-950"
                onClick={() =>
                  onChange({
                    ...section,
                    items: [...section.items, { label: "başlık", value: "değer" }],
                  })
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                satır ekle
              </Button>
            </div>

            <div className="space-y-3">
              {section.items.map((item, itemIndex) => (
                <div key={`${section.id}-tech-${itemIndex}`} className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
                  <Input
                    value={item.label}
                    onChange={(event) =>
                      onChange({
                        ...section,
                        items: updateArrayItem(section.items, itemIndex, { ...item, label: event.target.value }),
                      })
                    }
                    placeholder="başlık"
                  />
                  <Input
                    value={item.value}
                    onChange={(event) =>
                      onChange({
                        ...section,
                        items: updateArrayItem(section.items, itemIndex, { ...item, value: event.target.value }),
                      })
                    }
                    placeholder="değer"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-11 w-11 border border-white/10 bg-white/[0.03] text-zinc-200 hover:bg-rose-500 hover:text-white"
                    onClick={() =>
                      onChange({
                        ...section,
                        items: section.items.filter((_, currentIndex) => currentIndex !== itemIndex),
                      })
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {section.type === "related" && (
          <div className="space-y-4">
            <FieldGroup label="başlık">
              <Input value={section.title} onChange={(event) => onChange({ ...section, title: event.target.value })} placeholder="ilgili proje bağlantıları" />
            </FieldGroup>

            <div className="flex items-center justify-between">
              <p className="text-[0.6rem] tracking-[0.32em] text-zinc-500">proje satırları</p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="border border-white/10 bg-white/[0.03] text-zinc-200 hover:bg-white hover:text-zinc-950"
                onClick={() =>
                  onChange({
                    ...section,
                    items: [...section.items, { slug: "", title: "yeni proje", label: "proje" }],
                  })
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                satır ekle
              </Button>
            </div>

            <div className="space-y-3">
              {section.items.map((item, itemIndex) => (
                <div key={`${section.id}-related-${itemIndex}`} className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_180px_auto]">
                  <Input
                    value={item.slug}
                    onChange={(event) =>
                      onChange({
                        ...section,
                        items: updateArrayItem(section.items, itemIndex, { ...item, slug: event.target.value }),
                      })
                    }
                    placeholder="proje slug"
                  />
                  <Input
                    value={item.title}
                    onChange={(event) =>
                      onChange({
                        ...section,
                        items: updateArrayItem(section.items, itemIndex, { ...item, title: event.target.value }),
                      })
                    }
                    placeholder="proje başlığı"
                  />
                  <Input
                    value={item.label}
                    onChange={(event) =>
                      onChange({
                        ...section,
                        items: updateArrayItem(section.items, itemIndex, { ...item, label: event.target.value }),
                      })
                    }
                    placeholder="etiket"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-11 w-11 border border-white/10 bg-white/[0.03] text-zinc-200 hover:bg-rose-500 hover:text-white"
                    onClick={() =>
                      onChange({
                        ...section,
                        items: section.items.filter((_, currentIndex) => currentIndex !== itemIndex),
                      })
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
