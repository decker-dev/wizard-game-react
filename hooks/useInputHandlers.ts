import { useCallback, useRef } from 'react'
import { GameState } from '@/types/game'
import { PROJECTILE_SPEED, CANVAS_WIDTH, CANVAS_HEIGHT, MAP_WIDTH, MAP_HEIGHT } from '@/constants/game'

export const useInputHandlers = (
  gameStateRef: React.MutableRefObject<GameState | null>,
  playPlayerCast?: () => void,
  togglePause?: () => void,
  isFullscreen?: boolean
) => {
  const lastCastTimeRef = useRef<number>(0)

  const handleKeyDown = useCallback((e: KeyboardEvent, isLoading: boolean, waveTransitioning: boolean, isPaused?: boolean) => {
    if (!gameStateRef.current) return

    // Handle pause functionality first (works even when paused)
    if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
      e.preventDefault()
      
      // In fullscreen mode, ESC should exit fullscreen, not pause
      if (e.key === 'Escape' && isFullscreen) {
        // Let the browser handle ESC for fullscreen exit
        return
      }
      
      // Otherwise, toggle pause
      if (togglePause) {
        togglePause()
      }
      return
    }

    // If game is paused, don't process other inputs (except pause toggle above)
    if (isPaused) {
      return
    }

    // Prevenir el comportamiento por defecto para teclas de movimiento y acción
    const movementKeys = ['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ', 'spacebar']
    if (movementKeys.includes(e.key.toLowerCase())) {
      e.preventDefault()
    }

    gameStateRef.current.keys[e.key.toLowerCase()] = true

    if (e.key === ' ' || e.key === 'Spacebar') {
      console.log('Spacebar pressed! Game state:', {
        gameOver: gameStateRef.current.gameOver,
        gameWon: gameStateRef.current.gameWon,
        isLoading,
        waveTransitioning
      })
      
      if (
        !gameStateRef.current.gameOver &&
        !gameStateRef.current.gameWon &&
        !isLoading &&
        !waveTransitioning
      ) {
        const { player } = gameStateRef.current
        const now = Date.now()

        // Usar el cast rate personalizado del player
        if (now - lastCastTimeRef.current > player.upgrades.castRate) {
          console.log('Casting spell! Cast rate:', player.upgrades.castRate, 'Time since last cast:', now - lastCastTimeRef.current)

          // Reproducir sonido de lanzamiento de hechizo
          if (playPlayerCast) {
            playPlayerCast()
          }

          const baseDirection = { ...player.lastMovementDirection }
          const projectileCount = player.upgrades.projectileCount
          const spread = player.upgrades.spread
          const projectileSize = player.upgrades.projectileSize

          console.log('Spell parameters:', { baseDirection, projectileCount, spread, projectileSize })

          if (projectileCount === 1) {
            // Hechizo simple
            const newProjectile = {
              position: { ...player.position },
              velocity: { x: baseDirection.x * PROJECTILE_SPEED, y: baseDirection.y * PROJECTILE_SPEED },
              radius: 4.1 * projectileSize,
              speed: PROJECTILE_SPEED,
              isMagicBolt: false // Player spells are not magic bolts (those are enemy projectiles)
            }
            gameStateRef.current.projectiles.push(newProjectile)
            console.log('Created spell projectile:', newProjectile)
          } else {
            // Múltiples hechizos con dispersión
            const baseAngle = Math.atan2(baseDirection.y, baseDirection.x)

            for (let i = 0; i < projectileCount; i++) {
              // Calcular ángulo de dispersión más uniforme
              let angleOffset = 0

              if (projectileCount === 2) {
                // Para 2 hechizos: -spread/2 y +spread/2
                angleOffset = (i - 0.5) * spread
              } else {
                // Para 3+ hechizos: distribuir uniformemente
                angleOffset = (i - (projectileCount - 1) / 2) * (spread / (projectileCount - 1))
              }

              const finalAngle = baseAngle + angleOffset

              const direction = {
                x: Math.cos(finalAngle),
                y: Math.sin(finalAngle)
              }

              const newProjectile = {
                position: { ...player.position },
                velocity: { x: direction.x * PROJECTILE_SPEED, y: direction.y * PROJECTILE_SPEED },
                radius: 4.5 * projectileSize,
                speed: PROJECTILE_SPEED,
                isMagicBolt: false // Player spells are not magic bolts
              }
              gameStateRef.current.projectiles.push(newProjectile)
              console.log('Created multi-spell projectile:', i, newProjectile)
            }
          }

          lastCastTimeRef.current = now
        } else {
          console.log('Cast rate limit not met. Time since last cast:', now - lastCastTimeRef.current, 'Required:', player.upgrades.castRate)
        }
      }
    }
  }, [gameStateRef, playPlayerCast, togglePause, isFullscreen])

  const handleKeyUp = useCallback((e: KeyboardEvent, isPaused?: boolean) => {
    if (!gameStateRef.current) return
    
    // If game is paused, don't process key up events
    if (isPaused) {
      return
    }
    
    // Prevenir el comportamiento por defecto para teclas de movimiento
    const movementKeys = ['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright']
    if (movementKeys.includes(e.key.toLowerCase())) {
      e.preventDefault()
    }
    
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