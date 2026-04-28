"use client";

import Link from "next/link";

type StudioVerticalCardProps = {
  href?: string;
  image: string;
  title: string;
  sideLabel: string;
  ctaLabel?: string;
  description?: string;
  blur?: number;
  overlay?: number;
  className?: string;
};

export default function StudioVerticalCard({
  href,
  image,
  title,
  sideLabel,
  ctaLabel = "DETAYLARI GÖR",
  description,
  blur = 0,
  overlay = 30,
  className,
}: StudioVerticalCardProps) {
  const rootClassName = [
    "group relative block aspect-[4/3] w-full overflow-hidden rounded-none border-r border-zinc-900/50",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      <img
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

      <div className="absolute bottom-0 left-0 p-6 md:p-10 2xl:p-16 flex flex-col gap-3 md:gap-4 2xl:gap-6 z-20">
        <h3
          className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[10rem] font-thin uppercase tracking-widest leading-none text-white drop-shadow-lg"
          style={{ fontFamily: "Smooch Sans, sans-serif", fontWeight: 100 }}
        >
          {title}
        </h3>

        <div className="text-xs md:text-sm 2xl:text-base tracking-[0.4em] uppercase font-light text-white/70 hover:text-white transition-colors flex items-center gap-2">
          <span>{ctaLabel}</span>
          <span className="material-symbols-outlined">arrow_forward</span>
        </div>

        {description ? (
          <p className="max-w-[26ch] text-[0.72rem] md:text-sm 2xl:text-base leading-relaxed text-white/60">
            {description}
          </p>
        ) : null}
      </div>

      <span
        className="absolute bottom-6 md:bottom-10 2xl:bottom-16 right-6 md:right-10 2xl:right-16 text-xs md:text-sm 2xl:text-base tracking-[0.5em] text-zinc-400 font-thin uppercase drop-shadow-md vertical-text"
        style={{ fontFamily: "Smooch Sans, sans-serif" }}
      >
        {sideLabel}
      </span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={rootClassName}>
        {content}
      </Link>
    );
  }

  return <div className={rootClassName}>{content}</div>;
}
