import type { LeaderboardEntry, ScoreSubmission, GameDataForScoreSubmission } from "@/types/game";
import {
	getAllScores,
	getScoreRank,
	getTopScores,
	getTotalGamesPlayed,
	recordGameStarted,
} from "@/utils/leaderboard";
import { generateTimeWindowHash } from "@/utils/security";
import { useCallback, useEffect, useState } from "react";

export interface SecureScoreSubmission extends ScoreSubmission {
	client_id: string;
	timestamp: number;
	time_window_hash: string;
	game_duration: number;
	crystals_earned: number;
	spell_level: number;
	health_level: number;
	game_start_time: number;
}

export function useLeaderboard() {
	const [topScores, setTopScores] = useState<LeaderboardEntry[]>([]);
	const [allScores, setAllScores] = useState<LeaderboardEntry[]>([]);
	const [totalGamesPlayed, setTotalGamesPlayed] = useState<number>(0);
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Cargar top scores
	const loadTopScores = useCallback(async () => {
		setIsLoading(true);
		try {
			const scores = await getTopScores();
			setTopScores(scores);
		} catch (error) {
			console.error("Error loading top scores:", error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	// Cargar todos los scores
	const loadAllScores = useCallback(async () => {
		setIsLoading(true);
		try {
			const scores = await getAllScores();
			setAllScores(scores);
		} catch (error) {
			console.error("Error loading all scores:", error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	// Cargar total de partidas jugadas
	const loadTotalGamesPlayed = useCallback(async () => {
		try {
			const total = await getTotalGamesPlayed();
			setTotalGamesPlayed(total);
		} catch (error) {
			console.error("Error loading total games played:", error);
		}
	}, []);

	// Enviar score seguro (función principal)
	const submitSecureScore = useCallback(
		async (
			scoreData: ScoreSubmission,
			clientId: string,
			gameData: GameDataForScoreSubmission,
		): Promise<boolean> => {
			console.log("🔮 === SECURE SCORE SUBMISSION START ===");
			console.log("📤 Submitting secure score:", {
				player: scoreData.player_name,
				score: scoreData.score,
				waves: scoreData.waves_survived,
				clientId: `${clientId.substring(0, 8)}...`,
				gameData,
			});

			setIsSubmitting(true);
			try {
				const timestamp = Date.now();

				const timeWindowHash = await generateTimeWindowHash(
					scoreData.score,
					timestamp,
					clientId,
					gameData,
				);

				const securePayload: SecureScoreSubmission = {
					...scoreData,
					client_id: clientId,
					timestamp,
					time_window_hash: timeWindowHash,
					game_duration: gameData.gameDuration,
					crystals_earned: gameData.crystalsEarned,
					spell_level: gameData.spellLevel,
					health_level: gameData.healthLevel,
					game_start_time: gameData.gameStartTime,
				};

				console.log("🔐 Payload prepared:", {
					timestamp: new Date(timestamp).toISOString(),
					hash: `${timeWindowHash.substring(0, 10)}...`,
					payloadSize: JSON.stringify(securePayload).length,
				});

				// Enviar al API route de Next.js
				console.log("📡 Sending to /api/validate-score...");
				const response = await fetch("/api/validate-score", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(securePayload),
				});

				const responseData = await response.json();
				console.log("📬 Server response:", {
					status: response.status,
					ok: response.ok,
					data: responseData,
				});

				const success = response.ok;
				if (success) {
					console.log("✅ Score accepted! Refreshing leaderboard...");
					await loadTopScores();
					await loadAllScores();
				} else {
					console.log("❌ Score rejected:", responseData.error);
				}

				console.log("🔮 === SECURE SCORE SUBMISSION END ===\n");
				return success;
			} catch (error) {
				console.error("💥 Error submitting secure score:", error);
				console.log("🔮 === SECURE SCORE SUBMISSION FAILED ===\n");
				return false;
			} finally {
				setIsSubmitting(false);
			}
		},
		[loadTopScores, loadAllScores],
	);

	// Registrar nueva partida iniciada
	const recordNewGame = useCallback(async (): Promise<boolean> => {
		try {
			const success = await recordGameStarted();
			if (success) {
				// Actualizar el contador local
				await loadTotalGamesPlayed();
			}
			return success;
		} catch (error) {
			console.error("Error recording new game:", error);
			return false;
		}
	}, [loadTotalGamesPlayed]);

	// Obtener ranking de un score
	const getRankForScore = useCallback(
		async (score: number): Promise<number> => {
			try {
				return await getScoreRank(score);
			} catch (error) {
				console.error("Error getting score rank:", error);
				return 0;
			}
		},
		[],
	);

	// Cargar datos iniciales
	useEffect(() => {
		loadTopScores();
		loadAllScores();
		loadTotalGamesPlayed();
	}, [loadTopScores, loadAllScores, loadTotalGamesPlayed]);

	return {
		topScores,
		allScores,
		totalGamesPlayed,
		isLoading,
		isSubmitting,
		loadTopScores,
		loadAllScores,
		loadTotalGamesPlayed,
		submitSecureScore,
		recordNewGame,
		getRankForScore,
	};
}
