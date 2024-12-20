import { useTranslation } from "react-i18next"

export default function About() {
  const { t } = useTranslation()
  return (
    <div className="w-full mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold my-4">{t("settings.about.title")}</h1>
      </div>
      <div className="flex flex-col">
        <a
          target="_blank"
          href="https://github.com/ethan4768/wise-favorites-extension"
          className="cursor-pointer underline underline-offset-2 text-blue-600">
          https://github.com/ethan4768/wise-favorites-extension
        </a>
      </div>
    </div>
  )
}
