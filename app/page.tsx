"use client"

import React from "react"
import { useLeaderboard } from '@/hooks/useLeaderboard'
import { HomeScreen } from '@/components/HomeScreen'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()
  const { topScores, allScores, isLoading: isLoadingScores } = useLeaderboard()

  const handleStartGame = () => {
    router.push('/game')
  }

  const handleSettings = () => {
    router.push('/settings')
  }

  const handleCredits = () => {
    router.push('/credits')
  }

  return (
    <HomeScreen
      onStartGame={handleStartGame}
      onSettings={handleSettings}
      onCredits={handleCredits}
      topScores={topScores}
      allScores={allScores}
      isLoadingScores={isLoadingScores}
    />
  )
} 