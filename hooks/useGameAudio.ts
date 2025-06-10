import { useCallback, useEffect, useState } from "react";

// Audio settings interface (reutilizamos la misma interface)
interface AudioSettings {
  musicEnabled: boolean;
  sfxEnabled: boolean;
  sfxVolume: number; // 0-1
  musicVolume: number; // 0-1
}

// Audio context for web audio API
let audioContext: AudioContext | null = null;

// Initialize audio context
const initAudioContext = () => {
  if (typeof window === "undefined") return null;

  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();
    } catch (error) {
      console.warn("AudioContext not supported:", error);
      return null;
    }
  }
  return audioContext;
};

// Get audio settings from localStorage
const getAudioSettings = (): AudioSettings => {
  if (typeof window === "undefined") {
    return {
      musicEnabled: true,
      sfxEnabled: true,
      sfxVolume: 0.5,
      musicVolume: 0.5,
    };
  }

  try {
    const stored = localStorage.getItem("mysticGame_audioSettings");
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        musicEnabled: parsed.musicEnabled ?? true,
        sfxEnabled: parsed.sfxEnabled ?? true,
        sfxVolume: parsed.sfxVolume ?? 0.5,
        musicVolume: parsed.musicVolume ?? 0.5,
      };
    }
  } catch (error) {
    console.warn("Error loading audio settings:", error);
  }

  return {
    musicEnabled: true,
    sfxEnabled: true,
    sfxVolume: 0.5,
    musicVolume: 0.5,
  };
};

// Generate synthetic sounds using Web Audio API
const createBeep = (frequency: number, duration: number, volume = 0.1) => {
  const context = initAudioContext();
  if (!context) return;

  try {
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.frequency.setValueAtTime(frequency, context.currentTime);
    oscillator.type = "square";

    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, context.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      context.currentTime + duration
    );

    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + duration);
  } catch (error) {
    console.warn("Audio playback error:", error);
  }
};

const createNoiseSound = (duration: number, volume = 0.05) => {
  const context = initAudioContext();
  if (!context) return;

  try {
    const bufferSize = context.sampleRate * duration;
    const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
    const data = buffer.getChannelData(0);

    // Generate white noise
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * volume;
    }

    const source = context.createBufferSource();
    const gainNode = context.createGain();

    source.buffer = buffer;
    source.connect(gainNode);
    gainNode.connect(context.destination);

    gainNode.gain.setValueAtTime(volume, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      context.currentTime + duration
    );

    source.start(context.currentTime);
  } catch (error) {
    console.warn("Audio playback error:", error);
  }
};

// Create more complex sounds for game events
const createCreatureDeathSound = (sfxVolume: number = 1) => {
  const context = initAudioContext();
  if (!context) return;

  try {
    // Sonido de muerte con múltiples componentes para hacer más satisfactorio
    // 1. Sonido grave inicial (impacto)
    createBeep(120, 0.15, 0.08 * sfxVolume);

    // 2. Ruido de muerte (splat)
    setTimeout(() => {
      createNoiseSound(0.2, 0.04 * sfxVolume);
    }, 50);

    // 3. Tono descendente (muerte)
    setTimeout(() => {
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      // Frecuencia que desciende de 200 a 80 Hz
      oscillator.frequency.setValueAtTime(200, context.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        80,
        context.currentTime + 0.3
      );
      oscillator.type = "sawtooth";

      gainNode.gain.setValueAtTime(0, context.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        0.06 * sfxVolume,
        context.currentTime + 0.02
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        context.currentTime + 0.3
      );

      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.3);
    }, 100);
  } catch (error) {
    console.warn("Audio playback error:", error);
  }
};

const createCasterCreatureDeathSound = (sfxVolume: number = 1) => {
  const context = initAudioContext();
  if (!context) return;

  try {
    // Sonido especial para criatura caster (más grave y dramático)
    // 1. Impacto más fuerte
    createBeep(100, 0.2, 0.1 * sfxVolume);

    // 2. Ruido más intenso
    setTimeout(() => {
      createNoiseSound(0.25, 0.06 * sfxVolume);
    }, 60);

    // 3. Tono descendente más profundo
    setTimeout(() => {
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      // Frecuencia que desciende de 150 a 50 Hz (más grave que el normal)
      oscillator.frequency.setValueAtTime(150, context.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        50,
        context.currentTime + 0.4
      );
      oscillator.type = "sawtooth";

      gainNode.gain.setValueAtTime(0, context.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        0.08 * sfxVolume,
        context.currentTime + 0.02
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        context.currentTime + 0.4
      );

      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.4);
    }, 120);
  } catch (error) {
    console.warn("Audio playback error:", error);
  }
};

export function useGameAudio() {
  const [isClient, setIsClient] = useState(false);
  const [audioSettings, setAudioSettings] =
    useState<AudioSettings>(getAudioSettings());

  useEffect(() => {
    setIsClient(true);
    setAudioSettings(getAudioSettings());
  }, []);

  const updateAudioSettings = useCallback((settings: AudioSettings) => {
    setAudioSettings(settings);
    localStorage.setItem("mysticGame_audioSettings", JSON.stringify(settings));
  }, []);

  const playCreatureDeath = useCallback(
    (
      creatureType:
        | "normal"
        | "caster"
        | "tank"
        | "speed"
        | "explosive"
        | "boss" = "normal"
    ) => {
      if (!isClient || !audioSettings.sfxEnabled) return;

      if (creatureType === "boss") {
        // Sonido especial para Boss (más dramático y largo)
        createBeep(80, 0.3, 0.12 * (audioSettings.sfxVolume ?? 1));
        setTimeout(
          () => createNoiseSound(0.4, 0.08 * (audioSettings.sfxVolume ?? 1)),
          100
        );
        setTimeout(() => {
          const context = initAudioContext();
          if (!context) return;
          try {
            const oscillator = context.createOscillator();
            const gainNode = context.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(context.destination);
            oscillator.frequency.setValueAtTime(120, context.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(
              30,
              context.currentTime + 0.6
            );
            oscillator.type = "sawtooth";
            gainNode.gain.setValueAtTime(0, context.currentTime);
            gainNode.gain.linearRampToValueAtTime(
              0.1 * (audioSettings.sfxVolume ?? 1),
              context.currentTime + 0.02
            );
            gainNode.gain.exponentialRampToValueAtTime(
              0.001,
              context.currentTime + 0.6
            );
            oscillator.start(context.currentTime);
            oscillator.stop(context.currentTime + 0.6);
          } catch (error) {
            console.warn("Audio playback error:", error);
          }
        }, 200);
      } else if (creatureType === "caster") {
        createCasterCreatureDeathSound(audioSettings.sfxVolume ?? 1);
      } else {
        createCreatureDeathSound(audioSettings.sfxVolume ?? 1);
      }
    },
    [isClient, audioSettings.sfxEnabled, audioSettings.sfxVolume]
  );

  const playPlayerShoot = useCallback(() => {
    if (!isClient || !audioSettings.sfxEnabled) return;
    createBeep(800, 0.05, 0.04 * (audioSettings.sfxVolume ?? 1));
  }, [isClient, audioSettings.sfxEnabled, audioSettings.sfxVolume]);

  const playPlayerHit = useCallback(() => {
    if (!isClient || !audioSettings.sfxEnabled) return;
    createBeep(300, 0.2, 0.08 * (audioSettings.sfxVolume ?? 1));
    setTimeout(
      () => createNoiseSound(0.1, 0.03 * (audioSettings.sfxVolume ?? 1)),
      50
    );
  }, [isClient, audioSettings.sfxEnabled, audioSettings.sfxVolume]);

  const playPlayerCast = useCallback(() => {
    if (!isClient || !audioSettings.sfxEnabled) return;
    createBeep(800, 0.05, 0.04 * (audioSettings.sfxVolume ?? 1));
  }, [isClient, audioSettings.sfxEnabled, audioSettings.sfxVolume]);

  return {
    playCreatureDeath,
    playPlayerShoot,
    playPlayerHit,
    playPlayerCast,
    audioSettings,
    updateAudioSettings,
  };
}
