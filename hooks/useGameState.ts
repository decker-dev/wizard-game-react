import { useCallback, useRef } from 'react'
import { GameState } from '@/types/game'
import { 
  WEAPON_DAMAGE_INCREASE, 
  HEALTH_INCREASE, 
  MAX_UPGRADE_LEVEL,
  PROJECTILE_COUNT_INCREASE,
  PROJECTILE_SIZE_INCREASE,
  FIRE_RATE_IMPROVEMENT,
  SPREAD_INCREASE,
  BASE_ZOMBIES_PER_WAVE,
  ZOMBIES_INCREASE_PER_WAVE,
  EXPONENTIAL_SCALING_INTERVAL,
  EXPONENTIAL_SPAWN_MULTIPLIER
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
      coinParticles: [],
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

    // Waves are now infinite! No more victory condition by waves
    // Victory only comes from player death or manual quit

    // Mostrar marketplace antes de las waves 2+ (después de completar la primera wave)
    if (gameStateRef.current.currentWave >= 2) {
      gameStateRef.current.showMarketplace = true
      gameStateRef.current.waveTransitioning = false
      setWaveMessage("¡Wave completada! Visita el marketplace para mejorar tu equipo.")
      return
    }

    // Configurar la wave con escalado progresivo
    const exponentialBonus = Math.floor(gameStateRef.current.currentWave / EXPONENTIAL_SCALING_INTERVAL)
    const spawnMultiplier = Math.pow(EXPONENTIAL_SPAWN_MULTIPLIER, exponentialBonus)
    const baseZombies = BASE_ZOMBIES_PER_WAVE + (gameStateRef.current.currentWave * ZOMBIES_INCREASE_PER_WAVE)
    gameStateRef.current.zombiesToSpawnThisWave = Math.floor(baseZombies * spawnMultiplier)
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

    // Configurar la wave con escalado progresivo
    const exponentialBonus = Math.floor(gameStateRef.current.currentWave / EXPONENTIAL_SCALING_INTERVAL)
    const spawnMultiplier = Math.pow(EXPONENTIAL_SPAWN_MULTIPLIER, exponentialBonus)
    const baseZombies = BASE_ZOMBIES_PER_WAVE + (gameStateRef.current.currentWave * ZOMBIES_INCREASE_PER_WAVE)
    gameStateRef.current.zombiesToSpawnThisWave = Math.floor(baseZombies * spawnMultiplier)
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
      
      // Incrementar daño base
      player.upgrades.weaponDamage += WEAPON_DAMAGE_INCREASE
      
      // Aplicar mejoras avanzadas según el nivel específico
      switch (player.upgrades.weaponLevel) {
        case 1:
          // Nivel 1: Disparo más rápido
          player.upgrades.fireRate = 200
          break
          
        case 2:
          // Nivel 2: Doble disparo + más rápido
          player.upgrades.projectileCount = 2
          player.upgrades.spread = 0.2
          player.upgrades.fireRate = 180
          break
          
        case 3:
          // Nivel 3: Balas más grandes + más rápido
          player.upgrades.projectileSize = 1.5
          player.upgrades.fireRate = 160
          break
          
        case 4:
          // Nivel 4: Triple disparo
          player.upgrades.projectileCount = 3
          player.upgrades.spread = 0.3
          player.upgrades.fireRate = 150
          break
          
        case 5:
          // Nivel 5: Máximo poder - cuádruple disparo con balas enormes
          player.upgrades.projectileCount = 4
          player.upgrades.spread = 0.4
          player.upgrades.projectileSize = 2.0
          player.upgrades.fireRate = 120
          break
      }
      
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