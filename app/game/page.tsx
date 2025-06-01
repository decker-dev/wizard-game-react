"use client"

import React from "react"
import { useGameController } from '@/hooks/useGameController'
import { useGameEffects } from '@/hooks/useGameEffects'
import { LoadingScreen } from '@/components/LoadingScreen'
import { GameScreen } from '@/components/GameScreen'
import { ScoreSubmissionModal } from '@/components/ScoreSubmissionModal'
import { ShareModal } from '@/components/ShareModal'
import { useRouter } from 'next/navigation'

export default function GamePage() {
  const router = useRouter()
  const gameController = useGameController(true) // Auto-start the game
  
  const {
    screenState,
    isSubmitting,
    handleKeyDownWrapper,
    handleKeyUp,
    setShowShareModal,
    handleScoreSubmit,
    handleSkipScore,
    handleSaveScore
  } = gameController

  // Override the navigateToHome to use router
  const handleReturnHome = () => {
    router.push('/')
  }

  // Handle effects
  useGameEffects({
    screenState,
    handleKeyDownWrapper,
    handleKeyUp
  })

  // Loading Screen
  if (screenState.isLoading) {
    return <LoadingScreen />
  }

  // Game Screen
  return (
    <>
      <GameScreen
        screenState={screenState}
        gameStateRef={gameController.gameStateRef}
        canvasRef={gameController.canvasRef}
        creatureSpritesRef={gameController.creatureSpritesRef}
        floorTextureRef={gameController.floorTextureRef}
        playCreatureDeath={gameController.playCreatureDeath}
        playPlayerCast={gameController.playPlayerCast}
        playPlayerHit={gameController.playPlayerHit}
        onMouseMove={gameController.handleMouseMoveWrapper}
        onMouseClick={gameController.handleMouseClick}
        onStartNextWave={gameController.handleStartNextWave}
        setScore={gameController.setScore}
        setPlayerHealth={gameController.setPlayerHealth}
        setPlayerCoins={gameController.setPlayerCoins}
        setGameOver={gameController.setGameOver}
        onResetGame={gameController.resetGame}
        onReturnHome={handleReturnHome}
        onShare={() => setShowShareModal(true)}
        onSaveScore={handleSaveScore}
        onUpgradeWeapon={gameController.handleUpgradeWeapon}
        onUpgradeHealth={gameController.handleUpgradeHealth}
        onContinueFromMarketplace={gameController.handleContinueFromMarketplace}
      />

      {/* Score Submission Modal */}
      <ScoreSubmissionModal
        score={screenState.score}
        wavesSurvived={screenState.currentWave}
        isVisible={screenState.showScoreModal}
        onSubmit={handleScoreSubmit}
        onSkip={handleSkipScore}
        isSubmitting={isSubmitting}
      />

      {/* Share Modal */}
      <ShareModal
        isVisible={screenState.showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </>
  )
} 