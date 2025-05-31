import { useRef, useCallback } from 'react'

export const useAssetLoader = () => {
  const playerSpritesRef = useRef<{
    N: HTMLImageElement | null
    S: HTMLImageElement | null
    E: HTMLImageElement | null
    W: HTMLImageElement | null
  }>({
    N: null,
    S: null,
    E: null,
    W: null
  })

  const zombieSpritesRef = useRef<{ [key: string]: HTMLImageElement | null }>({
    'zombie-health-30': null,
    'zombie-health-50': null,
    'zombie-health-80': null,
    'zombie-health-100': null,
    'N_S': null,
    'N_W_L': null,
    'N_W_R': null,
    'S_S': null,
    'S_W_L': null,
    'S_W_R': null,
    'E_S': null,
    'E_W_L': null,
    'E_W_R': null,
    'O_S': null,
    'O_W_L': null,
    'O_W_R': null
  })

  const floorTextureRef = useRef<HTMLImageElement | null>(null)

  const loadAssets = useCallback(async (): Promise<{
    playerSprites: {
      N: HTMLImageElement | null
      S: HTMLImageElement | null
      E: HTMLImageElement | null
      W: HTMLImageElement | null
    },
    zombieSprites: { [key: string]: HTMLImageElement | null },
    floorTexture: HTMLImageElement | null
  }> => {
    try {
      // Cargar sprites direccionales del jugador
      const playerDirections = ['N', 'S', 'E', 'W'] as const
      const playerSprites = {
        N: null as HTMLImageElement | null,
        S: null as HTMLImageElement | null,
        E: null as HTMLImageElement | null,
        W: null as HTMLImageElement | null
      }

      for (const direction of playerDirections) {
        const img = new Image()
        img.src = `/soldier/${direction}.png`
        await new Promise((resolve, reject) => {
          img.onload = resolve
          img.onerror = reject
        })
        playerSprites[direction] = img
      }

      playerSpritesRef.current = playerSprites

      // Cargar sprites de zombies normales
      const normalZombieSprites = [
        'zombie-health-30',
        'zombie-health-50',
        'zombie-health-80',
        'zombie-health-100'
      ]

      for (const spriteName of normalZombieSprites) {
        const img = new Image()
        img.src = `/new-sprites/${spriteName}.png`
        await new Promise((resolve, reject) => {
          img.onload = resolve
          img.onerror = reject
        })
        zombieSpritesRef.current[spriteName] = img
      }

      // Cargar sprites del mago
      const mageSprites = [
        'N_S',
        'N_W_L',
        'N_W_R',
        'S_S',
        'S_W_L',
        'S_W_R',
        'E_S',
        'E_W_L',
        'E_W_R',
        'O_S',
        'O_W_L',
        'O_W_R'
      ]

      for (const spriteName of mageSprites) {
        const img = new Image()
        img.src = `/mage/${spriteName}.png`
        await new Promise((resolve, reject) => {
          img.onload = resolve
          img.onerror = reject
        })
        zombieSpritesRef.current[spriteName] = img
      }

      // Cargar textura del piso
      const floorTexture = new Image()
      floorTexture.src = '/floor-texture.png'
      await new Promise((resolve, reject) => {
        floorTexture.onload = resolve
        floorTexture.onerror = reject
      })
      floorTextureRef.current = floorTexture

      return {
        playerSprites,
        zombieSprites: zombieSpritesRef.current,
        floorTexture
      }
    } catch (error) {
      console.error("Failed to load game assets:", error)
      throw error
    }
  }, [])

  return {
    playerSpritesRef,
    zombieSpritesRef,
    floorTextureRef,
    loadAssets
  }
} 