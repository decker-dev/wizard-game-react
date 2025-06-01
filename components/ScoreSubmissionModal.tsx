import { useState, useCallback } from 'react'
import { ScoreSubmission } from '@/types/game'

interface ScoreSubmissionModalProps {
  score: number
  wavesSurvived: number
  isVisible: boolean
  onSubmit: (scoreData: ScoreSubmission) => Promise<boolean>
  onSkip: () => void
  isSubmitting: boolean
}

export function ScoreSubmissionModal({
  score,
  wavesSurvived,
  isVisible,
  onSubmit,
  onSkip,
  isSubmitting
}: ScoreSubmissionModalProps) {
  const [playerName, setPlayerName] = useState('')
  const [isSubmittingState, setIsSubmittingState] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState<boolean | null>(null)

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!playerName.trim()) {
      return
    }

    setIsSubmittingState(true)
    setSubmitSuccess(null)

    const scoreData: ScoreSubmission = {
      player_name: playerName.trim(),
      score,
      waves_survived: wavesSurvived
    }

    try {
      const success = await onSubmit(scoreData)
      setSubmitSuccess(success)
      
      if (success) {
        // Wait a moment to show success message
        setTimeout(() => {
          onSkip() // Close the modal
        }, 1500)
      }
    } catch (error) {
      setSubmitSuccess(false)
    } finally {
      setIsSubmittingState(false)
    }
  }, [playerName, score, wavesSurvived, onSubmit, onSkip])

  const handleSkip = useCallback(() => {
    setPlayerName('')
    setSubmitSuccess(null)
    onSkip()
  }, [onSkip])

  if (!isVisible) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">
          Save Your Score!
        </h2>
        
        <div className="text-center mb-6">
          <div className="text-yellow-400 text-xl font-semibold mb-2">
            Creatures Defeated: {score}
          </div>
          <div className="text-blue-400 text-lg">
            Waves Survived: {wavesSurvived}
          </div>
        </div>

        {submitSuccess === null && (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="playerName" className="block text-white text-sm font-medium mb-2">
                  Your Name:
                </label>
                <input
                  id="playerName"
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Enter your name"
                  maxLength={50}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmittingState || isSubmitting}
                  autoFocus
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={!playerName.trim() || isSubmittingState || isSubmitting}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded transition-colors"
                >
                  {isSubmittingState || isSubmitting ? 'Saving...' : 'Save Score'}
                </button>
                <button
                  type="button"
                  onClick={handleSkip}
                  disabled={isSubmittingState || isSubmitting}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded transition-colors"
                >
                  Skip
                </button>
              </div>
            </form>
          </>
        )}

        {submitSuccess === true && (
          <div className="text-center">
            <div className="text-green-400 text-lg font-semibold mb-2">
              Score saved successfully!
            </div>
            <div className="text-gray-300">
              Closing...
            </div>
          </div>
        )}

        {submitSuccess === false && (
          <div className="text-center space-y-4">
            <div className="text-red-400 text-lg font-semibold">
              Error saving score
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setSubmitSuccess(null)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Retry
              </button>
              <button
                onClick={handleSkip}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Skip
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 