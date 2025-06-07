import { MAP_HEIGHT, MAP_WIDTH } from "@/constants/game";
import type { Obstacle } from "@/types/game";

export const map1Data: Obstacle[] = [
    // Esquinas
    { x: 150, y: 150, width: 100, height: 100 },
    { x: MAP_WIDTH - 250, y: 150, width: 100, height: 100 },
    { x: 150, y: MAP_HEIGHT - 250, width: 100, height: 100 },
    { x: MAP_WIDTH - 250, y: MAP_HEIGHT - 250, width: 100, height: 100 },

    // Centro
    { x: MAP_WIDTH / 2 - 50, y: MAP_HEIGHT / 2 - 50, width: 100, height: 100 },

    // Obstáculos adicionales distribuidos
    { x: MAP_WIDTH / 4 - 50, y: MAP_HEIGHT / 2 - 50, width: 100, height: 100 },
    { x: (MAP_WIDTH * 3) / 4 - 50, y: MAP_HEIGHT / 2 - 50, width: 100, height: 100 },
    { x: MAP_WIDTH / 2 - 50, y: MAP_HEIGHT / 4 - 50, width: 100, height: 100 },
    // This one is moved up to avoid spawn collision:
    { x: MAP_WIDTH / 2 - 50, y: (MAP_HEIGHT * 3) / 4 - 150, width: 100, height: 100 },

    // Nuevos obstáculos (smaller, distributed)
    { x: MAP_WIDTH / 3 - 50, y: MAP_HEIGHT / 3 - 50, width: 80, height: 80 },
    { x: (MAP_WIDTH * 2) / 3 - 50, y: MAP_HEIGHT / 3 - 50, width: 80, height: 80 },
    { x: MAP_WIDTH / 3 - 50, y: (MAP_HEIGHT * 2) / 3 - 50, width: 80, height: 80 },
    { x: (MAP_WIDTH * 2) / 3 - 50, y: (MAP_HEIGHT * 2) / 3 - 50, width: 80, height: 80 },

    // Obstáculos adicionales en forma de cruz - Adjusted to prevent sealed areas
    { x: MAP_WIDTH / 2 - 250, y: MAP_HEIGHT / 2 - 40, width: 190, height: 80 }, // Left arm
    { x: MAP_WIDTH / 2 + 60, y: MAP_HEIGHT / 2 - 40, width: 190, height: 80 },  // Right arm
    { x: MAP_WIDTH / 2 - 40, y: MAP_HEIGHT / 2 - 250, width: 80, height: 190 }, // Top arm
    { x: MAP_WIDTH / 2 - 40, y: MAP_HEIGHT / 2 + 60, width: 80, height: 190 },  // Bottom arm
];
