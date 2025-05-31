import React, { useRef, useEffect, useCallback } from 'react'
import { GameState } from '@/types/game'
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '@/constants/game'
import { updatePlayer } from '@/game/Player'
import { updateZombies } from '@/game/Zombies'
import { updateProjectiles } from '@/game/Projectiles'
import { checkCollisions } from '@/game/Collisions'
import { render } from '@/game/Renderer'

interface GameCanvasProps {
  gameState: GameState | null
  zombieSprites: {[key: string]: HTMLImageElement | null}
  waveMessage: string
  startNextWave: () => void
  setScore: (score: number) => void
  setPlayerHealth: (health: number) => void
  setPlayerCoins: (coins: number) => void
  setGameOver: (gameOver: boolean) => void
  onMouseMove: (e: MouseEvent) => void
  onMouseClick: (e: MouseEvent) => void
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  gameState,
  zombieSprites,
  waveMessage,
  startNextWave,
  setScore,
  setPlayerHealth,
  setPlayerCoins,
  setGameOver,
  onMouseMove,
  onMouseClick
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number | null>(null)

  const gameLoop = useCallback(() => {
    if (!gameState) return

    if (!gameState.gameOver && !gameState.gameWon) {
      updatePlayer(gameState)
      updateZombies(gameState)
      updateProjectiles(gameState)
      checkCollisions(gameState, startNextWave, setScore, setPlayerHealth, setGameOver, setPlayerCoins)
    }

    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        render(ctx, gameState, zombieSprites, waveMessage)
      }
    }

    animationFrameRef.current = requestAnimationFrame(gameLoop)
  }, [gameState, zombieSprites, waveMessage, startNextWave, setScore, setPlayerHealth, setGameOver, setPlayerCoins])

  useEffect(() => {
    if (gameState && !gameState.gameOver && !gameState.gameWon) {
      animationFrameRef.current = requestAnimationFrame(gameLoop)
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [gameLoop, gameState])

  useEffect(() => {
    const canvasElement = canvasRef.current
    if (canvasElement) {
      canvasElement.addEventListener("mousemove", onMouseMove)
      canvasElement.addEventListener("click", onMouseClick)
      
      return () => {
        canvasElement.removeEventListener("mousemove", onMouseMove)
        canvasElement.removeEventListener("click", onMouseClick)
      }
    }
  }, [onMouseMove, onMouseClick])

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className="border-4 border-orange-500/50 bg-gray-300 rounded-lg shadow-lg hover:border-orange-500/70 transition-colors"
    />
  )
} 