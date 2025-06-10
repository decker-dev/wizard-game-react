import { FloatingParticles } from "@/components/FloatingParticles";
import { GameCanvas } from "@/components/GameCanvas";
import { GameOverlay } from "@/components/GameOverlay";
import { GameUI } from "@/components/GameUI";
import { Marketplace } from "@/components/Marketplace";
import { MobileControls } from "@/components/MobileControls";
import { PROJECTILE_SPEED } from "@/constants/game";
import type { GameScreenState } from "@/hooks/useGameScreens";
import type { GameState } from "@/types/game";
import React from "react";

interface GameScreenProps {
  screenState: GameScreenState;
  gameStateRef: React.RefObject<GameState | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;

  // Assets
  creatureSpritesRef: React.RefObject<{
    [key: string]: HTMLImageElement | null;
  }>;
  floorTextureRef: React.RefObject<HTMLImageElement | null>;
  healthPackSpriteRef: React.RefObject<HTMLImageElement | null>;

  // Audio
  playCreatureDeath: () => void;
  playPlayerCast: () => void;
  playPlayerHit: () => void;

  // Event handlers
  onMouseMove: (e: MouseEvent) => void;
  onMouseClick: (e: MouseEvent) => void;
  onStartNextWave: () => void;

  // State setters
  setScore: (score: number) => void;
  setPlayerHealth: (health: number) => void;
  setPlayerCoins: (coins: number) => void;
  setGameOver: (gameOver: boolean, score: number) => void;

  // Actions
  onResetGame: () => void;
  onReturnHome: () => void;
  onShare: () => void;
  onSaveScore: () => void;
  togglePause?: () => void;
  isPaused?: boolean;

  // Upgrade actions
  onUpgradeWeapon: () => void;
  onUpgradeHealth: () => void;
  onContinueFromMarketplace: () => void;
  onFullscreenChange: (isFullscreen: boolean) => void;
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
  togglePause,
  isPaused,
  onUpgradeWeapon,
  onUpgradeHealth,
  onContinueFromMarketplace,
  onFullscreenChange,
}: GameScreenProps) {
  const {
    score,
    currentWave,
    playerHealth,
    playerCoins,
    gameOver,
    gameWon,
    waveMessage,
    showScoreModal,
  } = screenState;

  // Detect if we're on mobile
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Mobile control handlers
  const handleMobileMove = React.useCallback(
    (direction: { x: number; y: number }) => {
      if (!gameStateRef.current?.player) return;

      const player = gameStateRef.current.player;
      const speed = 3; // Adjust speed as needed

      // Update player movement direction
      player.dx = direction.x * speed;
      player.dy = direction.y * speed;

      // Update player direction for sprite animation
      if (direction.x !== 0 || direction.y !== 0) {
        if (Math.abs(direction.x) > Math.abs(direction.y)) {
          player.direction = direction.x > 0 ? "E" : "O";
        } else {
          player.direction = direction.y > 0 ? "S" : "N";
        }
      }
    },
    [gameStateRef]
  );

  // Mobile shoot handler with proper cooldown and click-based shooting
  const lastMobileCastTimeRef = React.useRef<number>(0);
  const shootButtonPressedRef = React.useRef<boolean>(false);
  const shootIntervalRef = React.useRef<NodeJS.Timeout | null>(null);

  const performShoot = React.useCallback(() => {
    if (!gameStateRef.current?.player) return false;

    const player = gameStateRef.current.player;
    const gameState = gameStateRef.current;
    const now = Date.now();

    // Check cooldown using player's cast rate
    if (now - lastMobileCastTimeRef.current < player.upgrades.castRate) {
      return false;
    }

    // Use the same shooting logic as keyboard input
    const baseDirection = { ...player.lastMovementDirection };
    const projectileCount = player.upgrades.projectileCount;
    const spread = player.upgrades.spread;
    const projectileSize = player.upgrades.projectileSize;

    if (projectileCount === 1) {
      // Single spell
      const newProjectile = {
        position: { ...player.position },
        velocity: {
          x: baseDirection.x * PROJECTILE_SPEED,
          y: baseDirection.y * PROJECTILE_SPEED,
        },
        radius: 4 * projectileSize,
        speed: PROJECTILE_SPEED,
        isMagicBolt: false,
      };
      gameState.projectiles.push(newProjectile);
    } else {
      // Multiple spells with spread
      const baseAngle = Math.atan2(baseDirection.y, baseDirection.x);

      for (let i = 0; i < projectileCount; i++) {
        let angleOffset = 0;

        if (projectileCount === 2) {
          angleOffset = (i - 0.5) * spread;
        } else {
          angleOffset =
            (i - (projectileCount - 1) / 2) * (spread / (projectileCount - 1));
        }

        const finalAngle = baseAngle + angleOffset;
        const direction = {
          x: Math.cos(finalAngle),
          y: Math.sin(finalAngle),
        };

        const newProjectile = {
          position: { ...player.position },
          velocity: {
            x: direction.x * PROJECTILE_SPEED,
            y: direction.y * PROJECTILE_SPEED,
          },
          radius: 4 * projectileSize,
          speed: PROJECTILE_SPEED,
          isMagicBolt: false,
        };
        gameState.projectiles.push(newProjectile);
      }
    }

    lastMobileCastTimeRef.current = now;
    playPlayerCast();
    return true;
  }, [gameStateRef, playPlayerCast]);

  const handleMobileShoot = React.useCallback(() => {
    // Single shot on tap/click
    performShoot();
  }, [performShoot]);

  const handleMobileShootStart = React.useCallback(() => {
    if (shootButtonPressedRef.current) return;

    shootButtonPressedRef.current = true;

    // First shot immediately
    performShoot();

    // Set up interval for continuous shooting while held
    shootIntervalRef.current = setInterval(() => {
      if (shootButtonPressedRef.current) {
        performShoot();
      }
    }, 150); // Shoot every 150ms while held (but still respects cast rate)
  }, [performShoot]);

  const handleMobileShootEnd = React.useCallback(() => {
    shootButtonPressedRef.current = false;

    if (shootIntervalRef.current) {
      clearInterval(shootIntervalRef.current);
      shootIntervalRef.current = null;
    }
  }, []);

  // Cleanup interval on unmount
  React.useEffect(() => {
    return () => {
      if (shootIntervalRef.current) {
        clearInterval(shootIntervalRef.current);
      }
    };
  }, []);

  // Mobile version - Nintendo DS style layout
  if (isMobile) {
    return (
      <div className='min-h-dvh w-full bg-black flex flex-col overflow-hidden'>
        {/* Game Stats - Fixed at top */}
        <div className='flex-shrink-0 p-3 bg-gray-900/80 border-b-2 border-purple-500/30'>
          <div className='relative flex items-center'>
            {/* Pause Button - Top left */}

            {/* Game Stats */}
            <div
              className='bg-black/60 backdrop-blur-sm border border-purple-500/30 rounded-lg px-4 py-2 flex-1 max-w-sm mx-auto'
              style={{
                userSelect: "none",
                WebkitUserSelect: "none",
                MozUserSelect: "none",
                msUserSelect: "none",
                WebkitTouchCallout: "none",
                WebkitTapHighlightColor: "transparent",
                touchAction: "none",
              }}
            >
              <div className='flex items-center justify-center gap-3 text-sm font-mono'>
                <span className='text-purple-400'>Wave {currentWave}</span>
                <span className='text-green-400'>HP {playerHealth}</span>
                <span className='text-blue-400'>Score {score}</span>
                {gameStateRef.current?.comboKills &&
                  gameStateRef.current.comboKills > 0 && (
                    <span className='text-orange-400'>
                      🔥{gameStateRef.current.comboKills}x
                    </span>
                  )}
              </div>
            </div>
            {togglePause && (
              <button
                type='button'
                className=' ml-3'
                style={{
                  touchAction: "manipulation",
                  userSelect: "none",
                  WebkitUserSelect: "none",
                  MozUserSelect: "none",
                  msUserSelect: "none",
                  WebkitTouchCallout: "none",
                  WebkitTapHighlightColor: "transparent",
                  outline: "none",
                  WebkitAppearance: "none",
                  MozAppearance: "none",
                }}
                onTouchStart={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  togglePause();
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  togglePause();
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  togglePause();
                }}
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
              >
                <div
                  className='text-white text-lg font-bold flex items-center justify-center h-full'
                  style={{
                    userSelect: "none",
                    WebkitUserSelect: "none",
                    MozUserSelect: "none",
                    msUserSelect: "none",
                    WebkitTouchCallout: "none",
                    pointerEvents: "none",
                  }}
                >
                  {isPaused ? "▶️" : "⏸️"}
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Game Canvas Area */}
        <div className='flex-none h-[45dvh] flex items-center justify-center bg-black'>
          <div className='w-full h-full flex items-center justify-center p-4'>
            <div className='relative flex items-center justify-center'>
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
                onFullscreenChange={onFullscreenChange}
              />
            </div>
          </div>
        </div>

        {/* Controls Area */}
        <div
          className='border-t-2 border-purple-500/30 relative flex-1 min-h-[200px]'
          style={{
            backgroundImage: "url(/bg-controls.jpeg)",
            backgroundSize: "cover",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Dark overlay to ensure controls are visible */}
          <div className='absolute inset-0 bg-black/40' />

          <MobileControls
            onMove={handleMobileMove}
            onShoot={handleMobileShoot}
            onShootStart={handleMobileShootStart}
            onShootEnd={handleMobileShootEnd}
          />
        </div>

        {/* Game Over/Won Overlay */}
        {(gameOver || gameWon) && (
          <div className='absolute inset-0 flex items-center justify-center bg-black/50 z-50'>
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
          <div className='absolute inset-0 flex items-center justify-center bg-black/50 z-50'>
            <Marketplace
              player={gameStateRef.current.player}
              onUpgradeWeapon={onUpgradeWeapon}
              onUpgradeHealth={onUpgradeHealth}
              onContinue={onContinueFromMarketplace}
            />
          </div>
        )}
      </div>
    );
  }

  // Desktop version - original layout
  return (
    <div className='min-h-dvh relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black'>
      {/* Animated Background Elements */}
      <div className='absolute inset-0'>
        {/* Smoke/Fog effect */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
        <div className='absolute top-0 left-0 w-full h-full opacity-20'>
          <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse' />
          <div className='absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000' />
        </div>

        {/* Grid overlay */}
        <div className='absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.1)_1px,transparent_1px)] bg-[size:20px_20px]' />

        {/* Floating particles */}
        <FloatingParticles />
      </div>

      {/* Game Content with new layout */}
      <div className='relative z-10 flex items-center justify-center min-h-dvh p-4'>
        <div className='flex items-start gap-8 w-full max-w-7xl'>
          {/* Game Canvas Container - Centered */}
          <div className='flex-1 flex flex-col items-center'>
            <div className='relative shadow-2xl'>
              {/* Game Canvas Container with magical styling */}
              <div className='bg-black/40 backdrop-blur-sm border border-purple-500/50 rounded-lg p-4 hover:border-purple-500/70 transition-colors'>
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
                  onFullscreenChange={onFullscreenChange}
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
            <div className='mt-4 text-center max-w-sm mx-auto'>
              <div className='bg-black/60 backdrop-blur-sm border border-purple-500/40 rounded-lg p-5 max-w-sm mx-auto transition-colors'>
                <div className='text-gray-200 font-mono text-sm space-y-1'>
                  <p className='flex items-center gap-2'>
                    <span>🎯</span>{" "}
                    <span className='text-purple-400 font-semibold'>
                      WASD/Arrows
                    </span>{" "}
                    <span className='text-gray-300'>to move</span>
                  </p>
                  <p className='flex items-center gap-2'>
                    <span>🔮</span>{" "}
                    <span className='text-purple-400 font-semibold'>
                      SPACEBAR
                    </span>{" "}
                    <span className='text-gray-300'>to cast spells</span>
                  </p>
                  <p className='flex items-center gap-2'>
                    <span>🔄</span>{" "}
                    <span className='text-purple-400 font-semibold'>
                      P or ESC
                    </span>{" "}
                    <span className='text-gray-300'>
                      to pause or resume the game
                    </span>
                  </p>
                  <p className='flex items-center gap-2'>
                    <span>🐉</span>{" "}
                    <span className='text-purple-400 font-semibold'>
                      Defeat creatures
                    </span>{" "}
                    <span className='text-gray-300'>and survive</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Panel - GameUI in vertical layout */}
          <div className='w-80 flex flex-col'>
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
              comboKills={gameStateRef.current?.comboKills}
            />
          </div>
        </div>

        {/* Marketplace - Overlays everything when shown */}
        {gameStateRef.current?.showMarketplace && (
          <div className='absolute inset-0 flex items-center justify-center'>
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
      <div className='absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-purple-500/30' />
      <div className='absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-purple-500/30' />
      <div className='absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-purple-500/30' />
      <div className='absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-purple-500/30' />
    </div>
  );
}
