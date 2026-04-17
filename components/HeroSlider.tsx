"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SwipeAppointmentButton from "./SwipeAppointmentButton";

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
}

export default function HeroSlider({ slides, onAppointmentClick, showScrollHint = false }: HeroSliderProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isIntroReady, setIsIntroReady] = useState(false);
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
    setIsIntroReady(true);
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

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

  const heroProgressStyle: React.CSSProperties = {
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
    background: "#cca883",
    width: "100%",
    transformOrigin: "left",
    animation: "heroLineProgress 6s linear forwards",
  };

  return (
    <section 
      className="hero-section snap-section" 
      onTouchStart={handleTouchStart} 
      onTouchEnd={handleTouchEnd}
      style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}
    >
      <div className="hero-slide active" style={{ backgroundColor: "#000", position: 'absolute', inset: 0 }}>
        <AnimatePresence mode="wait" initial={false}>
          {currentSlide?.mediaType === "video" ? (
            <motion.video
              key={currentSlide?.mediaUrl || index}
              className="hero-video"
              autoPlay
              muted
              loop
              playsInline
              initial={{ opacity: 0, scale: 1.08, x: direction >= 0 ? 40 : -40, filter: "blur(14px) brightness(0.24)" }}
              animate={{ opacity: isIntroReady ? 1 : 0, scale: 1, x: 0, filter: "blur(0px) brightness(0.4)" }}
              exit={{ opacity: 0, scale: 1.08, x: direction >= 0 ? -40 : 40, filter: "blur(16px) brightness(0.18)" }}
              transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            >
              <source src={currentSlide?.mediaUrl} />
            </motion.video>
          ) : (
            <motion.div
              key={currentSlide?.image || currentSlide?.mediaUrl || index}
              className="hero-slide-media"
              initial={{ 
                opacity: 0, 
                scale: 1.12, 
                x: direction >= 0 ? 40 : -40, 
                filter: `blur(${Math.max((currentSlide?.blur || 0), 2) + 12}px) brightness(0.24) saturate(0.8)` 
              }}
              animate={{ 
                opacity: isIntroReady ? 1 : 0, 
                scale: 1, 
                x: 0, 
                filter: `blur(${Math.max((currentSlide?.blur ?? 0), 2)}px) brightness(0.4) saturate(0.9)` 
              }}
              exit={{ 
                opacity: 0, 
                scale: 1.1, 
                x: direction >= 0 ? -40 : 40, 
                filter: `blur(${Math.max((currentSlide?.blur || 0), 2) + 14}px) brightness(0.18) saturate(0.8)` 
              }}
              transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
              style={{
                backgroundImage: `url(${currentSlide?.image || currentSlide?.mediaUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                width: '100%',
                height: '100%',
                position: 'absolute',
                inset: 0
              }}
            />
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
        padding: '0 5%'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="hero-studio-label"
            style={{
              fontFamily: "var(--font-smooch), sans-serif",
              fontWeight: 200,
              textTransform: "uppercase",
              paddingLeft: "0.6em",
              color: '#cca883',
              fontSize: "clamp(1rem, 4vw, 2.8rem)",
              letterSpacing: "0.4em"
            }}
          >
            {currentSlide?.motto}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
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
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.9, duration: 0.8 }}
        >
          <SwipeAppointmentButton onActivate={onAppointmentClick} />
        </motion.div>
      </div>

      <div className="hero-meta">
        <div className="hero-count">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <div />
          <small>{String(slides.length).padStart(2, "0")}</small>
        </div>
        <p className="vertical-text">{currentSlide?.title}</p>
      </div>

      {showScrollHint && (
        <div className="mimari-hero-scroll-hint">
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
