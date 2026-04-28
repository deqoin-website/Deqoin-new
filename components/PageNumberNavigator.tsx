"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type PageNavItem = {
  id: string;
  label: string;
  title?: string;
};

type PageNumberNavigatorProps = {
  items: PageNavItem[];
  className?: string;
  label?: string;
};

export default function PageNumberNavigator({
  items,
  className,
  label = "BÖLÜMLER",
}: PageNumberNavigatorProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  const validItems = useMemo(() => items.filter((item) => item.id), [items]);

  useEffect(() => {
    if (validItems.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        const mostVisible = visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (mostVisible?.target?.id) {
          setActiveId(mostVisible.target.id);
        }
      },
      {
        root: null,
        threshold: [0.35, 0.5, 0.65],
        rootMargin: "-15% 0px -55% 0px",
      },
    );

    validItems.forEach((item) => {
      const target = document.getElementById(item.id);
      if (target) observer.observe(target);
    });

    return () => observer.disconnect();
  }, [validItems]);

  if (validItems.length <= 1) {
    return null;
  }

  return (
    <div className={cn("flex flex-col items-center gap-4 pt-10", className)}>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {validItems.map((item, index) => {
          const isActive = activeId === item.id;

          return (
            <Button
              key={item.id}
              type="button"
              variant="ghost"
              onClick={() => {
                const target = document.getElementById(item.id);
                target?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={cn(
                "rounded-none border px-4 py-2 text-[10px] uppercase tracking-[0.35em] transition-colors",
                isActive
                  ? "border-white bg-white text-zinc-950 hover:bg-white hover:text-zinc-950"
                  : "border-zinc-800 bg-transparent text-zinc-500 hover:bg-zinc-900 hover:text-white",
              )}
            >
              {item.label || String(index + 1).padStart(2, "0")}
            </Button>
          );
        })}
      </div>

      <p className="text-[10px] uppercase tracking-[0.5em] text-zinc-500">
        {label} {String(validItems.findIndex((item) => item.id === activeId) + 1).padStart(2, "0")} /{" "}
        {String(validItems.length).padStart(2, "0")}
      </p>
    </div>
  );
}
