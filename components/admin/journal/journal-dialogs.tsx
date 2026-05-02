"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { JournalArticleDraft } from "./journal-utils";

type JournalDialogsProps = {
  notesOpen: boolean;
  onNotesOpenChange: (open: boolean) => void;
  previewOpen: boolean;
  onPreviewOpenChange: (open: boolean) => void;
  article: JournalArticleDraft | null;
};

export function JournalDialogs({
  notesOpen,
  onNotesOpenChange,
  previewOpen,
  onPreviewOpenChange,
  article,
}: JournalDialogsProps) {
  return (
    <>
      <Dialog open={notesOpen} onOpenChange={onNotesOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="uppercase">hızlı notlar</DialogTitle>
            <DialogDescription>
              BU ALAN ANA EDİTÖR AKIŞININ DIŞINDA ÇALIŞIR. KISA OPERASYON NOTLARI VE YAYIN YÖNERGELERİ BURADA TUTULUR.
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <div className="grid gap-3 md:grid-cols-2">
              <Card className="border-white/10 bg-white/[0.03] shadow-none">
                <CardContent className="p-4 text-sm leading-7 text-zinc-300">
                  İÇERİK SAYISI BÜYÜDÜĞÜNDE, KATEGORİ BAZLI FİLTREYİ ÖNCE KULLANIN, SONRA MAKALE AÇIN.
                </CardContent>
              </Card>
              <Card className="border-white/10 bg-white/[0.03] shadow-none">
                <CardContent className="p-4 text-sm leading-7 text-zinc-300">
                  BLOCK BUILDER İÇİNDE BLOKLARI SÜRÜKLEYEREK DÜZENLEYİN; TEKNİK NOTLARI AYRI BLOKTA TUTUN.
                </CardContent>
              </Card>
              <Card className="border-white/10 bg-white/[0.03] shadow-none md:col-span-2">
                <CardContent className="p-4 text-sm leading-7 text-zinc-300">
                  YAYIN ÖNCESİ KONTROL: SLUG BENZERSİZ Mİ, KAPAK GÖRSELİ ATANMIŞ MI, İLİŞKİLİ PROJE SLUGLARI DOĞRU MU?
                </CardContent>
              </Card>
            </div>
          </DialogBody>
        </DialogContent>
      </Dialog>

      <Dialog open={previewOpen} onOpenChange={onPreviewOpenChange}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="uppercase">önizleme</DialogTitle>
            <DialogDescription>
              SEÇİLİ MAKALENİN ÜST BİLGİ VE İÇERİK BLOĞU ÖNİZLEMESİ. BU PENCERE EDİTÖR ALANININ DIŞINDA AÇILIR.
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            {article ? (
              <div className="space-y-4">
                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-[0.6rem] tracking-[0.08em] uppercase text-zinc-500">kapak</p>
                  <h3 className="mt-2 text-2xl uppercase text-white">{article.title}</h3>
                  <p className="mt-3 max-w-3xl text-sm uppercase leading-7 text-zinc-400">{article.intro}</p>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {article.sections.slice(0, 2).map((section, index) => (
                    <Card key={`${article.slug}-${index}`} className="border-white/10 bg-white/[0.03] shadow-none">
                      <CardContent className="p-4 text-sm leading-7 text-zinc-300">
                        <p className="mb-2 text-[0.6rem] tracking-[0.08em] uppercase text-zinc-500">{section.type}</p>
                        <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-zinc-300">
                          {section.type === "paragraph"
                            ? section.body
                            : section.type === "heading"
                              ? `${section.level === 3 ? "h3" : "h2"}: ${section.text}`
                              : section.type === "list"
                                ? section.items.join("\n")
                            : section.type === "image"
                              ? section.caption || section.alt
                              : section.type === "technical"
                                ? section.items.map((item) => `${item.label}: ${item.value}`).join("\n")
                                : section.title}
                        </pre>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <Card className="border-white/10 bg-white/[0.03] shadow-none">
                <CardContent className="p-6 text-sm uppercase text-zinc-400">önizleme için bir makale seçin.</CardContent>
              </Card>
            )}
          </DialogBody>
        </DialogContent>
      </Dialog>
    </>
  );
}
