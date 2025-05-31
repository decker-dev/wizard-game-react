// Canvas and Map dimensions
export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;
export const MAP_WIDTH = 2000;
export const MAP_HEIGHT = 1500;

// Player constants
export const PLAYER_SPEED = 3;
export const PLAYER_SPRITE_WIDTH = 36;
export const PLAYER_SPRITE_HEIGHT = 36;
export const PLAYER_COLLISION_RADIUS = 15;

// Projectile constants
export const PROJECTILE_SPEED = 10;

// Zombie constants
export const ZOMBIE_SPEED_BASE = 0.7;
export const ZOMBIE_WIDTH = 30;
export const ZOMBIE_HEIGHT = 30;
export const INITIAL_ZOMBIE_HEALTH = 30;
export const ZOMBIE_DAMAGE = 30;

// Shooter zombie constants
export const ZOMBIE_SHOOTER_SPEED = 0.4;
export const ZOMBIE_SHOOTER_HEALTH = 50;
export const FIREBALL_SPEED = 5;
export const FIREBALL_DAMAGE = 50;
export const SHOOTER_FIRE_RATE = 2000;

// Coin rewards
export const COIN_REWARD_NORMAL_ZOMBIE = 3;
export const COIN_REWARD_SHOOTER_ZOMBIE = 7;

// Marketplace & Upgrades - Precios base que escalan
export const WEAPON_UPGRADE_BASE_COST = 6;
export const HEALTH_UPGRADE_BASE_COST = 5;
export const UPGRADE_COST_MULTIPLIER = 1.8; // Cada nivel cuesta 80% más
export const BASE_WEAPON_DAMAGE = 25;
export const WEAPON_DAMAGE_INCREASE = 12;
export const BASE_MAX_HEALTH = 100;
export const HEALTH_INCREASE = 20;
export const MAX_UPGRADE_LEVEL = 5;

// Nuevas constantes para mejoras avanzadas de armas
export const BASE_PROJECTILE_COUNT = 1;
export const BASE_PROJECTILE_SIZE = 1.0;
export const BASE_FIRE_RATE = 250; // milisegundos entre disparos
export const BASE_SPREAD = 0; // radianes

// Incrementos por nivel de mejora
export const PROJECTILE_COUNT_INCREASE = 1; // +1 proyectil por nivel (nivel 2 = 2 balas, etc)
export const PROJECTILE_SIZE_INCREASE = 0.3; // +30% tamaño por nivel
export const FIRE_RATE_IMPROVEMENT = 50; // -50ms por nivel (más rápido)
export const SPREAD_INCREASE = 0.15; // +0.15 radianes de dispersión por proyectil adicional

// Combat constants
export const KNOCKBACK_FORCE = 50;
export const INVULNERABILITY_TIME = 1000;

// Game progression - Waves are now infinite!
// export const MAX_WAVES = 5; // Removed - waves are now infinite
export const BASE_ZOMBIES_PER_WAVE = 5
export const ZOMBIES_INCREASE_PER_WAVE = 3
export const ZOMBIE_HEALTH_INCREASE_PER_WAVE = 5
export const ZOMBIE_SPEED_INCREASE_PER_WAVE = 0.05
export const SHOOTER_SPAWN_CHANCE_INCREASE = 0.02 // Aumenta 2% cada wave
export const MAX_SHOOTER_SPAWN_CHANCE = 0.6 // Máximo 60% de shooters
export const FIREBALL_SPEED_INCREASE_PER_WAVE = 0.1
export const SHOOTER_FIRE_RATE_IMPROVEMENT_PER_WAVE = 50 // Reducir tiempo entre disparos
export const FIREBALL_SIZE_INCREASE_PER_WAVE = 0.1 // Aumentar tamaño de fireballs

// Escalado exponencial para waves muy altas (cada 10 waves)
export const EXPONENTIAL_SCALING_INTERVAL = 10
export const EXPONENTIAL_HEALTH_MULTIPLIER = 1.5
export const EXPONENTIAL_SPEED_MULTIPLIER = 1.2
export const EXPONENTIAL_SPAWN_MULTIPLIER = 1.3

// Límites máximos para evitar que el juego sea imposible
export const MAX_ZOMBIE_SPEED = 3.0
export const MAX_FIREBALL_SPEED = 8.0
export const MIN_SHOOTER_FIRE_RATE = 300 // ms

// Minimap constants
export const MINIMAP_SIZE = 80;
export const MINIMAP_PADDING = 10;
export const MINIMAP_SCALE_X = MINIMAP_SIZE / MAP_WIDTH;
export const MINIMAP_SCALE_Y = MINIMAP_SIZE / MAP_HEIGHT;

// Wall rendering constants
export const WALL_BLOCK_SIZE = 32; // Tamaño de cada bloque individual de pared
