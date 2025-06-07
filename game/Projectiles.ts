import { MAP_HEIGHT, MAP_WIDTH, PROJECTILE_SPEED, PROJECTILE_MAX_RANGE } from "@/constants/game";
import type { GameState, Projectile } from "@/types/game";
import { checkAABBCollision } from "@/utils/math";

export const createProjectile = (
	position: { x: number; y: number },
	direction: { x: number; y: number },
	isMagicBolt = false,
): Projectile => ({
	position: { ...position },
	initialPosition: { ...position }, // Guardar posición inicial para calcular distancia
	velocity: {
		x: direction.x * PROJECTILE_SPEED,
		y: direction.y * PROJECTILE_SPEED,
	},
	radius: isMagicBolt ? 6 : 4,
	speed: PROJECTILE_SPEED,
	isMagicBolt,
});

export const updateProjectiles = (gameState: GameState) => {
	const { projectiles, obstacles } = gameState;

	for (let i = projectiles.length - 1; i >= 0; i--) {
		const p = projectiles[i];
		p.position.x += p.velocity.x;
		p.position.y += p.velocity.y;

		// Remove projectiles that go off-screen
		if (
			p.position.x < 0 ||
			p.position.x > MAP_WIDTH ||
			p.position.y < 0 ||
			p.position.y > MAP_HEIGHT
		) {
			projectiles.splice(i, 1);
			continue;
		}

		// Remove player projectiles that have traveled too far (only for player projectiles)
		if (!p.isMagicBolt && !p.isBossProjectile && p.initialPosition) {
			const distanceTraveled = Math.sqrt(
				Math.pow(p.position.x - p.initialPosition.x, 2) +
				Math.pow(p.position.y - p.initialPosition.y, 2)
			);
			
			if (distanceTraveled > PROJECTILE_MAX_RANGE) {
				projectiles.splice(i, 1);
				continue;
			}
		}

		// Check collision with obstacles (SOLO si NO es proyectil del Boss)
		if (!p.isBossProjectile) {
			const projectileRect = {
				x: p.position.x - p.radius,
				y: p.position.y - p.radius,
				width: p.radius * 2,
				height: p.radius * 2,
			};

			for (const obs of obstacles) {
				if (checkAABBCollision(projectileRect, obs)) {
					projectiles.splice(i, 1);
					break;
				}
			}
		}
		// Los proyectiles del Boss (isBossProjectile: true) atraviesan obstáculos
	}
};
