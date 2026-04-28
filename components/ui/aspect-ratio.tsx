import * as React from "react";

import { cn } from "@/lib/utils";

type AspectRatioProps = React.HTMLAttributes<HTMLDivElement> & {
  ratio?: number;
};

export function AspectRatio({ ratio = 1, className, style, ...props }: AspectRatioProps) {
  return (
    <div
      className={cn("relative w-full", className)}
      style={{ aspectRatio: `${ratio}`, ...style }}
      {...props}
    />
  );
}
