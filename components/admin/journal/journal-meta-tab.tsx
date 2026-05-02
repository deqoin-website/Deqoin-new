"use client";

import Image from "next/image";

import { AdminImageDropzone } from "@/components/admin/AdminImageDropzone";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toTurkishUpperCase } from "@/lib/journal-content";

import { FieldGroup } from "./field-group";
import type { JournalArticleDraft, JournalDraftState } from "./journal-utils";

type JournalMetaTabProps = {
  article: JournalArticleDraft;
  draft: JournalDraftState;
  featuredArticle: JournalArticleDraft | null;
  onUpdateArticle: (updater: (article: JournalArticleDraft) => JournalArticleDraft) => void;
  onUpdateDraft: (updater: (draft: JournalDraftState) => JournalDraftState) => void;
  onUploadImage: (file: File) => Promise<string>;
};

export function JournalMetaTab({
  article,
  draft,
  featuredArticle,
  onUpdateArticle,
  onUpdateDraft,
  onUploadImage,
}: JournalMetaTabProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-4 rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
        <div className="grid gap-4 md:grid-cols-2">
          <FieldGroup label="başlık">
            <Input value={article.title} onChange={(event) => onUpdateArticle((current) => ({ ...current, title: event.target.value }))} />
          </FieldGroup>
          <FieldGroup label="slug">
            <Input value={article.slug} onChange={(event) => onUpdateArticle((current) => ({ ...current, slug: event.target.value }))} />
          </FieldGroup>
          <FieldGroup label="yayın tarihi">
            <Input value={article.publishedAt} onChange={(event) => onUpdateArticle((current) => ({ ...current, publishedAt: event.target.value }))} placeholder="28 nisan 2026" />
          </FieldGroup>
          <FieldGroup label="okuma süresi">
            <Input value={article.readTime} onChange={(event) => onUpdateArticle((current) => ({ ...current, readTime: event.target.value }))} placeholder="05 dk" />
          </FieldGroup>
        </div>

        <FieldGroup label="giriş metni">
          <Textarea
            value={article.intro}
            onChange={(event) => onUpdateArticle((current) => ({ ...current, intro: event.target.value }))}
            className="min-h-[170px] bg-white/[0.03] text-white placeholder:text-zinc-500"
          />
        </FieldGroup>
      </div>

      <div className="space-y-4">
        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
          <p className="text-[0.6rem] tracking-[0.08em] text-zinc-500 uppercase">seo bilgileri</p>
          <div className="mt-4 grid gap-4">
            <FieldGroup label="seo başlığı">
              <Input
                value={draft.seoMeta.title}
                onChange={(event) => onUpdateDraft((current) => ({ ...current, seoMeta: { ...current.seoMeta, title: event.target.value } }))}
                placeholder="deqoin journal | ..."
              />
            </FieldGroup>
            <FieldGroup label="seo açıklaması">
              <Textarea
                value={draft.seoMeta.description}
                onChange={(event) => onUpdateDraft((current) => ({ ...current, seoMeta: { ...current.seoMeta, description: event.target.value } }))}
                className="min-h-[110px] bg-white/[0.03] text-white placeholder:text-zinc-500"
              />
            </FieldGroup>
            <FieldGroup label="anahtar kelimeler">
              <Input
                value={draft.seoMeta.keywords}
                onChange={(event) => onUpdateDraft((current) => ({ ...current, seoMeta: { ...current.seoMeta, keywords: event.target.value } }))}
                placeholder="journal, mimari, uygulama"
              />
            </FieldGroup>
            <FieldGroup label="og görseli">
              <Input
                value={draft.seoMeta.ogImage}
                onChange={(event) => onUpdateDraft((current) => ({ ...current, seoMeta: { ...current.seoMeta, ogImage: event.target.value } }))}
                placeholder="/images/logo-new.jpeg"
              />
            </FieldGroup>
            <FieldGroup label="canonical yol">
              <Input
                value={draft.seoMeta.canonicalPath}
                onChange={(event) => onUpdateDraft((current) => ({ ...current, seoMeta: { ...current.seoMeta, canonicalPath: event.target.value } }))}
                placeholder="/journal"
              />
            </FieldGroup>
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/10 px-3 py-2">
              <div>
                <p className="text-xs uppercase text-zinc-300">noindex</p>
                <p className="text-[0.65rem] uppercase text-zinc-500">arama motoruna kapat</p>
              </div>
              <Checkbox
                checked={draft.seoMeta.noIndex}
                onCheckedChange={(checked) =>
                  onUpdateDraft((current) => ({
                    ...current,
                    seoMeta: { ...current.seoMeta, noIndex: checked === true },
                  }))
                }
              />
            </div>
          </div>
        </div>

        <AdminImageDropzone
          accept="image/*"
          aspectClassName="aspect-[16/10]"
          buttonLabel="KAPAK EKLE"
          className="min-h-[320px] border-white/10 bg-white/[0.03]"
          description="KAPAK GÖRSELİNİ YÜKLEYİN VEYA URL GİRİN."
          emptySubtitle="JOURNAL KAPAK ALANI."
          emptyTitle="KAPAK GÖRSELİ"
          onFileSelect={async (file) => {
            const url = await onUploadImage(file);
            onUpdateArticle((current) => ({ ...current, coverImage: url }));
          }}
          previewAlt={article.title}
          previewUrl={article.coverImage}
          title="KAPAK GÖRSELİ"
        />

        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
          <p className="text-[0.6rem] tracking-[0.08em] text-zinc-500 uppercase">bağlantılı makaleler</p>
          <div className="mt-3 grid gap-2">
            {draft.articles.slice(0, 4).map((item) => (
              <div key={item.slug} className="flex items-center justify-between rounded-xl border border-white/10 bg-black/10 px-3 py-2 text-sm text-zinc-300">
                <span className="truncate uppercase">{toTurkishUpperCase(item.title)}</span>
                <span className="text-xs text-zinc-500 uppercase">{item.slug}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-black/20 shadow-none">
          <div className="relative aspect-[16/10] border-b border-white/10 bg-white/[0.02]">
            {featuredArticle?.coverImage ? (
              <Image src={featuredArticle.coverImage} alt={featuredArticle.title} fill className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-zinc-500 uppercase">önizleme yok</div>
            )}
          </div>
          <div className="space-y-3 p-4">
            <p className="text-[0.6rem] tracking-[0.08em] text-zinc-500 uppercase">vitrin önizlemesi</p>
            <p className="text-sm text-zinc-300 uppercase">{featuredArticle ? toTurkishUpperCase(featuredArticle.title) : "özel içerik seçilmedi"}</p>
            <p className="text-sm leading-7 text-zinc-400">{draft.hero.description}</p>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] shadow-none">
          <div className="space-y-3 p-4 text-sm leading-7 text-zinc-400">
            <p className="uppercase">sayfa kahramanı paneli artık sidebar üstünde sabit bir link ile açılır.</p>
            <p className="uppercase">aktif kategori görünümünden bağımsızdır ve ayrı bir vitrin yüzeyi olarak çalışır.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
