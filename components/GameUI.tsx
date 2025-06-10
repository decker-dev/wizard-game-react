import type { Player } from "@/types/game";
import type React from "react";
import { CoinIcon } from "./CoinIcon";

interface GameUIProps {
  score: number;
  currentWave: number;
  playerHealth: number;
  playerCoins: number;
  gameOver: boolean;
  gameWon: boolean;
  onResetGame: () => void;
  onReturnHome?: () => void;
  onShare?: () => void;
  player?: Player;
  comboKills?: number;
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
  player,
  comboKills,
}) => {
  // Use player.health if available, otherwise fall back to playerHealth
  const currentHealth = player?.health ?? playerHealth;
  const maxHealth = player?.maxHealth ?? 100;

  return (
    <div className='space-y-4'>
      {/* Game Title Header */}
      <div className='bg-black/60 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4 hover:border-purple-500/50 transition-colors'>
        <h1 className='text-2xl font-bold font-pixel text-transparent bg-clip-text bg-gradient-to-b from-purple-400 to-blue-600 text-center mb-2'>
          MYSTIC REALM
        </h1>
        <div className='text-center text-gray-400 font-mono text-xs'>
          ∞ Arcane Defense ∞
        </div>
      </div>

      {/* Stats - 2x3 Grid Layout */}
      <div className='grid grid-cols-2 grid-rows-3 gap-3'>
        {/* Score */}
        <div className='bg-black/60 backdrop-blur-sm border border-purple-500/20 rounded-lg p-4 hover:border-purple-500/40 transition-colors'>
          <div className='flex items-center justify-between'>
            <div>
              <div className='text-purple-400 text-sm font-mono'>SCORE</div>
              <div className='text-3xl font-bold text-white font-mono'>
                {score}
              </div>
            </div>
            <div className='text-4xl'>⚔️</div>
          </div>
        </div>
        {/* Wave */}
        <div className='bg-black/60 backdrop-blur-sm border border-purple-500/20 rounded-lg p-4 hover:border-purple-500/40 transition-colors'>
          <div className='flex items-center justify-between'>
            <div>
              <div className='text-purple-400 text-sm font-mono'>WAVE</div>
              <div className='text-3xl font-bold text-white font-mono'>
                {currentWave}
              </div>
            </div>
            <div className='text-4xl'>🌊</div>
          </div>
        </div>
        {/* Combo */}
        <div
          className={`bg-black/60 backdrop-blur-sm border rounded-lg p-4 transition-colors ${comboKills && comboKills > 0 ? "border-orange-500/30 hover:border-orange-500/50" : "border-gray-500/20 hover:border-gray-500/30 opacity-60"}`}
        >
          <div className='flex items-center justify-between'>
            <div>
              <div
                className={`font-mono text-sm ${comboKills && comboKills > 0 ? "text-orange-400" : "text-gray-400"}`}
              >
                COMBO
              </div>
              <div
                className={`text-3xl font-bold font-mono ${comboKills && comboKills > 0 ? "text-orange-300" : "text-gray-300"}`}
              >
                {comboKills && comboKills > 0 ? `${comboKills}x` : "0x"}
              </div>
              <div
                className={`text-xs font-mono ${comboKills && comboKills > 0 ? "text-orange-400" : "text-gray-400"}`}
              >
                kills streak
              </div>
            </div>
            <div className='text-4xl'>
              {comboKills && comboKills > 0 ? "🔥" : "💤"}
            </div>
          </div>
        </div>
        {/* Health */}
        <div className='bg-black/60 backdrop-blur-sm border border-purple-500/20 rounded-lg p-4 hover:border-purple-500/40 transition-colors'>
          <div className='flex items-center justify-between'>
            <div>
              <div className='text-purple-400 text-sm font-mono'>HEALTH</div>
              <div className='text-2xl font-bold font-mono'>
                <span
                  className={
                    currentHealth > maxHealth * 0.5
                      ? "text-green-400"
                      : currentHealth > maxHealth * 0.25
                        ? "text-yellow-400"
                        : "text-red-400"
                  }
                >
                  {Math.round(currentHealth)}
                </span>
                <span className='text-gray-400'>/{maxHealth}</span>
              </div>
              {/* Health Bar */}
              <div className='w-full bg-gray-700 rounded-full h-2 mt-2'>
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentHealth > maxHealth * 0.5
                      ? "bg-green-400"
                      : currentHealth > maxHealth * 0.25
                        ? "bg-yellow-400"
                        : "bg-red-400"
                  }`}
                  style={{
                    width: `${Math.max(0, Math.min(100, (currentHealth / maxHealth) * 100))}%`,
                  }}
                />
              </div>
            </div>
            <div className='text-4xl'>❤️</div>
          </div>
        </div>
        {/* Crystals */}
        <div className='bg-black/60 backdrop-blur-sm border border-purple-500/20 rounded-lg p-4 hover:border-purple-500/40 transition-colors'>
          <div className='flex items-center justify-between'>
            <div>
              <div className='text-purple-400 text-sm font-mono'>CRYSTALS</div>
              <div className='text-3xl font-bold text-yellow-400 font-mono flex items-center'>
                <CoinIcon size='md' className='mr-2' />
                {playerCoins}
              </div>
            </div>
            <div className='text-4xl'>💎</div>
          </div>
        </div>
        {/* Spell Power */}
        {player ? (
          <div className='bg-black/60 backdrop-blur-sm border border-purple-500/20 rounded-lg p-4 hover:border-purple-500/40 transition-colors'>
            <div className='text-purple-400 text-sm font-mono mb-2'>
              SPELL POWER
            </div>
            <div className='flex items-center justify-between'>
              <div>
                <div className='text-white font-mono font-bold'>
                  Level {player.upgrades.spellLevel}
                </div>
                <div className='text-gray-400 text-xs font-mono'>
                  Damage: {player.upgrades.spellDamage}
                </div>
              </div>
              <div className='text-4xl'>🪄</div>
            </div>
          </div>
        ) : (
          <div />
        )}
      </div>

      {/* Action Buttons */}
      {(onReturnHome || onShare) && (
        <div className='flex flex-row gap-4 w-full'>
          {onReturnHome && (
            <button
              type='button'
              onClick={onReturnHome}
              className='w-1/2 px-4 py-3 bg-purple-600/80 hover:bg-purple-600 border border-purple-500/50 text-white text-sm font-mono rounded transition-all duration-200 transform hover:scale-105 hover:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-400'
              tabIndex={0}
              aria-label='Main Menu'
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  onReturnHome();
                }
              }}
            >
              🏠 MAIN MENU
            </button>
          )}
          {onShare && (
            <button
              type='button'
              onClick={onShare}
              className='w-1/2 px-4 py-3 bg-blue-600/80 hover:bg-blue-600 border border-blue-500/50 text-white text-sm font-mono rounded transition-all duration-200 transform hover:scale-105 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400'
              tabIndex={0}
              aria-label='Share your score'
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  onShare();
                }
              }}
            >
              📱 SHARE
            </button>
          )}
        </div>
      )}

      {/* Status Messages */}
      <div className='bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-lg p-3'>
        <div className='text-gray-300 font-mono text-xs text-center space-y-1'>
          <div className='text-purple-400'>STATUS</div>
          {gameOver && <div className='text-red-400'>💀 REALM FALLEN</div>}
          {gameWon && <div className='text-green-400'>🏆 VICTORY</div>}
          {!gameOver && !gameWon && (
            <div className='text-green-400'>🔥 DEFENDING</div>
          )}
        </div>
      </div>
    </div>
  );
};
