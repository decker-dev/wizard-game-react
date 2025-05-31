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
  player
}) => {
  return (
    <>
      {/* Game Header with apocalyptic styling */}
      <div className="mb-6 text-center">
        <div className="bg-black/60 backdrop-blur-sm border border-orange-500/30 rounded-lg p-6 hover:border-orange-500/50 transition-colors">
          <h1 className="text-4xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-b from-orange-400 to-red-600 mb-4">
            ZOMBIE SIEGE
          </h1>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white font-mono">
            <div className="bg-black/40 border border-orange-500/20 rounded p-3 hover:border-orange-500/40 transition-colors">
              <div className="text-orange-400 text-sm">KILLS</div>
              <div className="text-2xl font-bold">{score}</div>
            </div>
            
            <div className="bg-black/40 border border-orange-500/20 rounded p-3 hover:border-orange-500/40 transition-colors">
              <div className="text-orange-400 text-sm">WAVE</div>
              <div className="text-2xl font-bold">{currentWave}</div>
              <div className="text-xs text-gray-400">∞ Infinite</div>
            </div>
            
            <div className="bg-black/40 border border-orange-500/20 rounded p-3 hover:border-orange-500/40 transition-colors">
              <div className="text-orange-400 text-sm">HEALTH</div>
              <div className="text-2xl font-bold">
                <span className={playerHealth > 50 ? "text-green-400" : playerHealth > 25 ? "text-yellow-400" : "text-red-400"}>
                  {playerHealth}
                </span>
                <span className="text-gray-400">/{player?.maxHealth || 100}</span>
              </div>
            </div>
            
            <div className="bg-black/40 border border-orange-500/20 rounded p-3 hover:border-orange-500/40 transition-colors">
              <div className="text-orange-400 text-sm">COINS</div>
              <div className="text-2xl font-bold text-yellow-400 flex items-center justify-center">
                <CoinIcon size="md" className="mr-2" />
                {playerCoins}
              </div>
            </div>
          </div>
          
          {/* Return Home Button */}
          {onReturnHome && (
            <div className="mt-4">
              <button
                onClick={onReturnHome}
                className="px-6 py-2 bg-red-600/80 hover:bg-red-600 border border-red-500/50 text-white text-sm font-mono rounded transition-all duration-200 transform hover:scale-105 hover:border-red-500"
              >
                🏠 VOLVER AL INICIO
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Game Instructions with cyberpunk styling */}
      <div className="mb-4 text-center max-w-4xl">
        <div className="bg-black/40 backdrop-blur-sm border border-orange-500/20 rounded-lg p-4 hover:border-orange-500/30 transition-colors">
          <div className="text-gray-300 font-mono text-sm space-y-1">
            <p className="hover:text-orange-400 transition-colors">🎯 <span className="text-orange-300">WASD/Arrows</span> para moverte</p>
            <p className="hover:text-orange-400 transition-colors">🔫 <span className="text-orange-300">SPACEBAR</span> para disparar en dirección del movimiento</p>
            <p className="hover:text-orange-400 transition-colors">🧟 <span className="text-orange-300">Elimina zombies</span> y sobrevive las waves</p>
          </div>
        </div>
      </div>
    </>
  )
} 