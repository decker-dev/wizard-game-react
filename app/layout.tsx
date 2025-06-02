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
    url: '/',
    title: 'MYSTIC REALM DEFENDER - 2D Pixel Art Fantasy Game',
    description: 'Master the arcane arts in MYSTIC REALM DEFENDER! Control with WASD, cast spells with mouse and survive as long as possible in this intense 2D fantasy game.',
    siteName: 'MYSTIC REALM DEFENDER',
    images: [
      {
        url: '/og-image.png',
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
    images: ['/og-image.png'],
    creator: '@lautidev_',
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
    // WhatsApp specific meta tags
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:image:type': 'image/png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Additional WhatsApp-friendly meta tags */}
        <meta property="og:image" content="https://mystic.decker.sh/og-image.png" />
        <meta property="og:image:secure_url" content="https://mystic.decker.sh/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="MYSTIC REALM DEFENDER - Gameplay Screenshot" />
        <meta property="og:image:type" content="image/png" />
        
        {/* WhatsApp specific */}
        <meta name="thumbnail" content="https://mystic.decker.sh/og-image.png" />
        
        {/* Additional fallbacks */}
        <link rel="image_src" href="https://mystic.decker.sh/og-image.png" />
      </head>
      <body className={pressStart2P.variable}>{children}</body>
      <Analytics />
    </html>
  )
}
