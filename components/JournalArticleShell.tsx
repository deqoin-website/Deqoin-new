"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { JournalArticle, JournalSection } from "@/data/journal";
import { projectsData } from "@/data/projects";
import { cn } from "@/lib/utils";
import PageNumberNavigator, { type PageNavItem } from "./PageNumberNavigator";

type JournalArticleShellProps = {
  article: JournalArticle;
  className?: string;
  variant?: "page" | "drawer";
  onClose?: () => void;
};

function TechnicalGrid({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {items.map((item) => (
        <Card key={item.label} className="rounded-none border-white/10 bg-white/[0.04] shadow-none">
          <div className="flex h-full flex-col gap-2 p-4 md:p-5">
            <span className="text-[0.6rem] uppercase tracking-[0.5em] text-white/35">
              {item.label}
            </span>
            <p className="text-[0.85rem] uppercase tracking-[0.28em] text-white/88 md:text-[0.92rem]">
              {item.value}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}

function RelatedProjects({ items }: { items: { slug: string; title: string; label: string }[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {items.map((project) => {
        return (
          <Link
            key={project.slug}
            href={`/galeri/${project.slug}`}
            className="group flex items-center justify-between border-b border-white/10 py-4 transition-colors hover:border-white/25"
          >
            <div className="space-y-1">
              <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/34">
                {project.label}
              </p>
              <h4 className="max-w-[22rem] font-[family-name:var(--font-smooch)] text-[1.15rem] uppercase tracking-[0.18em] text-white">
                {project.title}
              </h4>
            </div>
            <ArrowUpRight className="h-4 w-4 text-white/35 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        );
      })}
    </div>
  );
}

function renderSection(section: JournalSection, index: number) {
  switch (section.type) {
    case "paragraph":
      return (
        <p
          key={`paragraph-${index}`}
          className="max-w-4xl text-[20px] leading-[1.95] tracking-[0.08em] text-white/82 uppercase"
          style={{ fontFamily: "Urbanist, sans-serif" }}
        >
          {section.body}
        </p>
      );
    case "image":
      return (
        <figure key={`image-${index}`} className="space-y-4">
          <div className="relative overflow-hidden rounded-none border border-white/10 bg-black">
            <Image
              src={section.src}
              alt={section.alt}
              fill
              className="h-full w-full object-cover"
              sizes="100vw"
            />
          </div>
          {section.gallery && section.gallery.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {section.gallery.map((image, galleryIndex) => (
                <div key={`${section.src}-gallery-${galleryIndex}`} className="space-y-2">
                  <div className="relative aspect-[4/3] overflow-hidden border border-white/10 bg-black">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                  </div>
                  {image.caption ? (
                    <p className="text-[0.58rem] uppercase tracking-[0.4em] text-white/32">
                      {image.caption}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
          {section.caption ? (
            <figcaption className="text-[0.6rem] uppercase tracking-[0.45em] text-white/35">
              {section.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    case "technical":
      return (
        <div key={`technical-${index}`} className="space-y-5">
          <p className="text-[0.62rem] uppercase tracking-[0.5em] text-white/35">
            TEKNİK VERİLER
          </p>
          <TechnicalGrid items={section.items} />
        </div>
      );
    case "related":
      return (
        <div key={`related-${index}`} className="space-y-5">
          <p className="text-[0.62rem] uppercase tracking-[0.5em] text-white/35">
            {section.title}
          </p>
          <RelatedProjects items={section.items} />
        </div>
      );
    default:
      return null;
  }
}

export default function JournalArticleShell({
  article,
  className,
  variant = "page",
  onClose,
}: JournalArticleShellProps) {
  const isDrawer = variant === "drawer";
  const pageNavItems: PageNavItem[] = [
    { id: "journal-cover", label: "01", title: "COVER" },
    ...article.sections.map((_, index) => ({
      id: `journal-section-${index + 1}`,
      label: String(index + 2).padStart(2, "0"),
      title: `SECTION ${index + 1}`,
    })),
    { id: "journal-meta", label: String(article.sections.length + 2).padStart(2, "0"), title: "META" },
  ];

  return (
    <article
      className={cn(
        "relative flex min-h-0 flex-col overflow-hidden bg-[#080808] text-white",
        isDrawer ? "h-[100svh] w-full md:h-[min(92svh,1080px)] md:w-[min(96vw,1640px)]" : "w-full",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.8)_1px,transparent_0)] [background-size:22px_22px]" />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <header className="flex flex-col gap-8 border-b border-white/10 px-5 py-5 md:px-8 md:py-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-5xl space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-[0.55rem] uppercase tracking-[0.5em] text-white/40">
              <span>{article.departments.join(" / ")}</span>
              <span>·</span>
              <span>{article.projectTypes.join(" / ")}</span>
              <span>·</span>
              <span>{article.articleType}</span>
            </div>

            <h1
              className="max-w-5xl font-[family-name:var(--font-smooch)] text-[clamp(3.25rem,7vw,7.8rem)] font-thin uppercase leading-[0.78] tracking-[0.08em]"
              style={{ fontWeight: 100 }}
            >
              {article.title}
            </h1>

            <p className="max-w-4xl text-[0.78rem] uppercase tracking-[0.35em] text-white/55 md:text-[0.85rem]">
              {article.deck}
            </p>
          </div>

          <div className="flex flex-col gap-3 lg:items-end">
            <p className="text-[0.55rem] uppercase tracking-[0.5em] text-white/35">
              {article.publishedAt}
            </p>
            <p className="text-[0.55rem] uppercase tracking-[0.5em] text-white/35">
              {article.readTime}
            </p>
            {isDrawer && onClose ? (
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-11 items-center gap-2 border border-white/10 bg-white/[0.04] px-4 text-[0.58rem] uppercase tracking-[0.45em] text-white/70 transition-colors hover:bg-white hover:text-zinc-950"
              >
                <ChevronLeft className="h-4 w-4" />
                KAPAT
              </button>
            ) : (
              <Button
                asChild
                className="h-11 rounded-none border border-white/10 bg-white/[0.04] px-4 text-[0.58rem] uppercase tracking-[0.45em] text-white transition-colors hover:bg-white hover:text-zinc-950"
              >
                <Link href="/journal">
                  <ChevronLeft className="h-4 w-4" />
                  JOURNAL
                </Link>
              </Button>
            )}
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="grid min-h-0 grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="border-b border-white/10 lg:border-b-0 lg:border-r lg:border-white/10">
              <div id="journal-cover" className="group relative aspect-[4/3] overflow-hidden bg-black lg:h-[52svh] lg:aspect-auto">
                <Image
                  src={article.coverImage}
                  alt={article.title}
                  fill
                  className="h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-[1.04]"
                  sizes="100vw"
                  priority
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.12)_0%,rgba(0,0,0,0.34)_42%,rgba(0,0,0,0.88)_100%)]" />
                <div className="absolute inset-x-0 bottom-0 p-5 md:p-8">
                  <p className="mb-2 text-[0.58rem] uppercase tracking-[0.5em] text-white/45">
                    QUIET LUXURY / EDITORIAL ARCHIVE
                  </p>
                  <p className="max-w-3xl text-[0.84rem] uppercase tracking-[0.35em] text-white/70">
                    {article.intro}
                  </p>
                </div>
              </div>

              <div className="border-t border-white/10 px-5 py-6 md:px-8 md:py-8">
                <div className="grid grid-cols-1 gap-6">
                  {article.sections.map((section, index) => (
                    <div key={`journal-section-${index + 1}`} id={`journal-section-${index + 1}`}>
                      {renderSection(section, index)}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <aside id="journal-meta" className="flex min-h-0 flex-col">
              <div className="border-b border-white/10 px-5 py-5 md:px-8 md:py-7">
                <p className="text-[0.62rem] uppercase tracking-[0.5em] text-white/35">
                  DEQOIN JOURNAL
                </p>
                <p className="mt-3 max-w-md text-[20px] leading-[1.9] tracking-[0.08em] text-white/78 uppercase"
                  style={{ fontFamily: "Urbanist, sans-serif" }}
                >
                  MAKALELER, PROJE DETAYLARINI VE STÜDYO NOTLARINI SÜZÜLÜ BİR MİMARLIK DİLİYLE KAYDA GEÇİRİR.
                </p>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 md:px-8 md:py-8">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Card className="rounded-none border-white/10 bg-white/[0.04] shadow-none">
                      <div className="p-4 md:p-5">
                        <span className="text-[0.6rem] uppercase tracking-[0.5em] text-white/35">
                          YAYIN TARİHİ
                        </span>
                        <p className="mt-2 text-[0.82rem] uppercase tracking-[0.3em] text-white/82">
                          {article.publishedAt}
                        </p>
                      </div>
                    </Card>
                    <Card className="rounded-none border-white/10 bg-white/[0.04] shadow-none">
                      <div className="p-4 md:p-5">
                        <span className="text-[0.6rem] uppercase tracking-[0.5em] text-white/35">
                          OKUMA SÜRESİ
                        </span>
                        <p className="mt-2 text-[0.82rem] uppercase tracking-[0.3em] text-white/82">
                          {article.readTime}
                        </p>
                      </div>
                    </Card>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[0.62rem] uppercase tracking-[0.5em] text-white/35">
                      İLGİLİ PROJE
                    </p>
                    {article.relatedProjectSlugs.map((slug) => {
                      const project = projectsData.find((entry) => entry.slug === slug);

                      return project ? (
                        <Link
                          key={slug}
                          href={`/galeri/${slug}`}
                          className="group flex items-center justify-between border-b border-white/10 py-4 transition-colors hover:border-white/25"
                        >
                          <div className="space-y-1">
                            <p className="text-[0.54rem] uppercase tracking-[0.45em] text-white/32">
                              {project.label}
                            </p>
                            <h3 className="font-[family-name:var(--font-smooch)] text-[1.2rem] uppercase tracking-[0.2em] text-white">
                              {project.title}
                            </h3>
                          </div>
                          <ArrowUpRight className="h-4 w-4 text-white/35 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </Link>
                      ) : null;
                    })}
                  </div>

                  <div className="space-y-3">
                    <p className="text-[0.62rem] uppercase tracking-[0.5em] text-white/35">
                      ETİKETLER
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[...article.departments, ...article.projectTypes, ...article.contentTypes].map((tag) => (
                        <span
                          key={tag}
                          className="border border-white/10 px-3 py-2 text-[0.55rem] uppercase tracking-[0.4em] text-white/55"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-6">
                    <Button
                      asChild
                      className="h-12 rounded-none border border-white/10 bg-white/[0.04] px-5 text-[0.6rem] uppercase tracking-[0.45em] text-white transition-colors hover:bg-white hover:text-zinc-950"
                    >
                      <Link href={`/journal/${article.slug}`}>TAM MAKALE SAYFASI</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          <PageNumberNavigator items={pageNavItems} className="px-5 pb-8 md:px-8" label="SAYFA" />
        </div>
      </div>
    </article>
  );
}
