import { MAP_HEIGHT, MAP_WIDTH } from "@/constants/game";
import type { Obstacle } from "@/types/game";

export const map2Data: Obstacle[] = [
    // Outer walls
    { x: 0, y: 0, width: MAP_WIDTH, height: 50 }, // Top wall
    { x: 0, y: MAP_HEIGHT - 50, width: MAP_WIDTH, height: 50 }, // Bottom wall
    { x: 0, y: 50, width: 50, height: MAP_HEIGHT - 100 }, // Left wall
    { x: MAP_WIDTH - 50, y: 50, width: 50, height: MAP_HEIGHT - 100 }, // Right wall

    // Central room
    { x: MAP_WIDTH / 2 - 150, y: MAP_HEIGHT / 2 - 150, width: 300, height: 50 },
    { x: MAP_WIDTH / 2 - 150, y: MAP_HEIGHT / 2 + 100, width: 300, height: 50 },
    { x: MAP_WIDTH / 2 - 150, y: MAP_HEIGHT / 2 - 100, width: 50, height: 200 },
    { x: MAP_WIDTH / 2 + 100, y: MAP_HEIGHT / 2 - 100, width: 50, height: 200 },

    // Corridors
    { x: 200, y: MAP_HEIGHT / 2 - 25, width: MAP_WIDTH / 2 - 350, height: 50 },
    { x: MAP_WIDTH / 2 + 150, y: MAP_HEIGHT / 2 - 25, width: MAP_WIDTH / 2 - 350, height: 50 },
    { x: MAP_WIDTH / 2 - 25, y: 200, width: 50, height: MAP_HEIGHT / 2 - 350 },
    { x: MAP_WIDTH / 2 - 25, y: MAP_HEIGHT / 2 + 150, width: 50, height: MAP_HEIGHT / 2 - 350 },
];
