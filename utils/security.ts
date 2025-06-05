// Este archivo solo contiene funciones para el cliente
// Las funciones del servidor están en el API route directamente

// Función para el cliente - genera un token temporal simple
export async function generateTimeWindowHash(
	score: number,
	timestamp: number,
	clientId: string,
	gameData?: {
		wavesSurvived: number;
		crystalsEarned: number;
		gameStartTime: number;
		gameDuration: number;
		spellLevel: number;
		healthLevel: number;
	},
): Promise<string> {
	// Generar el mismo formato que espera el servidor
	const tokenData = `${score}_${timestamp}_${clientId.substring(0, 8)}`;
	return `client_token_${btoa(tokenData)}`;
}

export function generateClientId(): string {
	// En el cliente, usar crypto.randomUUID() del navegador
	if (typeof window !== "undefined" && window.crypto?.randomUUID) {
		return window.crypto.randomUUID();
	}

	// Fallback para navegadores que no soportan randomUUID
	if (typeof window !== "undefined") {
		return `client-${Math.random().toString(36).substring(2)}${Date.now().toString(36)}`;
	}

	// En el servidor, generar ID simple sin crypto
	return `server-${Math.random().toString(36).substring(2)}${Date.now().toString(36)}`;
}
