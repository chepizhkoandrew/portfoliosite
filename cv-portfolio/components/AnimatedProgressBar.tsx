'use client'

import { useEffect, useRef, useState } from 'react'

interface AnimatedProgressBarProps {
  value: number
  color?: string
  label?: string
  delay?: number
}

export default function AnimatedProgressBar({
  value,
  color = '#fbbf24',
  label,
  delay = 0,
}: AnimatedProgressBarProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const barRef = useRef<HTMLDivElement>(null)
  const animationDuration = 0.5 + Math.random() * 0.6

  useEffect(() => {
    let animationFrameId: number
    let currentValue = 0
    const increment = value / 60

    const animate = () => {
      currentValue += increment
      if (currentValue < value) {
        setDisplayValue(Math.floor(currentValue))
        animationFrameId = requestAnimationFrame(animate)
      } else {
        setDisplayValue(value)
      }
    }

    const timeoutId = setTimeout(() => {
      animationFrameId = requestAnimationFrame(animate)
    }, delay * 1000)

    return () => {
      clearTimeout(timeoutId)
      cancelAnimationFrame(animationFrameId)
    }
  }, [value, delay])

  return (
    <div className="w-full">
      {label && <div className="text-xs text-neutral-400 mb-1 font-light">{label}</div>}
      <div
        className="relative w-full h-2 bg-neutral-800/50 rounded-full overflow-hidden border border-neutral-700/30"
        ref={barRef}
      >
        <div
          className="absolute top-0 left-0 h-full rounded-full animate-progress-load"
          style={{
            width: `${displayValue}%`,
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}, inset 0 0 8px ${color}40`,
            animationDelay: `${delay}s`,
            animationDuration: `${animationDuration}s`,
          }}
        />

        {/* Scan line effect */}
        <div
          className="absolute top-0 left-0 h-full w-1/3 opacity-50"
          style={{
            backgroundImage: `linear-gradient(90deg, transparent, ${color}40, transparent)`,
            animation: 'scan 2s infinite',
          }}
        />
      </div>
      <div className="text-xs text-neutral-400 mt-1 font-light text-right">{displayValue}%</div>

      <style>{`
        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        
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
