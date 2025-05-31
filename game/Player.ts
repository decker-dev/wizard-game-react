import { Player, GameState } from '@/types/game'
import { PLAYER_SPEED, PLAYER_SPRITE_WIDTH, PLAYER_SPRITE_HEIGHT, PLAYER_COLLISION_RADIUS, MAP_WIDTH, MAP_HEIGHT } from '@/constants/game'
import { getEntityRect, checkAABBCollision } from '@/utils/math'

export const createInitialPlayer = (playerSprite: HTMLImageElement | null): Player => ({
  position: { x: 70, y: 70 },
  collisionRadius: PLAYER_COLLISION_RADIUS,
  width: PLAYER_SPRITE_WIDTH * 0.8,
  height: PLAYER_SPRITE_HEIGHT * 0.8,
  speed: PLAYER_SPEED,
  health: 100,
  angle: 0,
  sprite: playerSprite,
  lastDamageTime: 0,
  lastMovementDirection: { x: 1, y: 0 },
  coins: 0
})

export const updatePlayer = (gameState: GameState) => {
  const { player, keys, obstacles } = gameState
  const { speed, width, height } = player
  const oldPos = { ...player.position }

  let dx = 0
  let dy = 0

  if (keys["w"] || keys["arrowup"]) dy -= speed
  if (keys["s"] || keys["arrowdown"]) dy += speed
  if (keys["a"] || keys["arrowleft"]) dx -= speed
  if (keys["d"] || keys["arrowright"]) dx += speed

  // Actualizar la última dirección de movimiento si hay movimiento
  if (dx !== 0 || dy !== 0) {
    if (dx !== 0 && dy !== 0) {
      const mag = Math.sqrt(dx * dx + dy * dy)
      dx = (dx / mag) * speed
      dy = (dy / mag) * speed
    }
    
    // Normalizar y guardar la dirección de movimiento
    const mag = Math.sqrt(dx * dx + dy * dy)
    if (mag > 0) {
      player.lastMovementDirection = { x: dx / mag, y: dy / mag }
      // Actualizar el ángulo del sprite basado en la dirección de movimiento
      player.angle = Math.atan2(dy, dx)
    }
  }

  player.position.x += dx
  let playerRect = getEntityRect(player)
  let collidedX = false
  for (const obs of obstacles) {
    if (checkAABBCollision(playerRect, obs)) {
      player.position.x = oldPos.x
      collidedX = true
      break
    }
  }

  player.position.y += dy
  playerRect = getEntityRect(player)
  for (const obs of obstacles) {
    if (checkAABBCollision(playerRect, obs)) {
      player.position.y = oldPos.y
      if (collidedX) player.position.x = oldPos.x
      break
    }
  }

  player.position.x = Math.max(width / 2, Math.min(MAP_WIDTH - width / 2, player.position.x))
  player.position.y = Math.max(height / 2, Math.min(MAP_HEIGHT - height / 2, player.position.y))
} 