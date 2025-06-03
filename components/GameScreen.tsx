import React from 'react'
import { GameCanvas } from '@/components/GameCanvas'
import { GameUI } from '@/components/GameUI'
import { Marketplace } from '@/components/Marketplace'
import { GameOverlay } from '@/components/GameOverlay'
import { FloatingParticles } from '@/components/FloatingParticles'
import { MobileControls } from '@/components/MobileControls'
import { GameScreenState } from '@/hooks/useGameScreens'

interface GameScreenProps {
  screenState: GameScreenState
  gameStateRef: any
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  
  // Assets
  creatureSpritesRef: any
  floorTextureRef: any
  
  // Audio
  playCreatureDeath: () => void
  playPlayerCast: () => void
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
  creatureSpritesRef,
  floorTextureRef,
  playCreatureDeath,
  playPlayerCast,
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

  // Detect if we're on mobile
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Mobile control handlers
  const handleMobileMove = React.useCallback((direction: { x: number; y: number }) => {
    if (!gameStateRef.current?.player) return
    
    const player = gameStateRef.current.player
    const speed = 3 // Adjust speed as needed
    
    // Update player movement direction
    player.dx = direction.x * speed
    player.dy = direction.y * speed
    
    // Update player direction for sprite animation
    if (direction.x !== 0 || direction.y !== 0) {
      if (Math.abs(direction.x) > Math.abs(direction.y)) {
        player.direction = direction.x > 0 ? 'E' : 'W'
      } else {
        player.direction = direction.y > 0 ? 'S' : 'N'
      }
    }
  }, [gameStateRef])

  const handleMobileShoot = React.useCallback(() => {
    if (!gameStateRef.current?.player) return
    
    const player = gameStateRef.current.player
    const gameState = gameStateRef.current
    
    // Check if player can cast (has mana and not on cooldown)
    if (player.mana < player.spellCost) return
    if (gameState.lastCastTime && Date.now() - gameState.lastCastTime < player.castRate) return
    
    // Cast spell in current direction
    const directions = {
      'N': { x: 0, y: -1 },
      'S': { x: 0, y: 1 },
      'E': { x: 1, y: 0 },
      'W': { x: -1, y: 0 }
    }
    
    const dir = directions[player.direction as keyof typeof directions] || { x: 0, y: -1 }
    
    // Create projectiles based on spell count
    for (let i = 0; i < player.spellCount; i++) {
      const spreadAngle = (i - (player.spellCount - 1) / 2) * 0.3 // Spread angle
      const cos = Math.cos(spreadAngle)
      const sin = Math.sin(spreadAngle)
      
      // Rotate direction by spread angle
      const finalDir = {
        x: dir.x * cos - dir.y * sin,
        y: dir.x * sin + dir.y * cos
      }
      
      gameState.projectiles.push({
        x: player.x,
        y: player.y,
        dx: finalDir.x * player.spellSpeed,
        dy: finalDir.y * player.spellSpeed,
        damage: player.spellDamage,
        size: player.spellSize,
        color: '#9333ea', // Purple color for magic
        lifetime: 120 // frames
      })
    }
    
    // Consume mana and set cooldown
    player.mana -= player.spellCost
    gameState.lastCastTime = Date.now()
    
    // Play cast sound
    playPlayerCast()
  }, [gameStateRef, playPlayerCast])

  // Mobile version - only canvas with controls
  if (isMobile) {
    return (
      <div className="min-h-screen w-full bg-black flex items-center justify-center overflow-hidden">
        {/* Game Canvas - Full screen on mobile */}
        <div className="w-full h-full flex items-center justify-center">
          <GameCanvas
            gameState={gameStateRef.current}
            creatureSprites={creatureSpritesRef.current}
            floorTexture={floorTextureRef.current}
            waveMessage={waveMessage}
            startNextWave={onStartNextWave}
            setScore={setScore}
            setPlayerHealth={setPlayerHealth}
            setPlayerCoins={setPlayerCoins}
            setGameOver={setGameOver}
            onMouseMove={onMouseMove}
            onMouseClick={onMouseClick}
            playCreatureDeath={playCreatureDeath}
            playPlayerShoot={playPlayerCast}
            playPlayerHit={playPlayerHit}
          />
        </div>

        {/* Mobile Controls */}
        <MobileControls
          onMove={handleMobileMove}
          onShoot={handleMobileShoot}
        />

        {/* Game Over/Won Overlay - Still needed for mobile */}
        {(gameOver || gameWon) && (
          <div className="absolute inset-0 flex items-center justify-center">
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
          </div>
        )}

        {/* Marketplace - Still needed for mobile */}
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
    )
  }

  // Desktop version - original layout
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Smoke/Fog effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

        {/* Floating particles */}
        <FloatingParticles />
      </div>

      {/* Game Content with new layout */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="flex items-start gap-8 w-full max-w-7xl">
          {/* Game Canvas Container - Centered */}
          <div className="flex-1 flex flex-col items-center">
            <div className="relative shadow-2xl">
              {/* Game Canvas Container with magical styling */}
              <div className="bg-black/40 backdrop-blur-sm border border-purple-500/50 rounded-lg p-4 hover:border-purple-500/70 transition-colors">
                <GameCanvas
                  gameState={gameStateRef.current}
                  creatureSprites={creatureSpritesRef.current}
                  floorTexture={floorTextureRef.current}
                  waveMessage={waveMessage}
                  startNextWave={onStartNextWave}
                  setScore={setScore}
                  setPlayerHealth={setPlayerHealth}
                  setPlayerCoins={setPlayerCoins}
                  setGameOver={setGameOver}
                  onMouseMove={onMouseMove}
                  onMouseClick={onMouseClick}
                  playCreatureDeath={playCreatureDeath}
                  playPlayerShoot={playPlayerCast}
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
              <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-lg p-4 hover:border-purple-500/30 transition-colors">
                <div className="text-gray-300 font-mono text-sm space-y-1">
                  <p className="hover:text-purple-400 transition-colors">🎯 <span className="text-purple-300">WASD/Arrows</span> to move</p>
                  <p className="hover:text-purple-400 transition-colors">🔮 <span className="text-purple-300">SPACEBAR</span> to cast spells</p>
                  <p className="hover:text-purple-400 transition-colors">🐉 <span className="text-purple-300">Defeat creatures</span> and survive</p>
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
      <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-purple-500/30"></div>
      <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-purple-500/30"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-purple-500/30"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-purple-500/30"></div>
    </div>
  )
} 