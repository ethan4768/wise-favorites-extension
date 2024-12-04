import { Button } from "@/components/ui/button.tsx"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip.tsx"
import { tagging } from "@/lib/llm.ts"
import { GeneralConfig, generalConfigInStorage } from "@/lib/storage/general.ts"
import { PageMetadata } from "@/lib/types.ts"
import { cn } from "@/lib/utils.ts"
import { Loader2, Sparkles } from "lucide-react"
import React from "react"

export default function LLM({
  presetTags,
  metadata,
  content,
  onValueChange
}: {
  presetTags: string[]
  metadata: PageMetadata
  content: string
  onValueChange: (key: string, value: any) => void
}) {
  const [generalConfig, setGeneralConfig] = React.useState<GeneralConfig>()
  const [isLoading, setIsLoading] = React.useState(false)
  const [llmErrorMessage, setLlmErrorMessage] = React.useState("")

  React.useEffect(() => {
    ;(async () => {
      await loadGeneralConfig()
    })()
  }, [])

  const loadGeneralConfig = async () => {
    const config = await generalConfigInStorage.getValue()
    setGeneralConfig(config)
  }

  const enhanceWithAI = async () => {
    setLlmErrorMessage("")
    setIsLoading(true)
    const llmResult = await tagging(presetTags, metadata, content)
    if (llmResult.success) {
      if (generalConfig?.llm.overwriteTitle && llmResult.data?.improved_title) {
        onValueChange("title", llmResult.data.improved_title)
      }
      if (generalConfig?.llm.overwriteDescription && llmResult.data?.improved_description) {
        onValueChange("description", llmResult.data.improved_description)
      }
      if (generalConfig?.llm.mergeTags) {
        onValueChange("tags", [...(metadata.tags || []), ...(llmResult.data?.tags || [])])
      }
    } else {
      setLlmErrorMessage(llmResult.error || "")
    }
    setIsLoading(false)
  }

  return (
    <div className="mx-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="default"
            variant="ghost"
            className="text-xs text-primary hover:text-primary p-0 hover:bg-inherit"
            onClick={enhanceWithAI}>
            {isLoading ? <Loader2 className={cn("mr-2", "animate-spin")} /> : <Sparkles />}
            Enhance with AI
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Enhance title, description, tags with AI</p>
        </TooltipContent>
      </Tooltip>
      {llmErrorMessage && (
        <div className="text-destructive p-2 px-4 whitespace-break-spaces">
          {llmErrorMessage}
          <p>
            Go to{" "}
            <a target="_blank" href={browser.runtime.getURL("/options.html#/llm")} className="text-blue-500 underline">
              LLM Settings
            </a>
          </p>
        </div>
      )}
    </div>
  )
}
