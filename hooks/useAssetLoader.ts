import { useCallback, useRef } from "react";

interface AssetLoaderReturn {
	loadAssets: () => Promise<{
		playerSprites: { [key: string]: HTMLImageElement | null };
		creatureSprites: { [key: string]: HTMLImageElement | null };
		floorTexture: HTMLImageElement | null;
		healthPackSprite: HTMLImageElement | null;
	}>;
	creatureSpritesRef: React.RefObject<{
		[key: string]: HTMLImageElement | null;
	}>;
	playerSpritesRef: React.RefObject<{ [key: string]: HTMLImageElement | null }>;
	floorTextureRef: React.RefObject<HTMLImageElement | null>;
	healthPackSpriteRef: React.RefObject<HTMLImageElement | null>;
}

export function useAssetLoader(): AssetLoaderReturn {
	const playerSpritesRef = useRef<{ [key: string]: HTMLImageElement | null }>({
		// Wizard sprites for player (with wizard_ prefix)
		wizard_N_S: null, // North Standing
		wizard_N_W_L: null, // North Walking Left
		wizard_N_W_R: null, // North Walking Right
		wizard_S_S: null, // South Standing
		wizard_S_W_L: null, // South Walking Left
		wizard_S_W_R: null, // South Walking Right
		wizard_E_S: null, // East Standing
		wizard_E_W_L: null, // East Walking Left
		wizard_E_W_R: null, // East Walking Right
		wizard_O_S: null, // West Standing
		wizard_O_W_L: null, // West Walking Left
		wizard_O_W_R: null, // West Walking Right
	});

	const creatureSpritesRef = useRef<{ [key: string]: HTMLImageElement | null }>(
		{
			// Mage sprites for caster creatures (with mage_ prefix)
			mage_N_S: null, // North Standing
			mage_N_W_L: null, // North Walking Left
			mage_N_W_R: null, // North Walking Right
			mage_S_S: null, // South Standing
			mage_S_W_L: null, // South Walking Left
			mage_S_W_R: null, // South Walking Right
			mage_E_S: null, // East Standing
			mage_E_W_L: null, // East Walking Left
			mage_E_W_R: null, // East Walking Right
			mage_O_S: null, // West Standing
			mage_O_W_L: null, // West Walking Left
			mage_O_W_R: null, // West Walking Right

			// Creature sprites for normal creatures (with creature_ prefix)
			creature_N_S: null, // North Standing
			creature_N_W_L: null, // North Walking Left
			creature_N_W_R: null, // North Walking Right
			creature_S_S: null, // South Standing
			creature_S_W_L: null, // South Walking Left
			creature_S_W_R: null, // South Walking Right
			creature_E_S: null, // East Standing
			creature_E_W_L: null, // East Walking Left
			creature_E_W_R: null, // East Walking Right
			creature_O_S: null, // West Standing
			creature_O_W_L: null, // West Walking Left
			creature_O_W_R: null, // West Walking Right
		},
	);

	const floorTextureRef = useRef<HTMLImageElement | null>(null);
	const healthPackSpriteRef = useRef<HTMLImageElement | null>(null);

	const loadAssets = useCallback(async () => {
		// Cargar sprites del wizard para el player
		const wizardSprites = [
			"N_S",
			"N_W_L",
			"N_W_R",
			"S_S",
			"S_W_L",
			"S_W_R",
			"E_S",
			"E_W_L",
			"E_W_R",
			"O_S",
			"O_W_L",
			"O_W_R",
		];

		const playerPromises = wizardSprites.map((spriteName) => {
			return new Promise<void>((resolve, reject) => {
				const img = new Image();
				img.onload = () => {
					playerSpritesRef.current[`wizard_${spriteName}`] = img;
					resolve();
				};
				img.onerror = reject;
				img.src = `/wizard/${spriteName}.png`;
			});
		});

		// Cargar sprites del mago para casters
		const mageSprites = [
			"N_S",
			"N_W_L",
			"N_W_R",
			"S_S",
			"S_W_L",
			"S_W_R",
			"E_S",
			"E_W_L",
			"E_W_R",
			"O_S",
			"O_W_L",
			"O_W_R",
		];

		const magePromises = mageSprites.map((spriteName) => {
			return new Promise<void>((resolve, reject) => {
				const img = new Image();
				img.onload = () => {
					creatureSpritesRef.current[`mage_${spriteName}`] = img;
					resolve();
				};
				img.onerror = reject;
				img.src = `/mage/${spriteName}.png`;
			});
		});

		// Cargar sprites de las criaturas normales
		const creatureSprites = [
			"N_S",
			"N_W_L",
			"N_W_R",
			"S_S",
			"S_W_L",
			"S_W_R",
			"E_S",
			"E_W_L",
			"E_W_R",
			"O_S",
			"O_W_L",
			"O_W_R",
		];

		const creaturePromises = creatureSprites.map((spriteName) => {
			return new Promise<void>((resolve, reject) => {
				const img = new Image();
				img.onload = () => {
					creatureSpritesRef.current[`creature_${spriteName}`] = img;
					resolve();
				};
				img.onerror = reject;
				img.src = `/creature/${spriteName}.png`;
			});
		});

		// Cargar textura del suelo
		const floorPromise = new Promise<void>((resolve, reject) => {
			const img = new Image();
			img.onload = () => {
				floorTextureRef.current = img;
				resolve();
			};
			img.onerror = reject;
			img.src = "/floor-texture.png";
		});

		// Cargar sprite del pack de vida
		const healthPackPromise = new Promise<void>((resolve, reject) => {
			const img = new Image();
			img.onload = () => {
				healthPackSpriteRef.current = img;
				resolve();
			};
			img.onerror = reject;
			img.src = "/health/health.png";
		});

		await Promise.all([
			...playerPromises,
			...magePromises,
			...creaturePromises,
			floorPromise,
			healthPackPromise,
		]);

		return {
			playerSprites: playerSpritesRef.current,
			creatureSprites: creatureSpritesRef.current,
			floorTexture: floorTextureRef.current,
			healthPackSprite: healthPackSpriteRef.current,
		};
	}, []);

	return {
		loadAssets,
		creatureSpritesRef,
		playerSpritesRef,
		floorTextureRef,
		healthPackSpriteRef,
	};
}
