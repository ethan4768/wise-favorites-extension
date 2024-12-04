import { parse } from "tldts"
import { storage } from "wxt/storage"

export type SelectorSettingItems = {
  [key: string]: string[]
}

const defaultSelectorSettings: SelectorSettingItems = {
  "github.com": ["article.markdown-body"],
  "x.com": ['div[data-testid="tweetText"]', 'div[data-testid="tweetPhoto"]'],
  "twitter.com": ['div[data-testid="tweetText"]', 'div[data-testid="tweetPhoto"]']
}

export const selectorSettingsInStorage = storage.defineItem<SelectorSettingItems>("local:selectors", {
  init: () => {
    return defaultSelectorSettings
  }
})

export async function getSelectors(url: string): Promise<string[] | undefined | null> {
  const selectors = await selectorSettingsInStorage.getValue()
  if (!selectors) {
    return null
  }

  const tldts = parse(url)
  for (const key of [url, tldts.hostname, tldts.domain]) {
    if (key && selectors[key]) {
      return selectors[key]
    }
  }

  return null
}
