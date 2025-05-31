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

export const render = (
  ctx: CanvasRenderingContext2D,
  gameState: GameState,
  zombieSprites: {[key: string]: HTMLImageElement | null},
  waveMessage: string,
  canvasWidth: number = CANVAS_WIDTH,
  canvasHeight: number = CANVAS_HEIGHT
) => {
  const { player } = gameState

  const cameraX = Math.max(0, Math.min(MAP_WIDTH - canvasWidth, player.position.x - canvasWidth / 2))
  const cameraY = Math.max(0, Math.min(MAP_HEIGHT - canvasHeight, player.position.y - canvasHeight / 2))

  // Clear canvas with background color
  ctx.fillStyle = "#c2b280"
  ctx.fillRect(0, 0, canvasWidth, canvasHeight)

  // Render obstacles
  gameState.obstacles.forEach((obs) => {
    const screenX = obs.x - cameraX
    const screenY = obs.y - cameraY

    if (
      screenX + obs.width >= 0 &&
      screenX <= canvasWidth &&
      screenY + obs.height >= 0 &&
      screenY <= canvasHeight
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
  if (player.sprite) {
    ctx.save()
    const now = Date.now()
    const isInvulnerable = now - player.lastDamageTime < INVULNERABILITY_TIME
    if (isInvulnerable) {
      ctx.globalAlpha = 0.5 + Math.sin(now * 0.01) * 0.3
    }
    ctx.translate(player.position.x - cameraX, player.position.y - cameraY)
    ctx.rotate(player.angle + Math.PI / 2)
    ctx.drawImage(
      player.sprite,
      -PLAYER_SPRITE_WIDTH / 2,
      -PLAYER_SPRITE_HEIGHT / 2,
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
      screenX <= canvasWidth &&
      screenY >= 0 &&
      screenY <= canvasHeight
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
      screenX - z.width <= canvasWidth &&
      screenY + z.height >= 0 &&
      screenY - z.height <= canvasHeight
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
  renderMinimap(ctx, gameState, cameraX, cameraY, canvasWidth, canvasHeight)

  // Render wave messages
  if (waveMessage) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
    ctx.fillRect(canvasWidth / 4, canvasHeight / 3, canvasWidth / 2, canvasHeight / 4)
    ctx.font = "bold 24px Arial"
    ctx.fillStyle = "#FFFFFF"
    ctx.textAlign = "center"
    ctx.fillText(waveMessage, canvasWidth / 2, canvasHeight / 2 - 10)
    if (gameState.waveTransitioning && !gameState.gameWon && !gameState.gameOver) {
      ctx.font = "16px Arial"
      ctx.fillText("Prepare yourself!", canvasWidth / 2, canvasHeight / 2 + 20)
    }
    ctx.textAlign = "left"
  }
}

const renderMinimap = (
  ctx: CanvasRenderingContext2D,
  gameState: GameState,
  cameraX: number,
  cameraY: number,
  canvasWidth: number = CANVAS_WIDTH,
  canvasHeight: number = CANVAS_HEIGHT
) => {
  const { player } = gameState

  // Calculate minimap size proportional to canvas size
  const minimapSize = Math.min(canvasWidth, canvasHeight) * 0.15 // 15% of smaller dimension
  const minimapPadding = 10
  const minimapScaleX = minimapSize / MAP_WIDTH
  const minimapScaleY = minimapSize / MAP_HEIGHT

  // Fondo del minimapa
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
  ctx.fillRect(
    canvasWidth - minimapSize - minimapPadding,
    minimapPadding,
    minimapSize,
    minimapSize
  )

  // Borde del minimapa
  ctx.strokeStyle = "#FFFFFF"
  ctx.lineWidth = 2
  ctx.strokeRect(
    canvasWidth - minimapSize - minimapPadding,
    minimapPadding,
    minimapSize,
    minimapSize
  )

  // Obstáculos en el minimapa
  ctx.fillStyle = "#808080"
  gameState.obstacles.forEach((obs) => {
    ctx.fillRect(
      canvasWidth - minimapSize - minimapPadding + obs.x * minimapScaleX,
      minimapPadding + obs.y * minimapScaleY,
      obs.width * minimapScaleX,
      obs.height * minimapScaleY
    )
  })

  // Zombies en el minimapa
  ctx.fillStyle = "#FF0000"
  gameState.zombies.forEach((z) => {
    ctx.fillRect(
      canvasWidth - minimapSize - minimapPadding + z.position.x * minimapScaleX - 1,
      minimapPadding + z.position.y * minimapScaleY - 1,
      2,
      2
    )
  })

  // Jugador en el minimapa
  ctx.fillStyle = "#00FF00"
  ctx.fillRect(
    canvasWidth - minimapSize - minimapPadding + player.position.x * minimapScaleX - 2,
    minimapPadding + player.position.y * minimapScaleY - 2,
    4,
    4
  )

  // Campo de visión de la cámara
  ctx.strokeStyle = "#FFFF00"
  ctx.lineWidth = 1
  ctx.strokeRect(
    canvasWidth - minimapSize - minimapPadding + cameraX * minimapScaleX,
    minimapPadding + cameraY * minimapScaleY,
    canvasWidth * minimapScaleX,
    canvasHeight * minimapScaleY
  )
} 