"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Lenis from "lenis";
import Autoplay from "embla-carousel-autoplay";

import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

export interface HeroSlide {
  title: string;
  motto?: string;
  image?: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
  blur?: number;
  overlay?: number;
}

interface HeroSliderProps {
  slides: HeroSlide[];
  onAppointmentClick: () => void;
  showScrollHint?: boolean;
}

export default function HeroSlider({ slides, onAppointmentClick }: HeroSliderProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = window.requestAnimationFrame(raf);
    };

    frame = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    setIsReady(true);
  }, []);

  const autoplay = useMemo(
    () =>
      Autoplay({
        delay: 6000,
        stopOnInteraction: false,
        stopOnMouseEnter: false,
      }),
    [],
  );

  const currentSlides = slides.length > 0 ? slides : [];

  return (
    <section
      className="hero-section snap-section"
      style={{ height: "100vh", minHeight: "100vh", position: "relative", overflow: "hidden", boxSizing: "border-box" }}
    >
      <Carousel className="h-[100vh] w-full" opts={{ loop: true, align: "start" }} plugins={[autoplay]}>
        <CarouselContent className="h-[100vh]">
          {currentSlides.map((slide, index) => {
            const src = slide.mediaUrl || slide.image || "";
            const isVideo = slide.mediaType === "video";
            return (
              <CarouselItem key={`${src}-${index}`} className="h-[100vh]">
                <motion.div
                  initial={{ opacity: 0.9, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="relative h-full w-full overflow-hidden bg-black"
                >
                  {isVideo ? (
                    <video
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="absolute inset-0 h-full w-full object-cover"
                    >
                      <source src={src} />
                    </video>
                  ) : (
                    <div
                      className="absolute inset-0 h-full w-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${src})` }}
                    />
                  )}

                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.16)_0%,rgba(0,0,0,0.34)_32%,rgba(0,0,0,0.7)_100%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.06),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.02),transparent_22%)]" />

                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-10 px-4 text-center sm:px-6 lg:px-10">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: isReady ? 1 : 0, y: 0 }}
                      transition={{ delay: 0.25, duration: 0.7 }}
                      className="flex flex-col items-center gap-4"
                    >
                      <span
                        className="font-[family-name:var(--font-smooch)] text-[clamp(1rem,6vw,3.8rem)] font-light uppercase tracking-[0.4em] text-[#cca883]"
                        style={{ paddingLeft: "0.6em" }}
                      >
                        {slide.motto}
                      </span>
                      <h1
                        className="font-[family-name:var(--font-smooch)] text-[clamp(3.5rem,15vw,11.5rem)] font-light uppercase leading-[0.85] tracking-[0.15em] text-white"
                        style={{ paddingLeft: "0.25em", textShadow: "0 20px 60px rgba(0,0,0,0.95)" }}
                      >
                        {slide.title}
                      </h1>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: isReady ? 1 : 0, y: 0 }}
                      transition={{ delay: 0.55, duration: 0.6 }}
                      className="max-w-3xl font-[family-name:var(--font-smooch)] text-[clamp(1rem,2.4vw,1.9rem)] font-normal tracking-[0.08em] text-white/88"
                      style={{ lineHeight: 1.1 }}
                    >
                      {slide.motto}
                    </motion.div>

                    <motion.button
                      type="button"
                      onClick={onAppointmentClick}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: isReady ? 1 : 0, scale: 1 }}
                      transition={{ delay: 0.7, duration: 0.6 }}
                      className="rounded-full border border-white/12 bg-white px-6 py-3 font-[family-name:var(--font-smooch)] text-sm tracking-[0.3em] text-black shadow-[0_16px_40px_rgba(0,0,0,0.2)] transition hover:bg-zinc-100"
                    >
                      RANDEVU AL
                    </motion.button>
                  </div>

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.12)_30%,rgba(0,0,0,0.5)_100%)]" />
                </motion.div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
