"use client";

import * as React from "react";

import { cn } from "shadcn/utils";

interface TextareaCountProps {
  maxCount: number;
}

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    TextareaCountProps {}

const TextareaWithCount = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, onChange: userOnChangeCallback, maxCount, ...props }, ref) => {
    const [count, setCount] = React.useState(0);

    const recalculateCount = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCount(e.target.value.length);
      if (userOnChangeCallback) userOnChangeCallback(e);
    };

    return (
      <div className="relative w-full">
        <textarea
          className={cn(
            "focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          ref={ref}
          onChange={recalculateCount}
          {...props}
        />
        <span
          className={cn(
            "absolute -bottom-2 right-2 bg-white px-1 text-xs text-foreground/50",
            count > maxCount && "text-destructive",
          )}
        >
          {count}/{maxCount}
        </span>
      </div>
    );
  },
);
TextareaWithCount.displayName = "TextareaWithCount";

export { TextareaWithCount };
