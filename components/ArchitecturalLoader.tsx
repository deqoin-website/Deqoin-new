"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import styles from "./ArchitecturalLoader.module.css";

type ArchitecturalLoaderProps = {
  isLoading: boolean;
  logoSrc?: string;
};

const curtainTransition = {
  duration: 1.15,
  ease: [0.77, 0, 0.175, 1] as const,
};

export default function ArchitecturalLoader({ isLoading, logoSrc = "/images/logo-new.jpeg" }: ArchitecturalLoaderProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          className={styles.shell}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24, ease: "easeOut" }}
          aria-hidden={!isLoading}
        >
          <div className={styles.ambient} />

          <motion.div
            className={styles.curtainLeft}
            initial={{ x: 0 }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={prefersReducedMotion ? { duration: 0.1 } : curtainTransition}
          />

          <motion.div
            className={styles.curtainRight}
            initial={{ x: 0 }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={prefersReducedMotion ? { duration: 0.1 } : curtainTransition}
          />

          <motion.div
            className={styles.centerFrame}
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.985, y: -6 }}
            transition={prefersReducedMotion ? { duration: 0.1 } : { duration: 0.75, ease: [0.77, 0, 0.175, 1] }}
          >
            <motion.div
              className={styles.logoWrap}
              initial={{ opacity: 0, filter: "blur(4px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(3px)" }}
              transition={prefersReducedMotion ? { duration: 0.1 } : { duration: 0.65, ease: [0.77, 0, 0.175, 1] }}
            >
              <img src={logoSrc} alt="DEQOIN" className={styles.logo} />
            </motion.div>

            <motion.div
              className={styles.loadingBar}
              initial={{ scaleX: 0.2, opacity: 0.25 }}
              animate={{ scaleX: 1, opacity: 1 }}
              exit={{ scaleX: 1, opacity: 0 }}
              transition={prefersReducedMotion ? { duration: 0.1 } : { duration: 1.05, ease: [0.77, 0, 0.175, 1] }}
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
