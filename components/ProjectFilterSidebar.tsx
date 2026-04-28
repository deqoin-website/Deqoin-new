"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

type FilterOption = {
  label: string;
  value: string;
};

type ProjectFilterSidebarProps = {
  activeCategory: string;
  categories: FilterOption[];
  className?: string;
  onCategoryChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  searchValue: string;
  title?: string;
};

export default function ProjectFilterSidebar({
  activeCategory,
  categories,
  className,
  onCategoryChange,
  onSearchChange,
  searchPlaceholder,
  searchValue,
  title = "KATEGORİLER",
}: ProjectFilterSidebarProps) {
  return (
    <aside className={cn("hidden h-fit lg:sticky lg:top-32 lg:col-span-1 lg:flex lg:flex-col", className)}>
      <div className="relative w-full mb-12">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <input
          type="search"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder}
          className="w-full rounded-md border border-zinc-800/80 bg-zinc-950/50 py-4 pl-12 pr-4 font-light tracking-wider text-white placeholder:text-zinc-600 transition-all focus:outline-none focus:ring-1 focus:ring-zinc-700"
        />
      </div>

      <div className="flex flex-col">
        <span className="mb-6 block text-xs font-light uppercase tracking-[0.3em] text-red-500">
          {title}
        </span>
        <div className="flex flex-col gap-1">
          {categories.map((category) => {
            const isActive = activeCategory === category.value;

            return (
              <button
                key={category.value}
                type="button"
                onClick={() => onCategoryChange(category.value)}
                className={cn(
                  "w-full rounded-md px-4 py-2.5 -ml-4 text-left text-sm uppercase tracking-widest transition-all",
                  isActive
                    ? "bg-zinc-900/60 font-normal text-white"
                    : "font-light text-zinc-500 hover:bg-zinc-900/30 hover:text-zinc-300",
                )}
              >
                {category.label}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
