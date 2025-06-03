import React from 'react'
import { GameCanvas } from '@/components/GameCanvas'
import { GameUI } from '@/components/GameUI'
import { Marketplace } from '@/components/Marketplace'
import { GameOverlay } from '@/components/GameOverlay'
import { FloatingParticles } from '@/components/FloatingParticles'
import { MobileControls } from '@/components/MobileControls'
import { GameScreenState } from '@/hooks/useGameScreens'
import { PROJECTILE_SPEED } from '@/constants/game'

interface GameScreenProps {
  screenState: GameScreenState
  gameStateRef: any
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  
  // Assets
  creatureSpritesRef: any
  floorTextureRef: any
  healthPackSpriteRef: any
  
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
  setGameOver: (gameOver: boolean, score: number) => void
  
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
  healthPackSpriteRef,
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

  // Mobile shoot handler with proper cooldown and click-based shooting
  const lastMobileCastTimeRef = React.useRef<number>(0)
  const shootButtonPressedRef = React.useRef<boolean>(false)
  const shootIntervalRef = React.useRef<NodeJS.Timeout | null>(null)

  const performShoot = React.useCallback(() => {
    if (!gameStateRef.current?.player) return false
    
    const player = gameStateRef.current.player
    const gameState = gameStateRef.current
    const now = Date.now()
    
    // Check cooldown using player's cast rate
    if (now - lastMobileCastTimeRef.current < player.upgrades.castRate) {
      return false
    }
    
    // Use the same shooting logic as keyboard input
    const baseDirection = { ...player.lastMovementDirection }
    const projectileCount = player.upgrades.projectileCount
    const spread = player.upgrades.spread
    const projectileSize = player.upgrades.projectileSize
    
    if (projectileCount === 1) {
      // Single spell
      const newProjectile = {
        position: { ...player.position },
        velocity: { 
          x: baseDirection.x * PROJECTILE_SPEED, 
          y: baseDirection.y * PROJECTILE_SPEED 
        },
        radius: 4 * projectileSize,
        speed: PROJECTILE_SPEED,
        isMagicBolt: false
      }
      gameState.projectiles.push(newProjectile)
    } else {
      // Multiple spells with spread
      const baseAngle = Math.atan2(baseDirection.y, baseDirection.x)
      
      for (let i = 0; i < projectileCount; i++) {
        let angleOffset = 0
        
        if (projectileCount === 2) {
          angleOffset = (i - 0.5) * spread
        } else {
          angleOffset = (i - (projectileCount - 1) / 2) * (spread / (projectileCount - 1))
        }
        
        const finalAngle = baseAngle + angleOffset
        const direction = {
          x: Math.cos(finalAngle),
          y: Math.sin(finalAngle)
        }
        
        const newProjectile = {
          position: { ...player.position },
          velocity: { 
            x: direction.x * PROJECTILE_SPEED, 
            y: direction.y * PROJECTILE_SPEED 
          },
          radius: 4 * projectileSize,
          speed: PROJECTILE_SPEED,
          isMagicBolt: false
        }
        gameState.projectiles.push(newProjectile)
      }
    }
    
    lastMobileCastTimeRef.current = now
    playPlayerCast()
    return true
  }, [gameStateRef, playPlayerCast])

  const handleMobileShoot = React.useCallback(() => {
    // Single shot on tap/click
    performShoot()
  }, [performShoot])

  const handleMobileShootStart = React.useCallback(() => {
    if (shootButtonPressedRef.current) return
    
    shootButtonPressedRef.current = true
    
    // First shot immediately
    performShoot()
    
    // Set up interval for continuous shooting while held
    shootIntervalRef.current = setInterval(() => {
      if (shootButtonPressedRef.current) {
        performShoot()
      }
    }, 150) // Shoot every 150ms while held (but still respects cast rate)
  }, [performShoot])

  const handleMobileShootEnd = React.useCallback(() => {
    shootButtonPressedRef.current = false
    
    if (shootIntervalRef.current) {
      clearInterval(shootIntervalRef.current)
      shootIntervalRef.current = null
    }
  }, [])

  // Cleanup interval on unmount
  React.useEffect(() => {
    return () => {
      if (shootIntervalRef.current) {
        clearInterval(shootIntervalRef.current)
      }
    }
  }, [])

  // Mobile version - Nintendo DS style layout
  if (isMobile) {
    return (
      <div className="min-h-screen w-full bg-black flex flex-col overflow-hidden">
        {/* Game Canvas Area - 70% of screen height */}
        <div className="flex-1 flex items-center justify-center bg-black" style={{ height: '70vh' }}>
          <div className="w-full h-full flex items-center justify-center p-2">
            <div className="relative w-full h-full max-w-[95vw] max-h-[65vh]">
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
          </div>
        </div>

        {/* Controls Area - 30% of screen height */}
        <div className="bg-gray-900/80 border-t-2 border-purple-500/30" style={{ height: '30vh', minHeight: '200px' }}>
          {/* Mobile Controls with Nintendo DS style */}
          <MobileControls
            onMove={handleMobileMove}
            onShoot={handleMobileShoot}
            onShootStart={handleMobileShootStart}
            onShootEnd={handleMobileShootEnd}
          />
          
          {/* Game Info in Controls Area */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-40">
            <div className="bg-black/60 backdrop-blur-sm border border-purple-500/30 rounded-lg px-4 py-2">
              <div className="flex items-center gap-4 text-sm font-mono">
                <span className="text-purple-400">Wave {currentWave}</span>
                <span className="text-green-400">HP {playerHealth}</span>
                <span className="text-blue-400">Score {score}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Game Over/Won Overlay */}
        {(gameOver || gameWon) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50">
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

        {/* Marketplace */}
        {gameStateRef.current?.showMarketplace && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50">
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
                  healthPackSprite={healthPackSpriteRef.current}
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