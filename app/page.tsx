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
}

interface Projectile {
  position: Vector2
  velocity: Vector2
  radius: number
  speed: number
}

interface Zombie {
  id: string
  position: Vector2
  width: number
  height: number
  speed: number
  health: number
  maxHealth: number
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

const obstaclesData: Obstacle[] = [
  { x: 100, y: 100, width: 80, height: 80 }, // Top-left
  { x: CANVAS_WIDTH - 180, y: 100, width: 80, height: 80 }, // Top-right
  { x: 100, y: CANVAS_HEIGHT - 180, width: 80, height: 80 }, // Bottom-left
  { x: CANVAS_WIDTH - 180, y: CANVAS_HEIGHT - 180, width: 80, height: 80 }, // Bottom-right
  { x: CANVAS_WIDTH / 2 - 40, y: CANVAS_HEIGHT / 2 - 40, width: 80, height: 80 }, // Center
]

export default function BoxheadGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const playerImageRef = useRef<HTMLImageElement | null>(null)
  const animationFrameRef = useRef<number>()

  const initialPlayerState = useCallback(
    (): Player => ({
      // Corrected Starting Position: Clear of obstacles
      position: { x: 70, y: 70 }, // Changed from CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2
      collisionRadius: PLAYER_COLLISION_RADIUS,
      width: PLAYER_SPRITE_WIDTH * 0.8,
      height: PLAYER_SPRITE_HEIGHT * 0.8,
      speed: PLAYER_SPEED,
      health: 100,
      angle: 0,
      sprite: playerImageRef.current,
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
      mousePosition: { x: 70, y: 0 }, // Initial mouse aim direction
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
    gameStateRef.current.mousePosition = { x: e.clientX - rect.left, y: e.clientY - rect.top }
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
        const direction = normalize({ x: mousePosition.x - player.position.x, y: mousePosition.y - player.position.y })
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

    // Try moving X first
    player.position.x += dx
    let playerRect = getEntityRect(player)
    let collidedX = false
    for (const obs of obstacles) {
      if (checkAABBCollision(playerRect, obs)) {
        player.position.x = oldPos.x // Revert X move
        collidedX = true
        break
      }
    }

    // Try moving Y
    player.position.y += dy
    playerRect = getEntityRect(player) // Update rect with new Y
    let collidedY = false
    for (const obs of obstacles) {
      if (checkAABBCollision(playerRect, obs)) {
        player.position.y = oldPos.y // Revert Y move
        collidedY = true
        // If X also collided, player might be stuck in a corner, ensure X is also reverted.
        if (collidedX) player.position.x = oldPos.x
        break
      }
    }

    // Final clamping to canvas bounds
    player.position.x = Math.max(width / 2, Math.min(CANVAS_WIDTH - width / 2, player.position.x))
    player.position.y = Math.max(height / 2, Math.min(CANVAS_HEIGHT - height / 2, player.position.y))

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
      if (p.position.x < 0 || p.position.x > CANVAS_WIDTH || p.position.y < 0 || p.position.y > CANVAS_HEIGHT) {
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
    } = gameStateRef.current
    if (waveTransitioning) return

    if (zombiesSpawnedThisWave < zombiesToSpawnThisWave && zombies.length < 20 && Math.random() < 0.05) {
      const side = Math.floor(Math.random() * 4)
      let x, y
      switch (side) {
        case 0:
          x = Math.random() * CANVAS_WIDTH
          y = -ZOMBIE_HEIGHT
          break
        case 1:
          x = CANVAS_WIDTH + ZOMBIE_WIDTH
          y = Math.random() * CANVAS_HEIGHT
          break
        case 2:
          x = Math.random() * CANVAS_WIDTH
          y = CANVAS_HEIGHT + ZOMBIE_HEIGHT
          break
        default:
          x = -ZOMBIE_WIDTH
          y = Math.random() * CANVAS_HEIGHT
          break
      }
      const zombieHealth = INITIAL_ZOMBIE_HEALTH + currentWave * 5
      const zombieSpeed = ZOMBIE_SPEED_BASE + currentWave * 0.05
      zombies.push({
        id: `zombie-${Date.now()}-${Math.random()}`,
        position: { x, y },
        width: ZOMBIE_WIDTH,
        height: ZOMBIE_HEIGHT,
        speed: zombieSpeed,
        health: zombieHealth,
        maxHealth: zombieHealth,
      })
      gameStateRef.current.zombiesSpawnedThisWave++
    }

    zombies.forEach((zombie) => {
      const oldPos = { ...zombie.position }
      const direction = normalize({
        x: player.position.x - zombie.position.x,
        y: player.position.y - zombie.position.y,
      })

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
      zombieRect = getEntityRect(zombie) // Update rect with new Y
      for (const obs of obstacles) {
        if (checkAABBCollision(zombieRect, obs)) {
          zombie.position.y = oldPos.y
          if (collidedX) zombie.position.x = oldPos.x // Also revert X if it was reverted
          break
        }
      }
    })
  }, [getEntityRect, checkAABBCollision])

  const checkCollisions = useCallback(() => {
    const { projectiles, zombies, player, zombiesSpawnedThisWave, zombiesToSpawnThisWave } = gameStateRef.current
    for (let i = projectiles.length - 1; i >= 0; i--) {
      const p = projectiles[i]
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
            // gameStateRef.current.zombiesRemainingInWave--; // Not strictly needed if using spawned count and length
            if (zombiesSpawnedThisWave >= zombiesToSpawnThisWave && zombies.length === 0) {
              startNextWave()
            }
          }
          break
        }
      }
    }
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
        // zombies.splice(i, 1); // Zombie is NOT destroyed on contact, it damages player
        player.health -= 10 // Reduced damage from zombie collision
        setPlayerHealth(player.health)
        if (player.health <= 0) {
          gameStateRef.current.gameOver = true
          setGameOver(true)
        }
        // Add a small knockback or temporary invulnerability for player if desired
        // For now, zombie passes through player after damage or gets stuck
        // A better approach would be to resolve zombie/player collision like obstacles
      }
    }
  }, [startNextWave, getEntityRect, checkAABBCollision])

  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.fillStyle = "#c2b280" // Tan background
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    gameStateRef.current.obstacles.forEach((obs) => {
      ctx.fillStyle = "#808080"
      ctx.fillRect(obs.x, obs.y, obs.width, obs.height)
      ctx.strokeStyle = "#000000"
      ctx.lineWidth = 2
      ctx.strokeRect(obs.x, obs.y, obs.width, obs.height)
      ctx.fillStyle = "rgba(0,0,0,0.2)"
      ctx.fillRect(obs.x + 5, obs.y + 5, obs.width, obs.height)
    })

    const { player } = gameStateRef.current
    if (player.sprite) {
      ctx.save()
      ctx.translate(player.position.x, player.position.y)
      ctx.rotate(player.angle + Math.PI / 2)
      ctx.drawImage(
        player.sprite,
        -PLAYER_SPRITE_WIDTH / 2,
        -PLAYER_SPRITE_HEIGHT / 2,
        PLAYER_SPRITE_WIDTH,
        PLAYER_SPRITE_HEIGHT,
      )
      ctx.restore()
    }

    const playerHealthBarWidth = PLAYER_SPRITE_WIDTH
    const playerHealthBarHeight = 6
    ctx.fillStyle = "rgba(255,0,0,0.5)"
    ctx.fillRect(
      player.position.x - playerHealthBarWidth / 2,
      player.position.y - PLAYER_SPRITE_HEIGHT / 2 - 15,
      playerHealthBarWidth,
      playerHealthBarHeight,
    )
    ctx.fillStyle = "rgba(0,255,0,0.8)"
    ctx.fillRect(
      player.position.x - playerHealthBarWidth / 2,
      player.position.y - PLAYER_SPRITE_HEIGHT / 2 - 15,
      playerHealthBarWidth * Math.max(0, player.health / 100),
      playerHealthBarHeight,
    )

    ctx.fillStyle = "#FFFF00"
    gameStateRef.current.projectiles.forEach((p) => {
      ctx.beginPath()
      ctx.arc(p.position.x, p.position.y, p.radius, 0, Math.PI * 2)
      ctx.fill()
    })

    gameStateRef.current.zombies.forEach((z) => {
      ctx.fillStyle = "#2E8B57" // Sea green
      ctx.fillRect(z.position.x - z.width / 2, z.position.y - z.height / 2, z.width, z.height)
      const healthBarWidth = z.width * 0.8
      const healthBarHeight = 5
      ctx.fillStyle = "rgba(255,0,0,0.5)"
      ctx.fillRect(z.position.x - healthBarWidth / 2, z.position.y - z.height / 2 - 10, healthBarWidth, healthBarHeight)
      ctx.fillStyle = "rgba(0,255,0,0.8)"
      ctx.fillRect(
        z.position.x - healthBarWidth / 2,
        z.position.y - z.height / 2 - 10,
        healthBarWidth * Math.max(0, z.health / z.maxHealth),
        healthBarHeight,
      )
    })

    if (waveMessage) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
      ctx.fillRect(CANVAS_WIDTH / 4, CANVAS_HEIGHT / 3, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 4)
      ctx.font = "bold 24px Arial"
      ctx.fillStyle = "#FFFFFF"
      ctx.textAlign = "center"
      ctx.fillText(waveMessage, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 10) // Adjusted text position
      if (gameStateRef.current.waveTransitioning && !gameStateRef.current.gameWon && !gameStateRef.current.gameOver) {
        ctx.font = "16px Arial"
        ctx.fillText("Prepare yourself!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20)
      }
      ctx.textAlign = "left"
    }
  }, [waveMessage])

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
    const img = new Image()
    img.src = "/sprites/soldier.png"
    img.onload = () => {
      playerImageRef.current = img
      if (gameStateRef.current && gameStateRef.current.player) {
        gameStateRef.current.player.sprite = img
      }
      setIsLoading(false)
      // startNextWave is called here, after isLoading is false
      // This ensures the game loop (dependent on isLoading) can start
      // and then wave transition logic proceeds.
      startNextWave()
    }
    img.onerror = () => {
      console.error("Failed to load player sprite.")
      setIsLoading(false)
    }
  }, [startNextWave]) // startNextWave is stable

  useEffect(() => {
    if (!isLoading) {
      animationFrameRef.current = requestAnimationFrame(gameLoop)
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = undefined
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
    setCurrentWave(0) // Will be incremented by startNextWave
    setPlayerHealth(100) // Make sure React state for health is also reset
    gameStateRef.current.player.health = 100 // And the ref state
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
