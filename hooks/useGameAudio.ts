import { useCallback, useEffect, useState } from 'react'

// Audio settings interface (reutilizamos la misma interface)
interface AudioSettings {
  musicEnabled: boolean
  sfxEnabled: boolean
}

// Audio context for web audio API
let audioContext: AudioContext | null = null

// Initialize audio context
const initAudioContext = () => {
  if (typeof window === 'undefined') return null

  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    } catch (error) {
      console.warn('AudioContext not supported:', error)
      return null
    }
  }
  return audioContext
}

// Get audio settings from localStorage
const getAudioSettings = (): AudioSettings => {
  if (typeof window === 'undefined') {
    return { musicEnabled: true, sfxEnabled: true }
  }

  try {
    const stored = localStorage.getItem('mysticGame_audioSettings')
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.warn('Error loading audio settings:', error)
  }

  return { musicEnabled: true, sfxEnabled: true }
}

// Generate synthetic sounds using Web Audio API
const createBeep = (frequency: number, duration: number, volume: number = 0.1) => {
  const context = initAudioContext()
  if (!context) return

  try {
    const oscillator = context.createOscillator()
    const gainNode = context.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(context.destination)

    oscillator.frequency.setValueAtTime(frequency, context.currentTime)
    oscillator.type = 'square'

    gainNode.gain.setValueAtTime(0, context.currentTime)
    gainNode.gain.linearRampToValueAtTime(volume, context.currentTime + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration)

    oscillator.start(context.currentTime)
    oscillator.stop(context.currentTime + duration)
  } catch (error) {
    console.warn('Audio playback error:', error)
  }
}

const createNoiseSound = (duration: number, volume: number = 0.05) => {
  const context = initAudioContext()
  if (!context) return

  try {
    const bufferSize = context.sampleRate * duration
    const buffer = context.createBuffer(1, bufferSize, context.sampleRate)
    const data = buffer.getChannelData(0)

    // Generate white noise
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * volume
    }

    const source = context.createBufferSource()
    const gainNode = context.createGain()

    source.buffer = buffer
    source.connect(gainNode)
    gainNode.connect(context.destination)

    gainNode.gain.setValueAtTime(volume, context.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration)

    source.start(context.currentTime)
  } catch (error) {
    console.warn('Audio playback error:', error)
  }
}

// Create more complex sounds for game events
const createCreatureDeathSound = () => {
  const context = initAudioContext()
  if (!context) return

  try {
    // Sonido de muerte con múltiples componentes para hacer más satisfactorio
    // 1. Sonido grave inicial (impacto)
    createBeep(120, 0.15, 0.08)

    // 2. Ruido de muerte (splat)
    setTimeout(() => {
      createNoiseSound(0.2, 0.04)
    }, 50)

    // 3. Tono descendente (muerte)
    setTimeout(() => {
      const oscillator = context.createOscillator()
      const gainNode = context.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(context.destination)

      // Frecuencia que desciende de 200 a 80 Hz
      oscillator.frequency.setValueAtTime(200, context.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(80, context.currentTime + 0.3)
      oscillator.type = 'sawtooth'

      gainNode.gain.setValueAtTime(0, context.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.06, context.currentTime + 0.02)
      gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.3)

      oscillator.start(context.currentTime)
      oscillator.stop(context.currentTime + 0.3)
    }, 100)
  } catch (error) {
    console.warn('Audio playback error:', error)
  }
}

const createCasterCreatureDeathSound = () => {
  const context = initAudioContext()
  if (!context) return

  try {
    // Sonido especial para criatura caster (más grave y dramático)
    // 1. Impacto más fuerte
    createBeep(100, 0.2, 0.1)

    // 2. Ruido más intenso
    setTimeout(() => {
      createNoiseSound(0.25, 0.06)
    }, 60)

    // 3. Tono descendente más profundo
    setTimeout(() => {
      const oscillator = context.createOscillator()
      const gainNode = context.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(context.destination)

      // Frecuencia que desciende de 150 a 50 Hz (más grave que el normal)
      oscillator.frequency.setValueAtTime(150, context.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(50, context.currentTime + 0.4)
      oscillator.type = 'sawtooth'

      gainNode.gain.setValueAtTime(0, context.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.08, context.currentTime + 0.02)
      gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.4)

      oscillator.start(context.currentTime)
      oscillator.stop(context.currentTime + 0.4)
    }, 120)
  } catch (error) {
    console.warn('Audio playback error:', error)
  }
}

export function useGameAudio() {
  const [isClient, setIsClient] = useState(false)
  const [audioSettings, setAudioSettings] = useState<AudioSettings>({ musicEnabled: true, sfxEnabled: true })

  useEffect(() => {
    setIsClient(true)
    setAudioSettings(getAudioSettings())
  }, [])

  const playCreatureDeath = useCallback((creatureType: 'normal' | 'caster' | 'tank' | 'speed' | 'explosive' = 'normal') => {
    if (!isClient || !audioSettings.sfxEnabled) return

    if (creatureType === 'caster') {
      createCasterCreatureDeathSound()
    } else {
      createCreatureDeathSound()
    }
  }, [isClient, audioSettings.sfxEnabled])

  const playPlayerShoot = useCallback(() => {
    if (!isClient || !audioSettings.sfxEnabled) return
    createBeep(800, 0.05, 0.04)
  }, [isClient, audioSettings.sfxEnabled])

  const playPlayerHit = useCallback(() => {
    if (!isClient || !audioSettings.sfxEnabled) return
    createBeep(300, 0.2, 0.08)
    setTimeout(() => createNoiseSound(0.1, 0.03), 50)
  }, [isClient, audioSettings.sfxEnabled])

  const playPlayerCast = useCallback(() => {
    if (!isClient || !audioSettings.sfxEnabled) return
    createBeep(800, 0.05, 0.04)
  }, [isClient, audioSettings.sfxEnabled])

  return {
    playCreatureDeath,
    playPlayerShoot,
    playPlayerHit,
    playPlayerCast,
    audioSettings
  }
} 