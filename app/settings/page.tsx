"use client"

import React, { useState, useEffect } from "react"
import Link from 'next/link'
import { FloatingParticles } from '@/components/FloatingParticles'
import { useGameAudio } from '@/hooks/useGameAudio'
import { useUISound } from '@/hooks/useUISound'

export default function SettingsPage() {
  const { playPlayerShoot } = useGameAudio()
  const { 
    audioSettings, 
    updateAudioSettings, 
    playHover, 
    playSelect 
  } = useUISound()
  
  // Settings state
  const [showFPS, setShowFPS] = useState(false)
  const [difficulty, setDifficulty] = useState('normal')

  // Load settings on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('gameSettings')
      if (stored) {
        const settings = JSON.parse(stored)
        setShowFPS(settings.showFPS || false)
        setDifficulty(settings.difficulty || 'normal')
      }
    } catch (error) {
      console.warn('Error loading settings:', error)
    }
  }, [])

  const handleSave = () => {
    // Save settings to localStorage
    const settings = {
      sfxEnabled: audioSettings.sfxEnabled,
      musicEnabled: audioSettings.musicEnabled,
      showFPS,
      difficulty
    }
    
    try {
      localStorage.setItem('gameSettings', JSON.stringify(settings))
      playSelect()
      // Show feedback - could be improved with a toast notification
      alert('¡Configuración guardada!')
    } catch (error) {
      console.warn('Error saving settings:', error)
      alert('Error al guardar configuración')
    }
  }

  const handleTestSound = () => {
    if (audioSettings.sfxEnabled) {
      playPlayerShoot()
    }
  }

  const handleSfxToggle = () => {
    playHover()
    updateAudioSettings({ sfxEnabled: !audioSettings.sfxEnabled })
  }

  const handleMusicToggle = () => {
    playHover()
    updateAudioSettings({ musicEnabled: !audioSettings.musicEnabled })
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,140,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,140,0,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
        <FloatingParticles />
      </div>

      {/* Settings Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-black/60 backdrop-blur-sm border border-orange-500/30 rounded-lg p-8 w-full max-w-2xl hover:border-orange-500/50 transition-colors">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-b from-orange-400 to-red-600 mb-4">
              CONFIGURACIÓN
            </h1> 
            <p className="text-gray-300 font-mono">
              Personaliza tu experiencia de juego
            </p>
          </div>

          {/* Settings Form */}
          <div className="space-y-6">
            {/* Audio Settings */}
            <div className="bg-black/40 border border-orange-500/20 rounded-lg p-6">
              <h3 className="text-xl font-bold text-orange-400 font-mono mb-4">AUDIO</h3>
              
              {/* SFX Toggle */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-300 font-mono">Efectos de Sonido</span>
                <button
                  onClick={handleSfxToggle}
                  onMouseEnter={() => playHover()}
                  className={`px-4 py-2 rounded font-mono font-bold transition-colors ${
                    audioSettings.sfxEnabled 
                      ? 'bg-green-600 text-white border border-green-500' 
                      : 'bg-gray-600 text-gray-300 border border-gray-500'
                  }`}
                >
                  {audioSettings.sfxEnabled ? 'ON' : 'OFF'}
                </button>
              </div>

              {/* Music Toggle */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-300 font-mono">Música</span>
                <button
                  onClick={handleMusicToggle}
                  onMouseEnter={() => playHover()}
                  className={`px-4 py-2 rounded font-mono font-bold transition-colors ${
                    audioSettings.musicEnabled 
                      ? 'bg-green-600 text-white border border-green-500' 
                      : 'bg-gray-600 text-gray-300 border border-gray-500'
                  }`}
                >
                  {audioSettings.musicEnabled ? 'ON' : 'OFF'}
                </button>
              </div>

            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center mt-8">
            <Link
              href="/"
              onMouseEnter={() => playHover()}
              onClick={() => playSelect()}
              className="px-8 py-4 bg-gray-600/80 hover:bg-gray-600 border border-gray-500/50 text-white font-mono font-bold rounded-lg text-xl transition-all duration-200 transform hover:scale-105 hover:border-gray-500"
            >
              VOLVER
            </Link>
            <button
              onClick={handleSave}
              onMouseEnter={() => playHover()}
              className="px-8 py-4 bg-green-600/80 hover:bg-green-600 border border-green-500/50 text-white font-mono font-bold rounded-lg text-xl transition-all duration-200 transform hover:scale-105 hover:border-green-500"
            >
              GUARDAR
            </button>
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