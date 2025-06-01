import {
  SPELL_UPGRADE_BASE_COST,
  MANA_UPGRADE_BASE_COST,
  UPGRADE_COST_MULTIPLIER
} from '@/constants/game'

export const getSpellUpgradeCost = (currentLevel: number): number => {
  return Math.round(SPELL_UPGRADE_BASE_COST * Math.pow(UPGRADE_COST_MULTIPLIER, currentLevel))
}

export const getManaUpgradeCost = (currentLevel: number): number => {
  return Math.round(MANA_UPGRADE_BASE_COST * Math.pow(UPGRADE_COST_MULTIPLIER, currentLevel))
} 