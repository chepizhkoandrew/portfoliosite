'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FaLinkedin, FaWhatsapp, FaTelegram, FaGithub, FaInstagram } from 'react-icons/fa'
import { profile, contactInfo } from '@/data/content'

export default function ContactPage() {
  const [matrixActive, setMatrixActive] = useState(false)
  const [displayEmail, setDisplayEmail] = useState(contactInfo.email)

  useEffect(() => {
    const triggerBinaryDissolve = () => {
      const originalText = contactInfo.email
      let phase = 0
      
      const interval = setInterval(() => {
        if (phase < 15) {
          const progress = phase / 15
          setDisplayEmail(originalText
            .split('')
            .map(char => {
              if (char === ' ' || char === '@' || char === '.') return char
              if (Math.random() < progress) {
                return Math.random() > 0.5 ? '1' : '0'
              }
              return char
            })
            .join(''))
        } else if (phase < 30) {
          const progress = (phase - 15) / 15
          setDisplayEmail(originalText
            .split('')
            .map((char, index) => {
              if (char === ' ' || char === '@' || char === '.') return char
              if (index / originalText.length < progress) {
                return char
              }
              return Math.random() > 0.5 ? '1' : '0'
            })
            .join(''))
        } else {
          setDisplayEmail(originalText)
          clearInterval(interval)
        }
        phase++
      }, 60)
    }

    const glitchTimer = setTimeout(() => {
      triggerBinaryDissolve()
    }, 100)

    const matrixTimer = setTimeout(() => {
      setMatrixActive(true)
    }, 2000)

    return () => {
      clearTimeout(glitchTimer)
      clearTimeout(matrixTimer)
    }
  }, [])

  useEffect(() => {
    if (!matrixActive) return

    const canvas = document.getElementById('contactMatrixCanvas') as HTMLCanvasElement
    const overlay = document.getElementById('contactGlitchOverlay') as HTMLElement
    if (!canvas || !overlay) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

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

    const stopTimer = setTimeout(() => {
      canvas.classList.remove('active')
      overlay.classList.remove('active')
      setTimeout(() => {
        cancelAnimationFrame(animationId)
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        setMatrixActive(false)
      }, 1500)
    }, 60000)

    return () => {
      clearTimeout(stopTimer)
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [matrixActive])

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100" style={{ position: 'relative', zIndex: 1 }}>
            <style>{`
        html {
          background-color: #0a0a0a;
        }
        body {
          background-color: #0a0a0a;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .fade-in-up {
          animation: fadeIn 1s ease-out forwards;
        }
        .hover-laser {
          position: relative;
          transition: color 0.3s ease;
        }
        .hover-laser::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 0;
          height: 2px;
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
        .email-glitch {
          letter-spacing: 0.05em;
        }
        .neon-back-link {
          animation: neonAppear 1s ease-out forwards, neonPulse 1.5s ease-in-out 1s infinite;
        }

        #contactMatrixCanvas {
          position: fixed;
          top: -50vh;
          left: -50vw;
          width: 200vw;
          height: 200vh;
          pointer-events: none;
          z-index: 1;
          opacity: 0;
          transition: opacity 1.5s ease-out;
          display: block;
          margin: 0;
          padding: 0;
        }

        #contactMatrixCanvas.active {
          opacity: 1;
        }

        .contact-glitch-overlay {
          position: fixed;
          top: -50vh;
          left: -50vw;
          width: 200vw;
          height: 200vh;
          pointer-events: none;
          z-index: 1;
          opacity: 0;
          background: radial-gradient(circle at center, transparent 0%, rgba(212, 175, 55, 0.03) 100%);
        }

        .contact-glitch-overlay.active {
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
      `}</style>

      {/* Contact Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-3 md:px-6 lg:px-12" style={{ zIndex: 10 }}>
        <Link href="/" className="neon-back-link absolute top-20 left-1/2 transform -translate-x-1/2 inline-flex items-center gap-2 text-2xl hover:text-neutral-50 transition-colors text-center justify-center">
          <span>←</span>
          <span>Back to home</span>
        </Link>

        <div className="max-w-2xl w-full flex flex-col items-center mt-20">
          <h1 className="text-5xl md:text-6xl font-light text-neutral-100 mb-40 text-center">
            Get in Touch
          </h1>

          <div className="space-y-24 text-center w-full">
            {/* Email */}
            <div>
              <p className="text-sm text-neutral-400 mb-4 uppercase tracking-widest" style={{ marginTop: '5px', marginBottom: '5px' }}>Email</p>
              <a
                href={`mailto:${contactInfo.email}`}
                className="hover-laser inline-block text-2xl text-neutral-100 hover:text-neutral-50 transition-colors email-glitch"
              >
                {displayEmail}
              </a>
            </div>

            {/* Social Links */}
            <div>
              <p className="text-sm text-neutral-400 mb-6 uppercase tracking-widest" style={{ marginTop: '5px', marginBottom: '5px' }}>Social</p>
              <div className="flex justify-center gap-6 flex-wrap">
                <a
                  href={contactInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-cyan-400 transition-all duration-300 hover:scale-110"
                >
                  <FaLinkedin size={28} />
                </a>
                <a
                  href={contactInfo.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-green-400 transition-all duration-300 hover:scale-110"
                >
                  <FaWhatsapp size={28} />
                </a>
                <a
                  href={contactInfo.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-cyan-400 transition-all duration-300 hover:scale-110"
                >
                  <FaTelegram size={28} />
                </a>
                <a
                  href={contactInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-neutral-100 transition-all duration-300 hover:scale-110"
                >
                  <FaGithub size={28} />
                </a>
                <a
                  href={contactInfo.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-pink-400 transition-all duration-300 hover:scale-110"
                >
                  <FaInstagram size={28} />
                </a>
              </div>
            </div>

            {/* Location */}
            <div>
              <p className="text-sm text-neutral-400 mb-4 uppercase tracking-widest" style={{ marginTop: '5px', marginBottom: '5px' }}>Location</p>
              <a
                href={contactInfo.locationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover-laser inline-block text-2xl text-neutral-100 hover:text-neutral-50 transition-colors"
              >
                {contactInfo.location} →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-neutral-800/50 py-8 px-3 md:px-6 lg:px-12">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/20 to-transparent" />
        
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-neutral-500 font-light text-sm">
            © 2025 {profile.name}. All rights reserved.
          </p>
        </div>
      </footer>

      <canvas id="contactMatrixCanvas" />
      <div id="contactGlitchOverlay" className="contact-glitch-overlay" />
    </div>
  )
}
