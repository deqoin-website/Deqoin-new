"use client";

import Link from "next/link";

import type { JournalArticle } from "@/data/journal";
import { cn } from "@/lib/utils";

type JournalCardProps = {
  article: JournalArticle;
  className?: string;
  onClick?: () => void;
  href?: string;
  loading?: "eager" | "lazy";
};

function JournalCardContent({
  article,
  loading,
}: Pick<JournalCardProps, "article" | "loading">) {
  return (
    <article className="flex w-full cursor-pointer flex-col gap-6 group md:gap-8">
      <div className="relative w-full overflow-hidden rounded-none bg-zinc-900 aspect-[4/3] md:aspect-[16/10]">
        <img
          src={article.coverImage}
          alt={article.title}
          loading={loading}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <div className="absolute right-0 top-0 flex items-center gap-2 px-4 py-3 text-[10px] uppercase tracking-[0.4em] text-white/55">
          <span>{article.departments[0] ?? article.articleType}</span>
          <span className="h-1 w-1 rounded-full bg-white/20" />
          <span>{article.publishedAt}</span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4 text-[10px] md:text-xs tracking-[0.3em] uppercase font-light text-zinc-500">
          <span>{article.projectTypes[0] ?? article.articleType}</span>
          <span className="h-1 w-1 rounded-full bg-zinc-700" />
          <span>{article.readTime}</span>
        </div>

        <h3
          className="font-[family-name:var(--font-smooch)] text-3xl font-thin uppercase tracking-widest leading-snug text-white transition-colors group-hover:text-zinc-300 md:text-4xl lg:text-5xl"
          style={{ fontWeight: 100 }}
        >
          {article.title}
        </h3>

        <p
          className="max-w-[90%] text-sm font-light leading-relaxed tracking-wide text-zinc-400 line-clamp-2 md:text-base md:line-clamp-3"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {article.deck}
        </p>

        <div className="mt-2 flex items-center gap-2 text-[10px] md:text-xs tracking-[0.4em] uppercase font-light text-white/60 transition-colors group-hover:text-white">
          <span>DETAYLARI GÖR</span>
          <span className="transform transition-transform group-hover:translate-x-1">→</span>
        </div>
      </div>
    </article>
  );
}

export default function JournalCard({
  article,
  className,
  onClick,
  href,
  loading = "lazy",
}: JournalCardProps) {
  const cardClassName = cn("block w-full", className);

  if (href) {
    return (
      <Link href={href} className={cardClassName}>
        <JournalCardContent article={article} loading={loading} />
      </Link>
    );
  }

  return (
    <button type="button" className={cn(cardClassName, "text-left")} onClick={onClick}>
      <JournalCardContent article={article} loading={loading} />
    </button>
  );
}
