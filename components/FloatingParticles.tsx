import { useEffect, useState } from "react";

// Floating particles component
export function FloatingParticles() {
	const [particles, setParticles] = useState<
		Array<{
			id: number;
			x: number;
			y: number;
			size: number;
			duration: number;
			delay: number;
		}>
	>([]);
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		// Only generate particles on the client side to avoid hydration mismatch
		setIsClient(true);
		const newParticles = Array.from({ length: 15 }, (_, i) => ({
			id: i,
			x: Math.random() * 100,
			y: Math.random() * 100,
			size: Math.random() * 3 + 1,
			duration: Math.random() * 20 + 10,
			delay: Math.random() * 5,
		}));
		setParticles(newParticles);
	}, []);

	if (!isClient) {
		return null;
	}

	return (
		<div className="absolute inset-0 overflow-hidden pointer-events-none">
			{particles.map((particle) => (
				<div
					key={particle.id}
					className="absolute bg-purple-300/20 rounded-full animate-float"
					style={{
						left: `${particle.x}%`,
						top: `${particle.y}%`,
						width: `${particle.size}px`,
						height: `${particle.size}px`,
						animationDuration: `${particle.duration}s`,
						animationDelay: `${particle.delay}s`,
					}}
				/>
			))}
		</div>
	);
}
