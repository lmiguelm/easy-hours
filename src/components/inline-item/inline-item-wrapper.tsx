import { ComponentProps } from 'react'

type InlineItemWrapperProps = ComponentProps<'div'>

export function InlineItemWrapper(props: InlineItemWrapperProps) {
  return <div {...props} className="flex items-center gap-2" />
}
