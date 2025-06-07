import type { Obstacle, Vector2 } from "@/types/game";
import { map1Data } from "@/data/mapLayouts/map1";
import { map2Data } from "@/data/mapLayouts/map2";
import { map3Data } from "@/data/mapLayouts/map3";
import { MAP_WIDTH, MAP_HEIGHT } from "@/constants/game"; // Import MAP_WIDTH and MAP_HEIGHT

export interface MapData {
  obstacles: Obstacle[];
  spawnPoint: Vector2;
}

// Define spawn points for each map
const map1SpawnPoint: Vector2 = { x: MAP_WIDTH / 2, y: MAP_HEIGHT - 150 }; // Adjusted Y to be further from potential bottom obstacles
const map2SpawnPoint: Vector2 = { x: MAP_WIDTH / 2, y: MAP_HEIGHT / 2 };
const map3SpawnPoint: Vector2 = { x: 150, y: MAP_HEIGHT / 2 }; // Adjusted X to be further from potential left obstacles

// Defines at which level each map should be introduced.
const mapChangeLevels = {
  map1: 1, // map1 is for levels 1-5
  map2: 6, // map2 is for levels 6-10
  map3: 11, // map3 is for levels 11+
};

export const getMapDataForLevel = (level: number): MapData => {
  if (level >= mapChangeLevels.map3) { // Levels 11+
    return { obstacles: map3Data, spawnPoint: map3SpawnPoint };
  }
  if (level >= mapChangeLevels.map2) { // Levels 6-10
    return { obstacles: map2Data, spawnPoint: map2SpawnPoint };
  }
  // Levels 1-5
  return { obstacles: map1Data, spawnPoint: map1SpawnPoint };
};

// Helper function to determine if there's a map change between two levels
export const shouldTeleportOnWaveChange = (previousLevel: number, currentLevel: number): boolean => {
  // Get map data for both levels
  const previousMapData = getMapDataForLevel(previousLevel);
  const currentMapData = getMapDataForLevel(currentLevel);

  // Check if the obstacles array is different (indicating a map change)
  return previousMapData.obstacles !== currentMapData.obstacles;
};

// Helper function to get the specific map levels where changes occur
export const getMapChangeLevels = () => mapChangeLevels;
