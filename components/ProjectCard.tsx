"use client";

import type { KeyboardEvent } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ProjectCardProps = {
  href?: string;
  image: string;
  title: string;
  category: string;
  loading?: "eager" | "lazy";
  className?: string;
  onClick?: () => void;
  onKeyDown?: (event: KeyboardEvent<HTMLAnchorElement | HTMLDivElement>) => void;
};

export default function ProjectCard({
  href,
  image,
  title,
  category,
  loading = "lazy",
  className,
  onClick,
  onKeyDown,
}: ProjectCardProps) {
  const content = (
    <>
      <img
        src={image}
        alt={title}
        loading={loading}
        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="absolute inset-0 flex items-end p-6 md:p-8">
        <div className="flex flex-col gap-2 text-left">
          <p className="text-[10px] md:text-xs tracking-[0.3em] text-zinc-300 uppercase">
            {category}
          </p>
          <h3
            className="text-4xl md:text-5xl font-thin text-white uppercase tracking-widest leading-none"
            style={{ fontFamily: "Smooch Sans, sans-serif" }}
          >
            {title}
          </h3>
        </div>
      </div>
    </>
  );

  const cardClassName = cn(
    "group relative w-full aspect-[4/3] md:aspect-[3/4] lg:aspect-square rounded-2xl overflow-hidden cursor-pointer",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={cardClassName}>
        {content}
      </Link>
    );
  }

  return (
    <div className={cardClassName} role="button" tabIndex={0} onClick={onClick} onKeyDown={onKeyDown}>
      {content}
    </div>
  );
}
