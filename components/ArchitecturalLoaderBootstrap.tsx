"use client";

import { useEffect, useState } from "react";
import ArchitecturalLoader from "./ArchitecturalLoader";

type ArchitecturalLoaderBootstrapProps = {
  logoSrc?: string;
};

export default function ArchitecturalLoaderBootstrap({ logoSrc }: ArchitecturalLoaderBootstrapProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const seen = window.sessionStorage.getItem("deqoin_bootstrap_loader_seen");
    if (seen) {
      setIsLoading(false);
      return;
    }

    const timer = window.setTimeout(() => {
      window.sessionStorage.setItem("deqoin_bootstrap_loader_seen", "1");
      setIsLoading(false);
    }, 1350);

    return () => window.clearTimeout(timer);
  }, []);

  return <ArchitecturalLoader isLoading={isLoading} logoSrc={logoSrc} />;
}
