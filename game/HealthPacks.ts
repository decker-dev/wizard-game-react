import {
	HEALTH_PACK_HEAL_AMOUNT,
	HEALTH_PACK_MAX_PER_WAVE,
	HEALTH_PACK_MIN_DISTANCE_FROM_OBSTACLES,
	HEALTH_PACK_MIN_DISTANCE_FROM_PLAYER,
	HEALTH_PACK_MIN_WAVE,
	HEALTH_PACK_SIZE,
	HEALTH_PACK_SPAWN_CHANCE_PER_WAVE,
	MAP_HEIGHT,
	MAP_WIDTH,
} from "@/constants/game";
import type { GameState, HealthPack, Vector2 } from "@/types/game";
import { checkAABBCollision, getEntityRect } from "@/utils/math";

export const createHealthPack = (
	x: number,
	y: number,
	healthPackSprite?: HTMLImageElement | null,
): HealthPack => ({
	id: `healthpack-${Date.now()}-${Math.random()}`,
	position: { x, y },
	width: HEALTH_PACK_SIZE,
	height: HEALTH_PACK_SIZE,
	healAmount: HEALTH_PACK_HEAL_AMOUNT,
	sprite: healthPackSprite || null,
});

export const spawnHealthPacksForWave = (
	gameState: GameState,
	currentWave: number,
	healthPackSprite?: HTMLImageElement | null,
) => {
	// Solo generar packs de vida a partir de la ronda mínima configurada
	if (currentWave < HEALTH_PACK_MIN_WAVE) {
		return;
	}

	// Verificar si debemos generar packs de vida esta oleada
	if (Math.random() > HEALTH_PACK_SPAWN_CHANCE_PER_WAVE) {
		return;
	}

	// Determinar cantidad máxima aleatoria de packs para esta oleada (entre 1 y HEALTH_PACK_MAX_PER_WAVE)
	const maxPacksThisWave =
		Math.floor(Math.random() * HEALTH_PACK_MAX_PER_WAVE) + 1;

	// Ahora determinar cuántos packs generar realmente (entre 1 y maxPacksThisWave)
	const packsToSpawn = Math.floor(Math.random() * maxPacksThisWave) + 1;

	for (let i = 0; i < packsToSpawn; i++) {
		const position = findValidHealthPackPosition(gameState);
		if (position) {
			const healthPack = createHealthPack(
				position.x,
				position.y,
				healthPackSprite,
			);
			gameState.healthPacks.push(healthPack);
		}
	}
};

const findValidHealthPackPosition = (gameState: GameState): Vector2 | null => {
	const { player, obstacles } = gameState;
	const maxAttempts = 50; // Evitar bucle infinito

	for (let attempt = 0; attempt < maxAttempts; attempt++) {
		// Generar posición aleatoria en el mapa
		const x =
			Math.random() * (MAP_WIDTH - HEALTH_PACK_SIZE * 2) + HEALTH_PACK_SIZE;
		const y =
			Math.random() * (MAP_HEIGHT - HEALTH_PACK_SIZE * 2) + HEALTH_PACK_SIZE;

		const position = { x, y };

		// Verificar distancia mínima del jugador
		const distanceToPlayer = Math.sqrt(
			(position.x - player.position.x) ** 2 +
				(position.y - player.position.y) ** 2,
		);

		if (distanceToPlayer < HEALTH_PACK_MIN_DISTANCE_FROM_PLAYER) {
			continue;
		}

		// Verificar que no colisione con obstáculos
		const healthPackRect = {
			x: position.x - HEALTH_PACK_SIZE / 2,
			y: position.y - HEALTH_PACK_SIZE / 2,
			width: HEALTH_PACK_SIZE,
			height: HEALTH_PACK_SIZE,
		};

		let validPosition = true;
		for (const obstacle of obstacles) {
			// Verificar colisión directa
			if (checkAABBCollision(healthPackRect, obstacle)) {
				validPosition = false;
				break;
			}

			// Verificar distancia mínima de obstáculos
			const distanceToObstacle = Math.sqrt(
				(position.x - (obstacle.x + obstacle.width / 2)) ** 2 +
					(position.y - (obstacle.y + obstacle.height / 2)) ** 2,
			);

			if (distanceToObstacle < HEALTH_PACK_MIN_DISTANCE_FROM_OBSTACLES) {
				validPosition = false;
				break;
			}
		}

		if (validPosition) {
			return position;
		}
	}

	return null; // No se encontró una posición válida después de maxAttempts
};

export const collectHealthPack = (
	healthPack: HealthPack,
	gameState: GameState,
	setPlayerHealth?: (health: number) => void,
): boolean => {
	const { player } = gameState;

	// ⭐ NUEVO: No permitir recolección si el jugador tiene vida completa
	if (player.health >= player.maxHealth) {
		return false; // No recolectar si tiene vida completa
	}

	// Verificar colisión entre jugador y pack de vida
	const playerRect = {
		x: player.position.x - player.collisionRadius,
		y: player.position.y - player.collisionRadius,
		width: player.collisionRadius * 2,
		height: player.collisionRadius * 2,
	};

	const healthPackRect = {
		x: healthPack.position.x - healthPack.width / 2,
		y: healthPack.position.y - healthPack.height / 2,
		width: healthPack.width,
		height: healthPack.height,
	};

	if (checkAABBCollision(playerRect, healthPackRect)) {
		// Curar al jugador (ya verificamos que no tiene vida completa)
		const newHealth = Math.min(
			player.health + healthPack.healAmount,
			player.maxHealth,
		);
		player.health = newHealth;

		if (setPlayerHealth) {
			setPlayerHealth(newHealth);
		}

		return true; // Pack recolectado
	}

	return false; // No recolectado
};

export const updateHealthPacks = (
	gameState: GameState,
	setPlayerHealth?: (health: number) => void,
) => {
	const { healthPacks } = gameState;

	// Verificar colisiones con el jugador y remover packs recolectados
	for (let i = healthPacks.length - 1; i >= 0; i--) {
		const healthPack = healthPacks[i];
		const collected = collectHealthPack(healthPack, gameState, setPlayerHealth);

		if (collected) {
			healthPacks.splice(i, 1);
		}
	}
};
