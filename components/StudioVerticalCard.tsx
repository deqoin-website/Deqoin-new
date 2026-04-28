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

      <div className="absolute bottom-8 md:bottom-12 left-6 md:left-10 flex flex-col gap-3 md:gap-4 z-20 max-w-[calc(100%-5rem)] md:max-w-[calc(100%-7rem)] pr-4">
        <h3
          className="text-[calc(3rem-1px)] md:text-[calc(4rem-1px)] lg:text-[calc(5rem-1px)] xl:text-[calc(6rem-1px)] 2xl:text-[calc(6rem-1px)] font-thin text-white uppercase tracking-widest leading-none drop-shadow-lg"
          style={{ fontFamily: "Smooch Sans, sans-serif", fontWeight: 100 }}
        >
          {title}
        </h3>

        <div className="text-xs md:text-sm tracking-[0.3em] uppercase font-light text-white/70 mt-2">
          <span>DETAYLARI GÖR</span>
        </div>
      </div>

      <p
        className="absolute top-8 md:top-12 right-4 md:right-6 text-[11px] md:text-sm 2xl:text-base tracking-[0.85em] leading-none text-white font-light uppercase [writing-mode:vertical-rl] rotate-180 whitespace-nowrap z-30"
        style={{ fontFamily: "Smooch Sans, sans-serif" }}
      >
        {sideLabel}
      </p>

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
