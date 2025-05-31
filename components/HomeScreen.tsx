import { Leaderboard } from './Leaderboard'
import { LeaderboardEntry } from '@/types/game'
import { useState, useEffect } from 'react'
import { useUISound } from '@/hooks/useUISound'

interface HomeScreenProps {
  onStartGame: () => void
  topScores: LeaderboardEntry[]
  allScores: LeaderboardEntry[]
  isLoadingScores: boolean
}

// Floating particles component
function FloatingParticles() {
  const [particles, setParticles] = useState<Array<{
    id: number
    x: number
    y: number
    size: number
    duration: number
    delay: number
  }>>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // Only generate particles on the client side to avoid hydration mismatch
    setIsClient(true)
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5
    }))
    setParticles(newParticles)
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute bg-orange-300/20 rounded-full animate-float"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

export function HomeScreen({ 
  onStartGame, 
  topScores, 
  allScores, 
  isLoadingScores 
}: HomeScreenProps) {
  const [currentMenuItem, setCurrentMenuItem] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  const [showCredits, setShowCredits] = useState(false)
  const [animateTitle, setAnimateTitle] = useState(false)
  const { 
    playHover, 
    playSelect, 
    playBack, 
    playStart, 
    startMenuMusic, 
    stopMenuMusic, 
    audioSettings, 
    updateAudioSettings 
  } = useUISound()

  useEffect(() => {
    setAnimateTitle(true)
    // Start ambient menu music
    const stopMusic = startMenuMusic()
    return stopMusic
  }, [startMenuMusic])

  // Stop music when audio is disabled
  useEffect(() => {
    if (!audioSettings.musicEnabled) {
      stopMenuMusic()
    } else {
      const stopMusic = startMenuMusic()
      return stopMusic
    }
  }, [audioSettings.musicEnabled, startMenuMusic, stopMenuMusic])

  const menuItems = [
    { 
      id: 'start', 
      label: 'START GAME', 
      action: () => {
        playStart()
        setTimeout(onStartGame, 300) // Delay for sound effect
      }, 
      icon: '🎮' 
    },
    { id: 'leaderboard', label: 'LEADERBOARD', action: () => playSelect(), icon: '🏆' },
    { 
      id: 'settings', 
      label: 'SETTINGS', 
      action: () => {
        playSelect()
        setShowSettings(true)
      }, 
      icon: '⚙️' 
    },
    { 
      id: 'credits', 
      label: 'CREDITS', 
      action: () => {
        playSelect()
        setShowCredits(true)
      }, 
      icon: '👥' 
    }
  ]

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      playHover()
      setCurrentMenuItem(prev => prev > 0 ? prev - 1 : menuItems.length - 1)
    } else if (e.key === 'ArrowDown') {
      playHover()
      setCurrentMenuItem(prev => prev < menuItems.length - 1 ? prev + 1 : 0)
    } else if (e.key === 'Enter') {
      menuItems[currentMenuItem].action()
    }
  }

  const handleMenuItemHover = (index: number) => {
    if (index !== currentMenuItem) {
      playHover()
      setCurrentMenuItem(index)
    }
  }

  const toggleMusicSetting = () => {
    updateAudioSettings({ musicEnabled: !audioSettings.musicEnabled })
    playSelect()
  }

  const toggleSfxSetting = () => {
    updateAudioSettings({ sfxEnabled: !audioSettings.sfxEnabled })
    // Don't play sound here since we're toggling SFX
  }

  if (showSettings) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <FloatingParticles />
        <div className="bg-black/80 backdrop-blur-sm border border-orange-500/30 rounded-lg p-8 max-w-2xl w-full mx-4 transform animate-fade-in">
          <h2 className="text-4xl font-bold text-orange-400 mb-6 text-center font-mono">SETTINGS</h2>
          <div className="space-y-4 text-white">
            
            {/* Music Setting */}
            <button
              onClick={toggleMusicSetting}
              className="w-full flex justify-between items-center border-b border-gray-600 pb-2 hover:border-orange-500/50 transition-colors"
            >
              <span>Background Music</span>
              <span className={audioSettings.musicEnabled ? "text-green-400" : "text-red-400"}>
                {audioSettings.musicEnabled ? "ON" : "OFF"}
              </span>
            </button>

            {/* SFX Setting */}
            <button
              onClick={toggleSfxSetting}
              className="w-full flex justify-between items-center border-b border-gray-600 pb-2 hover:border-orange-500/50 transition-colors"
            >
              <span>Sound Effects</span>
              <span className={audioSettings.sfxEnabled ? "text-green-400" : "text-red-400"}>
                {audioSettings.sfxEnabled ? "ON" : "OFF"}
              </span>
            </button>

            {/* Other Settings */}
            <div className="flex justify-between items-center border-b border-gray-600 pb-2 hover:border-orange-500/50 transition-colors">
              <span>Graphics Quality</span>
              <span className="text-orange-400">HIGH</span>
            </div>
            
            <div className="flex justify-between items-center border-b border-gray-600 pb-2 hover:border-orange-500/50 transition-colors">
              <span>Controls</span>
              <span className="text-orange-400">WASD + Mouse</span>
            </div>
            
            <div className="flex justify-between items-center border-b border-gray-600 pb-2 hover:border-orange-500/50 transition-colors">
              <span>Fullscreen</span>
              <span className="text-orange-400">OFF</span>
            </div>
          </div>
          
          {/* Audio Status Indicator */}
          <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-600">
            <h3 className="text-orange-300 font-mono text-sm mb-2">AUDIO STATUS</h3>
            <div className="text-xs text-gray-400 space-y-1">
              <p>🎵 Music: <span className={audioSettings.musicEnabled ? "text-green-400" : "text-red-400"}>{audioSettings.musicEnabled ? "Enabled" : "Disabled"}</span></p>
              <p>🔊 SFX: <span className={audioSettings.sfxEnabled ? "text-green-400" : "text-red-400"}>{audioSettings.sfxEnabled ? "Enabled" : "Disabled"}</span></p>
            </div>
          </div>

          <button
            onClick={() => {
              playBack()
              setShowSettings(false)
            }}
            className="mt-6 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-mono transition-all duration-200 transform hover:scale-105"
          >
            BACK
          </button>
        </div>
      </div>
    )
  }

  if (showCredits) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <FloatingParticles />
        <div className="bg-black/80 backdrop-blur-sm border border-orange-500/30 rounded-lg p-8 max-w-2xl w-full mx-4 transform animate-fade-in">
          <h2 className="text-4xl font-bold text-orange-400 mb-6 text-center font-mono">CREDITS</h2>
          <div className="space-y-6 text-white text-center">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-orange-300">Game Development</h3>
              <p className="text-gray-300">Game Jam Paisanos Team</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-orange-300">Art & Design</h3>
              <p className="text-gray-300">Pixel Art Zombies & UI</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-orange-300">Programming</h3>
              <p className="text-gray-300">React + TypeScript + Canvas</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-orange-300">Inspiration</h3>
              <p className="text-gray-300">Call of Duty: Black Ops 2 Zombies</p>
            </div>
            <div className="pt-4 border-t border-gray-600">
              <p className="text-gray-400">Made with ❤️ for Game Jam</p>
              <p className="text-gray-500 text-sm mt-2">© 2024 Game Jam Paisanos</p>
            </div>
          </div>
          <button
            onClick={() => {
              playBack()
              setShowCredits(false)
            }}
            className="mt-6 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-mono transition-all duration-200 transform hover:scale-105"
          >
            BACK
          </button>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black"
      onKeyDown={handleKeyPress}
      tabIndex={0}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Smoke/Fog effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,140,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,140,0,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
        
        {/* Floating particles */}
        <FloatingParticles />
      </div>

      <div className="relative z-10 flex h-screen">
        {/* Left Side - Title and Menu */}
        <div className="w-1/2 flex flex-col justify-center pl-16">
          {/* Title */}
          <div className="mb-16">
            <h1 className={`text-8xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-b from-orange-400 to-red-600 transform transition-all duration-1000 ${animateTitle ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              ZOMBIES
            </h1>
            <div className="flex items-center mt-4">
              <div className="w-16 h-1 bg-orange-500 animate-pulse"></div>
              <span className="text-gray-400 ml-4 font-mono">OFFLINE</span>
              <div className="ml-4 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
              {/* Audio indicator */}
              <div className="ml-4 flex items-center space-x-1">
                <span className={`text-xs ${audioSettings.musicEnabled ? 'text-green-400' : 'text-gray-500'}`}>♪</span>
                <span className={`text-xs ${audioSettings.sfxEnabled ? 'text-green-400' : 'text-gray-500'}`}>🔊</span>
              </div>
            </div>
          </div>

          {/* Menu */}
          <div className="space-y-4">
            {menuItems.map((item, index) => (
              <button
                key={item.id}
                onClick={item.action}
                onMouseEnter={() => handleMenuItemHover(index)}
                className={`flex items-center space-x-4 text-2xl font-mono transition-all duration-200 group ${
                  currentMenuItem === index 
                    ? 'text-orange-400 transform translate-x-4' 
                    : 'text-gray-300 hover:text-orange-300'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span className="tracking-wider">{item.label}</span>
                {currentMenuItem === index && (
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                )}
                {currentMenuItem === index && (
                  <div className="absolute -left-4 w-1 h-8 bg-orange-500 animate-pulse"></div>
                )}
              </button>
            ))}
          </div>

          {/* Survival Stats */}
          <div className="mt-12 space-y-2">
            <div className="text-gray-500 font-mono text-sm space-y-1">
              <p className="hover:text-orange-400 transition-colors">🎯 Elimina zombies para conseguir puntos</p>
              <p className="hover:text-orange-400 transition-colors">🏃 Muévete con WASD</p>
              <p className="hover:text-orange-400 transition-colors">🌊 Sobrevive el mayor número de waves</p>
            </div>
          </div>
        </div>

        {/* Right Side - Leaderboard & Game Info */}
        <div className="w-1/2 flex flex-col justify-center pr-16">
          {/* Current Wave Display */}
          <div className="mb-8 bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-lg p-6 hover:border-orange-500/50 transition-colors">
            <h3 className="text-xl font-mono text-orange-400 mb-2">CURRENT STATUS</h3>
            <div className="space-y-2 text-white font-mono">
              <div className="flex justify-between">
                <span>Best Wave:</span>
                <span className="text-orange-400">{topScores[0]?.waves_survived || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>High Score:</span>
                <span className="text-orange-400">{topScores[0]?.score || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Players:</span>
                <span className="text-orange-400">{allScores.length}</span>
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-lg overflow-hidden hover:border-orange-500/50 transition-colors">
            <Leaderboard
              topScores={topScores}
              allScores={allScores}
              isLoading={isLoadingScores}
            />
          </div>

          {/* Game Info */}
          <div className="mt-6 text-center">
            <div className="bg-black/60 backdrop-blur-sm border border-orange-500/20 rounded-lg p-4 hover:border-orange-500/40 transition-colors">
              <p className="text-gray-400 font-mono text-sm">
                Un shooter 2D con pixel art
              </p>
              <p className="text-gray-400 font-mono text-sm">
                Cada wave se vuelve más desafiante
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom HUD Elements */}
      <div className="absolute bottom-0 left-0 right-0 p-8">
        <div className="flex justify-between items-end">

          {/* Controls Hint */}
          <div className="bg-black/60 backdrop-blur-sm border border-orange-500/30 rounded-lg p-4 hover:border-orange-500/50 transition-colors">
            <p className="text-gray-400 font-mono text-xs">
              Use ↑↓ keys or mouse to navigate
            </p>
            <p className="text-gray-400 font-mono text-xs">
              Press ENTER to select
            </p>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-gray-500 font-mono text-sm">
              Hecho con ❤️ para Game Jam Paisanos
            </p>
          </div>
        </div>
      </div>

      {/* Animated HUD Elements */}
      <div className="absolute top-4 right-4 space-y-2">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`w-8 h-2 bg-orange-500/20 rounded animate-pulse`}
            style={{ animationDelay: `${i * 200}ms` }}
          ></div>
        ))}
      </div>

      {/* Corner decorative elements */}
      <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-orange-500/30"></div>
      <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-orange-500/30"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-orange-500/30"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-orange-500/30"></div>
    </div>
  )
} 