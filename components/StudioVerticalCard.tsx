"use client";

import Link from "next/link";

type StudioVerticalCardProps = {
  href?: string;
  image: string;
  title: string;
  sideLabel: string;
  blur?: number;
  overlay?: number;
};

export default function StudioVerticalCard({
  href,
  image,
  title,
  sideLabel,
  blur = 0,
  overlay = 30,
}: StudioVerticalCardProps) {
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

      <div className="absolute bottom-8 md:bottom-12 left-8 md:left-12 flex flex-col gap-3 md:gap-4 z-20 max-w-[calc(100%-5rem)] md:max-w-[calc(100%-7rem)] pr-4">
        <h3
          className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-[6rem] font-thin text-white uppercase tracking-widest leading-none drop-shadow-lg"
          style={{ fontFamily: "Smooch Sans, sans-serif", fontWeight: 100 }}
        >
          {title}
        </h3>

        <div className="text-xs md:text-sm tracking-[0.3em] uppercase font-light text-white/70 mt-2">
          <span>DETAYLARI GÖR</span>
        </div>
      </div>

      <div className="absolute top-0 right-0 h-full w-10 md:w-12 2xl:w-16 bg-zinc-800/90 border-l border-zinc-700/30 z-30 flex flex-col items-center justify-between py-10 md:py-16">
        <button
          type="button"
          aria-label="Kapat"
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors z-40"
        >
          <span className="material-symbols-outlined text-[18px] leading-none">close</span>
        </button>

        <p
          className="text-[10px] md:text-xs 2xl:text-sm tracking-[0.5em] text-red-500 font-light uppercase [writing-mode:vertical-rl] rotate-180 whitespace-nowrap"
          style={{ fontFamily: "Smooch Sans, sans-serif" }}
        >
          {sideLabel}
        </p>
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className="relative w-full h-[65vh] md:h-[80vh] group overflow-hidden">
        {content}
      </Link>
    );
  }

  return <div className="relative w-full h-[65vh] md:h-[80vh] group overflow-hidden">{content}</div>;
}
