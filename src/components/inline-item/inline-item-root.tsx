import { ComponentProps } from 'react'

type InlineItemRootProps = ComponentProps<'div'>

export function InlineItemRoot(props: InlineItemRootProps) {
  return <div {...props} className="flex justify-between items-center" />
}
