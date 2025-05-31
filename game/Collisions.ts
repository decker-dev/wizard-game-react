import { GameState } from '@/types/game'
import {
  KNOCKBACK_FORCE,
  ZOMBIE_DAMAGE,
  FIREBALL_DAMAGE,
  INVULNERABILITY_TIME,
  MAP_WIDTH,
  MAP_HEIGHT,
  COIN_REWARD_NORMAL_ZOMBIE,
  COIN_REWARD_SHOOTER_ZOMBIE
} from '@/constants/game'
import { checkAABBCollision, getEntityRect, normalize } from '@/utils/math'
import { createCoinParticle } from '@/utils/coinParticles'

export const checkCollisions = (
  gameState: GameState,
  startNextWave: () => void,
  setScore: (score: number) => void,
  setPlayerHealth: (health: number) => void,
  setGameOver: (gameOver: boolean) => void,
  setPlayerCoins?: (coins: number) => void,
  playZombieDeath?: (zombieType: 'normal' | 'shooter') => void,
  playPlayerHit?: () => void
) => {
  const { projectiles, zombies, player, zombiesSpawnedThisWave, zombiesToSpawnThisWave } = gameState

  // Revisar colisiones de proyectiles con zombies y jugador
  for (let i = projectiles.length - 1; i >= 0; i--) {
    const p = projectiles[i]

    // Si es una bola de fuego, revisar colisión con el jugador
    if (p.isFireball) {
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
        player.health -= FIREBALL_DAMAGE
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

    // Revisar colisión con zombies (solo para proyectiles del jugador)
    if (!p.isFireball) {
      for (let j = zombies.length - 1; j >= 0; j--) {
        const z = zombies[j]
        const zombieRect = getEntityRect(z)
        const projectileRect = {
          x: p.position.x - p.radius,
          y: p.position.y - p.radius,
          width: p.radius * 2,
          height: p.radius * 2,
        }
        if (checkAABBCollision(projectileRect, zombieRect)) {
          // Calcular dirección del empuje
          const knockbackDirection = normalize({
            x: p.velocity.x,
            y: p.velocity.y
          })

          // Guardar posición original para verificar colisiones
          const originalX = z.position.x
          const originalY = z.position.y

          // Aplicar empuje al zombie
          z.position.x += knockbackDirection.x * KNOCKBACK_FORCE
          z.position.y += knockbackDirection.y * KNOCKBACK_FORCE

          // Verificar colisión con obstáculos después del knockback
          const zombieRectAfterKnockback = getEntityRect(z)
          let collisionDetected = false

          for (const obstacle of gameState.obstacles) {
            if (checkAABBCollision(zombieRectAfterKnockback, obstacle)) {
              collisionDetected = true
              break
            }
          }

          // Si hay colisión con obstáculos, revertir el knockback
          if (collisionDetected) {
            z.position.x = originalX
            z.position.y = originalY
          }

          // Asegurar que el zombie no salga del mapa
          z.position.x = Math.max(z.width / 2, Math.min(MAP_WIDTH - z.width / 2, z.position.x))
          z.position.y = Math.max(z.height / 2, Math.min(MAP_HEIGHT - z.height / 2, z.position.y))

          projectiles.splice(i, 1)
          z.health -= player.upgrades.weaponDamage
          if (z.health <= 0) {
            // Reproducir sonido de muerte de zombie según su tipo
            if (playZombieDeath) {
              playZombieDeath(z.type)
            }

            // Recompensar monedas según el tipo de zombie
            const coinsEarned = z.type === 'shooter' ? COIN_REWARD_SHOOTER_ZOMBIE : COIN_REWARD_NORMAL_ZOMBIE
            player.coins += coinsEarned
            if (setPlayerCoins) {
              setPlayerCoins(player.coins)
            }

            // Crear partículas de monedas en la posición del zombie muerto
            const coinParticle = createCoinParticle(z.position.x, z.position.y, coinsEarned)
            gameState.coinParticles.push(coinParticle)

            zombies.splice(j, 1)
            gameState.score++
            setScore(gameState.score)
            if (zombiesSpawnedThisWave >= zombiesToSpawnThisWave && zombies.length === 0) {
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
    const playerRectForZombieCollision = {
      x: player.position.x - player.collisionRadius,
      y: player.position.y - player.collisionRadius,
      width: player.collisionRadius * 2,
      height: player.collisionRadius * 2,
    }

    for (let i = zombies.length - 1; i >= 0; i--) {
      const z = zombies[i]
      const zombieRect = getEntityRect(z)
      if (checkAABBCollision(playerRectForZombieCollision, zombieRect)) {
        player.health -= ZOMBIE_DAMAGE
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