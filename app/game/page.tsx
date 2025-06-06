"use client";

import { GameScreen } from "@/components/GameScreen";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ScoreSubmissionModal } from "@/components/ScoreSubmissionModal";
import { ShareModal } from "@/components/ShareModal";
import { useGameController } from "@/hooks/useGameController";
import { useGameEffects } from "@/hooks/useGameEffects";
import { useRouter } from "next/navigation";
import React from "react";

export default function GamePage() {
	const router = useRouter();
	const gameController = useGameController(true); // Auto-start the game

	const {
		screenState,
		gameTracking,
		isSubmitting,
		handleKeyDownWrapper,
		handleKeyUp,
		setShowShareModal,
		handleScoreSubmit,
		handleSkipScore,
		handleSaveScore,
	} = gameController;

	// Override the navigateToHome to use router
	const handleReturnHome = () => {
		router.push("/");
	};

	// Handle effects
	useGameEffects({
		screenState,
		handleKeyDownWrapper,
		handleKeyUp,
	});

	// Loading Screen
	if (screenState.isLoading) {
		return <LoadingScreen />;
	}

	// Calculate crystals earned for security
	const player = gameController.gameStateRef.current?.player;
	const crystalsEarned = player
		? player.crystals - (gameTracking.gameStartTime > 0 ? 0 : player.crystals)
		: 0;

	// Game Screen
	return (
		<>
			<GameScreen
				screenState={screenState}
				gameStateRef={gameController.gameStateRef}
				canvasRef={gameController.canvasRef}
				creatureSpritesRef={gameController.creatureSpritesRef}
				floorTextureRef={gameController.floorTextureRef}
				healthPackSpriteRef={gameController.healthPackSpriteRef}
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
				isFullscreen={gameController.isFullscreen}
			/>

			{/* Score Submission Modal with secure props */}
			{player && (
				<ScoreSubmissionModal
					score={screenState.score}
					wavesSurvived={screenState.currentWave}
					isVisible={screenState.showScoreModal}
					onSubmit={handleScoreSubmit}
					onSkip={handleSkipScore}
					isSubmitting={isSubmitting}
					clientId={gameTracking.clientId}
					player={player}
					gameStartTime={gameTracking.gameStartTime}
					crystalsEarned={crystalsEarned}
				/>
			)}

			{/* Share Modal */}
			<ShareModal
				isVisible={screenState.showShareModal}
				onClose={() => setShowShareModal(false)}
			/>
		</>
	);
}
