"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { DEFAULT_HOME_SERVICE_CARDS, normalizeHomeServiceCards } from "@/lib/home-services";

export default function FaaliyetAlanlarimiz() {
  const [serviceCards, setServiceCards] = useState(DEFAULT_HOME_SERVICE_CARDS);

  useEffect(() => {
    let active = true;

    const fetchServiceCards = async () => {
      try {
        const res = await fetch('/api/admin/content/home/services', { cache: 'no-store' });
        if (!res.ok) {
          throw new Error(`GET /api/admin/content/home/services failed with ${res.status}`);
        }

        const data = await res.json();
        if (!active) return;

        if (Array.isArray(data) && data.length > 0) {
          setServiceCards(normalizeHomeServiceCards(data));
        } else {
          setServiceCards(DEFAULT_HOME_SERVICE_CARDS);
        }
      } catch (error) {
        console.error('Faaliyet alanları service cards load error:', error);
        if (active) {
          setServiceCards(DEFAULT_HOME_SERVICE_CARDS);
        }
      }
    };

    void fetchServiceCards();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="w-full min-h-screen bg-zinc-950 flex flex-col relative overflow-x-hidden pt-32 pb-32">
      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-16 flex flex-col items-center justify-center gap-2 mb-12 shrink-0 z-10">
        <h1
          className="text-5xl md:text-7xl lg:text-8xl font-thin text-white uppercase tracking-[0.2em] text-center leading-none"
          style={{ fontFamily: "Smooch Sans, sans-serif" }}
        >
          DESIGN & COLLECTION
        </h1>
        <p className="text-xs md:text-sm tracking-[0.4em] text-zinc-400 uppercase text-center mt-4">
          STUDIO SELECTION
        </p>
      </div>

      <div className="w-full max-w-full px-0 mx-0 overflow-hidden relative">
        <Carousel opts={{ align: "start" }} className="w-full">
          <CarouselContent className="ml-0 w-full flex">
            {serviceCards.map((item) => (
              <CarouselItem
                key={item.studioType}
                className="pl-0 basis-[85%] md:basis-1/3 min-w-0"
              >
                <Link href={item.href} className="block">
                  <div className="relative w-full h-[65vh] md:h-[85vh] rounded-2xl md:rounded-none overflow-hidden group cursor-pointer border-r border-zinc-900/50">
                    <img
                      src={item.image}
                      className="absolute inset-0 w-full h-full object-cover object-center"
                      alt={item.title}
                      style={{ filter: `blur(${item.blur || 0}px)` }}
                    />

                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none"
                      style={{ background: `rgba(0,0,0,${(item.overlay ?? 30) / 100})` }}
                    />

                    <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 flex flex-col gap-2 z-10">
                      <h3
                        className="text-4xl md:text-5xl lg:text-6xl font-thin text-white uppercase tracking-widest leading-none"
                        style={{ fontFamily: "Smooch Sans, sans-serif" }}
                      >
                        {item.title}
                      </h3>
                      <p className="text-xs md:text-sm tracking-[0.3em] text-zinc-300 font-light uppercase mt-2">
                        {item.subTitle}
                      </p>
                      <div className="flex items-center gap-2 mt-4 text-xs tracking-[0.2em] text-white/80 uppercase font-light group-hover:text-white transition-colors">
                        <span>DETAYLARI GÖR</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      <Footer />
    </main>
  );
}
