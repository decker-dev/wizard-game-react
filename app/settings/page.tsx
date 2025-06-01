"use client"

import React, { useState } from "react"
import Link from 'next/link'
import { FloatingParticles } from '@/components/FloatingParticles'
import { useGameAudio } from '@/hooks/useGameAudio'

export default function SettingsPage() {
  const { playPlayerShoot } = useGameAudio()
  
  // Settings state
  const [volume, setVolume] = useState(50)
  const [sfxEnabled, setSfxEnabled] = useState(true)
  const [musicEnabled, setMusicEnabled] = useState(true)
  const [showFPS, setShowFPS] = useState(false)
  const [difficulty, setDifficulty] = useState('normal')

  const handleSave = () => {
    // Here you would save settings to localStorage or a backend
    localStorage.setItem('gameSettings', JSON.stringify({
      volume,
      sfxEnabled,
      musicEnabled,
      showFPS,
      difficulty
    }))
    
    // Show feedback
    alert('Configuración guardada!')
  }

  const handleTestSound = () => {
    if (sfxEnabled) {
      playPlayerShoot()
    }
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
              
              {/* Volume */}
              <div className="mb-4">
                <label className="block text-gray-300 font-mono mb-2">
                  Volumen: {volume}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              {/* SFX Toggle */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-300 font-mono">Efectos de Sonido</span>
                <button
                  onClick={() => setSfxEnabled(!sfxEnabled)}
                  className={`px-4 py-2 rounded font-mono font-bold transition-colors ${
                    sfxEnabled 
                      ? 'bg-green-600 text-white border border-green-500' 
                      : 'bg-gray-600 text-gray-300 border border-gray-500'
                  }`}
                >
                  {sfxEnabled ? 'ON' : 'OFF'}
                </button>
              </div>

              {/* Music Toggle */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-300 font-mono">Música</span>
                <button
                  onClick={() => setMusicEnabled(!musicEnabled)}
                  className={`px-4 py-2 rounded font-mono font-bold transition-colors ${
                    musicEnabled 
                      ? 'bg-green-600 text-white border border-green-500' 
                      : 'bg-gray-600 text-gray-300 border border-gray-500'
                  }`}
                >
                  {musicEnabled ? 'ON' : 'OFF'}
                </button>
              </div>

              {/* Test Sound Button */}
              <button
                onClick={handleTestSound}
                className="px-4 py-2 bg-orange-600/80 hover:bg-orange-600 border border-orange-500/50 text-white font-mono font-bold rounded transition-all duration-200 hover:border-orange-500"
              >
                PROBAR SONIDO
              </button>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center mt-8">
            <Link
              href="/"
              className="px-8 py-4 bg-gray-600/80 hover:bg-gray-600 border border-gray-500/50 text-white font-mono font-bold rounded-lg text-xl transition-all duration-200 transform hover:scale-105 hover:border-gray-500"
            >
              VOLVER
            </Link>
            <button
              onClick={handleSave}
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