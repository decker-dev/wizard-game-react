import { useCallback, useRef } from 'react'
import { GameState } from '@/types/game'
import { PROJECTILE_SPEED, CANVAS_WIDTH, CANVAS_HEIGHT, MAP_WIDTH, MAP_HEIGHT } from '@/constants/game'

export const useInputHandlers = (gameStateRef: React.MutableRefObject<GameState | null>) => {
  const lastShotTimeRef = useRef<number>(0)

  const handleKeyDown = useCallback((e: KeyboardEvent, isLoading: boolean, waveTransitioning: boolean) => {
    if (!gameStateRef.current) return
    
    gameStateRef.current.keys[e.key.toLowerCase()] = true
    
    if (e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault()
      if (
        !gameStateRef.current.gameOver &&
        !gameStateRef.current.gameWon &&
        !isLoading &&
        !waveTransitioning
      ) {
        const { player } = gameStateRef.current
        const now = Date.now()
        if (now - lastShotTimeRef.current > 250) {
          const direction = { ...player.lastMovementDirection }
          gameStateRef.current.projectiles.push({
            position: { ...player.position },
            velocity: { x: direction.x * PROJECTILE_SPEED, y: direction.y * PROJECTILE_SPEED },
            radius: 4,
            speed: PROJECTILE_SPEED,
          })
          lastShotTimeRef.current = now
        }
      }
    }
  }, [gameStateRef])

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (!gameStateRef.current) return
    gameStateRef.current.keys[e.key.toLowerCase()] = false
  }, [gameStateRef])

  const handleMouseMove = useCallback((e: MouseEvent, canvasRef: React.RefObject<HTMLCanvasElement | null>) => {
    if (!gameStateRef.current || !canvasRef.current) return
    
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    
    const { player } = gameStateRef.current
    const cameraX = Math.max(0, Math.min(MAP_WIDTH - CANVAS_WIDTH, player.position.x - CANVAS_WIDTH / 2))
    const cameraY = Math.max(0, Math.min(MAP_HEIGHT - CANVAS_HEIGHT, player.position.y - CANVAS_HEIGHT / 2))
    
    gameStateRef.current.mousePosition = { 
      x: mouseX + cameraX,
      y: mouseY + cameraY
    }
  }, [gameStateRef])

  const handleMouseClick = useCallback((e: MouseEvent) => {
    // Ya no disparamos con click - se maneja con spacebar
  }, [])

  return {
    handleKeyDown,
    handleKeyUp,
    handleMouseMove,
    handleMouseClick
  }
} 