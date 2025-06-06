import {
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	INVULNERABILITY_TIME,
	MAP_HEIGHT,
	MAP_WIDTH,
	PLAYER_SPRITE_HEIGHT,
	PLAYER_SPRITE_WIDTH,
	WALL_BLOCK_SIZE,
} from "@/constants/game";
import { getCreatureSprite } from "@/game/Creatures";
import type { GameState } from "@/types/game";
import { getPlayerSprite } from "./Player";

export const render = (
	ctx: CanvasRenderingContext2D,
	gameState: GameState,
	creatureSprites: { [key: string]: HTMLImageElement | null },
	waveMessage: string,
	canvasWidth: number = CANVAS_WIDTH,
	canvasHeight: number = CANVAS_HEIGHT,
	floorTexture?: HTMLImageElement | null,
	healthPackSprite?: HTMLImageElement | null,
	isMobile = false,
) => {
	const { player } = gameState;

	// Clear the entire canvas first
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);

	const cameraX = Math.max(
		0,
		Math.min(MAP_WIDTH - canvasWidth, player.position.x - canvasWidth / 2),
	);
	const cameraY = Math.max(
		0,
		Math.min(MAP_HEIGHT - canvasHeight, player.position.y - canvasHeight / 2),
	);

	// Calculate sprite size multiplier for mobile (2% larger)
	const spriteScale = isMobile ? 1.3 : 1.0;

	// Render floor texture or fallback to solid color
	if (floorTexture) {
		renderFloorTexture(
			ctx,
			floorTexture,
			cameraX,
			cameraY,
			canvasWidth,
			canvasHeight,
		);
	} else {
		// Fallback: Clear canvas with background color
		ctx.fillStyle = "#c2b280";
		ctx.fillRect(0, 0, canvasWidth, canvasHeight);
	}

	// Render obstacles
	for (const obs of gameState.obstacles) {
		const screenX = obs.x - cameraX;
		const screenY = obs.y - cameraY;

		if (
			screenX + obs.width >= 0 &&
			screenX <= canvasWidth &&
			screenY + obs.height >= 0 &&
			screenY <= canvasHeight
		) {
			// Renderizar muros con bloques grises
			renderWallBlocks(ctx, screenX, screenY, obs.width, obs.height);
		}
	}

	// Render health packs ANTES del jugador para que el jugador esté siempre visible
	for (const healthPack of gameState.healthPacks) {
		const screenX = healthPack.position.x - cameraX;
		const screenY = healthPack.position.y - cameraY;

		if (
			screenX + healthPack.width >= 0 &&
			screenX - healthPack.width <= canvasWidth &&
			screenY + healthPack.height >= 0 &&
			screenY - healthPack.height <= canvasHeight
		) {
			if (healthPackSprite) {
				// Renderizar el sprite del pack de vida
				ctx.drawImage(
					healthPackSprite,
					screenX - healthPack.width / 2,
					screenY - healthPack.height / 2,
					healthPack.width,
					healthPack.height,
				);
			} else {
				// Fallback: renderizar como rectángulo rojo con cruz blanca
				ctx.fillStyle = "#FF4444";
				ctx.fillRect(
					screenX - healthPack.width / 2,
					screenY - healthPack.height / 2,
					healthPack.width,
					healthPack.height,
				);

				// Dibujar cruz blanca
				ctx.fillStyle = "#FFFFFF";
				// Línea horizontal de la cruz
				ctx.fillRect(
					screenX - healthPack.width / 2 + 4,
					screenY - 2,
					healthPack.width - 8,
					4,
				);
				// Línea vertical de la cruz
				ctx.fillRect(
					screenX - 2,
					screenY - healthPack.height / 2 + 4,
					4,
					healthPack.height - 8,
				);
			}
		}
	}

	// Render player
	const currentPlayerSprite = getPlayerSprite(player);
	if (currentPlayerSprite) {
		ctx.save();
		const now = Date.now();
		const isInvulnerable = now - player.lastDamageTime < INVULNERABILITY_TIME;
		if (isInvulnerable) {
			ctx.globalAlpha = 0.5 + Math.sin(now * 0.01) * 0.3;
		}

		// Apply mobile scaling to player sprite
		const scaledPlayerWidth = PLAYER_SPRITE_WIDTH * spriteScale;
		const scaledPlayerHeight = PLAYER_SPRITE_HEIGHT * spriteScale;

		ctx.drawImage(
			currentPlayerSprite,
			player.position.x - cameraX - scaledPlayerWidth / 2,
			player.position.y - cameraY - scaledPlayerHeight / 2,
			scaledPlayerWidth,
			scaledPlayerHeight,
		);
		ctx.restore();
		ctx.globalAlpha = 1.0;
	} else {
		// Debug: If no sprite found, render a fallback rectangle
		console.log(
			"No player sprite found, rendering fallback. Player direction:",
			player.direction,
			"isMoving:",
			player.isMoving,
			"animationFrame:",
			player.animationFrame,
		);
		ctx.fillStyle = "#4A90E2"; // Blue color for wizard

		// Apply mobile scaling to fallback rectangle too
		const scaledPlayerWidth = PLAYER_SPRITE_WIDTH * spriteScale;
		const scaledPlayerHeight = PLAYER_SPRITE_HEIGHT * spriteScale;

		ctx.fillRect(
			player.position.x - cameraX - scaledPlayerWidth / 2,
			player.position.y - cameraY - scaledPlayerHeight / 2,
			scaledPlayerWidth,
			scaledPlayerHeight,
		);
	}

	// Render player health bar
	const playerScreenX = player.position.x - cameraX;
	const playerScreenY = player.position.y - cameraY;
	const playerHealthBarWidth = PLAYER_SPRITE_WIDTH * spriteScale;
	const playerHealthBarHeight = 6;
	ctx.fillStyle = "rgba(255,0,0,0.5)";
	ctx.fillRect(
		playerScreenX - playerHealthBarWidth / 2,
		playerScreenY - (PLAYER_SPRITE_HEIGHT * spriteScale) / 2 - 15,
		playerHealthBarWidth,
		playerHealthBarHeight,
	);
	ctx.fillStyle = "rgba(0,255,0,0.8)";
	ctx.fillRect(
		playerScreenX - playerHealthBarWidth / 2,
		playerScreenY - (PLAYER_SPRITE_HEIGHT * spriteScale) / 2 - 15,
		playerHealthBarWidth * Math.max(0, player.health / player.maxHealth),
		playerHealthBarHeight,
	);

	// Render projectiles
	for (const p of gameState.projectiles) {
		const screenX = p.position.x - cameraX;
		const screenY = p.position.y - cameraY;
		if (
			screenX >= 0 &&
			screenX <= canvasWidth &&
			screenY >= 0 &&
			screenY <= canvasHeight
		) {
			// Color diferente para proyectiles del Boss
			if (p.isBossProjectile) {
				ctx.fillStyle = "#4B0082"; // Púrpura oscuro para proyectiles del Boss
			} else {
				ctx.fillStyle = p.isMagicBolt ? "#8A2BE2" : "#8A86FF";
			}
			ctx.beginPath();
			ctx.arc(screenX, screenY, p.radius, 0, Math.PI * 2);
			ctx.fill();
		}
	}

	// Render creatures
	for (const c of gameState.creatures) {
		const screenX = c.position.x - cameraX;
		const screenY = c.position.y - cameraY;

		if (
			screenX + c.width >= 0 &&
			screenX - c.width <= canvasWidth &&
			screenY + c.height >= 0 &&
			screenY - c.height <= canvasHeight
		) {
			const creatureSprite = getCreatureSprite(c, creatureSprites);

			// Apply mobile scaling to creature sprites
			const scaledCreatureWidth = c.width * spriteScale;
			const scaledCreatureHeight = c.height * spriteScale;

			if (creatureSprite) {
				// Renderizar el sprite de la criatura
				ctx.drawImage(
					creatureSprite,
					screenX - scaledCreatureWidth / 2,
					screenY - scaledCreatureHeight / 2,
					scaledCreatureWidth,
					scaledCreatureHeight,
				);
			} else {
				// Fallback: usar colores como antes si no hay sprite
				let creatureColor = "#228B22"; // Verde por defecto (normal)
				if (c.type === "caster") {
					creatureColor = "#8A2BE2"; // Púrpura para casters
				} else if (c.type === "boss") {
					creatureColor = "#4B0082"; // Púrpura más oscuro para boss
				} else if (c.type === "tank") {
					creatureColor = "#DC143C"; // Rojo para tanks
				} else if (c.type === "speed") {
					creatureColor = "#FFD700"; // Amarillo para speed
				} else if (c.type === "explosive") {
					creatureColor = "#FF4500"; // Naranja para explosive
				}

				ctx.fillStyle = creatureColor;
				ctx.fillRect(
					screenX - scaledCreatureWidth / 2,
					screenY - scaledCreatureHeight / 2,
					scaledCreatureWidth,
					scaledCreatureHeight,
				);
			}

			// Barra de vida de la criatura (también escalada)
			const healthBarWidth = scaledCreatureWidth * 0.8;
			const healthBarHeight = 5;
			ctx.fillStyle = "rgba(255,0,0,0.5)";
			ctx.fillRect(
				screenX - healthBarWidth / 2,
				screenY - scaledCreatureHeight / 2 - 10,
				healthBarWidth,
				healthBarHeight,
			);
			ctx.fillStyle = "rgba(0,255,0,0.8)";
			ctx.fillRect(
				screenX - healthBarWidth / 2,
				screenY - scaledCreatureHeight / 2 - 10,
				healthBarWidth * Math.max(0, c.health / c.maxHealth),
				healthBarHeight,
			);
		}
	}

	// Render minimap
	renderMinimap(ctx, gameState, cameraX, cameraY, canvasWidth, canvasHeight);

	// Render wave messages
	if (waveMessage) {
		ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
		ctx.fillRect(
			canvasWidth / 4,
			canvasHeight / 3,
			canvasWidth / 2,
			canvasHeight / 4,
		);
		ctx.font = "bold 24px Arial";
		ctx.fillStyle = "#FFFFFF";
		ctx.textAlign = "center";
		ctx.fillText(waveMessage, canvasWidth / 2, canvasHeight / 2 - 10);
		if (
			gameState.waveTransitioning &&
			!gameState.gameWon &&
			!gameState.gameOver
		) {
			ctx.font = "16px Arial";
			ctx.fillText("Prepare yourself!", canvasWidth / 2, canvasHeight / 2 + 20);
		}
		ctx.textAlign = "left";
	}

	// Render pause overlay
	if (gameState.isPaused) {
		// Semi-transparent overlay
		ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
		ctx.fillRect(0, 0, canvasWidth, canvasHeight);

		// Pause text
		ctx.font = "bold 32px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";
		ctx.fillStyle = "#FFFFFF";
		ctx.textAlign = "center";
		ctx.fillText("PAUSED", canvasWidth / 2, canvasHeight / 2 - 30);

		// Instructions - different for mobile vs desktop
		ctx.font = "16px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";
		ctx.fillStyle = "#CCCCCC";
		if (isMobile) {
			ctx.fillText("Tap the ⏸️ button to resume", canvasWidth / 2, canvasHeight / 2 + 20);
		} else {
			ctx.fillText("Press P or ESC to resume", canvasWidth / 2, canvasHeight / 2 + 20);
		}
		
		ctx.textAlign = "left";
	}
};

const renderMinimap = (
	ctx: CanvasRenderingContext2D,
	gameState: GameState,
	cameraX: number,
	cameraY: number,
	canvasWidth: number = CANVAS_WIDTH,
	canvasHeight: number = CANVAS_HEIGHT,
) => {
	const { player } = gameState;

	// Calculate minimap size proportional to canvas size
	const minimapSize = Math.min(canvasWidth, canvasHeight) * 0.15; // 15% of smaller dimension
	const minimapPadding = 10;
	const minimapScaleX = minimapSize / MAP_WIDTH;
	const minimapScaleY = minimapSize / MAP_HEIGHT;

	// Fondo del minimapa
	ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
	ctx.fillRect(
		canvasWidth - minimapSize - minimapPadding,
		minimapPadding,
		minimapSize,
		minimapSize,
	);

	// Borde del minimapa
	ctx.strokeStyle = "#FFFFFF";
	ctx.lineWidth = 2;
	ctx.strokeRect(
		canvasWidth - minimapSize - minimapPadding,
		minimapPadding,
		minimapSize,
		minimapSize,
	);

	// Obstáculos en el minimapa
	ctx.fillStyle = "#808080";
	for (const obs of gameState.obstacles) {
		ctx.fillRect(
			canvasWidth - minimapSize - minimapPadding + obs.x * minimapScaleX,
			minimapPadding + obs.y * minimapScaleY,
			obs.width * minimapScaleX,
			obs.height * minimapScaleY,
		);
	}

	// Criaturas en el minimapa
	for (const c of gameState.creatures) {
		// Usar diferentes colores según el tipo de criatura
		if (c.type === "caster") {
			ctx.fillStyle = "#8A2BE2"; // Púrpura para casters
		} else if (c.type === "boss") {
			ctx.fillStyle = "#4B0082"; // Púrpura más oscuro para boss
		} else if (c.type === "tank") {
			ctx.fillStyle = "#DC143C"; // Rojo para tanks
		} else if (c.type === "speed") {
			ctx.fillStyle = "#FFD700"; // Amarillo para speed
		} else if (c.type === "explosive") {
			ctx.fillStyle = "#FF4500"; // Naranja para explosive
		} else {
			ctx.fillStyle = "#FF0000"; // Rojo por defecto para normal
		}

		ctx.fillRect(
			canvasWidth -
				minimapSize -
				minimapPadding +
				c.position.x * minimapScaleX -
				1,
			minimapPadding + c.position.y * minimapScaleY - 1,
			2,
			2,
		);
	}

	// Packs de vida en el minimapa
	ctx.fillStyle = "#00FFFF"; // Cyan para packs de vida (más visible y contrastante)
	for (const healthPack of gameState.healthPacks) {
		ctx.fillRect(
			canvasWidth -
				minimapSize -
				minimapPadding +
				healthPack.position.x * minimapScaleX -
				1,
			minimapPadding + healthPack.position.y * minimapScaleY - 1,
			2,
			2,
		);
	}

	// Jugador en el minimapa
	ctx.fillStyle = "#00FF00";
	ctx.fillRect(
		canvasWidth -
			minimapSize -
			minimapPadding +
			player.position.x * minimapScaleX -
			2,
		minimapPadding + player.position.y * minimapScaleY - 2,
		4,
		4,
	);

	// Campo de visión de la cámara
	ctx.strokeStyle = "#FFFF00";
	ctx.lineWidth = 1;
	ctx.strokeRect(
		canvasWidth - minimapSize - minimapPadding + cameraX * minimapScaleX,
		minimapPadding + cameraY * minimapScaleY,
		canvasWidth * minimapScaleX,
		canvasHeight * minimapScaleY,
	);
};

const renderFloorTexture = (
	ctx: CanvasRenderingContext2D,
	floorTexture: HTMLImageElement,
	cameraX: number,
	cameraY: number,
	canvasWidth: number,
	canvasHeight: number,
) => {
	// Get texture dimensions
	const textureWidth = floorTexture.width;
	const textureHeight = floorTexture.height;

	// Calculate starting positions for tiling
	const startX = Math.floor(cameraX / textureWidth) * textureWidth - cameraX;
	const startY = Math.floor(cameraY / textureHeight) * textureHeight - cameraY;

	// Calculate how many tiles we need to cover the screen
	const tilesX = Math.ceil((canvasWidth - startX) / textureWidth) + 1;
	const tilesY = Math.ceil((canvasHeight - startY) / textureHeight) + 1;

	// Render the tiled texture
	for (let x = 0; x < tilesX; x++) {
		for (let y = 0; y < tilesY; y++) {
			const drawX = startX + x * textureWidth;
			const drawY = startY + y * textureHeight;

			// Only draw if the tile is visible on screen
			if (
				drawX < canvasWidth &&
				drawY < canvasHeight &&
				drawX + textureWidth > 0 &&
				drawY + textureHeight > 0
			) {
				ctx.drawImage(floorTexture, drawX, drawY, textureWidth, textureHeight);
			}
		}
	}
};

const renderWallBlocks = (
	ctx: CanvasRenderingContext2D,
	screenX: number,
	screenY: number,
	width: number,
	height: number,
) => {
	// Calcular cuántos bloques necesitamos
	const blocksX = Math.ceil(width / WALL_BLOCK_SIZE);
	const blocksY = Math.ceil(height / WALL_BLOCK_SIZE);

	// Renderizar cada bloque individualmente
	for (let bx = 0; bx < blocksX; bx++) {
		for (let by = 0; by < blocksY; by++) {
			const blockX = screenX + bx * WALL_BLOCK_SIZE;
			const blockY = screenY + by * WALL_BLOCK_SIZE;
			const blockWidth = Math.min(
				WALL_BLOCK_SIZE,
				width - bx * WALL_BLOCK_SIZE,
			);
			const blockHeight = Math.min(
				WALL_BLOCK_SIZE,
				height - by * WALL_BLOCK_SIZE,
			);

			// Dibujar el bloque de pared con efecto 3D
			ctx.fillStyle = "#666666";
			ctx.fillRect(blockX, blockY, blockWidth, blockHeight);

			// Borde superior e izquierdo más claro (luz)
			ctx.fillStyle = "#888888";
			ctx.fillRect(blockX, blockY, blockWidth, 2);
			ctx.fillRect(blockX, blockY, 2, blockHeight);

			// Borde inferior y derecho más oscuro (sombra)
			ctx.fillStyle = "#444444";
			ctx.fillRect(blockX, blockY + blockHeight - 2, blockWidth, 2);
			ctx.fillRect(blockX + blockWidth - 2, blockY, 2, blockHeight);
		}
	}
};
