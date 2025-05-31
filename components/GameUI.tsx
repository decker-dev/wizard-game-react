import React from 'react'
import { MAX_WAVES } from '@/constants/game'

interface GameUIProps {
  score: number
  currentWave: number
  playerHealth: number
  playerCoins: number
  gameOver: boolean
  gameWon: boolean
  onResetGame: () => void
  onReturnHome?: () => void
}

export const GameUI: React.FC<GameUIProps> = ({
  score,
  currentWave,
  playerHealth,
  playerCoins,
  gameOver,
  gameWon,
  onResetGame,
  onReturnHome
}) => {
  return (
    <>
      {/* Game Header */}
      <div className="mb-4 text-white text-center">
        <h1 className="text-4xl font-bold mb-2">Zombie Siege</h1>
        <div className="flex justify-center gap-6 text-xl">
          <div>Kills: {score}</div>
          <div>
            Wave: {currentWave} / {MAX_WAVES}
          </div>
          <div>Health: {playerHealth}</div>
          <div className="text-yellow-400">💰 Coins: {playerCoins}</div>
        </div>
        
        {/* Return Home Button */}
        {onReturnHome && (
          <div className="mt-2">
            <button
              onClick={onReturnHome}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded transition-colors"
            >
              🏠 Volver al Inicio
            </button>
          </div>
        )}
      </div>

      {/* Game Instructions */}
      <div className="mt-4 text-gray-300 text-center max-w-lg">
        <p className="text-sm">WASD/Arrows para moverte. SPACEBAR para disparar en dirección del movimiento. ¡Sobrevive al ataque zombie!</p>
      </div>
    </>
  )
} 