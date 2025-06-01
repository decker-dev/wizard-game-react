import { useState, useCallback } from 'react'
import { BASE_MAX_MANA } from '@/constants/game'

export type GameScreen = 'home' | 'playing' | 'gameOver'

export interface GameScreenState {
  currentScreen: GameScreen
  score: number
  currentWave: number
  playerHealth: number
  playerCoins: number
  gameOver: boolean
  gameWon: boolean
  isLoading: boolean
  waveMessage: string
  showScoreModal: boolean
  showShareModal: boolean
}

export function useGameScreens() {
  const [screenState, setScreenState] = useState<GameScreenState>({
    currentScreen: 'home',
    score: 0,
    currentWave: 0,
    playerHealth: BASE_MAX_MANA,
    playerCoins: 0,
    gameOver: false,
    gameWon: false,
    isLoading: false,
    waveMessage: "",
    showScoreModal: false,
    showShareModal: false
  })

  const updateScreenState = useCallback((updates: Partial<GameScreenState>) => {
    setScreenState(prev => ({ ...prev, ...updates }))
  }, [])

  const navigateToHome = useCallback(() => {
    updateScreenState({
      currentScreen: 'home',
      showScoreModal: false,
      gameOver: false,
      gameWon: false
    })
  }, [updateScreenState])

  const navigateToGame = useCallback(() => {
    updateScreenState({
      currentScreen: 'playing',
      isLoading: true
    })
  }, [updateScreenState])

  const setGameReady = useCallback(() => {
    updateScreenState({
      isLoading: false,
      score: 0,
      currentWave: 0,
      playerHealth: BASE_MAX_MANA,
      playerCoins: 0,
      gameOver: false,
      gameWon: false,
      waveMessage: "",
      showScoreModal: false
    })
  }, [updateScreenState])

  const resetGameState = useCallback(() => {
    updateScreenState({
      score: 0,
      currentWave: 0,
      playerHealth: BASE_MAX_MANA,
      playerCoins: 0,
      gameOver: false,
      gameWon: false,
      waveMessage: "",
      showScoreModal: false
    })
  }, [updateScreenState])

  const setScore = useCallback((score: number) => {
    updateScreenState({ score })
  }, [updateScreenState])

  const setCurrentWave = useCallback((currentWave: number) => {
    updateScreenState({ currentWave })
  }, [updateScreenState])

  const setPlayerHealth = useCallback((playerHealth: number) => {
    updateScreenState({ playerHealth })
  }, [updateScreenState])

  const setPlayerCoins = useCallback((playerCoins: number) => {
    updateScreenState({ playerCoins })
  }, [updateScreenState])

  const setGameOver = useCallback((gameOver: boolean) => {
    updateScreenState({ gameOver })
  }, [updateScreenState])

  const setGameWon = useCallback((gameWon: boolean) => {
    updateScreenState({ gameWon })
  }, [updateScreenState])

  const setWaveMessage = useCallback((waveMessage: string) => {
    updateScreenState({ waveMessage })
  }, [updateScreenState])

  const setShowScoreModal = useCallback((showScoreModal: boolean) => {
    updateScreenState({ showScoreModal })
  }, [updateScreenState])

  const setShowShareModal = useCallback((showShareModal: boolean) => {
    updateScreenState({ showShareModal })
  }, [updateScreenState])

  return {
    screenState,
    updateScreenState,
    navigateToHome,
    navigateToGame,
    setGameReady,
    resetGameState,
    setScore,
    setCurrentWave,
    setPlayerHealth,
    setPlayerCoins,
    setGameOver,
    setGameWon,
    setWaveMessage,
    setShowScoreModal,
    setShowShareModal
  }
} 