import * as React from "react";
import { cn } from "@/lib/cn";

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "text-sm font-semibold text-[#003366] leading-none",
        className
      )}
      {...props}
    />
  )
);
Label.displayName = "Label";

export { Label };
