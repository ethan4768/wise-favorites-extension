import { AutosizeTextarea } from "@/components/expansions/autosize-textarea.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Label } from "@/components/ui/label.tsx"
import { getPresetTagList, setPresetTagsFromString } from "@/lib/storage/tags.ts"
import { CheckIcon, SaveAll } from "lucide-react"
import * as React from "react"
import { Link } from "wouter"

export default function TagSettings() {
  const [presetTags, setPresetTags] = React.useState<string>("")
  const [hasSaved, setHasSaved] = React.useState(false)
  React.useEffect(() => {
    ;(async () => {
      await loadSettings()
    })()
  }, [])
  React.useEffect(() => {
    setTimeout(() => {
      setHasSaved(false)
    }, 2000)
  }, [hasSaved])

  const loadSettings = async () => {
    const data = await getPresetTagList()
    setPresetTags(data.join("\n"))
  }

  const saveConfig = async () => {
    await setPresetTagsFromString(presetTags)
    setHasSaved(true)
    await loadSettings()
  }

  return (
    <div className="w-full mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold my-4">Tags Configuration</h1>
        <div className="text-sm text-gray-800">
          <p>- Shown in metadata</p>
          <p>
            - You can use LLM to generate tags automatically, go to{" "}
            <Link to="/llm" className="underline text-blue-700">
              LLM Settings
            </Link>
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="preset-tags">Preset Tags</Label>
          <div>
            <p> - one tag per line</p>
            <p> - will keep only letters and numbers</p>
          </div>
          <div className="flex space-x-2">
            <AutosizeTextarea
              id="preset-tags"
              value={presetTags}
              onChange={(e) => {
                setPresetTags(e.target.value)
              }}
              className="focus-visible:ring-1 "
            />
          </div>
        </div>
        <div>
          <Button variant="default" onClick={saveConfig}>
            {hasSaved ? <CheckIcon /> : <SaveAll />}
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}
