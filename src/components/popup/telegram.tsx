import axios from "axios"
import { useState } from "react"
import { PiTelegramLogo } from "react-icons/pi"

import { Button } from "~components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~components/ui/tooltip"

export default function Telegram(props) {
  const { title, url, setError } = props
  const [shared, setShared] = useState(false)

  async function shareToTelegram() {
    const items = await chrome.storage.sync.get("config.telegram")
    const telegramConfig = items["config.telegram"]
    let channelId = telegramConfig && telegramConfig["channel_id"]
    let botToken = telegramConfig && telegramConfig["bot_token"]
    if (!channelId || !botToken) {
      setError("缺少配置项")
      return
    }

    const text = `${title}\nURL: ${url}`
    const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`
    axios
      .post(apiUrl, {
        chat_id: channelId,
        text: text
      })
      .then((response) => {
        setShared(true)
        setTimeout(() => {
          setShared(false)
        }, 800)
      })
      .catch((error) => {
        console.error(error)
        setError(`请求失败，${error}`)
      })
  }

  return (
    <div>
      <TooltipProvider>
        <Tooltip open={shared}>
          <TooltipTrigger asChild>
            <Button size="sm" variant="outline" className="bg-gray-100 hover:bg-gray-200" onClick={shareToTelegram}>
              <PiTelegramLogo size={16} className="mr-1" />
              {"Share(Telegram)"}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Shared!</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
