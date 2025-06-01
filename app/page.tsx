"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useGameState } from '@/hooks/useGameState'
import { useAssetLoader } from '@/hooks/useAssetLoader'
import { useInputHandlers } from '@/hooks/useInputHandlers'
import { useLeaderboard } from '@/hooks/useLeaderboard'
import { useGameAudio } from '@/hooks/useGameAudio'
import { GameCanvas } from '@/components/GameCanvas'
import { GameUI } from '@/components/GameUI'
import { HomeScreen } from '@/components/HomeScreen'
import { ScoreSubmissionModal } from '@/components/ScoreSubmissionModal'
import { Marketplace } from '@/components/Marketplace'
import { FloatingParticles } from '@/components/FloatingParticles'
import { CoinIcon } from '@/components/CoinIcon'
import { ShareModal } from '@/components/ShareModal'
import useHandheldDetector from "@/hooks/useHandheldDetector"

type GameScreen = 'home' | 'playing' | 'gameOver'

export default function BoxheadGame() {
  const {
    gameStateRef,
    initializeGameState,
    resetGameState,
    startNextWave,
    continueFromMarketplace,
    upgradeWeapon,
    upgradeHealth
  } = useGameState()
  const { loadAssets, zombieSpritesRef, playerSpritesRef, floorTextureRef } = useAssetLoader()
  const { 
    topScores, 
    allScores, 
    isLoading: isLoadingScores, 
    isSubmitting, 
    submitScore 
  } = useLeaderboard()
  const { playZombieDeath, playPlayerShoot, playPlayerHit } = useGameAudio()
  
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('home')
  const [score, setScore] = useState(0)
  const [currentWave, setCurrentWave] = useState(0)
  const [playerHealth, setPlayerHealth] = useState(100)
  const [playerCoins, setPlayerCoins] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [waveMessage, setWaveMessage] = useState("")
  const [showScoreModal, setShowScoreModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)

  const isMobile = useHandheldDetector()

  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  const { handleKeyDown, handleKeyUp, handleMouseMove, handleMouseClick } = useInputHandlers(gameStateRef, playPlayerShoot)

  const handleStartNextWave = useCallback(() => {
    startNextWave(setCurrentWave, setWaveMessage, setGameWon)
  }, [startNextWave])

  const handleMouseMoveWrapper = useCallback((e: MouseEvent) => {
    handleMouseMove(e, canvasRef)
  }, [handleMouseMove])

  const handleKeyDownWrapper = useCallback((e: KeyboardEvent) => {
    const gameState = gameStateRef.current
    handleKeyDown(e, isLoading, gameState?.waveTransitioning || false)
  }, [handleKeyDown, isLoading, gameStateRef])

  const startGame = useCallback(async () => {
    setIsLoading(true)
    setCurrentScreen('playing')
    
    try {
      const { playerSprites } = await loadAssets()
      const gameState = initializeGameState(playerSprites)
      
      // Reset all game state
      setScore(0)
      setCurrentWave(0)
      setPlayerHealth(100)
      setPlayerCoins(0)
      setGameOver(false)
      setGameWon(false)
      setWaveMessage("")
      setShowScoreModal(false)
      
      setIsLoading(false)
      handleStartNextWave()
    } catch (error) {
      console.error("Failed to load game assets:", error)
      setIsLoading(false)
      setCurrentScreen('home')
    }
  }, [loadAssets, initializeGameState, handleStartNextWave])

  const returnToHome = useCallback(() => {
    setCurrentScreen('home')
    setShowScoreModal(false)
    setGameOver(false)
    setGameWon(false)
  }, [])

  const resetGame = useCallback(() => {
    const gameState = resetGameState(playerSpritesRef.current)
    setScore(0)
    setCurrentWave(0)
    setPlayerHealth(100)
    setPlayerCoins(0)
    setGameOver(false)
    setGameWon(false)
    setWaveMessage("")
    setShowScoreModal(false)
    handleStartNextWave()
  }, [resetGameState, playerSpritesRef, handleStartNextWave])

  const handleScoreSubmit = useCallback(async (scoreData: any) => {
    const success = await submitScore(scoreData)
    if (success) {
      setTimeout(() => {
        setShowScoreModal(false)
        returnToHome()
      }, 1000)
    }
    return success
  }, [submitScore, returnToHome])

  const handleSkipScore = useCallback(() => {
    setShowScoreModal(false)
    returnToHome()
  }, [returnToHome])

  const handleUpgradeWeapon = useCallback(() => {
    upgradeWeapon(setPlayerCoins)
  }, [upgradeWeapon])

  const handleUpgradeHealth = useCallback(() => {
    upgradeHealth(setPlayerCoins, setPlayerHealth)
  }, [upgradeHealth])

  const handleContinueFromMarketplace = useCallback(() => {
    continueFromMarketplace(setWaveMessage)
  }, [continueFromMarketplace])

  // Manejar cuando el juego termina
  useEffect(() => {
    if ((gameOver || gameWon) && currentScreen === 'playing') {
      // Mostrar modal de score después de un breve delay
      const timer = setTimeout(() => {
        setShowScoreModal(true)
      }, 2000)
      
      return () => clearTimeout(timer)
    }
  }, [gameOver, gameWon, currentScreen])

  useEffect(() => {
    if (isMobile) {
     window.location.href = "https://fork-game-jam-paisanos-pvh5o34m1-alejorrojas-projects.vercel.app/"
    }
  }, [isMobile])

  useEffect(() => {
    if (currentScreen === 'playing') {
      window.addEventListener("keydown", handleKeyDownWrapper)
      window.addEventListener("keyup", handleKeyUp)
      
      return () => {
        window.removeEventListener("keydown", handleKeyDownWrapper)
        window.removeEventListener("keyup", handleKeyUp)
      }
    }
  }, [handleKeyDownWrapper, handleKeyUp, currentScreen])
  

  // Home Screen
  if (currentScreen === 'home') {
    return (
      <HomeScreen
        onStartGame={startGame}
        topScores={topScores}
        allScores={allScores}
        isLoadingScores={isLoadingScores}
      />
    )
  }

  // Loading Screen
  if (isLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        {/* Animated Background Elements - Same as HomeScreen */}
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

        {/* Loading Content */}
        <div className="relative z-10 text-center">
          <div className="bg-black/60 backdrop-blur-sm border border-orange-500/30 rounded-lg p-8 hover:border-orange-500/50 transition-colors">
            <h2 className="text-4xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-b from-orange-400 to-red-600 mb-6">
              LOADING
            </h2>
            <div className="text-gray-300 font-mono text-xl mb-6">
              Cargando assets del juego...
            </div>

            {/* Loading animation */}
            <div className="flex justify-center space-x-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 200}ms` }}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Corner decorative elements */}
        <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-orange-500/30"></div>
        <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-orange-500/30"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-orange-500/30"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-orange-500/30"></div>
      </div>
    )
  }

  // Game Screen
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Animated Background Elements - Same as HomeScreen */}
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

      {/* Game Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">


        <div className="relative shadow-2xl">
          {/* Game Canvas Container with apocalyptic styling */}
          <div className="bg-black/40 backdrop-blur-sm border border-orange-500/50 rounded-lg p-4 hover:border-orange-500/70 transition-colors">
            <GameCanvas
              gameState={gameStateRef.current}
              zombieSprites={zombieSpritesRef.current}
              floorTexture={floorTextureRef.current}
              waveMessage={waveMessage}
              startNextWave={handleStartNextWave}
              setScore={setScore}
              setPlayerHealth={setPlayerHealth}
              setPlayerCoins={setPlayerCoins}
              setGameOver={setGameOver}
              onMouseMove={handleMouseMoveWrapper}
              onMouseClick={handleMouseClick}
              playZombieDeath={playZombieDeath}
              playPlayerShoot={playPlayerShoot}
              playPlayerHit={playPlayerHit}
            />
          </div>

          {/* Game Over/Won Overlay */}
          {(gameOver || gameWon) && (
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
                      onClick={resetGame}
                      className="px-8 py-4 bg-red-600/80 hover:bg-red-600 border border-red-500/50 text-white font-mono font-bold rounded-lg text-xl transition-all duration-200 transform hover:scale-105 hover:border-red-500"
                    >
                      JUGAR DE NUEVO
                    </button>
                    <button
                      onClick={returnToHome}
                      className="px-8 py-4 bg-orange-600/80 hover:bg-orange-600 border border-orange-500/50 text-white font-mono font-bold rounded-lg text-xl transition-all duration-200 transform hover:scale-105 hover:border-orange-500"
                    >
                      VOLVER AL INICIO
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <GameUI
          score={score}
          currentWave={currentWave}
          playerHealth={playerHealth}
          playerCoins={playerCoins}
          gameOver={gameOver}
          gameWon={gameWon}
          onResetGame={resetGame}
          onReturnHome={returnToHome}
          onShare={() => setShowShareModal(true)}
          player={gameStateRef.current?.player}
        /> 

        {/* Score Submission Modal */}
        <ScoreSubmissionModal
          score={score}
          wavesSurvived={currentWave}
          isVisible={showScoreModal}
          onSubmit={handleScoreSubmit}
          onSkip={handleSkipScore}
          isSubmitting={isSubmitting}
        />

        {/* Marketplace */}
        {gameStateRef.current?.showMarketplace && (
          <Marketplace
            player={gameStateRef.current.player}
            onUpgradeWeapon={handleUpgradeWeapon}
            onUpgradeHealth={handleUpgradeHealth}
            onContinue={handleContinueFromMarketplace}
          />
        )}

        {/* Share Modal */}
        <ShareModal
          isVisible={showShareModal}
          onClose={() => setShowShareModal(false)}
        />
      </div>

      {/* Corner decorative elements - Same as HomeScreen */}
      <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-orange-500/30"></div>
      <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-orange-500/30"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-orange-500/30"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-orange-500/30"></div>

      {/* Animated HUD Elements */}
      <div className="absolute top-4 right-4 space-y-2">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`w-8 h-2 bg-orange-500/20 rounded animate-pulse`}
            style={{ animationDelay: `${i * 200}ms` }}
          ></div>
        ))}
      </div>
    </div>
  )
} 