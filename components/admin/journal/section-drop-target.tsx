"use client";

import { GripVertical } from "lucide-react";

import { cn } from "@/lib/utils";

type SectionDropTargetProps = {
  index: number;
  active: boolean;
  onDropItem: () => void;
  onDragEnter: () => void;
  onDragLeave: () => void;
};

export function SectionDropTarget({ index, active, onDropItem, onDragEnter, onDragLeave }: SectionDropTargetProps) {
  return (
    <div
      className={cn(
        "group relative h-14 rounded-2xl border border-dashed transition-all duration-200",
        active ? "border-white/35 bg-white/[0.08] shadow-[0_0_0_1px_rgba(255,255,255,0.15)]" : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]",
      )}
      onDragOver={(event) => {
        event.preventDefault();
        onDragEnter();
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        onDragLeave();
      }}
      onDrop={(event) => {
        event.preventDefault();
        onDropItem();
      }}
    >
      <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className={cn("flex h-8 w-8 items-center justify-center rounded-full border", active ? "border-white/30 bg-white text-zinc-950" : "border-white/10 bg-white/[0.04] text-zinc-500")}>
            <GripVertical className="h-4 w-4" />
          </div>
          <p className="text-[0.58rem] tracking-[0.3em] text-zinc-500">blok bırakma alanı {index + 1}</p>
        </div>
        <span className="text-[0.58rem] tracking-[0.28em] text-zinc-500">sürükle ve bırak</span>
      </div>
    </div>
  );
}
