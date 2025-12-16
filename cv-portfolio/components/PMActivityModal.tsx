'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
  const router = useRouter()

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

  const handleSeeDetails = () => {
    const bulletPoints = description.map((point) => `• ${point}`).join('\n')
    const message = `I am interested in how Andrii can help with these things. Did he have practical experience with such things or it's just a marketing / AI fluff?\n\n${bulletPoints}`
    const encodedMessage = encodeURIComponent(message)
    router.push(`/chatbot?initialMessage=${encodedMessage}`)
  }

  return (
    <>
      {/* Overlay */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)',
          zIndex: 40,
          cursor: 'pointer',
        }}
        onClick={onClose}
      />

      {/* Modal Container */}
      <div 
        style={{
          position: 'fixed',
          top: '1rem',
          left: '1rem',
          right: '1rem',
          bottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          pointerEvents: 'none',
        }}
      >
        {/* Modal Content */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '600px',
            height: '100%',
            maxHeight: '100%',
            overflowY: 'auto',
            backgroundColor: 'rgb(23, 23, 23)',
            border: '1px solid rgb(55, 55, 55)',
            borderRadius: '4px',
            boxShadow: '0 0 30px #f59e0b40, inset 0 0 30px #f59e0b10',
            pointerEvents: 'auto',
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            style={{
              position: 'sticky',
              top: 0,
              backgroundColor: 'rgba(23, 23, 23, 0.95)',
              backdropFilter: 'blur(10px)',
              borderBottom: '1px solid rgba(245, 158, 11, 0.25)',
              padding: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '1rem',
              zIndex: 10,
            }}
          >
            <h2 
              style={{
                margin: 0,
                fontSize: 'clamp(1.125rem, 5vw, 1.875rem)',
                fontWeight: 300,
                color: 'rgb(245, 245, 245)',
                wordBreak: 'break-word',
                flex: 1,
              }}
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgb(156, 163, 175)',
                cursor: 'pointer',
                fontSize: '1.25rem',
                fontWeight: 300,
                flexShrink: 0,
                padding: 0,
                transition: 'color 0.3s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'rgb(229, 231, 235)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(156, 163, 175)'}
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              padding: '1.5rem 1rem',
              flex: 1,
              overflowY: 'auto',
            }}
          >
            {/* Progress Bar */}
            <div>
              <AnimatedProgressBar
                value={proficiency}
                color="#fbbf24"
                label="Proficiency Level"
                delay={Math.random() * 0.8}
              />
            </div>

            {/* Activities */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 
                style={{
                  margin: 0,
                  color: 'rgb(209, 213, 219)',
                  fontWeight: 300,
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  opacity: 0.7,
                }}
              >
                Andrii can:
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {description.map((item, idx) => (
                  <div 
                    key={idx} 
                    style={{
                      display: 'flex',
                      gap: '0.75rem',
                    }}
                  >
                    <span 
                      style={{
                        color: 'rgb(234, 179, 8)',
                        flexShrink: 0,
                        fontSize: '0.875rem',
                        marginTop: '0.25rem',
                        opacity: 0.8,
                      }}
                    >
                      ●
                    </span>
                    <p 
                      style={{
                        margin: 0,
                        fontSize: '0.875rem',
                        color: 'rgb(209, 213, 219)',
                        fontWeight: 300,
                        lineHeight: 1.625,
                      }}
                    >
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* See Details Button */}
            <button
              onClick={handleSeeDetails}
              style={{
                backgroundColor: 'rgb(23, 23, 23)',
                border: '1px solid rgb(55, 55, 55)',
                color: 'rgb(245, 245, 245)',
                padding: '0.75rem 1.5rem',
                fontSize: '0.875rem',
                fontWeight: 300,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                cursor: 'pointer',
                borderRadius: '4px',
                transition: 'all 0.3s ease',
                boxShadow: '0 0 20px rgba(0, 255, 200, 0.1)',
                marginTop: '0.5rem',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0, 255, 200, 0.5)'
                e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 255, 200, 0.3), 0 0 60px rgba(255, 0, 255, 0.2)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgb(55, 55, 55)'
                e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 200, 0.1)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              See Details
            </button>
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

        div[style*="maxHeight: 90vh"] {
          animation: modal-enter 0.2s ease-out;
        }
      `}</style>
    </>
  )
}
