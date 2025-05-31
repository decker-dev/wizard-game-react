import { supabase } from '@/lib/supabase'
import { LeaderboardEntry, ScoreSubmission } from '@/types/game'

/**
 * Obtiene el top 10 de scores del leaderboard
 */
export async function getTopScores(): Promise<LeaderboardEntry[]> {
  try {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .order('score', { ascending: false })
      .limit(10)

    if (error) {
      console.error('Error fetching top scores:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error fetching top scores:', error)
    return []
  }
}

/**
 * Obtiene todos los scores ordenados por fecha (más recientes primero)
 */
export async function getAllScores(): Promise<LeaderboardEntry[]> {
  try {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching all scores:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error fetching all scores:', error)
    return []
  }
}

/**
 * Guarda un nuevo score en el leaderboard
 */
export async function saveScore(scoreData: ScoreSubmission): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('leaderboard')
      .insert([scoreData])

    if (error) {
      console.error('Error saving score:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error saving score:', error)
    return false
  }
}

/**
 * Obtiene la posición de un score en el ranking
 */
export async function getScoreRank(score: number): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('leaderboard')
      .select('*', { count: 'exact', head: true })
      .gt('score', score)

    if (error) {
      console.error('Error getting score rank:', error)
      return 0
    }

    return (count || 0) + 1
  } catch (error) {
    console.error('Error getting score rank:', error)
    return 0
  }
} 