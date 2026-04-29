"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

type StudioKey = "mimari" | "materyal-studyo" | "uygulama";

type NextStepCard = {
  href: string;
  title: string;
  image: string;
};

const NEXT_STEP_BY_STUDIO: Record<StudioKey, NextStepCard> = {
  mimari: {
    href: "/materyal-studyo",
    title: "MATERIAL STUDIO",
    image: "/images/workflow/material-studio-home.png",
  },
  "materyal-studyo": {
    href: "/uygulama",
    title: "EXECUTION STUDIO",
    image: "/images/workflow/execution-studio-home.png",
  },
  uygulama: {
    href: "/mimari",
    title: "DESIGN STUDIO",
    image: "/images/workflow/design-studio-home.png",
  },
};

function resolveStudio(pathname?: string, fallback?: StudioKey): StudioKey | null {
  const normalizedPath = pathname?.toLowerCase() || "";

  if (normalizedPath.startsWith("/mimari")) return "mimari";
  if (normalizedPath.startsWith("/materyal-studyo")) return "materyal-studyo";
  if (normalizedPath.startsWith("/uygulama")) return "uygulama";

  return fallback || null;
}

export default function NextStepCarouselSection({
  currentStudio,
}: {
  currentStudio?: StudioKey;
}) {
  const pathname = usePathname();
  const studio = resolveStudio(pathname, currentStudio);

  if (!studio) return null;

  const nextStep = NEXT_STEP_BY_STUDIO[studio];

  return (
    <section className="next-step-section bg-[#080808] text-white border-t border-white/8">
      <div className="w-full flex justify-center px-4 md:px-8 mt-12 mb-24">
        <Link href={nextStep.href} className="block w-full">
          <div className="relative w-full max-w-6xl aspect-square md:aspect-[21/9] lg:h-[500px] overflow-hidden group cursor-pointer rounded-none">
            <Image
              src={nextStep.image}
              alt={nextStep.title}
              fill
              sizes="(min-width: 1024px) 1024px, 100vw"
              className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
            />

            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-700 z-10" />

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-20 p-8">
              <span
                className="text-[10px] md:text-xs tracking-[0.4em] uppercase text-zinc-400 font-light mb-4"
                style={{ fontFamily: "Smooch Sans, sans-serif" }}
              >
                SONRAKİ ADIMI KEŞFEDİN
              </span>
              <h3
                className="text-4xl md:text-6xl lg:text-7xl font-thin text-white uppercase tracking-widest leading-none drop-shadow-lg mb-6"
                style={{ fontFamily: "Smooch Sans, sans-serif", fontWeight: 100 }}
              >
                {nextStep.title}
              </h3>
              <div
                className="flex items-center gap-2 text-xs md:text-sm tracking-[0.4em] text-white/70 uppercase group-hover:text-white transition-colors"
                style={{ fontFamily: "Smooch Sans, sans-serif" }}
              >
                İLERLE <span className="group-hover:translate-x-2 transition-transform">→</span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
