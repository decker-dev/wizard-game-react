import useHandheldDetector from "@/hooks/useHandheldDetector";
import { useEffect } from "react";
import type { GameScreenState } from "./useGameScreens";

interface UseGameEffectsProps {
	screenState: GameScreenState;
	handleKeyDownWrapper: (e: KeyboardEvent) => void;
	handleKeyUp: (e: KeyboardEvent) => void;
}

export function useGameEffects({
	screenState,
	handleKeyDownWrapper,
	handleKeyUp,
}: UseGameEffectsProps) {
	// Handle keyboard events only when actively playing (includes paused state for pause/unpause functionality)
	useEffect(() => {
		const isActivelyPlaying =
			screenState.currentScreen === "playing" &&
			!screenState.gameOver &&
			!screenState.gameWon &&
			!screenState.showScoreModal;

		if (isActivelyPlaying) {
			window.addEventListener("keydown", handleKeyDownWrapper);
			window.addEventListener("keyup", handleKeyUp);

			return () => {
				window.removeEventListener("keydown", handleKeyDownWrapper);
				window.removeEventListener("keyup", handleKeyUp);
			};
		}
	}, [
		handleKeyDownWrapper,
		handleKeyUp,
		screenState.currentScreen,
		screenState.gameOver,
		screenState.gameWon,
		screenState.showScoreModal
	]);
}
