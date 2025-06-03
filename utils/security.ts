// Clave secreta embebida (en producción debería estar en env)
const SECRET_KEY = "mystic-realm-secret-2024-magic-defender";

// Función para generar hash en el servidor
export function generateServerTimeWindowHash(
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

  // Solo funciona en el servidor con Node.js crypto
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(dataToHash).digest('hex');
}

// Función para el cliente - genera un token temporal
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
  // En el cliente, solo generamos un token temporal
  // El servidor generará el hash real para validación
  const tokenData = `${score}_${timestamp}_${clientId.substring(0, 8)}`;
  return `client_token_${btoa(tokenData)}`;
}

export function generateClientId(): string {
  return 'crypto.randomUUID()';
} 