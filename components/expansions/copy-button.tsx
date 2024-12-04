"use client"

import { Button, ButtonProps } from "@/components/ui/button.tsx"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip.tsx"
import { cn } from "@/lib/utils.ts"
import { CheckIcon, CopyIcon } from "lucide-react"
import * as React from "react"

interface CopyButtonProps extends ButtonProps {
  value: string
  tooltip?: string
  hideText?: boolean
  icon?: React.ReactNode
}

async function copyToClipboard(value: string) {
  await navigator.clipboard.writeText(value)
}

export function CopyButton({
  value,
  tooltip,
  hideText = true,
  icon = <CopyIcon />,
  className,
  variant = "default",
  size = "default",
  ...props
}: CopyButtonProps) {
  const [hasCopied, setHasCopied] = React.useState(false)

  React.useEffect(() => {
    setTimeout(() => {
      setHasCopied(false)
    }, 2000)
  }, [hasCopied])

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size={size}
          variant={variant}
          className={cn(className)}
          onClick={async () => {
            await copyToClipboard(value)
            setHasCopied(true)
          }}
          {...props}>
          {hasCopied ? <CheckIcon /> : icon}
          <span className={hideText ? "sr-only" : ""}>{tooltip}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  )
}
