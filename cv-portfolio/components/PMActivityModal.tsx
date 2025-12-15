'use client'

import { useEffect } from 'react'
import AnimatedProgressBar from './AnimatedProgressBar'

interface PMActivityModalProps {
  title: string
  description: string[]
  proficiency: number
  onClose: () => void
}

export default function PMActivityModal({
  title,
  description,
  proficiency,
  onClose,
}: PMActivityModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [onClose])

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <div
          className="bg-neutral-900 border border-neutral-700/50 rounded-sm w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          style={{
            boxShadow: '0 0 30px #f59e0b40, inset 0 0 30px #f59e0b10',
            maxWidth: 'calc(100% - 20px)',
            marginLeft: '10px',
            marginRight: '10px',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="sticky top-0 bg-neutral-900/95 backdrop-blur border-b border-neutral-700/50 flex justify-between items-start gap-4"
            style={{
              borderBottomColor: '#f59e0b40',
              padding: '1rem',
            }}
          >
            <h2 className="text-2xl sm:text-3xl font-light text-neutral-100 hover-laser">{title}</h2>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-200 transition-colors flex-shrink-0 text-xl font-light"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="space-y-6" style={{ padding: '1.5rem 1rem' }}>
            {/* Progress Bar */}
            <div>
              <AnimatedProgressBar value={proficiency} color="#fbbf24" label="Proficiency Level" />
            </div>

            {/* Activities */}
            <div className="space-y-4">
              <h3 className="text-neutral-300 font-light text-sm uppercase tracking-wider opacity-70">
                Activities
              </h3>
              <div className="space-y-3">
                {description.map((item, idx) => (
                  <div key={idx} className="flex gap-3">
                    <span className="text-yellow-500/80 flex-shrink-0 text-sm mt-1">●</span>
                    <p className="text-sm text-neutral-300 font-light leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modal-enter {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .fixed:has(> div[style*="box-shadow"]) > div:last-child {
          animation: modal-enter 0.2s ease-out;
        }

        .hover-laser {
          position: relative;
          transition: all 0.3s ease;
        }
        .hover-laser::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 1px;
          background: linear-gradient(90deg, 
            #00FFC8 0%,
            #FF00FF 50%,
            #F0FF00 100%
          );
          transition: width 0.3s ease;
        }
        .hover-laser:hover::after {
          width: 100%;
        }
      `}</style>
    </>
  )
}
