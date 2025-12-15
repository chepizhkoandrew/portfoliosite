'use client'

import { useState } from 'react'
import AnimatedProgressBar from './AnimatedProgressBar'

interface PMActivityCardProps {
  title: string
  description: string[]
  proficiency: number
  color: string
}

export default function PMActivityCard({
  title,
  description,
  proficiency,
  color,
}: PMActivityCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div
      className="border border-neutral-800/50 rounded-sm overflow-hidden transition-all duration-300 hover:border-neutral-700/50 hover:shadow-lg cursor-pointer"
      style={{
        backgroundColor: isExpanded ? 'rgba(23, 23, 23, 0.5)' : 'rgba(23, 23, 23, 0.3)',
        boxShadow: isExpanded
          ? `0 0 20px ${color}20, inset 0 0 20px ${color}10`
          : `0 0 0px ${color}00`,
      }}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Card Header */}
      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h3 className="text-lg sm:text-xl font-light text-neutral-100 hover-laser">{title}</h3>
          <div
            className="text-lg text-neutral-400 transition-transform duration-300 flex-shrink-0"
            style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            ▼
          </div>
        </div>

        {/* Progress Bar */}
        <AnimatedProgressBar
          value={proficiency}
          color={color}
          label="Proficiency Level"
        />
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div
          className="border-t border-neutral-700/30 px-4 sm:px-6 py-4 sm:py-5 bg-neutral-900/40 space-y-3 animate-in fade-in duration-200"
          style={{
            borderTopColor: `${color}40`,
          }}
        >
          {description.map((item, idx) => (
            <div key={idx} className="flex gap-3">
              <span className="text-neutral-400 flex-shrink-0 text-sm mt-1">●</span>
              <p className="text-sm text-neutral-300 font-light leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
