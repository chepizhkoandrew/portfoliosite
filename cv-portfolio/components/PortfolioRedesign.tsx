'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { profile } from '@/data/content'

interface TypingBioProps {
  showAnimations?: boolean
  onSecondLineComplete?: () => void
  startDelay?: number
}

function TypingBio({ showAnimations = true, onSecondLineComplete, startDelay = 2000 }: TypingBioProps) {
  const [firstLineDisplayed, setFirstLineDisplayed] = useState('')
  const [secondLineDisplayed, setSecondLineDisplayed] = useState('')
  const [thirdLineDisplayed, setThirdLineDisplayed] = useState('')
  const [showGlow, setShowGlow] = useState(false)
  
  const firstLine = profile.bio.firstLine
  const secondLine = 'I can build and launch IT products,'
  const thirdLine = 'from idea to a working solution...'
  const highlightText = 'from idea to a working solution...'
  const typingSpeed = 35

  useEffect(() => {
    if (!showAnimations) {
      setFirstLineDisplayed(firstLine)
      setSecondLineDisplayed(secondLine)
      return
    }

    let timeoutIds: NodeJS.Timeout[] = []
    let intervalIds: NodeJS.Timeout[] = []

    const typeFirstLine = () => {
      const pauseText = 'Analyst and PM experience'
      const pauseIndex = firstLine.indexOf(pauseText) + pauseText.length
      let index = 0

      const typeUntilPause = () => {
        const interval = setInterval(() => {
          if (index < pauseIndex) {
            setFirstLineDisplayed(firstLine.substring(0, index + 1))
            index++
          } else {
            clearInterval(interval)
            const pauseTimeout = setTimeout(() => {
              typeAfterPause()
            }, 1500)
            timeoutIds.push(pauseTimeout)
          }
        }, typingSpeed)
        intervalIds.push(interval as unknown as NodeJS.Timeout)
      }

      const typeAfterPause = () => {
        const resumeInterval = setInterval(() => {
          if (index < firstLine.length) {
            setFirstLineDisplayed(firstLine.substring(0, index + 1))
            index++
          } else {
            clearInterval(resumeInterval)
          }
        }, typingSpeed)
        intervalIds.push(resumeInterval as unknown as NodeJS.Timeout)
      }

      typeUntilPause()
    }

    const timer = setTimeout(() => {
      typeFirstLine()
    }, startDelay)

    timeoutIds.push(timer)

    return () => {
      timeoutIds.forEach((id) => clearTimeout(id))
      intervalIds.forEach((id) => clearInterval(id))
    }
  }, [firstLine, showAnimations, startDelay])

  useEffect(() => {
    if (!showAnimations) {
      setSecondLineDisplayed(secondLine)
      setThirdLineDisplayed(thirdLine)
      return
    }

    if (firstLineDisplayed !== firstLine) return

    setSecondLineDisplayed('')
    setThirdLineDisplayed('')

    let timeoutIds: NodeJS.Timeout[] = []
    let intervalIds: NodeJS.Timeout[] = []
    let secondLineText = ''
    let thirdLineText = ''

    const playGlitchAnimation = (isInitial = false) => {
      const originalText = thirdLine
      let phase = 0
      
      const glitchInterval = setInterval(() => {
        if (phase < 10) {
          setThirdLineDisplayed(originalText
            .split('')
            .map(char => {
              if (char === ' ' || char === '.') return char
              return Math.random() > 0.5 ? '1' : '0'
            })
            .join(''))
        } else if (phase < 20) {
          const progress = (phase - 10) / 10
          setThirdLineDisplayed(originalText
            .split('')
            .map((char, index) => {
              if (char === ' ' || char === '.') return char
              if (index / originalText.length < progress) {
                return char
              }
              return Math.random() > 0.5 ? '1' : '0'
            })
            .join(''))
        } else {
          setThirdLineDisplayed(originalText)
          clearInterval(glitchInterval)
          if (isInitial) {
            setShowGlow(true)
            onSecondLineComplete?.()
          }
        }
        phase++
      }, 50)
      intervalIds.push(glitchInterval as unknown as NodeJS.Timeout)
    }

    const triggerThirdLineGlitch = () => {
      playGlitchAnimation(true)
      
      const recurringGlitchInterval = setInterval(() => {
        playGlitchAnimation(false)
      }, 6000)
      intervalIds.push(recurringGlitchInterval as unknown as NodeJS.Timeout)
    }

    const typeSecondLine = () => {
      let index = 0
      const interval = setInterval(() => {
        if (index < secondLine.length) {
          secondLineText += secondLine[index]
          setSecondLineDisplayed(secondLineText)
          index++
        } else {
          clearInterval(interval)
          const phase2Timeout = setTimeout(() => {
            typeThirdLine()
          }, 2000)
          timeoutIds.push(phase2Timeout)
        }
      }, typingSpeed)
      intervalIds.push(interval as unknown as NodeJS.Timeout)
    }

    const typeThirdLine = () => {
      let index = 0
      const pausePoint = 10
      
      const typeUntilPause = () => {
        const interval = setInterval(() => {
          if (index < pausePoint) {
            thirdLineText += thirdLine[index]
            setThirdLineDisplayed(thirdLineText)
            index++
          } else {
            clearInterval(interval)
            const pauseTimeout = setTimeout(() => {
              typeAfterPause()
            }, 1500)
            timeoutIds.push(pauseTimeout)
          }
        }, typingSpeed)
        intervalIds.push(interval as unknown as NodeJS.Timeout)
      }

      const typeAfterPause = () => {
        const resumeInterval = setInterval(() => {
          if (index < thirdLine.length) {
            thirdLineText += thirdLine[index]
            setThirdLineDisplayed(thirdLineText)
            index++
          } else {
            clearInterval(resumeInterval)
            const glitchStartTimeout = setTimeout(() => {
              triggerThirdLineGlitch()
            }, 500)
            timeoutIds.push(glitchStartTimeout)
          }
        }, typingSpeed)
        intervalIds.push(resumeInterval as unknown as NodeJS.Timeout)
      }

      typeUntilPause()
    }

    const phase1Timeout = setTimeout(() => {
      typeSecondLine()
    }, 1500)

    timeoutIds.push(phase1Timeout)

    return () => {
      timeoutIds.forEach((id) => clearTimeout(id))
      intervalIds.forEach((id) => clearInterval(id))
    }
  }, [firstLineDisplayed, firstLine, showAnimations, onSecondLineComplete, secondLine, thirdLine])

  const renderThirdLineWithHighlight = () => {
    const highlightStartIndex = thirdLine.indexOf(highlightText)
    
    if (highlightStartIndex === -1 || thirdLineDisplayed.length < highlightStartIndex + highlightText.length) {
      return thirdLineDisplayed
    }

    const beforeHighlight = thirdLineDisplayed.substring(0, highlightStartIndex)
    const highlight = thirdLineDisplayed.substring(highlightStartIndex, highlightStartIndex + highlightText.length)
    const afterHighlight = thirdLineDisplayed.substring(highlightStartIndex + highlightText.length)

    return (
      <>
        {beforeHighlight}
        <span className={showGlow ? "neon-highlight-active" : ""}>{highlight}</span>
        {afterHighlight}
      </>
    )
  }

  return (
    <>
      <style>{`
        @keyframes typewriterCursor {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        .typing-cursor {
          animation: typewriterCursor 1.2s infinite;
          font-weight: 700;
          font-size: 1.1em;
        }
        @keyframes neonAppear {
          0% {
            color: #d4d4d8;
            text-shadow: none;
          }
          100% {
            color: #fbbf24;
            text-shadow: 0 0 5px #fbbf24, 0 0 10px #f59e0b, 0 0 20px #f59e0b;
          }
        }
        @keyframes neonAppearGradual {
          0% {
            color: #d4d4d8;
            text-shadow: none;
          }
          100% {
            color: #fbbf24;
            text-shadow: 0 0 5px #fbbf24, 0 0 10px #f59e0b, 0 0 20px #f59e0b;
          }
        }
        @keyframes neonPulse {
          0%, 100% {
            color: #fbbf24;
            text-shadow: 0 0 5px #fbbf24, 0 0 10px #f59e0b, 0 0 20px #f59e0b;
          }
          50% {
            color: #fde047;
            text-shadow: 0 0 8px #fde047, 0 0 15px #fbbf24, 0 0 25px #f59e0b;
          }
        }
        .neon-highlight {
          font-weight: 500;
        }
        .neon-highlight-active {
          animation: neonAppearGradual 2.5s ease-out forwards, neonPulse 1.5s ease-in-out 2.5s infinite;
          font-weight: 500;
        }
      `}</style>
      <div className="w-full min-h-48">
        <p className="text-lg md:text-xl font-light text-neutral-300 leading-relaxed" style={{ letterSpacing: '0.05em', textAlign: 'justify' }}>
          {firstLineDisplayed}
          {secondLineDisplayed && (
            <>
              <br />
              {secondLineDisplayed}
            </>
          )}
          {thirdLineDisplayed && (
            <>
              <br />
              {renderThirdLineWithHighlight()}
            </>
          )}
          {showAnimations && <span className="typing-cursor">|</span>}
        </p>
      </div>
    </>
  )
}

interface PortfolioRedesignProps {
  showAnimations?: boolean
}

export default function PortfolioRedesign({ showAnimations = true }: PortfolioRedesignProps) {
  const [showNameUnderline, setShowNameUnderline] = useState(false)
  const [matrixActive, setMatrixActive] = useState(false)
  const [displayTitle, setDisplayTitle] = useState(profile.title)

  useEffect(() => {
    if (!showAnimations) {
      setMatrixActive(true)
      return
    }

    const triggerTitleGlitch = () => {
      const originalText = profile.title
      let phase = 0
      
      const interval = setInterval(() => {
        if (phase < 10) {
          setDisplayTitle(originalText
            .split('')
            .map(char => {
              if (char === ' ' || char === '-') return char
              return Math.random() > 0.5 ? '1' : '0'
            })
            .join(''))
        } else if (phase < 20) {
          const progress = (phase - 10) / 10
          setDisplayTitle(originalText
            .split('')
            .map((char, index) => {
              if (char === ' ' || char === '-') return char
              if (index / originalText.length < progress) {
                return char
              }
              return Math.random() > 0.5 ? '1' : '0'
            })
            .join(''))
        } else {
          setDisplayTitle(originalText)
          clearInterval(interval)
        }
        phase++
      }, 50)
    }

    const glitchTimer = setTimeout(() => {
      triggerTitleGlitch()
    }, 1800)

    return () => clearTimeout(glitchTimer)
  }, [showAnimations])

  const handleSecondLineComplete = useCallback(() => {
    // Trigger underline and matrix simultaneously
    setShowNameUnderline(true)
    setMatrixActive(true)
  }, [])

  useEffect(() => {
    if (!matrixActive) return

    const canvas = document.getElementById('matrixCanvas') as HTMLCanvasElement
    const overlay = document.getElementById('glitchOverlay') as HTMLElement
    if (!canvas || !overlay) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size - larger than viewport to cover edges
    const resizeCanvas = () => {
      const width = window.innerWidth * 2
      const height = window.innerHeight * 2
      canvas.width = width
      canvas.height = height
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const fontSize = 16
    const columns = Math.floor((window.innerWidth * 2) / fontSize)
    const drops = Array(columns).fill(0)
    const binary = '01'
    const colors = [
      'rgba(212, 175, 55, 0.9)',
      'rgba(212, 175, 55, 0.7)',
      'rgba(212, 175, 55, 0.5)',
      'rgba(212, 175, 55, 0.3)',
      'rgba(212, 175, 55, 0.15)'
    ]

    let animationId: number
    let frameCount = 0

    const drawMatrix = () => {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.08)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.font = `${fontSize}px 'Courier New', monospace`

      for (let i = 0; i < drops.length; i++) {
        const char = binary[Math.floor(Math.random() * binary.length)]
        const colorIndex = Math.floor(Math.random() * colors.length)
        ctx.fillStyle = colors[colorIndex]
        ctx.shadowBlur = 8
        ctx.shadowColor = 'rgba(212, 175, 55, 0.5)'

        const x = i * fontSize
        const y = drops[i] * fontSize
        ctx.fillText(char, x, y)
        ctx.shadowBlur = 0

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        
        // Only increment every 2 frames to slow down the falling speed
        if (frameCount % 2 === 0) {
          drops[i]++
        }
      }
      
      frameCount++
    }

    canvas.classList.add('active')
    overlay.classList.add('active')

    drops.fill(0)
    drops.forEach((_, i) => {
      drops[i] = Math.floor(Math.random() * -50)
    })

    const animate = () => {
      drawMatrix()
      animationId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [matrixActive])

  return (
    <div className="min-h-screen text-neutral-100 flex flex-col relative">
      <style>{`
        div.min-h-screen {
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
          position: relative;
          z-index: 0;
        }

        #matrixCanvas {
          position: fixed;
          top: -50vh;
          left: -50vw;
          width: 200vw;
          height: 200vh;
          pointer-events: none;
          z-index: -1;
          opacity: 0;
          transition: opacity 1.5s ease-out;
          display: block;
          margin: 0;
          padding: 0;
        }

        #matrixCanvas.active {
          opacity: 1;
        }

        .glitch-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: -1;
          opacity: 0;
          background: radial-gradient(circle at center, transparent 0%, rgba(212, 175, 55, 0.03) 100%);
        }

        .glitch-overlay.active {
          animation: glitchPulse 3s ease-in-out;
        }

        @keyframes glitchPulse {
          0%, 100% { opacity: 0; }
          10% { opacity: 0.4; }
          15% { opacity: 0.2; }
          20% { opacity: 0.5; }
          30% { opacity: 0.15; }
          50% { opacity: 0.3; }
          70% { opacity: 0.1; }
          80% { opacity: 0.25; }
        }

        @keyframes blurShimmer {
          from {
            opacity: 0;
            filter: blur(10px);
            transform: translateY(20px);
          }
          50% {
            filter: blur(5px) brightness(1.3);
          }
          to {
            opacity: 1;
            filter: blur(0px);
            transform: translateY(0);
          }
        }

        @keyframes slideUnderline {
          from {
            width: 0;
            opacity: 0;
          }
          to {
            width: 100%;
            opacity: 1;
          }
        }

        .blur-shimmer {
          animation: blurShimmer 2s ease-out 1s forwards;
          opacity: 0;
        }

        .blur-shimmer-instant {
          opacity: 1;
        }

        .name-underline {
          position: relative;
          display: inline-block;
        }

        .name-underline::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 0;
          height: 3px;
          background: linear-gradient(90deg, 
            #00FFC8 0%,
            #FF00FF 50%,
            #F0FF00 100%
          );
        }

        .name-underline.show-underline::after {
          animation: slideUnderline 1s ease-out forwards;
        }

        .glow-button {
          box-shadow: 0 0 20px rgba(0, 255, 200, 0.1);
          transition: all 0.3s ease;
        }

        .glow-button:hover {
          box-shadow: 0 0 30px rgba(0, 255, 200, 0.3),
                      0 0 60px rgba(255, 0, 255, 0.2);
          transform: translateY(-2px);
        }
      `}</style>

      <section className="flex-1 flex flex-col items-center justify-start" style={{ marginRight: '20px', marginLeft: '20px' }}>
        <h1 className={`text-5xl md:text-6xl lg:text-7xl font-light tracking-widest text-neutral-100 name-underline text-center max-w-xl md:max-w-2xl lg:max-w-3xl ${showNameUnderline ? 'show-underline' : ''}`} style={{ marginTop: '150px' }}>
          {profile.name}
        </h1>

        <div className="h-8 md:h-10 lg:h-12" />

        <p className="text-3xl md:text-4xl lg:text-5xl font-light text-neutral-300 text-center" style={{ letterSpacing: '0.08em', whiteSpace: 'nowrap', overflow: 'hidden' }}>
          {displayTitle}
        </p>

        <div className="h-8 md:h-10 lg:h-12" />

        <div className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl px-4 h-72">
          <TypingBio showAnimations={showAnimations} onSecondLineComplete={handleSecondLineComplete} startDelay={100} />
        </div>

        <div style={{ height: '1px' }} />

        <div className="flex gap-4 md:gap-8 justify-center">
          <Link
            href="/experience"
            className="glow-button w-40 md:w-48 h-16 flex items-center justify-center bg-neutral-900 border border-neutral-700 hover:border-cyan-400/50 rounded-sm text-neutral-100 font-light tracking-wider uppercase text-sm transition-all"
          >
            About me
          </Link>
          <Link
            href="/contact"
            className="glow-button w-40 md:w-48 h-16 flex items-center justify-center bg-neutral-900 border border-neutral-700 hover:border-cyan-400/50 rounded-sm text-neutral-100 font-light tracking-wider uppercase text-sm transition-all"
          >
            Get in Touch
          </Link>
        </div>
      </section>

      <canvas id="matrixCanvas" />
      <div id="glitchOverlay" className="glitch-overlay" />
    </div>
  )
}
