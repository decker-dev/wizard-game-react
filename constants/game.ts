// Canvas and Map dimensions
export const CANVAS_WIDTH = 800
export const CANVAS_HEIGHT = 600
export const MAP_WIDTH = 2000
export const MAP_HEIGHT = 1500

// Player constants
export const PLAYER_SPEED = 3
export const PLAYER_SPRITE_WIDTH = 36
export const PLAYER_SPRITE_HEIGHT = 36
export const PLAYER_COLLISION_RADIUS = 15

// Projectile constants
export const PROJECTILE_SPEED = 10

// Zombie constants
export const ZOMBIE_SPEED_BASE = 0.7
export const ZOMBIE_WIDTH = 30
export const ZOMBIE_HEIGHT = 30
export const INITIAL_ZOMBIE_HEALTH = 30
export const ZOMBIE_DAMAGE = 30

// Shooter zombie constants
export const ZOMBIE_SHOOTER_SPEED = 0.4
export const ZOMBIE_SHOOTER_HEALTH = 50
export const FIREBALL_SPEED = 5
export const FIREBALL_DAMAGE = 50
export const SHOOTER_FIRE_RATE = 2000

// Combat constants
export const KNOCKBACK_FORCE = 50
export const INVULNERABILITY_TIME = 1000

// Game progression
export const MAX_WAVES = 5

// Minimap constants
export const MINIMAP_SIZE = 80
export const MINIMAP_PADDING = 10
export const MINIMAP_SCALE_X = MINIMAP_SIZE / MAP_WIDTH
export const MINIMAP_SCALE_Y = MINIMAP_SIZE / MAP_HEIGHT 