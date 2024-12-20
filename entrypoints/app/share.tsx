import { Button } from "@/components/ui/button.tsx"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx"
import { sendRequest } from "@/lib/request.ts"
import { getEnabledShareChannels, ShareChannel } from "@/lib/storage/share-channels.ts"
import { PageMetadata } from "@/lib/types.ts"
import { CheckIcon, Loader2, Send } from "lucide-react"
import React from "react"
import { useTranslation } from "react-i18next"

export default function Share({
  metadata,
  content,
  showErrorMessage
}: {
  metadata: PageMetadata
  content: string
  showErrorMessage: (msg: string) => void
}) {
  const { t } = useTranslation()
  const [shareChannels, setShareChannels] = React.useState<ShareChannel[]>([])
  const [hasShared, setHasShared] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  React.useEffect(() => {
    setTimeout(() => {
      setHasShared(false)
    }, 2000)
  }, [hasShared])

  React.useEffect(() => {
    ;(async () => {
      const channels = await getEnabledShareChannels()
      setShareChannels(channels)
    })()
  }, [])

  const share = async (channel: ShareChannel) => {
    showErrorMessage("")
    setIsLoading(true)
    const msg = await sendRequest(channel, metadata, content)
    if (msg) {
      console.error(msg)
      showErrorMessage(msg)
      setIsLoading(false)
      return
    }
    setIsLoading(false)
    setHasShared(true)
  }

  const sendIcon = isLoading ? <Loader2 className="animate-spin" /> : hasShared ? <CheckIcon /> : <Send />

  return (
    <>
      {shareChannels.length === 0 ? (
        <></>
      ) : shareChannels.length == 1 ? (
        <Button disabled={isLoading} onClick={() => share(shareChannels[0])}>
          {sendIcon}
          {t("app.share")}
        </Button>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button disabled={isLoading}>
              {sendIcon}
              {t("app.share")}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {shareChannels.map((channel) => (
              <DropdownMenuItem key={channel.id} onSelect={() => share(channel)}>
                {channel.title}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  )
}
