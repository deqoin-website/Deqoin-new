"use client";

import { AnimatePresence, motion } from "framer-motion";
import styles from "./ArchitecturalLoader.module.css";

type ArchitecturalLoaderProps = {
  isLoading: boolean;
  logoSrc?: string;
};

const panelTransition = {
  duration: 1.35,
  ease: [0.77, 0, 0.175, 1] as const,
};

export default function ArchitecturalLoader({ isLoading, logoSrc = "/images/logo-new.jpeg" }: ArchitecturalLoaderProps) {
  return (
    <AnimatePresence>
      {isLoading ? (
        <motion.div
          className={styles.loaderShell}
          aria-hidden={!isLoading}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <motion.div
            className={styles.ambientGlow}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.06 }}
            transition={{ duration: 0.9, ease: [0.77, 0, 0.175, 1] }}
          />
          <motion.div
            className={styles.panelLeft}
            initial={{ x: 0 }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={panelTransition}
          />
          <motion.div
            className={styles.panelRight}
            initial={{ x: 0 }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={panelTransition}
          />

          <motion.div
            className={styles.brandMark}
            initial={{ opacity: 0, y: 12, scale: 0.985, filter: "blur(2px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, scale: 1.01, filter: "blur(3px)" }}
            transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
          >
            <img src={logoSrc} alt="DEQOIN" className={styles.brandLogo} />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
