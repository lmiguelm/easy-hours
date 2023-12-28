import { ElementType } from 'react'

interface InlineItemIconProps {
  icon: ElementType
}

export function InlineItemIcon({ icon: Icon }: InlineItemIconProps) {
  return <Icon className="h-4 w-4" />
}
