import { BASE_MAX_HEALTH } from "@/constants/game";
import { useCallback, useState } from "react";
import { useGameTracking } from "./useGameTracking";

export type GameScreen = "home" | "playing" | "gameOver";

export interface GameScreenState {
	currentScreen: GameScreen;
	score: number;
	currentWave: number;
	playerHealth: number;
	playerCoins: number;
	gameOver: boolean;
	gameWon: boolean;
	isLoading: boolean;
	waveMessage: string;
	showScoreModal: boolean;
	showShareModal: boolean;
}

export function useGameScreens() {
	const [screenState, setScreenState] = useState<GameScreenState>({
		currentScreen: "home",
		score: 0,
		currentWave: 0,
		playerHealth: BASE_MAX_HEALTH,
		playerCoins: 0,
		gameOver: false,
		gameWon: false,
		isLoading: false,
		waveMessage: "",
		showScoreModal: false,
		showShareModal: false,
	});

	const gameTracking = useGameTracking();

	const updateScreenState = useCallback((updates: Partial<GameScreenState>) => {
		setScreenState((prev) => ({ ...prev, ...updates }));
	}, []);

	const navigateToHome = useCallback(() => {
		updateScreenState({
			currentScreen: "home",
			showScoreModal: false,
			gameOver: false,
			gameWon: false,
		});
		gameTracking.stopTracking();
	}, [updateScreenState, gameTracking]);

	const navigateToGame = useCallback(() => {
		updateScreenState({
			currentScreen: "playing",
			isLoading: true,
		});
	}, [updateScreenState]);

	const setGameReady = useCallback(
		(initialCrystals = 0) => {
			updateScreenState({
				isLoading: false,
				score: 0,
				currentWave: 0,
				playerHealth: BASE_MAX_HEALTH,
				playerCoins: 0,
				gameOver: false,
				gameWon: false,
				waveMessage: "",
				showScoreModal: false,
			});
			gameTracking.startTracking(initialCrystals);
		},
		[updateScreenState, gameTracking],
	);

	const resetGameState = useCallback(
		(initialCrystals = 0) => {
			updateScreenState({
				score: 0,
				currentWave: 0,
				playerHealth: BASE_MAX_HEALTH,
				playerCoins: 0,
				gameOver: false,
				gameWon: false,
				waveMessage: "",
				showScoreModal: false,
			});
			gameTracking.startTracking(initialCrystals);
		},
		[updateScreenState, gameTracking],
	);

	const setScore = useCallback(
		(score: number) => {
			updateScreenState({ score });
		},
		[updateScreenState],
	);

	const setCurrentWave = useCallback(
		(currentWave: number) => {
			updateScreenState({ currentWave });
		},
		[updateScreenState],
	);

	const setPlayerHealth = useCallback(
		(playerHealth: number) => {
			updateScreenState({ playerHealth });
		},
		[updateScreenState],
	);

	const setPlayerCoins = useCallback(
		(playerCoins: number) => {
			updateScreenState({ playerCoins });
		},
		[updateScreenState],
	);

	const setGameOver = useCallback(
		(gameOver: boolean, currentScore: number) => {
			updateScreenState({ gameOver });
			if (gameOver) {
				gameTracking.stopTracking();
			}
		},
		[updateScreenState, gameTracking],
	);

	const setGameWon = useCallback(
		(gameWon: boolean) => {
			updateScreenState({ gameWon });
			if (gameWon) {
				gameTracking.stopTracking();
			}
		},
		[updateScreenState, gameTracking],
	);

	const setWaveMessage = useCallback(
		(waveMessage: string) => {
			updateScreenState({ waveMessage });
		},
		[updateScreenState],
	);

	const setShowScoreModal = useCallback(
		(showScoreModal: boolean) => {
			updateScreenState({ showScoreModal });
		},
		[updateScreenState],
	);

	const setShowShareModal = useCallback(
		(showShareModal: boolean) => {
			updateScreenState({ showShareModal });
		},
		[updateScreenState],
	);

	return {
		screenState,
		gameTracking,
		updateScreenState,
		navigateToHome,
		navigateToGame,
		setGameReady,
		resetGameState,
		setScore,
		setCurrentWave,
		setPlayerHealth,
		setPlayerCoins,
		setGameOver,
		setGameWon,
		setWaveMessage,
		setShowScoreModal,
		setShowShareModal,
	};
}
