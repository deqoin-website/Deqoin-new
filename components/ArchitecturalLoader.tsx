"use client";

import { AnimatePresence, motion } from "framer-motion";
import styles from "./ArchitecturalLoader.module.css";

type ArchitecturalLoaderProps = {
  isLoading: boolean;
  logoSrc?: string;
};

const panelTransition = {
  duration: 1.2,
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.7, ease: [0.77, 0, 0.175, 1] }}
          >
            <img src={logoSrc} alt="DEQOIN" className={styles.brandLogo} />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
