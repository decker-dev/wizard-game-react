import type { Metadata } from 'next'
import './globals.css'
import { Analytics } from '@vercel/analytics/react'

export const metadata: Metadata = {
  title: {
    default: 'BOXHEAD ZOMBIE SURVIVAL - 2D Pixel Art Shooter',
    template: '%s | BOXHEAD ZOMBIE SURVIVAL'
  },
  description: 'Survive infinite waves of zombies in BOXHEAD ZOMBIE SURVIVAL, an innovative 2D pixel art shooter. Upgrade your weapons, buy equipment and compete for the best score on global leaderboards.',
  keywords: [
    'boxhead',
    'boxhead zombie survival',
    'zombie game',
    'shooter 2d',
    'pixel art',
    'survival game',
    'zombie apocalypse',
    'waves game',
    'online game',
    'browser game',
    'arcade game',
    'leaderboard',
    'zombie shooter',
    'survival horror'
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
  metadataBase: new URL('https://zombie.decker.sh'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'BOXHEAD ZOMBIE SURVIVAL - 2D Pixel Art Shooter',
    description: 'Survive infinite waves of zombies in BOXHEAD ZOMBIE SURVIVAL. Upgrade system, marketplace between waves and global leaderboards. Play free now!',
    siteName: 'BOXHEAD ZOMBIE SURVIVAL',
    images: [
      {
        url: '/og.png',
        width: 1536,
        height: 1024,
        alt: 'BOXHEAD ZOMBIE SURVIVAL - 2D Pixel Art Shooter Game',
        type: 'image/png',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BOXHEAD ZOMBIE SURVIVAL - 2D Shooter',
    description: 'Survive infinite waves of zombies in BOXHEAD ZOMBIE SURVIVAL, an innovative 2D pixel art shooter. Play free now!',
    images: ['/og.png'],
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
    'apple-mobile-web-app-title': 'BOXHEAD ZOMBIE SURVIVAL',
    'mobile-web-app-capable': 'yes',
    'application-name': 'BOXHEAD ZOMBIE SURVIVAL',
    'msapplication-TileColor': '#000000',
    'theme-color': '#000000',
    // WhatsApp specific meta tags
    'og:image:width': '1536',
    'og:image:height': '1024',
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
        <meta property="og:image" content="https://zombie.decker.sh/og.png" />
        <meta property="og:image:secure_url" content="https://zombie.decker.sh/og.png" />
        <meta property="og:image:width" content="1536" />
        <meta property="og:image:height" content="1024" />
        <meta property="og:image:alt" content="BOXHEAD ZOMBIE SURVIVAL - 2D Pixel Art Shooter Game" />
        <meta property="og:image:type" content="image/png" />
        
        {/* WhatsApp specific */}
        <meta name="thumbnail" content="https://zombie.decker.sh/og.png" />
        
        {/* Additional fallbacks */}
        <link rel="image_src" href="https://zombie.decker.sh/og.png" />
      </head>
      <body>{children}</body>
      <Analytics />
    </html>
  )
}
