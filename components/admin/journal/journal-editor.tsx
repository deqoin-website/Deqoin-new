"use client";

import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toTurkishUpperCase } from "@/lib/journal-content";

import { JournalBuilderTab } from "./journal-builder-tab";
import { JournalMetaTab } from "./journal-meta-tab";
import { JournalTaxonomyTab } from "./journal-taxonomy-tab";
import type { JournalArticleDraft, JournalDraftState } from "./journal-utils";

type JournalEditorProps = {
  article: JournalArticleDraft | null;
  draft: JournalDraftState;
  activeTab: string;
  onTabChange: (value: string) => void;
  onUpdateArticle: (updater: (article: JournalArticleDraft) => JournalArticleDraft) => void;
  onUpdateDraft: (updater: (draft: JournalDraftState) => JournalDraftState) => void;
  onUploadImage: (file: File) => Promise<string>;
  onStartBlockDrag: (index: number | null) => void;
  onSetBlockDropTarget: (index: number | null) => void;
  draggedBlockIndex: number | null;
  blockDropTargetIndex: number | null;
};

export function JournalEditor({
  article,
  draft,
  activeTab,
  onTabChange,
  onUpdateArticle,
  onUpdateDraft,
  onUploadImage,
  onStartBlockDrag,
  onSetBlockDropTarget,
  draggedBlockIndex,
  blockDropTargetIndex,
}: JournalEditorProps) {
  const [tabsValue, setTabsValue] = React.useState(activeTab);

  React.useEffect(() => {
    setTabsValue(activeTab);
  }, [activeTab]);

  if (!article) {
    return (
      <Card className="border-white/10 bg-white/[0.03] shadow-none">
        <CardContent className="px-6 py-16 text-center text-zinc-400">
          BİR MAKALE SEÇİLDİĞİNDE DÜZENLEME ALANI BURADA AÇILIR.
        </CardContent>
      </Card>
    );
  }

  const handleTabChange = (value: string) => {
    setTabsValue(value);
    onTabChange(value);
  };

  const featuredArticle =
    draft.articles.find((item) => item.slug === draft.hero.featuredArticleSlug) ?? draft.articles[0] ?? null;

  return (
    <Card className="border-white/10 bg-white/[0.03] shadow-none">
      <CardHeader className="space-y-4 border-b border-white/10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium tracking-[0.08em] text-white uppercase">makale düzenleme</CardTitle>
            <CardDescription className="text-zinc-400 uppercase">meta, taksonomi ve block builder sekmeleriyle düzenleyin.</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="border-white/10 bg-white/[0.04] text-zinc-300">
              {toTurkishUpperCase(article.articleType)}
            </Badge>
            <Badge variant="outline" className="border-white/10 bg-white/[0.04] text-zinc-300">
              {toTurkishUpperCase(article.readTime)}
            </Badge>
          </div>
        </div>

        <Tabs value={tabsValue} onValueChange={handleTabChange} className="gap-0">
          <TabsList className="w-full justify-start rounded-[1.25rem] border border-white/10 bg-white/[0.02] p-1">
            <TabsTrigger value="meta" className="uppercase">meta ve detaylar</TabsTrigger>
            <TabsTrigger value="taxonomy" className="uppercase">taksonomi ve etiketler</TabsTrigger>
            <TabsTrigger value="builder" className="uppercase">içerik oluşturucu</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        <Tabs value={tabsValue} onValueChange={handleTabChange}>
          <TabsContent value="meta" className="space-y-6">
            <JournalMetaTab
              article={article}
              draft={draft}
              featuredArticle={featuredArticle}
              onUpdateArticle={onUpdateArticle}
              onUpdateDraft={onUpdateDraft}
              onUploadImage={onUploadImage}
            />
          </TabsContent>

          <TabsContent value="taxonomy" className="space-y-4">
            <JournalTaxonomyTab article={article} onUpdateArticle={onUpdateArticle} />
          </TabsContent>

          <TabsContent value="builder" className="space-y-4">
            <JournalBuilderTab
              article={article}
              onUpdateArticle={onUpdateArticle}
              onUploadImage={onUploadImage}
              draggedBlockIndex={draggedBlockIndex}
              blockDropTargetIndex={blockDropTargetIndex}
              onStartBlockDrag={onStartBlockDrag}
              onSetBlockDropTarget={onSetBlockDropTarget}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
