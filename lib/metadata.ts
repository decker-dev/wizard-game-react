import type { Metadata } from 'next'

const siteUrl = 'https://zombie.decker.sh'

export const defaultMetadata: Metadata = {
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
    'survival horror',
    'game jam',
    'vibe gaming'
  ],
  authors: [
    { name: 'Lauti', url: 'https://x.com/lautidev_' },
    { name: 'Alejo', url: 'https://x.com/alejorrojass' },
    { name: 'Decker', url: 'https://x.com/0xDecker' }
  ],
  creator: 'Vibe Gaming Team',
  publisher: 'Vibe Gaming',
  metadataBase: new URL(siteUrl),
}

export const gamePageMetadata: Metadata = {
  title: '🎮 Play Now - BOXHEAD ZOMBIE SURVIVAL',
  description: 'Start your survival against zombie hordes in BOXHEAD ZOMBIE SURVIVAL! Control with WASD, shoot with mouse and survive as long as possible in this intense 2D shooter.',
  openGraph: {
    title: '🎮 Play BOXHEAD ZOMBIE SURVIVAL Now!',
    description: 'Start your survival against zombie hordes in BOXHEAD ZOMBIE SURVIVAL! Control with WASD, shoot with mouse and survive.',
    url: '/game',
    images: [
      {
        url: '/og.png',
        width: 1536,
        height: 1024,
        alt: 'BOXHEAD ZOMBIE SURVIVAL - Gameplay Screenshot',
      }
    ],
  },
  twitter: {
    title: '🎮 Play BOXHEAD ZOMBIE SURVIVAL!',
    description: 'Start your survival against zombie hordes in BOXHEAD ZOMBIE SURVIVAL! 2D pixel art shooter.',
  },
}

export const creditsPageMetadata: Metadata = {
  title: '👥 Credits - Development Team',
  description: 'Meet the team behind BOXHEAD ZOMBIE SURVIVAL: Lauti, Alejo and Decker. Developed during the first Vibe Gaming Hackathon in LATAM.',
  openGraph: {
    title: '👥 Development Team - BOXHEAD ZOMBIE SURVIVAL',
    description: 'Meet the talented team that created this amazing 2D shooter during the Vibe Gaming Hackathon.',
    url: '/credits',
  },
}

export const leaderboardMetadata: Metadata = {
  title: '🏆 Leaderboard - Top Players',
  description: 'Check out the best scores and compete for first place in BOXHEAD ZOMBIE SURVIVAL. Do you have what it takes to be at the top?',
  openGraph: {
    title: '🏆 Leaderboard - BOXHEAD ZOMBIE SURVIVAL',
    description: 'Compete for first place and prove you are the best zombie survivor in BOXHEAD ZOMBIE SURVIVAL.',
    url: '/leaderboard',
  },
}

// Schema.org structured data for better SEO
export const gameStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'VideoGame',
  name: 'BOXHEAD ZOMBIE SURVIVAL',
  description: 'Survive infinite waves of zombies in BOXHEAD ZOMBIE SURVIVAL, an innovative 2D pixel art shooter.',
  genre: ['Action', 'Shooter', 'Survival', 'Arcade'],
  gamePlatform: ['Web Browser', 'PC', 'Mobile'],
  applicationCategory: 'Game',
  operatingSystem: ['Windows', 'macOS', 'Linux', 'iOS', 'Android'],
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock'
  },
  author: [
    {
      '@type': 'Person',
      name: 'Lauti',
      url: 'https://x.com/lautidev_'
    },
    {
      '@type': 'Person',
      name: 'Alejo',
      url: 'https://x.com/alejorrojass'
    },
    {
      '@type': 'Person',
      name: 'Decker',
      url: 'https://x.com/0xDecker'
    }
  ],
  publisher: {
    '@type': 'Organization',
    name: 'Vibe Gaming'
  },
  image: `${siteUrl}/og.png`,
  url: siteUrl,
  datePublished: '2024-12-01',
  inLanguage: 'en-US',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '100',
    bestRating: '5'
  }
} 