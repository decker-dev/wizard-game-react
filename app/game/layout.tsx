"use client";

import { useEffect } from "react";

export default function GameLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	useEffect(() => {
		// Apply overflow-hidden to body specifically for game pages
		document.body.classList.add("game-page-body");
		
		// Cleanup when leaving the game page
		return () => {
			document.body.classList.remove("game-page-body");
		};
	}, []);

	return <>{children}</>;
} 