import { ShareChannel } from "@/lib/storage/share-channels.ts"
import { PageMetadata } from "@/lib/types.ts"
import superagent from "superagent"

export const sendRequest = (channel: ShareChannel, metadata: PageMetadata, content: string): Promise<string | null> => {
  if (channel.template === "wise-favorites-worker") {
    return sendToWiseFavoritesWorker(channel, metadata, content)
  } else if (channel.template === "telegram-channel") {
    return sendToTelegramChannel(channel, metadata)
  }
  return Promise.resolve("No template found.")
}

export const sendToWiseFavoritesWorker = async (
  channel: ShareChannel,
  properties: {},
  content: string
): Promise<string | null> => {
  const basePath: string = channel.properties["Base Path"]?.value
  const bearToken: string = channel.properties["API Token"]?.value
  if (!basePath || !bearToken) {
    return Promise.resolve("Invalid base path or api token")
  }

  try {
    const res = await superagent
      .post(channel.properties["Base Path"].value)
      .type("json")
      .set("Authorization", `Bearer ${bearToken}`)
      .send({ ...properties, content: content, options: { arsp: false, share: { github: true, telegram: false } } })

    if (!res.ok) {
      return `Cannot send request to ${basePath}:\n ${res.body.msg}`
    }
    return null
  } catch (err) {
    // @ts-ignore
    return `Cannot send request to ${basePath}:\n ${err.message}`
  }
}

export const sendToTelegramChannel = async (channel: ShareChannel, metadata: PageMetadata): Promise<string | null> => {
  const channelId: string = channel.properties["Channel ID"]?.value
  const botToken: string = channel.properties["Bot Token"]?.value
  if (!channelId || !botToken) {
    return Promise.resolve("Invalid channel id or bot token")
  }

  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`
    const res = await superagent
      .post(url)
      .type("json")
      .send({
        chat_id: channelId,
        parse_mode: "MarkdownV2",
        text: toTelegramFormat(channel, metadata)
      })

    if (!res.ok) {
      return `Cannot send request to telegram:\n ${res.body.msg}`
    }
    return null
  } catch (err) {
    // @ts-ignore
    return `Cannot send request to telegram:\n ${err.message}`
  }
}

function toTelegramFormat(channel: ShareChannel, metadata: PageMetadata): string {
  const hashTags = metadata.tags
    ?.map((tag) => tag.trim())
    .filter((tag) => tag !== "")
    .map((tag) => `#${tag.replace(/[-_ ]/g, "")}`) // remove all hyphens
    .join(" ")

  // fix X/Twitter link embeds with https://github.com/FixTweet/FxTwitter
  const fixupXUrl = channel.properties["Fix X/Twitter Embeds"]
    ? metadata.url.replace("x.com", "fixupx.com").replace("twitter.com", "fxtwitter.com")
    : metadata.url

  return `${escapeMarkdownV2(hashTags || "")}

*${escapeMarkdownV2(metadata.title)}*

${escapeMarkdownV2(metadata.description || "")}

👉 ${escapeMarkdownV2(fixupXUrl)}`
}

function escapeMarkdownV2(text: string): string {
  const specialCharacters = /[._*[\]()`~>#\-=|{}!\\]/g
  return text.replace(specialCharacters, "\\$&")
}
