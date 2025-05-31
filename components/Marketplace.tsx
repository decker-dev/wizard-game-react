import React from 'react'
import { Player } from '@/types/game'
import { 
  WEAPON_DAMAGE_INCREASE, 
  HEALTH_INCREASE, 
  MAX_UPGRADE_LEVEL 
} from '@/constants/game'
import { getWeaponUpgradeCost, getHealthUpgradeCost } from '@/utils/marketplace'

interface MarketplaceProps {
  player: Player
  onUpgradeWeapon: () => void
  onUpgradeHealth: () => void
  onContinue: () => void
}

export const Marketplace: React.FC<MarketplaceProps> = ({
  player,
  onUpgradeWeapon,
  onUpgradeHealth,
  onContinue
}) => {
  const weaponCost = getWeaponUpgradeCost(player.upgrades.weaponLevel)
  const healthCost = getHealthUpgradeCost(player.upgrades.healthLevel)
  
  const canUpgradeWeapon = player.coins >= weaponCost && player.upgrades.weaponLevel < MAX_UPGRADE_LEVEL
  const canUpgradeHealth = player.coins >= healthCost && player.upgrades.healthLevel < MAX_UPGRADE_LEVEL

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-gray-800 border-4 border-yellow-500 rounded-lg p-8 max-w-md w-full mx-4">
        <h2 className="text-3xl font-bold text-yellow-400 text-center mb-6">
          🛒 MARKETPLACE
        </h2>
        
        <div className="text-center mb-6">
          <p className="text-white text-xl">💰 Monedas: {player.coins}</p>
        </div>

        <div className="space-y-4">
          {/* Weapon Upgrade */}
          <div className="bg-gray-700 rounded-lg p-4 border-2 border-gray-600">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold text-red-400">🔫 Mejorar Arma</h3>
              <span className="text-yellow-400">💰 {weaponCost}</span>
            </div>
            <p className="text-gray-300 text-sm mb-3">
              Daño actual: {player.upgrades.weaponDamage} | Nivel: {player.upgrades.weaponLevel}/{MAX_UPGRADE_LEVEL}
            </p>
            <p className="text-gray-300 text-sm mb-3">
              +{WEAPON_DAMAGE_INCREASE} de daño por disparo
            </p>
            <button
              onClick={onUpgradeWeapon}
              disabled={!canUpgradeWeapon}
              className={`w-full py-2 rounded font-bold transition-colors ${
                canUpgradeWeapon
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              {player.upgrades.weaponLevel >= MAX_UPGRADE_LEVEL 
                ? 'MÁXIMO NIVEL' 
                : canUpgradeWeapon 
                  ? 'COMPRAR' 
                  : 'SIN MONEDAS'
              }
            </button>
          </div>

          {/* Health Upgrade */}
          <div className="bg-gray-700 rounded-lg p-4 border-2 border-gray-600">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold text-green-400">❤️ Mejorar Vida</h3>
              <span className="text-yellow-400">💰 {healthCost}</span>
            </div>
            <p className="text-gray-300 text-sm mb-3">
              Vida máxima: {player.upgrades.maxHealth} | Nivel: {player.upgrades.healthLevel}/{MAX_UPGRADE_LEVEL}
            </p>
            <p className="text-gray-300 text-sm mb-3">
              +{HEALTH_INCREASE} de vida máxima
            </p>
            <button
              onClick={onUpgradeHealth}
              disabled={!canUpgradeHealth}
              className={`w-full py-2 rounded font-bold transition-colors ${
                canUpgradeHealth
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              {player.upgrades.healthLevel >= MAX_UPGRADE_LEVEL 
                ? 'MÁXIMO NIVEL' 
                : canUpgradeHealth 
                  ? 'COMPRAR' 
                  : 'SIN MONEDAS'
              }
            </button>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={onContinue}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded text-xl transition-colors"
          >
            Continuar a la siguiente wave →
          </button>
        </div>

        {/* Pricing preview */}
        <div className="mt-4 text-center text-xs text-gray-400">
          {player.upgrades.weaponLevel < MAX_UPGRADE_LEVEL && (
            <p>Próximo upgrade de arma: 💰 {getWeaponUpgradeCost(player.upgrades.weaponLevel + 1)}</p>
          )}
          {player.upgrades.healthLevel < MAX_UPGRADE_LEVEL && (
            <p>Próximo upgrade de vida: 💰 {getHealthUpgradeCost(player.upgrades.healthLevel + 1)}</p>
          )}
        </div>
      </div>
    </div>
  )
} 