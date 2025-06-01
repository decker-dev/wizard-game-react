import React from 'react'
import { GameCanvas } from '@/components/GameCanvas'
import { GameUI } from '@/components/GameUI'
import { Marketplace } from '@/components/Marketplace'
import { GameOverlay } from '@/components/GameOverlay'
import { FloatingParticles } from '@/components/FloatingParticles'
import { GameScreenState } from '@/hooks/useGameScreens'

interface GameScreenProps {
  screenState: GameScreenState
  gameStateRef: any
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  
  // Assets
  zombieSpritesRef: any
  floorTextureRef: any
  
  // Audio
  playZombieDeath: () => void
  playPlayerShoot: () => void
  playPlayerHit: () => void
  
  // Event handlers
  onMouseMove: (e: MouseEvent) => void
  onMouseClick: (e: MouseEvent) => void
  onStartNextWave: () => void
  
  // State setters
  setScore: (score: number) => void
  setPlayerHealth: (health: number) => void
  setPlayerCoins: (coins: number) => void
  setGameOver: (gameOver: boolean) => void
  
  // Actions
  onResetGame: () => void
  onReturnHome: () => void
  onShare: () => void
  onSaveScore: () => void
  
  // Upgrade actions
  onUpgradeWeapon: () => void
  onUpgradeHealth: () => void
  onContinueFromMarketplace: () => void
}

export function GameScreen({
  screenState,
  gameStateRef,
  canvasRef,
  zombieSpritesRef,
  floorTextureRef,
  playZombieDeath,
  playPlayerShoot,
  playPlayerHit,
  onMouseMove,
  onMouseClick,
  onStartNextWave,
  setScore,
  setPlayerHealth,
  setPlayerCoins,
  setGameOver,
  onResetGame,
  onReturnHome,
  onShare,
  onSaveScore,
  onUpgradeWeapon,
  onUpgradeHealth,
  onContinueFromMarketplace
}: GameScreenProps) {
  const {
    score,
    currentWave,
    playerHealth,
    playerCoins,
    gameOver,
    gameWon,
    waveMessage,
    showScoreModal
  } = screenState

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Smoke/Fog effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,140,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,140,0,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

        {/* Floating particles */}
        <FloatingParticles />
      </div>

      {/* Game Content with new layout */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="flex items-start gap-8 w-full max-w-7xl">
          {/* Game Canvas Container - Centered */}
          <div className="flex-1 flex flex-col items-center">
            <div className="relative shadow-2xl">
              {/* Game Canvas Container with apocalyptic styling */}
              <div className="bg-black/40 backdrop-blur-sm border border-orange-500/50 rounded-lg p-4 hover:border-orange-500/70 transition-colors">
                <GameCanvas
                  gameState={gameStateRef.current}
                  zombieSprites={zombieSpritesRef.current}
                  floorTexture={floorTextureRef.current}
                  waveMessage={waveMessage}
                  startNextWave={onStartNextWave}
                  setScore={setScore}
                  setPlayerHealth={setPlayerHealth}
                  setPlayerCoins={setPlayerCoins}
                  setGameOver={setGameOver}
                  onMouseMove={onMouseMove}
                  onMouseClick={onMouseClick}
                  playZombieDeath={playZombieDeath}
                  playPlayerShoot={playPlayerShoot}
                  playPlayerHit={playPlayerHit}
                />
              </div>

              {/* Game Over/Won Overlay */}
              {(gameOver || gameWon) && (
                <GameOverlay
                  gameWon={gameWon}
                  score={score}
                  playerCoins={playerCoins}
                  currentWave={currentWave}
                  showScoreModal={showScoreModal}
                  onResetGame={onResetGame}
                  onReturnHome={onReturnHome}
                  onSaveScore={onSaveScore}
                />
              )}
            </div>

            {/* Game Instructions - Below the canvas */}
            <div className="mt-4 text-center max-w-md">
              <div className="bg-black/40 backdrop-blur-sm border border-orange-500/20 rounded-lg p-4 hover:border-orange-500/30 transition-colors">
                <div className="text-gray-300 font-mono text-sm space-y-1">
                  <p className="hover:text-orange-400 transition-colors">🎯 <span className="text-orange-300">WASD/Arrows</span> para moverte</p>
                  <p className="hover:text-orange-400 transition-colors">🔫 <span className="text-orange-300">SPACEBAR</span> para disparar</p>
                  <p className="hover:text-orange-400 transition-colors">🧟 <span className="text-orange-300">Elimina zombies</span> y sobrevive</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Panel - GameUI in vertical layout */}
          <div className="w-80 flex flex-col">
            <GameUI
              score={score}
              currentWave={currentWave}
              playerHealth={playerHealth}
              playerCoins={playerCoins}
              gameOver={gameOver}
              gameWon={gameWon}
              onResetGame={onResetGame}
              onReturnHome={onReturnHome}
              onShare={onShare}
              player={gameStateRef.current?.player}
            />
          </div>
        </div>

        {/* Marketplace - Overlays everything when shown */}
        {gameStateRef.current?.showMarketplace && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Marketplace
              player={gameStateRef.current.player}
              onUpgradeWeapon={onUpgradeWeapon}
              onUpgradeHealth={onUpgradeHealth}
              onContinue={onContinueFromMarketplace}
            />
          </div>
        )}
      </div>

      {/* Corner decorative elements */}
      <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-orange-500/30"></div>
      <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-orange-500/30"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-orange-500/30"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-orange-500/30"></div>
    </div>
  )
} 