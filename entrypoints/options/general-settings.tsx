import { BooleanEx } from "@/components/expansions/form-components.tsx"
import { Label } from "@/components/ui/label.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx"
import { Separator } from "@/components/ui/separator.tsx"
import { resolveLanguage, supportedLanguageMapping } from "@/lib/language"
import { GeneralConfig, generalConfigInStorage } from "@/lib/storage/general.ts"
import i18next from "i18next"
import * as React from "react"
import { useTranslation } from "react-i18next"

interface GeneralConfigDescSpec {
  [key: string]: Record<string, string>
}

export default function GeneralSettings() {
  const { t } = useTranslation()
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

  const GeneralConfigDesc: GeneralConfigDescSpec = {
    llm: {
      overwriteTitle: t("settings.general.overwriteTitle"),
      overwriteDescription: t("settings.general.overwriteDescription"),
      mergeTags: t("settings.general.mergeTags")
    }
  }

  const loadSettings = async () => {
    const data = await generalConfigInStorage.getValue()
    setConfig(data)
  }

  const handleLLMConfigChange = async (key: string, value: any) => {
    if (config && value !== undefined) {
      const newConfig = { ...config, llm: { ...config.llm, [key]: value } }
      setConfig(newConfig)
      await generalConfigInStorage.setValue(newConfig)
    }
  }

  const handleUILanguageChange = async (value: string) => {
    const language = resolveLanguage(value)
    await i18next.changeLanguage(language)
    if (config) {
      const newConfig = { ...config, language: value }
      setConfig(newConfig)
      await generalConfigInStorage.setValue(newConfig)
    }
  }

  const handleLLMLanguageChange = async (value: string) => {
    if (config) {
      const newConfig = { ...config, llmLanguage: value }
      setConfig(newConfig)
      await generalConfigInStorage.setValue(newConfig)
    }
  }

  return (
    <div className="w-full mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold my-4">{t("settings.general.title")}</h1>
      </div>
      <div className="space-y-4">
        <Label className="text-base font-medium">{t("settings.general.language")}</Label>
        <div className="space-y-1 max-w-lg">
          <div className="flex items-center justify-between">
            <Label className="flex items-center text-sm text-gray-500">{t("settings.general.UILanguage")}</Label>
            <Select value={config?.language ?? "system"} onValueChange={handleUILanguageChange}>
              <SelectTrigger className="w-[150px] h-8">
                <SelectValue placeholder={t("settings.general.selectLanguage")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="system" value="system">
                  {t("settings.general.followSystem")}
                </SelectItem>
                {Object.entries(supportedLanguageMapping).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label className="flex items-center text-sm text-gray-500">{t("settings.general.LLMLanguage")}</Label>
            <Select value={config?.llmLanguage ?? "system"} onValueChange={handleLLMLanguageChange}>
              <SelectTrigger className="w-[150px] h-8">
                <SelectValue placeholder={t("settings.general.selectLanguage")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="system" value="system">
                  {t("settings.general.followSystem")}
                </SelectItem>
                {Object.entries(supportedLanguageMapping).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Separator />
        <div className="space-y-4 max-w-lg">
          <Label className="text-base font-medium">{t("settings.tags.presetTags")}</Label>
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
          </div>
        </div>
      </div>
    </div>
  )
}
