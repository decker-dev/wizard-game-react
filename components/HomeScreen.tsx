import { Leaderboard } from './Leaderboard'
import { FloatingParticles } from './FloatingParticles'
import { LeaderboardEntry } from '@/types/game'
import { useState, useEffect } from 'react'
import { useUISound } from '@/hooks/useUISound'
import Link from 'next/link'

interface HomeScreenProps {
  onStartGame: () => void
  topScores: LeaderboardEntry[]
  allScores: LeaderboardEntry[]
  isLoadingScores: boolean
}

export function HomeScreen({ 
  onStartGame, 
  topScores, 
  allScores, 
  isLoadingScores 
}: HomeScreenProps) {
  const [currentMenuItem, setCurrentMenuItem] = useState(0)
  const [animateTitle, setAnimateTitle] = useState(false)
  const { 
    playHover, 
    playSelect, 
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
      icon: '🎮',
      href: '/game'
    },
    { 
      id: 'settings', 
      label: 'SETTINGS', 
      action: () => {
        playSelect()
      }, 
      icon: '⚙️',
      href: '/settings'
    },
    { 
      id: 'credits', 
      label: 'CREDITS', 
      action: () => {
        playSelect()
      }, 
      icon: '👥',
      href: '/credits'
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
      const currentItem = menuItems[currentMenuItem]
      if (currentItem.id === 'start') {
        currentItem.action()
      } else {
        // For navigation items, trigger the sound and let the Link handle navigation
        currentItem.action()
        // Simulate click on the link
        const linkElement = document.querySelector(`[data-menu-item="${currentItem.id}"]`) as HTMLAnchorElement
        if (linkElement) {
          setTimeout(() => linkElement.click(), 100)
        }
      }
    }
  }

  const handleMenuItemHover = (index: number) => {
    if (index !== currentMenuItem) {
      playHover()
      setCurrentMenuItem(index)
    }
  }

  const handleMenuItemClick = (item: typeof menuItems[0]) => {
    if (item.id === 'start') {
      item.action()
    } else {
      item.action() // Play sound
    }
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

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="flex flex-col lg:flex-row items-center gap-8 w-full max-w-7xl">
          
          {/* Left Section - Title and Menu */}
          <div className="flex-1 text-center lg:text-left">
            {/* Title */}
            <div className={`mb-8 ${animateTitle ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <h1 className="text-6xl lg:text-8xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-b from-orange-400 to-red-600 mb-4 tracking-wider">
                BOXHEAD
              </h1>
              <h2 className="text-2xl lg:text-4xl font-mono text-orange-300 mb-2">
                ZOMBIE SURVIVAL
              </h2>
              <p className="text-gray-400 text-lg font-mono">
                Survive the apocalypse. Eliminate the hordes.
              </p>
            </div>

            {/* Menu */}
            <div className="space-y-4">
              {menuItems.map((item, index) => {
                const isSelected = index === currentMenuItem
                const baseClassName = `
                  group w-full max-w-md mx-auto lg:mx-0 p-4 rounded-lg font-mono font-bold text-xl
                  transition-all duration-300 transform border-2 block
                  ${isSelected 
                    ? 'bg-orange-600/80 border-orange-500 text-white scale-105 shadow-lg shadow-orange-500/50' 
                    : 'bg-black/40 border-orange-500/30 text-orange-300 hover:bg-orange-600/20 hover:border-orange-500/60 hover:scale-102'
                  }
                  backdrop-blur-sm
                `

                if (item.id === 'start') {
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleMenuItemClick(item)}
                      onMouseEnter={() => handleMenuItemHover(index)}
                      className={baseClassName}
                      type="button"
                    >
                      <div className="flex items-center justify-center lg:justify-start gap-3">
                        <span className="text-2xl">{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                    </button>
                  )
                } else {
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => handleMenuItemClick(item)}
                      onMouseEnter={() => handleMenuItemHover(index)}
                      className={baseClassName}
                      data-menu-item={item.id}
                    >
                      <div className="flex items-center justify-center lg:justify-start gap-3">
                        <span className="text-2xl">{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                    </Link>
                  )
                }
              })}
            </div>

            {/* Audio Status */}
            <div className="mt-8 p-4 bg-black/40 backdrop-blur-sm border border-orange-500/20 rounded-lg max-w-md mx-auto lg:mx-0">
              <h3 className="text-orange-300 font-mono text-sm mb-2">🎵 AUDIO STATUS</h3>
              <div className="text-xs text-gray-400 space-y-1">
                <p>Music: <span className={audioSettings.musicEnabled ? "text-green-400" : "text-red-400"}>{audioSettings.musicEnabled ? "ON" : "OFF"}</span></p>
                <p>SFX: <span className={audioSettings.sfxEnabled ? "text-green-400" : "text-red-400"}>{audioSettings.sfxEnabled ? "ON" : "OFF"}</span></p>
              </div>
            </div>

            {/* Game Instructions */}
            <div className="mt-6 p-4 bg-black/40 backdrop-blur-sm border border-orange-500/20 rounded-lg max-w-md mx-auto lg:mx-0">
              <h3 className="text-orange-300 font-mono text-sm mb-2">🎮 HOW TO PLAY</h3>
              <div className="text-xs text-gray-400 space-y-1">
                <p>WASD - Move</p>
                <p>Mouse - Aim & Shoot</p>
                <p>Survive waves of zombies!</p>
              </div>
            </div>
          </div>

          {/* Right Section - Leaderboard */}
          <div className="flex-1 w-full max-w-lg">
            <Leaderboard 
              topScores={topScores}
              allScores={allScores}
              isLoading={isLoadingScores}
            />
          </div>

        </div>
      </div>

      {/* Corner decorative elements */}
      <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-orange-500/30"></div>
      <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-orange-500/30"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-orange-500/30"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-orange-500/30"></div>

    </div>
  )
} 