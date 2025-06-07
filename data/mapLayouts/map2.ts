import { MAP_HEIGHT, MAP_WIDTH } from "@/constants/game";
import type { Obstacle } from "@/types/game";

export const map2Data: Obstacle[] = [
    // Scattered large obstacles, allowing entry from edges
    // Top-left quadrant
    { x: MAP_WIDTH / 4 - 100, y: MAP_HEIGHT / 4 - 50, width: 200, height: 100 },
    // Top-right quadrant
    { x: (MAP_WIDTH * 3) / 4 - 100, y: MAP_HEIGHT / 4 - 50, width: 200, height: 100 },
    // Bottom-left quadrant
    { x: MAP_WIDTH / 4 - 100, y: (MAP_HEIGHT * 3) / 4 - 50, width: 200, height: 100 },
    // Bottom-right quadrant
    { x: (MAP_WIDTH * 3) / 4 - 100, y: (MAP_HEIGHT * 3) / 4 - 50, width: 200, height: 100 },

    // Central feature - more open
    // Two horizontal bars with a gap in the middle
    { x: MAP_WIDTH / 2 - 200, y: MAP_HEIGHT / 2 - 25, width: 150, height: 50 }, // Left part
    { x: MAP_WIDTH / 2 + 50, y: MAP_HEIGHT / 2 - 25, width: 150, height: 50 },  // Right part

    // Two vertical columns flanking the center, creating pathways
    { x: MAP_WIDTH / 2 - 150, y: MAP_HEIGHT / 2 - 150, width: 50, height: 100 }, // Upper left column
    { x: MAP_WIDTH / 2 - 150, y: MAP_HEIGHT / 2 + 50, width: 50, height: 100 },  // Lower left column

    { x: MAP_WIDTH / 2 + 100, y: MAP_HEIGHT / 2 - 150, width: 50, height: 100 }, // Upper right column
    { x: MAP_WIDTH / 2 + 100, y: MAP_HEIGHT / 2 + 50, width: 50, height: 100 },  // Lower right column

    // Additional smaller obstacles to add some complexity but not block paths majorly
    { x: 100, y: MAP_HEIGHT / 2 - 25, width: 100, height: 50 }, // Far left middle
    { x: MAP_WIDTH - 200, y: MAP_HEIGHT / 2 - 25, width: 100, height: 50 }, // Far right middle
    { x: MAP_WIDTH / 2 - 25, y: 100, width: 50, height: 100 }, // Far top middle
    { x: MAP_WIDTH / 2 - 25, y: MAP_HEIGHT - 200, width: 50, height: 100 }, // Far bottom middle
];
