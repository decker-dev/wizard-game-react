export interface Vector2 {
  x: number
  y: number
}

export interface PlayerUpgrades {
  spellDamage: number
  maxHealth: number
  spellLevel: number
  healthLevel: number
  projectileCount: number
  projectileSize: number
  castRate: number
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
  sprites: { [key: string]: HTMLImageElement | null }
  lastDamageTime: number
  lastMovementDirection: Vector2
  crystals: number
  upgrades: PlayerUpgrades
  direction: 'N' | 'S' | 'E' | 'O'
  isMoving: boolean
  animationFrame: 'L' | 'R' | 'S'
  lastAnimationTime: number
  // Mobile joystick movement
  dx?: number
  dy?: number
}

export interface Projectile {
  position: Vector2
  velocity: Vector2
  radius: number
  speed: number
  isMagicBolt?: boolean
  isBossProjectile?: boolean
}

export interface Creature {
  id: string
  position: Vector2
  width: number
  height: number
  speed: number
  health: number
  maxHealth: number
  type: 'normal' | 'caster' | 'tank' | 'speed' | 'explosive' | 'boss'
  lastSpellTime?: number
  sprite?: HTMLImageElement | null
  direction: 'N' | 'S' | 'E' | 'O'
  isMoving: boolean
  animationFrame: 'L' | 'R' | 'S'
  lastAnimationTime: number
  lastPosition?: Vector2
  currentPath?: Vector2[]
  currentPathIndex?: number
  lastPathUpdate?: number
  targetPosition?: Vector2
}

export interface Obstacle {
  x: number
  y: number
  width: number
  height: number
}

export interface CrystalParticle {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  alpha: number
  scale: number
  crystals: number
}

export interface GameState {
  player: Player
  projectiles: Projectile[]
  creatures: Creature[]
  obstacles: Obstacle[]
  score: number
  currentWave: number
  creaturesToSpawnThisWave: number
  creaturesRemainingInWave: number
  creaturesSpawnedThisWave: number
  gameOver: boolean
  gameWon: boolean
  keys: { [key: string]: boolean }
  mousePosition: Vector2
  waveTransitioning: boolean
  showMarketplace: boolean
  crystalParticles: CrystalParticle[]
  mobConfig: MobConfig
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

// Configuración para habilitar/deshabilitar tipos de mobs
export interface MobConfig {
  normal: boolean
  caster: boolean
  tank: boolean
  speed: boolean
  explosive: boolean
  boss: boolean
} 