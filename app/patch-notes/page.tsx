"use client";

import { FloatingParticles } from "@/components/FloatingParticles";
import { patchNotes, type PatchNote } from "@/data/patchNotes";
import { usePatchNotesNotification } from "@/hooks/usePatchNotesNotification";
import Link from "next/link";
import React, { useEffect } from "react";

const categoryColors = {
	NEW: "bg-green-500/20 text-green-400 border-green-500/30",
	IMPROVED: "bg-blue-500/20 text-blue-400 border-blue-500/30",
	FIXED: "bg-red-500/20 text-red-400 border-red-500/30",
	BALANCED: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
};

const categoryIcons = {
	NEW: "✨",
	IMPROVED: "⚡",
	FIXED: "🔧",
	BALANCED: "⚖️",
};

function PatchNoteCard({
	patchNote,
	isLatest,
}: { patchNote: PatchNote; isLatest: boolean }) {
	return (
		<div className="bg-black/60 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-[1.02]">
			{/* Header */}
			<div className="flex items-start justify-between mb-4">
				<div className="flex-1">
					<div className="flex items-center gap-3 mb-2">
						<span className="text-2xl font-bold text-purple-400 font-mono">
							{patchNote.version}
						</span>
						{isLatest && (
							<span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs font-mono border border-purple-500/30 rounded">
								LATEST
							</span>
						)}
					</div>
					<h3 className="text-xl font-bold text-white font-mono mb-1">
						{patchNote.title}
					</h3>
					<p className="text-gray-400 font-mono text-sm mb-2">
						{new Date(patchNote.date).toLocaleDateString("en-US", {
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
					</p>
					<p className="text-gray-300 font-mono text-sm">
						{patchNote.description}
					</p>
				</div>
				{patchNote.image && (
					<div className="ml-4 flex-shrink-0">
						<img
							src={patchNote.image}
							alt={`${patchNote.version} preview`}
							className="w-16 h-16 object-contain rounded border border-purple-500/20"
						/>
					</div>
				)}
			</div>

			{/* Changes */}
			<div className="space-y-4">
				{patchNote.changes.map((changeGroup) => (
					<div key={`${patchNote.version}-${changeGroup.category}`}>
						<div
							className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-mono font-bold border ${
								categoryColors[changeGroup.category]
							} mb-3`}
						>
							<span>{categoryIcons[changeGroup.category]}</span>
							{changeGroup.category}
						</div>
						<ul className="space-y-1 ml-4">
							{changeGroup.items.map((item) => (
								<li
									key={`${patchNote.version}-${changeGroup.category}-${item.substring(0, 20)}`}
									className="text-gray-300 font-mono text-sm flex items-start gap-2"
								>
									<span className="text-purple-400 mt-1">•</span>
									<span>{item}</span>
								</li>
							))}
						</ul>
					</div>
				))}
			</div>
		</div>
	);
}

export default function PatchNotesPage() {
	const { markPatchNotesAsSeen } = usePatchNotesNotification();

	// Ensure scrolling is enabled for this page
	useEffect(() => {
		document.body.style.overflow = "auto";
		document.documentElement.style.overflow = "auto";

		// Mark patch notes as seen when user visits the page
		markPatchNotesAsSeen();

		return () => {
			// Reset to default when leaving the page
			document.body.style.overflow = "";
			document.documentElement.style.overflow = "";
		};
	}, [markPatchNotesAsSeen]);

	return (
		<div
			className="min-h-dvh relative bg-gradient-to-br from-gray-900 via-gray-800 to-black"
			style={{
				overflow: "auto",
				height: "auto",
			}}
		>
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

			{/* Patch Notes Content */}
			<div className="relative z-10 p-4 py-8">
				<div className="max-w-4xl mx-auto">
					{/* Header */}
					<div className="text-center mb-8">
						<h1 className="text-5xl font-bold font-pixel text-transparent bg-clip-text bg-gradient-to-b from-purple-400 to-blue-600 mb-4">
							PATCH NOTES
						</h1>
						<p className="text-gray-300 font-mono text-lg">
							Latest updates and improvements to Mystic Realm Defender
						</p>
					</div>
					{/* Top Navigation */}
					<div className="flex justify-between items-center mb-8">
						<Link
							href="/"
							className="px-6 py-3 bg-gray-600/80 hover:bg-gray-600 border border-gray-500/50 text-white font-mono font-bold rounded-lg transition-all duration-200 transform hover:scale-105 hover:border-gray-500"
						>
							← BACK TO HOME
						</Link>
						<a
							href="https://github.com/decker-dev/wizard-game-react"
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-2 px-6 py-3 bg-purple-600/80 hover:bg-purple-600 border border-purple-500/50 text-white font-mono font-bold rounded-lg transition-all duration-200 transform hover:scale-105 hover:border-purple-500"
						>
							<svg
								className="w-5 h-5"
								fill="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
							</svg>
							SOURCE CODE
						</a>
					</div>
					{/* Patch Notes List */}
					<div className="space-y-6 mb-8">
						{patchNotes.map((patchNote, index) => (
							<PatchNoteCard
								key={patchNote.version}
								patchNote={patchNote}
								isLatest={index === 0}
							/>
						))}
					</div>

					{/* Credits Link */}
					<div className="text-center bg-black/40 border border-purple-500/20 rounded-lg p-6">
						<p className="text-gray-300 font-mono mb-4">
							Want to know more about the development team?
						</p>
						<Link
							href="/credits"
							className="inline-block px-6 py-3 bg-purple-600/80 hover:bg-purple-600 border border-purple-500/50 text-white font-mono font-bold rounded-lg transition-all duration-200 transform hover:scale-105 hover:border-purple-500"
						>
							VIEW CREDITS
						</Link>
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
