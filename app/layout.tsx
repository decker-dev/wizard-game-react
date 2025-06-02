import type { Metadata } from 'next'
import './globals.css'
import { Analytics } from '@vercel/analytics/react'
import { Press_Start_2P } from 'next/font/google'

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'MYSTIC REALM DEFENDER - 2D Pixel Art Fantasy Game',
    template: '%s | MYSTIC REALM DEFENDER'
  },
  description: 'Master the arcane arts in MYSTIC REALM DEFENDER, an innovative 2D pixel art fantasy game. Enhance your spells, collect crystals and compete for the best score on global leaderboards.',
  keywords: [
    'mystic realm',
    'fantasy game',
    'magic game',
    'pixel art',
    'wizard game',
    'survival game',
    'mythical creatures',
    'arcane defense',
    'spell casting',
    'magical shooter',
    'fantasy survival',
    'browser game',
    'web game',
    'indie game',
    'retro game',
    'action game'
  ],
  authors: [
    { name: 'Lauti', url: 'https://x.com/lautidev_' },
    { name: 'Alejo', url: 'https://x.com/alejorrojass' },
    { name: 'Decker', url: 'https://x.com/0xDecker' }
  ],
  creator: 'Vibe Gaming Team',
  publisher: 'Vibe Gaming',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://mystic.decker.sh'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mystic.decker.sh',
    title: 'MYSTIC REALM DEFENDER - 2D Pixel Art Fantasy Game',
    description: 'Master the arcane arts in MYSTIC REALM DEFENDER! Control with WASD, cast spells with mouse and survive as long as possible in this intense 2D fantasy game.',
    siteName: 'MYSTIC REALM DEFENDER',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'MYSTIC REALM DEFENDER - Gameplay Screenshot',
        type: 'image/png',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '🎮 Play MYSTIC REALM DEFENDER!',
    description: 'Master the arcane arts in MYSTIC REALM DEFENDER! 2D pixel art fantasy game.',
    images: ['/og.png'],
    creator: '0xDecker',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'games',
  classification: 'Game',
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'MYSTIC REALM DEFENDER',
    'mobile-web-app-capable': 'yes',
    'application-name': 'MYSTIC REALM DEFENDER',
    'msapplication-TileColor': '#8A2BE2',
    'theme-color': '#8A2BE2',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={pressStart2P.variable}>{children}</body>
      <Analytics />
    </html>
  )
}
