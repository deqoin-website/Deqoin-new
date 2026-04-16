"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ArchitecturalLoader from "./ArchitecturalLoader";

export default function ArchitecturalLoaderGate() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 1200);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    setIsLoading(true);
  }, [pathname]);

  return <ArchitecturalLoader isLoading={isLoading} />;
}
