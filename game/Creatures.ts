import { GameState, Creature } from '@/types/game'
import {
  CREATURE_WIDTH,
  CREATURE_HEIGHT,
  CREATURE_SPEED_BASE,
  CREATURE_CASTER_SPEED,
  CREATURE_CASTER_HEALTH,
  INITIAL_CREATURE_HEALTH,
  CASTER_CAST_RATE,
  MAGIC_BOLT_SPEED,
  MAP_WIDTH,
  MAP_HEIGHT,
  CREATURE_HEALTH_INCREASE_PER_WAVE,
  CREATURE_SPEED_INCREASE_PER_WAVE,
  CASTER_SPAWN_CHANCE_INCREASE,
  MAX_CASTER_SPAWN_CHANCE,
  MAGIC_BOLT_SPEED_INCREASE_PER_WAVE,
  CASTER_CAST_RATE_IMPROVEMENT_PER_WAVE,
  MAGIC_BOLT_SIZE_INCREASE_PER_WAVE,
  EXPONENTIAL_SCALING_INTERVAL,
  EXPONENTIAL_HEALTH_MULTIPLIER,
  EXPONENTIAL_SPEED_MULTIPLIER,
  MAX_CREATURE_SPEED,
  MAX_MAGIC_BOLT_SPEED,
  MIN_CASTER_CAST_RATE
} from '@/constants/game'
import { normalize, getEntityRect, checkAABBCollision, distance } from '@/utils/math'

export const createCreature = (
  x: number,
  y: number,
  currentWave: number
): Creature => {
  // Calcular multiplicador exponencial para waves altas
  const exponentialBonus = Math.floor(currentWave / EXPONENTIAL_SCALING_INTERVAL)
  const healthMultiplier = Math.pow(EXPONENTIAL_HEALTH_MULTIPLIER, exponentialBonus)
  const speedMultiplier = Math.pow(EXPONENTIAL_SPEED_MULTIPLIER, exponentialBonus)

  // Calcular probabilidad de caster que aumenta con cada wave
  const casterChance = Math.min(
    0.1 + (currentWave - 1) * CASTER_SPAWN_CHANCE_INCREASE,
    MAX_CASTER_SPAWN_CHANCE
  )

  // Determinar si crear una criatura normal o caster (desde wave 2)
  const isCaster = currentWave >= 2 && Math.random() < casterChance
  const creatureType = isCaster ? 'caster' : 'normal'

  // Escalado progresivo de salud con boost exponencial
  const baseHealth = isCaster
    ? CREATURE_CASTER_HEALTH + currentWave * CREATURE_HEALTH_INCREASE_PER_WAVE * 1.5
    : INITIAL_CREATURE_HEALTH + currentWave * CREATURE_HEALTH_INCREASE_PER_WAVE
  const creatureHealth = Math.floor(baseHealth * healthMultiplier)

  // Escalado progresivo de velocidad con boost exponencial y límite
  const baseSpeed = isCaster
    ? CREATURE_CASTER_SPEED + currentWave * CREATURE_SPEED_INCREASE_PER_WAVE * 0.8
    : CREATURE_SPEED_BASE + currentWave * CREATURE_SPEED_INCREASE_PER_WAVE
  const creatureSpeed = Math.min(baseSpeed * speedMultiplier, MAX_CREATURE_SPEED)

  return {
    id: `creature-${Date.now()}-${Math.random()}`,
    position: { x, y },
    width: CREATURE_WIDTH,
    height: CREATURE_HEIGHT,
    speed: creatureSpeed,
    health: creatureHealth,
    maxHealth: creatureHealth,
    type: creatureType,
    lastSpellTime: Date.now(),
    sprite: null,
    direction: 'S',
    isMoving: false,
    animationFrame: 'S',
    lastAnimationTime: Date.now()
  }
}

export const spawnCreature = (gameState: GameState): boolean => {
  const { creaturesSpawnedThisWave, creaturesToSpawnThisWave, creatures, currentWave } = gameState

  if (creaturesSpawnedThisWave < creaturesToSpawnThisWave && creatures.length < 20 && Math.random() < 0.05) {
    const side = Math.floor(Math.random() * 4)
    let x, y

    switch (side) {
      case 0:
        x = Math.random() * MAP_WIDTH
        y = -CREATURE_HEIGHT
        break
      case 1:
        x = MAP_WIDTH + CREATURE_WIDTH
        y = Math.random() * MAP_HEIGHT
        break
      case 2:
        x = Math.random() * MAP_WIDTH
        y = MAP_HEIGHT + CREATURE_HEIGHT
        break
      default:
        x = -CREATURE_WIDTH
        y = Math.random() * MAP_HEIGHT
        break
    }

    const newCreature = createCreature(x, y, currentWave)
    creatures.push(newCreature)
    gameState.creaturesSpawnedThisWave++
    return true
  }

  return false
}

export const updateCreatures = (gameState: GameState) => {
  const { creatures, player, obstacles, waveTransitioning, projectiles, currentWave } = gameState

  if (waveTransitioning) return

  // Spawn new creatures
  spawnCreature(gameState)

  creatures.forEach((creature) => {
    const oldPos = { ...creature.position }
    const direction = normalize({
      x: player.position.x - creature.position.x,
      y: player.position.y - creature.position.y
    })

    // Actualizar dirección basada en movimiento (para ambos tipos)
    const absX = Math.abs(direction.x)
    const absY = Math.abs(direction.y)

    if (absX > absY) {
      creature.direction = direction.x > 0 ? 'E' : 'O'
    } else {
      creature.direction = direction.y > 0 ? 'S' : 'N'
    }

    // Movimiento diferente según el tipo
    if (creature.type === 'caster') {
      // Los casters mantienen distancia
      const distanceToPlayer = distance(player.position, creature.position)

      if (distanceToPlayer < 300) {
        // Alejarse del jugador
        direction.x *= -1
        direction.y *= -1
        creature.isMoving = true
      } else if (distanceToPlayer > 400) {
        // Acercarse al jugador
        // Ya tenemos la dirección correcta
        creature.isMoving = true
      } else {
        // Mantener posición y lanzar hechizos
        direction.x = 0
        direction.y = 0
        creature.isMoving = false
      }

      // Lanzar hechizo si ha pasado suficiente tiempo - mejora con las waves
      const now = Date.now()
      const improvedCastRate = Math.max(
        MIN_CASTER_CAST_RATE, // Mínimo tiempo entre hechizos
        CASTER_CAST_RATE - (currentWave * CASTER_CAST_RATE_IMPROVEMENT_PER_WAVE)
      )

      if (now - (creature.lastSpellTime || 0) > improvedCastRate) {
        const magicBoltDirection = normalize({
          x: player.position.x - creature.position.x,
          y: player.position.y - creature.position.y
        })

        // Velocidad de magic bolt escalable con límite
        const baseMagicBoltSpeed = MAGIC_BOLT_SPEED + (currentWave * MAGIC_BOLT_SPEED_INCREASE_PER_WAVE)
        const scaledMagicBoltSpeed = Math.min(baseMagicBoltSpeed, MAX_MAGIC_BOLT_SPEED)

        // Tamaño de magic bolt escalable
        const magicBoltSize = 6 + (currentWave * MAGIC_BOLT_SIZE_INCREASE_PER_WAVE)

        projectiles.push({
          position: { ...creature.position },
          velocity: {
            x: magicBoltDirection.x * scaledMagicBoltSpeed,
            y: magicBoltDirection.y * scaledMagicBoltSpeed
          },
          radius: magicBoltSize,
          speed: scaledMagicBoltSpeed,
          isMagicBolt: true
        })
        creature.lastSpellTime = now
      }
    } else {
      // Criaturas normales siempre se mueven hacia el jugador
      creature.isMoving = true
    }

    // Manejar animación de caminar (para ambos tipos)
    const now = Date.now()
    if (creature.isMoving && now - creature.lastAnimationTime > 300) { // Cambiar frame cada 300ms
      creature.animationFrame = creature.animationFrame === 'L' ? 'R' : 'L'
      creature.lastAnimationTime = now
    } else if (!creature.isMoving) {
      creature.animationFrame = 'S' // Standing
    }

    // Aplicar movimiento
    creature.position.x += direction.x * creature.speed
    creature.position.y += direction.y * creature.speed

    // Verificar colisiones con obstáculos
    const creatureRect = getEntityRect(creature)
    let collisionDetected = false

    for (const obstacle of obstacles) {
      if (checkAABBCollision(creatureRect, obstacle)) {
        collisionDetected = true
        break
      }
    }

    // Si hay colisión, revertir el movimiento
    if (collisionDetected) {
      creature.position = oldPos
    }

    // Mantener la criatura dentro del mapa
    creature.position.x = Math.max(creature.width / 2, Math.min(MAP_WIDTH - creature.width / 2, creature.position.x))
    creature.position.y = Math.max(creature.height / 2, Math.min(MAP_HEIGHT - creature.height / 2, creature.position.y))
  })

  // Verificar colisiones entre criaturas para evitar superposición
  for (let i = 0; i < creatures.length; i++) {
    for (let j = i + 1; j < creatures.length; j++) {
      const creature1 = creatures[i]
      const creature2 = creatures[j]

      const rect1 = getEntityRect(creature1)
      const rect2 = getEntityRect(creature2)

      if (checkAABBCollision(rect1, rect2)) {
        // Calcular dirección de separación
        const separationDirection = normalize({
          x: creature2.position.x - creature1.position.x,
          y: creature2.position.y - creature1.position.y
        })

        // Si están exactamente en la misma posición, usar dirección aleatoria
        if (separationDirection.x === 0 && separationDirection.y === 0) {
          const angle = Math.random() * Math.PI * 2
          separationDirection.x = Math.cos(angle)
          separationDirection.y = Math.sin(angle)
        }

        // Separar las criaturas
        const separationForce = 5
        creature1.position.x -= separationDirection.x * separationForce
        creature1.position.y -= separationDirection.y * separationForce
        creature2.position.x += separationDirection.x * separationForce
        creature2.position.y += separationDirection.y * separationForce

        // Verificar que no salgan del mapa ni colisionen con obstáculos
        for (const creature of [creature1, creature2]) {
          // Límites del mapa
          creature.position.x = Math.max(creature.width / 2, Math.min(MAP_WIDTH - creature.width / 2, creature.position.x))
          creature.position.y = Math.max(creature.height / 2, Math.min(MAP_HEIGHT - creature.height / 2, creature.position.y))

          // Verificar colisión con obstáculos
          const creatureRect = getEntityRect(creature)
          for (const obs of obstacles) {
            if (checkAABBCollision(creatureRect, obs)) {
              // Si colisiona con obstáculo, mover en dirección opuesta
              creature.position.x += separationDirection.x * separationForce * (creature === creature1 ? 1 : -1)
              creature.position.y += separationDirection.y * separationForce * (creature === creature1 ? 1 : -1)
              break
            }
          }
        }
      }
    }
  }
}

export const getCreatureSprite = (creature: Creature, creatureSprites: { [key: string]: HTMLImageElement | null }) => {
  // Determinar el prefijo del sprite según el tipo de criatura
  const spritePrefix = creature.type === 'caster' ? 'mage' : 'creature'

  // Construir el nombre del sprite
  const spriteName = `${spritePrefix}_${creature.direction}_${creature.isMoving ? `W_${creature.animationFrame}` : 'S'}`

  return creatureSprites[spriteName] || null
} 