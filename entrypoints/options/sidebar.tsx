import { buttonVariants } from "@/components/ui/button.tsx"
import { cn } from "@/lib/utils.ts"
import * as React from "react"
import { Link, useLocation } from "wouter"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    title: string
    href: string
  }[]
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const [location] = useLocation()

  return (
    <nav className={cn("flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1", className)} {...props}>
      {items.map((item) => (
        <Link
          key={item.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            location===item.href ? "bg-slate-200 hover:bg-slate-200" : "hover:bg-slate-100 hover:underline",
            "justify-start"
          )}
          to={item.href}>
          {item.title}
        </Link>
      ))}
    </nav>
  )
}
