import { extractPageData } from "@/lib/content-extractor.ts"

export default defineContentScript({
  matches: ["http://*/*", "https://*/*"],
  async main(ctx) {
    if (ctx.isInvalid) {
      return
    }

    browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
      ;(async () => {
        if (request.action === "extractPageData") {
          const res = await extractPageData()
          sendResponse(res)
        }
      })()
      return true
    })
  }
})
