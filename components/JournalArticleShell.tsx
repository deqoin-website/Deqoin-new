"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { JournalArticle, JournalSection } from "@/data/journal";
import { toTurkishSentenceCase } from "@/lib/journal-content";
import { cn } from "@/lib/utils";
import JournalShareActions from "./JournalShareActions";

type JournalArticleShellProps = {
  article: JournalArticle;
  className?: string;
  variant?: "page" | "drawer";
  onClose?: () => void;
  shareUrl?: string;
};

function formatMetaValue(value: string) {
  return value.toLocaleUpperCase("tr-TR");
}

function ArticleImage({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption?: string;
}) {
  return (
    <figure className="space-y-3">
      <div className="relative aspect-[16/9] overflow-hidden rounded-[1.5rem] border border-white/10 bg-black shadow-[0_30px_80px_rgba(0,0,0,0.25)]">
        <Image src={src} alt={alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 960px" />
      </div>
      {caption ? <figcaption className="text-sm leading-6 text-zinc-500">{toTurkishSentenceCase(caption)}</figcaption> : null}
    </figure>
  );
}

function TechnicalBlock({ items }: { items: { label: string; value: string }[] }) {
  return (
    <Card className="rounded-[1.5rem] border-white/10 bg-white/[0.03] shadow-none">
      <CardContent className="space-y-4 p-5 md:p-6">
        <p className="text-[0.7rem] uppercase tracking-[0.3em] text-zinc-500">kısa notlar</p>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.label} className="flex flex-col gap-1 border-b border-white/10 pb-3 last:border-b-0 last:pb-0 md:flex-row md:items-start md:justify-between md:gap-8">
              <span className="text-[0.72rem] uppercase tracking-[0.18em] text-zinc-500">{item.label}</span>
              <span className="max-w-2xl text-sm leading-7 text-zinc-200 md:text-right">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function RelatedProjects({ items }: { items: { slug: string; title: string; label: string }[] }) {
  return (
    <Card className="rounded-[1.5rem] border-white/10 bg-white/[0.03] shadow-none">
      <CardContent className="space-y-4 p-5 md:p-6">
        <p className="text-[0.7rem] uppercase tracking-[0.3em] text-zinc-500">ilgili bağlantılar</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((project) => (
            <Link
              key={project.slug}
              href={`/galeri/${project.slug}`}
              className="group flex items-center justify-between rounded-[1rem] border border-white/10 bg-black/15 px-4 py-4 transition-colors hover:border-white/20 hover:bg-white/[0.05]"
            >
              <div className="space-y-1">
                <p className="text-[0.62rem] uppercase tracking-[0.28em] text-zinc-500">
                  {formatMetaValue(project.label)}
                </p>
                <h4 className="text-sm font-medium leading-6 text-white">{project.title}</h4>
              </div>
              <ArrowUpRight className="h-4 w-4 text-white/35 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function renderSection(section: JournalSection, index: number) {
  switch (section.type) {
    case "heading":
      return section.level === 3 ? (
        <h3 key={`heading-${index}`} className="pt-2 text-2xl font-medium tracking-[0.01em] text-white md:text-[1.75rem]">
          {toTurkishSentenceCase(section.text)}
        </h3>
      ) : (
        <h2 key={`heading-${index}`} className="pt-4 text-3xl font-medium tracking-[0.01em] text-white md:text-[2.25rem]">
          {toTurkishSentenceCase(section.text)}
        </h2>
      );
    case "paragraph":
      return (
        <p key={`paragraph-${index}`} className="max-w-none text-[1.05rem] leading-8 text-zinc-300 md:text-[1.1rem]">
          {toTurkishSentenceCase(section.body)}
        </p>
      );
    case "list":
      return (
        <ul key={`list-${index}`} className="space-y-3 pl-5 text-[1.05rem] leading-8 text-zinc-300 md:text-[1.1rem]">
          {section.items.map((item, itemIndex) => (
            <li key={`${index}-${itemIndex}`} className="marker:text-zinc-500">
              {toTurkishSentenceCase(item)}
            </li>
          ))}
        </ul>
      );
    case "image":
      return <ArticleImage key={`image-${index}`} src={section.src} alt={section.alt} caption={section.caption} />;
    case "technical":
      return <TechnicalBlock key={`technical-${index}`} items={section.items} />;
    case "related":
      return <RelatedProjects key={`related-${index}`} items={section.items} />;
    default:
      return null;
  }
}

export default function JournalArticleShell({
  article,
  className,
  variant = "page",
  onClose,
  shareUrl,
}: JournalArticleShellProps) {
  const isDrawer = variant === "drawer";

  return (
    <article
      className={cn(
        "relative flex min-h-0 flex-col overflow-hidden bg-[#080808] text-white",
        isDrawer ? "h-[100svh] w-full md:h-[min(92svh,1080px)] md:w-[min(96vw,1040px)]" : "min-h-screen w-full",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_45%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_35%)]" />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-5 pb-4 pt-5 md:px-6 md:pt-6">
          {isDrawer && onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[0.65rem] uppercase tracking-[0.22em] text-white/75 transition-colors hover:bg-white hover:text-zinc-950"
            >
              <ChevronLeft className="h-4 w-4" />
              kapat
            </button>
          ) : (
            <Button asChild variant="ghost" className="h-10 rounded-full border border-white/10 bg-white/[0.04] px-4 text-[0.65rem] uppercase tracking-[0.22em] text-white/75 hover:bg-white hover:text-zinc-950">
              <Link href="/journal">
                <ChevronLeft className="h-4 w-4" />
                journal&apos;a dön
              </Link>
            </Button>
          )}

          <p className="text-[0.62rem] uppercase tracking-[0.3em] text-zinc-500">{article.publishedAt}</p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-5 pb-10 md:px-6 md:pb-14">
            <ArticleImage src={article.coverImage} alt={article.title} />

            <div className="space-y-5">
              <div className="flex flex-wrap gap-2">
                {article.departments.map((item) => (
                  <Badge key={item} variant="secondary" className="rounded-full border-white/10 bg-white/[0.04] text-[0.62rem] font-medium tracking-[0.18em] text-zinc-200">
                    {formatMetaValue(item)}
                  </Badge>
                ))}
                {article.projectTypes.map((item) => (
                  <Badge key={item} variant="secondary" className="rounded-full border-white/10 bg-white/[0.04] text-[0.62rem] font-medium tracking-[0.18em] text-zinc-200">
                    {formatMetaValue(item)}
                  </Badge>
                ))}
                <Badge variant="outline" className="rounded-full border-white/10 bg-transparent text-[0.62rem] font-medium tracking-[0.18em] text-zinc-300">
                  {formatMetaValue(article.articleType)}
                </Badge>
              </div>

              <div className="space-y-3">
                <h1 className="max-w-4xl text-[clamp(2.5rem,6vw,4.8rem)] font-light leading-[0.95] tracking-[0.01em] text-white">
                  {toTurkishSentenceCase(article.title)}
                </h1>

                <div className="flex flex-wrap items-center gap-3 text-[0.72rem] uppercase tracking-[0.2em] text-zinc-500">
                  <span>{article.publishedAt}</span>
                  <span className="hidden sm:inline">/</span>
                  <span>{article.readTime}</span>
                </div>
              </div>

              <Separator />

              <p className="max-w-3xl text-[1.05rem] leading-8 text-zinc-300 md:text-[1.15rem]">
                {toTurkishSentenceCase(article.deck)}
              </p>

              <JournalShareActions title={article.title} url={shareUrl} />
            </div>

            <div className="space-y-8">
              {article.sections.map((section, index) => (
                <section key={`journal-section-${index + 1}`} className="space-y-4">
                  {renderSection(section, index)}
                </section>
              ))}
            </div>

            <Separator />

            <div className="space-y-4 pb-2">
              <p className="text-[0.7rem] uppercase tracking-[0.28em] text-zinc-500">deqoin journal</p>
              <p className="max-w-3xl text-[1.02rem] leading-8 text-zinc-400">
                {toTurkishSentenceCase(
                  "Bu yazı hoşunuza gittiyse benzer proje ve uygulama notları için journal bölümünü takip edebilirsiniz.",
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
