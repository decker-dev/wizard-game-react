"use client"

import React from "react"
import { useRouter } from 'next/navigation'
import { FloatingParticles } from '@/components/FloatingParticles'

export default function CreditsPage() {
  const router = useRouter()

  const handleBack = () => {
    router.push('/')
  }

  const credits = [
    {
      category: "DESARROLLO",
      items: [
        { role: "Lead Developer", name: "Tu Nombre" },
        { role: "Game Design", name: "Tu Nombre" },
        { role: "Frontend Development", name: "Next.js + React" },
        { role: "State Management", name: "Custom Hooks" }
      ]
    },
    {
      category: "ARTE Y DISEÑO",
      items: [
        { role: "UI/UX Design", name: "Tailwind CSS" },
        { role: "Pixel Art", name: "Custom Sprites" },
        { role: "Visual Effects", name: "CSS Animations" },
        { role: "Color Palette", name: "Apocalyptic Theme" }
      ]
    },
    {
      category: "AUDIO",
      items: [
        { role: "Sound Effects", name: "Web Audio API" },
        { role: "Audio Integration", name: "Custom Audio Hooks" },
        { role: "Music System", name: "Dynamic Audio" }
      ]
    },
    {
      category: "TECNOLOGÍA",
      items: [
        { role: "Framework", name: "Next.js 14" },
        { role: "Language", name: "TypeScript" },
        { role: "Styling", name: "Tailwind CSS" },
        { role: "Canvas API", name: "HTML5 Canvas" },
        { role: "Database", name: "Supabase" },
        { role: "Deployment", name: "Vercel" }
      ]
    },
    {
      category: "AGRADECIMIENTOS ESPECIALES",
      items: [
        { role: "Inspiración", name: "Juegos clásicos de zombies" },
        { role: "Community", name: "React & Next.js Community" },
        { role: "Testing", name: "Beta Testers" },
        { role: "Feedback", name: "Game Jam Participants" }
      ]
    }
  ]

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

      {/* Credits Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-black/60 backdrop-blur-sm border border-orange-500/30 rounded-lg p-8 w-full max-w-4xl hover:border-orange-500/50 transition-colors">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-b from-orange-400 to-red-600 mb-4">
              CRÉDITOS
            </h1>
            <p className="text-gray-300 font-mono text-lg">
              Gracias a todos los que hicieron posible este juego
            </p>
          </div>

          {/* Game Info */}
          <div className="text-center mb-8 bg-black/40 border border-orange-500/20 rounded-lg p-6">
            <h2 className="text-3xl font-bold text-orange-400 font-mono mb-2">
              ZOMBIE APOCALYPSE SURVIVAL
            </h2>
            <p className="text-gray-300 font-mono mb-2">Versión 1.0</p>
            <p className="text-gray-400 font-mono text-sm">
              Un juego de supervivencia zombie en 2D con waves infinitas
            </p>
          </div>

          {/* Credits Sections */}
          <div className="grid gap-6 md:grid-cols-2">
            {credits.map((section, sectionIndex) => (
              <div 
                key={section.category}
                className="bg-black/40 border border-orange-500/20 rounded-lg p-6"
                style={{ animationDelay: `${sectionIndex * 100}ms` }}
              >
                <h3 className="text-xl font-bold text-orange-400 font-mono mb-4 border-b border-orange-500/30 pb-2">
                  {section.category}
                </h3>
                <div className="space-y-3">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex justify-between items-center">
                      <span className="text-gray-300 font-mono text-sm">
                        {item.role}
                      </span>
                      <span className="text-white font-mono font-bold text-sm">
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer Message */}
          <div className="text-center mt-8 bg-black/40 border border-orange-500/20 rounded-lg p-6">
            <p className="text-gray-300 font-mono mb-4">
              ¡Gracias por jugar! Este juego fue desarrollado con pasión durante el Game Jam.
            </p>
            <p className="text-orange-400 font-mono text-sm">
              Made with ❤️ using Next.js, TypeScript, and creativity
            </p>
          </div>

          {/* Back Button */}
          <div className="flex justify-center mt-8">
            <button
              onClick={handleBack}
              className="px-8 py-4 bg-orange-600/80 hover:bg-orange-600 border border-orange-500/50 text-white font-mono font-bold rounded-lg text-xl transition-all duration-200 transform hover:scale-105 hover:border-orange-500"
            >
              VOLVER AL INICIO
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