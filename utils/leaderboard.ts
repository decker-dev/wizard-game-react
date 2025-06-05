import { supabase } from "@/lib/supabase";
import { type LeaderboardEntry, ScoreSubmission } from "@/types/game";

/**
 * Obtiene el top 10 de scores del leaderboard
 */
export async function getTopScores(): Promise<LeaderboardEntry[]> {
	try {
		const { data, error } = await supabase
			.from("leaderboard")
			.select("*")
			.order("score", { ascending: false })
			.limit(3);

		if (error) {
			console.error("Error fetching top scores:", error);
			return [];
		}

		return data || [];
	} catch (error) {
		console.error("Error fetching top scores:", error);
		return [];
	}
}

/**
 * Obtiene todos los scores ordenados por fecha (más recientes primero)
 */
export async function getAllScores(): Promise<LeaderboardEntry[]> {
	try {
		const { data, error } = await supabase
			.from("leaderboard")
			.select("*")
			.order("created_at", { ascending: false });

		if (error) {
			console.error("Error fetching all scores:", error);
			return [];
		}

		return data || [];
	} catch (error) {
		console.error("Error fetching all scores:", error);
		return [];
	}
}

/**
 * Registra que se inició una nueva partida (independientemente de si se guarda el score)
 */
export async function recordGameStarted(): Promise<boolean> {
	try {
		// Intentar crear o incrementar el contador global de partidas
		const { data: existingRecord, error: fetchError } = await supabase
			.from("game_stats")
			.select("total_games_played")
			.eq("stat_type", "global")
			.single();

		if (fetchError && fetchError.code !== "PGRST116") {
			// Error diferente a "no se encontró registro"
			console.error("Error fetching game stats:", fetchError);
			return false;
		}

		if (existingRecord) {
			// Incrementar el contador existente
			const { error: updateError } = await supabase
				.from("game_stats")
				.update({
					total_games_played: existingRecord.total_games_played + 1,
					updated_at: new Date().toISOString(),
				})
				.eq("stat_type", "global");

			if (updateError) {
				console.error("Error updating game stats:", updateError);
				return false;
			}
		} else {
			// Crear el primer registro
			const { error: insertError } = await supabase.from("game_stats").insert([
				{
					stat_type: "global",
					total_games_played: 1,
					created_at: new Date().toISOString(),
					updated_at: new Date().toISOString(),
				},
			]);

			if (insertError) {
				console.error("Error creating game stats:", insertError);
				return false;
			}
		}

		return true;
	} catch (error) {
		console.error("Error recording game started:", error);
		return false;
	}
}

/**
 * Obtiene el total de partidas jugadas (iniciadas)
 */
export async function getTotalGamesPlayed(): Promise<number> {
	try {
		const { data, error } = await supabase
			.from("game_stats")
			.select("total_games_played")
			.eq("stat_type", "global")
			.single();

		if (error) {
			if (error.code === "PGRST116") {
				// No hay registros aún, retornar 0
				return 0;
			}
			console.error("Error fetching total games played:", error);
			return 0;
		}

		return data?.total_games_played || 0;
	} catch (error) {
		console.error("Error fetching total games played:", error);
		return 0;
	}
}

/**
 * Obtiene la posición de un score en el ranking
 */
export async function getScoreRank(score: number): Promise<number> {
	try {
		const { count, error } = await supabase
			.from("leaderboard")
			.select("*", { count: "exact", head: true })
			.gt("score", score);

		if (error) {
			console.error("Error getting score rank:", error);
			return 0;
		}

		return (count || 0) + 1;
	} catch (error) {
		console.error("Error getting score rank:", error);
		return 0;
	}
}
