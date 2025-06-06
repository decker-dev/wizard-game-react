import { MAP_HEIGHT, MAP_WIDTH, PROJECTILE_SPEED } from "@/constants/game";
import type { GameState, Projectile } from "@/types/game";
import { checkAABBCollision } from "@/utils/math";

// Helper function to calculate distance between two points
const distance = (pos1: { x: number; y: number }, pos2: { x: number; y: number }): number => {
	const dx = pos1.x - pos2.x;
	const dy = pos1.y - pos2.y;
	return Math.sqrt(dx * dx + dy * dy);
};

export const createProjectile = (
	position: { x: number; y: number },
	direction: { x: number; y: number },
	isMagicBolt = false,
): Projectile => ({
	position: { ...position },
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

		// Check range limit for player projectiles (non-magic bolts with startPosition and maxRange)
		if (!p.isMagicBolt && p.startPosition && p.maxRange) {
			const traveledDistance = distance(p.position, p.startPosition);
			if (traveledDistance > p.maxRange) {
				projectiles.splice(i, 1);
				continue;
			}
		}

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
