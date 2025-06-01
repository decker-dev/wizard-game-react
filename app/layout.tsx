import type { Metadata } from 'next'
import './globals.css'
import { Analytics } from '@vercel/analytics/react'

export const metadata: Metadata = {
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
    'supervivencia'
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
  metadataBase: new URL('https://game.decker.sh'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: '/',
    title: '🧟 Zombie Apocalypse Survival - Shooter 2D con Pixel Art',
    description: 'Sobrevive a oleadas infinitas de zombies en este innovador shooter 2D. Sistema de mejoras, marketplace entre oleadas y tablas de clasificación globales. ¡Juega gratis ahora!',
    siteName: 'Zombie Apocalypse Survival',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Zombie Apocalypse Survival - 2D Pixel Art Shooter Game',
        type: 'image/png',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '🧟 Zombie Apocalypse Survival - Shooter 2D',
    description: 'Sobrevive a oleadas infinitas de zombies en este innovador shooter 2D con pixel art. ¡Juega gratis ahora!',
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
  verification: {
    google: 'google-site-verification-token', // Reemplaza con tu token real
  },
  category: 'games',
  classification: 'Game',
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'Zombie Survival',
    'mobile-web-app-capable': 'yes',
    'application-name': 'Zombie Apocalypse Survival',
    'msapplication-TileColor': '#000000',
    'theme-color': '#000000',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
      <Analytics />
    </html>
  )
}
