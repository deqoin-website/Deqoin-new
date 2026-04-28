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

export default function JournalCard({
  article,
  className,
  onClick,
  href,
  loading = "lazy",
}: JournalCardProps) {
  const cardClassName = cn(
    "group relative block h-[60vh] w-full overflow-hidden rounded-none border border-white/10 bg-black text-white",
    className,
  );

  const content = (
    <>
      <img
        src={article.coverImage}
        alt={article.title}
        loading={loading}
        className="h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.24)_35%,rgba(0,0,0,0.92)_100%)] transition-colors duration-500 group-hover:bg-[linear-gradient(180deg,rgba(0,0,0,0.15)_0%,rgba(0,0,0,0.4)_35%,rgba(0,0,0,0.96)_100%)]" />
      <div className="absolute left-0 top-0 h-full w-16 bg-[rgba(255,255,255,0.06)] backdrop-blur-[2px]" />

      <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 flex flex-col z-20 max-w-[calc(100%-5rem)] md:max-w-[calc(100%-6rem)]">
        <div className="max-w-[90%]">
          <p className="mb-2 text-[0.58rem] uppercase tracking-[0.45em] text-white/45">
            JOURNAL / {article.projectTypes.join(" / ")}
          </p>
          <h3
            className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-[family-name:var(--font-smooch)] font-thin text-white uppercase tracking-widest leading-snug md:leading-tight drop-shadow-lg mb-3"
            style={{ fontWeight: 100 }}
          >
            {article.title}
          </h3>
          <p className="text-[10px] md:text-xs lg:text-sm tracking-[0.2em] text-zinc-300 font-light uppercase line-clamp-2 lg:line-clamp-3 max-w-[90%]">
            {article.deck}
          </p>
        </div>
      </div>

      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5 md:p-7">
        <p className="text-[0.55rem] uppercase tracking-[0.45em] text-white/35">
          {article.departments.join(" / ")}
        </p>
        <p className="text-[0.55rem] uppercase tracking-[0.45em] text-white/35">
          {article.publishedAt}
        </p>
      </div>

      <div className="absolute right-0 top-0 hidden h-full items-center md:flex">
        <div className="bg-white/[0.08] px-2 py-4 backdrop-blur-[1px]">
          <span className="[writing-mode:vertical-rl] rotate-180 text-[0.58rem] uppercase tracking-[0.5em] text-white/58">
            {article.articleType} / {article.readTime}
          </span>
        </div>
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cardClassName}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={cardClassName} onClick={onClick}>
      {content}
    </button>
  );
}
