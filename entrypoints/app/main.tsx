import { TooltipProvider } from "@/components/ui/tooltip.tsx"
import React from "react"
import ReactDOM from "react-dom/client"
import App from "./app.tsx"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TooltipProvider>
      <App />
    </TooltipProvider>
  </React.StrictMode>
)
