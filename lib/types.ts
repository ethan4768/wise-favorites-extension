import { z } from "zod"

export interface PageMetadata {
  url: string
  title: string
  author?: string
  published?: string
  description?: string
  image?: string
  tags?: string[]
  slug?: string
}

export const LLMResponseSchema = z.object({
  tags: z.array(z.string()),
  slug: z.string(),
  improved_title: z.string(),
  improved_description: z.string()
})
export type LLMResponse = z.infer<typeof LLMResponseSchema>

export interface LLMResult {
  success: boolean
  error?: string
  data?: LLMResponse
}
