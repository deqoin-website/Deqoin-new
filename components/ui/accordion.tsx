"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

type AccordionContextValue = {
  value: string | null;
  onValueChange: (value: string | null) => void;
};

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

type AccordionProps = React.PropsWithChildren<{
  value: string | null;
  onValueChange: (value: string | null) => void;
}>;

function Accordion({ value, onValueChange, children }: AccordionProps) {
  return <AccordionContext.Provider value={{ value, onValueChange }}>{children}</AccordionContext.Provider>;
}

const AccordionItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("rounded-2xl border border-white/10 bg-white/[0.03]", className)} {...props} />,
);
AccordionItem.displayName = "AccordionItem";

type AccordionTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  value: string;
};

const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, value, children, ...props }, ref) => {
    const context = React.useContext(AccordionContext);

    if (!context) {
      throw new Error("AccordionTrigger must be used within Accordion");
    }

    const active = context.value === value;

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm text-zinc-300 transition-colors hover:text-white",
          className,
        )}
        onClick={() => context.onValueChange(active ? null : value)}
        {...props}
      >
        {children}
        <ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform", active && "rotate-180")} />
      </button>
    );
  },
);
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("border-t border-white/10 px-4 py-3", className)} {...props} />;
  },
);
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
