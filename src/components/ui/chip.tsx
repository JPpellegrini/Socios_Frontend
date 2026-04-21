import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const chipVariants = cva(
  "inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-300 active:scale-95 cursor-pointer select-none",
  {
    variants: {
      variant: {
        assist: "bg-surface-variant/20 text-on-surface-variant hover:bg-surface-variant/40",
        filter: "bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80",
        input: "border border-outline bg-transparent text-foreground hover:bg-surface-variant/20 hover:border-transparent transition-all",
        suggestion: "bg-surface-variant/10 border border-outline/30 text-foreground hover:bg-surface-variant/30",
      },
    },
    defaultVariants: {
      variant: "assist",
    },
  }
)

export interface ChipProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chipVariants> {
  selected?: boolean
}

function Chip({ className, variant, selected, ...props }: ChipProps) {
  return (
    <div
      className={cn(
        chipVariants({ variant }),
        selected && "bg-primary text-primary-foreground",
        className
      )}
      {...props}
    />
  )
}

export { Chip, chipVariants }
