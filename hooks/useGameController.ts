import { useCallback, useRef, useEffect, useState } from 'react'
import { useGameState } from '@/hooks/useGameState'
import { useAssetLoader } from '@/hooks/useAssetLoader'
import { useInputHandlers } from '@/hooks/useInputHandlers'
import { useLeaderboard } from '@/hooks/useLeaderboard'
import { useGameAudio } from '@/hooks/useGameAudio'
import { useGameScreens } from '@/hooks/useGameScreens'

export function useGameController(autoStart: boolean = false) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

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

  const { loadAssets, creatureSpritesRef, playerSpritesRef, floorTextureRef, healthPackSpriteRef } = useAssetLoader()
  const {
    topScores,
    allScores,
    totalGamesPlayed,
    isLoading: isLoadingScores,
    isSubmitting,
    submitSecureScore,
    recordNewGame
  } = useLeaderboard()
  const { playCreatureDeath, playPlayerCast, playPlayerHit } = useGameAudio()

  // Screen and UI state management (includes gameTracking)
  const {
    screenState,
    gameTracking,
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
    setShowShareModal,
    setPaused
  } = useGameScreens()

  // Pause toggle function
  const togglePause = useCallback(() => {
    setPaused(!screenState.isPaused)
  }, [setPaused, screenState.isPaused])

  // Track fullscreen state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement))
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  // Input handling
  const { handleKeyDown, handleKeyUp, handleMouseMove, handleMouseClick } = useInputHandlers(
    gameStateRef, 
    playPlayerCast, 
    togglePause, 
    isFullscreen
  )

  // Game lifecycle methods
  const handleStartNextWave = useCallback(() => {
    startNextWave(setCurrentWave, setWaveMessage, setGameWon, healthPackSpriteRef.current)
  }, [startNextWave, setCurrentWave, setWaveMessage, setGameWon, healthPackSpriteRef])

  const handleMouseMoveWrapper = useCallback((e: MouseEvent) => {
    handleMouseMove(e, canvasRef)
  }, [handleMouseMove])

  const handleKeyDownWrapper = useCallback((e: KeyboardEvent) => {
    const gameState = gameStateRef.current
    handleKeyDown(e, screenState.isLoading, gameState?.waveTransitioning || false, screenState.isPaused)
  }, [handleKeyDown, screenState.isLoading, screenState.isPaused, gameStateRef])

  const handleKeyUpWrapper = useCallback((e: KeyboardEvent) => {
    handleKeyUp(e, screenState.isPaused)
  }, [handleKeyUp, screenState.isPaused])

  const startGame = useCallback(async () => {
    navigateToGame()

    try {
      const { playerSprites } = await loadAssets()
      const gameState = initializeGameState(playerSprites)

      // Initialize playerHealth with player's health
      setPlayerHealth(gameState.player.health)
      setPlayerCoins(gameState.player.crystals)

      // Registrar nueva partida iniciada
      await recordNewGame()

      // Pasar los cristales iniciales al tracking
      setGameReady(gameState.player.crystals)
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

    // Initialize playerHealth with player's health
    if (gameState) {
      setPlayerHealth(gameState.player.health)
      setPlayerCoins(gameState.player.crystals)
      // Reiniciar tracking con los cristales iniciales
      resetScreenState(gameState.player.crystals)
    } else {
      resetScreenState(0)
    }

    // Registrar nueva partida iniciada (reinicio cuenta como nueva partida)
    await recordNewGame()

    handleStartNextWave()
  }, [resetGameState, playerSpritesRef, resetScreenState, handleStartNextWave, recordNewGame, setPlayerHealth, setPlayerCoins])

  // Score handling seguro
  const handleScoreSubmit = useCallback(async (scoreData: any, clientId: string, gameData: any) => {
    const success = await submitSecureScore(scoreData, clientId, gameData)
    if (success) {
      setTimeout(() => {
        setShowScoreModal(false)
        // No reseteamos automáticamente, volvemos al game over screen
      }, 1000)
    }
    return success
  }, [submitSecureScore, setShowScoreModal])

  const handleSkipScore = useCallback(() => {
    setShowScoreModal(false)
    // No reseteamos el juego, solo cerramos el modal y volvemos al game over
  }, [setShowScoreModal])

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
    continueFromMarketplace(setWaveMessage, healthPackSpriteRef.current)
  }, [continueFromMarketplace, setWaveMessage, healthPackSpriteRef])

  return {
    // State
    screenState,
    gameStateRef,
    canvasRef,
    isFullscreen,

    // Assets
    creatureSpritesRef,
    playerSpritesRef,
    floorTextureRef,
    healthPackSpriteRef,

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

    // Game tracking (for security)
    gameTracking,

    // Actions
    startGame,
    resetGame,
    navigateToHome,
    setShowShareModal,
    setShowScoreModal,
    togglePause,

    // Game actions
    handleStartNextWave,
    handleMouseMoveWrapper,
    handleKeyDownWrapper,
    handleKeyUp: handleKeyUpWrapper,
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