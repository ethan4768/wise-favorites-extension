import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true
}

async function copyToClipboard(text: string) {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text)
  } else {
    const tmp = document.createElement("textarea")
    tmp.value = text
    tmp.style.opacity = "0"

    const focus = document.activeElement as HTMLElement

    document.body.appendChild(tmp)
    tmp.select()
    document.execCommand("copy")
    document.body.removeChild(tmp)
    focus.focus()
  }
}

// 监听来自背景脚本的消息
chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  if (request.action == "copyTabUrlAsMarkdown") {
    await copyToClipboard(request.text)
    sendResponse(`copied: ${request.text}`)
  }
})
