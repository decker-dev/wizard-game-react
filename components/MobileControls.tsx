import React, { useRef, useState, useEffect } from 'react'

interface MobileControlsProps {
  onMove: (direction: { x: number; y: number }) => void
  onShoot: () => void
}

export function MobileControls({ onMove, onShoot }: MobileControlsProps) {
  const joystickRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [knobPosition, setKnobPosition] = useState({ x: 0, y: 0 })

  const JOYSTICK_SIZE = 120
  const KNOB_SIZE = 50
  const MAX_DISTANCE = 35

  // Simple touch/mouse handlers
  const handleStart = (clientX: number, clientY: number) => {
    if (!joystickRef.current) return
    
    setIsDragging(true)
    updatePosition(clientX, clientY)
  }

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return
    updatePosition(clientX, clientY)
  }

  const handleEnd = () => {
    setIsDragging(false)
    setKnobPosition({ x: 0, y: 0 })
    onMove({ x: 0, y: 0 })
  }

  const updatePosition = (clientX: number, clientY: number) => {
    if (!joystickRef.current) return

    const rect = joystickRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    let deltaX = clientX - centerX
    let deltaY = clientY - centerY

    // Limit to max distance
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    if (distance > MAX_DISTANCE) {
      deltaX = (deltaX / distance) * MAX_DISTANCE
      deltaY = (deltaY / distance) * MAX_DISTANCE
    }

    setKnobPosition({ x: deltaX, y: deltaY })

    // Send normalized direction (-1 to 1)
    const normalizedX = distance > 0 ? deltaX / MAX_DISTANCE : 0
    const normalizedY = distance > 0 ? deltaY / MAX_DISTANCE : 0
    
    onMove({ x: normalizedX, y: normalizedY })
  }

  // Global event listeners
  useEffect(() => {
    const handleGlobalMove = (e: any) => {
      if (!isDragging) return
      
      const clientX = e.touches ? e.touches[0].clientX : e.clientX
      const clientY = e.touches ? e.touches[0].clientY : e.clientY
      
      handleMove(clientX, clientY)
    }

    const handleGlobalEnd = () => {
      if (isDragging) handleEnd()
    }

    if (isDragging) {
      window.addEventListener('touchmove', handleGlobalMove)
      window.addEventListener('touchend', handleGlobalEnd)
      window.addEventListener('mousemove', handleGlobalMove)
      window.addEventListener('mouseup', handleGlobalEnd)
    }

    return () => {
      window.removeEventListener('touchmove', handleGlobalMove)
      window.removeEventListener('touchend', handleGlobalEnd)
      window.removeEventListener('mousemove', handleGlobalMove)
      window.removeEventListener('mouseup', handleGlobalEnd)
    }
  }, [isDragging])

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Joystick */}
      <div className="absolute bottom-8 left-8 pointer-events-auto">
        <div
          ref={joystickRef}
          className="relative bg-gray-800/80 border-2 border-purple-400 rounded-full"
          style={{ 
            width: JOYSTICK_SIZE, 
            height: JOYSTICK_SIZE,
            touchAction: 'none',
            userSelect: 'none'
          }}
          onTouchStart={(e) => {
            e.stopPropagation()
            const touch = e.touches[0]
            handleStart(touch.clientX, touch.clientY)
          }}
          onMouseDown={(e) => {
            e.stopPropagation()
            handleStart(e.clientX, e.clientY)
          }}
        >
          {/* Base circle */}
          <div className="absolute inset-2 bg-purple-500/20 rounded-full" />
          
          {/* Knob */}
          <div
            className="absolute bg-purple-500 rounded-full border-2 border-white shadow-lg"
            style={{
              width: KNOB_SIZE,
              height: KNOB_SIZE,
              left: `calc(50% + ${knobPosition.x}px - ${KNOB_SIZE/2}px)`,
              top: `calc(50% + ${knobPosition.y}px - ${KNOB_SIZE/2}px)`,
              transition: isDragging ? 'none' : 'all 0.2s ease'
            }}
          />
        </div>
        <div className="text-center mt-2 text-white/70 text-sm font-bold">MOVE</div>
      </div>

      {/* Shoot Button */}
      <div className="absolute bottom-8 right-8 pointer-events-auto">
        <button
          className="w-24 h-24 bg-red-500 hover:bg-red-600 active:bg-red-700 border-4 border-red-300 rounded-full shadow-lg active:scale-95 transition-all"
          style={{
            touchAction: 'manipulation',
            userSelect: 'none'
          }}
          onTouchStart={(e) => {
            e.stopPropagation()
            onShoot()
          }}
          onClick={(e) => {
            e.stopPropagation()
            onShoot()
          }}
        >
          <div className="text-white text-3xl font-bold">🔮</div>
        </button>
        <div className="text-center mt-2 text-white/70 text-sm font-bold">SHOOT</div>
      </div>

      {/* Debug */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 left-4 bg-black/70 text-white p-3 rounded text-sm">
          <div>Dragging: {isDragging ? 'YES' : 'NO'}</div>
          <div>Knob: {knobPosition.x.toFixed(1)}, {knobPosition.y.toFixed(1)}</div>
          <div>Direction: {(knobPosition.x / MAX_DISTANCE).toFixed(2)}, {(knobPosition.y / MAX_DISTANCE).toFixed(2)}</div>
        </div>
      )}
    </div>
  )
} 