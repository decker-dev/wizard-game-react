import type { Creature, Obstacle, Vector2 } from "@/types/game";
import { distance, magnitude, normalize } from "@/utils/math";
import { pathfinder } from "./Pathfinding";

export interface SteeringForce {
	x: number;
	y: number;
}

export namespace AIBehaviors {
	// Buscar un objetivo usando pathfinding inteligente
	export const seekWithPathfinding = (
		target: Vector2,
		creature: Creature,
		obstacles: Obstacle[],
		maxForce = 0.8,
	): SteeringForce => {
		const now = Date.now();
		const pathUpdateInterval = 500; // Actualizar path cada 500ms

		// Verificar si necesitamos actualizar el path
		const needsNewPath =
			!creature.currentPath ||
			!creature.lastPathUpdate ||
			now - creature.lastPathUpdate > pathUpdateInterval ||
			!creature.targetPosition ||
			distance(creature.targetPosition, target) > 50; // El objetivo se movió mucho

		if (needsNewPath) {
			// Verificar si hay línea de vista directa
			if (pathfinder.hasLineOfSight(creature.position, target, obstacles)) {
				// Línea de vista directa - ir directo
				creature.currentPath = [target];
				creature.currentPathIndex = 0;
			} else {
				// Usar A* para encontrar camino
				creature.currentPath = pathfinder.findPath(creature.position, target);
				creature.currentPathIndex = 0;
			}

			creature.lastPathUpdate = now;
			creature.targetPosition = { ...target };
		}

		// Si no hay path válido, usar comportamiento básico
		if (!creature.currentPath || creature.currentPath.length === 0) {
			return seek(target, creature, maxForce);
		}

		// Seguir el path actual
		let currentTarget = creature.currentPath[creature.currentPathIndex || 0];

		// Verificar si llegamos al waypoint actual
		if (currentTarget && distance(creature.position, currentTarget) < 15) {
			creature.currentPathIndex = (creature.currentPathIndex || 0) + 1;

			// Si llegamos al final del path
			if (creature.currentPathIndex >= creature.currentPath.length) {
				creature.currentPath = undefined;
				creature.currentPathIndex = 0;
				currentTarget = target;
			} else {
				currentTarget = creature.currentPath[creature.currentPathIndex];
			}
		}

		// Moverse hacia el waypoint actual
		if (currentTarget) {
			const desired = normalize({
				x: currentTarget.x - creature.position.x,
				y: currentTarget.y - creature.position.y,
			});

			const desiredVelocity = {
				x: desired.x * creature.speed,
				y: desired.y * creature.speed,
			};

			const currentDirection = normalize({
				x:
					creature.position.x -
					(creature.lastPosition?.x || creature.position.x),
				y:
					creature.position.y -
					(creature.lastPosition?.y || creature.position.y),
			});

			const steeringForce = {
				x: desiredVelocity.x - currentDirection.x,
				y: desiredVelocity.y - currentDirection.y,
			};

			const forceMagnitude = magnitude(steeringForce);
			if (forceMagnitude > maxForce) {
				return {
					x: (steeringForce.x / forceMagnitude) * maxForce,
					y: (steeringForce.y / forceMagnitude) * maxForce,
				};
			}

			return steeringForce;
		}

		return { x: 0, y: 0 };
	};

	// Buscar un objetivo (versión simple para casos donde no se necesita pathfinding)
	export const seek = (
		target: Vector2,
		creature: Creature,
		maxForce = 0.1,
	): SteeringForce => {
		const desired = normalize({
			x: target.x - creature.position.x,
			y: target.y - creature.position.y,
		});

		const desiredVelocity = {
			x: desired.x * creature.speed,
			y: desired.y * creature.speed,
		};

		const currentDirection = normalize({
			x:
				creature.position.x - (creature.lastPosition?.x || creature.position.x),
			y:
				creature.position.y - (creature.lastPosition?.y || creature.position.y),
		});

		const steeringForce = {
			x: desiredVelocity.x - currentDirection.x,
			y: desiredVelocity.y - currentDirection.y,
		};

		const forceMagnitude = magnitude(steeringForce);
		if (forceMagnitude > maxForce) {
			return {
				x: (steeringForce.x / forceMagnitude) * maxForce,
				y: (steeringForce.y / forceMagnitude) * maxForce,
			};
		}

		return steeringForce;
	};

	// Huir de un objetivo (para casters)
	export const flee = (
		target: Vector2,
		creature: Creature,
		maxForce = 0.15,
	): SteeringForce => {
		const desired = normalize({
			x: creature.position.x - target.x,
			y: creature.position.y - target.y,
		});

		const desiredVelocity = {
			x: desired.x * creature.speed,
			y: desired.y * creature.speed,
		};

		const currentDirection = normalize({
			x:
				creature.position.x - (creature.lastPosition?.x || creature.position.x),
			y:
				creature.position.y - (creature.lastPosition?.y || creature.position.y),
		});

		const steeringForce = {
			x: desiredVelocity.x - currentDirection.x,
			y: desiredVelocity.y - currentDirection.y,
		};

		const forceMagnitude = magnitude(steeringForce);
		if (forceMagnitude > maxForce) {
			return {
				x: (steeringForce.x / forceMagnitude) * maxForce,
				y: (steeringForce.y / forceMagnitude) * maxForce,
			};
		}

		return steeringForce;
	};

	// Separación entre criaturas para evitar amontonamiento
	export const separate = (
		neighbors: Creature[],
		creature: Creature,
		separationRadius = 50,
	): SteeringForce => {
		const separationForce = { x: 0, y: 0 };
		let count = 0;

		for (const neighbor of neighbors) {
			if (neighbor.id !== creature.id) {
				const dist = distance(creature.position, neighbor.position);

				if (dist > 0 && dist < separationRadius) {
					const diff = normalize({
						x: creature.position.x - neighbor.position.x,
						y: creature.position.y - neighbor.position.y,
					});

					const weight = separationRadius / dist;
					separationForce.x += diff.x * weight;
					separationForce.y += diff.y * weight;
					count++;
				}
			}
		}

		if (count > 0) {
			separationForce.x /= count;
			separationForce.y /= count;

			const normalized = normalize(separationForce);
			return {
				x: normalized.x * creature.speed * 0.3,
				y: normalized.y * creature.speed * 0.3,
			};
		}

		return { x: 0, y: 0 };
	};

	// Evitar obstáculos (versión mejorada)
	export const avoidObstacles = (
		obstacles: Obstacle[],
		creature: Creature,
		avoidanceRadius = 60,
	): SteeringForce => {
		let closestObstacle: Obstacle | null = null;
		let closestDistance = Number.POSITIVE_INFINITY;

		// Encontrar el obstáculo más cercano en la dirección de movimiento
		const lookAheadDistance = 40;
		const velocity = {
			x:
				creature.position.x - (creature.lastPosition?.x || creature.position.x),
			y:
				creature.position.y - (creature.lastPosition?.y || creature.position.y),
		};

		const normalizedVelocity = normalize(velocity);
		const lookAheadPoint = {
			x: creature.position.x + normalizedVelocity.x * lookAheadDistance,
			y: creature.position.y + normalizedVelocity.y * lookAheadDistance,
		};

		for (const obstacle of obstacles) {
			const obstacleCenter = {
				x: obstacle.x + obstacle.width / 2,
				y: obstacle.y + obstacle.height / 2,
			};

			const dist = distance(creature.position, obstacleCenter);
			const lookAheadDist = distance(lookAheadPoint, obstacleCenter);

			// Considerar obstáculos cercanos o en la dirección de movimiento
			if (
				(dist < avoidanceRadius || lookAheadDist < avoidanceRadius) &&
				dist < closestDistance
			) {
				closestDistance = dist;
				closestObstacle = obstacle;
			}
		}

		if (closestObstacle) {
			const obstacleCenter = {
				x: closestObstacle.x + closestObstacle.width / 2,
				y: closestObstacle.y + closestObstacle.height / 2,
			};

			const avoidDirection = normalize({
				x: creature.position.x - obstacleCenter.x,
				y: creature.position.y - obstacleCenter.y,
			});

			const avoidanceStrength =
				(avoidanceRadius - closestDistance) / avoidanceRadius;

			return {
				x: avoidDirection.x * creature.speed * avoidanceStrength * 1.2,
				y: avoidDirection.y * creature.speed * avoidanceStrength * 1.2,
			};
		}

		return { x: 0, y: 0 };
	};

	// Comportamiento de rondeo (para casters)
	export const circle = (
		target: Vector2,
		creature: Creature,
		circleRadius = 250,
	): SteeringForce => {
		const distToTarget = distance(creature.position, target);

		if (Math.abs(distToTarget - circleRadius) > 50) {
			if (distToTarget < circleRadius) {
				return flee(target, creature, 0.1);
			}
			return seek(target, creature, 0.1);
		}

		const toTarget = normalize({
			x: target.x - creature.position.x,
			y: target.y - creature.position.y,
		});

		const tangent = {
			x: -toTarget.y,
			y: toTarget.x,
		};

		return {
			x: tangent.x * creature.speed * 0.6,
			y: tangent.y * creature.speed * 0.6,
		};
	};

	// Combinar múltiples fuerzas de steering
	export const combine = (forces: SteeringForce[]): SteeringForce => {
		const combined = { x: 0, y: 0 };

		for (const force of forces) {
			combined.x += force.x;
			combined.y += force.y;
		}

		return combined;
	};

	// Aplicar límites a la fuerza resultante
	export const limitForce = (
		force: SteeringForce,
		maxForce: number,
	): SteeringForce => {
		const forceMagnitude = magnitude(force);

		if (forceMagnitude > maxForce) {
			return {
				x: (force.x / forceMagnitude) * maxForce,
				y: (force.y / forceMagnitude) * maxForce,
			};
		}

		return force;
	};
}

// Estados de IA para diferentes tipos de criaturas
export enum CreatureAIState {
	SEEKING = "seeking",
	ATTACKING = "attacking",
	FLEEING = "fleeing",
	CIRCLING = "circling",
	POSITIONING = "positioning",
	CASTING = "casting",
	WANDERING = "wandering",
}

// Controlador de IA específico para cada tipo de criatura
export namespace CreatureAI {
	export const updateNormalCreature = (
		creature: Creature,
		target: Vector2,
		neighbors: Creature[],
		obstacles: Obstacle[],
	): SteeringForce => {
		const forces: SteeringForce[] = [];

		// Comportamiento principal: buscar al jugador con pathfinding
		const seekForce = AIBehaviors.seekWithPathfinding(
			target,
			creature,
			obstacles,
			0.8,
		);
		forces.push({ x: seekForce.x * 1.0, y: seekForce.y * 1.0 });

		// Separación de otras criaturas (peso reducido porque el pathfinding ayuda)
		const separateForce = AIBehaviors.separate(neighbors, creature, 35);
		forces.push({ x: separateForce.x * 0.4, y: separateForce.y * 0.4 });

		// Evitar obstáculos (peso reducido porque el pathfinding maneja esto)
		const avoidForce = AIBehaviors.avoidObstacles(obstacles, creature, 50);
		forces.push({ x: avoidForce.x * 0.6, y: avoidForce.y * 0.6 });

		const combinedForce = AIBehaviors.combine(forces);
		return AIBehaviors.limitForce(combinedForce, creature.speed * 0.9);
	};

	export const updateCasterCreature = (
		creature: Creature,
		target: Vector2,
		neighbors: Creature[],
		obstacles: Obstacle[],
		distanceToTarget: number,
	): SteeringForce => {
		const forces: SteeringForce[] = [];
		const optimalRange = 300;

		if (distanceToTarget < 200) {
			// Muy cerca - huir usando pathfinding si es necesario
			if (pathfinder.hasLineOfSight(creature.position, target, obstacles)) {
				const fleeForce = AIBehaviors.flee(target, creature, 0.9);
				forces.push({ x: fleeForce.x * 1.2, y: fleeForce.y * 1.2 });
			} else {
				// Buscar una posición segura usando pathfinding
				const fleeTarget = {
					x: creature.position.x + (creature.position.x - target.x) * 2,
					y: creature.position.y + (creature.position.y - target.y) * 2,
				};
				const seekForce = AIBehaviors.seekWithPathfinding(
					fleeTarget,
					creature,
					obstacles,
					0.8,
				);
				forces.push({ x: seekForce.x * 1.2, y: seekForce.y * 1.2 });
			}
		} else if (distanceToTarget > 400) {
			// Muy lejos - acercarse usando pathfinding
			const seekForce = AIBehaviors.seekWithPathfinding(
				target,
				creature,
				obstacles,
				0.6,
			);
			forces.push({ x: seekForce.x * 0.8, y: seekForce.y * 0.8 });
		} else {
			// En rango óptimo - circular
			const circleForce = AIBehaviors.circle(target, creature, optimalRange);
			forces.push({ x: circleForce.x * 0.7, y: circleForce.y * 0.7 });
		}

		// Separación de otras criaturas
		const separateForce = AIBehaviors.separate(neighbors, creature, 50);
		forces.push({ x: separateForce.x * 0.6, y: separateForce.y * 0.6 });

		// Evitar obstáculos (peso reducido)
		const avoidForce = AIBehaviors.avoidObstacles(obstacles, creature, 70);
		forces.push({ x: avoidForce.x * 0.8, y: avoidForce.y * 0.8 });

		const combinedForce = AIBehaviors.combine(forces);
		return AIBehaviors.limitForce(combinedForce, creature.speed * 0.8);
	};
}
