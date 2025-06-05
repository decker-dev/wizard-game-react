import type { Player } from "@/types/game";
import type React from "react";
import { CoinIcon } from "./CoinIcon";

interface GameUIProps {
	score: number;
	currentWave: number;
	playerHealth: number;
	playerCoins: number;
	gameOver: boolean;
	gameWon: boolean;
	onResetGame: () => void;
	onReturnHome?: () => void;
	onShare?: () => void;
	player?: Player;
}

export const GameUI: React.FC<GameUIProps> = ({
	score,
	currentWave,
	playerHealth,
	playerCoins,
	gameOver,
	gameWon,
	onResetGame,
	onReturnHome,
	onShare,
	player,
}) => {
	// Use player.health if available, otherwise fall back to playerHealth
	const currentHealth = player?.health ?? playerHealth;
	const maxHealth = player?.maxHealth ?? 100;

	return (
		<div className="space-y-4">
			{/* Game Title Header */}
			<div className="bg-black/60 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4 hover:border-purple-500/50 transition-colors">
				<h1 className="text-2xl font-bold font-pixel text-transparent bg-clip-text bg-gradient-to-b from-purple-400 to-blue-600 text-center mb-2">
					MYSTIC REALM
				</h1>
				<div className="text-center text-gray-400 font-mono text-xs">
					∞ Arcane Defense ∞
				</div>
			</div>

			{/* Stats - Vertical Layout */}
			<div className="space-y-3">
				{/* Score */}
				<div className="bg-black/60 backdrop-blur-sm border border-purple-500/20 rounded-lg p-4 hover:border-purple-500/40 transition-colors">
					<div className="flex items-center justify-between">
						<div>
							<div className="text-purple-400 text-sm font-mono">SCORE</div>
							<div className="text-3xl font-bold text-white font-mono">
								{score}
							</div>
						</div>
						<div className="text-4xl">⚔️</div>
					</div>
				</div>

				{/* Wave */}
				<div className="bg-black/60 backdrop-blur-sm border border-purple-500/20 rounded-lg p-4 hover:border-purple-500/40 transition-colors">
					<div className="flex items-center justify-between">
						<div>
							<div className="text-purple-400 text-sm font-mono">WAVE</div>
							<div className="text-3xl font-bold text-white font-mono">
								{currentWave}
							</div>
						</div>
						<div className="text-4xl">🌊</div>
					</div>
				</div>

				{/* Health */}
				<div className="bg-black/60 backdrop-blur-sm border border-purple-500/20 rounded-lg p-4 hover:border-purple-500/40 transition-colors">
					<div className="flex items-center justify-between">
						<div>
							<div className="text-purple-400 text-sm font-mono">HEALTH</div>
							<div className="text-2xl font-bold font-mono">
								<span
									className={
										currentHealth > maxHealth * 0.5
											? "text-green-400"
											: currentHealth > maxHealth * 0.25
												? "text-yellow-400"
												: "text-red-400"
									}
								>
									{Math.round(currentHealth)}
								</span>
								<span className="text-gray-400">/{maxHealth}</span>
							</div>
							{/* Health Bar */}
							<div className="w-full bg-gray-700 rounded-full h-2 mt-2">
								<div
									className={`h-2 rounded-full transition-all duration-300 ${
										currentHealth > maxHealth * 0.5
											? "bg-green-400"
											: currentHealth > maxHealth * 0.25
												? "bg-yellow-400"
												: "bg-red-400"
									}`}
									style={{
										width: `${Math.max(0, Math.min(100, (currentHealth / maxHealth) * 100))}%`,
									}}
								></div>
							</div>
						</div>
						<div className="text-4xl">❤️</div>
					</div>
				</div>

				{/* Coins */}
				<div className="bg-black/60 backdrop-blur-sm border border-purple-500/20 rounded-lg p-4 hover:border-purple-500/40 transition-colors">
					<div className="flex items-center justify-between">
						<div>
							<div className="text-purple-400 text-sm font-mono">CRYSTALS</div>
							<div className="text-3xl font-bold text-yellow-400 font-mono flex items-center">
								<CoinIcon size="md" className="mr-2" />
								{playerCoins}
							</div>
						</div>
						<div className="text-4xl">💎</div>
					</div>
				</div>
			</div>

			{/* Weapon Info */}
			{player && (
				<div className="bg-black/60 backdrop-blur-sm border border-purple-500/20 rounded-lg p-4 hover:border-purple-500/40 transition-colors">
					<div className="text-purple-400 text-sm font-mono mb-2">
						SPELL POWER
					</div>
					<div className="flex items-center justify-between">
						<div>
							<div className="text-white font-mono font-bold">
								Level {player.upgrades.spellLevel}
							</div>
							<div className="text-gray-400 text-xs font-mono">
								Damage: {player.upgrades.spellDamage}
							</div>
						</div>
						<div className="text-4xl">🪄</div>
					</div>
				</div>
			)}

			{/* Action Buttons */}
			{(onReturnHome || onShare) && (
				<div className="space-y-2">
					{onReturnHome && (
						<button
							onClick={onReturnHome}
							className="w-full px-4 py-3 bg-red-600/80 hover:bg-red-600 border border-red-500/50 text-white text-sm font-mono rounded transition-all duration-200 transform hover:scale-105 hover:border-red-500"
						>
							🏠 BACK TO HOME
						</button>
					)}

					{onShare && (
						<button
							onClick={onShare}
							className="w-full px-4 py-3 bg-blue-600/80 hover:bg-blue-600 border border-blue-500/50 text-white text-sm font-mono rounded transition-all duration-200 transform hover:scale-105 hover:border-blue-500"
						>
							📱 SHARE
						</button>
					)}
				</div>
			)}

			{/* Status Messages */}
			<div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-lg p-3">
				<div className="text-gray-300 font-mono text-xs text-center space-y-1">
					<div className="text-purple-400">STATUS</div>
					{gameOver && <div className="text-red-400">💀 REALM FALLEN</div>}
					{gameWon && <div className="text-green-400">🏆 VICTORY</div>}
					{!gameOver && !gameWon && (
						<div className="text-green-400">🔥 DEFENDING</div>
					)}
				</div>
			</div>
		</div>
	);
};
