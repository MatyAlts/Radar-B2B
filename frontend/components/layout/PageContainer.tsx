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
          "flex flex-col h-full",
          className
        )}
        role="main"
      >
        {(title || helpContent) && (
          <div
            className={cn(
              "flex flex-col gap-1 p-6 md:px-8 lg:px-10 md:flex-row md:items-end md:justify-between flex-none",
              headerClassName
            )}
            role="banner"
          >
            <div className="flex-1 space-y-1">
              {title && (
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-xs font-medium text-muted-foreground" id="page-subtitle">
                  {subtitle}
                </p>
              )}
            </div>
            {helpContent && (
              <div className="mt-4 flex-shrink-0 md:mt-0">
                <HelpButton content={helpContent} title={`Ayuda: ${title}`} />
              </div>
            )}
          </div>
        )}
        <div className="flex-1 overflow-hidden" role="region" aria-label="Contenido principal">
          {children}
        </div>
      </div>
    )
  }
)
PageContainer.displayName = "PageContainer"

export { PageContainer }
