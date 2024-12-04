import { ButtonGroup } from "@/components/expansions/button-group.tsx"
import { CopyButton } from "@/components/expansions/copy-button.tsx"
import MultipleSelector, { Option } from "@/components/expansions/multi-selector.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Label } from "@/components/ui/label.tsx"
import { Textarea } from "@/components/ui/textarea.tsx"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip.tsx"
import LLM from "@/entrypoints/app/llm.tsx"
import Share from "@/entrypoints/app/share.tsx"
import { useIsMobile } from "@/lib/hooks/use-mobile.tsx"
import { useIsSidePanel } from "@/lib/hooks/use-sidepanel.tsx"
import { getMetadataIcon } from "@/lib/icons.ts"
import { addToPresetTags, getPresetTagList } from "@/lib/storage/tags.ts"
import { sanitizeAlphaNumeric } from "@/lib/string-utils.ts"
import { PageMetadata } from "@/lib/types.ts"
import { ChevronDown, ChevronRight, FileJson, FileText, Link2, RotateCw, Settings } from "lucide-react"
import React from "react"

function App() {
  const isSidePanel = useIsSidePanel()
  const isMobile = useIsMobile()

  const [isMetadataExpanded, setIsMetadataExpanded] = React.useState(true)
  const [metadata, setMetadata] = React.useState<PageMetadata>({
    url: "",
    title: "",
    tags: []
  })
  const [content, setContent] = React.useState("")
  const [shareErrorMessage, setShareErrorMessage] = React.useState("")

  const [presetTagList, setPresetTagList] = React.useState<string[]>([])

  React.useEffect(() => {
    ;(async () => {
      await loadPresetTags()
      await extractPageData()
    })()
  }, [])

  const loadPresetTags = async () => {
    const tags = await getPresetTagList()
    setPresetTagList(tags)
  }

  const extractPageData = async () => {
    browser.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const currentTab = tabs[0]
      if (currentTab?.id) {
        const res = await browser.tabs.sendMessage(currentTab.id, { action: "extractPageData" })
        setMetadata({ ...res.metadata, tags: [] })
        setContent(res.content)
      }
    })
  }

  const handleMetadataChange = async (key: string, value: string | string[]) => {
    setMetadata((prev) => ({ ...prev, [key]: value }))
    if (key === "tags") {
      const tags = value as string[]
      setMetadata((prev) => ({ ...prev, tags: tags }))
      await addToPresetTags(presetTagList, tags)
    }
  }

  return (
    <div className="h-dvh flex flex-col p-0 font-sans bg-white">
      <div className="flex-none flex items-center justify-end p-2">
        {isSidePanel && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={extractPageData}>
                <RotateCw />
                <span className="sr-only">Refresh</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Refresh</TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                browser.runtime.openOptionsPage()
              }}>
              <Settings className="h-4 w-4" />
              <span className="sr-only">Settings</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Settings</TooltipContent>
        </Tooltip>
      </div>
      <div className="flex-none px-1">
        <Collapsible open={isMetadataExpanded} onOpenChange={setIsMetadataExpanded}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="default"
              className="px-2 py-3 h-6 font-medium hover:bg-transparent hover:shadow-none focus:shadow-none active:shadow-none">
              Metadata
              {isMetadataExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="p-1">
            <div className="flex flex-col">
              {metadata &&
                Object.entries(metadata).map(([key, value]) => {
                  const Icon = getMetadataIcon(key)
                  return (
                    <div
                      key={key}
                      className="flex items-center text-slate-500 rounded hover:ring-2 hover:ring-gray-300">
                      <div className="flex items-center gap-1 pl-2">
                        <Icon strokeWidth={1.75} className="h-4 w-4" />
                        <Label htmlFor={key} className="w-20 text-left text-xs">
                          {key}
                        </Label>
                      </div>
                      {key === "tags" ? (
                        <MultipleSelector
                          className=" py-1 text-slate-700 rounded-none border-none shadow-none focus:border-none focus-within:ring-0 focus-visible:ring-0"
                          badgeClassName="px-1 text-slate-700 font-normal bg-white border-2 hover:ring-2"
                          options={presetTagList?.map((v: string) => {
                            return { label: v, value: v } as Option
                          })}
                          value={value?.map((v: string) => {
                            return { label: v, value: v } as Option
                          })}
                          placeholder="Select or create tags..."
                          creatable
                          hideClearAllButton
                          onChange={(options) =>
                            handleMetadataChange(
                              key,
                              options
                                .map((option) => sanitizeAlphaNumeric(option.value))
                                .filter((x: string) => x !== "")
                            )
                          }
                          emptyIndicator={<p className="text-center text-xs text-slate-700">Select or create tags</p>}
                        />
                      ) : (
                        <Input
                          id={key}
                          value={value}
                          onChange={(e) => handleMetadataChange(key, e.target.value)}
                          className="flex-auto h-6 w-auto m-0 px-1 text-xs text-slate-700 rounded-none border-none shadow-none focus-visible:ring-0 hover:bg-gray-100"
                        />
                      )}
                    </div>
                  )
                })}
              <div>
                <LLM
                  presetTags={presetTagList}
                  metadata={metadata}
                  content={content}
                  onValueChange={handleMetadataChange}
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      <div className="flex-1 flex flex-col grow my-2">
        <div className="px-3 py-2 flex-none">
          <span className="font-medium text-sm">Content</span>
        </div>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 grow h-full text-slate-700 resize-none shadow-none focus-visible:ring-0 border-y border-x-0 focus:bg-gray-50"
        />
      </div>

      {shareErrorMessage && <p className="text-destructive p-2 px-4 whitespace-break-spaces">{shareErrorMessage}</p>}

      <div className="flex-none flex gap-2 m-2 mx-auto ">
        <TooltipProvider>
          <ButtonGroup className="rounded-lgZ">
            <CopyButton
              value={JSON.stringify(metadata || {})}
              icon={<FileJson />}
              tooltip="Copy Metadata"
              hideText={isMobile || !isSidePanel}
            />
            <CopyButton
              value={content}
              icon={<FileText />}
              tooltip="Copy Content"
              hideText={isMobile || !isSidePanel}
            />
            <CopyButton
              value={`[${metadata.title || ""}](${metadata.url || ""})`}
              icon={<Link2 />}
              tooltip="Copy Title and URL"
              hideText={isMobile || !isSidePanel}
            />
          </ButtonGroup>
          <Share metadata={metadata} content={content} showErrorMessage={(msg) => setShareErrorMessage(msg)} />
        </TooltipProvider>
      </div>
    </div>
  )
}

export default App
