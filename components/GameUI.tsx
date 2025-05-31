import React from 'react'
import { MAX_WAVES } from '@/constants/game'

interface GameUIProps {
  score: number
  currentWave: number
  playerHealth: number
  gameOver: boolean
  gameWon: boolean
  onResetGame: () => void
}

export const GameUI: React.FC<GameUIProps> = ({
  score,
  currentWave,
  playerHealth,
  gameOver,
  gameWon,
  onResetGame
}) => {
  return (
    <>
      {/* Game Header */}
      <div className="mb-4 text-white text-center">
        <h1 className="text-4xl font-bold mb-2">Boxhead Zombie Siege</h1>
        <div className="flex justify-center gap-6 text-xl">
          <div>Kills: {score}</div>
          <div>
            Wave: {currentWave} / {MAX_WAVES}
          </div>
          <div>Health: {playerHealth}</div>
        </div>
      </div>

      {/* Game Over/Won Overlay */}
      {(gameOver || gameWon) && (
        <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center text-white">
          <h2 className="text-5xl font-bold mb-6">{gameWon ? "YOU WIN!" : "GAME OVER!"}</h2>
          {gameWon && <p className="text-2xl mb-4">You successfully defended against all zombie waves!</p>}
          <p className="text-2xl mb-4">Zombies Killed: {score}</p>
          <p className="text-2xl mb-6">Survived to Wave: {currentWave}</p>
          <button
            onClick={onResetGame}
            className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xl transition-colors"
          >
            Play Again
          </button>
        </div>
      )}

      {/* Game Instructions */}
      <div className="mt-4 text-gray-300 text-center max-w-lg">
        <p className="text-sm">WASD/Arrows to Move. SPACEBAR to Shoot in movement direction. Survive the zombie onslaught!</p>
      </div>
    </>
  )
} 