import { GameState } from '@/types/game'
import {
  KNOCKBACK_FORCE,
  CREATURE_DAMAGE,
  MAGIC_BOLT_DAMAGE,
  INVULNERABILITY_TIME,
  MAP_WIDTH,
  MAP_HEIGHT,
  CRYSTAL_REWARD_NORMAL_CREATURE,
  CRYSTAL_REWARD_CASTER_CREATURE,
  CRYSTAL_REWARD_TANK_CREATURE,
  CRYSTAL_REWARD_SPEED_CREATURE,
  CRYSTAL_REWARD_EXPLOSIVE_CREATURE
} from '@/constants/game'
import { checkAABBCollision, getEntityRect, normalize } from '@/utils/math'
import { createCoinParticle } from '@/utils/coinParticles'
import { handleExplosiveCreatureDeath } from './Creatures'

export const checkCollisions = (
  gameState: GameState,
  startNextWave: () => void,
  setScore: (score: number) => void,
  setPlayerHealth: (health: number) => void,
  setGameOver: (gameOver: boolean) => void,
  setPlayerCoins?: (coins: number) => void,
  playCreatureDeath?: (creatureType: 'normal' | 'caster' | 'tank' | 'speed' | 'explosive') => void,
  playPlayerHit?: () => void
) => {
  const { projectiles, creatures, player, creaturesSpawnedThisWave, creaturesToSpawnThisWave } = gameState

  // Revisar colisiones de proyectiles con criaturas y jugador
  for (let i = projectiles.length - 1; i >= 0; i--) {
    const p = projectiles[i]

    // Si es un magic bolt, revisar colisión con el jugador
    if (p.isMagicBolt) {
      const projectileRect = {
        x: p.position.x - p.radius,
        y: p.position.y - p.radius,
        width: p.radius * 2,
        height: p.radius * 2,
      }
      const playerRect = {
        x: player.position.x - player.collisionRadius,
        y: player.position.y - player.collisionRadius,
        width: player.collisionRadius * 2,
        height: player.collisionRadius * 2,
      }
      if (checkAABBCollision(projectileRect, playerRect)) {
        projectiles.splice(i, 1)
        player.health -= MAGIC_BOLT_DAMAGE
        setPlayerHealth(player.health)

        // Reproducir sonido de jugador herido
        if (playPlayerHit) {
          playPlayerHit()
        }

        if (player.health <= 0) {
          gameState.gameOver = true
          setGameOver(true)
        }
        continue
      }
    }

    // Revisar colisión con criaturas (solo para proyectiles del jugador)
    if (!p.isMagicBolt) {
      for (let j = creatures.length - 1; j >= 0; j--) {
        const z = creatures[j]
        const creatureRect = getEntityRect(z)
        const projectileRect = {
          x: p.position.x - p.radius,
          y: p.position.y - p.radius,
          width: p.radius * 2,
          height: p.radius * 2,
        }
        if (checkAABBCollision(projectileRect, creatureRect)) {
          // Calcular dirección del empuje
          const knockbackDirection = normalize({
            x: p.velocity.x,
            y: p.velocity.y
          })

          // Guardar posición original para verificar colisiones
          const originalX = z.position.x
          const originalY = z.position.y

          // Aplicar empuje a la criatura
          z.position.x += knockbackDirection.x * KNOCKBACK_FORCE
          z.position.y += knockbackDirection.y * KNOCKBACK_FORCE

          // Verificar colisión con obstáculos después del knockback
          const creatureRectAfterKnockback = getEntityRect(z)
          let collisionDetected = false

          for (const obstacle of gameState.obstacles) {
            if (checkAABBCollision(creatureRectAfterKnockback, obstacle)) {
              collisionDetected = true
              break
            }
          }

          // Si hay colisión con obstáculos, revertir el knockback
          if (collisionDetected) {
            z.position.x = originalX
            z.position.y = originalY
          }

          // Asegurar que la criatura no salga del mapa
          z.position.x = Math.max(z.width / 2, Math.min(MAP_WIDTH - z.width / 2, z.position.x))
          z.position.y = Math.max(z.height / 2, Math.min(MAP_HEIGHT - z.height / 2, z.position.y))

          projectiles.splice(i, 1)
          z.health -= player.upgrades.spellDamage
          if (z.health <= 0) {
            // Manejar explosión si es una criatura explosiva
            if (z.type === 'explosive') {
              handleExplosiveCreatureDeath(z, gameState, setPlayerHealth, playPlayerHit)
            }

            // Reproducir sonido de muerte de criatura según su tipo
            if (playCreatureDeath) {
              playCreatureDeath(z.type)
            }

            // Recompensar cristales según el tipo de criatura
            let crystalsEarned = 0
            if (z.type === 'caster') {
              crystalsEarned = CRYSTAL_REWARD_CASTER_CREATURE
            } else if (z.type === 'tank') {
              crystalsEarned = CRYSTAL_REWARD_TANK_CREATURE
            } else if (z.type === 'speed') {
              crystalsEarned = CRYSTAL_REWARD_SPEED_CREATURE
            } else if (z.type === 'explosive') {
              crystalsEarned = CRYSTAL_REWARD_EXPLOSIVE_CREATURE
            } else {
              crystalsEarned = CRYSTAL_REWARD_NORMAL_CREATURE
            }
            player.crystals += crystalsEarned
            if (setPlayerCoins) {
              setPlayerCoins(player.crystals)
            }

            // Crear partículas de cristales en la posición de la criatura muerta
            const crystalParticle = createCoinParticle(z.position.x, z.position.y, crystalsEarned)
            gameState.crystalParticles.push(crystalParticle)

            creatures.splice(j, 1)
            gameState.score++
            setScore(gameState.score)
            if (creaturesSpawnedThisWave >= creaturesToSpawnThisWave && creatures.length === 0) {
              startNextWave()
            }
          }
          break
        }
      }
    }
  }

  const now = Date.now()
  const canTakeDamage = now - player.lastDamageTime >= INVULNERABILITY_TIME

  if (canTakeDamage) {
    const playerRectForCreatureCollision = {
      x: player.position.x - player.collisionRadius,
      y: player.position.y - player.collisionRadius,
      width: player.collisionRadius * 2,
      height: player.collisionRadius * 2,
    }

    for (let i = creatures.length - 1; i >= 0; i--) {
      const z = creatures[i]
      const creatureRect = getEntityRect(z)
      if (checkAABBCollision(playerRectForCreatureCollision, creatureRect)) {
        player.health -= CREATURE_DAMAGE
        player.lastDamageTime = now
        setPlayerHealth(player.health)

        // Reproducir sonido de jugador herido
        if (playPlayerHit) {
          playPlayerHit()
        }

        if (player.health <= 0) {
          gameState.gameOver = true
          setGameOver(true)
        }
        break
      }
    }
  }
} 