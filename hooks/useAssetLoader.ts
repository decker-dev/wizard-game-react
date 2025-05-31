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
    // Mage sprites for shooter zombies (with mage_ prefix)
    'mage_N_S': null,      // North Standing
    'mage_N_W_L': null,    // North Walking Left
    'mage_N_W_R': null,    // North Walking Right
    'mage_S_S': null,      // South Standing
    'mage_S_W_L': null,    // South Walking Left
    'mage_S_W_R': null,    // South Walking Right
    'mage_E_S': null,      // East Standing
    'mage_E_W_L': null,    // East Walking Left
    'mage_E_W_R': null,    // East Walking Right
    'mage_O_S': null,      // West Standing
    'mage_O_W_L': null,    // West Walking Left
    'mage_O_W_R': null,    // West Walking Right
    // Zombie sprites for normal zombies (with zombie_ prefix)
    'zombie_N_S': null,      // North Standing
    'zombie_N_W_L': null,    // North Walking Left
    'zombie_N_W_R': null,    // North Walking Right
    'zombie_S_S': null,      // South Standing
    'zombie_S_W_L': null,    // South Walking Left
    'zombie_S_W_R': null,    // South Walking Right
    'zombie_E_S': null,      // East Standing
    'zombie_E_W_L': null,    // East Walking Left
    'zombie_E_W_R': null,    // East Walking Right
    'zombie_O_S': null,      // West Standing
    'zombie_O_W_L': null,    // West Walking Left
    'zombie_O_W_R': null,    // West Walking Right
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

      // Cargar sprites del mago para shooters
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
        zombieSpritesRef.current[`mage_${spriteName}`] = img
      }

      // Cargar sprites del zombie normal
      const zombieSprites = [
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

      for (const spriteName of zombieSprites) {
        const img = new Image()
        img.src = `/zombie/${spriteName}.png`
        await new Promise((resolve, reject) => {
          img.onload = resolve
          img.onerror = reject
        })
        zombieSpritesRef.current[`zombie_${spriteName}`] = img
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