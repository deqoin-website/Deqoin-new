"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { MaterialProductFilterGroup } from "@/data/materyal-urunleri";

type MaterialFilterSidebarProps = {
  groups: MaterialProductFilterGroup[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  selectedValues: Record<string, string[]>;
  onToggle: (groupKey: string, value: string) => void;
  onClearAll: () => void;
  className?: string;
};

export default function MaterialFilterSidebar({
  groups,
  searchValue,
  onSearchChange,
  selectedValues,
  onToggle,
  onClearAll,
  className,
}: MaterialFilterSidebarProps) {
  const [openGroup, setOpenGroup] = useState<string | null>(groups[0]?.key ?? null);

  const activeCount = useMemo(
    () => Object.values(selectedValues).reduce((count, values) => count + values.length, 0),
    [selectedValues],
  );

  return (
    <aside
      className={cn(
        "flex h-fit flex-col gap-6 rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5 text-white/90 backdrop-blur-sm lg:sticky lg:top-28",
        className,
      )}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[0.62rem] uppercase tracking-[0.35em] text-zinc-500">Filtreler</p>
            <h2 className="text-lg font-medium text-white">Materyal Ara</h2>
          </div>
          {activeCount > 0 ? (
            <button
              type="button"
              className="text-[0.65rem] uppercase tracking-[0.28em] text-zinc-400 transition-colors hover:text-white"
              onClick={onClearAll}
            >
              Temizle
            </button>
          ) : null}
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input
            type="search"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Materyal, stok kodu veya özellik ara"
            className="h-11 border-white/10 bg-black/20 pl-9 text-sm text-white placeholder:text-zinc-500"
          />
        </div>
      </div>

      <Accordion value={openGroup} onValueChange={setOpenGroup}>
        <div className="space-y-3">
          {groups.map((group) => {
            const selected = selectedValues[group.key] ?? [];
            return (
              <AccordionItem key={group.key} value={group.key} className="border-white/10 bg-white/[0.02]">
                <AccordionTrigger value={group.key} className="px-4 py-3 text-sm text-white/80">
                  <span className="flex items-center gap-3">
                    <span className="text-[0.72rem] uppercase tracking-[0.28em]">{group.title}</span>
                    {selected.length > 0 ? (
                      <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[0.62rem] uppercase tracking-[0.2em] text-zinc-300">
                        {selected.length}
                      </span>
                    ) : null}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 px-4 py-4">
                  {group.description ? (
                    <p className="text-xs leading-6 text-zinc-500">{group.description}</p>
                  ) : null}
                  <div className="space-y-2">
                    {group.options.map((option) => {
                      const isChecked = selected.includes(option.value);
                      return (
                        <div
                          key={option.value}
                          className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-black/10 px-3 py-2 text-sm text-zinc-300 transition-colors hover:border-white/10 hover:bg-white/[0.04]"
                        >
                          <span className="text-[0.76rem] uppercase tracking-[0.18em]">{option.label}</span>
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={() => onToggle(group.key, option.value)}
                          />
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </div>
      </Accordion>
    </aside>
  );
}
