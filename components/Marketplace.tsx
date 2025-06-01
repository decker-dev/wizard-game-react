import React from 'react'
import { Player } from '@/types/game'
import { 
  WEAPON_DAMAGE_INCREASE, 
  HEALTH_INCREASE, 
  MAX_UPGRADE_LEVEL 
} from '@/constants/game'
import { getWeaponUpgradeCost, getHealthUpgradeCost } from '@/utils/marketplace'
import { CoinIcon } from './CoinIcon'

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
          <p className="text-white text-xl flex items-center justify-center">
            <CoinIcon size="lg" className="mr-2" />
            Coins: {player.coins}
          </p>
        </div>

        <div className="space-y-4">
          {/* Weapon Upgrade */}
          <div className="bg-gray-700 rounded-lg p-4 border-2 border-gray-600">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold text-red-400">🔫 Upgrade Weapon</h3>
              <span className="text-yellow-400 flex items-center">
                <CoinIcon size="sm" className="mr-1" />
                {weaponCost}
              </span>
            </div>
            <p className="text-gray-300 text-sm mb-3">
              Current damage: {player.upgrades.weaponDamage} | Level: {player.upgrades.weaponLevel}/{MAX_UPGRADE_LEVEL}
            </p>
            <div className="text-gray-300 text-xs mb-3 space-y-1">
              <p>+{WEAPON_DAMAGE_INCREASE} damage per shot</p>
              {player.upgrades.weaponLevel === 0 && (
                <div className="text-yellow-300">
                  <p>🔥 Next upgrades:</p>
                  <p>• Lv.1: Faster shooting</p>
                  <p>• Lv.2: Double shot</p>
                  <p>• Lv.3: Bigger bullets</p>
                  <p>• Lv.4: Triple shot</p>
                  <p>• Lv.5: Maximum power</p>
                </div>
              )}
              {player.upgrades.weaponLevel >= 1 && (
                <div className="text-green-300">
                  <p>✅ Speed: {Math.round(1000/player.upgrades.fireRate * 10)/10} shots/sec</p>
                  {player.upgrades.projectileCount > 1 && (
                    <p>✅ Projectiles: {player.upgrades.projectileCount}x per shot</p>
                  )}
                  {player.upgrades.projectileSize > 1 && (
                    <p>✅ Size: {Math.round(player.upgrades.projectileSize * 100)}% of original</p>
                  )}
                </div>
              )}
            </div>
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
                ? 'MAX LEVEL' 
                : canUpgradeWeapon 
                  ? 'BUY' 
                  : 'NO COINS'
              }
            </button>
          </div>

          {/* Health Upgrade */}
          <div className="bg-gray-700 rounded-lg p-4 border-2 border-gray-600">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold text-green-400">❤️ Upgrade Health</h3>
              <span className="text-yellow-400 flex items-center">
                <CoinIcon size="sm" className="mr-1" />
                {healthCost}
              </span>
            </div>
            <p className="text-gray-300 text-sm mb-3">
              Max health: {player.upgrades.maxHealth} | Level: {player.upgrades.healthLevel}/{MAX_UPGRADE_LEVEL}
            </p>
            <p className="text-gray-300 text-sm mb-3">
              +{HEALTH_INCREASE} max health
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
                ? 'MAX LEVEL' 
                : canUpgradeHealth 
                  ? 'BUY' 
                  : 'NO COINS'
              }
            </button>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={onContinue}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded text-xl transition-colors"
          >
            Continue to next wave →
          </button>
        </div>

        {/* Pricing preview */}
        <div className="mt-4 text-center text-xs text-gray-400">
          {player.upgrades.weaponLevel < MAX_UPGRADE_LEVEL && (
            <p className="flex items-center justify-center">
              Next weapon upgrade: 
              <CoinIcon size="sm" className="mx-1" />
              {getWeaponUpgradeCost(player.upgrades.weaponLevel + 1)}
            </p>
          )}
          {player.upgrades.healthLevel < MAX_UPGRADE_LEVEL && (
            <p className="flex items-center justify-center">
              Next health upgrade: 
              <CoinIcon size="sm" className="mx-1" />
              {getHealthUpgradeCost(player.upgrades.healthLevel + 1)}
            </p>
          )}
        </div>
      </div>
    </div>
  )
} 