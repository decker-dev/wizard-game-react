"use client";

import { FloatingParticles } from "@/components/FloatingParticles";
import { useGameAudio } from "@/hooks/useGameAudio";
import { useUISound } from "@/hooks/useUISound";
import Link from "next/link";
import React, { useState, useEffect } from "react";

export default function SettingsPage() {
  const { playPlayerShoot } = useGameAudio();
  const { audioSettings, updateAudioSettings, playHover, playSelect } =
    useUISound();

  // Settings state
  const [showFPS, setShowFPS] = useState(false);
  const [difficulty, setDifficulty] = useState("normal");

  // Load settings on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("gameSettings");
      if (stored) {
        const settings = JSON.parse(stored);
        setShowFPS(settings.showFPS || false);
        setDifficulty(settings.difficulty || "normal");

        // If volume values exist in gameSettings, update audioSettings as well
        if (
          typeof settings.sfxVolume === "number" ||
          typeof settings.musicVolume === "number"
        ) {
          updateAudioSettings({
            ...audioSettings,
            sfxVolume:
              typeof settings.sfxVolume === "number"
                ? settings.sfxVolume
                : audioSettings.sfxVolume,
            musicVolume:
              typeof settings.musicVolume === "number"
                ? settings.musicVolume
                : audioSettings.musicVolume,
          });
        }
      }
    } catch (error) {
      console.warn("Error loading settings:", error);
    }
  }, []);

  const handleSave = () => {
    // Save settings to localStorage
    const settings = {
      sfxEnabled: audioSettings.sfxEnabled,
      musicEnabled: audioSettings.musicEnabled,
      showFPS,
      difficulty,
      sfxVolume: audioSettings.sfxVolume,
      musicVolume: audioSettings.musicVolume,
    };

    try {
      localStorage.setItem("gameSettings", JSON.stringify(settings));
      updateAudioSettings({
        ...audioSettings,
        sfxVolume: audioSettings.sfxVolume,
        musicVolume: audioSettings.musicVolume,
      });
      playSelect();
      // Show feedback - could be improved with a toast notification
      alert("Settings saved!");
    } catch (error) {
      console.warn("Error saving settings:", error);
      alert("Error saving settings");
    }
  };

  const handleTestSound = () => {
    if (audioSettings.sfxEnabled) {
      playPlayerShoot();
    }
  };

  const handleSfxToggle = () => {
    playHover();
    updateAudioSettings({
      ...audioSettings,
      sfxEnabled: !audioSettings.sfxEnabled,
    });
  };

  const handleMusicToggle = () => {
    playHover();
    updateAudioSettings({
      ...audioSettings,
      musicEnabled: !audioSettings.musicEnabled,
    });
  };

  return (
    <div className='min-h-dvh relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black'>
      {/* Background Elements */}
      <div className='absolute inset-0'>
        <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
        <div className='absolute top-0 left-0 w-full h-full opacity-20'>
          <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse' />
          <div className='absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000' />
        </div>
        <div className='absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.1)_1px,transparent_1px)] bg-[size:20px_20px]' />
        <FloatingParticles />
      </div>

      {/* Settings Content */}
      <div className='relative z-10 flex flex-col items-center justify-center min-h-dvh p-4'>
        <div className='bg-black/60 backdrop-blur-sm border border-purple-500/30 rounded-lg p-8 w-full max-w-2xl hover:border-purple-500/50 transition-colors'>
          {/* Header */}
          <div className='text-center mb-8'>
            <h1 className='text-5xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-b from-purple-400 to-blue-600 mb-4'>
              SETTINGS
            </h1>
            <p className='text-gray-300 font-mono'>
              Customize your gaming experience
            </p>
          </div>

          {/* Settings Form */}
          <div className='space-y-6'>
            {/* Audio Settings */}
            <div className='bg-black/40 border border-purple-500/20 rounded-lg p-6'>
              <h3 className='text-xl font-bold text-purple-400 font-mono mb-4'>
                AUDIO
              </h3>

              {/* SFX Toggle */}
              <div className='flex items-center justify-between mb-4'>
                <span className='text-gray-300 font-mono'>Sound Effects</span>
                <button
                  type='button'
                  onClick={handleSfxToggle}
                  onMouseEnter={() => playHover()}
                  className={`px-4 py-2 rounded font-mono font-bold transition-colors ${
                    audioSettings.sfxEnabled
                      ? "bg-green-600 text-white border border-green-500"
                      : "bg-gray-600 text-gray-300 border border-gray-500"
                  }`}
                >
                  {audioSettings.sfxEnabled ? "ON" : "OFF"}
                </button>
              </div>

              {/* SFX Volume Slider */}
              <div className='flex items-center justify-between mb-4'>
                <label htmlFor='sfx-volume' className='text-gray-300 font-mono'>
                  SFX Volume
                </label>
                <div className='flex items-center gap-2'>
                  <input
                    type='range'
                    id='sfx-volume'
                    min={0}
                    max={100}
                    step={1}
                    value={Math.round((audioSettings.sfxVolume ?? 1) * 100)}
                    onChange={(e) => {
                      const value = Number(e.target.value) / 100;
                      updateAudioSettings({
                        ...audioSettings,
                        sfxVolume: value,
                      });
                    }}
                    aria-valuenow={Math.round(
                      (audioSettings.sfxVolume ?? 1) * 100
                    )}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label='SFX Volume'
                    className='w-40 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500'
                  />
                  <span className='text-gray-400 font-mono w-10 text-right'>
                    {Math.round((audioSettings.sfxVolume ?? 1) * 100)}%
                  </span>
                </div>
              </div>

              {/* Music Toggle */}
              <div className='flex items-center justify-between mb-4'>
                <span className='text-gray-300 font-mono'>Music</span>
                <button
                  type='button'
                  onClick={handleMusicToggle}
                  onMouseEnter={() => playHover()}
                  className={`px-4 py-2 rounded font-mono font-bold transition-colors ${
                    audioSettings.musicEnabled
                      ? "bg-green-600 text-white border border-green-500"
                      : "bg-gray-600 text-gray-300 border border-gray-500"
                  }`}
                >
                  {audioSettings.musicEnabled ? "ON" : "OFF"}
                </button>
              </div>

              {/* Music Volume Slider */}
              <div className='flex items-center justify-between mb-4'>
                <label
                  htmlFor='music-volume'
                  className='text-gray-300 font-mono'
                >
                  Music Volume
                </label>
                <div className='flex items-center gap-2'>
                  <input
                    type='range'
                    id='music-volume'
                    min={0}
                    max={100}
                    step={1}
                    value={Math.round((audioSettings.musicVolume ?? 1) * 100)}
                    onChange={(e) => {
                      const value = Number(e.target.value) / 100;
                      updateAudioSettings({
                        ...audioSettings,
                        musicVolume: value,
                      });
                    }}
                    aria-valuenow={Math.round(
                      (audioSettings.musicVolume ?? 1) * 100
                    )}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label='Music Volume'
                    className='w-40 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500'
                  />
                  <span className='text-gray-400 font-mono w-10 text-right'>
                    {Math.round((audioSettings.musicVolume ?? 1) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex gap-4 justify-center mt-8'>
            <Link
              href='/'
              onMouseEnter={() => playHover()}
              onClick={() => playSelect()}
              className='px-8 py-4 bg-gray-600/80 hover:bg-gray-600 border border-gray-500/50 text-white font-mono font-bold rounded-lg text-xl transition-all duration-200 transform hover:scale-105 hover:border-gray-500'
            >
              BACK
            </Link>
            <button
              type='button'
              onClick={handleSave}
              onMouseEnter={() => playHover()}
              className='px-8 py-4 bg-purple-600/80 hover:bg-purple-600 border border-purple-500/50 text-white font-mono font-bold rounded-lg text-xl transition-all duration-200 transform hover:scale-105 hover:border-purple-500'
            >
              SAVE
            </button>
          </div>
        </div>
      </div>

      {/* Corner decorative elements */}
      <div className='absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-purple-500/30' />
      <div className='absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-purple-500/30' />
      <div className='absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-purple-500/30' />
      <div className='absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-purple-500/30' />
    </div>
  );
}
