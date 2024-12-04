import { Button } from "@/components/ui/button.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Label } from "@/components/ui/label.tsx"
import { OpenAIConfig, openAIConfigInStorage } from "@/lib/storage/llm.ts"
import { CheckIcon, SaveAll } from "lucide-react"
import * as React from "react"
import { AlertCircle } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
export default function LLMSettings() {
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
        <h1 className="text-2xl font-semibold my-4">OpenAI Configuration</h1>
        <div className="text-sm text-gray-800">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4"/>
            <AlertTitle>WARN</AlertTitle>
            <AlertDescription>
              <strong>It risks exposing your secret API credentials to attackers. </strong><br/>
              Exposing your OpenAI API key in client-side environments like browsers or mobile apps allows malicious users to take that key and make requests on your behalf – which may lead to unexpected charges or compromise of certain account data. <br/>
              Check <a href="https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety" target="_blank" className="underline text-blue-500">Best Practices for API Key Safety | OpenAI Help Center</a>
            </AlertDescription>
          </Alert>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="basePath">Base Path</Label>
          <div className="flex space-x-2">
            <Input
              id="basePath"
              type="text"
              value={config.basePath}
              onChange={(e) => handleConfigChange("basePath", e.target.value)}
              placeholder="Enter the base path for API requests"
              className="flex-grow"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="apiKey">API Key</Label>
          <div className="flex space-x-2">
            <Input
              id="apiKey"
              type="password"
              value={config.apiKey}
              onChange={(e) => handleConfigChange("apiKey", e.target.value)}
              placeholder="Enter your OpenAI API key"
              className="flex-grow"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <div className="flex space-x-2">
            <Input
              id="model"
              type="text"
              value={config.model}
              onChange={(e) => handleConfigChange("model", e.target.value)}
              placeholder="Enter model"
              className="flex-grow"
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
