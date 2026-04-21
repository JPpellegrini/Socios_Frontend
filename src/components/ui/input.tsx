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
  
  return (
    <div className={cn(
      "group relative h-14 w-full rounded-xl bg-surface-variant/40 transition-all dark:bg-input/60",
      className
    )}>
      <input
        id={inputId}
        type={type}
        data-slot="input"
        placeholder={props.placeholder || (label ? " " : undefined)} 
        className={cn(
          "peer block h-full w-full appearance-none bg-transparent px-4 text-base text-foreground transition-all outline-none disabled:pointer-events-none disabled:opacity-50",
          "placeholder:text-muted-foreground",
          label && "placeholder:opacity-0 focus:placeholder:opacity-100",
          label ? "pb-2 pt-6" : "py-2"
        )}
        {...props}
      />
      {label && (
        <label
          htmlFor={inputId}
          className="pointer-events-none absolute left-4 top-4 z-10 origin-[0] -translate-y-3 scale-75 transform text-sm font-medium text-muted-foreground transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-primary peer-disabled:opacity-50"
        >
          {label}
        </label>
      )}
    </div>
  );
}

export { Input }
