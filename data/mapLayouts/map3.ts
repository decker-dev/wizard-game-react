import { MAP_HEIGHT, MAP_WIDTH } from "@/constants/game";
import type { Obstacle } from "@/types/game";

export const map3Data: Obstacle[] = [
    // Diagonal obstacles
    { x: 100, y: 100, width: 200, height: 50 },
    { x: MAP_WIDTH - 300, y: 100, width: 200, height: 50 },
    { x: 100, y: MAP_HEIGHT - 150, width: 200, height: 50 },
    { x: MAP_WIDTH - 300, y: MAP_HEIGHT - 150, width: 200, height: 50 },

    // Central X
    { x: MAP_WIDTH / 2 - 200, y: MAP_HEIGHT / 2 - 25, width: 400, height: 50 },
    { x: MAP_WIDTH / 2 - 25, y: MAP_HEIGHT / 2 - 200, width: 50, height: 400 },

    // Smaller blocks
    { x: MAP_WIDTH / 4, y: MAP_HEIGHT / 4, width: 75, height: 75 },
    { x: MAP_WIDTH * 3 / 4 - 75, y: MAP_HEIGHT / 4, width: 75, height: 75 },
    { x: MAP_WIDTH / 4, y: MAP_HEIGHT * 3 / 4 - 75, width: 75, height: 75 },
    { x: MAP_WIDTH * 3 / 4 - 75, y: MAP_HEIGHT * 3 / 4 - 75, width: 75, height: 75 },
];
