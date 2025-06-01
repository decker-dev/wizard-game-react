import React from 'react'
import { CoinIcon } from './CoinIcon'

interface GameOverlayProps {
  gameWon: boolean
  score: number
  playerCoins: number
  currentWave: number
  showScoreModal: boolean
  onResetGame: () => void
  onReturnHome: () => void
  onSaveScore: () => void
}

export function GameOverlay({
  gameWon,
  score,
  playerCoins,
  currentWave,
  showScoreModal,
  onResetGame,
  onReturnHome,
  onSaveScore
}: GameOverlayProps) {
  return (
    <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg border border-orange-500/50">
      <div className="bg-black/80 backdrop-blur-sm border border-orange-500/30 rounded-lg p-8 text-center hover:border-orange-500/50 transition-colors">
        <h2 className="text-5xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-b from-orange-400 to-red-600 mb-6">
          {gameWon ? "¡GANASTE!" : "GAME OVER!"}
        </h2>
        {gameWon && (
          <p className="text-2xl mb-4 text-green-400 font-mono">
            ¡Defendiste exitosamente contra todas las waves de zombies!
          </p>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-black/40 border border-orange-500/20 rounded p-4">
            <div className="text-orange-400 font-mono text-sm">ZOMBIES ELIMINADOS</div>
            <div className="text-3xl font-bold text-white font-mono">{score}</div>
          </div>
          <div className="bg-black/40 border border-orange-500/20 rounded p-4">
            <div className="text-orange-400 font-mono text-sm">MONEDAS</div>
            <div className="text-3xl font-bold text-yellow-400 font-mono flex items-center justify-center">
              <CoinIcon size="lg" className="mr-2" />
              {playerCoins}
            </div>
          </div>
          <div className="bg-black/40 border border-orange-500/20 rounded p-4">
            <div className="text-orange-400 font-mono text-sm">WAVE ALCANZADA</div>
            <div className="text-3xl font-bold text-white font-mono">{currentWave}</div>
          </div>
        </div>

        {!showScoreModal && (
          <div className="flex gap-4 justify-center">
            <button
              onClick={onResetGame}
              className="p-4 bg-green-600/80 hover:bg-green-600 border border-green-500/50 text-white font-mono font-bold rounded-lg text-lg transition-all duration-200 transform hover:scale-105 hover:border-green-500"
            >
              🔄 JUGAR DE NUEVO
            </button>
            <button
              onClick={onSaveScore}
              className="p-4 bg-blue-600/80 hover:bg-blue-600 border border-blue-500/50 text-white font-mono font-bold rounded-lg text-lg transition-all duration-200 transform hover:scale-105 hover:border-blue-500"
            >
              💾 GUARDAR PUNTAJE
            </button>
            <button
              onClick={onReturnHome}
              className="p-4 bg-orange-600/80 hover:bg-orange-600 border border-orange-500/50 text-white font-mono font-bold rounded-lg text-lg transition-all duration-200 transform hover:scale-105 hover:border-orange-500"
            >
              🏠 VOLVER AL INICIO
            </button>
          </div>
        )}
      </div>
    </div>
  )
} 