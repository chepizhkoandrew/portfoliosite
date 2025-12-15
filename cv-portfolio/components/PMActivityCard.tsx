'use client'

import { useState, memo, useCallback, useMemo } from 'react'

interface PMActivityCardProps {
  title: string
  proficiency: number
  onClick: () => void
}

function PMActivityCard({
  title,
  proficiency,
  onClick,
}: PMActivityCardProps) {
  const { initialDelay, duration } = useMemo(() => ({
    initialDelay: Math.random() * 0.8,
    duration: 0.5 + Math.random() * 0.6,
  }), [])

  const handleClick = useCallback(() => {
    onClick()
  }, [onClick])

  return (
    <div
      className="glow-button border border-neutral-800/50 rounded-sm overflow-hidden cursor-pointer p-4 sm:p-6 group"
      style={{
        backgroundColor: 'rgba(23, 23, 23, 0.3)',
        boxShadow: '0 0 20px rgba(251, 191, 36, 0.1), inset 0 0 20px rgba(0,0,0,0.3)',
      }}
      onClick={handleClick}
    >
      {/* Card Header */}
      <div className="mb-6">
        <h3 className="text-lg sm:text-xl font-light text-neutral-100 group-hover:text-neutral-50 transition-colors">
          {title}
        </h3>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="text-xs text-neutral-400 mb-2 font-light">Proficiency</div>
        <div
          className="relative w-full h-1.5 bg-neutral-800/50 rounded-full overflow-hidden border border-neutral-700/30"
          style={{
            boxShadow: 'inset 0 0 8px rgba(0,0,0,0.3)',
          }}
        >
          <div
            className="absolute top-0 left-0 h-full rounded-full animate-progress-load"
            style={{
              width: `${proficiency}%`,
              backgroundColor: '#fbbf24',
              boxShadow: '0 0 8px #fbbf24, inset 0 0 8px #fbbf2440',
              animationDelay: `${initialDelay}s`,
              animationDuration: `${duration}s`,
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes progress-load {
          0% {
            width: 0;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            opacity: 1;
          }
        }
        
        .animate-progress-load {
          animation: progress-load ease-out forwards;
        }

        .glow-button {
          box-shadow: 0 0 20px rgba(251, 191, 36, 0.1) !important;
          transition: all 0.3s ease;
        }

        .glow-button:hover {
          box-shadow: 0 0 30px rgba(251, 191, 36, 0.3),
                      0 0 60px rgba(255, 0, 150, 0.2) !important;
          transform: translateY(-2px);
          border-color: rgba(251, 191, 36, 0.5) !important;
        }
      `}</style>
    </div>
  )
}

export default memo(PMActivityCard)
