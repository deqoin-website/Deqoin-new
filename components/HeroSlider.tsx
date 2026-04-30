"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SwipeAppointmentButton from "./SwipeAppointmentButton";
import CloudinaryImage from "@/components/CloudinaryImage";

export interface HeroSlide {
  title: string;
  motto?: string;
  image?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  blur?: number;
  overlay?: number;
}

interface HeroSliderProps {
  slides: HeroSlide[];
  onAppointmentClick: () => void;
  showScrollHint?: boolean;
  autoplayDelay?: number;
  slideTransitionDuration?: number;
}

export default function HeroSlider({
  slides,
  onAppointmentClick,
  showScrollHint = false,
  autoplayDelay = 6000,
  slideTransitionDuration = 0.3,
}: HeroSliderProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isCurrentSlideReady, setIsCurrentSlideReady] = useState(false);
  const touchX = useRef<number | null>(null);
  const touchY = useRef<number | null>(null);
  const flipAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    flipAudioRef.current = new Audio("/sounds/page-flip.mp3");
    flipAudioRef.current.volume = 0.25;
    flipAudioRef.current.load();
  }, []);

  const playFlipSound = () => {
    if (!flipAudioRef.current) return;
    const sound = flipAudioRef.current.cloneNode() as HTMLAudioElement;
    sound.volume = 0.25;
    sound.play().catch(() => {});
  };

  useEffect(() => {
    if (slides.length === 0) return;

    setIsCurrentSlideReady(false);

    const activeSlide = slides[index];
    const activeSrc = activeSlide?.mediaUrl || activeSlide?.image;
    if (activeSrc && activeSlide?.mediaType !== "video") {
      const activeImage = new Image();
      activeImage.decoding = "async";
      activeImage.fetchPriority = "high";
      activeImage.src = activeSrc;
      activeImage.onload = () => setIsCurrentSlideReady(true);
      activeImage.onerror = () => setIsCurrentSlideReady(true);
      if (typeof activeImage.decode === "function") {
        activeImage.decode().then(() => setIsCurrentSlideReady(true)).catch(() => {});
      }
    } else {
      setIsCurrentSlideReady(true);
    }

    const preloadIndexes = [index, index + 1, index + 2, index - 1];
    preloadIndexes.forEach((slideIndex) => {
      const safeIndex = (slideIndex + slides.length) % slides.length;
      const slide = slides[safeIndex];
      const src = slide?.mediaUrl || slide?.image;
      if (!src || slide?.mediaType === "video") return;
      const img = new Image();
      img.decoding = "async";
      img.loading = "eager";
      img.fetchPriority = "high";
      img.src = src;
      if (typeof img.decode === "function") {
        img.decode().catch(() => {});
      }
    });
  }, [index, slides]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % slides.length);
    }, autoplayDelay);
    return () => clearInterval(timer);
  }, [slides.length, autoplayDelay]);

  const navigate = (newDirection: number) => {
    playFlipSound();
    setDirection(newDirection);
    setIndex((prev) => (prev + newDirection + slides.length) % slides.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
    touchY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null || touchY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchX.current;
    const deltaY = e.changedTouches[0].clientY - touchY.current;
    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
      navigate(deltaX < 0 ? 1 : -1);
    }
  };

  const currentSlide = slides[index];
  const currentSlideSrc = currentSlide?.image || currentSlide?.mediaUrl || "";
  const effectiveSlideTransitionDuration = Math.min(slideTransitionDuration, 0.3);
  const shouldAnimateHeroEntrance = !(index === 0 && direction === 0);

  const heroProgressStyle: React.CSSProperties = {
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
    background: "#cca883",
    width: "100%",
    transformOrigin: "left",
    animation: `heroLineProgress ${autoplayDelay}ms linear forwards`,
  };

  return (
    <section 
      className="hero-section snap-section" 
      onTouchStart={handleTouchStart} 
      onTouchEnd={handleTouchEnd}
      style={{ height: '100vh', minHeight: '100vh', position: 'relative', overflow: 'hidden', boxSizing: 'border-box' }}
    >
      <div className="hero-slide active" style={{ backgroundColor: "#000", position: 'absolute', inset: 0 }}>
        <AnimatePresence mode="sync" initial={false}>
          {currentSlide?.mediaType === "video" ? (
            <motion.video
              key={currentSlide?.mediaUrl || index}
              className="hero-video"
              autoPlay
              muted
              loop
              playsInline
              initial={shouldAnimateHeroEntrance ? { opacity: 0, scale: 1.08, x: direction >= 0 ? 40 : -40, filter: "blur(14px) brightness(0.24)" } : false}
              animate={{ opacity: 1, scale: 1, x: 0, filter: "blur(0px) brightness(0.4)" }}
              exit={{ opacity: 0, scale: 1.08, x: direction >= 0 ? -40 : 40, filter: "blur(16px) brightness(0.18)" }}
              transition={{ duration: effectiveSlideTransitionDuration, ease: [0.77, 0, 0.175, 1] }}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            >
              <source src={currentSlide?.mediaUrl} />
            </motion.video>
          ) : (
            <motion.div
              key={currentSlide?.image || currentSlide?.mediaUrl || index}
              className="hero-slide-media"
              initial={shouldAnimateHeroEntrance ? {
                opacity: 0,
                scale: 1.12,
                x: direction >= 0 ? 40 : -40,
                filter: `blur(${Math.max((currentSlide?.blur || 0), 1) + 6}px) brightness(0.28) saturate(0.9)`
              } : false}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                x: 0, 
                filter: `blur(${Math.max((currentSlide?.blur ?? 0), 0)}px) brightness(0.46) saturate(0.95)` 
              }}
              exit={{ 
                opacity: 0, 
                scale: 1.1, 
                x: direction >= 0 ? -40 : 40, 
                filter: `blur(${Math.max((currentSlide?.blur || 0), 1) + 8}px) brightness(0.2) saturate(0.85)` 
              }}
              transition={{ duration: effectiveSlideTransitionDuration, ease: [0.77, 0, 0.175, 1] }}
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                inset: 0
              }}
            >
              {currentSlideSrc ? (
                <CloudinaryImage
                  src={currentSlideSrc}
                  alt={currentSlide?.title || "Hero visual"}
                  priority
                  loading="eager"
                  sizes="100vw"
                  className="hero-slide-media"
                  style={{
                    objectFit: "cover",
                    objectPosition: "center",
                    width: "100%",
                    height: "100%",
                  }}
                />
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
        <div className="hero-overlay" style={{ 
          position: 'absolute', 
          inset: 0, 
          background: `rgba(0,0,0,${Math.max((currentSlide?.overlay ?? 30), 42) / 100})` 
        }} />
      </div>

      <div className="hero-content" style={{ 
        position: 'relative', 
        zIndex: 10,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        gap: '3.5rem',
        padding: '0 5%',
        opacity: isCurrentSlideReady ? 1 : 0,
        transition: 'opacity 180ms ease'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
          <motion.span
            initial={shouldAnimateHeroEntrance ? { opacity: 0, y: 20 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: shouldAnimateHeroEntrance ? 0.05 : 0, duration: 0.18 }}
            className="hero-studio-label"
            style={{
              fontFamily: "var(--font-smooch), sans-serif",
              fontWeight: 200,
              textTransform: "uppercase",
              paddingLeft: "0.6em",
              color: '#cca883',
              fontSize: "clamp(1rem, 6vw, 3.8rem)",
              letterSpacing: "0.4em"
            }}
          >
            {currentSlide?.motto}
          </motion.span>
          <motion.h1
            initial={shouldAnimateHeroEntrance ? { opacity: 0, y: 30 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: shouldAnimateHeroEntrance ? 0.08 : 0, duration: 0.2 }}
            style={{ 
              fontFamily: "var(--font-smooch), sans-serif", 
              fontSize: "clamp(3.5rem, 15vw, 11.5rem)", 
              fontWeight: 100, 
              color: "#ffffff", 
              letterSpacing: "0.15em", 
              textTransform: "uppercase", 
              margin: 0, 
              lineHeight: "0.85",
              textShadow: "0 20px 60px rgba(0,0,0,0.95)",
              paddingLeft: "0.25em"
            }}
          >
            {currentSlide?.title}
          </motion.h1>
        </div>
        
        <motion.div
           initial={shouldAnimateHeroEntrance ? { opacity: 0, scale: 0.9 } : false}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: shouldAnimateHeroEntrance ? 0.12 : 0, duration: 0.18 }}
        >
          <SwipeAppointmentButton onActivate={onAppointmentClick} />
        </motion.div>
      </div>

      <div className="hero-meta" style={{ opacity: isCurrentSlideReady ? 1 : 0, transition: 'opacity 180ms ease' }}>
        <div className="hero-count">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <div />
          <small>{String(slides.length).padStart(2, "0")}</small>
        </div>
        <p className="vertical-text">{currentSlide?.title}</p>
      </div>

      {showScrollHint && (
        <div className="mimari-hero-scroll-hint" style={{ opacity: isCurrentSlideReady ? 1 : 0, transition: 'opacity 180ms ease' }}>
          <span className="vertical-text">Detayları Gör</span>
          <div className="scroll-line" />
        </div>
      )}

      <div className="hero-progress">
        <div key={index} style={heroProgressStyle} />
      </div>

      <style jsx>{`
        @keyframes heroLineProgress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>
    </section>
  );
}
