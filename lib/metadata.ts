import type { Metadata } from 'next'

const siteUrl = 'https://mystic.decker.sh'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
  authors: [{ name: 'Lauti, Alejo & Decker' }],
  creator: 'Vibe Gaming Hackathon Team',
  publisher: 'Vibe Gaming',
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    title: '🎮 Play Now - MYSTIC REALM DEFENDER',
    description: 'Master the arcane arts in MYSTIC REALM DEFENDER! Control with WASD, cast spells with mouse and survive as long as possible in this intense 2D fantasy game.',
    siteName: 'MYSTIC REALM DEFENDER',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MYSTIC REALM DEFENDER - Gameplay Screenshot',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '🎮 Play MYSTIC REALM DEFENDER!',
    description: 'Master the arcane arts in MYSTIC REALM DEFENDER! 2D pixel art fantasy game.',
    images: ['/og-image.png'],
  },
  other: {
    'game:credits': 'Meet the team behind MYSTIC REALM DEFENDER: Lauti, Alejo and Decker. Developed during the first Vibe Gaming Hackathon in LATAM.',
    'game:credits:title': '👥 Development Team - MYSTIC REALM DEFENDER',
    'game:credits:description': 'Meet the talented team that created this amazing 2D fantasy game during the Vibe Gaming Hackathon.',
    'game:leaderboard': `${siteUrl}/leaderboard`,
    'game:leaderboard:title': '🏆 Leaderboard - MYSTIC REALM DEFENDER',
    'game:leaderboard:description': 'Compete for first place and prove you are the best realm defender in MYSTIC REALM DEFENDER.',
  },
}

export const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'VideoGame',
  name: 'MYSTIC REALM DEFENDER',
  description: 'Master the arcane arts in MYSTIC REALM DEFENDER, an innovative 2D pixel art fantasy game.',
  genre: ['Action', 'Fantasy', 'Survival', 'Arcade'],
  gamePlatform: 'Web Browser',
  operatingSystem: 'Any',
  applicationCategory: 'Game',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  author: {
    '@type': 'Organization',
    name: 'Vibe Gaming Hackathon Team',
  },
} 