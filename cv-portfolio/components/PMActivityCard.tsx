'use client'

import { useState } from 'react'

interface PMActivityCardProps {
  title: string
  proficiency: number
  onClick: () => void
}

export default function PMActivityCard({
  title,
  proficiency,
  onClick,
}: PMActivityCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [animationKey, setAnimationKey] = useState(0)

  const handleHover = () => {
    setIsHovered(true)
    setAnimationKey((prev) => prev + 1)
  }

  return (
    <div
      className="border border-neutral-800/50 rounded-sm overflow-hidden transition-all duration-300 cursor-pointer p-4 sm:p-6 group"
      style={{
        backgroundColor: 'rgba(23, 23, 23, 0.3)',
        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.3)',
      }}
      onClick={onClick}
      onMouseEnter={handleHover}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Header */}
      <div className="mb-6">
        <h3 className="text-lg sm:text-xl font-light text-neutral-100 transition-colors">
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
            key={animationKey}
            className="absolute top-0 left-0 h-full rounded-full animate-progress-load"
            style={{
              width: `${proficiency}%`,
              backgroundColor: '#fbbf24',
              boxShadow: '0 0 8px #fbbf24, inset 0 0 8px #fbbf2440',
              animationDelay: isHovered ? '0s' : `${Math.random() * 0.8}s`,
              animationDuration: `${0.5 + Math.random() * 0.6}s`,
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
      `}</style>
    </div>
  )
}
