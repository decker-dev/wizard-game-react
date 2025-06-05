import { generateClientId } from "@/utils/security";
import { useCallback, useRef, useState } from "react";

export function useGameTracking() {
	const [gameStartTime, setGameStartTime] = useState<number>(0);
	const [clientId] = useState<string>(() => generateClientId());
	const [initialCrystals, setInitialCrystals] = useState<number>(0);
	const gameActive = useRef<boolean>(false);

	const startTracking = useCallback((playerCrystals: number) => {
		setGameStartTime(Date.now());
		setInitialCrystals(playerCrystals);
		gameActive.current = true;
	}, []);

	const stopTracking = useCallback(() => {
		gameActive.current = false;
	}, []);

	const getGameData = useCallback(
		(
			score: number,
			wavesSurvived: number,
			playerCrystals: number,
			spellLevel: number,
			healthLevel: number,
		) => {
			const timestamp = Date.now();
			const gameDuration = timestamp - gameStartTime;
			const crystalsEarned = playerCrystals - initialCrystals;

			return {
				timestamp,
				gameDuration,
				crystalsEarned,
				gameData: {
					wavesSurvived,
					crystalsEarned,
					gameStartTime,
					gameDuration,
					spellLevel,
					healthLevel,
				},
			};
		},
		[gameStartTime, initialCrystals],
	);

	return {
		clientId,
		gameStartTime,
		gameActive: gameActive.current,
		startTracking,
		stopTracking,
		getGameData,
	};
}
