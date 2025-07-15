import type { Metadata, Viewport } from "next";
import "./globals.css";
import {
	metadata as gameMetadata,
	viewport as gameViewport,
} from "@/lib/metadata";
import { Press_Start_2P } from "next/font/google";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { Analytics } from "better-analytics/next";

const pressStart2P = Press_Start_2P({
	weight: "400",
	subsets: ["latin"],
	variable: "--font-pixel",
	display: "swap",
});

export const metadata: Metadata = gameMetadata;
export const viewport: Viewport = gameViewport;

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="h-full">
			<body className={`${pressStart2P.variable} h-full overflow-hidden`}>
				{children}
			</body>
			<Analytics />
			<VercelAnalytics />
		</html>
	);
}
