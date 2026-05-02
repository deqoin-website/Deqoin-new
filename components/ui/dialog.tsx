"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

type DialogContextValue = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const DialogContext = React.createContext<DialogContextValue | null>(null);

type DialogProps = React.PropsWithChildren<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>;

function Dialog({ open, onOpenChange, children }: DialogProps) {
  return <DialogContext.Provider value={{ open, onOpenChange }}>{children}</DialogContext.Provider>;
}

const DialogTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ children, ...props }, ref) => <button ref={ref} type="button" {...props}>{children}</button>,
);
DialogTrigger.displayName = "DialogTrigger";

const DialogContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(DialogContext);
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => setMounted(true), []);

    if (!context?.open || !mounted) {
      return null;
    }

    return createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
        <button
          type="button"
          aria-label="close dialog"
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
          onClick={() => context.onOpenChange(false)}
        />
        <div
          ref={ref}
          className={cn(
            "relative z-10 max-h-[90dvh] w-full max-w-4xl overflow-hidden rounded-[1.75rem] border border-white/10 bg-[color:var(--admin-surface)] shadow-[0_30px_100px_rgba(0,0,0,0.5)]",
            className,
          )}
          {...props}
        >
          {children}
          <button
            type="button"
            aria-label="close dialog"
            className="absolute right-4 top-4 rounded-full border border-white/10 bg-white/[0.04] p-2 text-zinc-300 transition-colors hover:bg-white hover:text-zinc-950"
            onClick={() => context.onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>,
      document.body,
    );
  },
);
DialogContent.displayName = "DialogContent";

const DialogHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-1.5 border-b border-white/10 px-6 py-5", className)} {...props} />
  ),
);
DialogHeader.displayName = "DialogHeader";

const DialogTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2 ref={ref} className={cn("text-lg font-medium tracking-[0.16em] text-white", className)} {...props} />
  ),
);
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm leading-7 text-zinc-400", className)} {...props} />
  ),
);
DialogDescription.displayName = "DialogDescription";

const DialogBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("max-h-[calc(90dvh-88px)] overflow-y-auto px-6 py-5", className)} {...props} />
  ),
);
DialogBody.displayName = "DialogBody";

export {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
};
