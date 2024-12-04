import { openAIConfigInStorage } from "@/lib/storage/llm.ts"
import { sanitizeAlphaNumeric } from "@/lib/string-utils.ts"
import { LLMResponse, LLMResult, PageMetadata } from "@/lib/types.ts"
import OpenAI from "openai"

export async function tagging(presetTags: string[], metadata: PageMetadata, content: string): Promise<LLMResult> {
  const openAIConfig = await openAIConfigInStorage.getValue()
  if (!openAIConfig || !openAIConfig.basePath || !openAIConfig.basePath || !openAIConfig.model) {
    return {
      success: false,
      error: "OpenAI Configuration Error, please check your settings."
    }
  }

  const openai = new OpenAI({
    baseURL: openAIConfig.basePath,
    apiKey: openAIConfig.apiKey,
    dangerouslyAllowBrowser: true
  })

  const systemPrompt = `
generate tags, an improved title, an improved description based on given URL, title, description and content

tags: Select 2-5 of the most relevant tags from the following preset list: ${presetTags}, and feel free to add more if needed, every tag should not have any hyphens
improved_title: retain proper nouns such as prompt, AI, LLM, should be no longer than 60 words
improved_description: retain proper nouns such as prompt, AI, LLM, should be no longer than 160 words

Respond directly in JSON format, without using Markdown code blocks or any other formatting, the JSON schema should include tags, improved_title, improved_description
Example:
{
  "tags": ["AI", "dev", "tool", "writing"],
  "improved_title": "Microsoft open sources OmniParser: a tool for parsing and identifying interactive icons on the screen",
  "improved_description": "Microsoft has open-sourced a tool that can parse and recognize interactive icons on the screen: OmniParser. It can accurately identify interactive icons in the user interface and is superior to GPT-4V in parsing."
}
`

  const userMessage = `
url: ${metadata.url}
title: ${metadata.title}
description: ${metadata.description}
content: 
---
${content}
`

  try {
    const completion = await openai.chat.completions.create({
      model: openAIConfig.model,
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      response_format: { type: "json_object" }
    })

    const response = completion.choices[0].message.content
    console.log(response)
    if (!response) {
      return {
        success: false,
        error: "No response returned"
      }
    }
    const result: LLMResponse = JSON.parse(response)
    result.tags = (result.tags ?? []).map((tag) => sanitizeAlphaNumeric(tag)).filter((tag) => tag.length <= 20)
    return {
      success: true,
      data: result
    }
  } catch (e) {
    // @ts-ignore
    console.error("Cannot request llm, ", e.message)
    return {
      success: false,
      // @ts-ignore
      error: e.message
    }
  }
}
