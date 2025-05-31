import React, { useRef, useEffect, useCallback, useState } from 'react'
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
  floorTexture?: HTMLImageElement | null
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
  floorTexture,
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
  const containerRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [canvasDimensions, setCanvasDimensions] = useState({
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT
  })

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = Boolean(document.fullscreenElement)
      setIsFullscreen(isCurrentlyFullscreen)
      
      if (isCurrentlyFullscreen) {
        // Calculate fullscreen dimensions maintaining aspect ratio
        const aspectRatio = CANVAS_WIDTH / CANVAS_HEIGHT
        const screenWidth = window.innerWidth
        const screenHeight = window.innerHeight
        const screenAspectRatio = screenWidth / screenHeight
        
        let newWidth, newHeight
        if (screenAspectRatio > aspectRatio) {
          // Screen is wider, constrain by height
          newHeight = screenHeight - 100 // Leave some margin
          newWidth = newHeight * aspectRatio
        } else {
          // Screen is taller, constrain by width
          newWidth = screenWidth - 100 // Leave some margin
          newHeight = newWidth / aspectRatio
        }
        
        setCanvasDimensions({ width: newWidth, height: newHeight })
      } else {
        // Back to normal size
        setCanvasDimensions({ width: CANVAS_WIDTH, height: CANVAS_HEIGHT })
      }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  const toggleFullscreen = async () => {
    if (!containerRef.current) return

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error)
    }
  }

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
        render(ctx, gameState, zombieSprites, waveMessage, canvasDimensions.width, canvasDimensions.height, floorTexture)
      }
    }

    animationFrameRef.current = requestAnimationFrame(gameLoop)
  }, [gameState, zombieSprites, floorTexture, waveMessage, startNextWave, setScore, setPlayerHealth, setGameOver, setPlayerCoins, canvasDimensions])

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
    <div 
      ref={containerRef}
      className={`relative ${isFullscreen ? 'flex items-center justify-center min-h-screen bg-black' : ''}`}
    >
      {/* Fullscreen Toggle Button */}
      <button
        onClick={toggleFullscreen}
        className={`absolute ${
          isFullscreen ? 'top-4 right-4 z-50' : 'top-2 right-2 z-10'
        } bg-orange-600/80 hover:bg-orange-600 border border-orange-500/50 text-white p-2 rounded font-mono font-bold transition-all duration-200 transform hover:scale-105 hover:border-orange-500`}
        title={isFullscreen ? "Salir de pantalla completa (ESC)" : "Pantalla completa"}
      >
        {isFullscreen ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 110 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 11-2 0V4zm9 1a1 1 0 110-2h4a1 1 0 011 1v4a1 1 0 11-2 0V6.414l-2.293 2.293a1 1 0 01-1.414-1.414L13.586 5H12zm-9 7a1 1 0 112 0v1.586l2.293-2.293a1 1 0 011.414 1.414L6.414 15H8a1 1 0 110 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 110-2h1.586l-2.293-2.293a1 1 0 011.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      {/* Instructions for fullscreen mode */}
      {isFullscreen && (
        <div className="absolute top-4 left-4 z-40 bg-black/80 backdrop-blur-sm border border-orange-500/30 rounded-lg p-3">
          <p className="text-orange-400 font-mono text-sm">Presiona ESC para salir de pantalla completa</p>
        </div>
      )}

      <canvas
        ref={canvasRef}
        width={canvasDimensions.width}
        height={canvasDimensions.height}
        className={`${
          isFullscreen 
            ? 'border-2 border-orange-500/70 bg-gray-300 rounded shadow-2xl' 
            : 'border-4 border-orange-500/50 bg-gray-300 rounded-lg shadow-lg hover:border-orange-500/70 transition-colors'
        }`}
        style={{
          imageRendering: 'pixelated', // Maintain pixel art look when scaled
        }}
      />
    </div>
  )
} 