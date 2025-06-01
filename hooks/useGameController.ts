import { useCallback, useRef, useEffect } from 'react'
import { useGameState } from '@/hooks/useGameState'
import { useAssetLoader } from '@/hooks/useAssetLoader'
import { useInputHandlers } from '@/hooks/useInputHandlers'
import { useLeaderboard } from '@/hooks/useLeaderboard'
import { useGameAudio } from '@/hooks/useGameAudio'
import { useGameScreens } from '@/hooks/useGameScreens'

export function useGameController(autoStart: boolean = false) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Core game hooks
  const {
    gameStateRef,
    initializeGameState,
    resetGameState,
    startNextWave,
    continueFromMarketplace,
    upgradeWeapon,
    upgradeHealth
  } = useGameState()

  const { loadAssets, creatureSpritesRef, playerSpritesRef, floorTextureRef } = useAssetLoader()
  const {
    topScores,
    allScores,
    totalGamesPlayed,
    isLoading: isLoadingScores,
    isSubmitting,
    submitScore,
    recordNewGame
  } = useLeaderboard()
  const { playCreatureDeath, playPlayerCast, playPlayerHit } = useGameAudio()

  // Screen and UI state management
  const {
    screenState,
    navigateToHome,
    navigateToGame,
    setGameReady,
    resetGameState: resetScreenState,
    setScore,
    setCurrentWave,
    setPlayerHealth,
    setPlayerCoins,
    setGameOver,
    setGameWon,
    setWaveMessage,
    setShowScoreModal,
    setShowShareModal
  } = useGameScreens()

  // Input handling
  const { handleKeyDown, handleKeyUp, handleMouseMove, handleMouseClick } = useInputHandlers(gameStateRef, playPlayerCast)

  // Game lifecycle methods
  const handleStartNextWave = useCallback(() => {
    startNextWave(setCurrentWave, setWaveMessage, setGameWon)
  }, [startNextWave, setCurrentWave, setWaveMessage, setGameWon])

  const handleMouseMoveWrapper = useCallback((e: MouseEvent) => {
    handleMouseMove(e, canvasRef)
  }, [handleMouseMove])

  const handleKeyDownWrapper = useCallback((e: KeyboardEvent) => {
    const gameState = gameStateRef.current
    handleKeyDown(e, screenState.isLoading, gameState?.waveTransitioning || false)
  }, [handleKeyDown, screenState.isLoading, gameStateRef])

  const startGame = useCallback(async () => {
    navigateToGame()

    try {
      const { playerSprites } = await loadAssets()
      const gameState = initializeGameState(playerSprites)

      // Initialize playerHealth with player's mana
      setPlayerHealth(gameState.player.mana)
      setPlayerCoins(gameState.player.crystals)

      // Registrar nueva partida iniciada
      await recordNewGame()

      setGameReady()
      handleStartNextWave()
    } catch (error) {
      console.error("Failed to load game assets:", error)
      navigateToHome()
    }
  }, [loadAssets, initializeGameState, handleStartNextWave, navigateToGame, setGameReady, navigateToHome, recordNewGame, setPlayerHealth, setPlayerCoins])

  // Auto-start game when needed (for /game route)
  useEffect(() => {
    if (autoStart && screenState.currentScreen === 'home') {
      startGame()
    }
  }, [autoStart, startGame, screenState.currentScreen])

  const resetGame = useCallback(async () => {
    const gameState = resetGameState(playerSpritesRef.current)
    resetScreenState()

    // Initialize playerHealth with player's mana
    if (gameState) {
      setPlayerHealth(gameState.player.mana)
      setPlayerCoins(gameState.player.crystals)
    }

    // Registrar nueva partida iniciada (reinicio cuenta como nueva partida)
    await recordNewGame()

    handleStartNextWave()
  }, [resetGameState, playerSpritesRef, resetScreenState, handleStartNextWave, recordNewGame, setPlayerHealth, setPlayerCoins])

  // Score handling
  const handleScoreSubmit = useCallback(async (scoreData: any) => {
    const success = await submitScore(scoreData)
    if (success) {
      setTimeout(() => {
        setShowScoreModal(false)
        resetGame()
      }, 1000)
    }
    return success
  }, [submitScore, setShowScoreModal, resetGame])

  const handleSkipScore = useCallback(() => {
    setShowScoreModal(false)
    resetGame()
  }, [setShowScoreModal, resetGame])

  const handleSaveScore = useCallback(() => {
    setShowScoreModal(true)
  }, [setShowScoreModal])

  // Upgrade handling
  const handleUpgradeWeapon = useCallback(() => {
    upgradeWeapon(setPlayerCoins)
  }, [upgradeWeapon, setPlayerCoins])

  const handleUpgradeHealth = useCallback(() => {
    upgradeHealth(setPlayerCoins, setPlayerHealth)
  }, [upgradeHealth, setPlayerCoins, setPlayerHealth])

  const handleContinueFromMarketplace = useCallback(() => {
    continueFromMarketplace(setWaveMessage)
  }, [continueFromMarketplace, setWaveMessage])

  return {
    // State
    screenState,
    gameStateRef,
    canvasRef,

    // Assets
    creatureSpritesRef,
    playerSpritesRef,
    floorTextureRef,

    // Leaderboard
    topScores,
    allScores,
    totalGamesPlayed,
    isLoadingScores,
    isSubmitting,

    // Audio
    playCreatureDeath,
    playPlayerCast,
    playPlayerHit,

    // Actions
    startGame,
    resetGame,
    navigateToHome,
    setShowShareModal,
    setShowScoreModal,

    // Game actions
    handleStartNextWave,
    handleMouseMoveWrapper,
    handleKeyDownWrapper,
    handleKeyUp,
    handleMouseClick,

    // Score actions
    handleScoreSubmit,
    handleSkipScore,
    handleSaveScore,

    // Upgrade actions
    handleUpgradeWeapon,
    handleUpgradeHealth,
    handleContinueFromMarketplace,

    // State setters (for GameCanvas)
    setScore,
    setPlayerHealth,
    setPlayerCoins,
    setGameOver
  }
} 