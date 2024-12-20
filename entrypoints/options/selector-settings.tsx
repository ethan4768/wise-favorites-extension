import { ButtonGroup } from "@/components/expansions/button-group.tsx"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SelectorSettingItems, selectorSettingsInStorage } from "@/lib/storage/selectors.ts"
import { CheckIcon, CirclePlus, ListPlus, SaveAll, Trash2, TrashIcon } from "lucide-react"
import * as React from "react"
import { useTranslation } from "react-i18next"

interface SelectorItems {
  id: string
  key: string
  values: string[]
  error?: string
}

interface PageSelectorsSectionProps {
  selectorItems: SelectorItems
  onDelete: (id: string) => void
  onChange: (id: string, key: string, values: string[]) => void
}

function PageSelectorsSection({ selectorItems, onDelete, onChange }: PageSelectorsSectionProps) {
  const { t } = useTranslation()
  const addValue = () => {
    onChange(selectorItems.id, selectorItems.key, [...selectorItems.values, ""])
  }

  const updateValue = (index: number, newValue: string) => {
    const newValues = [...selectorItems.values]
    newValues[index] = newValue
    onChange(selectorItems.id, selectorItems.key, newValues)
  }

  const removeValue = (index: number) => {
    const newValues = selectorItems.values.filter((_, i) => i !== index)
    onChange(selectorItems.id, selectorItems.key, newValues)
  }

  return (
    <div className="flex items-start gap-2 py-1 rounded-md">
      <div className="w-8 flex-none items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(selectorItems.id)}
          className="h-8 text-muted-foreground hover:text-foreground">
          <TrashIcon className="h-4 w-4" />
          <span className="sr-only">{t("settings.selector.deleteSelectors")}</span>
        </Button>
      </div>
      <div className="flex-1 flex gap-2">
        <div className="min-w-32 max-w-64 flex-1 ">
          <Input
            id={`key-${selectorItems.id}`}
            value={selectorItems.key}
            className="h-8 m-0 px-2 text-sm text-slate-700 focus-visible:ring-0 focus:border-2 focus:border-gray-300"
            onChange={(e) => onChange(selectorItems.id, e.target.value, selectorItems.values)}
            placeholder="hostname"
          />
          {selectorItems.error && <p className="mt-2 text-sm text-red-500">{selectorItems.error}</p>}
        </div>
        <div className="w-auto flex-1 grow space-y-1">
          {selectorItems.values.map((value, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                id={`value-${selectorItems.id}-${index}`}
                value={value}
                onChange={(e) => updateValue(index, e.target.value)}
                placeholder="selector"
                className="flex-1 h-8 w-auto m-0 px-2 text-sm text-slate-700 focus-visible:ring-0 focus:border-2 focus:border-gray-300"
              />
              <ButtonGroup>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => removeValue(index)}
                  className="h-8 text-muted-foreground hover:text-foreground ">
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">{t("settings.selector.removeSelector")}</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={addValue}
                  className="h-8 text-muted-foreground hover:text-foreground">
                  <CirclePlus className="h-4 w-4" />
                  <span className="sr-only">{t("settings.selector.addSelector")}</span>
                </Button>
              </ButtonGroup>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function SelectorSettings() {
  const { t } = useTranslation()
  const [hasSaved, setHasSaved] = React.useState(false)
  const [selectorItems, setSelectorItems] = React.useState<SelectorItems[]>([])
  React.useEffect(() => {
    setTimeout(() => {
      setHasSaved(false)
    }, 2000)
  }, [hasSaved])
  React.useEffect(() => {
    ;(async () => {
      await loadSettings()
    })()
  }, [])

  const loadSettings = async () => {
    const data = await selectorSettingsInStorage.getValue()
    const props = Object.entries(data).map(([key, value]) => ({
      id: crypto.randomUUID(),
      key: key,
      values: value
    }))
    setSelectorItems(props)
  }

  const validateItem = (item: SelectorItems): string | undefined => {
    if (!item.key.trim()) {
      return t("settings.selector.hostnameCannotBeEmpty")
    }
    const values = item.values
    if (!values || values.length === 0) {
      return t("settings.selector.selectorsCannotBeEmpty")
    }
    if (values.some((v) => !v.trim())) {
      return t("settings.selector.selectorCannotBeEmpty")
    }
    return undefined
  }

  const savePageSelectors = async () => {
    // Validate all items before saving
    const newItems = selectorItems.map((item) => ({
      ...item,
      error: validateItem(item)
    }))
    setSelectorItems(newItems)

    // Check if there are any errors
    if (newItems.some((item) => item.error)) {
      return
    }

    const selectors = selectorItems.reduce((acc: SelectorSettingItems, currentPageSelectors: SelectorItems) => {
      acc[currentPageSelectors.key] = [...(acc[currentPageSelectors.key] || []), ...currentPageSelectors.values]
      return acc
    }, {})
    await selectorSettingsInStorage.setValue(selectors)
    setHasSaved(true)
    await loadSettings()
  }

  const addPageSelector = () => {
    const newProperty = {
      id: crypto.randomUUID(),
      key: "",
      values: [""]
    }
    setSelectorItems([...selectorItems, newProperty])
  }

  const deletePageSelector = (id: string) => {
    setSelectorItems(selectorItems.filter((p) => p.id !== id))
  }

  const updatePageSelector = (id: string, key: string, values: string[]) => {
    if (!values || values.length === 0) {
      deletePageSelector(id)
      return
    }
    setSelectorItems(selectorItems.map((p) => (p.id === id ? { ...p, key, values } : p)))
  }

  return (
    <div className="w-full mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold my-4">{t("settings.selector.title")}</h1>
        <p className="text-sm text-gray-800 whitespace-break-spaces">
          {t("settings.selector.tips")}
          <br />
          {t("settings.selector.supportedSelectors")}
          <a
            target="_blank"
            href="https://github.com/fb55/css-select/blob/master/README.md#supported-selectors"
            className="cursor-pointer underline underline-offset-2 text-blue-500 hover:text-blue-700 transition duration-300">
            https://github.com/fb55/css-select/blob/master/README.md#supported-selectors
          </a>
        </p>
      </div>
      {selectorItems.map((property) => (
        <PageSelectorsSection
          key={property.id}
          selectorItems={property}
          onDelete={deletePageSelector}
          onChange={updatePageSelector}
        />
      ))}
      <div className="flex gap-1 mt-4 text-sm text-muted-foreground">
        <Button variant="default" onClick={addPageSelector} className="justify-items-end">
          <ListPlus />
          {t("settings.selector.addSelector")}
        </Button>
        <Button variant="default" onClick={savePageSelectors}>
          {hasSaved ? <CheckIcon /> : <SaveAll />}
          {t("settings.selector.save")}
        </Button>
      </div>
    </div>
  )
}
