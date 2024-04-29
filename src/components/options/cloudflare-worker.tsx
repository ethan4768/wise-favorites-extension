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

const cloudflareWorkerFormSchema = z.object({
  basePath: z.string(),
  token: z.string()
})

type CloudflareWorkerFormValues = z.infer<typeof cloudflareWorkerFormSchema>

const defaultValues: Partial<CloudflareWorkerFormValues> = {
  basePath: "",
  token: ""
}

export default function CloudflareWorkerConfig() {
  const form = useForm<CloudflareWorkerFormValues>({
    resolver: zodResolver(cloudflareWorkerFormSchema),
    defaultValues,
    mode: "onChange"
  })

  function onSubmit(data: CloudflareWorkerFormValues) {
    chrome.storage.sync.set({ "config.cloudflareWorker": data }, () => {
      toast.success("Cloudflare worker configuration has been saved.")
    })
  }

  useEffect(() => {
    chrome.storage.sync.get({ "config.cloudflareWorker": {} }, (items) => {
      let basePath = items["config.cloudflareWorker"]["basePath"]
      let token = items["config.cloudflareWorker"]["token"]
      form.reset({ basePath: basePath, token: token })
    })
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Cloudflare worker configuration</CardTitle>
        <CardDescription>
          参考{" "}
          <a className="underline" href="https://github.com/ethan4768/wise-favorites-worker" target="_blank">
            https://github.com/ethan4768/wise-favorites-worker
          </a>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="basePath"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base Path</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>Cloudflare Worker 地址</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="token"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Token</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>BEARER 认证所需 token</FormDescription>
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
