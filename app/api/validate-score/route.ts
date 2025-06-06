import { createHash } from "node:crypto";
import { supabase } from "@/lib/supabase";
import { type NextRequest, NextResponse } from "next/server";
import type { GameDataForScoreSubmission } from "@/types/game";

const SECRET_KEY = "mystic-realm-secret-2024-magic-defender";
const MAX_TIME_WINDOW = 5 * 60 * 1000; // 5 minutos

function generateServerTimeWindowHash(
	score: number,
	timestamp: number,
	clientId: string,
	gameData: GameDataForScoreSubmission,
): string {
	const dataToHash = [
		score.toString(),
		timestamp.toString(),
		clientId,
		SECRET_KEY,
		gameData?.wavesSurvived?.toString() || "",
		gameData?.crystalsEarned?.toString() || "",
		gameData?.gameStartTime?.toString() || "",
		gameData?.gameDuration?.toString() || "",
		gameData?.spellLevel?.toString() || "",
		gameData?.healthLevel?.toString() || "",
	].join("|");

	const hash = createHash("sha256").update(dataToHash).digest("hex");

	// Log para debugging
	console.log("🔐 Server hash generation:", {
		dataToHash: dataToHash.replace(SECRET_KEY, "[SECRET]"),
		generatedHash: `${hash.substring(0, 10)}...`,
	});

	return hash;
}

export async function POST(request: NextRequest) {
	const requestStart = Date.now();
	console.log("\n🎯 === SECURE SCORE VALIDATION START ===");

	try {
		const body = await request.json();
		const {
			player_name,
			score,
			waves_survived,
			client_id,
			timestamp,
			time_window_hash,
			game_duration,
			crystals_earned,
			spell_level,
			health_level,
			game_start_time,
		} = body;

		console.log("📋 Received data:", {
			player_name,
			score,
			waves_survived,
			client_id: `${client_id?.substring(0, 8)}...`,
			timestamp: new Date(timestamp).toISOString(),
			time_window_hash: `${time_window_hash?.substring(0, 10)}...`,
			game_duration,
			crystals_earned,
			spell_level,
			health_level,
			game_start_time: new Date(game_start_time).toISOString(),
		});

		// Validación 1: Campos requeridos
		console.log("✅ Step 1: Checking required fields...");
		if (!player_name || !client_id || !time_window_hash) {
			console.log("❌ Missing required fields:", {
				player_name: !!player_name,
				client_id: !!client_id,
				time_window_hash: !!time_window_hash,
			});
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 },
			);
		}
		console.log("✅ All required fields present");

		// Validación 2: Tiempo
		console.log("✅ Step 2: Checking time window...");
		const now = Date.now();
		const timeDiff = now - timestamp;
		console.log("⏰ Time check:", {
			now: new Date(now).toISOString(),
			timestamp: new Date(timestamp).toISOString(),
			difference: `${Math.floor(timeDiff / 1000)}s`,
			maxAllowed: `${MAX_TIME_WINDOW / 1000}s`,
			isValid: timeDiff <= MAX_TIME_WINDOW,
		});

		if (timeDiff > MAX_TIME_WINDOW) {
			console.log("❌ Score too old");
			return NextResponse.json({ error: "Score too old" }, { status: 400 });
		}
		console.log("✅ Time window valid");

		// Validación 3: Token de cliente válido
		console.log("✅ Step 3: Validating client token...");
		const expectedTokenData = `${score}_${timestamp}_${client_id.substring(0, 8)}`;
		const expectedToken = `client_token_${Buffer.from(expectedTokenData).toString("base64")}`;
		const tokenValid = time_window_hash === expectedToken;

		console.log("🔐 Token validation:", {
			received: `${time_window_hash?.substring(0, 15)}...`,
			expected: `${expectedToken.substring(0, 15)}...`,
			tokenValid,
		});

		if (!tokenValid) {
			console.log("❌ Invalid client token");
			return NextResponse.json(
				{ error: "Invalid client token" },
				{ status: 403 },
			);
		}
		console.log("✅ Client token valid");

		// Validación 4: Generar hash de seguridad del servidor
		console.log("✅ Step 4: Generating server security hash...");
		const gameData: GameDataForScoreSubmission = {
			wavesSurvived: waves_survived,
			crystalsEarned: crystals_earned,
			gameStartTime: game_start_time,
			gameDuration: game_duration,
			spellLevel: spell_level,
			healthLevel: health_level,
		};

		const serverHash = generateServerTimeWindowHash(
			score,
			timestamp,
			client_id,
			gameData,
		);
		console.log("🔐 Server hash generated for audit trail");

		// Validación 5: Lógica del juego - Score realista
		console.log("✅ Step 5: Checking score logic...");
		const avgCreaturesPerWave = 5 + waves_survived * 3;
		const maxPossibleScore = avgCreaturesPerWave * waves_survived * 1.5;
		const scoreValid = score <= maxPossibleScore;

		console.log("🎯 Score validation:", {
			actualScore: score,
			avgCreaturesPerWave,
			maxPossibleScore,
			isValid: scoreValid,
		});

		if (!scoreValid) {
			console.log("❌ Impossible score for waves survived");
			return NextResponse.json(
				{ error: "Impossible score for waves survived" },
				{ status: 400 },
			);
		}
		console.log("✅ Score is realistic");

		// Validación 6: Duración mínima del juego
		console.log("✅ Step 6: Checking game duration...");
		const minGameDuration = waves_survived * 15 * 1000; // 15 seg por wave mínimo
		const durationValid = game_duration >= minGameDuration;

		console.log("⏱️ Duration validation:", {
			actualDuration: `${Math.floor(game_duration / 1000)}s`,
			minRequired: `${Math.floor(minGameDuration / 1000)}s`,
			isValid: durationValid,
		});

		if (!durationValid) {
			console.log("❌ Game completed too fast");
			return NextResponse.json(
				{ error: "Game completed too fast" },
				{ status: 400 },
			);
		}
		console.log("✅ Game duration valid");

		// Validación 7: Rate limiting por client_id
		console.log("✅ Step 7: Checking rate limiting...");
		const { data: recentSubmissions } = await supabase
			.from("score_submissions")
			.select("*")
			.eq("client_id", client_id)
			.gte("submitted_at", new Date(now - 60000).toISOString());

		console.log("🚦 Rate limit check:", {
			clientId: `${client_id.substring(0, 8)}...`,
			recentSubmissions: recentSubmissions?.length || 0,
			limit: 3,
		});

		if (recentSubmissions && recentSubmissions.length >= 3) {
			console.log("❌ Rate limit exceeded");
			return NextResponse.json(
				{ error: "Too many submissions. Please wait." },
				{ status: 429 },
			);
		}
		console.log("✅ Rate limit OK");

		// Si pasa todas las validaciones, guardar el score
		console.log("💾 Saving score to database...");
		const { error: scoreError } = await supabase.from("leaderboard").insert({
			player_name,
			score,
			waves_survived,
			created_at: new Date(timestamp).toISOString(),
		});

		if (scoreError) {
			console.error("❌ Database error:", scoreError);
			return NextResponse.json(
				{ error: "Failed to save score" },
				{ status: 500 },
			);
		}
		console.log("✅ Score saved to leaderboard");

		// Registrar la submission para rate limiting
		console.log("📝 Recording submission for rate limiting...");
		const { error: submissionError } = await supabase
			.from("score_submissions")
			.insert({
				client_id,
				ip_address: request.headers.get("x-forwarded-for"),
				user_agent: request.headers.get("user-agent"),
			});

		if (submissionError) {
			console.error("⚠️ Warning: Failed to record submission:", submissionError);
		} else {
			console.log("✅ Submission recorded");
		}

		const processingTime = Date.now() - requestStart;
		console.log(`🎉 SUCCESS! Score validated and saved in ${processingTime}ms`);
		console.log("🎯 === SECURE SCORE VALIDATION END ===\n");

		return NextResponse.json({
			success: true,
			message: "Score saved successfully",
			processingTime,
			serverHash: `${serverHash.substring(0, 10)}...`, // Para debugging
		});
	} catch (error) {
		console.error("💥 Server error:", error);
		console.log("🎯 === SECURE SCORE VALIDATION FAILED ===\n");
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
