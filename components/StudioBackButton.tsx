"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

interface StudioBackButtonProps {
  href?: string;
  label?: string;
}

export default function StudioBackButton({ 
  href = "/", 
  label = "ANASAYFAYA DÖN" 
}: StudioBackButtonProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <>
      <Link href={href} className="studio-back-btn-floating">
        <div className="back-icon-box">
           <span className="material-symbols-outlined">west</span>
        </div>
        <span className="back-text">{label}</span>
      </Link>

      <style jsx global>{`
        .studio-back-btn-floating {
          position: fixed;
          top: 7rem;
          left: 3rem;
          z-index: 9999;
          display: flex;
          align-items: center;
          gap: 1.25rem;
          text-decoration: none;
          color: #fff !important;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          padding: 0.5rem;
          pointer-events: auto;
        }

        .back-icon-box {
          width: 54px;
          height: 54px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 50%;
          color: #a68966;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .back-text {
          font-family: var(--font-display), sans-serif;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.25em;
          opacity: 0;
          transform: translateX(-10px);
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          color: #fff;
          white-space: nowrap;
          text-shadow: 0 4px 15px rgba(0,0,0,0.8);
        }

        .studio-back-btn-floating:hover .back-icon-box {
          background: #a68966;
          color: #000;
          transform: scale(1.1);
          border-color: #a68966;
          box-shadow: 0 0 30px rgba(166,137,102,0.5);
        }

        .studio-back-btn-floating:hover .back-text {
          opacity: 1;
          transform: translateX(0);
        }

        @media (max-width: 1024px) {
          .studio-back-btn-floating { top: 6rem; left: 1.5rem; gap: 0.75rem; }
          .back-icon-box { width: 44px; height: 44px; }
          .back-text { display: none; }
        }
      `}</style>
    </>,
    document.body
  );
}
