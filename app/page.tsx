"use client"

import React from "react"
import { useLeaderboard } from '@/hooks/useLeaderboard'
import { HomeScreen } from '@/components/HomeScreen'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()
  const { topScores, allScores, totalGamesPlayed, isLoading: isLoadingScores } = useLeaderboard()

  const handleStartGame = () => {
    router.push('/game')
  }

  return (
    <HomeScreen
      onStartGame={handleStartGame}
      topScores={topScores}
      allScores={allScores}
      totalGamesPlayed={totalGamesPlayed}
      isLoadingScores={isLoadingScores}
    />
  )
} 