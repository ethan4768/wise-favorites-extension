import { generalConfigInStorage } from "@/lib/storage/general.ts"

export const fallbackLanguage = "en"
export const supportedLanguageMapping: Record<string, string> = {
  "en": "English",
  "zh-CN": "简体中文"
}
export const supportedLanguages = Object.keys(supportedLanguageMapping).sort()

async function getUserLanguageSetting(): Promise<string> {
  const config = await generalConfigInStorage.getValue()
  return config.language
}

function getSystemLanguage(): string {
  return navigator.language || "en-US"
}

export function normalizeLanguage(langCode: string): string {
  const [lang, region] = langCode.split("-")
  if (lang === "zh") {
    return region ? `${lang}-${region}` : "zh-CN"
  }
  return lang
}

export async function detectLanguage(): Promise<string> {
  const userLanguage = await getUserLanguageSetting()
  if (!userLanguage || userLanguage.toLowerCase() === "system") {
    return getSystemLanguage()
  }
  return normalizeLanguage(userLanguage)
}

export function resolveLanguage(language: string): string {
  const lng = language && language.toLowerCase() !== "system" ? language : getSystemLanguage()
  return normalizeLanguage(lng)
}
