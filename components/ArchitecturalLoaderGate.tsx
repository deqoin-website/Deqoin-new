"use client";

import { useEffect, useState } from "react";
import ArchitecturalLoader from "./ArchitecturalLoader";

type ArchitecturalLoaderGateProps = {
  logoSrc?: string;
};

export default function ArchitecturalLoaderGate({ logoSrc }: ArchitecturalLoaderGateProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => window.clearTimeout(timer);
  }, []);

  return <ArchitecturalLoader isLoading={isLoading} logoSrc={logoSrc} />;
}
