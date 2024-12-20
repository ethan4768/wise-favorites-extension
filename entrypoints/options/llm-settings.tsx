import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Label } from "@/components/ui/label.tsx"
import { OpenAIConfig, openAIConfigInStorage } from "@/lib/storage/llm.ts"
import { AlertCircle, CheckIcon, SaveAll } from "lucide-react"
import * as React from "react"
import { useTranslation } from "react-i18next"

export default function LLMSettings() {
  const { t } = useTranslation()
  const [config, setConfig] = React.useState<OpenAIConfig>({
    apiKey: "",
    basePath: "",
    model: ""
  })
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
    const data = await openAIConfigInStorage.getValue()
    setConfig(data)
  }

  const handleConfigChange = (key: string, value: string) => {
    setConfig({ ...config, [key]: value })
  }

  const saveConfig = async () => {
    await openAIConfigInStorage.setValue(config)
    setHasSaved(true)
    await loadSettings()
  }

  return (
    <div className="w-full mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold my-4">{t("settings.llm.title")}</h1>
        <div className="text-sm text-gray-800">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t("settings.llm.warn.level")}</AlertTitle>
            <AlertDescription>
              <strong>{t("settings.llm.warn.title")} </strong>
              <br />
              {t("settings.llm.warn.message")} <br />
            </AlertDescription>
          </Alert>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="basePath">{t("settings.llm.openAI.basePath")}</Label>
          <div className="flex space-x-2">
            <Input
              id="basePath"
              type="text"
              value={config.basePath}
              onChange={(e) => handleConfigChange("basePath", e.target.value)}
              className="flex-grow"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="apiKey">{t("settings.llm.apiKey")}</Label>
          <div className="flex space-x-2">
            <Input
              id="apiKey"
              type="password"
              value={config.apiKey}
              onChange={(e) => handleConfigChange("apiKey", e.target.value)}
              className="flex-grow"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="model">{t("settings.llm.model")}</Label>
          <div className="flex space-x-2">
            <Input
              id="model"
              type="text"
              value={config.model}
              onChange={(e) => handleConfigChange("model", e.target.value)}
              className="flex-grow"
            />
          </div>
        </div>
        <div>
          <Button variant="default" onClick={saveConfig}>
            {hasSaved ? <CheckIcon /> : <SaveAll />}
            {t("settings.llm.save")}
          </Button>
        </div>
      </div>
    </div>
  )
}
