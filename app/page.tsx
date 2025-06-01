"use client"

import React from "react"
import { useGameController } from '@/hooks/useGameController'
import { useGameEffects } from '@/hooks/useGameEffects'
import { HomeScreen } from '@/components/HomeScreen'
import { LoadingScreen } from '@/components/LoadingScreen'
import { GameScreen } from '@/components/GameScreen'
import { ScoreSubmissionModal } from '@/components/ScoreSubmissionModal'
import { ShareModal } from '@/components/ShareModal'

export default function BoxheadGame() {
  const gameController = useGameController()
  
  const {
    screenState,
    topScores,
    allScores,
    isLoadingScores,
    isSubmitting,
    startGame,
    handleKeyDownWrapper,
    handleKeyUp,
    setShowShareModal,
    setShowScoreModal,
    handleScoreSubmit,
    handleSkipScore
  } = gameController

  // Handle effects
  useGameEffects({
    screenState,
    handleKeyDownWrapper,
    handleKeyUp,
    setShowScoreModal
  })

  // Home Screen
  if (screenState.currentScreen === 'home') {
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
        zombieSpritesRef={gameController.zombieSpritesRef}
        floorTextureRef={gameController.floorTextureRef}
        playZombieDeath={gameController.playZombieDeath}
        playPlayerShoot={gameController.playPlayerShoot}
        playPlayerHit={gameController.playPlayerHit}
        onMouseMove={gameController.handleMouseMoveWrapper}
        onMouseClick={gameController.handleMouseClick}
        onStartNextWave={gameController.handleStartNextWave}
        setScore={gameController.setScore}
        setPlayerHealth={gameController.setPlayerHealth}
        setPlayerCoins={gameController.setPlayerCoins}
        setGameOver={gameController.setGameOver}
        onResetGame={gameController.resetGame}
        onReturnHome={gameController.navigateToHome}
        onShare={() => setShowShareModal(true)}
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