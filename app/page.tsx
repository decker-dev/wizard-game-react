"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useGameState } from '@/hooks/useGameState'
import { useAssetLoader } from '@/hooks/useAssetLoader'
import { useInputHandlers } from '@/hooks/useInputHandlers'
import { useLeaderboard } from '@/hooks/useLeaderboard'
import { GameCanvas } from '@/components/GameCanvas'
import { GameUI } from '@/components/GameUI'
import { HomeScreen } from '@/components/HomeScreen'
import { ScoreSubmissionModal } from '@/components/ScoreSubmissionModal'

type GameScreen = 'home' | 'playing' | 'gameOver'

export default function BoxheadGame() {
  const { gameStateRef, initializeGameState, resetGameState, startNextWave } = useGameState()
  const { loadAssets, zombieSpritesRef, playerSpritesRef, floorTextureRef } = useAssetLoader()
  const { 
    topScores, 
    allScores, 
    isLoading: isLoadingScores, 
    isSubmitting, 
    submitScore 
  } = useLeaderboard()
  
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('home')
  const [score, setScore] = useState(0)
  const [currentWave, setCurrentWave] = useState(0)
  const [playerHealth, setPlayerHealth] = useState(100)
  const [playerCoins, setPlayerCoins] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [waveMessage, setWaveMessage] = useState("")
  const [showScoreModal, setShowScoreModal] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  const { handleKeyDown, handleKeyUp, handleMouseMove, handleMouseClick } = useInputHandlers(gameStateRef)

  const handleStartNextWave = useCallback(() => {
    startNextWave(setCurrentWave, setWaveMessage, setGameWon)
  }, [startNextWave])

  const handleMouseMoveWrapper = useCallback((e: MouseEvent) => {
    handleMouseMove(e, canvasRef)
  }, [handleMouseMove])

  const handleKeyDownWrapper = useCallback((e: KeyboardEvent) => {
    const gameState = gameStateRef.current
    handleKeyDown(e, isLoading, gameState?.waveTransitioning || false)
  }, [handleKeyDown, isLoading, gameStateRef])

  const startGame = useCallback(async () => {
    setIsLoading(true)
    setCurrentScreen('playing')
    
    try {
      const { playerSprites } = await loadAssets()
      const gameState = initializeGameState(playerSprites)
      
      // Reset all game state
      setScore(0)
      setCurrentWave(0)
      setPlayerHealth(100)
      setPlayerCoins(0)
      setGameOver(false)
      setGameWon(false)
      setWaveMessage("")
      setShowScoreModal(false)
      
      setIsLoading(false)
      handleStartNextWave()
    } catch (error) {
      console.error("Failed to load game assets:", error)
      setIsLoading(false)
      setCurrentScreen('home')
    }
  }, [loadAssets, initializeGameState, handleStartNextWave])

  const returnToHome = useCallback(() => {
    setCurrentScreen('home')
    setShowScoreModal(false)
    setGameOver(false)
    setGameWon(false)
  }, [])

  const resetGame = useCallback(() => {
    const gameState = resetGameState(playerSpritesRef.current)
    setScore(0)
    setCurrentWave(0)
    setPlayerHealth(100)
    setPlayerCoins(0)
    setGameOver(false)
    setGameWon(false)
    setWaveMessage("")
    setShowScoreModal(false)
    handleStartNextWave()
  }, [resetGameState, playerSpritesRef, handleStartNextWave])

  const handleScoreSubmit = useCallback(async (scoreData: any) => {
    const success = await submitScore(scoreData)
    if (success) {
      setTimeout(() => {
        setShowScoreModal(false)
        returnToHome()
      }, 1000)
    }
    return success
  }, [submitScore, returnToHome])

  const handleSkipScore = useCallback(() => {
    setShowScoreModal(false)
    returnToHome()
  }, [returnToHome])

  // Manejar cuando el juego termina
  useEffect(() => {
    if ((gameOver || gameWon) && currentScreen === 'playing') {
      // Mostrar modal de score después de un breve delay
      const timer = setTimeout(() => {
        setShowScoreModal(true)
      }, 2000)
      
      return () => clearTimeout(timer)
    }
  }, [gameOver, gameWon, currentScreen])

  useEffect(() => {
    if (currentScreen === 'playing') {
      window.addEventListener("keydown", handleKeyDownWrapper)
      window.addEventListener("keyup", handleKeyUp)
      
      return () => {
        window.removeEventListener("keydown", handleKeyDownWrapper)
        window.removeEventListener("keyup", handleKeyUp)
      }
    }
  }, [handleKeyDownWrapper, handleKeyUp, currentScreen])

  // Home Screen
  if (currentScreen === 'home') {
    return (
      <HomeScreen
        onStartGame={startGame}
        topScores={topScores}
        allScores={allScores}
        isLoadingScores={isLoadingScores}
      />
    )
  }

  // Loading Screen
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-800 text-white text-2xl">
        Loading Game Assets...
      </div>
    )
  }

  // Game Screen
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 p-4">
      <GameUI
        score={score}
        currentWave={currentWave}
        playerHealth={playerHealth}
        playerCoins={playerCoins}
        gameOver={gameOver}
        gameWon={gameWon}
        onResetGame={resetGame}
        onReturnHome={returnToHome}
      />
      
      <div className="relative shadow-2xl">
        <GameCanvas
          gameState={gameStateRef.current}
          zombieSprites={zombieSpritesRef.current}
          floorTexture={floorTextureRef.current}
          waveMessage={waveMessage}
          startNextWave={handleStartNextWave}
          setScore={setScore}
          setPlayerHealth={setPlayerHealth}
          setPlayerCoins={setPlayerCoins}
          setGameOver={setGameOver}
          onMouseMove={handleMouseMoveWrapper}
          onMouseClick={handleMouseClick}
        />
        
        {/* Game Over/Won Overlay */}
        {(gameOver || gameWon) && (
          <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center text-white">
            <h2 className="text-5xl font-bold mb-6">{gameWon ? "¡GANASTE!" : "GAME OVER!"}</h2>
            {gameWon && <p className="text-2xl mb-4">¡Defendiste exitosamente contra todas las waves de zombies!</p>}
            <p className="text-2xl mb-4">Zombies Eliminados: {score}</p>
            <p className="text-2xl mb-4">💰 Monedas Recolectadas: {playerCoins}</p>
            <p className="text-2xl mb-6">Sobreviviste hasta la Wave: {currentWave}</p>
            
            {!showScoreModal && (
              <div className="flex gap-4">
                <button
                  onClick={resetGame}
                  className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xl transition-colors"
                >
                  Jugar de Nuevo
                </button>
                <button
                  onClick={returnToHome}
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xl transition-colors"
                >
                  Volver al Inicio
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Score Submission Modal */}
      <ScoreSubmissionModal
        score={score}
        wavesSurvived={currentWave}
        isVisible={showScoreModal}
        onSubmit={handleScoreSubmit}
        onSkip={handleSkipScore}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
