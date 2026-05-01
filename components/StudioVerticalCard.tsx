"use client";

import Link from "next/link";

import CloudinaryImage from "@/components/CloudinaryImage";

type StudioVerticalCardProps = {
  href?: string;
  image: string;
  title: string;
  sideLabel?: string;
  eyebrow?: string;
  meta?: string[];
  description?: string;
  priceLabel?: string;
  blur?: number;
  overlay?: number;
};

export default function StudioVerticalCard({
  href,
  image,
  title,
  sideLabel,
  eyebrow,
  meta,
  description,
  priceLabel,
  blur = 0,
  overlay = 30,
}: StudioVerticalCardProps) {
  const content = (
    <>
      <CloudinaryImage
        src={image}
        alt={title}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
        style={{ filter: `blur(${blur}px)` }}
      />

      <div
        className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none transition-opacity duration-500"
        style={{ opacity: overlay / 100 }}
      />

      <div className="absolute bottom-8 md:bottom-12 left-8 md:left-12 flex flex-col gap-3 md:gap-4 z-20 max-w-[calc(100%-6rem)] md:max-w-[calc(100%-9rem)] pr-4">
        {(eyebrow || priceLabel) && (
          <div className="flex flex-wrap items-center gap-2 text-[0.62rem] uppercase tracking-[0.34em] text-white/70">
            {eyebrow && <span className="rounded-full border border-white/14 bg-white/5 px-3 py-1">{eyebrow}</span>}
            {priceLabel && <span className="rounded-full border border-[#a68966]/30 bg-[#a68966]/10 px-3 py-1 text-[#f0d9bf]">{priceLabel}</span>}
          </div>
        )}
        <h3
          className="text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl font-thin text-white uppercase tracking-widest leading-tight drop-shadow-lg"
          style={{ fontFamily: "Smooch Sans, sans-serif", fontWeight: 100 }}
        >
          {title}
        </h3>

        {description && (
          <p className="max-w-xl text-sm leading-7 text-white/75 md:text-base">
            {description}
          </p>
        )}

        {meta && meta.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {meta.map((item) => (
              <span key={item} className="rounded-full border border-white/12 bg-black/20 px-3 py-1 text-[0.62rem] uppercase tracking-[0.28em] text-white/72">
                {item}
              </span>
            ))}
          </div>
        )}

        <div className="text-xs md:text-sm tracking-[0.3em] uppercase font-light text-white/70 mt-2">
          <span>DETAYLARI GÖR</span>
        </div>
      </div>

    </>
  );

  if (href) {
    return (
      <Link href={href} className="relative w-full h-[72vh] md:h-[88vh] group overflow-hidden">
        {content}
      </Link>
    );
  }

  return <div className="relative w-full h-[72vh] md:h-[88vh] group overflow-hidden">{content}</div>;
}
