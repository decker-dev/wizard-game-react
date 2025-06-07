import {
	BASE_CREATURES_PER_WAVE,
	CREATURES_INCREASE_PER_WAVE,
	EXPONENTIAL_SCALING_INTERVAL,
	EXPONENTIAL_SPAWN_MULTIPLIER,
	HEALTH_INCREASE,
	MAX_UPGRADE_LEVEL,
	SPELL_DAMAGE_INCREASE,
	STARTING_WAVE,
} from "@/constants/game";
import { getMapDataForLevel, shouldTeleportOnWaveChange } from "@/game/MapManager";
import { spawnHealthPacksForWave } from "@/game/HealthPacks";
import { createInitialPlayer } from "@/game/Player";
import type { GameState } from "@/types/game";
import { getHealthUpgradeCost, getSpellUpgradeCost } from "@/utils/marketplace";
import { useCallback, useRef } from "react";

export const useGameState = () => {
	const createInitialGameState = useCallback(
		(playerSprites: { [key: string]: HTMLImageElement | null }): GameState => {
			const initialMapData = getMapDataForLevel(STARTING_WAVE);
			const player = createInitialPlayer(playerSprites);
			player.position.x = initialMapData.spawnPoint.x;
			player.position.y = initialMapData.spawnPoint.y;

			const exponentialBonus = Math.floor(STARTING_WAVE / EXPONENTIAL_SCALING_INTERVAL);
			const spawnMultiplier = EXPONENTIAL_SPAWN_MULTIPLIER ** exponentialBonus;
			const baseCreatures = BASE_CREATURES_PER_WAVE + STARTING_WAVE * CREATURES_INCREASE_PER_WAVE;
			const creaturesToSpawn = Math.floor(baseCreatures * spawnMultiplier);

			return {
				player,
				projectiles: [],
				creatures: [],
				obstacles: initialMapData.obstacles,
				healthPacks: [],
				score: 0,
				currentWave: STARTING_WAVE, // Initialize to STARTING_WAVE
				creaturesToSpawnThisWave: creaturesToSpawn,
				creaturesRemainingInWave: creaturesToSpawn,
				creaturesSpawnedThisWave: 0,
				gameOver: false,
				gameWon: false,
				isPaused: false,
				keys: {},
				mousePosition: { x: 70, y: 0 },
				waveTransitioning: false,
				showMarketplace: false,
				crystalParticles: [],
				mobConfig: {
					normal: true, // ✅ Tiene sprites
					caster: true, // ✅ Tiene sprites (mage)
					tank: true, // ✅ Habilitado - usa sprites de normal pero más grande
					speed: false, // ❌ Sin sprites aún
					explosive: false, // ❌ Sin sprites aún
					boss: true, // ✅ Usa sprites de mage temporalmente
				},
				// Combo System - initialized
				comboKills: 0,
				lastComboKillTime: 0,
			};
		},
		[],
	);

	const gameStateRef = useRef<GameState | null>(null);

	const initializeGameState = useCallback(
		(playerSprites: { [key: string]: HTMLImageElement | null }) => {
			gameStateRef.current = createInitialGameState(playerSprites);
			return gameStateRef.current;
		},
		[createInitialGameState],
	);

	const resetGameState = useCallback(
		(playerSprites: { [key: string]: HTMLImageElement | null }) => {
			gameStateRef.current = createInitialGameState(playerSprites);
			return gameStateRef.current;
		},
		[createInitialGameState],
	);

	const startNextWave = useCallback(
		(
			setCurrentWave: (wave: number) => void,
			setWaveMessage: (message: string) => void,
			setGameWon: (won: boolean) => void,
			healthPackSprite?: HTMLImageElement | null,
		) => {
			if (
				!gameStateRef.current ||
				gameStateRef.current.waveTransitioning ||
				gameStateRef.current.gameWon ||
				gameStateRef.current.gameOver
			) {
				return;
			}

			gameStateRef.current.waveTransitioning = true;
			const previousWave = gameStateRef.current.currentWave;
			gameStateRef.current.currentWave++;
			setCurrentWave(gameStateRef.current.currentWave);

			// Check if there's a map change and only teleport if necessary
			const shouldTeleport = shouldTeleportOnWaveChange(previousWave, gameStateRef.current.currentWave);
			const newMapDataForNextWave = getMapDataForLevel(gameStateRef.current.currentWave);
			gameStateRef.current.obstacles = newMapDataForNextWave.obstacles;

			// Only teleport player if there's actually a map change
			if (shouldTeleport) {
				gameStateRef.current.player.position.x = newMapDataForNextWave.spawnPoint.x;
				gameStateRef.current.player.position.y = newMapDataForNextWave.spawnPoint.y;
			}

			// Waves are now infinite! No more victory condition by waves
			// Victory only comes from player death or manual quit

			// Mostrar marketplace antes de las waves 2+ (después de completar la primera wave)
			if (gameStateRef.current.currentWave >= 2) {
				gameStateRef.current.showMarketplace = true;
				gameStateRef.current.waveTransitioning = false;
				setWaveMessage(
					"¡Wave completada! Visita el marketplace para mejorar tu equipo.",
				);
				return;
			}

			// Configurar la wave con escalado progresivo
			const exponentialBonus = Math.floor(
				gameStateRef.current.currentWave / EXPONENTIAL_SCALING_INTERVAL,
			);
			const spawnMultiplier = EXPONENTIAL_SPAWN_MULTIPLIER ** exponentialBonus;
			const baseCreatures =
				BASE_CREATURES_PER_WAVE +
				gameStateRef.current.currentWave * CREATURES_INCREASE_PER_WAVE;
			gameStateRef.current.creaturesToSpawnThisWave = Math.floor(
				baseCreatures * spawnMultiplier,
			);
			gameStateRef.current.creaturesRemainingInWave =
				gameStateRef.current.creaturesToSpawnThisWave;
			gameStateRef.current.creaturesSpawnedThisWave = 0;
			gameStateRef.current.creatures = [];
			gameStateRef.current.healthPacks = [];

			// Generar packs de vida para esta oleada
			spawnHealthPacksForWave(
				gameStateRef.current,
				gameStateRef.current.currentWave,
				healthPackSprite,
			);

			setWaveMessage(`Wave ${gameStateRef.current.currentWave} starting...`);
			setTimeout(() => {
				setWaveMessage("");
				if (gameStateRef.current) {
					gameStateRef.current.waveTransitioning = false;
				}
			}, 3000);
		},
		[],
	);

	const continueFromMarketplace = useCallback(
		(
			setWaveMessage: (message: string) => void,
			healthPackSprite?: HTMLImageElement | null,
		) => {
			if (!gameStateRef.current) return;

			gameStateRef.current.showMarketplace = false;
			// gameStateRef.current.obstacles = getMapForLevel(gameStateRef.current.currentWave); // Old line

			// Check if there's a map change from the previous wave to current wave
			const shouldTeleport = shouldTeleportOnWaveChange(gameStateRef.current.currentWave - 1, gameStateRef.current.currentWave);
			const newMapDataForMarketplace = getMapDataForLevel(gameStateRef.current.currentWave);
			gameStateRef.current.obstacles = newMapDataForMarketplace.obstacles;

			// Only teleport player if there's actually a map change
			if (shouldTeleport) {
				gameStateRef.current.player.position.x = newMapDataForMarketplace.spawnPoint.x;
				gameStateRef.current.player.position.y = newMapDataForMarketplace.spawnPoint.y;
			}
			gameStateRef.current.waveTransitioning = true;

			// Configurar la wave con escalado progresivo
			const exponentialBonus = Math.floor(
				gameStateRef.current.currentWave / EXPONENTIAL_SCALING_INTERVAL,
			);
			const spawnMultiplier = EXPONENTIAL_SPAWN_MULTIPLIER ** exponentialBonus;
			const baseCreatures =
				BASE_CREATURES_PER_WAVE +
				gameStateRef.current.currentWave * CREATURES_INCREASE_PER_WAVE;
			gameStateRef.current.creaturesToSpawnThisWave = Math.floor(
				baseCreatures * spawnMultiplier,
			);
			gameStateRef.current.creaturesRemainingInWave =
				gameStateRef.current.creaturesToSpawnThisWave;
			gameStateRef.current.creaturesSpawnedThisWave = 0;
			gameStateRef.current.creatures = [];
			gameStateRef.current.healthPacks = [];

			// Generar packs de vida para esta oleada
			spawnHealthPacksForWave(
				gameStateRef.current,
				gameStateRef.current.currentWave,
				healthPackSprite,
			);

			setWaveMessage(`Wave ${gameStateRef.current.currentWave} starting...`);
			setTimeout(() => {
				setWaveMessage("");
				if (gameStateRef.current) {
					gameStateRef.current.waveTransitioning = false;
				}
			}, 3000);
		},
		[],
	);

	const upgradeWeapon = useCallback(
		(setPlayerCoins: (coins: number) => void) => {
			if (!gameStateRef.current) return;

			const player = gameStateRef.current.player;
			const cost = getSpellUpgradeCost(player.upgrades.spellLevel);
			if (
				player.crystals >= cost &&
				player.upgrades.spellLevel < MAX_UPGRADE_LEVEL
			) {
				player.crystals -= cost;
				player.upgrades.spellLevel++;

				// Incrementar daño base
				player.upgrades.spellDamage += SPELL_DAMAGE_INCREASE;

				// Aplicar mejoras avanzadas según el nivel específico
				switch (player.upgrades.spellLevel) {
					case 1:
						// Nivel 1: Lanzamiento más rápido
						player.upgrades.castRate = 200;
						break;

					case 2:
						// Nivel 2: Doble hechizo + más rápido
						player.upgrades.projectileCount = 2;
						player.upgrades.spread = 0.2;
						player.upgrades.castRate = 180;
						break;

					case 3:
						// Nivel 3: Hechizos más grandes + más rápido
						player.upgrades.projectileSize = 1.5;
						player.upgrades.castRate = 160;
						break;

					case 4:
						// Nivel 4: Triple hechizo
						player.upgrades.projectileCount = 3;
						player.upgrades.spread = 0.3;
						player.upgrades.castRate = 150;
						break;

					case 5:
						// Nivel 5: Máximo poder - cuádruple hechizo con proyectiles enormes
						player.upgrades.projectileCount = 4;
						player.upgrades.spread = 0.4;
						player.upgrades.projectileSize = 2.0;
						player.upgrades.castRate = 120;
						break;
				}

				setPlayerCoins(player.crystals);
			}
		},
		[],
	);

	const upgradeHealth = useCallback(
		(
			setPlayerCoins: (coins: number) => void,
			setPlayerHealth: (health: number) => void,
		) => {
			if (!gameStateRef.current) return;

			const player = gameStateRef.current.player;
			const cost = getHealthUpgradeCost(player.upgrades.healthLevel);
			if (
				player.crystals >= cost &&
				player.upgrades.healthLevel < MAX_UPGRADE_LEVEL
			) {
				player.crystals -= cost;
				player.upgrades.healthLevel++;
				player.upgrades.maxHealth += HEALTH_INCREASE;

				player.maxHealth += HEALTH_INCREASE;

				// Restaurar vida al comprar mejora de vida
				player.health = player.maxHealth;

				setPlayerCoins(player.crystals);
				setPlayerHealth(player.health);
			}
		},
		[],
	);

	// Funciones para manejar configuración de mobs
	const toggleMobType = useCallback(
		(
			mobType: "normal" | "caster" | "tank" | "speed" | "explosive" | "boss",
		) => {
			if (!gameStateRef.current) return;
			gameStateRef.current.mobConfig[mobType] =
				!gameStateRef.current.mobConfig[mobType];
		},
		[],
	);

	const setMobConfig = useCallback(
		(
			config: Partial<{
				normal: boolean;
				caster: boolean;
				tank: boolean;
				speed: boolean;
				explosive: boolean;
				boss: boolean;
			}>,
		) => {
			if (!gameStateRef.current) return;
			gameStateRef.current.mobConfig = {
				...gameStateRef.current.mobConfig,
				...config,
			};
		},
		[],
	);

	const getMobConfig = useCallback(() => {
		return (
			gameStateRef.current?.mobConfig || {
				normal: true, // ✅ Tiene sprites
				caster: true, // ✅ Tiene sprites (mage)
				tank: true, // ✅ Habilitado - usa sprites de normal pero más grande
				speed: false, // ❌ Sin sprites aún
				explosive: false, // ❌ Sin sprites aún
				boss: true, // ✅ Usa sprites de mage temporalmente
			}
		);
	}, []);

	const togglePause = useCallback(() => {
		if (!gameStateRef.current) return;
		gameStateRef.current.isPaused = !gameStateRef.current.isPaused;
	}, []);

	return {
		gameStateRef,
		initializeGameState,
		resetGameState,
		startNextWave,
		continueFromMarketplace,
		upgradeWeapon,
		upgradeHealth,
		toggleMobType,
		setMobConfig,
		getMobConfig,
		togglePause,
	};
};
