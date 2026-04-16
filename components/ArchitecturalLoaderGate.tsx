"use client";

import { useEffect, useState } from "react";
import ArchitecturalLoader from "./ArchitecturalLoader";

type ArchitecturalLoaderGateProps = {
  logoSrc?: string;
};

export default function ArchitecturalLoaderGate({ logoSrc }: ArchitecturalLoaderGateProps) {
  const [isLoading, setIsLoading] = useState(() => {
    if (typeof window === "undefined") return true;
    return !window.sessionStorage.getItem("deqoin_loader_seen");
  });

  useEffect(() => {
    if (!isLoading) return;

    const timer = window.setTimeout(() => {
      window.sessionStorage.setItem("deqoin_loader_seen", "1");
      setIsLoading(false);
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [isLoading]);

  return <ArchitecturalLoader isLoading={isLoading} logoSrc={logoSrc} />;
}
