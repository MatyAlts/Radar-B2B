import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-white hover:bg-primary-dark focus:ring-primary focus:ring-offset-background",
        secondary:
          "border-transparent bg-secondary text-white hover:bg-secondary-dark focus:ring-secondary focus:ring-offset-background",
        destructive:
          "border-transparent bg-error text-white hover:bg-error-dark focus:ring-error focus:ring-offset-background",
        success:
          "border-transparent bg-success text-white hover:bg-success-dark focus:ring-success focus:ring-offset-background",
        warning:
          "border-transparent bg-warning text-foreground hover:bg-warning-dark focus:ring-warning focus:ring-offset-background",
        outline: "border-border text-foreground hover:bg-input focus:ring-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
