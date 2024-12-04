import { storage } from "wxt/storage"

export interface ShareChannel {
  id: string
  title: string
  enabled: boolean
  description: string
  template?: string
  properties: ShareChannelProperties
}

export interface ShareChannelProperties {
  [key: string]: {
    type: string
    desc: string
    value: any
  }
}

const defaultShareSettings: ShareChannel[] = [
  {
    id: crypto.randomUUID(),
    title: "Wise Favorites Worker",
    enabled: false,
    description: "Wise Favorites Worker API, https://github.com/ethan4768/wise-favorites-worker",
    template: "wise-favorites-worker",
    properties: {
      "Base Path": {
        type: "text",
        desc: "wise favorites worker address",
        value: ""
      },
      "API Token": {
        type: "text",
        desc: "BEARER token",
        value: ""
      }
    }
  },
  {
    id: crypto.randomUUID(),
    title: "Telegram Channel",
    enabled: false,
    description: "send message to telegram channel with telegram bot, https://core.telegram.org/bots/api",
    template: "telegram-channel",
    properties: {
      "Channel ID": {
        type: "text",
        desc: "If the channel is public, the id is its username (e.g., @mychannel);\nIf the channel is private, you need to use some tools or API to get its id.",
        value: ""
      },
      "Bot Token": {
        type: "text",
        desc: "Create a Bot with BotFather, and BotFather will provide a token.",
        value: ""
      },
      "Fix X/Twitter Embeds": {
        type: "boolean",
        desc: "Fix X/Twitter embeds with https://github.com/FixTweet/FxTwitter",
        value: true
      }
    }
  }
]

export const shareSettingsInStorage = storage.defineItem<ShareChannel[]>("local:shareChannels", {
  init: () => {
    return defaultShareSettings
  }
})

export async function getEnabledShareChannels(): Promise<ShareChannel[]> {
  const channels = await shareSettingsInStorage.getValue()
  return channels.filter((channel) => channel.enabled)
}

export async function resetShareChannels(): Promise<void> {
  await shareSettingsInStorage.setValue(defaultShareSettings)
}
