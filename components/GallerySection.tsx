"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import type { UseEmblaCarouselType } from "embla-carousel-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";

type HeroImage = {
  src: string;
  alt: string;
  caption?: string;
};

type HeroContent = {
  title: string;
  buttonText: string;
  buttonHref: string;
  images: HeroImage[];
};

const FALLBACK_HERO: HeroContent = {
  title: "GALERİ",
  buttonText: "TÜM GALERİYİ GÖR",
  buttonHref: "/galeri",
  images: [
    { src: "/images/projects/gallery_1.png", alt: "DEQOIN galeri görseli 1", caption: "01" },
    { src: "/images/projects/gallery_2.png", alt: "DEQOIN galeri görseli 2", caption: "02" },
    { src: "/images/slider/mimari_slide.png", alt: "DEQOIN galeri görseli 3", caption: "03" },
    { src: "/images/slider/tasarim_slide.png", alt: "DEQOIN galeri görseli 4", caption: "04" },
    { src: "/images/slider/uygulama_slide.png", alt: "DEQOIN galeri görseli 5", caption: "05" },
  ],
};

function toText(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function normalizeHeroContent(payload: any): HeroContent {
  const candidate = payload?.sliderHero ?? payload?.gallery ?? payload?.content?.gallery ?? payload?.content?.sliderHero ?? payload;

  const rawItems = Array.isArray(candidate?.images)
    ? candidate.images
    : Array.isArray(candidate?.slides)
      ? candidate.slides
      : Array.isArray(candidate?.gallery)
        ? candidate.gallery
        : [];

  const images = rawItems
    .map((item: any, index: number) => {
      if (typeof item === "string") {
        const src = item.trim();
        if (!src) return null;
        return {
          src,
          alt: `${candidate?.title ?? FALLBACK_HERO.title} görseli ${index + 1}`,
          caption: String(index + 1).padStart(2, "0"),
        };
      }

      if (item && typeof item === "object") {
        const src = String(item.src ?? item.url ?? item.image ?? "").trim();
        if (!src) return null;

        return {
          src,
          alt: toText(item.alt ?? item.imageAlt, `${candidate?.title ?? FALLBACK_HERO.title} görseli ${index + 1}`),
          caption: toText(item.caption, String(index + 1).padStart(2, "0")),
        };
      }

      return null;
    })
    .filter(Boolean) as HeroImage[];

  return {
    title: toText(candidate?.title, FALLBACK_HERO.title),
    buttonText: toText(candidate?.buttonText, FALLBACK_HERO.buttonText),
    buttonHref: toText(candidate?.buttonHref, FALLBACK_HERO.buttonHref),
    images: images.length > 0 ? images : FALLBACK_HERO.images,
  };
}

function HeroSlide({
  image,
  index,
  activeIndex,
  totalCount,
  title,
  buttonText,
  buttonHref,
  onPrev,
  onNext,
}: {
  image: HeroImage;
  index: number;
  activeIndex: number;
  totalCount: number;
  title: string;
  buttonText: string;
  buttonHref: string;
  onPrev: () => void;
  onNext: () => void;
}) {
  const isActive = index === activeIndex;

  return (
    <CarouselItem className="h-[100svh]">
      <motion.div
        initial={{ opacity: 0.92, scale: 1.02 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative h-[100svh] w-full overflow-hidden bg-black"
      >
        <img
          src={image.src}
          alt={image.alt}
          loading={index === 0 ? "eager" : "lazy"}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.18)_0%,rgba(0,0,0,0.34)_28%,rgba(0,0,0,0.68)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.06),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.02),transparent_22%)]" />

        <div className="absolute inset-0 flex flex-col justify-between px-4 py-4 sm:px-6 sm:py-6 lg:px-10 lg:py-8">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl"
          >
            <Badge variant="outline" className="border-white/10 bg-white/5 text-white/75 backdrop-blur-md">
              PORTFOLYO
            </Badge>
            <h2 className="mt-4 font-[family-name:var(--font-smooch)] text-[clamp(3rem,11vw,7rem)] font-normal leading-[0.84] tracking-[0.08em] text-white drop-shadow-[0_12px_30px_rgba(0,0,0,0.5)]">
              {title}
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: isActive ? 0.05 : 0 }}
            className="w-full"
          >
            <Card className="border-white/10 bg-black/28 backdrop-blur-xl">
              <CardContent className="flex flex-col gap-5 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
                  <div className="flex items-center gap-3">
                    <span className="font-[family-name:var(--font-smooch)] text-[0.78rem] uppercase tracking-[0.4em] text-white/60">
                      {String(activeIndex + 1).padStart(2, "0")} / {String(totalCount).padStart(2, "0")}
                    </span>
                    <Separator orientation="vertical" className="hidden h-8 bg-white/10 lg:block" />
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={onPrev}
                      className="h-11 w-11 border-white/10 bg-white/5 text-white backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-zinc-950"
                      aria-label="Önceki görsel"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={onNext}
                      className="h-11 w-11 border-white/10 bg-white/5 text-white backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-zinc-950"
                      aria-label="Sonraki görsel"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col gap-3 lg:items-end">
                  <span className="font-[family-name:var(--font-smooch)] text-[0.72rem] uppercase tracking-[0.36em] text-white/45">
                    {image.caption || `SLIDE ${String(activeIndex + 1).padStart(2, "0")}`}
                  </span>
                  <Button asChild variant="outline" className="border-white/12 bg-white text-zinc-950 hover:bg-zinc-100">
                    <Link href={buttonHref} className="font-[family-name:var(--font-smooch)] text-[0.76rem] tracking-[0.3em]">
                      {buttonText}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </CarouselItem>
  );
}

export default function GallerySection({
  className = "",
}: {
  className?: string;
}) {
  const [content, setContent] = useState<HeroContent>(FALLBACK_HERO);
  const [carouselApi, setCarouselApi] = useState<UseEmblaCarouselType[1] | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const loadHero = async () => {
      try {
        const response = await fetch("/api/gallery", { cache: "no-store" });
        if (!response.ok) return;

        const data = await response.json();
        setContent(normalizeHeroContent(data));
      } catch {
        setContent(FALLBACK_HERO);
      }
    };

    loadHero();
  }, []);

  useEffect(() => {
    if (!carouselApi) return;

    const handleSelect = () => setActiveIndex(carouselApi.selectedScrollSnap());

    handleSelect();
    carouselApi.on("select", handleSelect);
    carouselApi.on("reInit", handleSelect);

    return () => {
      carouselApi.off("select", handleSelect);
      carouselApi.off("reInit", handleSelect);
    };
  }, [carouselApi]);

  const slideCount = useMemo(() => content.images.length, [content.images.length]);

  const goPrev = () => {
    carouselApi?.scrollPrev();
  };

  const goNext = () => {
    carouselApi?.scrollNext();
  };

  return (
    <section
      id="galeri"
      aria-label="Galeri"
      className={`relative !h-[100svh] !min-h-[100svh] w-full overflow-hidden bg-black text-white ${className}`.trim()}
      style={{ fontFamily: "var(--font-smooch)" }}
    >
      <Carousel
        className="h-[100svh] w-full touch-pan-y"
        opts={{ loop: true, align: "start", dragFree: false }}
        setApi={setCarouselApi}
      >
        <CarouselContent className="h-[100svh]">
          {content.images.map((image, index) => (
            <HeroSlide
              key={`${image.src}-${index}`}
              image={image}
              index={index}
              activeIndex={activeIndex}
              totalCount={slideCount}
              title={content.title}
              buttonText={content.buttonText}
              buttonHref={content.buttonHref}
              onPrev={goPrev}
              onNext={goNext}
            />
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
