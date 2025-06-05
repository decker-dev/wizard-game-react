import type { CrystalParticle } from "@/types/game";

export const createCoinParticle = (
	x: number,
	y: number,
	crystals: number,
): CrystalParticle => {
	return {
		id: `coin-${Date.now()}-${Math.random()}`,
		x: x + (Math.random() - 0.5) * 40, // Spread horizontally
		y: y + (Math.random() - 0.5) * 20, // Spread vertically
		vx: (Math.random() - 0.5) * 4, // Random horizontal velocity
		vy: -2 - Math.random() * 2, // Upward velocity with some randomness
		alpha: 1,
		scale: 1,
		crystals,
	};
};

export const updateCoinParticles = (
	particles: CrystalParticle[],
): CrystalParticle[] => {
	return particles.filter((particle) => {
		particle.x += particle.vx;
		particle.y += particle.vy;
		particle.vy += 0.15; // gravity
		particle.alpha -= 0.015;
		particle.scale = Math.max(0, particle.scale - 0.008);

		return particle.alpha > 0 && particle.scale > 0;
	});
};
