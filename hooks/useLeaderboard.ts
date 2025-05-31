import { useState, useEffect, useCallback } from 'react'
import { LeaderboardEntry, ScoreSubmission } from '@/types/game'
import { getTopScores, getAllScores, saveScore, getScoreRank } from '@/utils/leaderboard'

export function useLeaderboard() {
  const [topScores, setTopScores] = useState<LeaderboardEntry[]>([])
  const [allScores, setAllScores] = useState<LeaderboardEntry[]>([])
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

  // Enviar nuevo score
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

  // Obtener ranking de un score
  const getRankForScore = useCallback(async (score: number): Promise<number> => {
    try {
      return await getScoreRank(score)
    } catch (error) {
      console.error('Error getting score rank:', error)
      return 0
    }
  }, [])

  // Cargar scores iniciales
  useEffect(() => {
    loadTopScores()
    loadAllScores()
  }, [loadTopScores, loadAllScores])

  return {
    topScores,
    allScores,
    isLoading,
    isSubmitting,
    loadTopScores,
    loadAllScores,
    submitScore,
    getRankForScore
  }
} 