"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect } from "react";

import type { JournalArticle } from "@/data/journal";
import { cn } from "@/lib/utils";
import JournalArticleShell from "./JournalArticleShell";

type JournalDrawerProps = {
  article: JournalArticle | null;
  onClose: () => void;
  className?: string;
};

export default function JournalDrawer({ article, onClose, className }: JournalDrawerProps) {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!article) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [article, onClose]);

  return (
    <AnimatePresence>
      {article ? (
        <>
          <motion.button
            type="button"
            className={cn("fixed inset-0 z-50 bg-black/82 backdrop-blur-[28px]", className)}
            aria-label="Makaleyi kapat"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0.1 : 0.28, ease: [0.16, 1, 0.3, 1] }}
          />

          <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 md:p-6">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={article.title}
              className="relative flex h-[100svh] w-full items-center justify-center md:h-[min(92svh,1080px)] md:w-[min(96vw,1640px)]"
              initial={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : {
                      opacity: 0,
                      y: 30,
                      scale: 0.985,
                    }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : {
                      opacity: 0,
                      y: 18,
                      scale: 0.985,
                    }
              }
              transition={{ duration: prefersReducedMotion ? 0.1 : 0.52, ease: [0.16, 1, 0.3, 1] }}
            >
              <JournalArticleShell article={article} variant="drawer" onClose={onClose} />
            </motion.div>
          </div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
