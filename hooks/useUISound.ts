import { useCallback, useEffect, useState } from 'react'

// Audio settings interface
interface AudioSettings {
  musicEnabled: boolean
  sfxEnabled: boolean
}

// Audio context for web audio API
let audioContext: AudioContext | null = null
let currentMusicInterval: NodeJS.Timeout | null = null

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

// Save audio settings to localStorage
const saveAudioSettings = (settings: AudioSettings) => {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem('mysticGame_audioSettings', JSON.stringify(settings))
  } catch (error) {
    console.warn('Error saving audio settings:', error)
  }
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

export function useUISound() {
  const [isClient, setIsClient] = useState(false)
  const [audioSettings, setAudioSettings] = useState<AudioSettings>({ musicEnabled: true, sfxEnabled: true })

  useEffect(() => {
    setIsClient(true)
    const stored = localStorage.getItem('mysticGame_audioSettings')
    if (stored) {
      try {
        setAudioSettings(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse audio settings:', e)
      }
    }
  }, [])

  const updateAudioSettings = useCallback((settings: AudioSettings) => {
    setAudioSettings(settings)
    localStorage.setItem('mysticGame_audioSettings', JSON.stringify(settings))
  }, [])

  const playHover = useCallback(() => {
    if (!isClient || !audioSettings.sfxEnabled) return
    createBeep(800, 0.1, 0.08)
  }, [isClient, audioSettings.sfxEnabled])

  const playSelect = useCallback(() => {
    if (!isClient || !audioSettings.sfxEnabled) return
    createBeep(400, 0.2, 0.12)
    setTimeout(() => createBeep(600, 0.15, 0.08), 100)
  }, [isClient, audioSettings.sfxEnabled])

  const playBack = useCallback(() => {
    if (!isClient || !audioSettings.sfxEnabled) return
    createBeep(600, 0.1, 0.1)
    setTimeout(() => createBeep(400, 0.15, 0.08), 80)
  }, [isClient, audioSettings.sfxEnabled])

  const playStart = useCallback(() => {
    if (!isClient || !audioSettings.sfxEnabled) return
    createBeep(300, 0.3, 0.15)
    setTimeout(() => createBeep(400, 0.2, 0.12), 150)
    setTimeout(() => createBeep(600, 0.25, 0.1), 300)
    setTimeout(() => createNoiseSound(0.1, 0.03), 500)
  }, [isClient, audioSettings.sfxEnabled])

  const playError = useCallback(() => {
    if (!isClient || !audioSettings.sfxEnabled) return
    createBeep(200, 0.4, 0.15)
  }, [isClient, audioSettings.sfxEnabled])

  const startMenuMusic = useCallback(() => {
    if (!isClient || !audioSettings.musicEnabled) return () => { }

    // Stop any existing music
    if (currentMusicInterval) {
      clearInterval(currentMusicInterval)
    }

    const playTone = () => {
      if (!audioSettings.musicEnabled) return
      createBeep(220, 2, 0.02)
      setTimeout(() => {
        if (!audioSettings.musicEnabled) return
        createBeep(330, 1.5, 0.015)
      }, 1000)
      setTimeout(() => {
        if (!audioSettings.musicEnabled) return
        createBeep(110, 3, 0.01)
      }, 2000)
    }

    playTone()
    currentMusicInterval = setInterval(playTone, 6000)

    return () => {
      if (currentMusicInterval) {
        clearInterval(currentMusicInterval)
        currentMusicInterval = null
      }
    }
  }, [isClient, audioSettings.musicEnabled])

  const stopMenuMusic = useCallback(() => {
    if (currentMusicInterval) {
      clearInterval(currentMusicInterval)
      currentMusicInterval = null
    }
  }, [])

  return {
    playHover,
    playSelect,
    playBack,
    playStart,
    playError,
    startMenuMusic,
    stopMenuMusic,
    audioSettings,
    updateAudioSettings
  }
} 