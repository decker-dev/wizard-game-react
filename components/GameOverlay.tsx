import React from "react";
import { CoinIcon } from "./CoinIcon";

interface GameOverlayProps {
  gameWon: boolean;
  score: number;
  playerCoins: number;
  currentWave: number;
  showScoreModal: boolean;
  onResetGame: () => void;
  onReturnHome: () => void;
  onSaveScore: () => void;
}

export function GameOverlay({
  gameWon,
  score,
  playerCoins,
  currentWave,
  showScoreModal,
  onResetGame,
  onReturnHome,
  onSaveScore,
}: GameOverlayProps) {
  return (
    <div className='absolute inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg border border-purple-500/50 p-4'>
      <div className='bg-black/80 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4 sm:p-8 text-center hover:border-purple-500/50 transition-colors w-full max-w-lg'>
        <h2 className='text-3xl sm:text-5xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-b from-purple-400 to-blue-600 mb-4 sm:mb-6'>
          {gameWon ? "YOU WON!" : "GAME OVER!"}
        </h2>
        {gameWon && (
          <p className='text-lg sm:text-2xl mb-4 text-green-400 font-mono'>
            You successfully defended the mystical realm against all creature
            waves!
          </p>
        )}

        {/* Stats Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6'>
          <div className='bg-black/40 border border-purple-500/20 rounded p-3 sm:p-4'>
            <div className='text-purple-400 font-mono text-xs sm:text-sm'>
              CREATURES DEFEATED
            </div>
            <div className='text-2xl sm:text-3xl font-bold text-white font-mono'>
              {score}
            </div>
          </div>
          <div className='bg-black/40 border border-purple-500/20 rounded p-3 sm:p-4'>
            <div className='text-purple-400 font-mono text-xs sm:text-sm'>
              CRYSTALS
            </div>
            <div className='text-2xl sm:text-3xl font-bold text-yellow-400 font-mono flex items-center justify-center'>
              <CoinIcon size='lg' className='mr-2' />
              {playerCoins}
            </div>
          </div>
          <div className='bg-black/40 border border-purple-500/20 rounded p-3 sm:p-4'>
            <div className='text-purple-400 font-mono text-xs sm:text-sm'>
              WAVE REACHED
            </div>
            <div className='text-2xl sm:text-3xl font-bold text-white font-mono'>
              {currentWave}
            </div>
          </div>
        </div>

        {!showScoreModal && (
          <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center'>
            <button
              type='button'
              onClick={onReturnHome}
              className='px-4 py-3 bg-purple-600/80 hover:bg-purple-600 border border-purple-500/50 text-white font-mono font-bold rounded-lg text-sm sm:text-lg transition-all duration-200 transform hover:scale-105 hover:border-purple-500 w-full sm:w-auto'
            >
              🏠 MAIN MENU
            </button>
            <button
              type='button'
              onClick={onSaveScore}
              className='px-4 py-3 bg-blue-600/80 hover:bg-blue-600 border border-blue-500/50 text-white font-mono font-bold rounded-lg text-sm sm:text-lg transition-all duration-200 transform hover:scale-105 hover:border-blue-500 w-full sm:w-auto'
            >
              💾 SAVE
            </button>
            <button
              type='button'
              onClick={onResetGame}
              className='px-4 py-3 bg-green-600/80 hover:bg-green-600 border border-green-500/50 text-white font-mono font-bold rounded-lg text-sm sm:text-lg transition-all duration-200 transform hover:scale-105 hover:border-green-500 w-full sm:w-auto'
            >
              🔄 RETRY
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
