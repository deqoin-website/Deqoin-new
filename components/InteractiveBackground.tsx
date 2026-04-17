"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export default function InteractiveBackground() {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const addRipple = useCallback((e: MouseEvent | TouchEvent) => {
    let x, y;
    if ("touches" in e) {
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    } else {
      x = (e as MouseEvent).clientX;
      y = (e as MouseEvent).clientY;
    }

    const newRipple: Ripple = {
      id: Date.now(),
      x,
      y,
    };

    setRipples((prev) => [...prev, newRipple]);

    // Cleanup after animation duration
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 1000);
  }, []);

  useEffect(() => {
    window.addEventListener("mousedown", addRipple);
    window.addEventListener("touchstart", addRipple, { passive: true });

    return () => {
      window.removeEventListener("mousedown", addRipple);
      window.removeEventListener("touchstart", addRipple);
    };
  }, [addRipple]);

  return (
    <div 
      className="interactive-bg-wrapper"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 9999, // On top of everything but transparent
        overflow: "hidden",
      }}
    >
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            initial={{ 
              top: ripple.y, 
              left: ripple.x, 
              width: 0, 
              height: 0, 
              opacity: 0.5,
              scale: 0,
              x: "-50%",
              y: "-50%" 
            }}
            animate={{ 
              width: 600, 
              height: 600, 
              opacity: 0,
              scale: 1,
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 0.8, 
              ease: [0.16, 1, 0.3, 1]
            }}
            style={{
              position: "absolute",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 70%)",
              backgroundBlendMode: "screen",
              backgroundColor: "rgba(255, 255, 255, 0.02)",
              filter: "blur(20px)",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
