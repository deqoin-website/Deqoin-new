"use client";

import Link from "next/link";

import CloudinaryImage from "@/components/CloudinaryImage";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";
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
    <Card className="bg-transparent border-none shadow-none rounded-none w-full group cursor-pointer flex flex-col gap-6">
      <div className="w-full overflow-hidden rounded-none">
        <AspectRatio ratio={16 / 10}>
          <CloudinaryImage
            src={article.coverImage}
            alt={article.title}
            loading={loading}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </AspectRatio>
      </div>

      <CardContent className="p-0 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Badge
            variant="outline"
            className="rounded-none border-zinc-800 text-zinc-400 font-light tracking-[0.2em] uppercase text-[10px] px-3 py-1 bg-transparent"
          >
            {article.departments[0] ?? article.articleType}
          </Badge>
          <span className="text-zinc-600">/</span>
          <span className="text-[10px] tracking-[0.2em] uppercase font-light text-zinc-500">
            {article.publishedAt} • {article.readTime} OKUMA
          </span>
        </div>

        <h3
          className="text-3xl font-thin leading-tight tracking-[0.02em] text-white transition-colors group-hover:text-zinc-300 md:text-4xl lg:text-5xl"
          style={{ fontFamily: "Smooch Sans, sans-serif", fontWeight: 100 }}
        >
          {article.title}
        </h3>

        <p className="line-clamp-2 text-sm leading-relaxed font-light text-zinc-400 md:line-clamp-3 md:text-base">
          {article.deck}
        </p>

        <p className="text-[10px] tracking-[0.22em] text-zinc-500">
          /journal/{article.slug}
        </p>
      </CardContent>
    </Card>
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
      <Link href={href} className={cardClassName} aria-label={`${article.title} makalesini aç`}>
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
