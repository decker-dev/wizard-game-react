import type { Metadata, Viewport } from "next";

const siteUrl = "https://mystic.decker.sh";

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
	title: {
		default: "MYSTIC REALM DEFENDER - Epic 2D Fantasy Survival Game",
		template: "%s | MYSTIC REALM DEFENDER",
	},
	description:
		"Embark on an epic magical adventure! Defend the mystical realm as a powerful wizard against infinite waves of mythological creatures. Master ancient spells, collect magical crystals, and prove your worth on the global leaderboards in this stunning pixel art fantasy experience.",
	keywords: [
		"mystic realm",
		"fantasy game",
		"magic game",
		"pixel art",
		"wizard game",
		"survival game",
		"mythical creatures",
		"arcane defense",
		"spell casting",
		"magical shooter",
		"fantasy survival",
		"browser game",
		"web game",
		"indie game",
		"retro game",
		"action game",
		"epic adventure",
		"magical realm",
		"infinite waves",
	],
	authors: [
		{ name: "Lauti", url: "https://x.com/lautidev_" },
		{ name: "Alejo", url: "https://x.com/alejorrojass" },
		{ name: "Decker", url: "https://x.com/0xDecker" },
	],
	creator: "Vibe Gaming Hackathon Team",
	publisher: "Vibe Gaming",
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	alternates: {
		canonical: "/",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	category: "games",
	classification: "Game",
	openGraph: {
		type: "website",
		locale: "en_US",
		url: siteUrl,
		title: "🔮 MYSTIC REALM DEFENDER - Epic Fantasy Adventure Awaits!",
		description:
			"Step into the mystical realm and unleash your magical powers! Battle endless waves of mythological creatures, master powerful spells, and become the ultimate realm defender in this captivating pixel art fantasy game.",
		siteName: "MYSTIC REALM DEFENDER",
		images: [
			{
				url: "/og.png",
				width: 1536,
				height: 1024,
				alt: "MYSTIC REALM DEFENDER - Epic Fantasy Gameplay",
				type: "image/png",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "🔮 MYSTIC REALM DEFENDER - Epic Fantasy Adventure!",
		description:
			"Unleash your magical powers and defend the mystical realm! Experience the ultimate pixel art fantasy survival game.",
		images: ["/og.png"],
		creator: "@0xDecker",
	},

	other: {
		"game:credits":
			"Discover the passionate team behind MYSTIC REALM DEFENDER: Lauti, Alejo and Decker. Born from creativity and magic during the first Vibe Gaming Hackathon in LATAM.",
		"game:credits:title":
			"✨ The Wizards Behind the Magic - MYSTIC REALM DEFENDER",
		"game:credits:description":
			"Meet the talented developers who brought this magical realm to life during an epic 24-hour hackathon adventure.",
		"game:leaderboard": `${siteUrl}/leaderboard`,
		"game:leaderboard:title": "🏆 Hall of Legends - MYSTIC REALM DEFENDER",
		"game:leaderboard:description":
			"Ascend to legendary status! Compete with wizards worldwide and etch your name in the mystical hall of fame.",
		"apple-mobile-web-app-capable": "yes",
		"apple-mobile-web-app-status-bar-style": "black-translucent",
		"apple-mobile-web-app-title": "MYSTIC REALM DEFENDER",
		"mobile-web-app-capable": "yes",
		"application-name": "MYSTIC REALM DEFENDER",
		"msapplication-TileColor": "#8A2BE2",
		"theme-color": "#8A2BE2",
	},
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
	// Specific configuration for mobile browsers with navigation bars
	viewportFit: "cover",
	interactiveWidget: "resizes-content",
};

export const jsonLd = {
	"@context": "https://schema.org",
	"@type": "VideoGame",
	name: "MYSTIC REALM DEFENDER",
	description:
		"Embark on an epic magical adventure! Defend the mystical realm as a powerful wizard against infinite waves of mythological creatures in this stunning pixel art fantasy experience.",
	genre: ["Action", "Fantasy", "Survival", "Arcade", "Adventure"],
	gamePlatform: "Web Browser",
	operatingSystem: "Any",
	applicationCategory: "Game",
	offers: {
		"@type": "Offer",
		price: "0",
		priceCurrency: "USD",
	},
	author: {
		"@type": "Organization",
		name: "Vibe Gaming Hackathon Team",
	},
};
