"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function PageTransitionSound() {
  const pathname = usePathname();
  const prevPathname = useRef<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio object
    audioRef.current = new Audio("/sounds/page-flip.mp3");
    audioRef.current.volume = 0.3; // Subtle volume
    audioRef.current.load();
  }, []);

  useEffect(() => {
    // Skip on first render
    if (prevPathname.current === null) {
      prevPathname.current = pathname;
      return;
    }

    // Skip if it's an admin route
    if (pathname.startsWith("/admin")) {
      prevPathname.current = pathname;
      return;
    }

    // Play sound on actual pathname change
    if (prevPathname.current !== pathname) {
      if (audioRef.current) {
        // Clone for overlapping transitions if needed, or just reset
        const sound = audioRef.current.cloneNode() as HTMLAudioElement;
        sound.volume = 0.3;
        sound.play().catch(() => {
          // Silent fail for autoplay restrictions
          console.log("Audio play blocked by browser until user interaction.");
        });
      }
      prevPathname.current = pathname;
    }
  }, [pathname]);

  return null; // This component has no UI
}
