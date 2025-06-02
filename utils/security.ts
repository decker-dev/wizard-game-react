// Clave secreta embebida (en producción debería estar en env)
const SECRET_KEY = "mystic-realm-secret-2024-magic-defender";

export function generateTimeWindowHash(
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
  }
): string {
  const dataToHash = [
    score.toString(),
    timestamp.toString(),
    clientId,
    SECRET_KEY,
    gameData?.wavesSurvived.toString() || '',
    gameData?.crystalsEarned.toString() || '',
    gameData?.gameStartTime.toString() || '',
    gameData?.gameDuration.toString() || '',
    gameData?.spellLevel.toString() || '',
    gameData?.healthLevel.toString() || ''
  ].join('|');

  // Usar crypto nativo del navegador para el cliente
  return btoa(dataToHash); // Placeholder - el hash real se genera en el servidor
}

export function generateClientId(): string {
  return crypto.randomUUID();
} 