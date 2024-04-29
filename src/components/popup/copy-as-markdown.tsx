import { useState } from "react"
import { PiCopySimple } from "react-icons/pi"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip"
import { Button } from "~components/ui/button"

export default function copyAsMarkdown(params) {
  const { title, url } = params
  const [copied, setCopied] = useState(false)

  function copyAsMarkdown() {
    const markdown = `[${title}](${url})`
    navigator.clipboard.writeText(markdown).then(() => {
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
      }, 800)
    })
  }

  return (
    <div>
      <TooltipProvider>
        <Tooltip open={copied}>
          <TooltipTrigger asChild>
            <Button size="sm" variant="outline" className="bg-gray-100 hover:bg-gray-200" onClick={copyAsMarkdown}>
              <PiCopySimple size={18} className="mr-1" />
              Copy
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Copied!</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
