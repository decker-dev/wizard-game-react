"use client";

import { HomeScreen } from "@/components/HomeScreen";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { useRouter } from "next/navigation";
import React from "react";

export default function HomePage() {
	const router = useRouter();
	const {
		topScores,
		allScores,
		totalGamesPlayed,
		isLoading: isLoadingScores,
	} = useLeaderboard();

	const handleStartGame = () => {
		router.push("/game");
	};

	return (
		<HomeScreen
			onStartGame={handleStartGame}
			topScores={topScores}
			allScores={allScores}
			totalGamesPlayed={totalGamesPlayed}
			isLoadingScores={isLoadingScores}
		/>
	);
}
