"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { clamp, cn } from "shadcn/utils";

interface I_Progress {
  showProgress?: boolean;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  I_Progress & React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, showProgress = false, value = 0, max, ...props }, ref) => (
  <div>
    {showProgress && (
      <div className="w-full px-2 text-center text-sm font-medium tracking-wider">
        {value} | {max}
      </div>
    )}
    <ProgressPrimitive.Root
      ref={ref}
      className={cn("relative h-4 w-full overflow-hidden rounded-full bg-secondary", className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full w-full flex-1 bg-primary transition-all"
        style={{
          transform: `translateX(-${
            100 - (max && value ? (clamp(value, max) / max) * 100 : value || 0)
          }%)`,
        }}
      />
    </ProgressPrimitive.Root>
  </div>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
