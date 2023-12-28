import { Clock } from 'lucide-react'
import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const size = {
  width: 24,
  height: 24,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    <span style={{ color: 'white', fontWeight: 'bold' }}>EH</span>,
    {
      ...size,
    },
  )
}
