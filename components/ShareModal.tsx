import React from 'react'

interface ShareModalProps {
  isVisible: boolean
  onClose: () => void
}

export const ShareModal: React.FC<ShareModalProps> = ({ isVisible, onClose }) => {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      {/* Modal Content */}
      <div className="bg-black/90 backdrop-blur-sm border border-orange-500/50 rounded-lg p-8 max-w-md w-full mx-4 text-center hover:border-orange-500/70 transition-colors">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-b from-orange-400 to-red-600 mb-2">
            COMPARTIR JUEGO
          </h2>
          <p className="text-gray-300 font-mono text-sm">
            Escanea el código QR para jugar en tu móvil
          </p>
        </div>

        {/* QR Code */}
        <div className="mb-6">
          <div className="bg-white p-4 rounded-lg inline-block">
            <img 
              src="/qr.jpeg" 
              alt="QR Code para acceder al juego" 
              className="w-48 h-48 object-contain"
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="mb-6 text-left">
          <h3 className="text-orange-400 font-mono font-bold text-sm mb-3">INSTRUCCIONES:</h3>
          <div className="space-y-2 text-gray-300 font-mono text-xs">
            <p>📱 Abre la cámara de tu teléfono</p>
            <p>🎯 Apunta al código QR</p>
            <p>🎮 ¡Juega Zombie Siege en móvil!</p>
          </div>
        </div>

        {/* URL Display */}
        <div className="mb-6">
          <div className="bg-black/60 border border-orange-500/30 rounded-lg p-3">
            <p className="text-orange-400 font-mono text-xs mb-1">URL DIRECTA:</p>
            <p className="text-gray-300 font-mono text-xs break-all">
              https://fork-game-jam-paisanos-pvh5o34m1-alejorrojas-projects.vercel.app/
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => {
              navigator.clipboard.writeText('https://fork-game-jam-paisanos-pvh5o34m1-alejorrojas-projects.vercel.app/')
              // Optional: Show a toast notification here
            }}
            className="px-6 py-3 bg-orange-600/80 hover:bg-orange-600 border border-orange-500/50 text-white font-mono font-bold rounded-lg text-sm transition-all duration-200 transform hover:scale-105 hover:border-orange-500"
          >
            📋 COPIAR URL
          </button>
          
          <button
            onClick={onClose}
            className="px-6 py-3 bg-red-600/80 hover:bg-red-600 border border-red-500/50 text-white font-mono font-bold rounded-lg text-sm transition-all duration-200 transform hover:scale-105 hover:border-red-500"
          >
            CERRAR
          </button>
        </div>

        {/* Close button (X) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
} 