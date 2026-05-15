import * as React from "react"
import { HelpCircle } from "lucide-react"
import { Button } from "./button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip"

interface HelpButtonProps {
  content: React.ReactNode
  title?: string
}

const HelpButton = React.forwardRef<HTMLButtonElement, HelpButtonProps>(
  ({ content, title = "Ayuda" }, ref) => {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              ref={ref}
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              aria-label={title}
              aria-describedby={`help-${title.replace(/\s+/g, '-').toLowerCase()}`}
            >
              <HelpCircle className="h-4 w-4" aria-hidden="true" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" className="max-w-xs" id={`help-${title.replace(/\s+/g, '-').toLowerCase()}`}>
            {typeof content === "string" ? <p>{content}</p> : content}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }
)
HelpButton.displayName = "HelpButton"

export { HelpButton }
