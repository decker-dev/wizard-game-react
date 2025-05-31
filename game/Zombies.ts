import { GameState, Zombie } from '@/types/game'
import {
  ZOMBIE_WIDTH,
  ZOMBIE_HEIGHT,
  ZOMBIE_SPEED_BASE,
  ZOMBIE_SHOOTER_SPEED,
  ZOMBIE_SHOOTER_HEALTH,
  INITIAL_ZOMBIE_HEALTH,
  SHOOTER_FIRE_RATE,
  FIREBALL_SPEED,
  MAP_WIDTH,
  MAP_HEIGHT,
  ZOMBIE_HEALTH_INCREASE_PER_WAVE,
  ZOMBIE_SPEED_INCREASE_PER_WAVE,
  SHOOTER_SPAWN_CHANCE_INCREASE,
  MAX_SHOOTER_SPAWN_CHANCE,
  FIREBALL_SPEED_INCREASE_PER_WAVE,
  SHOOTER_FIRE_RATE_IMPROVEMENT_PER_WAVE,
  FIREBALL_SIZE_INCREASE_PER_WAVE,
  EXPONENTIAL_SCALING_INTERVAL,
  EXPONENTIAL_HEALTH_MULTIPLIER,
  EXPONENTIAL_SPEED_MULTIPLIER,
  MAX_ZOMBIE_SPEED,
  MAX_FIREBALL_SPEED,
  MIN_SHOOTER_FIRE_RATE
} from '@/constants/game'
import { normalize, getEntityRect, checkAABBCollision, distance } from '@/utils/math'

export const createZombie = (
  x: number,
  y: number,
  currentWave: number
): Zombie => {
  // Calcular multiplicador exponencial para waves altas
  const exponentialBonus = Math.floor(currentWave / EXPONENTIAL_SCALING_INTERVAL)
  const healthMultiplier = Math.pow(EXPONENTIAL_HEALTH_MULTIPLIER, exponentialBonus)
  const speedMultiplier = Math.pow(EXPONENTIAL_SPEED_MULTIPLIER, exponentialBonus)

  // Calcular probabilidad de shooter que aumenta con cada wave
  const shooterChance = Math.min(
    0.1 + (currentWave - 1) * SHOOTER_SPAWN_CHANCE_INCREASE,
    MAX_SHOOTER_SPAWN_CHANCE
  )

  // Determinar si crear un zombie normal o shooter (desde wave 2)
  const isShooter = currentWave >= 2 && Math.random() < shooterChance
  const zombieType = isShooter ? 'shooter' : 'normal'

  // Escalado progresivo de salud con boost exponencial
  const baseHealth = isShooter
    ? ZOMBIE_SHOOTER_HEALTH + currentWave * ZOMBIE_HEALTH_INCREASE_PER_WAVE * 1.5
    : INITIAL_ZOMBIE_HEALTH + currentWave * ZOMBIE_HEALTH_INCREASE_PER_WAVE
  const zombieHealth = Math.floor(baseHealth * healthMultiplier)

  // Escalado progresivo de velocidad con boost exponencial y límite
  const baseSpeed = isShooter
    ? ZOMBIE_SHOOTER_SPEED + currentWave * ZOMBIE_SPEED_INCREASE_PER_WAVE * 0.8
    : ZOMBIE_SPEED_BASE + currentWave * ZOMBIE_SPEED_INCREASE_PER_WAVE
  const zombieSpeed = Math.min(baseSpeed * speedMultiplier, MAX_ZOMBIE_SPEED)

  return {
    id: `zombie-${Date.now()}-${Math.random()}`,
    position: { x, y },
    width: ZOMBIE_WIDTH,
    height: ZOMBIE_HEIGHT,
    speed: zombieSpeed,
    health: zombieHealth,
    maxHealth: zombieHealth,
    type: zombieType,
    lastShotTime: Date.now(),
    sprite: null,
    direction: 'S',
    isMoving: false,
    animationFrame: 'S',
    lastAnimationTime: Date.now()
  }
}

export const spawnZombie = (gameState: GameState): boolean => {
  const { zombiesSpawnedThisWave, zombiesToSpawnThisWave, zombies, currentWave } = gameState

  if (zombiesSpawnedThisWave < zombiesToSpawnThisWave && zombies.length < 20 && Math.random() < 0.05) {
    const side = Math.floor(Math.random() * 4)
    let x, y

    switch (side) {
      case 0:
        x = Math.random() * MAP_WIDTH
        y = -ZOMBIE_HEIGHT
        break
      case 1:
        x = MAP_WIDTH + ZOMBIE_WIDTH
        y = Math.random() * MAP_HEIGHT
        break
      case 2:
        x = Math.random() * MAP_WIDTH
        y = MAP_HEIGHT + ZOMBIE_HEIGHT
        break
      default:
        x = -ZOMBIE_WIDTH
        y = Math.random() * MAP_HEIGHT
        break
    }

    const newZombie = createZombie(x, y, currentWave)
    zombies.push(newZombie)
    gameState.zombiesSpawnedThisWave++
    return true
  }

  return false
}

export const updateZombies = (gameState: GameState) => {
  const { zombies, player, obstacles, waveTransitioning, projectiles, currentWave } = gameState

  if (waveTransitioning) return

  // Spawn new zombies
  spawnZombie(gameState)

  zombies.forEach((zombie) => {
    const oldPos = { ...zombie.position }
    const direction = normalize({
      x: player.position.x - zombie.position.x,
      y: player.position.y - zombie.position.y
    })

    // Actualizar dirección basada en movimiento (para ambos tipos)
    const absX = Math.abs(direction.x)
    const absY = Math.abs(direction.y)

    if (absX > absY) {
      zombie.direction = direction.x > 0 ? 'E' : 'O'
    } else {
      zombie.direction = direction.y > 0 ? 'S' : 'N'
    }

    // Movimiento diferente según el tipo
    if (zombie.type === 'shooter') {
      // Los shooters mantienen distancia
      const distanceToPlayer = distance(player.position, zombie.position)

      if (distanceToPlayer < 300) {
        // Alejarse del jugador
        direction.x *= -1
        direction.y *= -1
        zombie.isMoving = true
      } else if (distanceToPlayer > 400) {
        // Acercarse al jugador
        // Ya tenemos la dirección correcta
        zombie.isMoving = true
      } else {
        // Mantener posición y disparar
        direction.x = 0
        direction.y = 0
        zombie.isMoving = false
      }

      // Disparar si ha pasado suficiente tiempo - mejora con las waves
      const now = Date.now()
      const improvedFireRate = Math.max(
        MIN_SHOOTER_FIRE_RATE, // Mínimo tiempo entre disparos
        SHOOTER_FIRE_RATE - (currentWave * SHOOTER_FIRE_RATE_IMPROVEMENT_PER_WAVE)
      )

      if (now - (zombie.lastShotTime || 0) > improvedFireRate) {
        const fireballDirection = normalize({
          x: player.position.x - zombie.position.x,
          y: player.position.y - zombie.position.y
        })

        // Velocidad de fireball escalable con límite
        const baseFireballSpeed = FIREBALL_SPEED + (currentWave * FIREBALL_SPEED_INCREASE_PER_WAVE)
        const scaledFireballSpeed = Math.min(baseFireballSpeed, MAX_FIREBALL_SPEED)

        // Tamaño de fireball escalable
        const fireballSize = 6 + (currentWave * FIREBALL_SIZE_INCREASE_PER_WAVE)

        projectiles.push({
          position: { ...zombie.position },
          velocity: {
            x: fireballDirection.x * scaledFireballSpeed,
            y: fireballDirection.y * scaledFireballSpeed
          },
          radius: fireballSize,
          speed: scaledFireballSpeed,
          isFireball: true
        })
        zombie.lastShotTime = now
      }
    } else {
      // Zombies normales siempre se mueven hacia el jugador
      zombie.isMoving = true
    }

    // Manejar animación de caminar (para ambos tipos)
    const now = Date.now()
    if (zombie.isMoving && now - zombie.lastAnimationTime > 300) { // Cambiar frame cada 300ms
      zombie.animationFrame = zombie.animationFrame === 'L' ? 'R' : 'L'
      zombie.lastAnimationTime = now
    } else if (!zombie.isMoving) {
      zombie.animationFrame = 'S' // Standing frame when not moving
    }

    zombie.position.x += direction.x * zombie.speed
    let zombieRect = getEntityRect(zombie)
    let collidedX = false
    for (const obs of obstacles) {
      if (checkAABBCollision(zombieRect, obs)) {
        zombie.position.x = oldPos.x
        collidedX = true
        break
      }
    }

    zombie.position.y += direction.y * zombie.speed
    zombieRect = getEntityRect(zombie)
    for (const obs of obstacles) {
      if (checkAABBCollision(zombieRect, obs)) {
        zombie.position.y = oldPos.y
        if (collidedX) zombie.position.x = oldPos.x
        break
      }
    }
  })

  // Verificar colisiones entre zombies para evitar superposición
  for (let i = 0; i < zombies.length; i++) {
    for (let j = i + 1; j < zombies.length; j++) {
      const zombie1 = zombies[i]
      const zombie2 = zombies[j]

      const rect1 = getEntityRect(zombie1)
      const rect2 = getEntityRect(zombie2)

      if (checkAABBCollision(rect1, rect2)) {
        // Calcular dirección de separación
        const separationDirection = normalize({
          x: zombie2.position.x - zombie1.position.x,
          y: zombie2.position.y - zombie1.position.y
        })

        // Si están exactamente en la misma posición, usar dirección aleatoria
        if (separationDirection.x === 0 && separationDirection.y === 0) {
          const angle = Math.random() * Math.PI * 2
          separationDirection.x = Math.cos(angle)
          separationDirection.y = Math.sin(angle)
        }

        // Separar los zombies
        const separationForce = 5
        zombie1.position.x -= separationDirection.x * separationForce
        zombie1.position.y -= separationDirection.y * separationForce
        zombie2.position.x += separationDirection.x * separationForce
        zombie2.position.y += separationDirection.y * separationForce

        // Verificar que no salgan del mapa ni colisionen con obstáculos
        for (const zombie of [zombie1, zombie2]) {
          // Límites del mapa
          zombie.position.x = Math.max(zombie.width / 2, Math.min(MAP_WIDTH - zombie.width / 2, zombie.position.x))
          zombie.position.y = Math.max(zombie.height / 2, Math.min(MAP_HEIGHT - zombie.height / 2, zombie.position.y))

          // Verificar colisión con obstáculos
          const zombieRect = getEntityRect(zombie)
          for (const obs of obstacles) {
            if (checkAABBCollision(zombieRect, obs)) {
              // Si colisiona con obstáculo, mover en dirección opuesta
              zombie.position.x += separationDirection.x * separationForce * (zombie === zombie1 ? 1 : -1)
              zombie.position.y += separationDirection.y * separationForce * (zombie === zombie1 ? 1 : -1)
              break
            }
          }
        }
      }
    }
  }
}

export const getZombieSprite = (zombie: Zombie, zombieSprites: { [key: string]: HTMLImageElement | null }) => {
  const direction = zombie.direction
  const frameType = zombie.isMoving ? 'W' : 'S' // W for walking, S for standing
  const animFrame = zombie.isMoving ? zombie.animationFrame : 'S'

  // Construir nombre del sprite: direction_frameType_animFrame
  let spriteName = `${direction}_${frameType}`
  if (zombie.isMoving && animFrame !== 'S') {
    spriteName += `_${animFrame}`
  }

  if (zombie.type === 'shooter') {
    // Usar sprites del mago para shooters
    return zombieSprites[`mage_${spriteName}`] || zombieSprites['mage_S_S'] // fallback to mage south standing
  } else {
    // Usar sprites del zombie para normales
    return zombieSprites[`zombie_${spriteName}`] || zombieSprites['zombie_S_S'] // fallback to zombie south standing
  }
} 