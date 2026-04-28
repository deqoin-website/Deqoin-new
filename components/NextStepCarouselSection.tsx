"use client";

import Link from "next/link";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

type NextStepCard = {
  href: string;
  title: string;
  subtitle: string;
  image: string;
};

const CARD_MAP: Record<"mimari" | "materyal-studyo" | "uygulama", NextStepCard[]> = {
  mimari: [
    {
      href: "/materyal-studyo",
      title: "Material Studio",
      subtitle: "Ürün ve Malzeme",
      image: "https://zzawgisa3efgdxnm.public.blob.vercel-storage.com/material-studio-home.png",
    },
    {
      href: "/uygulama",
      title: "Execution Studio",
      subtitle: "Uygulama Hizmetleri",
      image: "https://zzawgisa3efgdxnm.public.blob.vercel-storage.com/execution-studio-home.png",
    },
  ],
  "materyal-studyo": [
    {
      href: "/mimari",
      title: "Design Studio",
      subtitle: "Mimari Tasarım",
      image: "https://zzawgisa3efgdxnm.public.blob.vercel-storage.com/design-studio-home.png",
    },
    {
      href: "/uygulama",
      title: "Execution Studio",
      subtitle: "Uygulama Hizmetleri",
      image: "https://zzawgisa3efgdxnm.public.blob.vercel-storage.com/execution-studio-home.png",
    },
  ],
  uygulama: [
    {
      href: "/mimari",
      title: "Design Studio",
      subtitle: "Mimari Tasarım",
      image: "https://zzawgisa3efgdxnm.public.blob.vercel-storage.com/design-studio-home.png",
    },
    {
      href: "/materyal-studyo",
      title: "Material Studio",
      subtitle: "Ürün ve Malzeme",
      image: "https://zzawgisa3efgdxnm.public.blob.vercel-storage.com/material-studio-home.png",
    },
  ],
};

export default function NextStepCarouselSection({
  currentStudio,
  title = "BİR SONRAKİ ADIM",
  subtitle = "Projeye Devam Edin",
}: {
  currentStudio: keyof typeof CARD_MAP;
  title?: string;
  subtitle?: string;
}) {
  const cards = CARD_MAP[currentStudio];

  return (
    <section className="next-step-section bg-[#080808] text-white border-t border-white/8">
      <div className="mx-auto w-full max-w-[1600px] px-6 md:px-16 py-20 md:py-28">
        <div className="mb-10 md:mb-14">
          <p
            className="text-xs md:text-sm tracking-[0.4em] text-zinc-400 uppercase text-center mt-4"
            style={{ fontFamily: "Smooch Sans, sans-serif" }}
          >
            VİZYONUNUZU TAMAMLAYIN
          </p>
          <h2
            className="text-5xl md:text-7xl lg:text-8xl font-thin text-white uppercase tracking-[0.2em] text-center leading-none"
            style={{ fontFamily: "Smooch Sans, sans-serif" }}
          >
            TASARIM YOLCULUĞU
          </h2>
        </div>

        <Carousel opts={{ align: "start" }} className="w-full">
          <CarouselContent className="ml-0 w-full">
            {cards.map((card) => (
              <CarouselItem key={card.href} className="pl-0 basis-[85%] md:basis-1/3">
                <Link href={card.href} className="block h-full">
                  <div className="relative h-[60vh] md:h-[70vh] rounded-none overflow-hidden group border-r border-white/10 bg-black">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 lg:p-10">
                      <h3
                        className="text-4xl md:text-5xl lg:text-6xl font-thin uppercase leading-none text-white"
                        style={{ fontFamily: "Smooch Sans, sans-serif", fontWeight: 100 }}
                      >
                        {card.title}
                      </h3>
                      <p
                        className="mt-3 text-xs md:text-sm tracking-[0.3em] uppercase text-zinc-300"
                        style={{ fontFamily: "Smooch Sans, sans-serif", fontWeight: 100 }}
                      >
                        {card.subtitle}
                      </p>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
