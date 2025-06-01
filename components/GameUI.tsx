import React from 'react'
import { Player } from '@/types/game'
import { CoinIcon } from './CoinIcon'

interface GameUIProps {
  score: number
  currentWave: number
  playerHealth: number
  playerCoins: number
  gameOver: boolean
  gameWon: boolean
  onResetGame: () => void
  onReturnHome?: () => void
  onShare?: () => void
  player?: Player
}

export const GameUI: React.FC<GameUIProps> = ({
  score,
  currentWave,
  playerHealth,
  playerCoins,
  gameOver,
  gameWon,
  onResetGame,
  onReturnHome,
  onShare,
  player
}) => {
  return (
    <div className="space-y-4">
      {/* Game Title Header */}
      <div className="bg-black/60 backdrop-blur-sm border border-orange-500/30 rounded-lg p-4 hover:border-orange-500/50 transition-colors">
        <h1 className="text-2xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-b from-orange-400 to-red-600 text-center mb-2">
          ZOMBIE SIEGE
        </h1>
        <div className="text-center text-gray-400 font-mono text-xs">
          ∞ Survival Mode ∞
        </div>
      </div>

      {/* Stats - Vertical Layout */}
      <div className="space-y-3">
        {/* Kills */}
        <div className="bg-black/60 backdrop-blur-sm border border-orange-500/20 rounded-lg p-4 hover:border-orange-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-orange-400 text-sm font-mono">KILLS</div>
              <div className="text-3xl font-bold text-white font-mono">{score}</div>
            </div>
            <div className="text-4xl">💀</div>
          </div>
        </div>
        
        {/* Wave */}
        <div className="bg-black/60 backdrop-blur-sm border border-orange-500/20 rounded-lg p-4 hover:border-orange-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-orange-400 text-sm font-mono">WAVE</div>
              <div className="text-3xl font-bold text-white font-mono">{currentWave}</div>
              <div className="text-xs text-gray-400 font-mono">∞ Infinite</div>
            </div>
            <div className="text-4xl">🌊</div>
          </div>
        </div>
        
        {/* Health */}
        <div className="bg-black/60 backdrop-blur-sm border border-orange-500/20 rounded-lg p-4 hover:border-orange-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-orange-400 text-sm font-mono">HEALTH</div>
              <div className="text-2xl font-bold font-mono">
                <span className={playerHealth > 50 ? "text-green-400" : playerHealth > 25 ? "text-yellow-400" : "text-red-400"}>
                  {playerHealth}
                </span>
                <span className="text-gray-400">/{player?.maxHealth || 100}</span>
              </div>
              {/* Health Bar */}
              <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    playerHealth > 50 ? "bg-green-400" : 
                    playerHealth > 25 ? "bg-yellow-400" : "bg-red-400"
                  }`}
                  style={{ width: `${(playerHealth / (player?.maxHealth || 100)) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="text-4xl">❤️</div>
          </div>
        </div>
        
        {/* Coins */}
        <div className="bg-black/60 backdrop-blur-sm border border-orange-500/20 rounded-lg p-4 hover:border-orange-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-orange-400 text-sm font-mono">COINS</div>
              <div className="text-3xl font-bold text-yellow-400 font-mono flex items-center">
                <CoinIcon size="md" className="mr-2" />
                {playerCoins}
              </div>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </div>
      </div>

      {/* Weapon Info */}
      {player && (
        <div className="bg-black/60 backdrop-blur-sm border border-orange-500/20 rounded-lg p-4 hover:border-orange-500/40 transition-colors">
          <div className="text-orange-400 text-sm font-mono mb-2">WEAPON</div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-mono font-bold">Level {player.upgrades.weaponLevel}</div>
              <div className="text-gray-400 text-xs font-mono">Damage: {player.upgrades.weaponDamage}</div>
            </div>
            <div className="text-4xl">🔫</div>
          </div>
        </div>
      )}
          
      {/* Action Buttons */}
      {(onReturnHome || onShare) && (
        <div className="space-y-2">
          {onReturnHome && (
            <button
              onClick={onReturnHome}
              className="w-full px-4 py-3 bg-red-600/80 hover:bg-red-600 border border-red-500/50 text-white text-sm font-mono rounded transition-all duration-200 transform hover:scale-105 hover:border-red-500"
            >
              🏠 VOLVER AL INICIO
            </button>
          )}
          
          {onShare && (
            <button
              onClick={onShare}
              className="w-full px-4 py-3 bg-blue-600/80 hover:bg-blue-600 border border-blue-500/50 text-white text-sm font-mono rounded transition-all duration-200 transform hover:scale-105 hover:border-blue-500"
            >
              📱 COMPARTIR
            </button>
          )}
        </div>
      )}

      {/* Status Messages */}
      <div className="bg-black/40 backdrop-blur-sm border border-orange-500/20 rounded-lg p-3">
        <div className="text-gray-300 font-mono text-xs text-center space-y-1">
          <div className="text-orange-400">STATUS</div>
          {gameOver && <div className="text-red-400">💀 GAME OVER</div>}
          {gameWon && <div className="text-green-400">🏆 VICTORY</div>}
          {!gameOver && !gameWon && <div className="text-green-400">🔥 FIGHTING</div>}
        </div>
      </div>
    </div>
  )
} 