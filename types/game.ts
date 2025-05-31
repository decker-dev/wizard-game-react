export interface Vector2 {
  x: number
  y: number
}

export interface PlayerUpgrades {
  weaponDamage: number
  maxHealth: number
  weaponLevel: number
  healthLevel: number
  projectileCount: number
  projectileSize: number
  fireRate: number
  spread: number
}

export interface Player {
  position: Vector2
  collisionRadius: number
  width: number
  height: number
  speed: number
  health: number
  maxHealth: number
  angle: number
  sprites: {
    N: HTMLImageElement | null
    S: HTMLImageElement | null
    E: HTMLImageElement | null
    W: HTMLImageElement | null
  }
  lastDamageTime: number
  lastMovementDirection: Vector2
  coins: number
  upgrades: PlayerUpgrades
}

export interface Projectile {
  position: Vector2
  velocity: Vector2
  radius: number
  speed: number
  isFireball?: boolean
}

export interface Zombie {
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

export interface Obstacle {
  x: number
  y: number
  width: number
  height: number
}

export interface CoinParticle {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  alpha: number
  scale: number
  coins: number
}

export interface GameState {
  player: Player
  projectiles: Projectile[]
  zombies: Zombie[]
  obstacles: Obstacle[]
  score: number
  currentWave: number
  zombiesToSpawnThisWave: number
  zombiesRemainingInWave: number
  zombiesSpawnedThisWave: number
  gameOver: boolean
  gameWon: boolean
  keys: { [key: string]: boolean }
  mousePosition: Vector2
  waveTransitioning: boolean
  showMarketplace: boolean
  coinParticles: CoinParticle[]
}

export interface LeaderboardEntry {
  id: string
  player_name: string
  score: number
  waves_survived: number
  created_at: string
}

export interface ScoreSubmission {
  player_name: string
  score: number
  waves_survived: number
} 