import { resources } from "@/lib/i18n/resources.ts"
import { detectLanguage, fallbackLanguage, supportedLanguages } from "@/lib/language.ts"
import i18next from "i18next"
import { initReactI18next } from "react-i18next"

async function initializeI18n() {
  const userLanguage = await detectLanguage()

  await i18next.use(initReactI18next).init({
    lng: userLanguage,
    supportedLngs: supportedLanguages,
    fallbackLng: fallbackLanguage,
    resources,
    interpolation: {
      escapeValue: false
    }
  })

  return i18next
}

export default initializeI18n
