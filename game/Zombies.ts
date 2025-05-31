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
  MAP_HEIGHT
} from '@/constants/game'
import { normalize, getEntityRect, checkAABBCollision, distance } from '@/utils/math'

export const createZombie = (
  x: number, 
  y: number, 
  currentWave: number
): Zombie => {
  // Determinar si crear un zombie normal o shooter (desde wave 2)
  const isShooter = currentWave >= 2 && Math.random() < 0.2 // 20% de probabilidad de shooter
  const zombieType = isShooter ? 'shooter' : 'normal'
  const zombieHealth = isShooter ? ZOMBIE_SHOOTER_HEALTH : (INITIAL_ZOMBIE_HEALTH + currentWave * 5)
  const zombieSpeed = isShooter ? ZOMBIE_SHOOTER_SPEED : (ZOMBIE_SPEED_BASE + currentWave * 0.05)

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
    sprite: null
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
  const { zombies, player, obstacles, waveTransitioning, projectiles } = gameState
  
  if (waveTransitioning) return

  // Spawn new zombies
  spawnZombie(gameState)

  zombies.forEach((zombie) => {
    const oldPos = { ...zombie.position }
    const direction = normalize({
      x: player.position.x - zombie.position.x,
      y: player.position.y - zombie.position.y
    })

    // Movimiento diferente según el tipo
    if (zombie.type === 'shooter') {
      // Los shooters mantienen distancia
      const distanceToPlayer = distance(player.position, zombie.position)
      
      if (distanceToPlayer < 300) {
        // Alejarse del jugador
        direction.x *= -1
        direction.y *= -1
      } else if (distanceToPlayer > 400) {
        // Acercarse al jugador
        // Ya tenemos la dirección correcta
      } else {
        // Mantener posición y disparar
        direction.x = 0
        direction.y = 0
      }

      // Disparar si ha pasado suficiente tiempo
      const now = Date.now()
      if (now - (zombie.lastShotTime || 0) > SHOOTER_FIRE_RATE) {
        const fireballDirection = normalize({
          x: player.position.x - zombie.position.x,
          y: player.position.y - zombie.position.y
        })
        
        projectiles.push({
          position: { ...zombie.position },
          velocity: {
            x: fireballDirection.x * FIREBALL_SPEED,
            y: fireballDirection.y * FIREBALL_SPEED
          },
          radius: 6,
          speed: FIREBALL_SPEED,
          isFireball: true
        })
        zombie.lastShotTime = now
      }
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
}

export const getZombieSprite = (zombie: Zombie, zombieSprites: {[key: string]: HTMLImageElement | null}) => {
  const healthPercentage = (zombie.health / zombie.maxHealth) * 100
  
  if (zombie.type === 'shooter') {
    // Usar sprites de diablo para shooters
    if (healthPercentage <= 30) {
      return zombieSprites['diablo-health-30']
    } else if (healthPercentage <= 50) {
      return zombieSprites['diablo-health-50']
    } else {
      return zombieSprites['diablo-health-100']
    }
  } else {
    // Usar sprites de zombie para normales
    if (healthPercentage <= 30) {
      return zombieSprites['zombie-health-30']
    } else if (healthPercentage <= 50) {
      return zombieSprites['zombie-health-50']
    } else if (healthPercentage <= 80) {
      return zombieSprites['zombie-health-80']
    } else {
      return zombieSprites['zombie-health-100']
    }
  }
} 