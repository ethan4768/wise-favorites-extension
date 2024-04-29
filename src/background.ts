// Add a listener to create the initial context menu items,
// context menu items only need to be created at runtime.onInstalled
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "copy-tab-url-as-markdown",
    title: "Copy Tab Url As Markdown ",
    contexts: ["page"]
  })
})

chrome.contextMenus.onClicked.addListener(async (item, tab) => {
  const markdown = `[${tab.title}](${tab.url})`
  if (chrome.runtime?.id) {
    chrome.tabs.sendMessage(tab.id, { action: "copyTabUrlAsMarkdown", text: markdown }, async function (response) {
      // do nothing
    })
  }
})
