import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Mystic Realm',
    short_name: 'Mystic Realm',
    description: 'A Magic Defender Game',
    start_url: '/',
    display: 'minimal-ui',
    background_color: '#6A1B9A',
    theme_color: '#6A1B9A',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}