import type { LeaderboardEntry } from "@/types/game";
import { useState } from "react";

interface LeaderboardProps {
	topScores: LeaderboardEntry[];
	allScores: LeaderboardEntry[];
	totalGamesPlayed: number;
	isLoading: boolean;
}

export function Leaderboard({
	topScores,
	allScores,
	totalGamesPlayed,
	isLoading,
}: LeaderboardProps) {
	const [activeTab, setActiveTab] = useState<"top" | "all">("top");

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("es-ES", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const getMedalIcon = (position: number) => {
		switch (position) {
			case 1:
				return "🥇";
			case 2:
				return "🥈";
			case 3:
				return "🥉";
			default:
				return `#${position}`;
		}
	};

	const currentScores = activeTab === "top" ? topScores : allScores;

	if (isLoading) {
		return (
			<div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
				<h2 className="text-2xl font-bold mb-4 text-center text-purple-600">
					📊 Leaderboard
				</h2>
				<div className="text-center text-gray-400">Loading scores...</div>
			</div>
		);
	}

	return (
		<div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
			<h2 className="text-2xl font-bold text-purple-600 mb-4 text-center">
				📊 Leaderboard
			</h2>

			{/* Tabs */}
			<div className="flex mb-4 bg-gray-700 rounded-lg p-1">
				<button
					type="button"
					onClick={() => setActiveTab("top")}
					className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
						activeTab === "top"
							? "bg-purple-600/80 border-purple-500 text-white scale-10 shadow-purple-500/50"
							: "text-gray-300 hover:text-white"
					}`}
				>
					Top 3
				</button>
				<button
					type="button"
					onClick={() => setActiveTab("all")}
					className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
						activeTab === "all"
							? "bg-purple-600/80 border-purple-500 text-white scale-105 shadow-purple-500/50"
							: "text-gray-300 hover:text-white"
					}`}
				>
					All Scores
				</button>
			</div>

			{/* Leaderboard Content */}
			<div className="max-h-96 overflow-y-auto">
				{currentScores.length === 0 ? (
					<div className="text-center text-gray-400 py-8">
						{activeTab === "top" ? "No scores yet" : "No saved scores"}
					</div>
				) : (
					<div className="space-y-2">
						{currentScores.map((entry, index) => {
							const position = activeTab === "top" ? index + 1 : null;

							return (
								<div
									key={entry.id}
									className={`flex items-center justify-between p-3 rounded-lg ${
										position === 1
											? "bg-yellow-900 border border-yellow-600"
											: position === 2
												? "bg-gray-600 border border-gray-500"
												: position === 3
													? "bg-orange-900 border border-orange-600"
													: "bg-gray-700 border border-gray-600"
									}`}
								>
									<div className="flex items-center space-x-3">
										{position && (
											<div className="text-lg font-bold min-w-[3rem]">
												{getMedalIcon(position)}
											</div>
										)}
										<div>
											<div className="font-semibold text-white">
												{entry.player_name}
											</div>
											<div className="text-sm text-gray-400">
												{formatDate(entry.created_at)}
											</div>
										</div>
									</div>

									<div className="text-right">
										<div className="text-yellow-400 font-bold text-lg">
											{entry.score.toLocaleString()} creatures
										</div>
										<div className="text-blue-400 text-sm">
											Wave {entry.waves_survived}
										</div>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>

			{/* Statistics */}
			{allScores.length > 0 && (
				<div className="mt-4 pt-4 border-t border-gray-600">
					<div className="grid grid-cols-3 gap-4 text-center">
						<div>
							<div className="text-gray-400 text-sm">Total Games</div>
							<div className="text-white font-bold">{totalGamesPlayed}</div>
						</div>
						<div>
							<div className="text-gray-400 text-sm">Best Score</div>
							<div className="text-yellow-400 font-bold">
								{topScores[0]?.score?.toLocaleString() || "0"}
							</div>
						</div>
						<div>
							<div className="text-gray-400 text-sm">Best Wave</div>
							<div className="text-blue-400 font-bold">
								{Math.max(...allScores.map((s) => s.waves_survived)) || 0}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
