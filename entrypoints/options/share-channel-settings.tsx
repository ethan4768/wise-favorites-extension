import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator.tsx"
import { Switch } from "@/components/ui/switch"
import { resetShareChannels, ShareChannel, shareSettingsInStorage } from "@/lib/storage/share-channels.ts"
import { CheckIcon, CircleAlert, SaveAll } from "lucide-react"
import React from "react"

export default function ShareChannelSettings() {
  const [shareSettingItems, setShareSettingItems] = React.useState<ShareChannel[]>([])
  const [selectedItem, setSelectedItem] = React.useState<ShareChannel | null>(null)
  const [hasSaved, setHasSaved] = React.useState(false)
  const [hasBeanRest, setHasBeanRest] = React.useState(false)

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
  React.useEffect(() => {
    setTimeout(() => {
      setHasBeanRest(false)
    }, 2000)
  }, [hasBeanRest])

  const loadSettings = async () => {
    const data = await shareSettingsInStorage.getValue()
    setShareSettingItems(data)
  }

  const saveSettings = async (items: ShareChannel[]) => {
    await shareSettingsInStorage.setValue(items)
  }

  const resetSettings = async () => {
    await resetShareChannels()
    setHasBeanRest(true)
    await loadSettings()
  }

  const handleSwitchChange = async (id: string) => {
    const nw = shareSettingItems.map((item) =>
      item.id === id
        ? {
            ...item,
            enabled: !item.enabled
          }
        : item
    )
    setShareSettingItems(nw)
    await saveSettings(nw)
  }

  const handleItemClick = (item: ShareChannel) => {
    setSelectedItem(item)
  }

  const updateSelectedItemSettings = (key: string, newValue: any) => {
    if (selectedItem) {
      setSelectedItem({
        ...selectedItem,
        properties: {
          ...selectedItem.properties,
          [key]: {
            ...selectedItem.properties[key],
            value: newValue
          }
        }
      })
    }
  }

  const handleSelectedItemSettingsSave = async () => {
    if (selectedItem) {
      const nw = shareSettingItems.map((item) => (item.id === selectedItem.id ? selectedItem : item))
      setShareSettingItems(nw)
      await saveSettings(nw)
      setHasSaved(true)
    }
  }

  return (
    <div className="w-full mx-auto">
      <div className="mb-8 space-y-2">
        <h1 className="text-2xl font-semibold my-4">Share Channels</h1>
        <p className="text-sm text-gray-800">
          - Send request to enabled channels. <br />- More templates or custom your own channel.{" "}
          <strong>coming soon</strong> <br />
        </p>
        <Button
          size="sm"
          variant="outline"
          className="border-red-500 text-red-500 bg-transparent transition-colors duration-300 hover:bg-red-500 hover:text-white"
          onClick={resetSettings}>
          {hasBeanRest ? <CheckIcon /> : <CircleAlert />}
          Reset Settings
        </Button>
      </div>
      <div className="flex h-full">
        <div className="w-1/3 border-r pr-4">
          {shareSettingItems.length > 0 &&
            shareSettingItems.map((item) => (
              <Card
                key={item.id}
                className="mb-4 cursor-pointer hover:bg-accent "
                onClick={() => handleItemClick(item)}>
                <CardHeader className="space-y-1 p-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                    <Switch
                      checked={item.enabled}
                      onCheckedChange={() => handleSwitchChange(item.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <CardDescription className="text-xs text-muted-foreground break-words">
                    {item.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
        </div>
        <div className="w-2/3 pl-4 pr-2">
          {selectedItem && (
            <div>
              <h2 className="text-lg font-bold">{selectedItem.title} Configuration</h2>
              <p className="text-sm pt-2">{selectedItem.description}</p>
              <Separator className="my-5" />
              <div className="space-y-4">
                {Object.entries(selectedItem.properties).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={key}>{key}</Label>
                    <p className="whitespace-break-spaces">{value.desc}</p>
                    {["text", "input"].includes(value.type) ? (
                      <Input
                        id={key}
                        value={value.value}
                        onChange={(e) => updateSelectedItemSettings(key, e.target.value)}
                      />
                    ) : value.type === "boolean" ? (
                      <Switch
                        id={key}
                        checked={value.value}
                        onCheckedChange={(checked) => updateSelectedItemSettings(key, checked)}
                      />
                    ) : null}
                  </div>
                ))}
                <Button variant="default" onClick={handleSelectedItemSettingsSave}>
                  {hasSaved ? <CheckIcon /> : <SaveAll />}Save
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
