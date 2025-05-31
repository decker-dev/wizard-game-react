"use client"

import { useEffect, useRef, useCallback, useState } from "react"

interface Vector2 {
  x: number
  y: number
}

interface Player {
  position: Vector2
  collisionRadius: number
  width: number
  height: number
  speed: number
  health: number
  angle: number
  sprite: HTMLImageElement | null
  lastDamageTime: number
}

interface Projectile {
  position: Vector2
  velocity: Vector2
  radius: number
  speed: number
  isFireball?: boolean
}

interface Zombie {
  id: string
  position: Vector2
  width: number
  height: number
  speed: number
  health: number
  maxHealth: number
  type: 'normal' | 'shooter'
  lastShotTime?: number
  sprite?: HTMLImageElement | null
}

interface Obstacle {
  x: number
  y: number
  width: number
  height: number
}

interface GameState {
  player: Player
  projectiles: Projectile[]
  zombies: Zombie[]
  obstacles: Obstacle[]
  score: number
  currentWave: number
  zombiesToSpawnThisWave: number
  zombiesRemainingInWave: number // Can be useful for UI or specific logic
  zombiesSpawnedThisWave: number
  gameOver: boolean
  gameWon: boolean
  keys: { [key: string]: boolean }
  mousePosition: Vector2
  waveTransitioning: boolean
}

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 600
const MAP_WIDTH = 2000  // Mapa más grande que el canvas
const MAP_HEIGHT = 1500
const PLAYER_SPEED = 3
const PROJECTILE_SPEED = 10
const ZOMBIE_SPEED_BASE = 0.7 // Base speed for zombies
const PLAYER_SPRITE_WIDTH = 36
const PLAYER_SPRITE_HEIGHT = 36
const PLAYER_COLLISION_RADIUS = 15

const ZOMBIE_WIDTH = 30
const ZOMBIE_HEIGHT = 30
const INITIAL_ZOMBIE_HEALTH = 30
const MAX_WAVES = 5

const ZOMBIE_DAMAGE = 30
const INVULNERABILITY_TIME = 1000

const ZOMBIE_SHOOTER_SPEED = 0.4  // Más lento que los zombies normales
const ZOMBIE_SHOOTER_HEALTH = 50   // Más resistente
const FIREBALL_SPEED = 5          // Velocidad de las bolas de fuego
const FIREBALL_DAMAGE = 50        // Daño de las bolas de fuego
const SHOOTER_FIRE_RATE = 2000    // Dispara cada 2 segundos

const obstaclesData: Obstacle[] = [
  // Esquinas
  { x: 150, y: 150, width: 100, height: 100 },
  { x: MAP_WIDTH - 250, y: 150, width: 100, height: 100 },
  { x: 150, y: MAP_HEIGHT - 250, width: 100, height: 100 },
  { x: MAP_WIDTH - 250, y: MAP_HEIGHT - 250, width: 100, height: 100 },
  // Centro
  { x: MAP_WIDTH / 2 - 50, y: MAP_HEIGHT / 2 - 50, width: 100, height: 100 },
  // Obstáculos adicionales distribuidos
  { x: MAP_WIDTH / 4 - 50, y: MAP_HEIGHT / 2 - 50, width: 100, height: 100 },
  { x: (MAP_WIDTH / 4) * 3 - 50, y: MAP_HEIGHT / 2 - 50, width: 100, height: 100 },
  { x: MAP_WIDTH / 2 - 50, y: MAP_HEIGHT / 4 - 50, width: 100, height: 100 },
  { x: MAP_WIDTH / 2 - 50, y: (MAP_HEIGHT / 4) * 3 - 50, width: 100, height: 100 },
  // Nuevos obstáculos
  { x: MAP_WIDTH / 3 - 50, y: MAP_HEIGHT / 3 - 50, width: 80, height: 80 },
  { x: (MAP_WIDTH / 3) * 2 - 50, y: MAP_HEIGHT / 3 - 50, width: 80, height: 80 },
  { x: MAP_WIDTH / 3 - 50, y: (MAP_HEIGHT / 3) * 2 - 50, width: 80, height: 80 },
  { x: (MAP_WIDTH / 3) * 2 - 50, y: (MAP_HEIGHT / 3) * 2 - 50, width: 80, height: 80 },
  // Obstáculos adicionales en forma de cruz
  { x: MAP_WIDTH / 2 - 250, y: MAP_HEIGHT / 2 - 40, width: 200, height: 80 },
  { x: MAP_WIDTH / 2 + 50, y: MAP_HEIGHT / 2 - 40, width: 200, height: 80 },
  { x: MAP_WIDTH / 2 - 40, y: MAP_HEIGHT / 2 - 250, width: 80, height: 200 },
  { x: MAP_WIDTH / 2 - 40, y: MAP_HEIGHT / 2 + 50, width: 80, height: 200 },
]

const MINIMAP_SIZE = 80 // Tamaño del minimapa
const MINIMAP_PADDING = 10 // Padding desde las esquinas
const MINIMAP_SCALE_X = MINIMAP_SIZE / MAP_WIDTH
const MINIMAP_SCALE_Y = MINIMAP_SIZE / MAP_HEIGHT

export default function BoxheadGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const playerImageRef = useRef<HTMLImageElement | null>(null)
  const zombieSpritesRef = useRef<{[key: string]: HTMLImageElement | null}>({
    'zombie-health-30': null,
    'zombie-health-50': null,
    'zombie-health-80': null,
    'zombie-health-100': null,
    'diablo-health-30': null,
    'diablo-health-50': null,
    'diablo-health-100': null
  })
  const animationFrameRef = useRef<number>(null)

  const initialPlayerState = useCallback(
    (): Player => ({
      position: { x: 70, y: 70 },
      collisionRadius: PLAYER_COLLISION_RADIUS,
      width: PLAYER_SPRITE_WIDTH * 0.8,
      height: PLAYER_SPRITE_HEIGHT * 0.8,
      speed: PLAYER_SPEED,
      health: 100,
      angle: 0,
      sprite: playerImageRef.current,
      lastDamageTime: 0
    }),
    [],
  )

  const initialGameState = useCallback(
    (): GameState => ({
      player: initialPlayerState(),
      projectiles: [],
      zombies: [],
      obstacles: obstaclesData,
      score: 0,
      currentWave: 0,
      zombiesToSpawnThisWave: 0,
      zombiesRemainingInWave: 0,
      zombiesSpawnedThisWave: 0,
      gameOver: false,
      gameWon: false,
      keys: {},
      mousePosition: { x: 70, y: 0 },
      waveTransitioning: false,
    }),
    [initialPlayerState],
  )

  const gameStateRef = useRef<GameState>(initialGameState())
  const lastShotTimeRef = useRef<number>(0)

  const [score, setScore] = useState(0)
  const [currentWave, setCurrentWave] = useState(0)
  const [playerHealth, setPlayerHealth] = useState(100)
  const [gameOver, setGameOver] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [waveMessage, setWaveMessage] = useState("")

  const startNextWave = useCallback(() => {
    if (gameStateRef.current.waveTransitioning || gameStateRef.current.gameWon || gameStateRef.current.gameOver) {
      return
    }
    gameStateRef.current.waveTransitioning = true
    gameStateRef.current.currentWave++
    setCurrentWave(gameStateRef.current.currentWave)

    if (gameStateRef.current.currentWave > MAX_WAVES) {
      gameStateRef.current.gameWon = true
      setGameWon(true)
      setWaveMessage(`You survived all ${MAX_WAVES} waves! YOU WIN!`)
      gameStateRef.current.waveTransitioning = false
      return
    }

    gameStateRef.current.zombiesToSpawnThisWave = 5 + gameStateRef.current.currentWave * 3
    gameStateRef.current.zombiesRemainingInWave = gameStateRef.current.zombiesToSpawnThisWave
    gameStateRef.current.zombiesSpawnedThisWave = 0
    gameStateRef.current.zombies = []

    setWaveMessage(`Wave ${gameStateRef.current.currentWave} starting...`)
    setTimeout(() => {
      setWaveMessage("")
      gameStateRef.current.waveTransitioning = false
    }, 3000)
  }, [])

  const checkAABBCollision = useCallback(
    (
      rect1: { x: number; y: number; width: number; height: number },
      rect2: { x: number; y: number; width: number; height: number },
    ) => {
      return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
      )
    },
    [],
  )

  const getEntityRect = useCallback((entity: { position: Vector2; width: number; height: number }) => {
    return {
      x: entity.position.x - entity.width / 2,
      y: entity.position.y - entity.height / 2,
      width: entity.width,
      height: entity.height,
    }
  }, [])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    gameStateRef.current.keys[e.key.toLowerCase()] = true
  }, [])
  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    gameStateRef.current.keys[e.key.toLowerCase()] = false
  }, [])
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    
    const { player } = gameStateRef.current
    const cameraX = Math.max(0, Math.min(MAP_WIDTH - CANVAS_WIDTH, player.position.x - CANVAS_WIDTH / 2))
    const cameraY = Math.max(0, Math.min(MAP_HEIGHT - CANVAS_HEIGHT, player.position.y - CANVAS_HEIGHT / 2))
    
    gameStateRef.current.mousePosition = { 
      x: mouseX + cameraX,
      y: mouseY + cameraY
    }
  }, [])
  const handleMouseClick = useCallback(
    (e: MouseEvent) => {
      if (
        gameStateRef.current.gameOver ||
        gameStateRef.current.gameWon ||
        isLoading ||
        gameStateRef.current.waveTransitioning
      )
        return
      const { player, mousePosition } = gameStateRef.current
      const now = Date.now()
      if (now - lastShotTimeRef.current > 250) {
        const direction = normalize({
          x: mousePosition.x - player.position.x,
          y: mousePosition.y - player.position.y
        })
        gameStateRef.current.projectiles.push({
          position: { ...player.position },
          velocity: { x: direction.x * PROJECTILE_SPEED, y: direction.y * PROJECTILE_SPEED },
          radius: 4,
          speed: PROJECTILE_SPEED,
        })
        lastShotTimeRef.current = now
      }
    },
    [isLoading],
  )

  const updatePlayer = useCallback(() => {
    const { player, keys, mousePosition, obstacles } = gameStateRef.current
    const { speed, width, height } = player
    const oldPos = { ...player.position }

    let dx = 0
    let dy = 0

    if (keys["w"] || keys["arrowup"]) dy -= speed
    if (keys["s"] || keys["arrowdown"]) dy += speed
    if (keys["a"] || keys["arrowleft"]) dx -= speed
    if (keys["d"] || keys["arrowright"]) dx += speed

    if (dx !== 0 && dy !== 0) {
      const mag = Math.sqrt(dx * dx + dy * dy)
      dx = (dx / mag) * speed
      dy = (dy / mag) * speed
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
    let collidedY = false
    for (const obs of obstacles) {
      if (checkAABBCollision(playerRect, obs)) {
        player.position.y = oldPos.y
        collidedY = true
        if (collidedX) player.position.x = oldPos.x
        break
      }
    }

    player.position.x = Math.max(width / 2, Math.min(MAP_WIDTH - width / 2, player.position.x))
    player.position.y = Math.max(height / 2, Math.min(MAP_HEIGHT - height / 2, player.position.y))

    const angleDx = mousePosition.x - player.position.x
    const angleDy = mousePosition.y - player.position.y
    player.angle = Math.atan2(angleDy, angleDx)
  }, [getEntityRect, checkAABBCollision])

  const updateProjectiles = useCallback(() => {
    const { projectiles, obstacles } = gameStateRef.current
    for (let i = projectiles.length - 1; i >= 0; i--) {
      const p = projectiles[i]
      p.position.x += p.velocity.x
      p.position.y += p.velocity.y
      if (p.position.x < 0 || p.position.x > MAP_WIDTH || p.position.y < 0 || p.position.y > MAP_HEIGHT) {
        projectiles.splice(i, 1)
        continue
      }
      const projectileRect = {
        x: p.position.x - p.radius,
        y: p.position.y - p.radius,
        width: p.radius * 2,
        height: p.radius * 2,
      }
      for (const obs of obstacles) {
        if (checkAABBCollision(projectileRect, obs)) {
          projectiles.splice(i, 1)
          break
        }
      }
    }
  }, [getEntityRect, checkAABBCollision])

  const updateZombies = useCallback(() => {
    const {
      zombies,
      player,
      obstacles,
      waveTransitioning,
      zombiesSpawnedThisWave,
      zombiesToSpawnThisWave,
      currentWave,
      projectiles
    } = gameStateRef.current
    if (waveTransitioning) return

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

      // Determinar si crear un zombie normal o shooter (desde wave 2)
      const isShooter = currentWave >= 2 && Math.random() < 0.2 // 20% de probabilidad de shooter
      const zombieType = isShooter ? 'shooter' : 'normal'
      const zombieHealth = isShooter ? ZOMBIE_SHOOTER_HEALTH : (INITIAL_ZOMBIE_HEALTH + currentWave * 5)
      const zombieSpeed = isShooter ? ZOMBIE_SHOOTER_SPEED : (ZOMBIE_SPEED_BASE + currentWave * 0.05)

      const newZombie: Zombie = {
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

      zombies.push(newZombie)
      gameStateRef.current.zombiesSpawnedThisWave++
    }

    zombies.forEach((zombie) => {
      const oldPos = { ...zombie.position }
      const direction = normalize({
        x: player.position.x - zombie.position.x,
        y: player.position.y - zombie.position.y
      })

      // Movimiento diferente según el tipo
      if (zombie.type === 'shooter') {
        // Los shooters mantienen distancia
        const distanceToPlayer = Math.sqrt(
          Math.pow(player.position.x - zombie.position.x, 2) +
          Math.pow(player.position.y - zombie.position.y, 2)
        )
        
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
  }, [getEntityRect, checkAABBCollision])

  const checkCollisions = useCallback(() => {
    const { projectiles, zombies, player, zombiesSpawnedThisWave, zombiesToSpawnThisWave } = gameStateRef.current
    
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
          if (player.health <= 0) {
            gameStateRef.current.gameOver = true
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
            projectiles.splice(i, 1)
            z.health -= 25
            if (z.health <= 0) {
              zombies.splice(j, 1)
              gameStateRef.current.score++
              setScore(gameStateRef.current.score)
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
          if (player.health <= 0) {
            gameStateRef.current.gameOver = true
            setGameOver(true)
          }
          break
        }
      }
    }
  }, [startNextWave, getEntityRect, checkAABBCollision])

  const getZombieSprite = useCallback((zombie: Zombie) => {
    const healthPercentage = (zombie.health / zombie.maxHealth) * 100
    
    if (zombie.type === 'shooter') {
      // Usar sprites de diablo para shooters
      if (healthPercentage <= 30) {
        return zombieSpritesRef.current['diablo-health-30']
      } else if (healthPercentage <= 50) {
        return zombieSpritesRef.current['diablo-health-50']
      } else {
        return zombieSpritesRef.current['diablo-health-100']
      }
    } else {
      // Usar sprites de zombie para normales
      if (healthPercentage <= 30) {
        return zombieSpritesRef.current['zombie-health-30']
      } else if (healthPercentage <= 50) {
        return zombieSpritesRef.current['zombie-health-50']
      } else if (healthPercentage <= 80) {
        return zombieSpritesRef.current['zombie-health-80']
      } else {
        return zombieSpritesRef.current['zombie-health-100']
      }
    }
  }, [])

  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const { player } = gameStateRef.current

    const cameraX = Math.max(0, Math.min(MAP_WIDTH - CANVAS_WIDTH, player.position.x - CANVAS_WIDTH / 2))
    const cameraY = Math.max(0, Math.min(MAP_HEIGHT - CANVAS_HEIGHT, player.position.y - CANVAS_HEIGHT / 2))

    ctx.fillStyle = "#c2b280"
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    gameStateRef.current.obstacles.forEach((obs) => {
      const screenX = obs.x - cameraX
      const screenY = obs.y - cameraY

      if (
        screenX + obs.width >= 0 &&
        screenX <= CANVAS_WIDTH &&
        screenY + obs.height >= 0 &&
        screenY <= CANVAS_HEIGHT
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

    ctx.fillStyle = "#FFFF00"
    gameStateRef.current.projectiles.forEach((p) => {
      const screenX = p.position.x - cameraX
      const screenY = p.position.y - cameraY
      if (
        screenX >= 0 &&
        screenX <= CANVAS_WIDTH &&
        screenY >= 0 &&
        screenY <= CANVAS_HEIGHT
      ) {
        ctx.fillStyle = p.isFireball ? '#FF4400' : '#FFFF00'
        ctx.beginPath()
        ctx.arc(screenX, screenY, p.radius, 0, Math.PI * 2)
        ctx.fill()
      }
    })

    gameStateRef.current.zombies.forEach((z) => {
      const screenX = z.position.x - cameraX
      const screenY = z.position.y - cameraY

      if (
        screenX + z.width >= 0 &&
        screenX - z.width <= CANVAS_WIDTH &&
        screenY + z.height >= 0 &&
        screenY - z.height <= CANVAS_HEIGHT
      ) {
        const zombieSprite = getZombieSprite(z)
        
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

        // Barra de vida
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

    // Renderizar el minimapa
    // Fondo del minimapa
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
    ctx.fillRect(
      CANVAS_WIDTH - MINIMAP_SIZE - MINIMAP_PADDING,
      MINIMAP_PADDING,
      MINIMAP_SIZE,
      MINIMAP_SIZE
    )

    // Borde del minimapa
    ctx.strokeStyle = "#FFFFFF"
    ctx.lineWidth = 2
    ctx.strokeRect(
      CANVAS_WIDTH - MINIMAP_SIZE - MINIMAP_PADDING,
      MINIMAP_PADDING,
      MINIMAP_SIZE,
      MINIMAP_SIZE
    )

    // Área visible en el minimapa
    const visibleAreaX = (cameraX / MAP_WIDTH) * MINIMAP_SIZE
    const visibleAreaY = (cameraY / MAP_HEIGHT) * MINIMAP_SIZE
    const visibleAreaWidth = (CANVAS_WIDTH / MAP_WIDTH) * MINIMAP_SIZE
    const visibleAreaHeight = (CANVAS_HEIGHT / MAP_HEIGHT) * MINIMAP_SIZE

    ctx.strokeStyle = "#FFFF00"
    ctx.strokeRect(
      CANVAS_WIDTH - MINIMAP_SIZE - MINIMAP_PADDING + visibleAreaX,
      MINIMAP_PADDING + visibleAreaY,
      visibleAreaWidth,
      visibleAreaHeight
    )

    // Obstáculos en el minimapa
    gameStateRef.current.obstacles.forEach((obs) => {
      const minimapX = CANVAS_WIDTH - MINIMAP_SIZE - MINIMAP_PADDING + obs.x * MINIMAP_SCALE_X
      const minimapY = MINIMAP_PADDING + obs.y * MINIMAP_SCALE_Y
      ctx.fillStyle = "#808080"
      ctx.fillRect(
        minimapX,
        minimapY,
        obs.width * MINIMAP_SCALE_X,
        obs.height * MINIMAP_SCALE_Y
      )
    })

    // Zombies en el minimapa
    gameStateRef.current.zombies.forEach((z) => {
      const minimapX = CANVAS_WIDTH - MINIMAP_SIZE - MINIMAP_PADDING + z.position.x * MINIMAP_SCALE_X
      const minimapY = MINIMAP_PADDING + z.position.y * MINIMAP_SCALE_Y
      ctx.fillStyle = z.type === 'shooter' ? '#FF4444' : '#2E8B57'
      ctx.fillRect(
        minimapX - 2,
        minimapY - 2,
        4,
        4
      )
    })

    // Jugador en el minimapa
    const playerMinimapX = CANVAS_WIDTH - MINIMAP_SIZE - MINIMAP_PADDING + player.position.x * MINIMAP_SCALE_X
    const playerMinimapY = MINIMAP_PADDING + player.position.y * MINIMAP_SCALE_Y
    ctx.fillStyle = "#FF0000"
    ctx.beginPath()
    ctx.arc(playerMinimapX, playerMinimapY, 3, 0, Math.PI * 2)
    ctx.fill()

    // Mensajes de wave
    if (waveMessage) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
      ctx.fillRect(CANVAS_WIDTH / 4, CANVAS_HEIGHT / 3, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 4)
      ctx.font = "bold 24px Arial"
      ctx.fillStyle = "#FFFFFF"
      ctx.textAlign = "center"
      ctx.fillText(waveMessage, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 10)
      if (gameStateRef.current.waveTransitioning && !gameStateRef.current.gameWon && !gameStateRef.current.gameOver) {
        ctx.font = "16px Arial"
        ctx.fillText("Prepare yourself!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20)
      }
      ctx.textAlign = "left"
    }
  }, [waveMessage, getZombieSprite])

  const gameLoop = useCallback(() => {
    if (!gameStateRef.current.gameOver && !gameStateRef.current.gameWon) {
      updatePlayer()
      updateZombies()
      updateProjectiles()
      checkCollisions()
    }
    render()
    animationFrameRef.current = requestAnimationFrame(gameLoop)
  }, [updatePlayer, updateZombies, updateProjectiles, checkCollisions, render])

  useEffect(() => {
    const loadAssets = async () => {
      try {
        // Cargar imagen del jugador
        const playerImg = new Image()
        playerImg.src = "/new-sprites/soldier1.png"
        await new Promise((resolve, reject) => {
          playerImg.onload = resolve
          playerImg.onerror = reject
        })
        playerImageRef.current = playerImg

        // Cargar sprites de zombies
        const zombieSprites = [
          'zombie-health-30',
          'zombie-health-50', 
          'zombie-health-80',
          'zombie-health-100',
          'diablo-health-30',
          'diablo-health-50',
          'diablo-health-100'
        ]

        for (const spriteName of zombieSprites) {
          const img = new Image()
          img.src = `/new-sprites/${spriteName}.png`
          await new Promise((resolve, reject) => {
            img.onload = resolve
            img.onerror = reject
          })
          zombieSpritesRef.current[spriteName] = img
        }

        // Actualizar el sprite del jugador en el estado del juego
        if (gameStateRef.current && gameStateRef.current.player) {
          gameStateRef.current.player.sprite = playerImg
        }
        
        setIsLoading(false)
        startNextWave()
      } catch (error) {
        console.error("Failed to load game assets:", error)
        setIsLoading(false)
      }
    }

    loadAssets()
  }, [startNextWave])

  useEffect(() => {
    if (!isLoading) {
      animationFrameRef.current = requestAnimationFrame(gameLoop)
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isLoading, gameLoop])

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    const canvasElement = canvasRef.current
    if (canvasElement) {
      canvasElement.addEventListener("mousemove", handleMouseMove)
      canvasElement.addEventListener("click", handleMouseClick)
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      if (canvasElement) {
        canvasElement.removeEventListener("mousemove", handleMouseMove)
        canvasElement.removeEventListener("click", handleMouseClick)
      }
    }
  }, [handleKeyDown, handleKeyUp, handleMouseMove, handleMouseClick])

  const resetGame = useCallback(() => {
    gameStateRef.current = initialGameState()
    if (playerImageRef.current) {
      gameStateRef.current.player.sprite = playerImageRef.current
    }
    setScore(0)
    setCurrentWave(0)
    setPlayerHealth(100)
    gameStateRef.current.player.health = 100
    setGameOver(false)
    setGameWon(false)
    setWaveMessage("")
    startNextWave()
  }, [initialGameState, startNextWave])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-800 text-white text-2xl">
        Loading Game Assets...
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 p-4">
      <div className="mb-4 text-white text-center">
        <h1 className="text-4xl font-bold mb-2">Boxhead Zombie Siege</h1>
        <div className="flex justify-center gap-6 text-xl">
          <div>Kills: {score}</div>
          <div>
            Wave: {currentWave} / {MAX_WAVES}
          </div>
          <div>Health: {playerHealth}</div>
        </div>
      </div>
      <div className="relative shadow-2xl">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="border-4 border-black bg-gray-300"
        />
        {(gameOver || gameWon) && (
          <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center text-white">
            <h2 className="text-5xl font-bold mb-6">{gameWon ? "YOU WIN!" : "GAME OVER!"}</h2>
            {gameWon && <p className="text-2xl mb-4">You successfully defended against all zombie waves!</p>}
            <p className="text-2xl mb-4">Zombies Killed: {score}</p>
            <p className="text-2xl mb-6">Survived to Wave: {currentWave}</p>
            <button
              onClick={resetGame}
              className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xl transition-colors"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
      <div className="mt-4 text-gray-300 text-center max-w-lg">
        <p className="text-sm">WASD/Arrows to Move. Mouse to Aim. Click to Shoot. Survive the zombie onslaught!</p>
      </div>
    </div>
  )
}

const normalize = (vector: Vector2): Vector2 => {
  const mag = Math.sqrt(vector.x ** 2 + vector.y ** 2)
  if (mag === 0) return { x: 0, y: 0 }
  return { x: vector.x / mag, y: vector.y / mag }
}
