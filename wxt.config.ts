import { defineConfig } from "wxt"


// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react", "@wxt-dev/auto-icons"],
  extensionApi: "chrome",
  manifest: {
    name: "wise favorites extension",
    permissions: ["activeTab", "storage"],
    action: {}
  }
})
