import type { Obstacle, Vector2 } from "@/types/game";
import { distance } from "@/utils/math";

export interface PathNode {
	x: number;
	y: number;
	gCost: number; // Distancia desde el inicio
	hCost: number; // Distancia estimada al objetivo (heurística)
	fCost: number; // gCost + hCost
	parent?: PathNode;
	walkable: boolean;
}

export class Pathfinding {
	private grid: PathNode[][];
	private gridWidth: number;
	private gridHeight: number;
	private nodeSize: number;

	constructor(mapWidth: number, mapHeight: number, nodeSize = 20) {
		this.nodeSize = nodeSize;
		this.gridWidth = Math.ceil(mapWidth / nodeSize);
		this.gridHeight = Math.ceil(mapHeight / nodeSize);
		this.grid = [];

		// Inicializar grid
		for (let x = 0; x < this.gridWidth; x++) {
			this.grid[x] = [];
			for (let y = 0; y < this.gridHeight; y++) {
				this.grid[x][y] = {
					x,
					y,
					gCost: 0,
					hCost: 0,
					fCost: 0,
					walkable: true,
				};
			}
		}
	}

	// Actualizar el grid con obstáculos
	updateObstacles(obstacles: Obstacle[]) {
		// Resetear todos los nodos como caminables
		for (let x = 0; x < this.gridWidth; x++) {
			for (let y = 0; y < this.gridHeight; y++) {
				this.grid[x][y].walkable = true;
			}
		}

		// Marcar nodos ocupados por obstáculos como no caminables
		for (const obstacle of obstacles) {
			const startX = Math.floor(obstacle.x / this.nodeSize);
			const startY = Math.floor(obstacle.y / this.nodeSize);
			const endX = Math.floor((obstacle.x + obstacle.width) / this.nodeSize);
			const endY = Math.floor((obstacle.y + obstacle.height) / this.nodeSize);

			for (let x = startX; x <= endX; x++) {
				for (let y = startY; y <= endY; y++) {
					if (x >= 0 && x < this.gridWidth && y >= 0 && y < this.gridHeight) {
						this.grid[x][y].walkable = false;
					}
				}
			}
		}
	}

	// Convertir coordenadas del mundo a coordenadas del grid
	worldToGrid(worldPos: Vector2): { x: number; y: number } {
		return {
			x: Math.floor(worldPos.x / this.nodeSize),
			y: Math.floor(worldPos.y / this.nodeSize),
		};
	}

	// Convertir coordenadas del grid a coordenadas del mundo
	gridToWorld(gridPos: { x: number; y: number }): Vector2 {
		return {
			x: gridPos.x * this.nodeSize + this.nodeSize / 2,
			y: gridPos.y * this.nodeSize + this.nodeSize / 2,
		};
	}

	// Obtener nodos vecinos
	getNeighbors(node: PathNode): PathNode[] {
		const neighbors: PathNode[] = [];

		for (let x = -1; x <= 1; x++) {
			for (let y = -1; y <= 1; y++) {
				if (x === 0 && y === 0) continue; // Saltar el nodo actual

				const checkX = node.x + x;
				const checkY = node.y + y;

				if (
					checkX >= 0 &&
					checkX < this.gridWidth &&
					checkY >= 0 &&
					checkY < this.gridHeight
				) {
					neighbors.push(this.grid[checkX][checkY]);
				}
			}
		}

		return neighbors;
	}

	// Calcular distancia heurística (Manhattan distance)
	getDistance(nodeA: PathNode, nodeB: PathNode): number {
		const dstX = Math.abs(nodeA.x - nodeB.x);
		const dstY = Math.abs(nodeA.y - nodeB.y);

		// Usar distancia diagonal para mejor pathfinding
		if (dstX > dstY) {
			return 14 * dstY + 10 * (dstX - dstY);
		}
		return 14 * dstX + 10 * (dstY - dstX);
	}

	// Algoritmo A* para encontrar el camino
	findPath(startPos: Vector2, targetPos: Vector2): Vector2[] {
		const startNode = this.worldToGrid(startPos);
		const targetNode = this.worldToGrid(targetPos);

		// Verificar que los nodos estén dentro del grid
		if (
			startNode.x < 0 ||
			startNode.x >= this.gridWidth ||
			startNode.y < 0 ||
			startNode.y >= this.gridHeight ||
			targetNode.x < 0 ||
			targetNode.x >= this.gridWidth ||
			targetNode.y < 0 ||
			targetNode.y >= this.gridHeight
		) {
			return [];
		}

		const startGridNode = this.grid[startNode.x][startNode.y];
		const targetGridNode = this.grid[targetNode.x][targetNode.y];

		// Si el objetivo no es caminable, buscar el nodo caminable más cercano
		if (!targetGridNode.walkable) {
			const nearestWalkable = this.findNearestWalkableNode(targetNode);
			if (!nearestWalkable) return [];
			targetGridNode.x = nearestWalkable.x;
			targetGridNode.y = nearestWalkable.y;
		}

		const openSet: PathNode[] = [];
		const closedSet: Set<PathNode> = new Set();

		openSet.push(startGridNode);

		while (openSet.length > 0) {
			// Encontrar el nodo con menor fCost
			let currentNode = openSet[0];
			for (let i = 1; i < openSet.length; i++) {
				if (
					openSet[i].fCost < currentNode.fCost ||
					(openSet[i].fCost === currentNode.fCost &&
						openSet[i].hCost < currentNode.hCost)
				) {
					currentNode = openSet[i];
				}
			}

			openSet.splice(openSet.indexOf(currentNode), 1);
			closedSet.add(currentNode);

			// Si llegamos al objetivo
			if (
				currentNode.x === targetGridNode.x &&
				currentNode.y === targetGridNode.y
			) {
				return this.retracePath(startGridNode, currentNode);
			}

			// Explorar vecinos
			const neighbors = this.getNeighbors(currentNode);
			for (const neighbor of neighbors) {
				if (!neighbor.walkable || closedSet.has(neighbor)) {
					continue;
				}

				const newCostToNeighbor =
					currentNode.gCost + this.getDistance(currentNode, neighbor);

				if (newCostToNeighbor < neighbor.gCost || !openSet.includes(neighbor)) {
					neighbor.gCost = newCostToNeighbor;
					neighbor.hCost = this.getDistance(neighbor, targetGridNode);
					neighbor.fCost = neighbor.gCost + neighbor.hCost;
					neighbor.parent = currentNode;

					if (!openSet.includes(neighbor)) {
						openSet.push(neighbor);
					}
				}
			}
		}

		// No se encontró camino
		return [];
	}

	// Encontrar el nodo caminable más cercano
	findNearestWalkableNode(targetNode: {
		x: number;
		y: number;
	}): PathNode | null {
		const searchRadius = 5;
		let nearestNode: PathNode | null = null;
		let nearestDistance = Number.POSITIVE_INFINITY;

		for (
			let x = Math.max(0, targetNode.x - searchRadius);
			x < Math.min(this.gridWidth, targetNode.x + searchRadius);
			x++
		) {
			for (
				let y = Math.max(0, targetNode.y - searchRadius);
				y < Math.min(this.gridHeight, targetNode.y + searchRadius);
				y++
			) {
				const node = this.grid[x][y];
				if (node.walkable) {
					const dist = Math.abs(x - targetNode.x) + Math.abs(y - targetNode.y);
					if (dist < nearestDistance) {
						nearestDistance = dist;
						nearestNode = node;
					}
				}
			}
		}

		return nearestNode;
	}

	// Reconstruir el camino desde el objetivo hasta el inicio
	retracePath(startNode: PathNode, endNode: PathNode): Vector2[] {
		const path: Vector2[] = [];
		let currentNode: PathNode | undefined = endNode;

		while (currentNode && currentNode !== startNode) {
			path.push(this.gridToWorld({ x: currentNode.x, y: currentNode.y }));
			currentNode = currentNode.parent;
		}

		path.reverse();

		// Simplificar el camino eliminando puntos innecesarios
		return this.simplifyPath(path);
	}

	// Simplificar el camino eliminando puntos intermedios innecesarios
	simplifyPath(path: Vector2[]): Vector2[] {
		if (path.length <= 2) return path;

		const simplifiedPath: Vector2[] = [path[0]];

		for (let i = 1; i < path.length - 1; i++) {
			const prev = path[i - 1];
			const current = path[i];
			const next = path[i + 1];

			// Calcular si los tres puntos están en línea recta
			const cross =
				(next.x - prev.x) * (current.y - prev.y) -
				(next.y - prev.y) * (current.x - prev.x);

			// Si no están en línea recta (con una pequeña tolerancia), mantener el punto
			if (Math.abs(cross) > 0.1) {
				simplifiedPath.push(current);
			}
		}

		simplifiedPath.push(path[path.length - 1]);
		return simplifiedPath;
	}

	// Verificar si hay línea de vista directa entre dos puntos
	hasLineOfSight(start: Vector2, end: Vector2, obstacles: Obstacle[]): boolean {
		const steps = Math.max(
			Math.abs(end.x - start.x),
			Math.abs(end.y - start.y),
		);
		const stepSize = 1 / Math.max(steps, 1);

		for (let t = 0; t <= 1; t += stepSize) {
			const checkPoint = {
				x: start.x + (end.x - start.x) * t,
				y: start.y + (end.y - start.y) * t,
			};

			// Verificar colisión con obstáculos
			for (const obstacle of obstacles) {
				if (
					checkPoint.x >= obstacle.x &&
					checkPoint.x <= obstacle.x + obstacle.width &&
					checkPoint.y >= obstacle.y &&
					checkPoint.y <= obstacle.y + obstacle.height
				) {
					return false;
				}
			}
		}

		return true;
	}
}

// Instancia global del pathfinding
export const pathfinder = new Pathfinding(1200, 800, 25); // MAP_WIDTH, MAP_HEIGHT, nodeSize
