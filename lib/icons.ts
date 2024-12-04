import {AlignLeft, Calendar, FileImage, Link2, List, Tags, UserPen, type LucideIcon, Heading} from "lucide-react"

const iconMap: { [key: string]: LucideIcon } = {
  url: Link2,
  title: Heading,
  author: UserPen,
  published: Calendar,
  description: List,
  image: FileImage,
  tags: Tags
}

export function getMetadataIcon(key: string): LucideIcon {
  return iconMap[key] || AlignLeft
}
