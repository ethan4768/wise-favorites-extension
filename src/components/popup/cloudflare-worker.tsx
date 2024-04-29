import axios from "axios"
import { useState } from "react"
import { SiCloudflareworkers } from "react-icons/si"

import { Button } from "~components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~components/ui/tooltip"

export default function CloudflareWorker(props) {
  const { url, setError } = props
  const [cloudflareWorkerSucceed, setCloudflareWorkerSucceed] = useState(false)

  async function addTagsAndShare() {
    const items = await chrome.storage.sync.get("config.cloudflareWorker")
    const cloudflareWorkerConfig = items["config.cloudflareWorker"]
    let basePath = cloudflareWorkerConfig && cloudflareWorkerConfig["basePath"]
    let token = cloudflareWorkerConfig && cloudflareWorkerConfig["token"]
    if (!basePath || !token) {
      setError("缺少配置项")
      return
    }

    axios
      .post(
        basePath,
        {
          url: url
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      .then((response) => {
        setCloudflareWorkerSucceed(true)
        setTimeout(() => {
          setCloudflareWorkerSucceed(false)
        }, 800)
      })
      .catch((error) => {
        console.error(error)
        setError(`请求失败，${error}`)
      })
  }

  return (
    <div>
      <TooltipProvider>
        <Tooltip open={cloudflareWorkerSucceed}>
          <TooltipTrigger asChild>
            <Button size="sm" variant="outline" className="bg-gray-100 hover:bg-gray-200" onClick={addTagsAndShare}>
              <SiCloudflareworkers size={16} className="mr-1" />
              {"Share(CFW)"}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Succeed!</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
