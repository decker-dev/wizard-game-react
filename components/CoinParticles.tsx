import React, { useState, useEffect } from 'react'
import { CoinIcon } from './CoinIcon'

interface CoinParticle {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  alpha: number
  scale: number
  coins: number
}

interface CoinParticlesProps {
  particles: CoinParticle[]
  removeParticle: (id: string) => void
}

export const CoinParticles: React.FC<CoinParticlesProps> = ({ particles, removeParticle }) => {
  useEffect(() => {
    const interval = setInterval(() => {
      particles.forEach(particle => {
        particle.x += particle.vx
        particle.y += particle.vy
        particle.vy += 0.2 // gravity
        particle.alpha -= 0.02
        particle.scale -= 0.01
        
        if (particle.alpha <= 0 || particle.scale <= 0) {
          removeParticle(particle.id)
        }
      })
    }, 16) // ~60fps
    
    return () => clearInterval(interval)
  }, [particles, removeParticle])

  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute flex items-center text-yellow-400 font-bold font-mono text-sm select-none"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            opacity: particle.alpha,
            transform: `scale(${particle.scale})`,
            textShadow: '0 0 4px #000, 2px 2px 4px #000',
          }}
        >
          <CoinIcon size="md" className="mr-1" />
          +{particle.coins}
        </div>
      ))}
    </div>
  )
} 