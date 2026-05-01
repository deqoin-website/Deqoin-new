"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import {
  ArrowDown,
  ArrowUp,
  Copy,
  Eye,
  FileText,
  Image as ImageIcon,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  Search,
  Sparkles,
  Trash2,
  Link2,
  GripVertical,
} from "lucide-react";

import { useNotification } from "@/components/admin/AdminNotificationProvider";
import { AdminImageDropzone } from "@/components/admin/AdminImageDropzone";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  JOURNAL_CONTENT_TYPES,
  JOURNAL_DEPARTMENTS,
  JOURNAL_PROJECT_TYPES,
  type JournalImageAsset,
  type JournalArticle,
  type JournalSection,
} from "@/data/journal";
import {
  createDefaultJournalDraft,
  normalizeJournalDraft,
  serializeJournalDraft,
  type JournalHeroDraft,
  type JournalPageDraft,
} from "@/lib/journal-content";
import { cn } from "@/lib/utils";

type SectionDraft = JournalSection & { id: string };
type ArticleDraft = JournalArticle & { sections: SectionDraft[] };
type EditorDraft = Omit<JournalPageDraft, "articles"> & { articles: ArticleDraft[] };

type ContentStatus = "idle" | "loading" | "ok" | "error";

type SectionType = JournalSection["type"];

const SECTION_TYPES: Array<{ value: SectionType; label: string; description: string; icon: typeof FileText }> = [
  { value: "paragraph", label: "Paragraf", description: "Uzun editoryal metin", icon: FileText },
  { value: "image", label: "Görsel", description: "Tam genişlik görsel blok", icon: ImageIcon },
  { value: "technical", label: "Teknik", description: "Veri ve malzeme listesi", icon: Sparkles },
  { value: "related", label: "İlişkili", description: "Proje bağlantı bloğu", icon: Link2 },
];

const createId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`;

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || `journal-entry-${Date.now().toString(36)}`;

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function attachSectionIds(sections: JournalSection[]): SectionDraft[] {
  return sections.map((section, index) => ({
    ...clone(section),
    id: createId(`${section.type}-${index + 1}`),
  }));
}

function createEmptySection(type: SectionType): SectionDraft {
  switch (type) {
    case "image":
      return { id: createId("image"), type, src: "", alt: "Journal görseli", caption: "", gallery: [] };
    case "technical":
      return { id: createId("technical"), type, items: [{ label: "BAŞLIK", value: "DEĞER" }] };
    case "related":
      return {
        id: createId("related"),
        type,
        title: "İLGİLİ PROJE BAĞLANTILARI",
        items: [{ slug: "", title: "YENİ PROJE", label: "PROJE" }],
      };
    case "paragraph":
    default:
      return { id: createId("paragraph"), type: "paragraph", body: "" };
  }
}

function createEmptyArticle(index: number): ArticleDraft {
  return {
    slug: `journal-entry-${index + 1}`,
    title: `YENİ JOURNAL MAKALESİ ${index + 1}`,
    deck: "Journal arşivi için kısa editoryal özet.",
    coverImage: "/images/projects/gallery_1.png",
    publishedAt: "01 MAYIS 2026",
    readTime: "05 DK",
    articleType: "İÇGÖRÜLER",
    departments: ["MİMARİ"],
    projectTypes: ["KONUT"],
    contentTypes: ["İÇGÖRÜLER"],
    relatedProjectSlugs: [],
    intro: "Bu makale için giriş metnini buraya yazın.",
    sections: attachSectionIds([
      {
        type: "paragraph",
        body: "İçerik bloklarını buradan oluşturun.",
      },
    ]),
  };
}

function ensureEditorDraft(value: JournalPageDraft): EditorDraft {
  return {
    ...clone(value),
    articles: value.articles.map((article, index) => ({
      ...clone(article),
      slug: article.slug || `journal-entry-${index + 1}`,
      sections: attachSectionIds(article.sections),
    })),
  };
}

function stripArticle(article: ArticleDraft): JournalArticle {
  return {
    ...clone(article),
    sections: article.sections.map((section) => {
      const { id: _id, ...rest } = section;
      return rest;
    }),
  };
}

function cloneHero(hero: JournalHeroDraft): JournalHeroDraft {
  return clone(hero);
}

function updateListValue<T>(values: T[], value: T) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

function moveArrayItem<T>(values: T[], index: number, direction: "up" | "down") {
  const target = direction === "up" ? index - 1 : index + 1;
  if (target < 0 || target >= values.length) return values;
  const next = [...values];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

function fileNameFromUrl(url: string) {
  try {
    const pathname = new URL(url).pathname;
    return pathname.split("/").pop() || "journal-image";
  } catch {
    return "journal-image";
  }
}

function reorderArray<T>(values: T[], fromIndex: number, toIndex: number) {
  if (fromIndex === toIndex) return values;
  if (fromIndex < 0 || toIndex < 0 || fromIndex >= values.length || toIndex > values.length) return values;

  const next = [...values];
  const [moved] = next.splice(fromIndex, 1);
  const targetIndex = Math.max(0, Math.min(toIndex, next.length));
  next.splice(targetIndex, 0, moved);
  return next;
}

function createGalleryAsset(src: string, label?: string): JournalImageAsset {
  const normalizedLabel = label?.trim();
  return {
    src,
    alt: normalizedLabel || fileNameFromUrl(src),
    caption: normalizedLabel || undefined,
  };
}

function ImageGalleryEditor({
  gallery,
  onChange,
  onUploadImage,
}: {
  gallery: JournalImageAsset[];
  onChange: (nextGallery: JournalImageAsset[]) => void;
  onUploadImage?: (file: File) => Promise<string>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dragDepth = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  const resetInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, []);

  const openPicker = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const addFiles = useCallback(
    async (files: FileList | File[] | null) => {
      if (!onUploadImage) return;
      const list = Array.from(files ?? []);
      if (list.length === 0) return;

      const uploaded = await Promise.all(
        list.map(async (file) => {
          const src = await onUploadImage(file);
          return createGalleryAsset(src, file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim() || "Görsel");
        }),
      );

      onChange([...gallery, ...uploaded]);
      resetInput();
    },
    [gallery, onChange, onUploadImage, resetInput],
  );

  const handleDragEnter = (event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    dragDepth.current += 1;
    setIsDragging(true);
  };

  const handleDragOver = (event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragLeave = (event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    dragDepth.current = 0;
    setIsDragging(false);
    await addFiles(event.dataTransfer.files);
  };

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      await addFiles(event.target.files);
    } finally {
      resetInput();
    }
  };

  return (
    <div className="space-y-4 rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4 md:p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/35">GALERİ</p>
          <p className="text-sm leading-6 text-white/60">Çoklu yükleme ile bölümün altında bir görsel serisi oluşturun.</p>
        </div>
        <Badge variant="outline" className="border-white/10 bg-white/[0.03] text-white/70">
          {gallery.length} görsel
        </Badge>
      </div>

      <button
        type="button"
        className={cn(
          "group relative flex min-h-[140px] w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-[1.35rem] border-2 border-dashed border-white/10 bg-white/[0.03] px-5 py-6 text-center transition-all",
          "hover:border-white/20 hover:bg-white/[0.05]",
          isDragging ? "border-white/35 bg-white/[0.07] shadow-[0_0_0_5px_rgba(255,255,255,0.04)]" : "",
        )}
        onClick={openPicker}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleChange} />
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/20 text-white">
          <Plus className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <p className="text-sm uppercase tracking-[0.28em] text-white">GÖRSELLERİ EKLE</p>
          <p className="text-[0.68rem] uppercase tracking-[0.3em] text-white/45">
            Sürükleyip bırakın, tıklayın veya birden fazla dosya seçin
          </p>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-60" />
      </button>

      {gallery.length > 0 ? (
        <div className="grid gap-3 xl:grid-cols-2">
          {gallery.map((image, galleryIndex) => (
            <div
              key={`${image.src}-${galleryIndex}`}
              className="space-y-3 rounded-[1.25rem] border border-white/10 bg-black/15 p-3"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1rem] border border-white/10 bg-black">
                <Image src={image.src} alt={image.alt} fill className="h-full w-full object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
              </div>
              <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
                <div className="space-y-2">
                  <Input
                    value={image.src}
                    onChange={(event) =>
                      onChange(
                        gallery.map((currentImage, currentIndex) =>
                          currentIndex === galleryIndex
                            ? {
                                ...currentImage,
                                src: event.target.value,
                                alt: currentImage.alt || fileNameFromUrl(event.target.value),
                              }
                            : currentImage,
                        ),
                      )
                    }
                    placeholder="https://... veya /gorsel.jpg"
                    className="bg-white/[0.03]"
                  />
                  <Input
                    value={image.alt}
                    onChange={(event) =>
                      onChange(
                        gallery.map((currentImage, currentIndex) =>
                          currentIndex === galleryIndex ? { ...currentImage, alt: event.target.value } : currentImage,
                        ),
                      )
                    }
                    placeholder="Alt metin"
                    className="bg-white/[0.03]"
                  />
                  <Input
                    value={image.caption || ""}
                    onChange={(event) =>
                      onChange(
                        gallery.map((currentImage, currentIndex) =>
                          currentIndex === galleryIndex ? { ...currentImage, caption: event.target.value } : currentImage,
                        ),
                      )
                    }
                    placeholder="Kısa açıklama"
                    className="bg-white/[0.03]"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-11 w-11 rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-100 hover:bg-rose-500 hover:text-white"
                  onClick={() => onChange(gallery.filter((_, currentIndex) => currentIndex !== galleryIndex))}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-[1.25rem] border border-dashed border-white/10 bg-white/[0.02] px-4 py-5 text-sm leading-7 text-white/50">
          Galeri boş. Birden fazla görsel yükleyerek bölümünüzü seri halinde kurgulayabilirsiniz.
        </div>
      )}
    </div>
  );
}

function SectionDropTarget({
  index,
  active,
  onDropItem,
  onDragEnter,
  onDragLeave,
}: {
  index: number;
  active: boolean;
  onDropItem: () => void;
  onDragEnter: () => void;
  onDragLeave: () => void;
}) {
  return (
    <div
      className={cn(
        "group relative h-14 rounded-[1.25rem] border border-dashed transition-all duration-200",
        active
          ? "border-white/35 bg-white/[0.08] shadow-[0_0_0_1px_rgba(255,255,255,0.14),0_12px_45px_rgba(0,0,0,0.18)]"
          : "border-white/10 bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.05]",
      )}
      onDragOver={(event) => {
        event.preventDefault();
        onDragEnter();
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        onDragLeave();
      }}
      onDrop={(event) => {
        event.preventDefault();
        onDropItem();
      }}
    >
      <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full border transition-colors",
              active ? "border-white/35 bg-white text-zinc-950" : "border-white/10 bg-white/[0.04] text-white/45",
            )}
          >
            <GripVertical className="h-4 w-4" />
          </div>
          <div className="space-y-0.5">
            <p className="text-[0.58rem] uppercase tracking-[0.35em] text-white/55">
              Bölüm bırakma alanı
            </p>
            <p className="text-[0.68rem] uppercase tracking-[0.25em] text-white/35">
              {active ? "Bırakmak için bırakın" : "Bu çizgiye bir bölümü bırakın"}
            </p>
          </div>
        </div>
        <Badge variant="outline" className="border-white/10 bg-white/[0.03] text-white/60">
          #{String(index + 1).padStart(2, "0")}
        </Badge>
      </div>
    </div>
  );
}

function SectionEditor({
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
}: {
  section: SectionDraft;
  index: number;
  onChange: (section: SectionDraft) => void;
  onMove: (direction: "up" | "down") => void;
  onDuplicate: () => void;
  onRemove: () => void;
  onUploadImage?: (file: File) => Promise<string>;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  isDragging?: boolean;
}) {
  const sectionMeta = SECTION_TYPES.find((item) => item.value === section.type) || SECTION_TYPES[0];
  const SectionIcon = sectionMeta.icon;

  return (
    <Card
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={cn(
        "rounded-[1.5rem] border-white/10 bg-white/[0.04] shadow-none transition-all duration-200",
        isDragging ? "scale-[0.995] border-white/20 bg-white/[0.07] opacity-80" : "",
      )}
    >
      <CardContent className="p-5 md:p-6 space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white">
              <SectionIcon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/35">BÖLÜM {String(index + 1).padStart(2, "0")}</p>
              <p className="text-sm uppercase tracking-[0.25em] text-white/80">{sectionMeta.label}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex h-10 items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 text-[0.55rem] uppercase tracking-[0.35em] text-white/45">
              <GripVertical className="h-4 w-4" />
              SÜRÜKLE
            </div>
            <Button type="button" variant="ghost" size="sm" className="border border-white/10 bg-white/[0.03] text-white hover:bg-white hover:text-zinc-950" onClick={onDuplicate}>
              <Copy className="mr-2 h-4 w-4" />
              KOPYALA
            </Button>
            <Button type="button" variant="ghost" size="sm" className="border border-white/10 bg-white/[0.03] text-white hover:bg-white hover:text-zinc-950" onClick={() => onMove("up")}>
              <ArrowUp className="mr-2 h-4 w-4" />
              YUKARI
            </Button>
            <Button type="button" variant="ghost" size="sm" className="border border-white/10 bg-white/[0.03] text-white hover:bg-white hover:text-zinc-950" onClick={() => onMove("down")}>
              <ArrowDown className="mr-2 h-4 w-4" />
              AŞAĞI
            </Button>
            <Button type="button" variant="ghost" size="sm" className="border border-rose-500/20 bg-rose-500/10 text-rose-200 hover:bg-rose-500 hover:text-white" onClick={onRemove}>
              <Trash2 className="mr-2 h-4 w-4" />
              SİL
            </Button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)]">
          <div className="space-y-2">
            <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/35">BÖLÜM TİPİ</p>
            <Select
              value={section.type}
              onChange={(event) => {
                onChange(createEmptySection(event.target.value as SectionType));
              }}
            >
              {SECTION_TYPES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/35">AÇIKLAMA</p>
            <p className="text-sm leading-7 text-white/65">{sectionMeta.description}</p>
          </div>
        </div>

        {section.type === "paragraph" && (
          <div className="space-y-2">
            <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/35">METİN</p>
            <Textarea
              value={section.body}
              onChange={(event) => onChange({ ...section, body: event.target.value })}
              className="min-h-[180px] rounded-[1.25rem] bg-white/[0.03] text-[15px] leading-8 tracking-[0.08em] uppercase text-white placeholder:text-white/25"
              placeholder="Editoryal metni yazın..."
            />
          </div>
        )}

        {section.type === "image" && (
          <div className="grid gap-4 2xl:grid-cols-[1.1fr_0.9fr]">
            <AdminImageDropzone
              accept="image/*"
              aspectClassName="aspect-[16/10]"
              buttonLabel="Görsel ekle"
              className="min-h-[340px] rounded-[1.5rem] border-white/10 bg-white/[0.03]"
              description="Sürükleyip bırakın, tıklayıp seçin veya mevcut URL'i değiştirin."
              emptySubtitle="Journal bölüm görseli yükleyin."
              emptyTitle="Bölüm görseli"
              onFileSelect={async (file) => {
                if (!onUploadImage) return;
                const url = await onUploadImage(file);
                onChange({ ...section, src: url });
              }}
              previewAlt={section.alt || "Journal görseli"}
              previewUrl={section.src}
              title="BÖLÜM GÖRSELİ"
            />

            <div className="space-y-4">
              <div className="space-y-4 rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4 md:p-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/35">GÖRSEL URL</p>
                    <Input
                      value={section.src}
                      onChange={(event) => onChange({ ...section, src: event.target.value })}
                      placeholder="https://... veya /local-image.jpg"
                      className="bg-white/[0.03]"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/35">ALT METİN</p>
                    <Input
                      value={section.alt}
                      onChange={(event) => onChange({ ...section, alt: event.target.value })}
                      placeholder="Görsel açıklaması"
                      className="bg-white/[0.03]"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/35">CAPTION</p>
                  <Input
                    value={section.caption || ""}
                    onChange={(event) => onChange({ ...section, caption: event.target.value })}
                    placeholder="Görsel altı açıklama"
                    className="bg-white/[0.03]"
                  />
                </div>
              </div>

              <ImageGalleryEditor
                gallery={section.gallery ?? []}
                onChange={(nextGallery) =>
                  onChange({
                    ...section,
                    gallery: nextGallery,
                  })
                }
                onUploadImage={onUploadImage}
              />
            </div>
          </div>
        )}

        {section.type === "technical" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/35">TEKNİK MADDELER</p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="border border-white/10 bg-white/[0.03] text-white hover:bg-white hover:text-zinc-950"
                onClick={() =>
                  onChange({
                    ...section,
                    items: [...section.items, { label: "YENİ BAŞLIK", value: "YENİ DEĞER" }],
                  })
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                SATIR EKLE
              </Button>
            </div>
            <div className="space-y-3">
              {section.items.map((item, itemIndex) => (
                <div key={`${section.id}-technical-${itemIndex}`} className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
                  <Input
                    value={item.label}
                    onChange={(event) =>
                      onChange({
                        ...section,
                        items: section.items.map((currentItem, currentIndex) =>
                          currentIndex === itemIndex ? { ...currentItem, label: event.target.value } : currentItem,
                        ),
                      })
                    }
                    placeholder="Başlık"
                  />
                  <Input
                    value={item.value}
                    onChange={(event) =>
                      onChange({
                        ...section,
                        items: section.items.map((currentItem, currentIndex) =>
                          currentIndex === itemIndex ? { ...currentItem, value: event.target.value } : currentItem,
                        ),
                      })
                    }
                    placeholder="Değer"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="border border-white/10 bg-white/[0.03] text-white hover:bg-rose-500 hover:text-white"
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
            <div className="space-y-2">
              <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/35">BAŞLIK</p>
              <Input
                value={section.title}
                onChange={(event) => onChange({ ...section, title: event.target.value })}
                placeholder="İlgili proje bağlantıları"
              />
            </div>

            <div className="flex items-center justify-between">
              <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/35">PROJE SATIRLARI</p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="border border-white/10 bg-white/[0.03] text-white hover:bg-white hover:text-zinc-950"
                onClick={() =>
                  onChange({
                    ...section,
                    items: [...section.items, { slug: "", title: "YENİ PROJE", label: "PROJE" }],
                  })
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                SATIR EKLE
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
                        items: section.items.map((currentItem, currentIndex) =>
                          currentIndex === itemIndex ? { ...currentItem, slug: event.target.value } : currentItem,
                        ),
                      })
                    }
                    placeholder="Proje slug"
                  />
                  <Input
                    value={item.title}
                    onChange={(event) =>
                      onChange({
                        ...section,
                        items: section.items.map((currentItem, currentIndex) =>
                          currentIndex === itemIndex ? { ...currentItem, title: event.target.value } : currentItem,
                        ),
                      })
                    }
                    placeholder="Proje başlığı"
                  />
                  <Input
                    value={item.label}
                    onChange={(event) =>
                      onChange({
                        ...section,
                        items: section.items.map((currentItem, currentIndex) =>
                          currentIndex === itemIndex ? { ...currentItem, label: event.target.value } : currentItem,
                        ),
                      })
                    }
                    placeholder="Etiket"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="border border-white/10 bg-white/[0.03] text-white hover:bg-rose-500 hover:text-white"
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

export default function JournalAdminPage() {
  const { showToast } = useNotification();
  const [draft, setDraft] = useState<EditorDraft>(() => ensureEditorDraft(createDefaultJournalDraft()));
  const [selectedSlug, setSelectedSlug] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [newSectionType, setNewSectionType] = useState<SectionType>("paragraph");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [apiStatus, setApiStatus] = useState<ContentStatus>("idle");
  const [hasDirtyState, setHasDirtyState] = useState(false);
  const [draggedArticleIndex, setDraggedArticleIndex] = useState<number | null>(null);
  const [draggedSectionIndex, setDraggedSectionIndex] = useState<number | null>(null);
  const [sectionDropTargetIndex, setSectionDropTargetIndex] = useState<number | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const selectedIndex = useMemo(() => draft.articles.findIndex((article) => article.slug === selectedSlug), [draft.articles, selectedSlug]);
  const selectedArticle = selectedIndex >= 0 ? draft.articles[selectedIndex] : draft.articles[0] || null;

  const filteredArticles = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return draft.articles;

    return draft.articles.filter((article) =>
      [
        article.title,
        article.slug,
        article.deck,
        article.articleType,
        article.departments.join(" "),
        article.projectTypes.join(" "),
        article.contentTypes.join(" "),
      ]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [draft.articles, searchTerm]);

  const setNextDraft = (updater: (current: EditorDraft) => EditorDraft) => {
    setDraft((current) => {
      const next = updater(current);
      setHasDirtyState(true);
      return next;
    });
  };

  const uploadJournalImage = useCallback(async (file: File) => {
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
  }, []);

  const fetchContent = useCallback(async () => {
    setIsLoading(true);
    setApiStatus("loading");

    try {
      const res = await fetch("/api/admin/journal", { cache: "no-store" });
      const data = await res.json().catch(() => null);
      const normalized = normalizeJournalDraft(res.ok ? data : null);
      const nextDraft = ensureEditorDraft(normalized);

      setDraft(nextDraft);
      setSelectedSlug(nextDraft.articles[0]?.slug ?? "");
      setDraggedArticleIndex(null);
      setDraggedSectionIndex(null);
      setSectionDropTargetIndex(null);
      setHasDirtyState(false);
      setApiStatus(res.ok ? "ok" : "error");

      if (!res.ok) {
        showToast("Journal içeriği için varsayılan veri yüklendi.", "warning");
      }
    } catch (error) {
      console.error("Journal admin load error:", error);
      const fallback = ensureEditorDraft(createDefaultJournalDraft());
      setDraft(fallback);
      setSelectedSlug(fallback.articles[0]?.slug ?? "");
      setDraggedArticleIndex(null);
      setDraggedSectionIndex(null);
      setSectionDropTargetIndex(null);
      setHasDirtyState(false);
      setApiStatus("error");
      showToast("Journal içerikleri yüklenemedi, varsayılan veri gösteriliyor.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    void fetchContent();
  }, [fetchContent]);

  useEffect(() => {
    if (draft.articles.length === 0) {
      setSelectedSlug("");
      return;
    }

    if (!selectedSlug || !draft.articles.some((article) => article.slug === selectedSlug)) {
      setSelectedSlug(draft.articles[0].slug);
    }
  }, [draft.articles, selectedSlug]);

  const updateSelectedArticle = (updater: (article: ArticleDraft) => ArticleDraft) => {
    if (selectedIndex < 0) return;

    setNextDraft((current) => {
      const articles = [...current.articles];
      articles[selectedIndex] = updater(articles[selectedIndex]);
      return { ...current, articles };
    });
  };

  const addArticle = () => {
    setNextDraft((current) => {
      const nextArticle = createEmptyArticle(current.articles.length);
      const articles = [...current.articles, nextArticle];
      setSelectedSlug(nextArticle.slug);
      return { ...current, articles, hero: { ...current.hero, featuredArticleSlug: current.hero.featuredArticleSlug || nextArticle.slug } };
    });
  };

  const duplicateArticle = (index: number) => {
    setNextDraft((current) => {
      const original = current.articles[index];
      if (!original) return current;
      const copy = clone(original);
      copy.slug = slugify(`${copy.slug}-copy`);
      copy.title = `${copy.title} / KOPYA`;
      copy.sections = attachSectionIds(copy.sections);
      const articles = [...current.articles];
      articles.splice(index + 1, 0, copy);
      return { ...current, articles };
    });
  };

  const removeArticle = (index: number) => {
    setNextDraft((current) => {
      if (current.articles.length <= 1) return current;
      const removedSlug = current.articles[index]?.slug;
      const articles = current.articles.filter((_, itemIndex) => itemIndex !== index);
      const nextSelected = articles[Math.min(index, articles.length - 1)]?.slug ?? "";
      setSelectedSlug(nextSelected);
      const nextFeaturedSlug =
        current.hero.featuredArticleSlug === removedSlug
          ? nextSelected
          : current.hero.featuredArticleSlug || nextSelected;
      return { ...current, articles, hero: { ...current.hero, featuredArticleSlug: nextFeaturedSlug } };
    });
  };

  const moveArticle = (index: number, direction: "up" | "down") => {
    setNextDraft((current) => ({ ...current, articles: moveArrayItem(current.articles, index, direction) as ArticleDraft[] }));
  };

  const reorderArticle = (fromIndex: number, toIndex: number) => {
    setNextDraft((current) => ({
      ...current,
      articles: reorderArray(current.articles, fromIndex, toIndex) as ArticleDraft[],
    }));
  };

  const addSection = () => {
    updateSelectedArticle((article) => ({
      ...article,
      sections: [...article.sections, createEmptySection(newSectionType)],
    }));
  };

  const duplicateSection = (sectionIndex: number) => {
    updateSelectedArticle((article) => {
      const section = article.sections[sectionIndex];
      if (!section) return article;
      const copy = clone(section) as SectionDraft;
      copy.id = createId(`${copy.type}-copy`);
      const sections = [...article.sections];
      sections.splice(sectionIndex + 1, 0, copy);
      return { ...article, sections };
    });
  };

  const removeSection = (sectionIndex: number) => {
    updateSelectedArticle((article) => ({
      ...article,
      sections: article.sections.filter((_, index) => index !== sectionIndex),
    }));
  };

  const moveSection = (sectionIndex: number, direction: "up" | "down") => {
    updateSelectedArticle((article) => ({
      ...article,
      sections: moveArrayItem(article.sections, sectionIndex, direction) as SectionDraft[],
    }));
  };

  const reorderSection = (fromIndex: number, toIndex: number) => {
    updateSelectedArticle((article) => ({
      ...article,
      sections: reorderArray(article.sections, fromIndex, toIndex) as SectionDraft[],
    }));
  };

  const updateSection = (sectionIndex: number, nextSection: SectionDraft) => {
    updateSelectedArticle((article) => ({
      ...article,
      sections: article.sections.map((section, index) => (index === sectionIndex ? nextSection : section)),
    }));
  };

  const resetChanges = async () => {
    await fetchContent();
    showToast("Journal taslağı yeniden yüklendi.", "info");
  };

  const saveJournal = async () => {
    setIsSaving(true);
    setApiStatus("loading");

    try {
      const payload = serializeJournalDraft({
        pageTitle: draft.pageTitle,
        hero: cloneHero(draft.hero),
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
      const nextDraft = ensureEditorDraft(normalized);
      setDraft(nextDraft);
      setDraggedArticleIndex(null);
      setDraggedSectionIndex(null);
      setSectionDropTargetIndex(null);
      setHasDirtyState(false);
      setApiStatus("ok");
      showToast("Journal içeriği kaydedildi.", "success");
    } catch (error) {
      console.error("Journal save error:", error);
      setApiStatus("error");
      showToast("Journal içeriği kaydedilemedi.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const heroArticle = draft.articles.find((article) => article.slug === draft.hero.featuredArticleSlug) || draft.articles[0];

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-[color:var(--accent)]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <Card className="relative overflow-hidden border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(166,137,102,0.22),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] shadow-[0_35px_120px_rgba(0,0,0,0.28)]">
        <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.25)_1px,transparent_0)] [background-size:24px_24px]" />
        <CardContent className="relative flex flex-col gap-6 p-6 md:p-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-4xl space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline" className="border-white/10 bg-white/5 text-white/80">
                JOURNAL CMS
              </Badge>
              <Badge variant="outline" className="border-amber-500/20 bg-amber-500/10 text-amber-100">
                {apiStatus === "ok" ? "API BAĞLI" : apiStatus === "loading" ? "SENKRONİZE EDİLİYOR" : apiStatus === "error" ? "YEREL TASLAK" : "HAZIR"}
              </Badge>
              {hasDirtyState && (
                <Badge variant="outline" className="border-rose-500/20 bg-rose-500/10 text-rose-100">
                  KAYDEDİLMEMİŞ DEĞİŞİKLİK
                </Badge>
              )}
            </div>

            <div className="space-y-3">
              <p className="text-[0.62rem] uppercase tracking-[0.5em] text-white/42">EDITORYAL YÖNETİM PANELİ</p>
              <h1 className="max-w-4xl text-[clamp(2.3rem,5vw,4.8rem)] font-thin uppercase leading-[0.86] tracking-[0.1em] text-white" style={{ fontFamily: "Smooch Sans, sans-serif" }}>
                JOURNAL İÇERİKLERİ
              </h1>
              <p className="max-w-3xl text-sm uppercase tracking-[0.28em] text-white/62 md:text-[0.85rem]">
                Arşiv başlığı, öne çıkan makale, liste düzeni ve detay içerikleri tek bir panelden yönetilir.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button type="button" variant="ghost" className="border border-white/10 bg-white/[0.03] text-white hover:bg-white hover:text-zinc-950" onClick={resetChanges}>
              <RefreshCw className="mr-2 h-4 w-4" />
              YENİLE
            </Button>
            <Button type="button" variant="ghost" className="border border-white/10 bg-white/[0.03] text-white hover:bg-white hover:text-zinc-950" onClick={saveJournal} disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              KAYDET
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
          <Card className="border-white/10 bg-white/[0.04] shadow-none">
            <CardHeader className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-sm uppercase tracking-[0.32em] text-white/90">Makale Havuzu</CardTitle>
                  <CardDescription className="mt-2 text-white/55">Sürüklemeden düzenlenebilir içerik listesi.</CardDescription>
                </div>
                <Button type="button" size="icon" className="h-11 w-11 rounded-2xl bg-white text-zinc-950 hover:bg-white/90" onClick={addArticle}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/35">MAKALE ARA</p>
                <div className="relative">
                  <Input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Başlık, slug, etiket"
                    className="bg-white/[0.03] pl-10"
                  />
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                  <p className="text-[0.55rem] uppercase tracking-[0.42em] text-white/35">Makale</p>
                  <p className="mt-2 text-xl text-white">{draft.articles.length}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                  <p className="text-[0.55rem] uppercase tracking-[0.42em] text-white/35">Bölüm</p>
                  <p className="mt-2 text-xl text-white">{draft.articles.reduce((sum, article) => sum + article.sections.length, 0)}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                  <p className="text-[0.55rem] uppercase tracking-[0.42em] text-white/35">Durum</p>
                  <p className="mt-2 text-xl text-white">{hasDirtyState ? "!" : "OK"}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                {filteredArticles.map((article, index) => {
                  const actualIndex = draft.articles.findIndex((item) => item.slug === article.slug);
                  const isActive = article.slug === selectedSlug;
                  const isDragging = draggedArticleIndex === actualIndex;

                  return (
                    <motion.button
                      type="button"
                      key={article.slug}
                      layout
                      draggable
                      onDragStart={() => setDraggedArticleIndex(actualIndex)}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={() => {
                        if (draggedArticleIndex !== null) {
                          reorderArticle(draggedArticleIndex, actualIndex);
                        }
                        setDraggedArticleIndex(null);
                      }}
                      onDragEnd={() => setDraggedArticleIndex(null)}
                      onClick={() => setSelectedSlug(article.slug)}
                      className={cn(
                        "w-full rounded-[1.35rem] border p-4 text-left transition-all",
                        isActive
                          ? "border-white/20 bg-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.22)]"
                          : "border-white/10 bg-white/[0.03] hover:border-white/15 hover:bg-white/[0.06]",
                        isDragging ? "opacity-80 scale-[0.99]" : "",
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="outline" className="border-white/10 bg-white/[0.04] text-[9px] text-white/70">
                              {article.articleType}
                            </Badge>
                            <Badge variant="outline" className="border-white/10 bg-white/[0.04] text-[9px] text-white/60">
                              {article.readTime}
                            </Badge>
                          </div>
                          <h3 className="text-sm uppercase tracking-[0.24em] text-white">{article.title}</h3>
                          <p className="line-clamp-2 text-xs leading-6 text-white/55">{article.deck}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <p className="text-[0.55rem] uppercase tracking-[0.42em] text-white/35">#{String(index + 1).padStart(2, "0")}</p>
                          <div className="flex gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-xl border border-white/10 bg-white/[0.03] text-white hover:bg-white hover:text-zinc-950"
                              onClick={(event) => {
                                event.stopPropagation();
                                moveArticle(actualIndex, "up");
                              }}
                            >
                              <ArrowUp className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-xl border border-white/10 bg-white/[0.03] text-white hover:bg-white hover:text-zinc-950"
                              onClick={(event) => {
                                event.stopPropagation();
                                moveArticle(actualIndex, "down");
                              }}
                            >
                              <ArrowDown className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-9 border border-white/10 bg-white/[0.03] text-[10px] uppercase tracking-[0.35em] text-white hover:bg-white hover:text-zinc-950"
                          onClick={(event) => {
                            event.stopPropagation();
                            duplicateArticle(actualIndex);
                          }}
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          KOPYALA
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-9 border border-rose-500/20 bg-rose-500/10 text-[10px] uppercase tracking-[0.35em] text-rose-100 hover:bg-rose-500 hover:text-white"
                          onClick={(event) => {
                            event.stopPropagation();
                            removeArticle(actualIndex);
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          SİL
                        </Button>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.04] shadow-none">
            <CardHeader>
              <CardTitle className="text-sm uppercase tracking-[0.32em] text-white/90">Hızlı Notlar</CardTitle>
              <CardDescription className="text-white/55">Yayın akışını net tutmak için bu alanı kullanın.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-white/65">
              <p>Journal sayfası artık tek bir içerik kaynağından yönetilebilir.</p>
              <p>API bağlantısı çalışmadığında mevcut statik arşiv otomatik yedek olarak kullanılır.</p>
              <p>Yeni makale ekledikten sonra slug alanını benzersiz tutun.</p>
            </CardContent>
          </Card>
        </aside>

        <section className="space-y-6">
          <Card className="border-white/10 bg-white/[0.04] shadow-none">
            <CardHeader className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-sm uppercase tracking-[0.32em] text-white/90">Sayfa Kahramanı</CardTitle>
                  <CardDescription className="mt-2 text-white/55">Ana Journal başlığı ve öne çıkan makale.</CardDescription>
                </div>
                <Badge variant="outline" className="border-white/10 bg-white/[0.03] text-white/70">
                  {draft.hero.featuredArticleSlug || "Öne çıkan yok"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-4">
                <AdminImageDropzone
                  accept="image/*"
                  aspectClassName="aspect-[16/9]"
                  buttonLabel="Kapak ekle"
                  className="min-h-[320px] rounded-[1.5rem] border-white/10 bg-white/[0.03]"
                  description="Kapak görselini sürükleyip bırakın ya da seçin."
                  emptySubtitle="Journal arşivinin kapak görseli."
                  emptyTitle="Kapak görseli"
                  onFileSelect={async (file) => {
                    const url = await uploadJournalImage(file);
                    updateSelectedArticle((article) => ({
                      ...article,
                      coverImage: url,
                    }));
                  }}
                  previewAlt={selectedArticle?.title || "Journal kapak görseli"}
                  previewUrl={selectedArticle?.coverImage}
                  title="KAPAK GÖRSELİ"
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/35">BAŞLIK</p>
                    <Input
                      value={draft.pageTitle}
                      onChange={(event) =>
                        setNextDraft((current) => ({
                          ...current,
                          pageTitle: event.target.value,
                        }))
                      }
                      className="bg-white/[0.03]"
                    />
                  </div>

                  <div className="space-y-2">
                    <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/35">ÖNE ÇIKAN MAKALE</p>
                    <Select
                      value={draft.hero.featuredArticleSlug}
                      onChange={(event) =>
                        setNextDraft((current) => ({
                          ...current,
                          hero: { ...current.hero, featuredArticleSlug: event.target.value },
                        }))
                      }
                    >
                      {draft.articles.map((article) => (
                        <option key={article.slug} value={article.slug}>
                          {article.title}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-4 rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4 md:p-5">
                <div className="space-y-2">
                  <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/35">KAHRAMAN BAŞLIK</p>
                  <Input
                    value={draft.hero.title}
                    onChange={(event) =>
                      setNextDraft((current) => ({
                        ...current,
                        hero: { ...current.hero, title: event.target.value },
                      }))
                    }
                    className="bg-white/[0.03]"
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/35">ALT BAŞLIK</p>
                  <Input
                    value={draft.hero.subtitle}
                    onChange={(event) =>
                      setNextDraft((current) => ({
                        ...current,
                        hero: { ...current.hero, subtitle: event.target.value },
                      }))
                    }
                    className="bg-white/[0.03]"
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/35">AÇIKLAMA</p>
                  <Textarea
                    value={draft.hero.description}
                    onChange={(event) =>
                      setNextDraft((current) => ({
                        ...current,
                        hero: { ...current.hero, description: event.target.value },
                      }))
                    }
                    className="min-h-[170px] bg-white/[0.03] uppercase tracking-[0.08em] text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 text-[0.58rem] uppercase tracking-[0.38em] text-white/45">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                    <p>Makale</p>
                    <p className="mt-2 text-lg text-white">{draft.articles.length}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                    <p>Durum</p>
                    <p className="mt-2 text-lg text-white">{isUploadingImage ? "Yükleniyor" : hasDirtyState ? "Düzenlendi" : "Hazır"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {selectedArticle ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedArticle.slug}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <Card className="border-white/10 bg-white/[0.04] shadow-none">
                  <CardHeader className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <CardTitle className="text-sm uppercase tracking-[0.32em] text-white/90">Aktif Makale</CardTitle>
                        <CardDescription className="mt-2 text-white/55">Seçili makalenin meta alanları ve katalog etiketleri.</CardDescription>
                      </div>
                      <Badge variant="outline" className="border-white/10 bg-white/[0.03] text-white/70">
                        {selectedArticle.sections.length} bölüm
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="grid gap-4 lg:grid-cols-2">
                      <div className="space-y-2">
                        <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/35">SLUG</p>
                        <Input
                          value={selectedArticle.slug}
                          onChange={(event) =>
                            updateSelectedArticle((article) => ({
                              ...article,
                              slug: slugify(event.target.value),
                            }))
                          }
                          className="bg-white/[0.03]"
                        />
                      </div>
                      <div className="space-y-2">
                        <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/35">YAYIN TARİHİ</p>
                        <Input
                          value={selectedArticle.publishedAt}
                          onChange={(event) =>
                            updateSelectedArticle((article) => ({
                              ...article,
                              publishedAt: event.target.value.toUpperCase(),
                            }))
                          }
                          className="bg-white/[0.03]"
                        />
                      </div>
                      <div className="space-y-2">
                        <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/35">BAŞLIK</p>
                        <Input
                          value={selectedArticle.title}
                          onChange={(event) =>
                            updateSelectedArticle((article) => ({
                              ...article,
                              title: event.target.value.toUpperCase(),
                            }))
                          }
                          className="bg-white/[0.03]"
                        />
                      </div>
                      <div className="space-y-2">
                        <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/35">OKUMA SÜRESİ</p>
                        <Input
                          value={selectedArticle.readTime}
                          onChange={(event) =>
                            updateSelectedArticle((article) => ({
                              ...article,
                              readTime: event.target.value.toUpperCase(),
                            }))
                          }
                          className="bg-white/[0.03]"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2">
                      <div className="space-y-2">
                        <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/35">KAPAK GÖRSELİ</p>
                        <Input
                          value={selectedArticle.coverImage}
                          onChange={(event) =>
                            updateSelectedArticle((article) => ({
                              ...article,
                              coverImage: event.target.value,
                            }))
                          }
                          className="bg-white/[0.03]"
                        />
                      </div>
                      <div className="space-y-2">
                        <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/35">ANA TÜR</p>
                        <Select
                          value={selectedArticle.articleType}
                          onChange={(event) =>
                            updateSelectedArticle((article) => ({
                              ...article,
                              articleType: event.target.value as JournalArticle["articleType"],
                            }))
                          }
                        >
                          {JOURNAL_CONTENT_TYPES.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/35">DEK</p>
                      <Textarea
                        value={selectedArticle.deck}
                        onChange={(event) =>
                          updateSelectedArticle((article) => ({
                            ...article,
                            deck: event.target.value.toUpperCase(),
                          }))
                        }
                        className="min-h-[120px] bg-white/[0.03] uppercase tracking-[0.08em] text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/35">GİRİŞ METNİ</p>
                      <Textarea
                        value={selectedArticle.intro}
                        onChange={(event) =>
                          updateSelectedArticle((article) => ({
                            ...article,
                            intro: event.target.value.toUpperCase(),
                          }))
                        }
                        className="min-h-[160px] bg-white/[0.03] uppercase tracking-[0.08em] text-white"
                      />
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/35">DEPARTMANLAR</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {JOURNAL_DEPARTMENTS.map((item) => {
                            const active = selectedArticle.departments.includes(item.value);
                            return (
                              <button
                                key={item.value}
                                type="button"
                                onClick={() =>
                                  updateSelectedArticle((article) => ({
                                    ...article,
                                    departments: updateListValue(article.departments, item.value),
                                  }))
                                }
                                className={cn(
                                  "rounded-full border px-3 py-2 text-[0.58rem] uppercase tracking-[0.35em] transition-colors",
                                  active
                                    ? "border-white bg-white text-zinc-950"
                                    : "border-white/10 bg-white/[0.03] text-white/60 hover:border-white/20 hover:bg-white/[0.06]",
                                )}
                              >
                                {item.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/35">PROJE TİPLERİ</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {JOURNAL_PROJECT_TYPES.map((item) => {
                            const active = selectedArticle.projectTypes.includes(item.value);
                            return (
                              <button
                                key={item.value}
                                type="button"
                                onClick={() =>
                                  updateSelectedArticle((article) => ({
                                    ...article,
                                    projectTypes: updateListValue(article.projectTypes, item.value),
                                  }))
                                }
                                className={cn(
                                  "rounded-full border px-3 py-2 text-[0.58rem] uppercase tracking-[0.35em] transition-colors",
                                  active
                                    ? "border-white bg-white text-zinc-950"
                                    : "border-white/10 bg-white/[0.03] text-white/60 hover:border-white/20 hover:bg-white/[0.06]",
                                )}
                              >
                                {item.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/35">İÇERİK TİPLERİ</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {JOURNAL_CONTENT_TYPES.map((item) => {
                            const active = selectedArticle.contentTypes.includes(item.value);
                            return (
                              <button
                                key={item.value}
                                type="button"
                                onClick={() =>
                                  updateSelectedArticle((article) => ({
                                    ...article,
                                    contentTypes: updateListValue(article.contentTypes, item.value),
                                  }))
                                }
                                className={cn(
                                  "rounded-full border px-3 py-2 text-[0.58rem] uppercase tracking-[0.35em] transition-colors",
                                  active
                                    ? "border-white bg-white text-zinc-950"
                                    : "border-white/10 bg-white/[0.03] text-white/60 hover:border-white/20 hover:bg-white/[0.06]",
                                )}
                              >
                                {item.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/35">İLGİLİ PROJE SLUGLARI</p>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="border border-white/10 bg-white/[0.03] text-white hover:bg-white hover:text-zinc-950"
                          onClick={() =>
                            updateSelectedArticle((article) => ({
                              ...article,
                              relatedProjectSlugs: [...article.relatedProjectSlugs, ""],
                            }))
                          }
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          SATIR EKLE
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {selectedArticle.relatedProjectSlugs.map((slug, relatedIndex) => (
                          <div key={`${selectedArticle.slug}-related-${relatedIndex}`} className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
                            <Input
                              value={slug}
                              onChange={(event) =>
                                updateSelectedArticle((article) => ({
                                  ...article,
                                  relatedProjectSlugs: article.relatedProjectSlugs.map((item, itemIndex) =>
                                    itemIndex === relatedIndex ? event.target.value : item,
                                  ),
                                }))
                              }
                              className="bg-white/[0.03]"
                              placeholder="skyline-residence"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-11 w-11 rounded-2xl border border-white/10 bg-white/[0.03] text-white hover:bg-rose-500 hover:text-white"
                              onClick={() =>
                                updateSelectedArticle((article) => ({
                                  ...article,
                                  relatedProjectSlugs: article.relatedProjectSlugs.filter((_, itemIndex) => itemIndex !== relatedIndex),
                                }))
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/[0.04] shadow-none">
                  <CardHeader className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <CardTitle className="text-sm uppercase tracking-[0.32em] text-white/90">İçerik Bölümleri</CardTitle>
                        <CardDescription className="mt-2 text-white/55">Makalenin editoryal blokları, teknik verileri ve ilişkili projeleri.</CardDescription>
                      </div>
                      <div className="flex items-center gap-3">
                        <Select value={newSectionType} onChange={(event) => setNewSectionType(event.target.value as SectionType)}>
                          {SECTION_TYPES.map((item) => (
                            <option key={item.value} value={item.value}>
                              {item.label}
                            </option>
                          ))}
                        </Select>
                        <Button type="button" className="bg-white text-zinc-950 hover:bg-white/90" onClick={addSection}>
                          <Plus className="mr-2 h-4 w-4" />
                          BLOK EKLE
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {selectedArticle.sections.length === 0 ? (
                      <SectionDropTarget
                        index={0}
                        active={sectionDropTargetIndex === 0}
                        onDragEnter={() => setSectionDropTargetIndex(0)}
                        onDragLeave={() => setSectionDropTargetIndex(null)}
                        onDropItem={() => {
                          if (draggedSectionIndex !== null) {
                            reorderSection(draggedSectionIndex, 0);
                          }
                          setDraggedSectionIndex(null);
                          setSectionDropTargetIndex(null);
                        }}
                      />
                    ) : (
                      <>
                        {selectedArticle.sections.map((section, sectionIndex) => (
                          <div key={section.id} className="space-y-4">
                            <SectionDropTarget
                              index={sectionIndex}
                              active={sectionDropTargetIndex === sectionIndex}
                              onDragEnter={() => setSectionDropTargetIndex(sectionIndex)}
                              onDragLeave={() => setSectionDropTargetIndex(null)}
                              onDropItem={() => {
                                if (draggedSectionIndex !== null) {
                                  reorderSection(draggedSectionIndex, sectionIndex);
                                }
                                setDraggedSectionIndex(null);
                                setSectionDropTargetIndex(null);
                              }}
                            />
                            <SectionEditor
                              section={section}
                              index={sectionIndex}
                              isDragging={draggedSectionIndex === sectionIndex}
                              onChange={(nextSection) => updateSection(sectionIndex, nextSection)}
                              onMove={(direction) => moveSection(sectionIndex, direction)}
                              onDuplicate={() => duplicateSection(sectionIndex)}
                              onRemove={() => removeSection(sectionIndex)}
                              onUploadImage={uploadJournalImage}
                              onDragStart={() => setDraggedSectionIndex(sectionIndex)}
                              onDragEnd={() => {
                                setDraggedSectionIndex(null);
                                setSectionDropTargetIndex(null);
                              }}
                            />
                          </div>
                        ))}
                        <SectionDropTarget
                          index={selectedArticle.sections.length}
                          active={sectionDropTargetIndex === selectedArticle.sections.length}
                          onDragEnter={() => setSectionDropTargetIndex(selectedArticle.sections.length)}
                          onDragLeave={() => setSectionDropTargetIndex(null)}
                          onDropItem={() => {
                            if (draggedSectionIndex !== null) {
                              reorderSection(draggedSectionIndex, selectedArticle.sections.length);
                            }
                            setDraggedSectionIndex(null);
                            setSectionDropTargetIndex(null);
                          }}
                        />
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          ) : (
            <Card className="border-white/10 bg-white/[0.04] shadow-none">
              <CardContent className="flex min-h-[40vh] items-center justify-center p-10 text-center">
                <div className="max-w-2xl space-y-4">
                  <Eye className="mx-auto h-10 w-10 text-white/35" />
                  <h2 className="text-3xl font-thin uppercase tracking-[0.18em] text-white" style={{ fontFamily: "Smooch Sans, sans-serif" }}>
                    Düzenlenecek makale seçilmedi
                  </h2>
                  <p className="text-sm leading-7 text-white/60">
                    Soldaki listeden bir makale seçin ya da yeni bir makale ekleyerek Journal arşivini oluşturun.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border-white/10 bg-white/[0.04] shadow-none">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-sm uppercase tracking-[0.32em] text-white/90">Önizleme</CardTitle>
                  <CardDescription className="mt-2 text-white/55">Yayınlamadan önce editoryal hiyerarşiyi gözden geçirin.</CardDescription>
                </div>
                <Badge variant="outline" className="border-white/10 bg-white/[0.03] text-white/70">
                  {heroArticle?.title || "Öne çıkan içerik yok"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="space-y-3 rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/35">KAHRAMAN ALANI</p>
                <h3 className="max-w-3xl text-3xl font-thin uppercase tracking-[0.14em] text-white" style={{ fontFamily: "Smooch Sans, sans-serif" }}>
                  {draft.hero.title}
                </h3>
                <p className="text-[0.78rem] uppercase tracking-[0.35em] text-white/55">{draft.hero.subtitle}</p>
                <p className="max-w-3xl text-sm leading-7 text-white/65">{draft.hero.description}</p>
              </div>

              <div className="space-y-3 rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/35">YAYIN DURUMU</p>
                <div className="space-y-3 text-sm leading-7 text-white/65">
                  <p>Seçili makale: {selectedArticle?.title ?? "Yok"}</p>
                  <p>Öne çıkan slug: {draft.hero.featuredArticleSlug || "Atanmadı"}</p>
                  <p>Toplam bölüm: {draft.articles.reduce((sum, article) => sum + article.sections.length, 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
