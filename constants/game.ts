// Canvas and Map dimensions
export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;
export const MAP_WIDTH = 2000;
export const MAP_HEIGHT = 1500;

// Development/Testing constants
export const STARTING_WAVE = 1;
export const STARTING_CRYSTALS = 0;

// Player constants
export const PLAYER_SPEED = 3;
export const PLAYER_SPRITE_WIDTH = 36;
export const PLAYER_SPRITE_HEIGHT = 36;
export const PLAYER_COLLISION_RADIUS = 15;
export const BASE_MAX_HEALTH = 100; // Vida base del jugador

// Projectile constants
export const PROJECTILE_SPEED = 10;
export const PROJECTILE_MAX_RANGE = 350; // Distancia máxima que pueden viajar los proyectiles del jugador

// Creature constants
export const CREATURE_SPEED_BASE = 0.7;
export const CREATURE_WIDTH = 30;
export const CREATURE_HEIGHT = 30;
export const INITIAL_CREATURE_HEALTH = 30;
export const CREATURE_DAMAGE = 30;

// Caster creature constants
export const CREATURE_CASTER_SPEED = 0.4;
export const CREATURE_CASTER_HEALTH = 50;
export const MAGIC_BOLT_SPEED = 5;
export const MAGIC_BOLT_DAMAGE = 50;
export const CASTER_CAST_RATE = 2000;

// Tank creature constants
export const CREATURE_TANK_SPEED = 0.3;
export const CREATURE_TANK_HEALTH = 120;
export const TANK_SIZE_MULTIPLIER = 1.5; // 50% más grande

// Speed creature constants
export const CREATURE_SPEED_FAST = 1.8;
export const CREATURE_SPEED_HEALTH = 15;
export const SPEED_SIZE_MULTIPLIER = 0.8; // 20% más pequeño

// Explosive creature constants
export const CREATURE_EXPLOSIVE_SPEED = 0.6;
export const CREATURE_EXPLOSIVE_HEALTH = 25;
export const EXPLOSION_RADIUS = 80;
export const EXPLOSION_DAMAGE = 40;

// Crystal rewards
export const CRYSTAL_REWARD_NORMAL_CREATURE = 3;
export const CRYSTAL_REWARD_CASTER_CREATURE = 7;
export const CRYSTAL_REWARD_TANK_CREATURE = 10;
export const CRYSTAL_REWARD_SPEED_CREATURE = 5;
export const CRYSTAL_REWARD_EXPLOSIVE_CREATURE = 8;
export const CRYSTAL_REWARD_BOSS_CREATURE = 50; // Gran recompensa por derrotar un boss

// Marketplace & Upgrades - Precios base que escalan
export const SPELL_UPGRADE_BASE_COST = 6;
export const HEALTH_UPGRADE_BASE_COST = 5;
export const UPGRADE_COST_MULTIPLIER = 1.8; // Cada nivel cuesta 80% más
export const BASE_SPELL_DAMAGE = 25;
export const SPELL_DAMAGE_INCREASE = 12;
export const HEALTH_INCREASE = 20;
export const MAX_UPGRADE_LEVEL = 5;

// Nuevas constantes para mejoras avanzadas de hechizos
export const BASE_PROJECTILE_COUNT = 1;
export const BASE_PROJECTILE_SIZE = 1.0;
export const BASE_CAST_RATE = 250; // milisegundos entre hechizos
export const BASE_SPREAD = 0; // radianes

// Incrementos por nivel de mejora
export const PROJECTILE_COUNT_INCREASE = 1; // +1 proyectil por nivel (nivel 2 = 2 hechizos, etc)
export const PROJECTILE_SIZE_INCREASE = 0.3; // +30% tamaño por nivel
export const CAST_RATE_IMPROVEMENT = 50; // -50ms por nivel (más rápido)
export const SPREAD_INCREASE = 0.15; // +0.15 radianes de dispersión por proyectil adicional

// Combat constants
export const KNOCKBACK_FORCE = 50;
export const INVULNERABILITY_TIME = 1000;

// Game progression - Waves are now infinite!
// export const MAX_WAVES = 5; // Removed - waves are now infinite
export const BASE_CREATURES_PER_WAVE = 5;
export const CREATURES_INCREASE_PER_WAVE = 3;
export const CREATURE_HEALTH_INCREASE_PER_WAVE = 5;
export const CREATURE_SPEED_INCREASE_PER_WAVE = 0.05;
export const CASTER_SPAWN_CHANCE_INCREASE = 0.02; // Aumenta 2% cada wave
export const MAX_CASTER_SPAWN_CHANCE = 0.6; // Máximo 60% de casters
export const MAGIC_BOLT_SPEED_INCREASE_PER_WAVE = 0.1;
export const CASTER_CAST_RATE_IMPROVEMENT_PER_WAVE = 50; // Reducir tiempo entre hechizos
export const MAGIC_BOLT_SIZE_INCREASE_PER_WAVE = 0.1; // Aumentar tamaño de magic bolts

// Escalado exponencial para waves muy altas (cada 10 waves)
export const EXPONENTIAL_SCALING_INTERVAL = 10;
export const EXPONENTIAL_HEALTH_MULTIPLIER = 1.5;
export const EXPONENTIAL_SPEED_MULTIPLIER = 1.2;
export const EXPONENTIAL_SPAWN_MULTIPLIER = 1.3;

// Límites máximos para evitar que el juego sea imposible
export const MAX_CREATURE_SPEED = 3.0;
export const MAX_MAGIC_BOLT_SPEED = 8.0;
export const MIN_CASTER_CAST_RATE = 300; // ms

// Minimap constants
export const MINIMAP_SIZE = 80;
export const MINIMAP_PADDING = 10;
export const MINIMAP_SCALE_X = MINIMAP_SIZE / MAP_WIDTH;
export const MINIMAP_SCALE_Y = MINIMAP_SIZE / MAP_HEIGHT;

// Wall rendering constants
export const WALL_BLOCK_SIZE = 32; // Tamaño de cada bloque individual de pared

// Spawn chances para nuevos tipos de criaturas
export const TANK_SPAWN_CHANCE_BASE = 0.05; // 5% base desde wave 3
export const TANK_SPAWN_CHANCE_INCREASE = 0.01; // +1% cada wave
export const MAX_TANK_SPAWN_CHANCE = 0.25; // Máximo 25% de tanks

export const SPEED_SPAWN_CHANCE_BASE = 0.08; // 8% base desde wave 2
export const SPEED_SPAWN_CHANCE_INCREASE = 0.015; // +1.5% cada wave
export const MAX_SPEED_SPAWN_CHANCE = 0.35; // Máximo 35% de speed

export const EXPLOSIVE_SPAWN_CHANCE_BASE = 0.03; // 3% base desde wave 4
export const EXPLOSIVE_SPAWN_CHANCE_INCREASE = 0.008; // +0.8% cada wave
export const MAX_EXPLOSIVE_SPAWN_CHANCE = 0.2; // Máximo 20% de explosive

// Boss creature constants - TODO: Cambiar assets del boss más adelante
export const CREATURE_BOSS_SPEED = 0.2; // Muy lento pero resistente
export const CREATURE_BOSS_HEALTH_BASE = 300; // Mucha vida base
export const CREATURE_BOSS_HEALTH_MULTIPLIER = 1.5; // Escala más que otros
export const BOSS_SIZE_MULTIPLIER = 2.0; // Doble de tamaño que criaturas normales
export const BOSS_CAST_RATE = 1500; // Dispara cada 1.5 segundos
export const BOSS_PROJECTILE_SPEED = 3; // Proyectiles más lentos
export const BOSS_PROJECTILE_DAMAGE = 120; // MUCHO más daño - casi mata de un golpe
export const BOSS_PROJECTILE_SIZE = 12; // Proyectiles más grandes
export const BOSS_SPAWN_INTERVAL = 5; // Cada 5 oleadas
export const BOSS_CONTACT_DAMAGE = 80; // Daño por contacto físico del Boss

// Health Pack constants
export const HEALTH_PACK_SIZE = 24; // Tamaño del sprite del pack de vida
export const HEALTH_PACK_HEAL_AMOUNT = 25; // Cantidad de vida que restaura (pequeña)
export const HEALTH_PACK_SPAWN_CHANCE_PER_WAVE = 0.85; // 70% de probabilidad por wave de que aparezca al menos uno
export const HEALTH_PACK_MAX_PER_WAVE = 5; // Máximo 10 packs por oleada
export const HEALTH_PACK_MIN_WAVE = 2; // Aparecen a partir de la ronda 1
export const HEALTH_PACK_MIN_DISTANCE_FROM_PLAYER = 150; // Distancia mínima del jugador para spawn
export const HEALTH_PACK_MIN_DISTANCE_FROM_OBSTACLES = 50; // Distancia mínima de obstáculos
