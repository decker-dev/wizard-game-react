import type { Metadata } from 'next'

const siteUrl = 'https://game.decker.sh'

export const defaultMetadata: Metadata = {
  title: {
    default: '🧟 Zombie Apocalypse Survival - 2D Pixel Art Shooter',
    template: '%s | Zombie Apocalypse Survival'
  },
  description: 'Sobrevive a oleadas infinitas de zombies en este innovador shooter 2D con pixel art. Mejora tus armas, compra equipo y compite por el mejor puntaje en las tablas de clasificación globales.',
  keywords: [
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
    'juego de zombies',
    'supervivencia',
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
  title: '🎮 Jugar Ahora - Zombie Apocalypse Survival',
  description: '¡Comienza tu supervivencia contra las hordas de zombies! Controla con WASD, dispara con el mouse y sobrevive el mayor tiempo posible en este intenso shooter 2D.',
  openGraph: {
    title: '🎮 ¡Juega Zombie Apocalypse Survival Ahora!',
    description: '¡Comienza tu supervivencia contra las hordas de zombies! Controla con WASD, dispara con el mouse y sobrevive.',
    url: '/game',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Zombie Apocalypse Survival - Gameplay Screenshot',
      }
    ],
  },
  twitter: {
    title: '🎮 ¡Juega Zombie Apocalypse Survival!',
    description: '¡Comienza tu supervivencia contra las hordas de zombies! Shooter 2D con pixel art.',
  },
}

export const creditsPageMetadata: Metadata = {
  title: '👥 Créditos - Equipo de Desarrollo',
  description: 'Conoce al equipo detrás de Zombie Apocalypse Survival: Lauti, Alejo y Decker. Desarrollado durante el primer Vibe Gaming Hackathon en LATAM.',
  openGraph: {
    title: '👥 Equipo de Desarrollo - Zombie Apocalypse Survival',
    description: 'Conoce al talentoso equipo que creó este increíble shooter 2D durante el Vibe Gaming Hackathon.',
    url: '/credits',
  },
}

export const leaderboardMetadata: Metadata = {
  title: '🏆 Tabla de Clasificación - Top Jugadores',
  description: 'Mira los mejores puntajes y compite por el primer lugar en Zombie Apocalypse Survival. ¿Tienes lo que se necesita para estar en el top?',
  openGraph: {
    title: '🏆 Tabla de Clasificación - Zombie Apocalypse Survival',
    description: 'Compite por el primer lugar y demuestra que eres el mejor superviviente de zombies.',
    url: '/leaderboard',
  },
}

// Schema.org structured data for better SEO
export const gameStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'VideoGame',
  name: 'Zombie Apocalypse Survival',
  description: 'Sobrevive a oleadas infinitas de zombies en este innovador shooter 2D con pixel art.',
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
  inLanguage: 'es-ES',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '100',
    bestRating: '5'
  }
} 