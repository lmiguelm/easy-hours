import { Inter } from 'next/font/google'

import '@/styles/global.css'
import { Toaster } from '@/components/ui/sonner'
import { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Easy Hours',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
      <Toaster />
    </html>
  )
}
