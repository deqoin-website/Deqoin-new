"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ArchitecturalLoader from "./ArchitecturalLoader";

type GlobalRouteLoaderProps = {
  logoSrc?: string;
};

export default function GlobalRouteLoader({ logoSrc }: GlobalRouteLoaderProps) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setIsVisible(true);
    const timer = window.setTimeout(() => setIsVisible(false), 1900);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  return <ArchitecturalLoader isLoading={isVisible} logoSrc={logoSrc} />;
}
