import { Separator } from "@/components/ui/separator.tsx"
import About from "@/entrypoints/options/about.tsx"
import GeneralSettings from "@/entrypoints/options/general.tsx"
import LLMSettings from "@/entrypoints/options/llm-settings.tsx"
import SelectorSettings from "@/entrypoints/options/selector-settings.tsx"
import ShareChannelSettings from "@/entrypoints/options/share-channel-settings.tsx"
import { SidebarNav } from "@/entrypoints/options/sidebar.tsx"
import TagSettings from "@/entrypoints/options/tag-settings.tsx"
import React from "react"
import { Route, Router, Switch } from "wouter"
import { useHashLocation } from "wouter/use-hash-location"

const sidebarNavItems = [
  {
    title: "General",
    href: "/",
    routeElement: <GeneralSettings />
  },
  {
    title: "Tags",
    href: "/tags",
    routeElement: <TagSettings />
  },
  {
    title: "LLM",
    href: "/llm",
    routeElement: <LLMSettings />
  },
  {
    title: "Selectors",
    href: "/selectors",
    routeElement: <SelectorSettings />
  },
  {
    title: "Share Channels",
    href: "/share-channels",
    routeElement: <ShareChannelSettings />
  },
  {
    title: "About",
    href: "/about",
    routeElement: <About />
  }
]

export default function App() {
  return (
    <Router hook={useHashLocation}>
      <div className="container mx-auto text-slate-600 ">
        <div className="space-y-6 p-10 pb-16">
          <div className="space-y-0.5">
            <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          </div>
          <Separator className="my-6" />
          <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
            <aside className="lg:w-1/5">
              <SidebarNav items={sidebarNavItems} />
            </aside>
            <div className="flex-1">
              <Switch>
                {sidebarNavItems.map((item) => (
                  <Route key={item.href} path={item.href}>
                    {item.routeElement}
                  </Route>
                ))}
                <Route>404, Not Found!</Route>
              </Switch>
            </div>
          </div>
        </div>
      </div>
    </Router>
  )
}
