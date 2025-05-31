"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useGameState } from '@/hooks/useGameState'
import { useAssetLoader } from '@/hooks/useAssetLoader'
import { useInputHandlers } from '@/hooks/useInputHandlers'
import { GameCanvas } from '@/components/GameCanvas'
import { GameUI } from '@/components/GameUI'

export default function BoxheadGame() {
  const { gameStateRef, initializeGameState, resetGameState, startNextWave } = useGameState()
  const { loadAssets, zombieSpritesRef, playerImageRef } = useAssetLoader()
  
  console.log('hola')
  const [score, setScore] = useState(0)
  const [currentWave, setCurrentWave] = useState(0)
  const [playerHealth, setPlayerHealth] = useState(100)
  const [gameOver, setGameOver] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [waveMessage, setWaveMessage] = useState("")

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

  const resetGame = useCallback(() => {
    const gameState = resetGameState(playerImageRef.current)
    if (gameState && playerImageRef.current) {
      gameState.player.sprite = playerImageRef.current
    }
    setScore(0)
    setCurrentWave(0)
    setPlayerHealth(100)
    setGameOver(false)
    setGameWon(false)
    setWaveMessage("")
    handleStartNextWave()
  }, [resetGameState, playerImageRef, handleStartNextWave])

  useEffect(() => {
    const loadGameAssets = async () => {
      try {
        const { playerSprite } = await loadAssets()
        const gameState = initializeGameState(playerSprite)
        if (gameState) {
          gameState.player.sprite = playerSprite
        }
        setIsLoading(false)
        handleStartNextWave()
      } catch (error) {
        console.error("Failed to load game assets:", error)
        setIsLoading(false)
      }
    }

    loadGameAssets()
  }, [loadAssets, initializeGameState, handleStartNextWave])

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDownWrapper)
    window.addEventListener("keyup", handleKeyUp)
    
    return () => {
      window.removeEventListener("keydown", handleKeyDownWrapper)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [handleKeyDownWrapper, handleKeyUp])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-800 text-white text-2xl">
        Loading Game Assets...
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 p-4">
      <GameUI
        score={score}
        currentWave={currentWave}
        playerHealth={playerHealth}
        gameOver={gameOver}
        gameWon={gameWon}
        onResetGame={resetGame}
      />
      
      <div className="relative shadow-2xl">
        <GameCanvas
          gameState={gameStateRef.current}
          zombieSprites={zombieSpritesRef.current}
          waveMessage={waveMessage}
          startNextWave={handleStartNextWave}
          setScore={setScore}
          setPlayerHealth={setPlayerHealth}
          setGameOver={setGameOver}
          onMouseMove={handleMouseMoveWrapper}
          onMouseClick={handleMouseClick}
        />
        
        {/* Game Over/Won Overlay */}
        {(gameOver || gameWon) && (
          <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center text-white">
            <h2 className="text-5xl font-bold mb-6">{gameWon ? "YOU WIN!" : "GAME OVER!"}</h2>
            {gameWon && <p className="text-2xl mb-4">You successfully defended against all zombie waves!</p>}
            <p className="text-2xl mb-4">Zombies Killed: {score}</p>
            <p className="text-2xl mb-6">Survived to Wave: {currentWave}</p>
            <button
              onClick={resetGame}
              className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xl transition-colors"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
