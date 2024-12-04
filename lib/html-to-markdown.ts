import rehypeParse from "rehype-parse"
import rehypeRemark from "rehype-remark"
import remarkGfm from "remark-gfm"
import remarkPrependUrl from "remark-prepend-url"
import remarkStringify from "remark-stringify"
import { unified } from "unified"
import { u } from "unist-builder"
import { visit } from "unist-util-visit"

/**
 * Made some changes based on https://stackoverflow.com/a/78053678
 */
function preserveNewlines() {
  return (tree: any) => {
    visit(tree, "text", (node, index, parent) => {
      if (node.value.includes("\n")) {
        // Split the text at newlines
        const parts = node.value.split("\n")
        if (parts.length > 1) {
          const newNodes: any[] = []
          parts.forEach((part: string, i: number) => {
            if (part.trim() !== "") {
              // Add text node for the non-empty part
              newNodes.push(u("text", part))
              if (i !== parts.length - 1) {
                // Add a `br` element node for each newline, except after the last part
                newNodes.push(u("element", { tagName: "br" }, []))
              }
            }
          })
          // Replace the current text node with the new nodes
          parent.children.splice(index, 1, ...newNodes)
        }
      }
    })
  }
}

export function htmlToMarkdown(baseUrl: string, html: string): string {
  const file = unified()
    .use(rehypeParse, { fragment: true })
    .use(preserveNewlines) // Handling line breaks in text nodes
    .use(remarkGfm)
    .use(rehypeRemark)
    .use(remarkPrependUrl, new URL(baseUrl))
    .use(remarkStringify)
    .processSync(html)
  return String(file)
}
