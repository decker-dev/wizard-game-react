import type { Metadata } from 'next'
import './globals.css'
import { Analytics } from '@vercel/analytics/react'
export const metadata: Metadata = {
  title: 'Zombie Game',
  description: 'Zombie Game',
  generator: 'Zombie Game',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
      <Analytics />
    </html>
  )
}
