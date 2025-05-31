import { GameState } from '@/types/game'
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  MAP_WIDTH,
  MAP_HEIGHT,
  PLAYER_SPRITE_WIDTH,
  PLAYER_SPRITE_HEIGHT,
  INVULNERABILITY_TIME,
  MINIMAP_SIZE,
  MINIMAP_PADDING,
  MINIMAP_SCALE_X,
  MINIMAP_SCALE_Y
} from '@/constants/game'
import { getZombieSprite } from './Zombies'
import { getPlayerSprite } from './Player'

export const render = (
  ctx: CanvasRenderingContext2D,
  gameState: GameState,
  zombieSprites: { [key: string]: HTMLImageElement | null },
  waveMessage: string
) => {
  const { player } = gameState

  const cameraX = Math.max(0, Math.min(MAP_WIDTH - CANVAS_WIDTH, player.position.x - CANVAS_WIDTH / 2))
  const cameraY = Math.max(0, Math.min(MAP_HEIGHT - CANVAS_HEIGHT, player.position.y - CANVAS_HEIGHT / 2))

  // Clear canvas with background color
  ctx.fillStyle = "#c2b280"
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  // Render obstacles
  gameState.obstacles.forEach((obs) => {
    const screenX = obs.x - cameraX
    const screenY = obs.y - cameraY

    if (
      screenX + obs.width >= 0 &&
      screenX <= CANVAS_WIDTH &&
      screenY + obs.height >= 0 &&
      screenY <= CANVAS_HEIGHT
    ) {
      ctx.fillStyle = "#808080"
      ctx.fillRect(screenX, screenY, obs.width, obs.height)
      ctx.strokeStyle = "#000000"
      ctx.lineWidth = 2
      ctx.strokeRect(screenX, screenY, obs.width, obs.height)
      ctx.fillStyle = "rgba(0,0,0,0.2)"
      ctx.fillRect(screenX + 5, screenY + 5, obs.width, obs.height)
    }
  })

  // Render player
  const currentPlayerSprite = getPlayerSprite(player)
  if (currentPlayerSprite) {
    ctx.save()
    const now = Date.now()
    const isInvulnerable = now - player.lastDamageTime < INVULNERABILITY_TIME
    if (isInvulnerable) {
      ctx.globalAlpha = 0.5 + Math.sin(now * 0.01) * 0.3
    }
    ctx.drawImage(
      currentPlayerSprite,
      player.position.x - cameraX - PLAYER_SPRITE_WIDTH / 2,
      player.position.y - cameraY - PLAYER_SPRITE_HEIGHT / 2,
      PLAYER_SPRITE_WIDTH,
      PLAYER_SPRITE_HEIGHT
    )
    ctx.restore()
    ctx.globalAlpha = 1.0
  }

  // Render player health bar
  const playerScreenX = player.position.x - cameraX
  const playerScreenY = player.position.y - cameraY
  const playerHealthBarWidth = PLAYER_SPRITE_WIDTH
  const playerHealthBarHeight = 6
  ctx.fillStyle = "rgba(255,0,0,0.5)"
  ctx.fillRect(
    playerScreenX - playerHealthBarWidth / 2,
    playerScreenY - PLAYER_SPRITE_HEIGHT / 2 - 15,
    playerHealthBarWidth,
    playerHealthBarHeight
  )
  ctx.fillStyle = "rgba(0,255,0,0.8)"
  ctx.fillRect(
    playerScreenX - playerHealthBarWidth / 2,
    playerScreenY - PLAYER_SPRITE_HEIGHT / 2 - 15,
    playerHealthBarWidth * Math.max(0, player.health / 100),
    playerHealthBarHeight
  )

  // Render projectiles
  gameState.projectiles.forEach((p) => {
    const screenX = p.position.x - cameraX
    const screenY = p.position.y - cameraY
    if (
      screenX >= 0 &&
      screenX <= CANVAS_WIDTH &&
      screenY >= 0 &&
      screenY <= CANVAS_HEIGHT
    ) {
      ctx.fillStyle = p.isFireball ? '#FF4400' : '#FFFF00'
      ctx.beginPath()
      ctx.arc(screenX, screenY, p.radius, 0, Math.PI * 2)
      ctx.fill()
    }
  })

  // Render zombies
  gameState.zombies.forEach((z) => {
    const screenX = z.position.x - cameraX
    const screenY = z.position.y - cameraY

    if (
      screenX + z.width >= 0 &&
      screenX - z.width <= CANVAS_WIDTH &&
      screenY + z.height >= 0 &&
      screenY - z.height <= CANVAS_HEIGHT
    ) {
      const zombieSprite = getZombieSprite(z, zombieSprites)

      if (zombieSprite) {
        // Renderizar el sprite del zombie
        ctx.drawImage(
          zombieSprite,
          screenX - z.width / 2,
          screenY - z.height / 2,
          z.width,
          z.height
        )
      } else {
        // Fallback: usar colores como antes si no hay sprite
        ctx.fillStyle = z.type === 'shooter' ? '#FF4444' : '#2E8B57'
        ctx.fillRect(screenX - z.width / 2, screenY - z.height / 2, z.width, z.height)
      }

      // Barra de vida del zombie
      const healthBarWidth = z.width * 0.8
      const healthBarHeight = 5
      ctx.fillStyle = "rgba(255,0,0,0.5)"
      ctx.fillRect(
        screenX - healthBarWidth / 2,
        screenY - z.height / 2 - 10,
        healthBarWidth,
        healthBarHeight
      )
      ctx.fillStyle = "rgba(0,255,0,0.8)"
      ctx.fillRect(
        screenX - healthBarWidth / 2,
        screenY - z.height / 2 - 10,
        healthBarWidth * Math.max(0, z.health / z.maxHealth),
        healthBarHeight
      )
    }
  })

  // Render minimap
  renderMinimap(ctx, gameState, cameraX, cameraY)

  // Render wave messages
  if (waveMessage) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
    ctx.fillRect(CANVAS_WIDTH / 4, CANVAS_HEIGHT / 3, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 4)
    ctx.font = "bold 24px Arial"
    ctx.fillStyle = "#FFFFFF"
    ctx.textAlign = "center"
    ctx.fillText(waveMessage, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 10)
    if (gameState.waveTransitioning && !gameState.gameWon && !gameState.gameOver) {
      ctx.font = "16px Arial"
      ctx.fillText("Prepare yourself!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20)
    }
    ctx.textAlign = "left"
  }
}

const renderMinimap = (
  ctx: CanvasRenderingContext2D,
  gameState: GameState,
  cameraX: number,
  cameraY: number
) => {
  const { player } = gameState

  // Fondo del minimapa
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
  ctx.fillRect(
    CANVAS_WIDTH - MINIMAP_SIZE - MINIMAP_PADDING,
    MINIMAP_PADDING,
    MINIMAP_SIZE,
    MINIMAP_SIZE
  )

  // Borde del minimapa
  ctx.strokeStyle = "#FFFFFF"
  ctx.lineWidth = 2
  ctx.strokeRect(
    CANVAS_WIDTH - MINIMAP_SIZE - MINIMAP_PADDING,
    MINIMAP_PADDING,
    MINIMAP_SIZE,
    MINIMAP_SIZE
  )

  // Área visible en el minimapa
  const visibleAreaX = (cameraX / MAP_WIDTH) * MINIMAP_SIZE
  const visibleAreaY = (cameraY / MAP_HEIGHT) * MINIMAP_SIZE
  const visibleAreaWidth = (CANVAS_WIDTH / MAP_WIDTH) * MINIMAP_SIZE
  const visibleAreaHeight = (CANVAS_HEIGHT / MAP_HEIGHT) * MINIMAP_SIZE

  ctx.strokeStyle = "#FFFF00"
  ctx.strokeRect(
    CANVAS_WIDTH - MINIMAP_SIZE - MINIMAP_PADDING + visibleAreaX,
    MINIMAP_PADDING + visibleAreaY,
    visibleAreaWidth,
    visibleAreaHeight
  )

  // Obstáculos en el minimapa
  gameState.obstacles.forEach((obs) => {
    const minimapX = CANVAS_WIDTH - MINIMAP_SIZE - MINIMAP_PADDING + obs.x * MINIMAP_SCALE_X
    const minimapY = MINIMAP_PADDING + obs.y * MINIMAP_SCALE_Y
    ctx.fillStyle = "#808080"
    ctx.fillRect(
      minimapX,
      minimapY,
      obs.width * MINIMAP_SCALE_X,
      obs.height * MINIMAP_SCALE_Y
    )
  })

  // Zombies en el minimapa
  gameState.zombies.forEach((z) => {
    const minimapX = CANVAS_WIDTH - MINIMAP_SIZE - MINIMAP_PADDING + z.position.x * MINIMAP_SCALE_X
    const minimapY = MINIMAP_PADDING + z.position.y * MINIMAP_SCALE_Y
    ctx.fillStyle = z.type === 'shooter' ? '#FF4444' : '#2E8B57'
    ctx.fillRect(
      minimapX - 2,
      minimapY - 2,
      4,
      4
    )
  })

  // Jugador en el minimapa
  const playerMinimapX = CANVAS_WIDTH - MINIMAP_SIZE - MINIMAP_PADDING + player.position.x * MINIMAP_SCALE_X
  const playerMinimapY = MINIMAP_PADDING + player.position.y * MINIMAP_SCALE_Y
  ctx.fillStyle = "#FF0000"
  ctx.beginPath()
  ctx.arc(playerMinimapX, playerMinimapY, 3, 0, Math.PI * 2)
  ctx.fill()
} 