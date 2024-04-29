import { Link, MemoryRouter, Route, Routes, useLocation } from "react-router-dom"

import { About } from "~components/options/about"
import { Share } from "~components/options/share"
import { buttonVariants } from "~components/ui/button"
import { Separator } from "~components/ui/separator"
import { cn } from "~lib/utils"

import "~style.css"

const sidebarNavItems = [
  {
    title: "分享渠道",
    href: "/share",
    routePath: "/share/*",
    routeElement: <Share />
  },
  {
    title: "关于",
    href: "/about",
    routePath: "/about",
    routeElement: <About />
  }
]

export default function OptionsIndex() {
  return (
    <MemoryRouter initialEntries={["/share"]}>
      <div className="container relative text-slate-600">
        <div className="space-y-6 p-10 pb-16">
          <div className="space-y-0.5">
            <h2 className="text-2xl font-bold tracking-tight">设置</h2>
          </div>
          <Separator className="my-6" />
          <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
            <aside className="lg:w-1/5">
              <SidebarNav items={sidebarNavItems} />
            </aside>
            <div className="flex-1">
              <Routes>
                {sidebarNavItems.map((item) => (
                  <Route key={item.routePath} path={item.routePath} element={item.routeElement} />
                ))}
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </MemoryRouter>
  )
}

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    title: string
    href: string
    routePath: string
    routeElement: React.JSX.Element
  }[]
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const { pathname } = useLocation()

  return (
    <nav className={cn("flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1", className)} {...props}>
      {items.map((item) => (
        <Link
          key={item.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname.indexOf(item.href) >= 0 ? "bg-slate-200 hover:bg-slate-200" : "hover:bg-slate-100 hover:underline",
            "justify-start"
          )}
          to={item.href}>
          {item.title}
        </Link>
      ))}
    </nav>
  )
}
