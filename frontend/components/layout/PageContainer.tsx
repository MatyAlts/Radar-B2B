import React from "react"
import { HelpButton } from "@/components/ui/HelpButton"
import { cn } from "@/lib/utils"

interface PageContainerProps {
  title?: string
  subtitle?: string
  helpContent?: React.ReactNode
  children: React.ReactNode
  className?: string
  headerClassName?: string
}

const PageContainer = React.forwardRef<HTMLDivElement, PageContainerProps>(
  (
    {
      title,
      subtitle,
      helpContent,
      children,
      className,
      headerClassName,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex min-h-screen flex-col gap-6 bg-background p-6 md:p-8",
          className
        )}
        role="main"
      >
        {(title || helpContent) && (
          <div
            className={cn(
              "flex items-start justify-between gap-4",
              headerClassName
            )}
            role="banner"
          >
            <div className="flex-1">
              {title && (
                <h1 className="text-3xl font-semibold tracking-tight">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="mt-2 text-sm text-muted-foreground" id="page-subtitle">{subtitle}</p>
              )}
            </div>
            {helpContent && (
              <div className="flex-shrink-0">
                <HelpButton content={helpContent} title={`Ayuda: ${title}`} />
              </div>
            )}
          </div>
        )}
        <div className="flex-1" role="region" aria-label="Contenido principal">
          {children}
        </div>
      </div>
    )
  }
)
PageContainer.displayName = "PageContainer"

export { PageContainer }
