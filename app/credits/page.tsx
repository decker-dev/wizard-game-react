"use client"

import React from "react"
import Link from 'next/link'
import { FloatingParticles } from '@/components/FloatingParticles'

interface CreditItem {
  role: string;
  name: string;
  link?: string;
}

interface CreditSection {
  category: string;
  items: CreditItem[];
}

export default function CreditsPage() {
  const credits: CreditSection[] = [
    {
      category: "DESARROLLO",
      items: [
        { role: "Vibe Developer", name: "Lauti", link: "https://x.com/lautidev_" },
        { role: "Vibe Developer", name: "Alejo", link: "https://x.com/alejorrojass" },
        { role: "Vibe Developer", name: "Decker", link: "https://x.com/0xDecker" },
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
              Creado en el Game Jam de Paisanos.io
            </p>
          </div>

          {/* Game Info */}
          <div className="text-center mb-8 bg-black/40 border border-orange-500/20 rounded-lg p-6">
            <h2 className="text-3xl font-bold text-orange-400 font-mono mb-2">
              ZOMBIE APOCALYPSE SURVIVAL
            </h2>
            <p className="text-gray-300 font-mono mb-2">Desarrollado en 1 día</p>
            <p className="text-gray-400 font-mono text-sm">
              Primera Vibe Gaming Hackathon de LATAM - Tech Week Buenos Aires
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
                      {item.link ? (
                        <a 
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-400 hover:text-orange-300 font-mono font-bold text-sm underline decoration-dotted transition-colors"
                        >
                          {item.name}
                        </a>
                      ) : (
                        <span className="text-white font-mono font-bold text-sm">
                          {item.name}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer Message */}
          <div className="text-center mt-8 bg-black/40 border border-orange-500/20 rounded-lg p-6">
            <p className="text-gray-300 font-mono mb-4">
              🎮 Un juego desarrollado en comunidad durante la primera Game Jam de Paisanos.io
            </p>
            <p className="text-gray-400 font-mono text-xs">
              Made with ❤️ in Buenos Aires using Next.js, TypeScript, and creativity
            </p>
          </div>

          {/* Back Button */}
          <div className="flex justify-center mt-8">
            <Link
              href="/"
              className="px-8 py-4 bg-orange-600/80 hover:bg-orange-600 border border-orange-500/50 text-white font-mono font-bold rounded-lg text-xl transition-all duration-200 transform hover:scale-105 hover:border-orange-500"
            >
              VOLVER AL INICIO
            </Link>
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