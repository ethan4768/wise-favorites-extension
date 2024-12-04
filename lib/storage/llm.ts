import { storage } from "wxt/storage"

export interface OpenAIConfig {
  apiKey: string
  basePath: string
  model: string
}

export const defaultOpenAIConfig: OpenAIConfig = {
  apiKey: "",
  model: "gpt-4o-mini",
  basePath: "https://api.openai.com/v1"
}

export const openAIConfigInStorage = storage.defineItem<OpenAIConfig>("local:openai", {
  init: () => {
    return defaultOpenAIConfig
  }
})
