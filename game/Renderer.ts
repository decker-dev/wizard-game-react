import { GameState } from '@/types/game'
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  MAP_WIDTH,
  MAP_HEIGHT,
  PLAYER_SPRITE_WIDTH,
  PLAYER_SPRITE_HEIGHT,
  INVULNERABILITY_TIME,
  WALL_BLOCK_SIZE
} from '@/constants/game'
import { getZombieSprite } from './Zombies'
import { getPlayerSprite } from './Player'

export const render = (
  ctx: CanvasRenderingContext2D,
  gameState: GameState,
  zombieSprites: { [key: string]: HTMLImageElement | null },
  waveMessage: string,
  canvasWidth: number = CANVAS_WIDTH,
  canvasHeight: number = CANVAS_HEIGHT,
  floorTexture?: HTMLImageElement | null
) => {
  const { player } = gameState

  // Clear the entire canvas first
  ctx.clearRect(0, 0, canvasWidth, canvasHeight)

  const cameraX = Math.max(0, Math.min(MAP_WIDTH - canvasWidth, player.position.x - canvasWidth / 2))
  const cameraY = Math.max(0, Math.min(MAP_HEIGHT - canvasHeight, player.position.y - canvasHeight / 2))

  // Render floor texture or fallback to solid color
  if (floorTexture) {
    renderFloorTexture(ctx, floorTexture, cameraX, cameraY, canvasWidth, canvasHeight)
  } else {
    // Fallback: Clear canvas with background color
    ctx.fillStyle = "#c2b280"
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)
  }

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
      // Renderizar muros con bloques grises
      renderWallBlocks(ctx, screenX, screenY, obs.width, obs.height)
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

const renderFloorTexture = (
  ctx: CanvasRenderingContext2D,
  floorTexture: HTMLImageElement,
  cameraX: number,
  cameraY: number,
  canvasWidth: number,
  canvasHeight: number
) => {
  // Get texture dimensions
  const textureWidth = floorTexture.width
  const textureHeight = floorTexture.height

  // Calculate starting positions for tiling
  const startX = Math.floor(cameraX / textureWidth) * textureWidth - cameraX
  const startY = Math.floor(cameraY / textureHeight) * textureHeight - cameraY

  // Calculate how many tiles we need to cover the screen
  const tilesX = Math.ceil((canvasWidth - startX) / textureWidth) + 1
  const tilesY = Math.ceil((canvasHeight - startY) / textureHeight) + 1

  // Render the tiled texture
  for (let x = 0; x < tilesX; x++) {
    for (let y = 0; y < tilesY; y++) {
      const drawX = startX + x * textureWidth
      const drawY = startY + y * textureHeight

      // Only draw if the tile is visible on screen
      if (drawX < canvasWidth && drawY < canvasHeight &&
        drawX + textureWidth > 0 && drawY + textureHeight > 0) {
        ctx.drawImage(floorTexture, drawX, drawY, textureWidth, textureHeight)
      }
    }
  }
}

const renderWallBlocks = (
  ctx: CanvasRenderingContext2D,
  screenX: number,
  screenY: number,
  width: number,
  height: number
) => {
  // Calcular cuántos bloques necesitamos
  const blocksX = Math.ceil(width / WALL_BLOCK_SIZE)
  const blocksY = Math.ceil(height / WALL_BLOCK_SIZE)

  // Renderizar cada bloque individualmente
  for (let bx = 0; bx < blocksX; bx++) {
    for (let by = 0; by < blocksY; by++) {
      const blockX = screenX + bx * WALL_BLOCK_SIZE
      const blockY = screenY + by * WALL_BLOCK_SIZE
      const blockWidth = Math.min(WALL_BLOCK_SIZE, width - bx * WALL_BLOCK_SIZE)
      const blockHeight = Math.min(WALL_BLOCK_SIZE, height - by * WALL_BLOCK_SIZE)

      // Renderizar el bloque base con color gris
      ctx.fillStyle = "#808080" // Gris base
      ctx.fillRect(blockX, blockY, blockWidth, blockHeight)

      // Agregar efecto 3D - sombra en la parte inferior y derecha
      ctx.fillStyle = "rgba(0,0,0,0.4)"
      ctx.fillRect(blockX + 2, blockY + blockHeight - 3, blockWidth - 2, 3) // Sombra inferior
      ctx.fillRect(blockX + blockWidth - 3, blockY + 2, 3, blockHeight - 2) // Sombra derecha

      // Agregar highlight en la parte superior e izquierda
      ctx.fillStyle = "rgba(255,255,255,0.3)"
      ctx.fillRect(blockX, blockY, blockWidth, 2) // Highlight superior
      ctx.fillRect(blockX, blockY, 2, blockHeight) // Highlight izquierdo

      // Borde del bloque
      ctx.strokeStyle = "rgba(0,0,0,0.6)"
      ctx.lineWidth = 1
      ctx.strokeRect(blockX, blockY, blockWidth, blockHeight)
    }
  }
} 