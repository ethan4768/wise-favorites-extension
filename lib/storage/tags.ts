import { sanitizeAlphaNumeric } from "@/lib/string-utils.ts"
import { storage } from "wxt/storage"

const defaultPresetTags = `opensource
awesome
buildinpublic
mactips
iOStips
dev
startup
tool
AI
chatgpt
LLM
RAG
makemoney
cloudflare
logo
course
design
writing
selfhosted
`

export const presetTagsInStorage = storage.defineItem<string[]>("local:preset-tags", {
  init: () => {
    return sanitizeUniqSort(defaultPresetTags.split("\n"))
  }
})

export async function getPresetTagList(): Promise<string[]> {
  return await presetTagsInStorage.getValue()
}

export async function setPresetTagsFromString(text: string) {
  await presetTagsInStorage.setValue(sanitizeUniqSort(text.split("\n")))
}

export async function addToPresetTags(presetTags: string[], selectedTags: string[]) {
  await presetTagsInStorage.setValue(sanitizeUniqSort([...presetTags, ...selectedTags]))
}

function sanitizeUniqSort(tags: string[]): string[] {
  return tags
    .map((tag) => sanitizeAlphaNumeric(tag)) // Sanitize each tag
    .filter((tag) => tag !== "") // Filter out empty tags
    .reduce((uniqueTags: string[], tag) => {
      // Reduce to a list of unique tags
      if (!uniqueTags.includes(tag)) {
        uniqueTags.push(tag)
      }
      return uniqueTags
    }, [])
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
}
