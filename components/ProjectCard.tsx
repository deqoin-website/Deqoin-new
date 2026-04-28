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

      <div className="absolute bottom-0 left-0 p-6 md:p-10 2xl:p-16 flex flex-col gap-3 md:gap-4 2xl:gap-6 z-20 text-left">
        <p className="text-xs md:text-sm 2xl:text-base tracking-[0.4em] uppercase font-light text-white/70">
          {category}
        </p>
        <h3
          className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[10rem] font-thin uppercase tracking-widest leading-none text-white drop-shadow-lg"
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
