<h1 align="center">
  <img align="top" width="44" src="./assets/icon.svg" alt="Logo">
  <span>Wise Favorites Extension</span>
</h1>

This is a free and open-source Google Chrome extension, designed to enhance your web experience by seamlessly extracting, converting, and organizing content for smarter information management and sharing.

![Side Panel](./docs/images/sidepanel.png)
![telegram channel](docs/images/telegram-channel.png)

<details>
<summary>More screenshots</summary>

**Side Panel**

![Side Panel With Page](./docs/images/sidepanel-full.png)
![Side Panel](./docs/images/sidepanel.png)

**Popup**

![Popup In Page](./docs/images/popup-full.png)
![Popup](./docs/images/popup.png)

**Settings**

![setting-tags.png](docs/images/setting-tags.png)
![setting-selectors.png](docs/images/setting-selectors.png)
![setting-share-channels.png](docs/images/setting-share-channels.png)
![setting-llm.png](docs/images/setting-llm.png)

</details>

## Features

- 📄 **Metadata Extraction & Markdown Conversion**: Automatically extract page metadata and convert page content into
  Markdown format for easy readability and editing.

- 🎯 **Custom Selectors**: Specify custom CSS selectors to extract specific content according to your needs. See
  the [supported selectors](https://github.com/fb55/css-select/blob/master/README.md#supported-selectors) for more
  details.

- 🚀 **Seamless Sharing**: Effortlessly share extracted content to telegram channel
  or [wise-favorites-worker](https://github.com/ethan4768/wise-favorites-worker).

- 🤖 **AI-Enhanced Tagging**: Harness the power of OpenAI to intelligently tag content by selecting from a pre-set list of tags or generating new tags based on the content itself. You can manually modify these tags as needed, ensuring accurate and contextually relevant categorization.

- 📋 **Markdown Copy**: Quickly copy page titles and URLs in Markdown format to streamline documentation and note-taking.

## Installation

### Manual Installation

1. Download the extension's `.zip` file from **[latest available release](https://github.com/ethan4768/wise-favorites-extension/releases)**.
2. Unzip the file.
3. Open `chrome://extensions/` in your browser.
4. Enable "Developer mode" in the top right.
5. Click "Load unpacked" and select the unzipped folder.

## Acknowledgments

This extension is built utilizing the following open-source projects and libraries:

- **Framework & UI**:
  - [wxt-dev/wxt](https://github.com/wxt-dev/wxt): Utilized as the next-gen framework for optimizing extension development.
  - [shadcn/ui](https://ui.shadcn.com/) & [shadcn-ui-expansions](https://github.com/hsuanyi-chou/shadcn-ui-expansions): Provide the beautifully designed UI components to enhance user interaction.
  - [Tailwind CSS](https://tailwindcss.com/): Leveraged for rapid and efficient styling.

- **Content Parsing**:
  - [cheeriojs/cheerio](https://github.com/cheeriojs/cheerio): For parsing and manipulating HTML content.
  - [mozilla/readability](https://github.com/mozilla/readability): Utilized for extracting readable content from web pages.

- **Markdown Conversion**:
  - [unifiedjs/unified](https://github.com/unifiedjs/unified) & [rehypejs/rehype](https://github.com/rehypejs/rehype): Facilitate processing and transforming HTML to Markdown.
  - [rehypejs/rehype-remark](https://github.com/rehypejs/rehype-remark): Transforms HTML content into Markdown format for better integration with documentation tools.

- **AI & LLM**:
  - [openai/openai-node](https://github.com/openai/openai-node): Integrated for utilizing OpenAI's API to enhance tagging with AI-driven insights.

## License

MIT License
