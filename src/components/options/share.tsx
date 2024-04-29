import { useEffect, useState } from "react"
import { PiTelegramLogo } from "react-icons/pi"
import { SiCloudflareworkers } from "react-icons/si"
import { Link, Route, Routes, useLocation } from "react-router-dom"

import CloudflareWorkerConfig from "~components/options/cloudflare-worker"
import TelegramConfig from "~components/options/telegram"
import { buttonVariants } from "~components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~components/ui/card"
import { Separator } from "~components/ui/separator"
import { Toaster } from "~components/ui/sonner"
import { Switch } from "~components/ui/switch"
import { cn } from "~lib/utils"

import "~style.css"

const configItems = [
  {
    key: "cloudflare-worker",
    title: "Cloudflare Worker",
    description: (
      <>
        自定义的 cloudflare worker，参考{" "}
        <a className="underline" href="https://github.com/ethan4768/wise-favorites-worker" target="_blank">
          https://github.com/ethan4768/wise-favorites-worker
        </a>
      </>
    ),
    icon: <SiCloudflareworkers size={25} />,
    href: "/share/cloudflare-worker",
    routePath: "/cloudflare-worker",
    routeElement: <CloudflareWorkerConfig />
  },
  {
    key: "telegram",
    title: "Telegram",
    description: <>借助 bot 将消息发送到 telegram 的 channel</>,
    icon: <PiTelegramLogo size={25} />,
    href: "/share/telegram",
    routePath: "/telegram",
    routeElement: <TelegramConfig />
  }
]

export const Share = () => {
  return (
    <div>
      <div className="container px-2">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">配置分享渠道</h3>
            <p className="text-sm text-muted-foreground">控制分享渠道的开关，并对分享渠道进行单独设置</p>
          </div>
          <div className="flex flex-col ">
            <ShareConfigCards items={configItems} />
            <Separator className="my-6" />
            <div className="">
              <Routes>
                {configItems.map((item) => (
                  <Route key={item.routePath} path={item.routePath} element={item.routeElement} />
                ))}
              </Routes>
            </div>
          </div>
        </div>
      </div>
      <Toaster richColors />
    </div>
  )
}

interface ShareConfigProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    key: string
    title: string
    description: React.JSX.Element
    icon: React.JSX.Element
    href: string
    routePath: string
    routeElement: React.JSX.Element
  }[]
}

function ShareConfigCards({ items }: ShareConfigProps) {
  const { pathname } = useLocation()

  const [switches, setSwitches] = useState({})

  useEffect(() => {
    chrome.storage.sync.get({ "config.switches": {} }).then((result) => {
      const switches = result["config.switches"]
      items.map((item) => {
        if (!switches[item.key]) {
          switches[item.key] = false
        }
      })
      setSwitches(switches)
    })
  }, [])

  function onCheckedChange(key: string, checked: boolean) {
    switches[key] = checked
    setSwitches((preSwitches) => ({
      ...preSwitches,
      [key]: checked
    }))
    chrome.storage.sync.set({ "config.switches": switches }, () => {})
  }

  return (
    <div className="flex gap-3">
      {items.map((item) => (
        <Card
          key={item.key}
          className={cn(pathname === item.href ? "bg-slate-50 border-2" : "", "flex flex-col w-[360px]")}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3 text-lg">
              {item.icon}
              <CardTitle className="font-medium">{item.title}</CardTitle>
            </div>
            <Switch checked={switches[item.key]} onCheckedChange={(checked) => onCheckedChange(item.key, checked)} />
          </CardHeader>
          <CardContent className="grow">
            <CardDescription>{item.description}</CardDescription>
          </CardContent>
          <CardFooter className="flex justify-end justify-self-end">
            <Link className={cn(buttonVariants({ variant: "outline" }), "hover:bg-slate-100")} to={item.href}>
              修改配置
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
