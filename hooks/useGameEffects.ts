import { useEffect } from 'react'
import { GameScreenState } from './useGameScreens'
import useHandheldDetector from '@/hooks/useHandheldDetector'

interface UseGameEffectsProps {
  screenState: GameScreenState
  handleKeyDownWrapper: (e: KeyboardEvent) => void
  handleKeyUp: (e: KeyboardEvent) => void
  setShowScoreModal: (show: boolean) => void
}

export function useGameEffects({
  screenState,
  handleKeyDownWrapper,
  handleKeyUp,
  setShowScoreModal
}: UseGameEffectsProps) {
  const isMobile = useHandheldDetector()

  // Handle mobile redirect
  useEffect(() => {
    if (isMobile) {
      window.location.href = "https://fork-game-jam-paisanos-pvh5o34m1-alejorrojas-projects.vercel.app/"
    }
  }, [isMobile])

  // Handle game over/won modal
  useEffect(() => {
    if ((screenState.gameOver || screenState.gameWon) && screenState.currentScreen === 'playing') {
      // Mostrar modal de score después de un breve delay
      const timer = setTimeout(() => {
        setShowScoreModal(true)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [screenState.gameOver, screenState.gameWon, screenState.currentScreen, setShowScoreModal])

  // Handle keyboard events for playing screen
  useEffect(() => {
    if (screenState.currentScreen === 'playing') {
      window.addEventListener("keydown", handleKeyDownWrapper)
      window.addEventListener("keyup", handleKeyUp)

      return () => {
        window.removeEventListener("keydown", handleKeyDownWrapper)
        window.removeEventListener("keyup", handleKeyUp)
      }
    }
  }, [handleKeyDownWrapper, handleKeyUp, screenState.currentScreen])
} 