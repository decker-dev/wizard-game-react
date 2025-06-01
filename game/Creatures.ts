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
import { CreatureAI } from './AIBehaviors'
import { pathfinder } from './Pathfinding'

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
    lastAnimationTime: Date.now(),
    lastPosition: { x, y }, // Inicializar posición anterior para IA
    // Inicializar campos de pathfinding
    currentPath: undefined,
    currentPathIndex: 0,
    lastPathUpdate: 0,
    targetPosition: undefined
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

  // Actualizar el pathfinder con los obstáculos actuales
  pathfinder.updateObstacles(obstacles)

  // Spawn new creatures
  spawnCreature(gameState)

  creatures.forEach((creature) => {
    // Guardar posición anterior para el sistema de IA
    creature.lastPosition = { ...creature.position }

    const distanceToPlayer = distance(player.position, creature.position)

    // Usar el nuevo sistema de IA con Steering Behaviors y Pathfinding
    let steeringForce
    if (creature.type === 'caster') {
      steeringForce = CreatureAI.updateCasterCreature(
        creature,
        player.position,
        creatures,
        obstacles,
        distanceToPlayer
      )
    } else {
      steeringForce = CreatureAI.updateNormalCreature(
        creature,
        player.position,
        creatures,
        obstacles
      )
    }

    // Aplicar la fuerza de steering al movimiento con verificación de colisiones mejorada
    const oldPos = { ...creature.position }
    const newX = creature.position.x + steeringForce.x
    const newY = creature.position.y + steeringForce.y

    // Verificar colisión en X
    creature.position.x = newX
    let creatureRect = getEntityRect(creature)
    let collisionX = false

    for (const obstacle of obstacles) {
      if (checkAABBCollision(creatureRect, obstacle)) {
        collisionX = true
        break
      }
    }

    if (collisionX) {
      creature.position.x = oldPos.x // Revertir movimiento en X
    }

    // Verificar colisión en Y
    creature.position.y = newY
    creatureRect = getEntityRect(creature)
    let collisionY = false

    for (const obstacle of obstacles) {
      if (checkAABBCollision(creatureRect, obstacle)) {
        collisionY = true
        break
      }
    }

    if (collisionY) {
      creature.position.y = oldPos.y // Revertir movimiento en Y
    }

    // Si hay colisión en ambos ejes, invalidar el path actual para forzar recálculo
    if (collisionX && collisionY) {
      creature.currentPath = undefined
      creature.currentPathIndex = 0
    }

    // Determinar dirección basada en el movimiento real
    const actualMovement = {
      x: creature.position.x - oldPos.x,
      y: creature.position.y - oldPos.y
    }

    const absX = Math.abs(actualMovement.x)
    const absY = Math.abs(actualMovement.y)

    if (absX > 0.05 || absY > 0.05) { // Solo actualizar si hay movimiento significativo
      creature.isMoving = true

      if (absX > absY) {
        creature.direction = actualMovement.x > 0 ? 'E' : 'O'
      } else {
        creature.direction = actualMovement.y > 0 ? 'S' : 'N'
      }
    } else {
      creature.isMoving = false
    }

    // Mantener la criatura dentro del mapa
    creature.position.x = Math.max(creature.width / 2, Math.min(MAP_WIDTH - creature.width / 2, creature.position.x))
    creature.position.y = Math.max(creature.height / 2, Math.min(MAP_HEIGHT - creature.height / 2, creature.position.y))

    // Lógica de casting para casters (mejorada)
    if (creature.type === 'caster') {
      const now = Date.now()
      const improvedCastRate = Math.max(
        MIN_CASTER_CAST_RATE,
        CASTER_CAST_RATE - (currentWave * CASTER_CAST_RATE_IMPROVEMENT_PER_WAVE)
      )

      // Solo lanzar hechizos si está en rango óptimo, tiene línea de vista y ha pasado suficiente tiempo
      const hasLineOfSight = pathfinder.hasLineOfSight(creature.position, player.position, obstacles)

      if (distanceToPlayer <= 400 && distanceToPlayer >= 150 &&
        hasLineOfSight &&
        now - (creature.lastSpellTime || 0) > improvedCastRate) {

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
    }

    // Manejar animación de caminar
    const now = Date.now()
    if (creature.isMoving && now - creature.lastAnimationTime > 300) {
      creature.animationFrame = creature.animationFrame === 'L' ? 'R' : 'L'
      creature.lastAnimationTime = now
    } else if (!creature.isMoving) {
      creature.animationFrame = 'S'
    }
  })

  // SISTEMA MEJORADO: Verificar colisiones entre criaturas SIN empujarlas dentro de obstáculos
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

        // Guardar posiciones originales
        const originalPos1 = { ...creature1.position }
        const originalPos2 = { ...creature2.position }

        // Intentar separar las criaturas
        const separationForce = 2
        const newPos1 = {
          x: creature1.position.x - separationDirection.x * separationForce,
          y: creature1.position.y - separationDirection.y * separationForce
        }
        const newPos2 = {
          x: creature2.position.x + separationDirection.x * separationForce,
          y: creature2.position.y + separationDirection.y * separationForce
        }

        // Verificar que las nuevas posiciones no colisionen con obstáculos
        let canMoveBoth = true

        // Verificar criatura 1
        creature1.position = newPos1
        let rect1Check = getEntityRect(creature1)
        for (const obstacle of obstacles) {
          if (checkAABBCollision(rect1Check, obstacle)) {
            canMoveBoth = false
            break
          }
        }

        // Verificar criatura 2 solo si criatura 1 puede moverse
        if (canMoveBoth) {
          creature2.position = newPos2
          let rect2Check = getEntityRect(creature2)
          for (const obstacle of obstacles) {
            if (checkAABBCollision(rect2Check, obstacle)) {
              canMoveBoth = false
              break
            }
          }
        }

        // Si no pueden moverse ambas sin colisionar, revertir posiciones
        if (!canMoveBoth) {
          creature1.position = originalPos1
          creature2.position = originalPos2

          // Intentar mover solo una criatura en diferentes direcciones
          const directions = [
            { x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 },
            { x: 1, y: 1 }, { x: -1, y: -1 }, { x: 1, y: -1 }, { x: -1, y: 1 }
          ]

          let moved = false
          for (const dir of directions) {
            // Intentar mover criatura 1
            creature1.position = {
              x: originalPos1.x + dir.x * separationForce,
              y: originalPos1.y + dir.y * separationForce
            }

            let rect1Check = getEntityRect(creature1)
            let collision = false
            for (const obstacle of obstacles) {
              if (checkAABBCollision(rect1Check, obstacle)) {
                collision = true
                break
              }
            }

            if (!collision) {
              moved = true
              break
            }

            // Si no funcionó, intentar mover criatura 2
            creature1.position = originalPos1
            creature2.position = {
              x: originalPos2.x + dir.x * separationForce,
              y: originalPos2.y + dir.y * separationForce
            }

            let rect2Check = getEntityRect(creature2)
            collision = false
            for (const obstacle of obstacles) {
              if (checkAABBCollision(rect2Check, obstacle)) {
                collision = true
                break
              }
            }

            if (!collision) {
              moved = true
              break
            }

            // Revertir si no funcionó
            creature2.position = originalPos2
          }

          // Si no se pudo mover ninguna, mantener posiciones originales
          if (!moved) {
            creature1.position = originalPos1
            creature2.position = originalPos2
          }
        }

        // Verificar límites del mapa para ambas criaturas
        creature1.position.x = Math.max(creature1.width / 2, Math.min(MAP_WIDTH - creature1.width / 2, creature1.position.x))
        creature1.position.y = Math.max(creature1.height / 2, Math.min(MAP_HEIGHT - creature1.height / 2, creature1.position.y))
        creature2.position.x = Math.max(creature2.width / 2, Math.min(MAP_WIDTH - creature2.width / 2, creature2.position.x))
        creature2.position.y = Math.max(creature2.height / 2, Math.min(MAP_HEIGHT - creature2.height / 2, creature2.position.y))

        // Invalidar paths si las criaturas fueron movidas
        if (creature1.position.x !== originalPos1.x || creature1.position.y !== originalPos1.y) {
          creature1.currentPath = undefined
        }
        if (creature2.position.x !== originalPos2.x || creature2.position.y !== originalPos2.y) {
          creature2.currentPath = undefined
        }
      }
    }
  }

  // SISTEMA DE MUERTE AUTOMÁTICA: Eliminar criaturas atrapadas en obstáculos
  for (let i = creatures.length - 1; i >= 0; i--) {
    const creature = creatures[i]
    const creatureRect = getEntityRect(creature)

    // Verificar si la criatura está completamente dentro de un obstáculo
    let isTrappedInObstacle = false
    for (const obstacle of obstacles) {
      if (checkAABBCollision(creatureRect, obstacle)) {
        // Verificar si está completamente dentro (no solo tocando el borde)
        const overlapX = Math.min(creatureRect.x + creatureRect.width, obstacle.x + obstacle.width) -
          Math.max(creatureRect.x, obstacle.x)
        const overlapY = Math.min(creatureRect.y + creatureRect.height, obstacle.y + obstacle.height) -
          Math.max(creatureRect.y, obstacle.y)

        // Si el overlap es significativo (más del 70% del tamaño de la criatura), está atrapada
        if (overlapX > creatureRect.width * 0.7 && overlapY > creatureRect.height * 0.7) {
          isTrappedInObstacle = true
          break
        }
      }
    }

    if (isTrappedInObstacle) {
      console.log(`Criatura ${creature.id} eliminada por estar atrapada en obstáculo`)
      creatures.splice(i, 1)
      // Actualizar el contador de criaturas restantes si es necesario
      if (gameState.creaturesSpawnedThisWave >= gameState.creaturesToSpawnThisWave) {
        // No contar esta muerte hacia el progreso de la wave
        // La criatura simplemente desaparece sin dar puntos
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