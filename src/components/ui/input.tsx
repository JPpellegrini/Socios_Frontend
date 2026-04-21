import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ 
  className, 
  type, 
  label,
  id,
  ...props 
}: React.ComponentProps<"input"> & { label?: string }) {
  const generatedId = React.useId();
  const inputId = id || generatedId;
  
  const inputElement = (
    <input
      id={inputId}
      type={type}
      data-slot="input"
      placeholder=" " 
      className={cn(
        "peer block w-full min-w-0 appearance-none bg-transparent px-4 pb-2 pt-6 text-base text-foreground transition-all outline-none disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    />
  );

  if (!label) {
    return (
      <div className="relative h-14 w-full rounded-xl border border-input bg-surface-variant/10 transition-all focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10">
        <input
          id={inputId}
          type={type}
          data-slot="input"
          className={cn(
            "h-full w-full min-w-0 bg-transparent px-4 text-base transition-all outline-none disabled:pointer-events-none disabled:opacity-50",
            className
          )}
          {...props}
        />
      </div>
    );
  }

  return (
    <div className="group relative h-14 w-full rounded-xl border border-input bg-surface-variant/10 transition-all focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 dark:bg-input/30">
      {inputElement}
      <label
        htmlFor={inputId}
        className="pointer-events-none absolute left-4 top-4 z-10 origin-[0] -translate-y-3 scale-75 transform text-sm font-medium text-muted-foreground transition-all duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-primary"
      >
        {label}
      </label>
      <div className="absolute bottom-0 left-0 h-0.5 w-full scale-x-0 bg-primary transition-transform duration-300 group-focus-within:scale-x-100" />
    </div>
  );
}

export { Input }
