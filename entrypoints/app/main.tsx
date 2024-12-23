import initializeI18n from "@/lib/i18n/i18n"
import React, { Suspense } from "react"
import ReactDOM from "react-dom/client"
import { I18nextProvider } from "react-i18next"
import App from "./app.tsx"
import { TooltipProvider } from "@/components/ui/tooltip.tsx"
import { i18n } from "i18next"

initializeI18n()
  .then((i18nInstance: i18n) => {
    const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
    root.render(
      <React.StrictMode>
        <Suspense fallback={<div>Loading translations...</div>}>
          <I18nextProvider i18n={i18nInstance}>
            <TooltipProvider>
              <App />
            </TooltipProvider>
          </I18nextProvider>
        </Suspense>
      </React.StrictMode>
    )
  })
  .catch((error: any) => {
    console.error("Failed to initialize i18n", error)
  })
