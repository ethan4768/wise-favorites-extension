import { storage } from "wxt/storage"

export interface GeneralConfig {
  language: string
  llmLanguage: string
  llm: LLMConfig
}

export interface LLMConfig {
  overwriteTitle: boolean
  overwriteDescription: boolean
  mergeTags: boolean
}

export const defaultGeneralConfig: GeneralConfig = {
  language: "system",
  llmLanguage: "system",
  llm: {
    overwriteTitle: true,
    overwriteDescription: true,
    mergeTags: true
  }
}

export const generalConfigInStorage = storage.defineItem<GeneralConfig>("local:general", {
  init: () => {
    return defaultGeneralConfig
  }
})
