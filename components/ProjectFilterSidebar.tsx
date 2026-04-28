"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type FilterOption = {
  label: string;
  value: string;
  meta?: string;
};

export type FilterGroup = {
  title: string;
  options: FilterOption[];
  selectedValues: string[];
  onToggle: (value: string) => void;
  description?: string;
};

type LegacyProps = {
  activeCategory: string;
  categories: FilterOption[];
  onCategoryChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  searchValue: string;
  title?: string;
};

type ModernProps = {
  groups: FilterGroup[];
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  title?: string;
};

type ProjectFilterSidebarProps = (LegacyProps | ModernProps) & {
  className?: string;
  searchClassName?: string;
  sectionClassName?: string;
  optionClassName?: string;
};

function isLegacyProps(props: LegacyProps | ModernProps): props is LegacyProps {
  return "categories" in props;
}

export default function ProjectFilterSidebar(props: ProjectFilterSidebarProps) {
  const {
    className,
    searchClassName,
    sectionClassName,
    optionClassName,
    title = "FİLTRELER",
  } = props;

  const groups = isLegacyProps(props)
    ? [
        {
          title,
          options: props.categories,
          selectedValues: [props.activeCategory],
          onToggle: props.onCategoryChange,
        },
      ]
    : props.groups;

  const searchValue = props.searchValue;
  const onSearchChange = props.onSearchChange;
  const searchPlaceholder = props.searchPlaceholder;

  return (
    <aside
      className={cn(
        "flex h-fit flex-col gap-10 lg:sticky lg:top-28",
        className,
      )}
    >
      <div
        className={cn(
          "relative w-full border-b border-white/10 pb-4",
          searchClassName,
        )}
      >
        <Search className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
        <Input
          type="search"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder}
          className="h-12 border-0 bg-transparent pl-8 text-[0.72rem] uppercase tracking-[0.35em] text-white placeholder:text-white/25 focus-visible:ring-0"
          style={{ fontFamily: "Smooch Sans, sans-serif" }}
        />
      </div>

      <div className="flex flex-col gap-8">
        {groups.map((group) => {
          const sectionTitle = group.title.toUpperCase();

          return (
            <section key={sectionTitle} className={cn("flex flex-col gap-4", sectionClassName)}>
              <header className="flex items-end justify-between gap-4">
                <h3
                  className="text-[0.68rem] font-thin uppercase tracking-[0.55em] text-white/55"
                  style={{ fontFamily: "Smooch Sans, sans-serif" }}
                >
                  {sectionTitle}
                </h3>
                {group.description ? (
                  <p className="max-w-[11rem] text-right text-[0.58rem] uppercase tracking-[0.35em] text-white/28">
                    {group.description}
                  </p>
                ) : null}
              </header>

              <div className="flex flex-col gap-2">
                {group.options.map((option) => {
                  const isActive = group.selectedValues.includes(option.value);

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => group.onToggle(option.value)}
                      className={cn(
                        "group flex w-full items-center justify-between border-b border-white/5 py-2 text-left transition-colors",
                        isActive ? "text-white" : "text-white/45 hover:text-white/75",
                        optionClassName,
                      )}
                    >
                      <span
                        className="text-[0.84rem] uppercase tracking-[0.42em] md:text-[0.76rem]"
                        style={{ fontFamily: "Smooch Sans, sans-serif" }}
                      >
                        {option.label}
                      </span>
                      {option.meta ? (
                        <span className="text-[0.55rem] uppercase tracking-[0.42em] text-white/30">
                          {option.meta}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </aside>
  );
}
