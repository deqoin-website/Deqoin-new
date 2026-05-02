"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type FieldGroupProps = {
  label: string;
  children: ReactNode;
  className?: string;
  helper?: string;
};

export function FieldGroup({ label, helper, children, className }: FieldGroupProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-[0.6rem] tracking-[0.32em] text-zinc-500">{label}</p>
      {children}
      {helper ? <p className="text-xs leading-6 text-zinc-500">{helper}</p> : null}
    </div>
  );
}
