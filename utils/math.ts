import type { Vector2 } from "@/types/game";

export const normalize = (vector: Vector2): Vector2 => {
	const mag = Math.sqrt(vector.x ** 2 + vector.y ** 2);
	if (mag === 0) return { x: 0, y: 0 };
	return { x: vector.x / mag, y: vector.y / mag };
};

export const magnitude = (vector: Vector2): number => {
	return Math.sqrt(vector.x ** 2 + vector.y ** 2);
};

export const distance = (a: Vector2, b: Vector2): number => {
	return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
};

export const checkAABBCollision = (
	rect1: { x: number; y: number; width: number; height: number },
	rect2: { x: number; y: number; width: number; height: number },
): boolean => {
	return (
		rect1.x < rect2.x + rect2.width &&
		rect1.x + rect1.width > rect2.x &&
		rect1.y < rect2.y + rect2.height &&
		rect1.y + rect1.height > rect2.y
	);
};

export const getEntityRect = (entity: {
	position: Vector2;
	width: number;
	height: number;
}) => {
	return {
		x: entity.position.x - entity.width / 2,
		y: entity.position.y - entity.height / 2,
		width: entity.width,
		height: entity.height,
	};
};
