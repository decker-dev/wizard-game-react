import { useCallback, useRef } from 'react'
import { GameState } from '@/types/game'
import { 
  MAX_WAVES, 
  WEAPON_DAMAGE_INCREASE, 
  HEALTH_INCREASE, 
  MAX_UPGRADE_LEVEL 
} from '@/constants/game'
import { getWeaponUpgradeCost, getHealthUpgradeCost } from '@/utils/marketplace'
import { obstaclesData } from '@/data/obstacles'
import { createInitialPlayer } from '@/game/Player'

export const useGameState = () => {
  const createInitialGameState = useCallback(
    (playerSprites: {
      N: HTMLImageElement | null
      S: HTMLImageElement | null
      E: HTMLImageElement | null
      W: HTMLImageElement | null
    }): GameState => ({
      player: createInitialPlayer(playerSprites),
      projectiles: [],
      zombies: [],
      obstacles: obstaclesData,
      score: 0,
      currentWave: 0,
      zombiesToSpawnThisWave: 0,
      zombiesRemainingInWave: 0,
      zombiesSpawnedThisWave: 0,
      gameOver: false,
      gameWon: false,
      keys: {},
      mousePosition: { x: 70, y: 0 },
      waveTransitioning: false,
      showMarketplace: false,
    }),
    [],
  )

  const gameStateRef = useRef<GameState | null>(null)

  const initializeGameState = useCallback((playerSprites: {
    N: HTMLImageElement | null
    S: HTMLImageElement | null
    E: HTMLImageElement | null
    W: HTMLImageElement | null
  }) => {
    gameStateRef.current = createInitialGameState(playerSprites)
    return gameStateRef.current
  }, [createInitialGameState])

  const resetGameState = useCallback((playerSprites: {
    N: HTMLImageElement | null
    S: HTMLImageElement | null
    E: HTMLImageElement | null
    W: HTMLImageElement | null
  }) => {
    gameStateRef.current = createInitialGameState(playerSprites)
    return gameStateRef.current
  }, [createInitialGameState])

  const startNextWave = useCallback((
    setCurrentWave: (wave: number) => void,
    setWaveMessage: (message: string) => void,
    setGameWon: (won: boolean) => void
  ) => {
    if (!gameStateRef.current || gameStateRef.current.waveTransitioning ||
      gameStateRef.current.gameWon || gameStateRef.current.gameOver) {
      return
    }

    gameStateRef.current.waveTransitioning = true
    gameStateRef.current.currentWave++
    setCurrentWave(gameStateRef.current.currentWave)

    if (gameStateRef.current.currentWave > MAX_WAVES) {
      gameStateRef.current.gameWon = true
      setGameWon(true)
      setWaveMessage(`You survived all ${MAX_WAVES} waves! YOU WIN!`)
      gameStateRef.current.waveTransitioning = false
      return
    }

    // Mostrar marketplace antes de las waves 2+ (después de completar la primera wave)
    if (gameStateRef.current.currentWave >= 2) {
      gameStateRef.current.showMarketplace = true
      gameStateRef.current.waveTransitioning = false
      setWaveMessage("¡Wave completada! Visita el marketplace para mejorar tu equipo.")
      return
    }

    // Configurar la wave (para la primera wave)
    gameStateRef.current.zombiesToSpawnThisWave = 5 + gameStateRef.current.currentWave * 3
    gameStateRef.current.zombiesRemainingInWave = gameStateRef.current.zombiesToSpawnThisWave
    gameStateRef.current.zombiesSpawnedThisWave = 0
    gameStateRef.current.zombies = []

    setWaveMessage(`Wave ${gameStateRef.current.currentWave} starting...`)
    setTimeout(() => {
      setWaveMessage("")
      if (gameStateRef.current) {
        gameStateRef.current.waveTransitioning = false
      }
    }, 3000)
  }, [])

  const continueFromMarketplace = useCallback((
    setWaveMessage: (message: string) => void
  ) => {
    if (!gameStateRef.current) return

    gameStateRef.current.showMarketplace = false
    gameStateRef.current.waveTransitioning = true

    // Configurar la wave
    gameStateRef.current.zombiesToSpawnThisWave = 5 + gameStateRef.current.currentWave * 3
    gameStateRef.current.zombiesRemainingInWave = gameStateRef.current.zombiesToSpawnThisWave
    gameStateRef.current.zombiesSpawnedThisWave = 0
    gameStateRef.current.zombies = []

    setWaveMessage(`Wave ${gameStateRef.current.currentWave} starting...`)
    setTimeout(() => {
      setWaveMessage("")
      if (gameStateRef.current) {
        gameStateRef.current.waveTransitioning = false
      }
    }, 3000)
  }, [])

  const upgradeWeapon = useCallback((setPlayerCoins: (coins: number) => void) => {
    if (!gameStateRef.current) return

    const player = gameStateRef.current.player
    const cost = getWeaponUpgradeCost(player.upgrades.weaponLevel)
    if (player.coins >= cost && player.upgrades.weaponLevel < MAX_UPGRADE_LEVEL) {
      player.coins -= cost
      player.upgrades.weaponLevel++
      player.upgrades.weaponDamage += WEAPON_DAMAGE_INCREASE
      setPlayerCoins(player.coins)
    }
  }, [])

  const upgradeHealth = useCallback((setPlayerCoins: (coins: number) => void, setPlayerHealth: (health: number) => void) => {
    if (!gameStateRef.current) return

    const player = gameStateRef.current.player
    const cost = getHealthUpgradeCost(player.upgrades.healthLevel)
    if (player.coins >= cost && player.upgrades.healthLevel < MAX_UPGRADE_LEVEL) {
      player.coins -= cost
      player.upgrades.healthLevel++
      player.upgrades.maxHealth += HEALTH_INCREASE
      
      // Restaurar vida al comprar mejora de salud
      player.health = player.upgrades.maxHealth
      
      setPlayerCoins(player.coins)
      setPlayerHealth(player.health)
    }
  }, [])

  return {
    gameStateRef,
    initializeGameState,
    resetGameState,
    startNextWave,
    continueFromMarketplace,
    upgradeWeapon,
    upgradeHealth
  }
} 