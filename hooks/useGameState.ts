import { useCallback, useRef } from 'react'
import { GameState } from '@/types/game'
import { MAX_WAVES } from '@/constants/game'
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

  return {
    gameStateRef,
    initializeGameState,
    resetGameState,
    startNextWave
  }
} 