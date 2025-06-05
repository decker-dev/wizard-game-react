import type React from "react";

interface CoinIconProps {
	className?: string;
	size?: "sm" | "md" | "lg" | "xl";
}

export const CoinIcon: React.FC<CoinIconProps> = ({
	className = "",
	size = "md",
}) => {
	const sizeClasses = {
		sm: "w-4 h-4",
		md: "w-6 h-6",
		lg: "w-8 h-8",
		xl: "w-10 h-10",
	};

	return (
		<img
			src="/vecteezy_game-coin-pixelated_54978935.png"
			alt="coin"
			className={`${sizeClasses[size]} ${className}`}
			style={{ imageRendering: "pixelated" }}
		/>
	);
};
