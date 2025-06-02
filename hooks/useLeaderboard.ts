import { useState, useEffect, useCallback } from 'react'
import { LeaderboardEntry, ScoreSubmission } from '@/types/game'
import { getTopScores, getAllScores, saveScore, getScoreRank, recordGameStarted, getTotalGamesPlayed } from '@/utils/leaderboard'
import { generateTimeWindowHash } from '@/utils/security'

export interface SecureScoreSubmission extends ScoreSubmission {
  client_id: string;
  timestamp: number;
  time_window_hash: string;
  game_duration: number;
  crystals_earned: number;
  spell_level: number;
  health_level: number;
  game_start_time: number;
}

export function useLeaderboard() {
  const [topScores, setTopScores] = useState<LeaderboardEntry[]>([])
  const [allScores, setAllScores] = useState<LeaderboardEntry[]>([])
  const [totalGamesPlayed, setTotalGamesPlayed] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Cargar top scores
  const loadTopScores = useCallback(async () => {
    setIsLoading(true)
    try {
      const scores = await getTopScores()
      setTopScores(scores)
    } catch (error) {
      console.error('Error loading top scores:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Cargar todos los scores
  const loadAllScores = useCallback(async () => {
    setIsLoading(true)
    try {
      const scores = await getAllScores()
      setAllScores(scores)
    } catch (error) {
      console.error('Error loading all scores:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Cargar total de partidas jugadas
  const loadTotalGamesPlayed = useCallback(async () => {
    try {
      const total = await getTotalGamesPlayed()
      setTotalGamesPlayed(total)
    } catch (error) {
      console.error('Error loading total games played:', error)
    }
  }, [])

  // Enviar nuevo score (legacy - mantener compatibilidad)
  const submitScore = useCallback(async (scoreData: ScoreSubmission): Promise<boolean> => {
    setIsSubmitting(true)
    try {
      const success = await saveScore(scoreData)
      if (success) {
        // Recargar los scores después de enviar uno nuevo
        await loadTopScores()
        await loadAllScores()
      }
      return success
    } catch (error) {
      console.error('Error submitting score:', error)
      return false
    } finally {
      setIsSubmitting(false)
    }
  }, [loadTopScores, loadAllScores])

  // Enviar score seguro (nueva función)
  const submitSecureScore = useCallback(async (
    scoreData: ScoreSubmission,
    clientId: string,
    gameData: {
      wavesSurvived: number;
      crystalsEarned: number;
      gameStartTime: number;
      gameDuration: number;
      spellLevel: number;
      healthLevel: number;
    }
  ): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      const timestamp = Date.now();

      const timeWindowHash = generateTimeWindowHash(
        scoreData.score,
        timestamp,
        clientId,
        gameData
      );

      const securePayload: SecureScoreSubmission = {
        ...scoreData,
        client_id: clientId,
        timestamp,
        time_window_hash: timeWindowHash,
        game_duration: gameData.gameDuration,
        crystals_earned: gameData.crystalsEarned,
        spell_level: gameData.spellLevel,
        health_level: gameData.healthLevel,
        game_start_time: gameData.gameStartTime
      };

      // Enviar al API route de Next.js
      const response = await fetch('/api/validate-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(securePayload)
      });

      const success = response.ok;
      if (success) {
        await loadTopScores();
        await loadAllScores();
      }
      return success;
    } catch (error) {
      console.error('Error submitting secure score:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [loadTopScores, loadAllScores]);

  // Registrar nueva partida iniciada
  const recordNewGame = useCallback(async (): Promise<boolean> => {
    try {
      const success = await recordGameStarted()
      if (success) {
        // Actualizar el contador local
        await loadTotalGamesPlayed()
      }
      return success
    } catch (error) {
      console.error('Error recording new game:', error)
      return false
    }
  }, [loadTotalGamesPlayed])

  // Obtener ranking de un score
  const getRankForScore = useCallback(async (score: number): Promise<number> => {
    try {
      return await getScoreRank(score)
    } catch (error) {
      console.error('Error getting score rank:', error)
      return 0
    }
  }, [])

  // Cargar datos iniciales
  useEffect(() => {
    loadTopScores()
    loadAllScores()
    loadTotalGamesPlayed()
  }, [loadTopScores, loadAllScores, loadTotalGamesPlayed])

  return {
    topScores,
    allScores,
    totalGamesPlayed,
    isLoading,
    isSubmitting,
    loadTopScores,
    loadAllScores,
    loadTotalGamesPlayed,
    submitScore,
    submitSecureScore,
    recordNewGame,
    getRankForScore
  }
} 