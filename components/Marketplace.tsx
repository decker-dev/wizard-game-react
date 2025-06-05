import {
	HEALTH_INCREASE,
	MAX_UPGRADE_LEVEL,
	SPELL_DAMAGE_INCREASE,
} from "@/constants/game";
import type { Player } from "@/types/game";
import { getHealthUpgradeCost, getSpellUpgradeCost } from "@/utils/marketplace";
import type React from "react";
import { CoinIcon } from "./CoinIcon";

interface MarketplaceProps {
	player: Player;
	onUpgradeWeapon: () => void;
	onUpgradeHealth: () => void;
	onContinue: () => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({
	player,
	onUpgradeWeapon,
	onUpgradeHealth,
	onContinue,
}) => {
	const weaponCost = getSpellUpgradeCost(player.upgrades.spellLevel);
	const healthCost = getHealthUpgradeCost(player.upgrades.healthLevel);

	const canUpgradeWeapon =
		player.crystals >= weaponCost &&
		player.upgrades.spellLevel < MAX_UPGRADE_LEVEL;
	const canUpgradeHealth =
		player.crystals >= healthCost &&
		player.upgrades.healthLevel < MAX_UPGRADE_LEVEL;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-2 sm:p-4">
			<div className="bg-gray-800 border-2 sm:border-4 border-purple-500 rounded-lg p-3 sm:p-6 lg:p-8 w-full max-w-[95vw] sm:max-w-md max-h-[90vh] overflow-y-auto">
				<h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-400 text-center mb-3 sm:mb-4 lg:mb-6">
					`🔮` ARCANE SHOP
				</h2>

				<div className="text-center mb-3 sm:mb-4 lg:mb-6">
					<p className="text-white text-lg sm:text-xl flex items-center justify-center">
						<CoinIcon size="lg" className="mr-1 sm:mr-2" />
						Crystals: {player.crystals}
					</p>
				</div>

				<div className="space-y-3 sm:space-y-4">
					<div className="bg-gray-700 rounded-lg p-2 sm:p-3 lg:p-4 border border-gray-600 sm:border-2">
						<div className="flex justify-between items-center mb-1 sm:mb-2">
							<h3 className="text-sm sm:text-base lg:text-lg font-bold text-purple-400">
								🪄 Enhance Spell Power
							</h3>
							<span className="text-yellow-400 flex items-center text-sm sm:text-base">
								<CoinIcon size="sm" className="mr-1" />
								{weaponCost}
							</span>
						</div>
						<p className="text-gray-300 text-xs sm:text-sm mb-2 sm:mb-3">
							Current damage: {player.upgrades.spellDamage} | Level:{" "}
							{player.upgrades.spellLevel}/{MAX_UPGRADE_LEVEL}
						</p>
						<div className="text-gray-300 text-xs mb-2 sm:mb-3 space-y-1">
							<p>+{SPELL_DAMAGE_INCREASE} spell damage per cast</p>
							{player.upgrades.spellLevel === 0 && (
								<div className="text-yellow-300">
									<p>✨ Next enchantments:</p>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-0 sm:gap-1 text-xs">
										<p>• Lv.1: Faster casting</p>
										<p>• Lv.2: Double projectile</p>
										<p>• Lv.3: Bigger spells</p>
										<p>• Lv.4: Triple projectile</p>
										<p className="sm:col-span-2">
											• Lv.5: Maximum arcane power
										</p>
									</div>
								</div>
							)}
							{player.upgrades.spellLevel >= 1 && (
								<div className="text-green-300 space-y-0.5">
									<p>
										✅ Speed:{" "}
										{Math.round((1000 / player.upgrades.castRate) * 10) / 10}{" "}
										casts/sec
									</p>
									{player.upgrades.projectileCount > 1 && (
										<p>
											✅ Projectiles: {player.upgrades.projectileCount}x per
											cast
										</p>
									)}
									{player.upgrades.projectileSize > 1 && (
										<p>
											✅ Size:{" "}
											{Math.round(player.upgrades.projectileSize * 100)}% of
											original
										</p>
									)}
								</div>
							)}
						</div>
						<button
							type="button"
							onClick={onUpgradeWeapon}
							disabled={!canUpgradeWeapon}
							className={`w-full py-1.5 sm:py-2 rounded font-bold transition-colors text-sm sm:text-base ${
								canUpgradeWeapon
									? "bg-purple-600 hover:bg-purple-700 text-white"
									: "bg-gray-600 text-gray-400 cursor-not-allowed"
							}`}
						>
							{player.upgrades.spellLevel >= MAX_UPGRADE_LEVEL
								? "MAX LEVEL"
								: canUpgradeWeapon
									? "ENHANCE"
									: "NO CRYSTALS"}
						</button>
					</div>

					{/* Health Upgrade */}
					<div className="bg-gray-700 rounded-lg p-2 sm:p-3 lg:p-4 border border-gray-600 sm:border-2">
						<div className="flex justify-between items-center mb-1 sm:mb-2">
							<h3 className="text-sm sm:text-base lg:text-lg font-bold text-red-400">
								❤️ Increase Health
							</h3>
							<span className="text-yellow-400 flex items-center text-sm sm:text-base">
								<CoinIcon size="sm" className="mr-1" />
								{healthCost}
							</span>
						</div>
						<p className="text-gray-300 text-xs sm:text-sm mb-2 sm:mb-3">
							Max health: {player.upgrades.maxHealth} | Level:{" "}
							{player.upgrades.healthLevel}/{MAX_UPGRADE_LEVEL}
						</p>
						<p className="text-gray-300 text-xs sm:text-sm mb-2 sm:mb-3">
							+{HEALTH_INCREASE} max health
						</p>
						<button
							type="button"
							onClick={onUpgradeHealth}
							disabled={!canUpgradeHealth}
							className={`w-full py-1.5 sm:py-2 rounded font-bold transition-colors text-sm sm:text-base ${
								canUpgradeHealth
									? "bg-red-600 hover:bg-red-700 text-white"
									: "bg-gray-600 text-gray-400 cursor-not-allowed"
							}`}
						>
							{player.upgrades.healthLevel >= MAX_UPGRADE_LEVEL
								? "MAX LEVEL"
								: canUpgradeHealth
									? "ENHANCE"
									: "NO CRYSTALS"}
						</button>
					</div>
				</div>

				<div className="mt-3 sm:mt-4 lg:mt-6">
					<button
						onClick={onContinue}
						type="button"
						className="w-full py-2 sm:py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded text-lg sm:text-xl transition-colors"
					>
						Continue to next wave →
					</button>
				</div>

				{/* Pricing preview - Hidden on mobile if both at max level */}
				{(player.upgrades.spellLevel < MAX_UPGRADE_LEVEL ||
					player.upgrades.healthLevel < MAX_UPGRADE_LEVEL) && (
					<div className="mt-2 sm:mt-4 text-center text-xs text-gray-400 space-y-1">
						{player.upgrades.spellLevel < MAX_UPGRADE_LEVEL && (
							<p className="flex items-center justify-center">
								<span className="hidden sm:inline">
									Next spell enhancement:{" "}
								</span>
								<span className="sm:hidden">Next spell: </span>
								<CoinIcon size="sm" className="mx-1" />
								{getSpellUpgradeCost(player.upgrades.spellLevel + 1)}
							</p>
						)}
						{player.upgrades.healthLevel < MAX_UPGRADE_LEVEL && (
							<p className="flex items-center justify-center">
								<span className="hidden sm:inline">
									Next health enhancement:{" "}
								</span>
								<span className="sm:hidden">Next health: </span>
								<CoinIcon size="sm" className="mx-1" />
								{getHealthUpgradeCost(player.upgrades.healthLevel + 1)}
							</p>
						)}
					</div>
				)}
			</div>
		</div>
	);
};
