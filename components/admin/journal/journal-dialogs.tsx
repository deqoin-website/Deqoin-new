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
            <DialogTitle>hızlı notlar</DialogTitle>
            <DialogDescription>
              bu alan ana editör akışının dışında çalışır. kısa operasyon notları ve yayın yönergeleri burada tutulur.
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <div className="grid gap-3 md:grid-cols-2">
              <Card className="border-white/10 bg-white/[0.03] shadow-none">
                <CardContent className="p-4 text-sm leading-7 text-zinc-300">
                  içerik sayısı büyüdüğünde, kategori bazlı filtreyi önce kullanın, sonra makale açın.
                </CardContent>
              </Card>
              <Card className="border-white/10 bg-white/[0.03] shadow-none">
                <CardContent className="p-4 text-sm leading-7 text-zinc-300">
                  block builder içinde blokları sürükleyerek düzenleyin; teknik notları ayrı blokta tutun.
                </CardContent>
              </Card>
              <Card className="border-white/10 bg-white/[0.03] shadow-none md:col-span-2">
                <CardContent className="p-4 text-sm leading-7 text-zinc-300">
                  yayın öncesi kontrol: slug benzersiz mi, kapak görseli atanmış mı, ilişkili proje slugları doğru mu?
                </CardContent>
              </Card>
            </div>
          </DialogBody>
        </DialogContent>
      </Dialog>

      <Dialog open={previewOpen} onOpenChange={onPreviewOpenChange}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>önizleme</DialogTitle>
            <DialogDescription>
              seçili makalenin üst bilgi ve içerik bloğu önizlemesi. bu pencere editör alanının dışında açılır.
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            {article ? (
              <div className="space-y-4">
                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-[0.6rem] tracking-[0.32em] text-zinc-500">kapak</p>
                  <h3 className="mt-2 text-2xl text-white">{article.title}</h3>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-400">{article.intro}</p>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {article.sections.slice(0, 2).map((section, index) => (
                    <Card key={`${article.slug}-${index}`} className="border-white/10 bg-white/[0.03] shadow-none">
                      <CardContent className="p-4 text-sm leading-7 text-zinc-300">
                        <p className="mb-2 text-[0.6rem] tracking-[0.32em] text-zinc-500">{section.type}</p>
                        <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-zinc-300">
                          {section.type === "paragraph"
                            ? section.body
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
                <CardContent className="p-6 text-sm text-zinc-400">önizleme için bir makale seçin.</CardContent>
              </Card>
            )}
          </DialogBody>
        </DialogContent>
      </Dialog>
    </>
  );
}
