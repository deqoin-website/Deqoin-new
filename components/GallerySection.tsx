"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import type { UseEmblaCarouselType } from "embla-carousel-react";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

type GalleryImage = {
  src: string;
  alt: string;
  caption?: string;
};

type GalleryContent = {
  title: string;
  buttonText: string;
  buttonHref: string;
  images: GalleryImage[];
};

const FALLBACK_GALLERY: GalleryContent = {
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

function normalizeGalleryContent(payload: any): GalleryContent {
  const candidate = payload?.gallery ?? payload?.content?.gallery ?? payload;

  if (!candidate || typeof candidate !== "object") {
    return FALLBACK_GALLERY;
  }

  const imagesRaw = Array.isArray(candidate.images) ? candidate.images : [];
  const images = imagesRaw
    .map((item: any, index: number) => {
      if (typeof item === "string") {
        return {
          src: item,
          alt: `${candidate.title ?? "GALERİ"} görseli ${index + 1}`,
          caption: String(index + 1).padStart(2, "0"),
        };
      }

      if (item && typeof item === "object") {
        const src = item.src ?? item.url ?? item.image ?? "";
        if (!src) return null;
        return {
          src,
          alt: item.alt ?? item.imageAlt ?? `${candidate.title ?? "GALERİ"} görseli ${index + 1}`,
          caption: item.caption ?? String(index + 1).padStart(2, "0"),
        };
      }

      return null;
    })
    .filter(Boolean) as GalleryImage[];

  return {
    title: candidate.title ?? FALLBACK_GALLERY.title,
    buttonText: candidate.buttonText ?? FALLBACK_GALLERY.buttonText,
    buttonHref: candidate.buttonHref ?? FALLBACK_GALLERY.buttonHref,
    images: images.length > 0 ? images : FALLBACK_GALLERY.images,
  };
}

function rotateImages(images: GalleryImage[], offset: number) {
  if (images.length === 0) return [];
  const normalizedOffset = ((offset % images.length) + images.length) % images.length;
  return [...images.slice(normalizedOffset), ...images.slice(0, normalizedOffset)];
}

function GalleryVisual({
  image,
  index,
  compact = false,
}: {
  image: GalleryImage;
  index: number;
  compact?: boolean;
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-[0_24px_60px_rgba(0,0,0,0.35)]"
    >
      <div className={`relative ${compact ? "h-full min-h-[15rem]" : "h-full min-h-[22rem]"}`}>
        <img
          src={image.src}
          alt={image.alt}
          loading={index === 0 ? "eager" : "lazy"}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05),rgba(0,0,0,0.45)_68%,rgba(0,0,0,0.65))]" />

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 md:p-5">
          <div className="max-w-[70%]">
            <p className="font-[family-name:var(--font-smooch)] text-[0.7rem] uppercase tracking-[0.42em] text-white/60">
              GALERİ {String(index + 1).padStart(2, "0")}
            </p>
            {image.caption ? (
              <h3 className="mt-2 font-[family-name:var(--font-smooch)] text-[1.25rem] font-normal leading-[0.96] tracking-[0.08em] text-white md:text-[1.5rem]">
                {image.caption}
              </h3>
            ) : null}
          </div>

          <ArrowUpRight className="h-5 w-5 text-white/80 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </motion.article>
  );
}

function MobileGalleryCarousel({
  images,
  title,
  buttonText,
  buttonHref,
  activeIndex,
  setActiveIndex,
  setApi,
  onPrev,
  onNext,
}: {
  images: GalleryImage[];
  title: string;
  buttonText: string;
  buttonHref: string;
  activeIndex: number;
  setActiveIndex: (value: number) => void;
  setApi: (api: UseEmblaCarouselType[1] | null) => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="relative h-[100svh] lg:hidden">
      <Carousel
        className="h-full"
        opts={{ loop: true, align: "start" }}
        setApi={(api) => setApi(api)}
      >
        <CarouselContent className="h-full">
          {images.map((image, index) => (
            <CarouselItem key={`${image.src}-${index}`} className="h-[100svh]">
              <motion.div
                initial={{ opacity: 0.9, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative h-full w-full overflow-hidden"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  loading={index === 0 ? "eager" : "lazy"}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.1),rgba(0,0,0,0.28)_35%,rgba(0,0,0,0.72))]" />

                <div className="absolute inset-0 flex flex-col justify-between px-4 py-4 md:px-6 md:py-6">
                  <div className="max-w-[18rem] pt-2">
                    <p className="font-[family-name:var(--font-smooch)] text-[0.72rem] uppercase tracking-[0.5em] text-white/70">
                      {title}
                    </p>
                    <h2 className="mt-3 font-[family-name:var(--font-smooch)] text-[clamp(2.5rem,12vw,4.5rem)] font-normal leading-[0.9] tracking-[0.1em] text-white">
                      {title}
                    </h2>
                  </div>

                  <div className="flex items-end justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={onPrev}
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/35 text-white backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-zinc-950"
                        aria-label="Önceki görsel"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={onNext}
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/35 text-white backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-zinc-950"
                        aria-label="Sonraki görsel"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>

                    <span className="rounded-full border border-white/15 bg-black/35 px-3 py-2 font-[family-name:var(--font-smooch)] text-[0.7rem] uppercase tracking-[0.35em] text-white/70 backdrop-blur-md">
                      {String(activeIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="flex items-end justify-between gap-3">
                    <Button
                      asChild
                      variant="outline"
                      className="border-white/20 bg-white text-zinc-950 hover:bg-zinc-100"
                    >
                      <Link href={buttonHref} className="font-[family-name:var(--font-smooch)] text-[0.75rem] tracking-[0.28em]">
                        {buttonText}
                      </Link>
                    </Button>
                    <span className="font-[family-name:var(--font-smooch)] text-[0.72rem] uppercase tracking-[0.34em] text-white/55">
                      Swipe
                    </span>
                  </div>
                </div>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}

export default function GallerySection({
  className = "",
}: {
  className?: string;
}) {
  const [content, setContent] = useState<GalleryContent>(FALLBACK_GALLERY);
  const [carouselApi, setCarouselApi] = useState<UseEmblaCarouselType[1] | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [desktopOffset, setDesktopOffset] = useState(0);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const response = await fetch("/api/gallery", { cache: "no-store" });
        if (!response.ok) return;

        const data = await response.json();
        setContent(normalizeGalleryContent(data));
      } catch {
        setContent(FALLBACK_GALLERY);
      }
    };

    loadGallery();
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

  const desktopImages = useMemo(
    () => rotateImages(content.images, desktopOffset).slice(0, 5),
    [content.images, desktopOffset],
  );

  const goPrev = () => {
    carouselApi?.scrollPrev();
    setDesktopOffset((current) => current - 1);
  };

  const goNext = () => {
    carouselApi?.scrollNext();
    setDesktopOffset((current) => current + 1);
  };

  return (
    <section
      id="galeri"
      aria-label="Galeri"
      className={`relative flex min-h-[100svh] w-full items-center overflow-hidden bg-zinc-950 text-white ${className}`.trim()}
      style={{ fontFamily: "var(--font-smooch)" }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_20%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.04),transparent_20%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
      </div>

      <div className="relative mx-auto flex h-full w-full max-w-[94rem] flex-col px-4 py-0 md:px-6 md:py-0 lg:px-8 lg:py-8">
        <div className="hidden items-end justify-between gap-6 lg:flex">
          <div className="max-w-3xl">
            <p className="font-[family-name:var(--font-smooch)] text-[0.7rem] uppercase tracking-[0.5em] text-white/55">
              PORTFOLYO
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-smooch)] text-[clamp(2.6rem,4.8vw,5rem)] font-normal leading-[0.92] tracking-[0.1em] text-white">
              {content.title}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 font-[family-name:var(--font-smooch)] text-[0.7rem] uppercase tracking-[0.35em] text-white/60 backdrop-blur-md">
              {String((desktopOffset % content.images.length) + 1).padStart(2, "0")} / {String(content.images.length).padStart(2, "0")}
            </span>

            <button
              type="button"
              onClick={goPrev}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-zinc-950"
              aria-label="Önceki görsel"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-zinc-950"
              aria-label="Sonraki görsel"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            <Button asChild variant="outline" className="border-white/10 bg-white text-zinc-950 hover:bg-zinc-100">
              <Link href={content.buttonHref} className="font-[family-name:var(--font-smooch)] text-[0.72rem] tracking-[0.3em]">
                {content.buttonText}
              </Link>
            </Button>
          </div>
        </div>

        <MobileGalleryCarousel
          images={content.images}
          title={content.title}
          buttonText={content.buttonText}
          buttonHref={content.buttonHref}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          setApi={setCarouselApi}
          onPrev={goPrev}
          onNext={goNext}
        />

        <div className="hidden lg:flex flex-1 gap-4 pt-8">
          <div className="flex-[1.2]">
            <GalleryVisual image={desktopImages[0] ?? content.images[0]} index={desktopOffset % content.images.length} />
          </div>

          <div className="flex-1 grid grid-rows-2 gap-4">
            <div className="grid grid-cols-2 gap-4">
              <GalleryVisual image={desktopImages[1] ?? content.images[1]} index={desktopOffset + 1} compact />
              <GalleryVisual image={desktopImages[2] ?? content.images[2]} index={desktopOffset + 2} compact />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <GalleryVisual image={desktopImages[3] ?? content.images[3]} index={desktopOffset + 3} compact />
              <GalleryVisual image={desktopImages[4] ?? content.images[4]} index={desktopOffset + 4} compact />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
