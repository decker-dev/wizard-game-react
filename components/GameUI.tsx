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

      {/* Game Instructions */}
      <div className="mt-4 text-gray-300 text-center max-w-lg">
        <p className="text-sm">WASD/Arrows to Move. SPACEBAR to Shoot in movement direction. Survive the zombie onslaught!</p>
      </div>
    </>
  )
} 