import { useUISound } from "@/hooks/useUISound";
import { usePatchNotesNotification } from "@/hooks/usePatchNotesNotification";
import type { LeaderboardEntry } from "@/types/game";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FloatingParticles } from "./FloatingParticles";
import { Leaderboard } from "./Leaderboard";

interface HomeScreenProps {
	onStartGame: () => void;
	topScores: LeaderboardEntry[];
	allScores: LeaderboardEntry[];
	totalGamesPlayed: number;
	isLoadingScores: boolean;
}

export function HomeScreen({
	onStartGame,
	topScores,
	allScores,
	totalGamesPlayed,
	isLoadingScores,
}: HomeScreenProps) {
	const [currentMenuItem, setCurrentMenuItem] = useState(0);
	const [animateTitle, setAnimateTitle] = useState(false);
	const {
		playHover,
		playSelect,
		playStart,
		startMenuMusic,
		stopMenuMusic,
		audioSettings,
		updateAudioSettings,
	} = useUISound();

	const { hasNewPatchNotes, markPatchNotesAsSeen } =
		usePatchNotesNotification();

	useEffect(() => {
		setAnimateTitle(true);
		// Start ambient menu music
		const stopMusic = startMenuMusic();
		return stopMusic;
	}, [startMenuMusic]);

	// Stop music when audio is disabled
	useEffect(() => {
		if (!audioSettings.musicEnabled) {
			stopMenuMusic();
		} else {
			const stopMusic = startMenuMusic();
			return stopMusic;
		}
	}, [audioSettings.musicEnabled, startMenuMusic, stopMenuMusic]);

	const menuItems = [
		{
			id: "start",
			label: "START GAME",
			action: () => {
				playStart();
				setTimeout(onStartGame, 300); // Delay for sound effect
			},
			icon: "🎮",
			href: "/game",
		},
		{
			id: "settings",
			label: "SETTINGS",
			action: () => {
				playSelect();
			},
			icon: "⚙️",
			href: "/settings",
		},
		{
			id: "patch-notes",
			label: "PATCH NOTES",
			action: () => {
				playSelect();
				markPatchNotesAsSeen(); // Mark as seen when clicked
			},
			icon: "📋",
			href: "/patch-notes",
			hasNotification: hasNewPatchNotes,
		},
	];

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "ArrowUp") {
			playHover();
			setCurrentMenuItem((prev) =>
				prev > 0 ? prev - 1 : menuItems.length - 1,
			);
		} else if (e.key === "ArrowDown") {
			playHover();
			setCurrentMenuItem((prev) =>
				prev < menuItems.length - 1 ? prev + 1 : 0,
			);
		} else if (e.key === "Enter") {
			const currentItem = menuItems[currentMenuItem];
			if (currentItem.id === "start") {
				currentItem.action();
			} else {
				// For navigation items, trigger the sound and let the Link handle navigation
				currentItem.action();
				// Simulate click on the link
				const linkElement = document.querySelector(
					`[data-menu-item="${currentItem.id}"]`,
				) as HTMLAnchorElement;
				if (linkElement) {
					setTimeout(() => linkElement.click(), 100);
				}
			}
		}
	};

	const handleMenuItemHover = (index: number) => {
		if (index !== currentMenuItem) {
			playHover();
			setCurrentMenuItem(index);
		}
	};

	const handleMenuItemClick = (item: (typeof menuItems)[0]) => {
		if (item.id === "start") {
			item.action();
		} else {
			item.action(); // Play sound
		}
	};

	return (
		<div
			className="lg:min-h-dvh relative bg-gradient-to-br from-gray-900 via-gray-800 to-black"
			onKeyDown={handleKeyPress}
			style={{
				// Force scroll capability on mobile
				touchAction: "auto",
				overflow: "visible",
				height: "auto",
			}}
		>
			{/* Animated Background Elements */}
			<div className="absolute inset-0">
				{/* Smoke/Fog effect */}
				<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
				<div className="absolute top-0 left-0 w-full h-full opacity-20">
					<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
					<div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
				</div>

				{/* Grid overlay */}
				<div className="absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />

				{/* Floating particles */}
				<FloatingParticles />
			</div>

			{/* Main Content */}
			<div className="relative z-10 lg:flex lg:items-center lg:justify-center lg:min-h-dvh py-4 sm:py-6 lg:py-4 pb-16 sm:pb-20 lg:pb-4">
				<div className="flex flex-col lg:flex-row items-center gap-8 w-full max-w-7xl min-h-[120vh] lg:min-h-0">
					{/* Left Section - Title and Menu */}
					<div className="flex-1 text-center lg:text-left px-4 sm:px-6 lg:px-0">
						{/* Title */}
						<div
							className={`mb-8 mt-8 sm:mb-12 lg:mb-8 ${animateTitle ? "animate-fade-in-up" : "opacity-0"}`}
						>
							<h1 className="text-6xl lg:text-8xl font-bold font-pixel text-transparent bg-clip-text bg-gradient-to-b from-purple-400 to-blue-600 mb-4 tracking-wider">
								MYSTIC
							</h1>
							<h2 className="text-2xl lg:text-4xl font-pixel text-purple-300 mb-2">
								REALM DEFENDER
							</h2>
							<p className="text-gray-400 text-lg font-mono">
								Master the arcane arts. Defend against mythical beasts.
							</p>
						</div>

						{/* Menu */}
						<div className="space-y-4">
							{menuItems.map((item, index) => {
								const isSelected = index === currentMenuItem;
								const baseClassName = `
                  group w-full max-w-md mx-auto lg:mx-0 p-4 sm:p-6 lg:p-4 rounded-lg font-mono font-bold text-xl
                  transition-all duration-300 transform border-2 block
                  ${
										isSelected
											? "bg-purple-600/80 border-purple-500 text-white lg:scale-105 shadow-lg shadow-purple-500/50"
											: "bg-black/40 border-purple-500/30 text-purple-300 hover:bg-purple-600/20 hover:border-purple-500/60 lg:hover:scale-102"
									}
                  backdrop-blur-sm
                `;

								if (item.id === "start") {
									return (
										<button
											key={item.id}
											onClick={() => handleMenuItemClick(item)}
											onMouseEnter={() => handleMenuItemHover(index)}
											className={baseClassName}
											type="button"
										>
											<div className="flex items-center justify-center lg:justify-start gap-3">
												<span className="text-2xl">{item.icon}</span>
												<span>{item.label}</span>
											</div>
										</button>
									);
									// biome-ignore lint/style/noUselessElse: <explanation>
								} else {
									return (
										<Link
											key={item.id}
											href={item.href}
											onClick={() => handleMenuItemClick(item)}
											onMouseEnter={() => handleMenuItemHover(index)}
											className={`${baseClassName} relative`}
											data-menu-item={item.id}
										>
											<div className="flex items-center justify-center lg:justify-start gap-3">
												<span className="text-2xl">{item.icon}</span>
												<span>{item.label}</span>
											</div>
											{item.hasNotification && (
												<div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
													<span className="text-white text-xs font-bold">
														!
													</span>
												</div>
											)}
										</Link>
									);
								}
							})}
						</div>

						{/* Game Instructions */}
						<div className="mt-6 p-4 sm:p-6 lg:p-4 bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-lg max-w-md mx-auto lg:mx-0">
							<h3 className="text-purple-300 font-mono text-sm mb-2">
								🔮 HOW TO PLAY
							</h3>

							{/* Mobile Instructions */}
							<div className="text-xs text-gray-400 space-y-1 block lg:hidden">
								<p>🕹️ Joystick - Move & Aim</p>
								<p>🎯 Fire Button - Cast Spells</p>
								<p>Survive waves of mythical creatures!</p>
							</div>

							{/* Desktop Instructions */}
							<div className="text-xs text-gray-400 space-y-1 hidden lg:block">
								<p>WASD - Move</p>
								<p>Mouse - Aim & Cast Spells</p>
								<p>Survive waves of mythical creatures!</p>
							</div>
						</div>
					</div>

					{/* Right Section - Leaderboard */}
					<div className="flex-1 w-full max-w-lg px-4 sm:px-6 lg:px-0">
						<Leaderboard
							topScores={topScores}
							allScores={allScores}
							totalGamesPlayed={totalGamesPlayed}
							isLoading={isLoadingScores}
						/>
					</div>
				</div>
			</div>

			{/* Corner decorative elements */}
			<div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-purple-500/30" />
			<div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-purple-500/30" />
			<div className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-purple-500/30" />
			<div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-purple-500/30" />
		</div>
	);
}
