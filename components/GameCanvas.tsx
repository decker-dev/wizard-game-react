import { CANVAS_HEIGHT, CANVAS_WIDTH } from "@/constants/game";
import { checkCollisions } from "@/game/Collisions";
import { updateCreatures } from "@/game/Creatures";
import { updateHealthPacks } from "@/game/HealthPacks";
import { updatePlayer } from "@/game/Player";
import { updateProjectiles } from "@/game/Projectiles";
import { render } from "@/game/Renderer";
import type { GameState } from "@/types/game";
import { updateCoinParticles } from "@/utils/coinParticles";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { CoinParticles } from "./CoinParticles";

interface GameCanvasProps {
	gameState: GameState | null;
	creatureSprites: { [key: string]: HTMLImageElement | null };
	floorTexture?: HTMLImageElement | null;
	healthPackSprite?: HTMLImageElement | null;
	waveMessage: string;
	startNextWave: () => void;
	setScore: (score: number) => void;
	setPlayerHealth: (health: number) => void;
	setPlayerCoins: (coins: number) => void;
	setGameOver: (gameOver: boolean, score: number) => void;
	onMouseMove: (e: MouseEvent) => void;
	onMouseClick: (e: MouseEvent) => void;
	playCreatureDeath: (
		creatureType: "normal" | "caster" | "tank" | "speed" | "explosive" | "boss",
	) => void;
	playPlayerShoot: () => void;
	playPlayerHit: () => void;
	onFullscreenChange?: (isFullscreen: boolean) => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
	gameState,
	creatureSprites,
	floorTexture,
	healthPackSprite,
	waveMessage,
	startNextWave,
	setScore,
	setPlayerHealth,
	setPlayerCoins,
	setGameOver,
	onMouseMove,
	onMouseClick,
	playCreatureDeath,
	playPlayerShoot,
	playPlayerHit,
	onFullscreenChange,
}) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const animationFrameRef = useRef<number | null>(null);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [canvasDimensions, setCanvasDimensions] = useState({
		width: CANVAS_WIDTH,
		height: CANVAS_HEIGHT,
	});

	// Detect if we're on mobile
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth <= 768);
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);

		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	// Handle fullscreen change events
	useEffect(() => {
		const handleFullscreenChange = () => {
			const isCurrentlyFullscreen = Boolean(document.fullscreenElement);
			setIsFullscreen(isCurrentlyFullscreen);
			
			// Notify parent component about fullscreen change
			if (onFullscreenChange) {
				onFullscreenChange(isCurrentlyFullscreen);
			}

			if (isCurrentlyFullscreen) {
				// Calculate fullscreen dimensions maintaining aspect ratio
				const aspectRatio = CANVAS_WIDTH / CANVAS_HEIGHT;
				const screenWidth = window.innerWidth;
				const screenHeight = window.innerHeight;
				const screenAspectRatio = screenWidth / screenHeight;

				let newWidth: number;
				let newHeight: number;
				if (screenAspectRatio > aspectRatio) {
					// Screen is wider, constrain by height
					newHeight = Math.min(screenHeight - 100, screenHeight * 0.9); // Leave some margin
					newWidth = newHeight * aspectRatio;
				} else {
					// Screen is taller, constrain by width
					newWidth = Math.min(screenWidth - 100, screenWidth * 0.9); // Leave some margin
					newHeight = newWidth / aspectRatio;
				}

				// Ensure minimum size for playability
				const minWidth = CANVAS_WIDTH;
				const minHeight = CANVAS_HEIGHT;
				if (newWidth < minWidth || newHeight < minHeight) {
					newWidth = minWidth;
					newHeight = minHeight;
				}

				setCanvasDimensions({
					width: Math.round(newWidth),
					height: Math.round(newHeight),
				});
			} else {
				// Back to normal size
				setCanvasDimensions({ width: CANVAS_WIDTH, height: CANVAS_HEIGHT });
			}
		};

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isFullscreen) {
				document.exitFullscreen().catch(console.error);
			}
		};

		document.addEventListener("fullscreenchange", handleFullscreenChange);
		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("fullscreenchange", handleFullscreenChange);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [isFullscreen]);

	const toggleFullscreen = async () => {
		if (!containerRef.current) return;

		try {
			if (!document.fullscreenElement) {
				await containerRef.current.requestFullscreen();
			} else {
				await document.exitFullscreen();
			}
		} catch (error) {
			console.error("Error toggling fullscreen:", error);
		}
	};

	const gameLoop = useCallback(() => {
		if (!gameState) return;

		// Solo actualizar el estado del juego si no está pausado
		if (!gameState.gameOver && !gameState.gameWon && !gameState.isPaused) {
			updatePlayer(gameState);
			updateCreatures(gameState);
			updateProjectiles(gameState);
			updateHealthPacks(gameState, setPlayerHealth);
			gameState.crystalParticles = updateCoinParticles(
				gameState.crystalParticles,
			);
			checkCollisions(
				gameState,
				startNextWave,
				setScore,
				setPlayerHealth,
				setGameOver,
				setPlayerCoins,
				playCreatureDeath,
				playPlayerHit,
			);
		}

		// Siempre renderizar, incluso cuando esté pausado
		const canvas = canvasRef.current;
		if (canvas) {
			const ctx = canvas.getContext("2d");
			if (ctx) {
				render(
					ctx,
					gameState,
					creatureSprites,
					waveMessage,
					canvasDimensions.width,
					canvasDimensions.height,
					floorTexture,
					healthPackSprite,
					isMobile,
				);
			}
		}

		animationFrameRef.current = requestAnimationFrame(gameLoop);
	}, [
		gameState,
		creatureSprites,
		floorTexture,
		healthPackSprite,
		waveMessage,
		startNextWave,
		setScore,
		setPlayerHealth,
		setGameOver,
		setPlayerCoins,
		canvasDimensions,
		playCreatureDeath,
		playPlayerHit,
		isMobile,
	]);

	useEffect(() => {
		if (gameState && !gameState.gameOver && !gameState.gameWon) {
			animationFrameRef.current = requestAnimationFrame(gameLoop);
		} else {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
				animationFrameRef.current = null;
			}
		}

		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		};
	}, [gameLoop, gameState]);

	useEffect(() => {
		const canvasElement = canvasRef.current;
		if (canvasElement) {
			const handleMouseMove = (e: MouseEvent) => {
				// Scale mouse coordinates if canvas is scaled
				const rect = canvasElement.getBoundingClientRect();
				const scaleX = canvasDimensions.width / rect.width;
				const scaleY = canvasDimensions.height / rect.height;

				// Create a scaled mouse event
				const scaledEvent = {
					...e,
					clientX: (e.clientX - rect.left) * scaleX + rect.left,
					clientY: (e.clientY - rect.top) * scaleY + rect.top,
					offsetX: (e.clientX - rect.left) * scaleX,
					offsetY: (e.clientY - rect.top) * scaleY,
				} as MouseEvent;

				onMouseMove(scaledEvent);
			};

			const handleMouseClick = (e: MouseEvent) => {
				// Scale mouse coordinates if canvas is scaled
				const rect = canvasElement.getBoundingClientRect();
				const scaleX = canvasDimensions.width / rect.width;
				const scaleY = canvasDimensions.height / rect.height;

				// Create a scaled mouse event
				const scaledEvent = {
					...e,
					clientX: (e.clientX - rect.left) * scaleX + rect.left,
					clientY: (e.clientY - rect.top) * scaleY + rect.top,
					offsetX: (e.clientX - rect.left) * scaleX,
					offsetY: (e.clientY - rect.top) * scaleY,
				} as MouseEvent;

				onMouseClick(scaledEvent);
			};

			canvasElement.addEventListener("mousemove", handleMouseMove);
			canvasElement.addEventListener("click", handleMouseClick);

			return () => {
				canvasElement.removeEventListener("mousemove", handleMouseMove);
				canvasElement.removeEventListener("click", handleMouseClick);
			};
		}
	}, [onMouseMove, onMouseClick, canvasDimensions]);

	return (
		<div
			ref={containerRef}
			className={`relative game-area ${isFullscreen ? "fixed inset-0 flex items-center justify-center bg-black z-50" : ""}`}
			style={{
				userSelect: "none",
				WebkitUserSelect: "none",
				MozUserSelect: "none",
				msUserSelect: "none",
				WebkitTouchCallout: "none",
				WebkitTapHighlightColor: "transparent",
			}}
			onContextMenu={(e) => e.preventDefault()}
			onDragStart={(e) => e.preventDefault()}
		>
			{/* Fullscreen Toggle Button */}
			<button
				type="button"
				onClick={toggleFullscreen}
				className={`absolute ${
					isFullscreen ? "top-4 left-4 z-50" : "top-2 left-2 z-10"
				} bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/20 hover:border-purple-500/40 text-white/80 hover:text-white p-2 rounded font-mono font-bold transition-all duration-200 transform hover:scale-105 hidden md:block`}
				title={isFullscreen ? "Exit fullscreen (ESC)" : "Fullscreen"}
			>
				{isFullscreen ? (
					<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
						<path
							fillRule="evenodd"
							d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z"
							clipRule="evenodd"
						/>
					</svg>
				) : (
					<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
						<path
							fillRule="evenodd"
							d="M3 4a1 1 0 011-1h4a1 1 0 110 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 11-2 0V4zm9 1a1 1 0 110-2h4a1 1 0 011 1v4a1 1 0 11-2 0V6.414l-2.293 2.293a1 1 0 01-1.414-1.414L13.586 5H12zm-9 7a1 1 0 112 0v1.586l2.293-2.293a1 1 0 011.414 1.414L6.414 15H8a1 1 0 110 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 110-2h1.586l-2.293-2.293a1 1 0 011.414-1.414L15 13.586V12a1 1 0 011-1z"
							clipRule="evenodd"
						/>
					</svg>
				)}
			</button>

			{/* Instructions for fullscreen mode */}
			{isFullscreen && (
				<>
					<div className="absolute top-4 right-4 z-40 bg-black/80 backdrop-blur-sm border border-purple-500/30 rounded-lg p-3">
						<p className="text-purple-400 font-mono text-sm">
							Press ESC to exit fullscreen
						</p>
					</div>
					
					{/* Pause instruction in bottom center */}
						<p className="absolute bottom-1 left-1/2 transform -translate-x-1/2 z-40 text-purple-400 font-mono text-sm">
							Press P to pause or resume the game
						</p>
				</>
			)}

			{/* Canvas Container with Coin Particles */}
			<div
				className="relative game-canvas-container"
				style={{
					userSelect: "none",
					WebkitUserSelect: "none",
					MozUserSelect: "none",
					msUserSelect: "none",
					WebkitTouchCallout: "none",
					WebkitTapHighlightColor: "transparent",
					touchAction: "none",
				}}
				onContextMenu={(e) => e.preventDefault()}
				onDragStart={(e) => e.preventDefault()}
			>
				{/* Coin Particles Overlay */}
				{gameState && (
					<CoinParticles
						particles={gameState.crystalParticles}
						removeParticle={(id: string) => {
							if (gameState) {
								gameState.crystalParticles = gameState.crystalParticles.filter(
									(p) => p.id !== id,
								);
							}
						}}
					/>
				)}

				<canvas
					ref={canvasRef}
					width={canvasDimensions.width}
					height={canvasDimensions.height}
					className={`game-element ${
						isFullscreen
							? "border-2 border-purple-500/70 bg-gray-900 rounded shadow-2xl"
							: "border-4 border-purple-500/50 bg-gray-900 rounded-lg shadow-lg hover:border-purple-500/70 transition-colors"
					}`}
					style={{
						imageRendering: "pixelated", // Maintain pixel art look when scaled
						maxWidth: "100%",
						maxHeight: "100%",
						userSelect: "none",
						WebkitUserSelect: "none",
						MozUserSelect: "none",
						msUserSelect: "none",
						WebkitTouchCallout: "none",
						WebkitTapHighlightColor: "transparent",
						touchAction: "none",
						outline: "none",
					}}
					onContextMenu={(e) => e.preventDefault()}
					onDragStart={(e) => e.preventDefault()}
				/>
			</div>
		</div>
	);
};
