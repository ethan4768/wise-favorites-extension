import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "~/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~components/ui/card"

import "~style.css"

const telegramFormSchema = z.object({
  channel_id: z.string(),
  bot_token: z.string()
})

type TelegramFormValues = z.infer<typeof telegramFormSchema>

const defaultValues: Partial<TelegramFormValues> = {
  channel_id: "",
  bot_token: ""
}

export default function TelegramConfig() {
  const form = useForm<TelegramFormValues>({
    resolver: zodResolver(telegramFormSchema),
    defaultValues,
    mode: "onChange"
  })

  function onSubmit(data: TelegramFormValues) {
    chrome.storage.sync.set({ "config.telegram": data }, () => {
      toast.success("Telegram configuration has been saved.")
    })
  }

  useEffect(() => {
    chrome.storage.sync.get({ "config.telegram": {} }, (items) => {
      let channelId = items["config.telegram"]["channel_id"]
      let botToken = items["config.telegram"]["bot_token"]
      form.reset({ bot_token: botToken, channel_id: channelId })
    })
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Telegram configuration</CardTitle>
        <CardDescription>
          参考{" "}
          <a className="underline" href="https://core.telegram.org/bots/api" target="_blank">
            Telegram Bot API
          </a>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="bot_token"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bot Token</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    通过 BotFather 创建 Bot，BotFather 会提供一个 token，API 请求需要使用该 token。
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="channel_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Channel ID</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    如果 channel 是公开的，那么它的 id 就是它的用户名（例如 @mychannel）；
                    <br />
                    如果 channel 是私有的，那么需要使用一些工具或者 API 来获取它的 id。
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
