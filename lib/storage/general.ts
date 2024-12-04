import { storage } from "wxt/storage"

export interface GeneralConfig {
  llm: LLMConfig
}

export interface LLMConfig {
  overwriteTitle: boolean
  overwriteDescription: boolean
  mergeTags: boolean
}

interface GeneralConfigDescSpec {
  [key: string]: Record<string, string>
}

export const GeneralConfigDesc: GeneralConfigDescSpec = {
  llm: {
    overwriteTitle: "Overwrite title with AI result",
    overwriteDescription: "Overwrite description with AI result",
    mergeTags: "Merge tags with AI result"
  }
}

export const defaultGeneralConfig: GeneralConfig = {
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
