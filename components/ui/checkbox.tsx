import * as React from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ className, checked = false, onCheckedChange, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        role="checkbox"
        aria-checked={checked}
        data-state={checked ? "checked" : "unchecked"}
        className={cn(
          "inline-flex h-5 w-5 items-center justify-center rounded-[0.45rem] border border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--accent)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]",
          checked && "border-[color:var(--accent)] bg-[color:var(--accent)] text-white",
          className,
        )}
        onClick={() => onCheckedChange?.(!checked)}
        {...props}
      >
        <Check className={cn("h-3.5 w-3.5", checked ? "opacity-100" : "opacity-0")} />
      </button>
    );
  },
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
