import { htmlToMarkdown } from "@/lib/html-to-markdown.ts"
import { PageMetadata } from "@/lib/types.ts"
import { Readability } from "@mozilla/readability"
import * as cheerio from "cheerio"
import {getSelectors} from "@/lib/storage/selectors.ts";

export async function extractPageData() {
  const fullHtml = document.documentElement.innerHTML
  const url = document.baseURI

  const $fullHtml = cheerio.load(fullHtml)

  const selectors = await getSelectors(url)

  const readabilityArticle = parseReadabilityContent(document)
  if (!readabilityArticle) {
    console.warn("Failed to parse content with Readability, will fall back to full content")
  }

  const metadata = extractMetadata(url, $fullHtml, readabilityArticle)
  const content = extractContent(url, $fullHtml, readabilityArticle, selectors)
  return { content, metadata }
}

export function parseReadabilityContent(doc: Document): ReturnType<Readability["parse"]> | null {
  try {
    const documentClone = doc.cloneNode(true)
    const reader = new Readability(<Document>documentClone, { keepClasses: true })
    return reader.parse()
  } catch (error) {
    console.error("Error in extractReadabilityContent:", error)
    return null
  }
}

export function extractContent(
  url: string,
  $: cheerio.CheerioAPI,
  readabilityArticle: ReturnType<Readability["parse"]>,
  selectors: string[] | undefined | null
) {
  const baseUrl = new URL(url).origin

  let content = null
  if (selectors && selectors.length > 0) {
    content = extractContentBySelectors(baseUrl, $, selectors)
  }
  if (!content && readabilityArticle?.content) {
    content = htmlToMarkdown(baseUrl, readabilityArticle.content)
  }

  content = content || htmlToMarkdown(baseUrl, $.html())

  // fall back to full html text
  return content || $.text()
}

export function extractContentBySelectors(baseUrl: string, $: cheerio.CheerioAPI, selectors: string[]) {
  return selectors
    .map((selector: string) => {
      return $(selector)
        .map((_, element) => {
          const selectedHtml = $(element)?.html()
          if (selectedHtml) {
            return htmlToMarkdown(baseUrl, selectedHtml)
          }
        })
        .toArray()
        .join("\n")
    })
    .join("\n")
}

export function extractMetadata(
  url: string,
  $: cheerio.CheerioAPI,
  readabilityArticle: ReturnType<Readability["parse"]>
): PageMetadata {
  const title =
    readabilityArticle?.title ||
    $('meta[property="og:title"]').attr("content") ||
    $('meta[name="og:title"]').attr("content") ||
    $('meta[property="twitter:title"]').attr("content") ||
    $('meta[name="twitter:title"]').attr("content") ||
    $("title").text() ||
    ""

  const description =
    readabilityArticle?.excerpt ||
    $("meta[name=description]").attr("content") ||
    $('meta[property="og:description"]').attr("content") ||
    $('meta[name="og:description"]').attr("content") ||
    $('meta[property="twitter:description"]').attr("content") ||
    $('meta[name="twitter:description"]').attr("content") ||
    ""

  const image =
    $('meta[property="og:image"]').attr("content") ||
    $('meta[name="og:image"]').attr("content") ||
    $('meta[property="twitter:image"]').attr("content") ||
    $('meta[name="twitter:image"]').attr("content") ||
    ""

  const author =
    readabilityArticle?.byline ||
    $("link[rel=author]").attr("href") ||
    $("link[rel=publisher]").attr("href") ||
    $('meta[property="author"]').attr("content") ||
    $('meta[name="author"]').attr("content") ||
    $('meta[property="og:author"]').attr("content") ||
    $('meta[name="og:author"]').attr("content") ||
    $('meta[property="og:site_name"]').attr("content") ||
    $('meta[name="og:site_name"]').attr("content") ||
    $('meta[property="twitter:creator"]').attr("content") ||
    $('meta[name="twitter:creator"]').attr("content") ||
    $('meta[name="application-name"]').attr("content") ||
    ""

  const $time = $("time").first()
  const published =
    readabilityArticle?.publishedTime ||
    $('meta[property="article:published_time"]').attr("content") ||
    $time?.attr("datetime")?.trim() ||
    $time?.text()?.trim() ||
    ""

  return {
    url,
    title,
    author,
    published,
    description,
    image
  }
}
