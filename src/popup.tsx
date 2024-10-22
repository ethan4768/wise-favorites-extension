import { ExclamationTriangleIcon, GearIcon } from "@radix-ui/react-icons"
import { useEffect, useState } from "react"

import CloudflareWorker from "~components/popup/cloudflare-worker"
import CopyAsMarkdown from "~components/popup/copy-as-markdown"
import Telegram from "~components/popup/telegram"
import { Alert, AlertDescription, AlertTitle } from "~components/ui/alert"
import { Button } from "~components/ui/button"
import { Label } from "~components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "~components/ui/select"
import { Textarea } from "~components/ui/textarea"
import { cn } from "~lib/utils"

import "~style.css"

function IndexPopup() {
  const [url, setUrl] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("post") // post | tool
  const [switches, setSwitches] = useState({})
  const [error, setError] = useState("")

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0]
      setTitle(currentTab.title)
      setUrl(currentTab.url)
    })

    chrome.storage.sync.get({ "config.switches": {} }).then((result) => {
      const switches = result["config.switches"]
      setSwitches(switches)
    })
  }, [])

  return (
    <div className="container w-[380px] p-0 bg-gray-100 text-slate-800">
      <div className="border-1 border-b-2 rounded-xl bg-white">
        <div className="flex flex-col m-4">
          <div className="flex flex-col gap-2 my-2">
            <Label htmlFor="url">url</Label>
            <Textarea className="min-h-[78px]" id="url" value={url} onChange={(e) => setUrl(e.target.value)} />
          </div>
          <div className="flex flex-col gap-2 my-2">
            <Label htmlFor="title">title</Label>
            <Textarea className="min-h-[78px]" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="flex flex-col gap-2 my-2">
            <Label htmlFor="description">description</Label>
            <Textarea className="min-h-[78px]" id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="flex flex-col gap-2 my-2">
            <Label>category</Label>
            <Select defaultValue="post" onValueChange={setCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="post">post</SelectItem>
                  <SelectItem value="tool">tool</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex my-2 gap-1 justify-end">
            {switches["cloudflare-worker"] && <CloudflareWorker url={url} title={title} category={category} description={description} setError={setError} />}
            {switches["telegram"] && <Telegram title={title} url={url} setError={setError} />}
            <CopyAsMarkdown title={title} url={url} />
          </div>
          <Alert variant="destructive" className={cn(error ? "block " : "hidden")}>
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertTitle>错误</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
      <div className="flex justify-end p-1 text-base text-slate-800">
        <Button
          variant="link"
          onClick={() => {
            chrome.runtime.openOptionsPage()
          }}>
          <GearIcon className="mr-1 h-4 w-4" />
          设置
        </Button>
      </div>
    </div>
  )
}

export default IndexPopup
