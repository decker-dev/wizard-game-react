import { useRef, useCallback } from 'react'

export const useAssetLoader = () => {
  const playerImageRef = useRef<HTMLImageElement | null>(null)
  const zombieSpritesRef = useRef<{[key: string]: HTMLImageElement | null}>({
    'zombie-health-30': null,
    'zombie-health-50': null,
    'zombie-health-80': null,
    'zombie-health-100': null,
    'diablo-health-30': null,
    'diablo-health-50': null,
    'diablo-health-100': null
  })

  const loadAssets = useCallback(async (): Promise<{
    playerSprite: HTMLImageElement,
    zombieSprites: {[key: string]: HTMLImageElement | null}
  }> => {
    try {
      // Cargar imagen del jugador
      const playerImg = new Image()
      playerImg.src = "/new-sprites/soldier1.png"
      await new Promise((resolve, reject) => {
        playerImg.onload = resolve
        playerImg.onerror = reject
      })
      playerImageRef.current = playerImg

      // Cargar sprites de zombies
      const zombieSprites = [
        'zombie-health-30',
        'zombie-health-50', 
        'zombie-health-80',
        'zombie-health-100',
        'diablo-health-30',
        'diablo-health-50',
        'diablo-health-100'
      ]

      for (const spriteName of zombieSprites) {
        const img = new Image()
        img.src = `/new-sprites/${spriteName}.png`
        await new Promise((resolve, reject) => {
          img.onload = resolve
          img.onerror = reject
        })
        zombieSpritesRef.current[spriteName] = img
      }

      return {
        playerSprite: playerImg,
        zombieSprites: zombieSpritesRef.current
      }
    } catch (error) {
      console.error("Failed to load game assets:", error)
      throw error
    }
  }, [])

  return {
    playerImageRef,
    zombieSpritesRef,
    loadAssets
  }
} 