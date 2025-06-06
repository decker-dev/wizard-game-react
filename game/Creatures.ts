import {
	BOSS_CAST_RATE,
	BOSS_PROJECTILE_DAMAGE,
	BOSS_PROJECTILE_SIZE,
	BOSS_PROJECTILE_SPEED,
	BOSS_SIZE_MULTIPLIER,
	BOSS_SPAWN_INTERVAL,
	CASTER_CAST_RATE,
	CASTER_CAST_RATE_IMPROVEMENT_PER_WAVE,
	CASTER_SPAWN_CHANCE_INCREASE,
	CREATURE_BOSS_HEALTH_BASE,
	CREATURE_BOSS_HEALTH_MULTIPLIER,
	// Constantes del Boss
	CREATURE_BOSS_SPEED,
	CREATURE_CASTER_HEALTH,
	CREATURE_CASTER_SPEED,
	CREATURE_EXPLOSIVE_HEALTH,
	CREATURE_EXPLOSIVE_SPEED,
	CREATURE_HEALTH_INCREASE_PER_WAVE,
	CREATURE_HEIGHT,
	CREATURE_SPEED_BASE,
	CREATURE_SPEED_FAST,
	CREATURE_SPEED_HEALTH,
	CREATURE_SPEED_INCREASE_PER_WAVE,
	CREATURE_TANK_HEALTH,
	// Nuevas constantes para tipos de criaturas
	CREATURE_TANK_SPEED,
	CREATURE_WIDTH,
	EXPLOSION_DAMAGE,
	EXPLOSION_RADIUS,
	EXPLOSIVE_SPAWN_CHANCE_BASE,
	EXPLOSIVE_SPAWN_CHANCE_INCREASE,
	EXPONENTIAL_HEALTH_MULTIPLIER,
	EXPONENTIAL_SCALING_INTERVAL,
	EXPONENTIAL_SPEED_MULTIPLIER,
	INITIAL_CREATURE_HEALTH,
	MAGIC_BOLT_SIZE_INCREASE_PER_WAVE,
	MAGIC_BOLT_SPEED,
	MAGIC_BOLT_SPEED_INCREASE_PER_WAVE,
	MAP_HEIGHT,
	MAP_WIDTH,
	MAX_CASTER_SPAWN_CHANCE,
	MAX_CREATURE_SPEED,
	MAX_EXPLOSIVE_SPAWN_CHANCE,
	MAX_MAGIC_BOLT_SPEED,
	MAX_SPEED_SPAWN_CHANCE,
	MAX_TANK_SPAWN_CHANCE,
	MIN_CASTER_CAST_RATE,
	SPEED_SIZE_MULTIPLIER,
	SPEED_SPAWN_CHANCE_BASE,
	SPEED_SPAWN_CHANCE_INCREASE,
	TANK_SIZE_MULTIPLIER,
	TANK_SPAWN_CHANCE_BASE,
	TANK_SPAWN_CHANCE_INCREASE,
} from "@/constants/game";
import type { Creature, GameState, Vector2 } from "@/types/game";
import {
	checkAABBCollision,
	distance,
	getEntityRect,
	normalize,
} from "@/utils/math";
import { CreatureAI } from "./AIBehaviors";
import { pathfinder } from "./Pathfinding";

export const createCreature = (
	x: number,
	y: number,
	currentWave: number,
	mobConfig?: {
		normal: boolean;
		caster: boolean;
		tank: boolean;
		speed: boolean;
		explosive: boolean;
		boss: boolean;
	},
): Creature => {
	// Calcular multiplicador exponencial para waves altas
	const exponentialBonus = Math.floor(
		currentWave / EXPONENTIAL_SCALING_INTERVAL,
	);
	const healthMultiplier = EXPONENTIAL_HEALTH_MULTIPLIER ** exponentialBonus;
	const speedMultiplier = EXPONENTIAL_SPEED_MULTIPLIER ** exponentialBonus;

	// Configuración por defecto (todos habilitados)
	const config = mobConfig || {
		normal: true,
		caster: true,
		tank: true,
		speed: true,
		explosive: true,
		boss: true,
	};

	// Calcular probabilidades de spawn para cada tipo (solo si están habilitados)
	const casterChance =
		config.caster && currentWave >= 2
			? Math.min(
				0.1 + (currentWave - 1) * CASTER_SPAWN_CHANCE_INCREASE,
				MAX_CASTER_SPAWN_CHANCE,
			)
			: 0;

	const tankChance =
		config.tank && currentWave >= 3
			? Math.min(
				TANK_SPAWN_CHANCE_BASE +
				(currentWave - 3) * TANK_SPAWN_CHANCE_INCREASE,
				MAX_TANK_SPAWN_CHANCE,
			)
			: 0;

	const speedChance =
		config.speed && currentWave >= 2
			? Math.min(
				SPEED_SPAWN_CHANCE_BASE +
				(currentWave - 2) * SPEED_SPAWN_CHANCE_INCREASE,
				MAX_SPEED_SPAWN_CHANCE,
			)
			: 0;

	const explosiveChance =
		config.explosive && currentWave >= 4
			? Math.min(
				EXPLOSIVE_SPAWN_CHANCE_BASE +
				(currentWave - 4) * EXPLOSIVE_SPAWN_CHANCE_INCREASE,
				MAX_EXPLOSIVE_SPAWN_CHANCE,
			)
			: 0;

	// Determinar tipo de criatura basado en probabilidades
	const random = Math.random();
	let creatureType:
		| "normal"
		| "caster"
		| "tank"
		| "speed"
		| "explosive"
		| "boss" = "normal";

	if (random < explosiveChance) {
		creatureType = "explosive";
	} else if (random < explosiveChance + tankChance) {
		creatureType = "tank";
	} else if (random < explosiveChance + tankChance + speedChance) {
		creatureType = "speed";
	} else if (
		random <
		explosiveChance + tankChance + speedChance + casterChance
	) {
		creatureType = "caster";
	}

	// Si el tipo seleccionado no está habilitado, usar normal (si está habilitado)
	if (!config[creatureType] && config.normal) {
		creatureType = "normal";
	} else if (!config[creatureType] && !config.normal) {
		// Si ni el tipo seleccionado ni normal están habilitados, buscar el primer tipo habilitado
		const enabledTypes = Object.entries(config)
			.filter(([_, enabled]) => enabled)
			.map(([type, _]) => type);
		if (enabledTypes.length > 0) {
			creatureType = enabledTypes[0] as Creature["type"];
		}
	}

	// Configurar estadísticas base según el tipo
	let baseHealth: number;
	let baseSpeed: number;
	let width = CREATURE_WIDTH;
	let height = CREATURE_HEIGHT;

	switch (creatureType) {
		case "boss": {
			// Los boss se crean con la función específica, esto es solo fallback
			const bossWaveMultiplier = Math.floor(currentWave / BOSS_SPAWN_INTERVAL);
			baseHealth =
				CREATURE_BOSS_HEALTH_BASE +
				bossWaveMultiplier *
				CREATURE_BOSS_HEALTH_BASE *
				CREATURE_BOSS_HEALTH_MULTIPLIER;
			baseSpeed = CREATURE_BOSS_SPEED;
			width = CREATURE_WIDTH * BOSS_SIZE_MULTIPLIER;
			height = CREATURE_HEIGHT * BOSS_SIZE_MULTIPLIER;
			break;
		}
		case "tank":
			baseHealth =
				CREATURE_TANK_HEALTH +
				currentWave * CREATURE_HEALTH_INCREASE_PER_WAVE * 2;
			baseSpeed =
				CREATURE_TANK_SPEED +
				currentWave * CREATURE_SPEED_INCREASE_PER_WAVE * 0.5;
			width = CREATURE_WIDTH * TANK_SIZE_MULTIPLIER;
			height = CREATURE_HEIGHT * TANK_SIZE_MULTIPLIER;
			break;
		case "speed":
			baseHealth =
				CREATURE_SPEED_HEALTH +
				currentWave * CREATURE_HEALTH_INCREASE_PER_WAVE * 0.5;
			baseSpeed =
				CREATURE_SPEED_FAST +
				currentWave * CREATURE_SPEED_INCREASE_PER_WAVE * 1.2;
			width = CREATURE_WIDTH * SPEED_SIZE_MULTIPLIER;
			height = CREATURE_HEIGHT * SPEED_SIZE_MULTIPLIER;
			break;
		case "explosive":
			baseHealth =
				CREATURE_EXPLOSIVE_HEALTH +
				currentWave * CREATURE_HEALTH_INCREASE_PER_WAVE * 0.8;
			baseSpeed =
				CREATURE_EXPLOSIVE_SPEED +
				currentWave * CREATURE_SPEED_INCREASE_PER_WAVE * 1.0;
			break;
		case "caster":
			baseHealth =
				CREATURE_CASTER_HEALTH +
				currentWave * CREATURE_HEALTH_INCREASE_PER_WAVE * 1.5;
			baseSpeed =
				CREATURE_CASTER_SPEED +
				currentWave * CREATURE_SPEED_INCREASE_PER_WAVE * 0.8;
			break;
		default: // normal
			baseHealth =
				INITIAL_CREATURE_HEALTH +
				currentWave * CREATURE_HEALTH_INCREASE_PER_WAVE;
			baseSpeed =
				CREATURE_SPEED_BASE + currentWave * CREATURE_SPEED_INCREASE_PER_WAVE;
			break;
	}

	// Aplicar multiplicadores exponenciales
	const creatureHealth = Math.floor(baseHealth * healthMultiplier);
	const creatureSpeed = Math.min(
		baseSpeed * speedMultiplier,
		MAX_CREATURE_SPEED,
	);

	return {
		id: `creature-${Date.now()}-${Math.random()}`,
		position: { x, y },
		width,
		height,
		speed: creatureSpeed,
		health: creatureHealth,
		maxHealth: creatureHealth,
		type: creatureType,
		lastSpellTime: Date.now(),
		sprite: null,
		direction: "S",
		isMoving: false,
		animationFrame: "S",
		lastAnimationTime: Date.now(),
		lastPosition: { x, y },
		// Inicializar campos de pathfinding
		currentPath: undefined,
		currentPathIndex: 0,
		lastPathUpdate: 0,
		targetPosition: undefined,
	};
};

export const spawnCreature = (gameState: GameState): boolean => {
	const {
		creaturesSpawnedThisWave,
		creaturesToSpawnThisWave,
		creatures,
		currentWave,
		mobConfig,
	} = gameState;

	if (
		creaturesSpawnedThisWave < creaturesToSpawnThisWave &&
		creatures.length < 20 &&
		Math.random() < 0.05
	) {
		const side = Math.floor(Math.random() * 4);
		let x: number;
		let y: number;

		switch (side) {
			case 0:
				x = Math.random() * MAP_WIDTH;
				y = -CREATURE_HEIGHT;
				break;
			case 1:
				x = MAP_WIDTH + CREATURE_WIDTH;
				y = Math.random() * MAP_HEIGHT;
				break;
			case 2:
				x = Math.random() * MAP_WIDTH;
				y = MAP_HEIGHT + CREATURE_HEIGHT;
				break;
			default:
				x = -CREATURE_WIDTH;
				y = Math.random() * MAP_HEIGHT;
				break;
		}

		// Verificar si es una wave de boss
		if (shouldSpawnBoss(currentWave) && mobConfig.boss) {
			const bossCount = getBossCount(currentWave);
			const currentBossCount = creatures.filter(
				(c) => c.type === "boss",
			).length;

			// Solo spawnear boss si no hemos alcanzado el límite para esta wave
			if (currentBossCount < bossCount) {
				const newBoss = createBoss(x, y, currentWave);
				creatures.push(newBoss);
				gameState.creaturesSpawnedThisWave++;
				return true;
			}
		}

		// Spawn criatura normal usando la configuración de mobs
		const newCreature = createCreature(x, y, currentWave, mobConfig);
		creatures.push(newCreature);
		gameState.creaturesSpawnedThisWave++;
		return true;
	}

	return false;
};

export const updateCreatures = (gameState: GameState) => {
	const {
		creatures,
		player,
		obstacles,
		waveTransitioning,
		projectiles,
		currentWave,
	} = gameState;

	if (waveTransitioning) return;

	// Actualizar el pathfinder con los obstáculos actuales
	pathfinder.updateObstacles(obstacles);

	// Spawn new creatures
	spawnCreature(gameState);

	for (const creature of creatures) {
		// Guardar posición anterior para el sistema de IA
		creature.lastPosition = { ...creature.position };

		const distanceToPlayer = distance(player.position, creature.position);

		// Usar el nuevo sistema de IA con Steering Behaviors y Pathfinding
		let steeringForce: Vector2;
		if (creature.type === "caster") {
			steeringForce = CreatureAI.updateCasterCreature(
				creature,
				player.position,
				creatures,
				obstacles,
				distanceToPlayer,
			);
		} else if (creature.type === "boss") {
			// Boss usa comportamiento similar a caster pero más lento y agresivo
			steeringForce = CreatureAI.updateCasterCreature(
				creature,
				player.position,
				creatures,
				obstacles,
				distanceToPlayer,
			);
		} else if (creature.type === "tank") {
			// Tanks son más agresivos y van directo al jugador
			steeringForce = CreatureAI.updateNormalCreature(
				creature,
				player.position,
				creatures,
				obstacles,
			);
		} else if (creature.type === "speed") {
			// Speed demons usan la misma IA pero son más rápidos
			steeringForce = CreatureAI.updateNormalCreature(
				creature,
				player.position,
				creatures,
				obstacles,
			);
		} else if (creature.type === "explosive") {
			// Explosives van directo al jugador sin importar obstáculos
			steeringForce = CreatureAI.updateNormalCreature(
				creature,
				player.position,
				creatures,
				obstacles,
			);
		} else {
			steeringForce = CreatureAI.updateNormalCreature(
				creature,
				player.position,
				creatures,
				obstacles,
			);
		}

		// Aplicar la fuerza de steering al movimiento con verificación de colisiones mejorada
		const oldPos = { ...creature.position };
		const newX = creature.position.x + steeringForce.x;
		const newY = creature.position.y + steeringForce.y;

		// Verificar colisión en X
		creature.position.x = newX;
		let creatureRect = getEntityRect(creature);
		let collisionX = false;

		for (const obstacle of obstacles) {
			if (checkAABBCollision(creatureRect, obstacle)) {
				collisionX = true;
				break;
			}
		}

		if (collisionX) {
			creature.position.x = oldPos.x; // Revertir movimiento en X
		}

		// Verificar colisión en Y
		creature.position.y = newY;
		creatureRect = getEntityRect(creature);
		let collisionY = false;

		for (const obstacle of obstacles) {
			if (checkAABBCollision(creatureRect, obstacle)) {
				collisionY = true;
				break;
			}
		}

		if (collisionY) {
			creature.position.y = oldPos.y; // Revertir movimiento en Y
		}

		// Si hay colisión en ambos ejes, invalidar el path actual para forzar recálculo
		if (collisionX && collisionY) {
			creature.currentPath = undefined;
			creature.currentPathIndex = 0;
		}

		// Determinar dirección basada en el movimiento real
		const actualMovement = {
			x: creature.position.x - oldPos.x,
			y: creature.position.y - oldPos.y,
		};

		const absX = Math.abs(actualMovement.x);
		const absY = Math.abs(actualMovement.y);

		if (absX > 0.05 || absY > 0.05) {
			// Solo actualizar si hay movimiento significativo
			creature.isMoving = true;

			if (absX > absY) {
				creature.direction = actualMovement.x > 0 ? "E" : "O";
			} else {
				creature.direction = actualMovement.y > 0 ? "S" : "N";
			}
		} else {
			creature.isMoving = false;
		}

		// Mantener la criatura dentro del mapa
		creature.position.x = Math.max(
			creature.width / 2,
			Math.min(MAP_WIDTH - creature.width / 2, creature.position.x),
		);
		creature.position.y = Math.max(
			creature.height / 2,
			Math.min(MAP_HEIGHT - creature.height / 2, creature.position.y),
		);

		// Lógica de casting para casters (mejorada)
		if (creature.type === "caster") {
			const now = Date.now();
			const improvedCastRate = Math.max(
				MIN_CASTER_CAST_RATE,
				CASTER_CAST_RATE - currentWave * CASTER_CAST_RATE_IMPROVEMENT_PER_WAVE,
			);

			// Solo lanzar hechizos si está en rango óptimo, tiene línea de vista y ha pasado suficiente tiempo
			const hasLineOfSight = pathfinder.hasLineOfSight(
				creature.position,
				player.position,
				obstacles,
			);

			if (
				distanceToPlayer <= 400 &&
				distanceToPlayer >= 150 &&
				hasLineOfSight &&
				now - (creature.lastSpellTime || 0) > improvedCastRate
			) {
				const magicBoltDirection = normalize({
					x: player.position.x - creature.position.x,
					y: player.position.y - creature.position.y,
				});

				// Velocidad de magic bolt escalable con límite
				const baseMagicBoltSpeed =
					MAGIC_BOLT_SPEED + currentWave * MAGIC_BOLT_SPEED_INCREASE_PER_WAVE;
				const scaledMagicBoltSpeed = Math.min(
					baseMagicBoltSpeed,
					MAX_MAGIC_BOLT_SPEED,
				);

				// Tamaño de magic bolt escalable
				const magicBoltSize =
					6 + currentWave * MAGIC_BOLT_SIZE_INCREASE_PER_WAVE;

				projectiles.push({
					position: { ...creature.position },
					velocity: {
						x: magicBoltDirection.x * scaledMagicBoltSpeed,
						y: magicBoltDirection.y * scaledMagicBoltSpeed,
					},
					radius: magicBoltSize,
					speed: scaledMagicBoltSpeed,
					isMagicBolt: true,
				});
				creature.lastSpellTime = now;
			}
		}

		// Lógica de disparo para Boss - Proyectiles que atraviesan estructuras
		if (creature.type === "boss") {
			const now = Date.now();

			// Boss tiene visión omnipresente - puede disparar desde cualquier distancia
			if (now - (creature.lastSpellTime || 0) > BOSS_CAST_RATE) {
				const bossProjectileDirection = normalize({
					x: player.position.x - creature.position.x,
					y: player.position.y - creature.position.y,
				});

				// Crear proyectil del boss que atraviesa estructuras
				projectiles.push({
					position: { ...creature.position },
					velocity: {
						x: bossProjectileDirection.x * BOSS_PROJECTILE_SPEED,
						y: bossProjectileDirection.y * BOSS_PROJECTILE_SPEED,
					},
					radius: BOSS_PROJECTILE_SIZE,
					speed: BOSS_PROJECTILE_SPEED,
					isMagicBolt: true,
					isBossProjectile: true, // Marca especial para atravesar estructuras
				});
				creature.lastSpellTime = now;
			}
		}

		// Manejar animación de caminar
		const now = Date.now();
		if (creature.isMoving && now - creature.lastAnimationTime > 300) {
			creature.animationFrame = creature.animationFrame === "L" ? "R" : "L";
			creature.lastAnimationTime = now;
		} else if (!creature.isMoving) {
			creature.animationFrame = "S";
		}
	}

	// SISTEMA MEJORADO: Verificar colisiones entre criaturas SIN empujarlas dentro de obstáculos
	for (let i = 0; i < creatures.length; i++) {
		for (let j = i + 1; j < creatures.length; j++) {
			const creature1 = creatures[i];
			const creature2 = creatures[j];

			const rect1 = getEntityRect(creature1);
			const rect2 = getEntityRect(creature2);

			if (checkAABBCollision(rect1, rect2)) {
				// Calcular dirección de separación
				const separationDirection = normalize({
					x: creature2.position.x - creature1.position.x,
					y: creature2.position.y - creature1.position.y,
				});

				// Si están exactamente en la misma posición, usar dirección aleatoria
				if (separationDirection.x === 0 && separationDirection.y === 0) {
					const angle = Math.random() * Math.PI * 2;
					separationDirection.x = Math.cos(angle);
					separationDirection.y = Math.sin(angle);
				}

				// Guardar posiciones originales
				const originalPos1 = { ...creature1.position };
				const originalPos2 = { ...creature2.position };

				// Intentar separar las criaturas
				const separationForce = 2;
				const newPos1 = {
					x: creature1.position.x - separationDirection.x * separationForce,
					y: creature1.position.y - separationDirection.y * separationForce,
				};
				const newPos2 = {
					x: creature2.position.x + separationDirection.x * separationForce,
					y: creature2.position.y + separationDirection.y * separationForce,
				};

				// Verificar que las nuevas posiciones no colisionen con obstáculos
				let canMoveBoth = true;

				// Verificar criatura 1
				creature1.position = newPos1;
				const rect1Check = getEntityRect(creature1);
				for (const obstacle of obstacles) {
					if (checkAABBCollision(rect1Check, obstacle)) {
						canMoveBoth = false;
						break;
					}
				}

				// Verificar criatura 2 solo si criatura 1 puede moverse
				if (canMoveBoth) {
					creature2.position = newPos2;
					const rect2Check = getEntityRect(creature2);
					for (const obstacle of obstacles) {
						if (checkAABBCollision(rect2Check, obstacle)) {
							canMoveBoth = false;
							break;
						}
					}
				}

				// Si no pueden moverse ambas sin colisionar, revertir posiciones
				if (!canMoveBoth) {
					creature1.position = originalPos1;
					creature2.position = originalPos2;

					// Intentar mover solo una criatura en diferentes direcciones
					const directions = [
						{ x: 1, y: 0 },
						{ x: -1, y: 0 },
						{ x: 0, y: 1 },
						{ x: 0, y: -1 },
						{ x: 1, y: 1 },
						{ x: -1, y: -1 },
						{ x: 1, y: -1 },
						{ x: -1, y: 1 },
					];

					let moved = false;
					for (const dir of directions) {
						// Intentar mover criatura 1
						creature1.position = {
							x: originalPos1.x + dir.x * separationForce,
							y: originalPos1.y + dir.y * separationForce,
						};

						const rect1Check = getEntityRect(creature1);
						let collision = false;
						for (const obstacle of obstacles) {
							if (checkAABBCollision(rect1Check, obstacle)) {
								collision = true;
								break;
							}
						}

						if (!collision) {
							moved = true;
							break;
						}

						// Si no funcionó, intentar mover criatura 2
						creature1.position = originalPos1;
						creature2.position = {
							x: originalPos2.x + dir.x * separationForce,
							y: originalPos2.y + dir.y * separationForce,
						};

						const rect2Check = getEntityRect(creature2);
						collision = false;
						for (const obstacle of obstacles) {
							if (checkAABBCollision(rect2Check, obstacle)) {
								collision = true;
								break;
							}
						}

						if (!collision) {
							moved = true;
							break;
						}

						// Revertir si no funcionó
						creature2.position = originalPos2;
					}

					// Si no se pudo mover ninguna, mantener posiciones originales
					if (!moved) {
						creature1.position = originalPos1;
						creature2.position = originalPos2;
					}
				}

				// Verificar límites del mapa para ambas criaturas
				creature1.position.x = Math.max(
					creature1.width / 2,
					Math.min(MAP_WIDTH - creature1.width / 2, creature1.position.x),
				);
				creature1.position.y = Math.max(
					creature1.height / 2,
					Math.min(MAP_HEIGHT - creature1.height / 2, creature1.position.y),
				);
				creature2.position.x = Math.max(
					creature2.width / 2,
					Math.min(MAP_WIDTH - creature2.width / 2, creature2.position.x),
				);
				creature2.position.y = Math.max(
					creature2.height / 2,
					Math.min(MAP_HEIGHT - creature2.height / 2, creature2.position.y),
				);

				// Invalidar paths si las criaturas fueron movidas
				if (
					creature1.position.x !== originalPos1.x ||
					creature1.position.y !== originalPos1.y
				) {
					creature1.currentPath = undefined;
				}
				if (
					creature2.position.x !== originalPos2.x ||
					creature2.position.y !== originalPos2.y
				) {
					creature2.currentPath = undefined;
				}
			}
		}
	}

	// SISTEMA DE MUERTE AUTOMÁTICA: Eliminar criaturas atrapadas en obstáculos
	for (let i = creatures.length - 1; i >= 0; i--) {
		const creature = creatures[i];
		const creatureRect = getEntityRect(creature);

		// Verificar si la criatura está completamente dentro de un obstáculo
		let isTrappedInObstacle = false;
		for (const obstacle of obstacles) {
			if (checkAABBCollision(creatureRect, obstacle)) {
				// Verificar si está completamente dentro (no solo tocando el borde)
				const overlapX =
					Math.min(
						creatureRect.x + creatureRect.width,
						obstacle.x + obstacle.width,
					) - Math.max(creatureRect.x, obstacle.x);
				const overlapY =
					Math.min(
						creatureRect.y + creatureRect.height,
						obstacle.y + obstacle.height,
					) - Math.max(creatureRect.y, obstacle.y);

				// Si el overlap es significativo (más del 70% del tamaño de la criatura), está atrapada
				if (
					overlapX > creatureRect.width * 0.7 &&
					overlapY > creatureRect.height * 0.7
				) {
					isTrappedInObstacle = true;
					break;
				}
			}
		}

		if (isTrappedInObstacle) {
			console.log(
				`Criatura ${creature.id} eliminada por estar atrapada en obstáculo`,
			);
			creatures.splice(i, 1);
			// Actualizar el contador de criaturas restantes si es necesario
			if (
				gameState.creaturesSpawnedThisWave >= gameState.creaturesToSpawnThisWave
			) {
				// No contar esta muerte hacia el progreso de la wave
				// La criatura simplemente desaparece sin dar puntos
			}
		}
	}
};

export const getCreatureSprite = (
	creature: Creature,
	creatureSprites: { [key: string]: HTMLImageElement | null },
) => {
	// Determinar el prefijo del sprite según el tipo de criatura
	// TODO: Cambiar 'mage' por 'boss' cuando tengamos sprites específicos del boss
	const spritePrefix =
		creature.type === "caster"
			? "mage"
			: creature.type === "boss"
				? "mage" // Temporalmente usa sprites de mage
				: creature.type === "tank"
					? "creature" // Tank usa sprites de criatura normal
					: creature.type === "speed"
						? "speed"
						: creature.type === "explosive"
							? "explosive"
							: "creature";

	// Construir el nombre del sprite
	const spriteName = `${spritePrefix}_${creature.direction}_${creature.isMoving ? `W_${creature.animationFrame}` : "S"}`;

	return creatureSprites[spriteName] || null;
};

// Función para manejar explosiones de criaturas explosivas
export const handleExplosiveCreatureDeath = (
	explosiveCreature: Creature,
	gameState: GameState,
	setPlayerHealth?: (health: number) => void,
	playPlayerHit?: () => void,
) => {
	const { player, creatures } = gameState;

	// Verificar si el jugador está en el radio de explosión
	const distanceToPlayer = distance(
		explosiveCreature.position,
		player.position,
	);
	if (distanceToPlayer <= EXPLOSION_RADIUS) {
		// Aplicar daño al jugador si no está en invulnerabilidad
		const now = Date.now();
		const canTakeDamage = now - player.lastDamageTime >= 1000; // 1 segundo de invulnerabilidad

		if (canTakeDamage) {
			player.health -= EXPLOSION_DAMAGE;
			player.lastDamageTime = now;

			// ✨ COMBO SYSTEM: Resetear combo al recibir daño por explosión
			gameState.comboKills = 0;

			if (setPlayerHealth) {
				setPlayerHealth(player.health);
			}
			if (playPlayerHit) {
				playPlayerHit();
			}
		}
	}

	// Dañar otras criaturas en el radio de explosión
	for (const creature of creatures) {
		if (creature.id !== explosiveCreature.id) {
			const dist = distance(explosiveCreature.position, creature.position);
			if (dist <= EXPLOSION_RADIUS) {
				creature.health -= EXPLOSION_DAMAGE * 0.5; // Medio daño a otras criaturas
			}
		}
	}
};

// Función específica para crear Boss
export const createBoss = (
	x: number,
	y: number,
	currentWave: number,
): Creature => {
	// Calcular multiplicador exponencial para waves altas
	const exponentialBonus = Math.floor(
		currentWave / EXPONENTIAL_SCALING_INTERVAL,
	);
	const healthMultiplier = EXPONENTIAL_HEALTH_MULTIPLIER ** exponentialBonus;
	const speedMultiplier = EXPONENTIAL_SPEED_MULTIPLIER ** exponentialBonus;

	// Calcular vida del boss escalable
	const bossWaveMultiplier = Math.floor(currentWave / BOSS_SPAWN_INTERVAL); // Cuántas veces ha aparecido un boss
	const baseHealth =
		CREATURE_BOSS_HEALTH_BASE +
		bossWaveMultiplier *
		CREATURE_BOSS_HEALTH_BASE *
		CREATURE_BOSS_HEALTH_MULTIPLIER;
	const bossHealth = Math.floor(baseHealth * healthMultiplier);

	// Velocidad del boss (siempre lento)
	const bossSpeed = Math.min(
		CREATURE_BOSS_SPEED * speedMultiplier,
		CREATURE_BOSS_SPEED * 1.5,
	); // Máximo 50% más rápido

	return {
		id: `boss-${Date.now()}-${Math.random()}`,
		position: { x, y },
		width: CREATURE_WIDTH * BOSS_SIZE_MULTIPLIER,
		height: CREATURE_HEIGHT * BOSS_SIZE_MULTIPLIER,
		speed: bossSpeed,
		health: bossHealth,
		maxHealth: bossHealth,
		type: "boss",
		lastSpellTime: Date.now(),
		sprite: null,
		direction: "S",
		isMoving: false,
		animationFrame: "S",
		lastAnimationTime: Date.now(),
		lastPosition: { x, y },
		// Inicializar campos de pathfinding
		currentPath: undefined,
		currentPathIndex: 0,
		lastPathUpdate: 0,
		targetPosition: undefined,
	};
};

// Función para determinar si debe aparecer un boss en esta wave
export const shouldSpawnBoss = (currentWave: number): boolean => {
	return currentWave > 0 && currentWave % BOSS_SPAWN_INTERVAL === 0;
};

// Función para calcular cuántos boss deben aparecer
export const getBossCount = (currentWave: number): number => {
	if (!shouldSpawnBoss(currentWave)) return 0;
	return Math.floor(currentWave / BOSS_SPAWN_INTERVAL);
};
