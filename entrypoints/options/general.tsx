import { BooleanEx } from "@/components/expansions/form-components.tsx"
import { Button } from "@/components/ui/button.tsx"
import { GeneralConfig, GeneralConfigDesc, generalConfigInStorage } from "@/lib/storage/general.ts"
import { CheckIcon, SaveAll } from "lucide-react"
import * as React from "react"

export default function GeneralSettings() {
  const [config, setConfig] = React.useState<GeneralConfig>()
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
    const data = await generalConfigInStorage.getValue()
    setConfig(data)
  }

  const handleLLMConfigChange = (key: string, value: any) => {
    if (config && value !== undefined) {
      setConfig({ ...config, llm: { ...config?.llm, [key]: value } })
    }
  }

  const saveConfig = async () => {
    if (config) {
      await generalConfigInStorage.setValue(config)
      setHasSaved(true)
      await loadSettings()
    }
  }

  return (
    <div className="w-full mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold my-4">General Settings</h1>
        <div className="text-sm text-gray-800"></div>
      </div>

      <div className="space-y-2">
        {config &&
          Object.entries(config.llm).map(([key, value]) => (
            <BooleanEx
              key={key}
              label={GeneralConfigDesc.llm[key]}
              item={key}
              defaultValue={value}
              onValueChange={handleLLMConfigChange}
            />
          ))}
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
