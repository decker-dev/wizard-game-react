import type { Obstacle } from "@/types/game";
import { map1Data } from "@/data/mapLayouts/map1";
import { map2Data } from "@/data/mapLayouts/map2";
import { map3Data } from "@/data/mapLayouts/map3";

// Defines at which level each map should be introduced.
const mapChangeLevels = {
  map1: 1, // map1 is for levels 1-5
  map2: 6, // map2 is for levels 6-10
  map3: 11, // map3 is for levels 11-15
  // After level 15, it will cycle back to map1, then map2, etc.
  // Or we can define a default map if the level is too high.
};

const MAP_CYCLE_LENGTH = 15; // Levels 1-15 define one full cycle of maps
const MAPS_IN_CYCLE = 3;

export const getMapForLevel = (level: number): Obstacle[] => {
  // Adjust level to be 0-indexed for calculations if levels are 1-indexed
  const effectiveLevel = level -1;

  // Determine which segment of the cycle the level falls into
  // Levels 1-5 (0-4) -> map 1
  // Levels 6-10 (5-9) -> map 2
  // Levels 11-15 (10-14) -> map 3
  // Levels 16-20 (15-19) -> map 1 (15 % 15 = 0 -> map1Data)
  // Levels 21-25 (20-24) -> map 2 (20 % 15 = 5 -> map2Data)
  // etc.

  const levelInCycle = effectiveLevel % MAP_CYCLE_LENGTH;

  if (levelInCycle < (mapChangeLevels.map2 -1) ) { // Levels 0-4 (Original levels 1-5)
    return map1Data;
  } else if (levelInCycle < (mapChangeLevels.map3 -1) ) { // Levels 5-9 (Original levels 6-10)
    return map2Data;
  } else { // Levels 10-14 (Original levels 11-15)
    return map3Data;
  }
};
