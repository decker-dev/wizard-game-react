import { useCallback, useRef } from 'react'
import { GameState } from '@/types/game'
import { PROJECTILE_SPEED, CANVAS_WIDTH, CANVAS_HEIGHT, MAP_WIDTH, MAP_HEIGHT } from '@/constants/game'

export const useInputHandlers = (
  gameStateRef: React.MutableRefObject<GameState | null>,
  playPlayerShoot?: () => void
) => {
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
        
        // Usar el fire rate personalizado del player
        if (now - lastShotTimeRef.current > player.upgrades.fireRate) {
          // Reproducir sonido de disparo
          if (playPlayerShoot) {
            playPlayerShoot()
          }
          
          const baseDirection = { ...player.lastMovementDirection }
          const projectileCount = player.upgrades.projectileCount
          const spread = player.upgrades.spread
          const projectileSize = player.upgrades.projectileSize
          
          if (projectileCount === 1) {
            // Disparo simple
            gameStateRef.current.projectiles.push({
              position: { ...player.position },
              velocity: { x: baseDirection.x * PROJECTILE_SPEED, y: baseDirection.y * PROJECTILE_SPEED },
              radius: 4 * projectileSize,
              speed: PROJECTILE_SPEED,
            })
          } else {
            // Múltiples proyectiles con dispersión
            const baseAngle = Math.atan2(baseDirection.y, baseDirection.x)
            
            for (let i = 0; i < projectileCount; i++) {
              // Calcular ángulo de dispersión más uniforme
              let angleOffset = 0
              
              if (projectileCount === 2) {
                // Para 2 proyectiles: -spread/2 y +spread/2
                angleOffset = (i - 0.5) * spread
              } else {
                // Para 3+ proyectiles: distribuir uniformemente
                angleOffset = (i - (projectileCount - 1) / 2) * (spread / (projectileCount - 1))
              }
              
              const finalAngle = baseAngle + angleOffset
              
              const direction = {
                x: Math.cos(finalAngle),
                y: Math.sin(finalAngle)
              }
              
              gameStateRef.current.projectiles.push({
                position: { ...player.position },
                velocity: { x: direction.x * PROJECTILE_SPEED, y: direction.y * PROJECTILE_SPEED },
                radius: 4 * projectileSize,
                speed: PROJECTILE_SPEED,
              })
            }
          }
          
          lastShotTimeRef.current = now
        }
      }
    }
  }, [gameStateRef, playPlayerShoot])

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
    
    // Get current canvas dimensions
    const canvasWidth = canvas.width
    const canvasHeight = canvas.height
    
    // Scale mouse coordinates to match the game world
    const scaleX = canvasWidth / rect.width
    const scaleY = canvasHeight / rect.height
    
    const scaledMouseX = mouseX * scaleX
    const scaledMouseY = mouseY * scaleY
    
    const { player } = gameStateRef.current
    const cameraX = Math.max(0, Math.min(MAP_WIDTH - canvasWidth, player.position.x - canvasWidth / 2))
    const cameraY = Math.max(0, Math.min(MAP_HEIGHT - canvasHeight, player.position.y - canvasHeight / 2))
    
    gameStateRef.current.mousePosition = { 
      x: scaledMouseX + cameraX,
      y: scaledMouseY + cameraY
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