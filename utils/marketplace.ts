import {
	HEALTH_UPGRADE_BASE_COST,
	SPELL_UPGRADE_BASE_COST,
	UPGRADE_COST_MULTIPLIER,
} from "@/constants/game";

export const getSpellUpgradeCost = (currentLevel: number): number => {
	return Math.round(
		SPELL_UPGRADE_BASE_COST * UPGRADE_COST_MULTIPLIER ** currentLevel,
	);
};

export const getHealthUpgradeCost = (currentLevel: number): number => {
	return Math.round(
		HEALTH_UPGRADE_BASE_COST * UPGRADE_COST_MULTIPLIER ** currentLevel,
	);
};
