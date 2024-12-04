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
import { CheckIcon, Send } from "lucide-react"
import React from "react"

export default function Share({
  metadata,
  content,
  showErrorMessage
}: {
  metadata: PageMetadata
  content: string
  showErrorMessage: (msg: string) => void
}) {
  const [shareChannels, setShareChannels] = React.useState<ShareChannel[]>([])
  const [hasShared, setHasShared] = React.useState(false)
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
    const msg = await sendRequest(channel, metadata, content)
    if (msg) {
      console.error(msg)
      showErrorMessage(msg)
      return
    }
    setHasShared(true)
  }

  return (
    <>
      {shareChannels.length === 0 ? (
        <></>
      ) : shareChannels.length == 1 ? (
        <Button onClick={() => share(shareChannels[0])}>{hasShared ? <CheckIcon /> : <Send />}Share</Button>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>{hasShared ? <CheckIcon /> : <Send />}Share</Button>
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
