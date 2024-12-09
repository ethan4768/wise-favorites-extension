export function isValidUrl(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://") || url.startsWith("file:///")
}

export function isBlankPage(url: string): boolean {
  return url === "about:blank" || url === "chrome://newtab/" || url === "edge://newtab/"
}
