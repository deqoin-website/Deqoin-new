"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/utils";

type SidebarProviderProps = React.HTMLAttributes<HTMLDivElement> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const SidebarContext = React.createContext<{ open: boolean }>({ open: true });

function SidebarProvider({
  children,
  className,
  defaultOpen = true,
  open,
  ...props
}: SidebarProviderProps) {
  const value = React.useMemo(
    () => ({ open: open ?? defaultOpen }),
    [defaultOpen, open],
  );

  return (
    <SidebarContext.Provider value={value}>
      <div className={cn("w-full", className)} {...props}>
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

type SidebarProps = React.HTMLAttributes<HTMLElement> & {
  collapsible?: "none" | "offcanvas";
  side?: "left" | "right";
};

const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  ({ className, collapsible = "none", side = "left", ...props }, ref) => {
    return (
      <aside
        ref={ref}
        data-collapsible={collapsible}
        data-side={side}
        className={cn("w-full bg-transparent text-white", className)}
        {...props}
      />
    );
  },
);
Sidebar.displayName = "Sidebar";

const SidebarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex min-h-0 w-full flex-col", className)} {...props} />
  ),
);
SidebarContent.displayName = "SidebarContent";

const SidebarInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-none border border-zinc-800 bg-transparent px-4 py-3 text-sm text-white shadow-none placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);
SidebarInput.displayName = "SidebarInput";

const SidebarGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-4", className)} {...props} />
  ),
);
SidebarGroup.displayName = "SidebarGroup";

const SidebarGroupLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "px-4 text-[10px] md:text-xs tracking-[0.4em] text-zinc-500 uppercase font-light mb-4 bg-transparent",
        className,
      )}
      {...props}
    />
  ),
);
SidebarGroupLabel.displayName = "SidebarGroupLabel";

const SidebarMenu = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn("flex flex-col gap-1", className)} {...props} />
  ),
);
SidebarMenu.displayName = "SidebarMenu";

const SidebarMenuItem = React.forwardRef<HTMLLIElement, React.LiHTMLAttributes<HTMLLIElement>>(
  ({ className, ...props }, ref) => <li ref={ref} className={cn("w-full", className)} {...props} />,
);
SidebarMenuItem.displayName = "SidebarMenuItem";

type SidebarMenuButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  isActive?: boolean;
};

const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ className, asChild = false, isActive = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        data-active={isActive ? "true" : "false"}
        className={cn(
          "flex h-10 w-full items-center rounded-none px-4 text-left text-zinc-400 transition-colors hover:bg-zinc-900/60 hover:text-white",
          isActive && "bg-zinc-900 text-white font-normal border-l-2 border-white pl-3",
          className,
        )}
        {...props}
      />
    );
  },
);
SidebarMenuButton.displayName = "SidebarMenuButton";

export {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
};
