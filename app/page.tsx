"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useGameState } from '@/hooks/useGameState'
import { useAssetLoader } from '@/hooks/useAssetLoader'
import { useInputHandlers } from '@/hooks/useInputHandlers'
import { GameCanvas } from '@/components/GameCanvas'
import { GameUI } from '@/components/GameUI'

export default function BoxheadGame() {
  const { gameStateRef, initializeGameState, resetGameState, startNextWave } = useGameState()
  const { loadAssets, zombieSpritesRef } = useAssetLoader()
  
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
    const gameState = resetGameState(null)
    if (gameState && gameState.player.sprite) {
      gameState.player.sprite = zombieSpritesRef.current ? 
        Object.values(zombieSpritesRef.current).find(sprite => sprite !== null) || null : null
    }
    setScore(0)
    setCurrentWave(0)
    setPlayerHealth(100)
    setGameOver(false)
    setGameWon(false)
    setWaveMessage("")
    handleStartNextWave()
  }, [resetGameState, zombieSpritesRef, handleStartNextWave])

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
      </div>
    </div>
  )
}
