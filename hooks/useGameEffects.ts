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
	// Handle keyboard events for playing screen
	useEffect(() => {
		if (screenState.currentScreen === "playing") {
			window.addEventListener("keydown", handleKeyDownWrapper);
			window.addEventListener("keyup", handleKeyUp);

			return () => {
				window.removeEventListener("keydown", handleKeyDownWrapper);
				window.removeEventListener("keyup", handleKeyUp);
			};
		}
	}, [handleKeyDownWrapper, handleKeyUp, screenState.currentScreen]);
}
