import { Player, GameState } from '@/types/game'
import { PLAYER_SPEED, PLAYER_SPRITE_WIDTH, PLAYER_SPRITE_HEIGHT, PLAYER_COLLISION_RADIUS, MAP_WIDTH, MAP_HEIGHT, BASE_MAX_HEALTH, BASE_WEAPON_DAMAGE, BASE_PROJECTILE_COUNT, BASE_PROJECTILE_SIZE, BASE_FIRE_RATE, BASE_SPREAD } from '@/constants/game'
import { getEntityRect, checkAABBCollision } from '@/utils/math'

export const createInitialPlayer = (playerSprites: { [key: string]: HTMLImageElement | null }): Player => ({
  position: { x: 70, y: 70 },
  collisionRadius: PLAYER_COLLISION_RADIUS,
  width: PLAYER_SPRITE_WIDTH * 0.8,
  height: PLAYER_SPRITE_HEIGHT * 0.8,
  speed: PLAYER_SPEED,
  health: BASE_MAX_HEALTH,
  maxHealth: BASE_MAX_HEALTH,
  angle: 0,
  sprites: playerSprites,
  lastDamageTime: 0,
  lastMovementDirection: { x: 1, y: 0 },
  coins: 0,
  upgrades: {
    weaponDamage: BASE_WEAPON_DAMAGE,
    maxHealth: BASE_MAX_HEALTH,
    weaponLevel: 0,
    healthLevel: 0,
    projectileCount: BASE_PROJECTILE_COUNT,
    projectileSize: BASE_PROJECTILE_SIZE,
    fireRate: BASE_FIRE_RATE,
    spread: BASE_SPREAD
  },
  direction: 'S',
  isMoving: false,
  animationFrame: 'S',
  lastAnimationTime: Date.now()
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

  // Determinar si el jugador se está moviendo
  const isMoving = dx !== 0 || dy !== 0
  player.isMoving = isMoving

  // Actualizar la última dirección de movimiento si hay movimiento
  if (isMoving) {
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

    // Actualizar dirección basada en movimiento
    const absX = Math.abs(dx)
    const absY = Math.abs(dy)

    if (absX > absY) {
      player.direction = dx > 0 ? 'E' : 'O'
    } else {
      player.direction = dy > 0 ? 'S' : 'N'
    }

    // Manejar animación de caminar
    const now = Date.now()
    if (now - player.lastAnimationTime > 300) { // Cambiar frame cada 300ms
      player.animationFrame = player.animationFrame === 'L' ? 'R' : 'L'
      player.lastAnimationTime = now
    }
  } else {
    player.animationFrame = 'S' // Standing frame when not moving
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

export const getPlayerSprite = (player: Player): HTMLImageElement | null => {
  const direction = player.direction
  const frameType = player.isMoving ? 'W' : 'S' // W for walking, S for standing
  const animFrame = player.isMoving ? player.animationFrame : 'S'

  // Construir nombre del sprite: direction_frameType_animFrame
  let spriteName = `${direction}_${frameType}`
  if (player.isMoving && animFrame !== 'S') {
    spriteName += `_${animFrame}`
  }

  // Usar sprites del soldier para el player
  return player.sprites[`soldier_${spriteName}`] || player.sprites['soldier_S_S'] // fallback to soldier south standing
} 