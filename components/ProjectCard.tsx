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

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10 pointer-events-none" />

      <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 flex flex-col gap-1 md:gap-2 z-20">
        <p className="text-[10px] md:text-xs tracking-[0.3em] text-zinc-300 uppercase font-thin">
          {category}
        </p>
        <h3
          className="text-2xl md:text-3xl font-light text-white uppercase tracking-widest drop-shadow-md leading-snug"
          style={{ fontFamily: "Smooch Sans, sans-serif", fontWeight: 100 }}
        >
          {title}
        </h3>
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
