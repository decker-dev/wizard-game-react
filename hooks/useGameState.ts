import { useCallback, useRef } from 'react'
import { GameState } from '@/types/game'
import {
  SPELL_DAMAGE_INCREASE,
  HEALTH_INCREASE,
  MAX_UPGRADE_LEVEL,
  BASE_CREATURES_PER_WAVE,
  CREATURES_INCREASE_PER_WAVE,
  EXPONENTIAL_SCALING_INTERVAL,
  EXPONENTIAL_SPAWN_MULTIPLIER,
  STARTING_WAVE
} from '@/constants/game'
import { getSpellUpgradeCost, getHealthUpgradeCost } from '@/utils/marketplace'
import { obstaclesData } from '@/data/obstacles'
import { createInitialPlayer } from '@/game/Player'

export const useGameState = () => {
  const createInitialGameState = useCallback(
    (playerSprites: { [key: string]: HTMLImageElement | null }): GameState => ({
      player: createInitialPlayer(playerSprites),
      projectiles: [],
      creatures: [],
      obstacles: obstaclesData,
      score: 0,
      currentWave: STARTING_WAVE - 1,
      creaturesToSpawnThisWave: 0,
      creaturesRemainingInWave: 0,
      creaturesSpawnedThisWave: 0,
      gameOver: false,
      gameWon: false,
      keys: {},
      mousePosition: { x: 70, y: 0 },
      waveTransitioning: false,
      showMarketplace: false,
      crystalParticles: [],
      mobConfig: {
        normal: true,    // ✅ Tiene sprites
        caster: true,    // ✅ Tiene sprites (mage)
        tank: true,      // ✅ Habilitado - usa sprites de normal pero más grande
        speed: false,    // ❌ Sin sprites aún
        explosive: false,// ❌ Sin sprites aún
        boss: true       // ✅ Usa sprites de mage temporalmente
      }
    }),
    [],
  )

  const gameStateRef = useRef<GameState | null>(null)

  const initializeGameState = useCallback((playerSprites: { [key: string]: HTMLImageElement | null }) => {
    gameStateRef.current = createInitialGameState(playerSprites)
    return gameStateRef.current
  }, [createInitialGameState])

  const resetGameState = useCallback((playerSprites: { [key: string]: HTMLImageElement | null }) => {
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
    const baseCreatures = BASE_CREATURES_PER_WAVE + (gameStateRef.current.currentWave * CREATURES_INCREASE_PER_WAVE)
    gameStateRef.current.creaturesToSpawnThisWave = Math.floor(baseCreatures * spawnMultiplier)
    gameStateRef.current.creaturesRemainingInWave = gameStateRef.current.creaturesToSpawnThisWave
    gameStateRef.current.creaturesSpawnedThisWave = 0
    gameStateRef.current.creatures = []

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
    const baseCreatures = BASE_CREATURES_PER_WAVE + (gameStateRef.current.currentWave * CREATURES_INCREASE_PER_WAVE)
    gameStateRef.current.creaturesToSpawnThisWave = Math.floor(baseCreatures * spawnMultiplier)
    gameStateRef.current.creaturesRemainingInWave = gameStateRef.current.creaturesToSpawnThisWave
    gameStateRef.current.creaturesSpawnedThisWave = 0
    gameStateRef.current.creatures = []

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
    const cost = getSpellUpgradeCost(player.upgrades.spellLevel)
    if (player.crystals >= cost && player.upgrades.spellLevel < MAX_UPGRADE_LEVEL) {
      player.crystals -= cost
      player.upgrades.spellLevel++

      // Incrementar daño base
      player.upgrades.spellDamage += SPELL_DAMAGE_INCREASE

      // Aplicar mejoras avanzadas según el nivel específico
      switch (player.upgrades.spellLevel) {
        case 1:
          // Nivel 1: Lanzamiento más rápido
          player.upgrades.castRate = 200
          break

        case 2:
          // Nivel 2: Doble hechizo + más rápido
          player.upgrades.projectileCount = 2
          player.upgrades.spread = 0.2
          player.upgrades.castRate = 180
          break

        case 3:
          // Nivel 3: Hechizos más grandes + más rápido
          player.upgrades.projectileSize = 1.5
          player.upgrades.castRate = 160
          break

        case 4:
          // Nivel 4: Triple hechizo
          player.upgrades.projectileCount = 3
          player.upgrades.spread = 0.3
          player.upgrades.castRate = 150
          break

        case 5:
          // Nivel 5: Máximo poder - cuádruple hechizo con proyectiles enormes
          player.upgrades.projectileCount = 4
          player.upgrades.spread = 0.4
          player.upgrades.projectileSize = 2.0
          player.upgrades.castRate = 120
          break
      }

      setPlayerCoins(player.crystals)
    }
  }, [])

  const upgradeHealth = useCallback((setPlayerCoins: (coins: number) => void, setPlayerHealth: (health: number) => void) => {
    if (!gameStateRef.current) return

    const player = gameStateRef.current.player
    const cost = getHealthUpgradeCost(player.upgrades.healthLevel)
    if (player.crystals >= cost && player.upgrades.healthLevel < MAX_UPGRADE_LEVEL) {
      player.crystals -= cost
      player.upgrades.healthLevel++
      player.upgrades.maxHealth += HEALTH_INCREASE

      // Restaurar vida al comprar mejora de vida
      player.health = player.upgrades.maxHealth

      setPlayerCoins(player.crystals)
      setPlayerHealth(player.health)
    }
  }, [])

  // Funciones para manejar configuración de mobs
  const toggleMobType = useCallback((mobType: 'normal' | 'caster' | 'tank' | 'speed' | 'explosive' | 'boss') => {
    if (!gameStateRef.current) return
    gameStateRef.current.mobConfig[mobType] = !gameStateRef.current.mobConfig[mobType]
  }, [])

  const setMobConfig = useCallback((config: Partial<{ normal: boolean, caster: boolean, tank: boolean, speed: boolean, explosive: boolean, boss: boolean }>) => {
    if (!gameStateRef.current) return
    gameStateRef.current.mobConfig = { ...gameStateRef.current.mobConfig, ...config }
  }, [])

  const getMobConfig = useCallback(() => {
    return gameStateRef.current?.mobConfig || {
      normal: true,    // ✅ Tiene sprites
      caster: true,    // ✅ Tiene sprites (mage)
      tank: true,      // ✅ Habilitado - usa sprites de normal pero más grande
      speed: false,    // ❌ Sin sprites aún
      explosive: false,// ❌ Sin sprites aún
      boss: true       // ✅ Usa sprites de mage temporalmente
    }
  }, [])

  return {
    gameStateRef,
    initializeGameState,
    resetGameState,
    startNextWave,
    continueFromMarketplace,
    upgradeWeapon,
    upgradeHealth,
    toggleMobType,
    setMobConfig,
    getMobConfig
  }
} 