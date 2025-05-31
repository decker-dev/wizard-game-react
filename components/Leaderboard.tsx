import { useState } from 'react'
import { LeaderboardEntry } from '@/types/game'

interface LeaderboardProps {
  topScores: LeaderboardEntry[]
  allScores: LeaderboardEntry[]
  isLoading: boolean
}

export function Leaderboard({ topScores, allScores, isLoading }: LeaderboardProps) {
  const [activeTab, setActiveTab] = useState<'top' | 'all'>('top')

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getMedalIcon = (position: number) => {
    switch (position) {
      case 1:
        return '🥇'
      case 2:
        return '🥈'
      case 3:
        return '🥉'
      default:
        return `#${position}`
    }
  }

  const currentScores = activeTab === 'top' ? topScores : allScores

  if (isLoading) {
    return (
      <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">
          📊 Leaderboard
        </h2>
        <div className="text-center text-gray-400">
          Cargando scores...
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-4 text-center">
        📊 Leaderboard
      </h2>

      {/* Tabs */}
      <div className="flex mb-4 bg-gray-700 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('top')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === 'top'
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          Top 10
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === 'all'
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          Todos los Scores
        </button>
      </div>

      {/* Leaderboard Content */}
      <div className="max-h-96 overflow-y-auto">
        {currentScores.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            {activeTab === 'top' ? 'No hay scores aún' : 'No hay scores guardados'}
          </div>
        ) : (
          <div className="space-y-2">
            {currentScores.map((entry, index) => {
              const position = activeTab === 'top' ? index + 1 : null
              
              return (
                <div
                  key={entry.id}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    position === 1
                      ? 'bg-yellow-900 border border-yellow-600'
                      : position === 2
                      ? 'bg-gray-600 border border-gray-500'
                      : position === 3
                      ? 'bg-orange-900 border border-orange-600'
                      : 'bg-gray-700 border border-gray-600'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {position && (
                      <div className="text-lg font-bold min-w-[3rem]">
                        {getMedalIcon(position)}
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-white">
                        {entry.player_name}
                      </div>
                      <div className="text-sm text-gray-400">
                        {formatDate(entry.created_at)}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-yellow-400 font-bold text-lg">
                      {entry.score.toLocaleString()} zombies
                    </div>
                    <div className="text-blue-400 text-sm">
                      Wave {entry.waves_survived}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Statistics */}
      {allScores.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-600">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-gray-400 text-sm">Total Partidas</div>
              <div className="text-white font-bold">{allScores.length}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">Mejor Score</div>
              <div className="text-yellow-400 font-bold">
                {topScores[0]?.score?.toLocaleString() || '0'}
              </div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">Mejor Wave</div>
              <div className="text-blue-400 font-bold">
                {Math.max(...allScores.map(s => s.waves_survived)) || 0}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 