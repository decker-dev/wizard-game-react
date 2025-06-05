import type React from "react";
import { FloatingParticles } from "./FloatingParticles";

export function LoadingScreen() {
	return (
		<div className="min-h-dvh relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
			{/* Background Elements */}
			<div className="absolute inset-0">
				<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
				<div className="absolute top-0 left-0 w-full h-full opacity-20">
					<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
					<div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
				</div>
				<div className="absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
				<FloatingParticles />
			</div>

			{/* Loading Content */}
			<div className="relative z-10 flex flex-col items-center justify-center min-h-dvh p-4">
				<div className="bg-black/60 backdrop-blur-sm border border-purple-500/30 rounded-lg p-8 hover:border-purple-500/50 transition-colors">
					<h2 className="text-4xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-b from-purple-400 to-blue-600 mb-6">
						LOADING MYSTIC REALM
					</h2>

					<div className="flex flex-col items-center space-y-4">
						<p className="text-gray-300 font-mono text-lg">
							Preparing the magical realm...
						</p>

						{/* Loading Animation */}
						<div className="flex space-x-2">
							{[0, 1, 2].map((i) => (
								<div
									key={i}
									className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"
									style={{ animationDelay: `${i * 0.2}s` }}
								/>
							))}
						</div>
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
