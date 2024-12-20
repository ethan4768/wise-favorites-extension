import { Input } from "@/components/ui/input.tsx"
import { Label } from "@/components/ui/label.tsx"
import { Switch } from "@/components/ui/switch.tsx"
import * as React from "react"

export function InputEx({
  label,
  key,
  defaultValue,
  onValueChange
}: {
  label: string
  key: string
  defaultValue: string
  onValueChange: (key: string, value: string) => void
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={key}>{label}</Label>
      <Input id={key} type="text" value={defaultValue} onChange={(e) => onValueChange(key, e.target.value)} />
    </div>
  )
}

export function BooleanEx({
  label,
  item,
  defaultValue,
  onValueChange
}: {
  label: string
  item: string
  defaultValue: boolean
  onValueChange: (key: string, value: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between">
      <Label htmlFor={item} className="text-sm font-medium text-gray-500">
        {label}
      </Label>
      <Switch id={item} checked={defaultValue} onCheckedChange={(checked) => onValueChange(item, checked)} />
    </div>
  )
}
