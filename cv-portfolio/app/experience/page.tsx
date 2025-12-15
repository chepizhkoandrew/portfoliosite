'use client'

import Link from 'next/link'
import { experiences } from '@/data/experience'
import { profile } from '@/data/content'
import { glitchText, partialGlitchText } from '@/lib/glitchEffect'
import PMActivityCard from '@/components/PMActivityCard'
import PMActivityModal from '@/components/PMActivityModal'
import { pmActivities, PMActivity } from '@/data/pmActivities'

import { useState, useEffect } from 'react'

export default function ExperiencePage() {
  const [matrixActive, setMatrixActive] = useState(false)
  const [displayTitle, setDisplayTitle] = useState('Career path')
  const [selectedActivity, setSelectedActivity] = useState<PMActivity | null>(null)
  const [descriptionGlitch, setDescriptionGlitch] = useState('product management')

  useEffect(() => {
    const glitchTimer = setTimeout(() => {
      const originalText = 'Career path'
      let phase = 0
      
      const interval = setInterval(() => {
        if (phase < 10) {
          setDisplayTitle(glitchText(originalText))
        } else if (phase < 20) {
          const progress = (phase - 10) / 10
          setDisplayTitle(partialGlitchText(originalText, 1 - progress))
        } else {
          setDisplayTitle(originalText)
          clearInterval(interval)
        }
        phase++
      }, 50)
    }, 2000)

    return () => clearTimeout(glitchTimer)
  }, [])

  useEffect(() => {
    const descriptionGlitchTimer = setTimeout(() => {
      const originalText = 'product management'
      let phase = 0
      
      const interval = setInterval(() => {
        if (phase < 10) {
          setDescriptionGlitch(glitchText(originalText))
        } else if (phase < 20) {
          const progress = (phase - 10) / 10
          setDescriptionGlitch(partialGlitchText(originalText, 1 - progress))
        } else {
          setDescriptionGlitch(originalText)
          clearInterval(interval)
        }
        phase++
      }, 50)
    }, 2500)

    return () => clearTimeout(descriptionGlitchTimer)
  }, [])

  useEffect(() => {
    const matrixTimer = setTimeout(() => {
      setMatrixActive(true)
    }, 2000)

    return () => clearTimeout(matrixTimer)
  }, [])

  useEffect(() => {
    if (!matrixActive) return

    const canvas = document.getElementById('experienceMatrixCanvas') as HTMLCanvasElement
    const overlay = document.getElementById('experienceGlitchOverlay') as HTMLElement
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
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
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
        .neon-back-link {
          animation: neonAppear 1s ease-out forwards, neonPulse 1.5s ease-in-out 1s infinite;
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
        .company-logo {
          mask-image: radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%);
          -webkit-mask-image: radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%);
        }

        #experienceMatrixCanvas {
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

        #experienceMatrixCanvas.active {
          opacity: 1;
        }

        .experience-glitch-overlay {
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

        .experience-glitch-overlay.active {
          animation: experienceGlitchPulse 3s ease-in-out;
        }

        @keyframes experienceGlitchPulse {
          0%, 100% { opacity: 0; }
          10% { opacity: 0.4; }
          15% { opacity: 0.2; }
          20% { opacity: 0.5; }
          30% { opacity: 0.15; }
          50% { opacity: 0.3; }
          70% { opacity: 0.1; }
          80% { opacity: 0.25; }
        }

        @keyframes slide-in-from-bottom {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .slide-in-from-bottom {
          animation: slide-in-from-bottom 0.5s ease-out forwards;
        }

        .animate-in {
          animation-fill-mode: both;
        }

        .fade-in {
          opacity: 1;
        }
      `}</style>

      {/* Experience Section */}
      <section className="relative min-h-screen flex items-center justify-center px-3 md:px-6 lg:px-12 py-20" style={{ zIndex: 10 }}>
        <Link href="/" className="neon-back-link absolute top-20 left-1/2 transform -translate-x-1/2 inline-flex items-center gap-2 text-2xl hover:text-neutral-50 transition-colors text-center justify-center z-50" style={{ padding: '20px' }}>
          <span>←</span>
          <span>Back</span>
        </Link>

        <div className="max-w-6xl w-full" style={{ paddingTop: '150px' }}>
          <h1 className="text-5xl md:text-6xl font-light text-neutral-100 text-center hover-laser" style={{ marginBottom: '40px' }}>
            {displayTitle}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ paddingLeft: '10px', paddingRight: '10px' }}>
            {experiences.map((exp) => (
              <Link
                key={exp.id}
                href={`/experience/${exp.id}`}
                className="group"
              >
                <div
                  className="glow-button p-6 rounded-sm border border-neutral-700 bg-neutral-900 hover:border-cyan-400/50 transition-all duration-300 h-full flex flex-col"
                >
                  <div style={{ padding: '5px' }} className="flex flex-col flex-1">
                    <div className="flex items-start justify-between mb-4 gap-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-light text-neutral-100 group-hover:text-neutral-50 transition-colors">
                          {exp.title}
                        </h3>
                        <p className="text-sm text-neutral-400 mt-1">{exp.company}</p>
                      </div>
                      {exp.logo && (
                        <div className="flex-shrink-0">
                          <img
                            src={exp.logo}
                            alt={exp.company}
                            style={{ width: '50px', height: '50px', objectFit: 'contain', opacity: 0.7, borderRadius: '50%' }}
                            className="company-logo group-hover:opacity-100 transition-opacity"
                          />
                        </div>
                      )}
                    </div>

                    <p className="text-sm text-neutral-400 mb-4 line-clamp-3 flex-1">
                      {exp.description[0]}
                    </p>

                    <div className="text-xs text-neutral-500 mt-auto">
                      <span>{exp.duration}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-24 flex justify-center md:hidden">
            <Link 
              href="/" 
              className="neon-back-link inline-flex items-center gap-2 text-2xl hover:text-neutral-50 transition-colors text-center justify-center"
              style={{ paddingTop: '40px', paddingBottom: '40px' }}
            >
              <span>←</span>
              <span>Back</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Hire Andrii Section */}
      <section className="relative min-h-screen flex items-center justify-center px-3 md:px-6 lg:px-12 py-20" style={{ zIndex: 10 }}>
        <div className="max-w-6xl w-full" style={{ paddingTop: '50px' }}>
          <h2 className="text-5xl md:text-6xl font-light text-neutral-100 text-center hover-laser" style={{ marginBottom: '2rem' }}>
            Why should you hire Andrii?
          </h2>
          <p className="text-neutral-400 font-light text-lg text-center" style={{ maxWidth: '800px', margin: '0 auto 3rem' }}>
            You don't need to choose between soft / business / technical / communication skills. He has gone his way from a slide-maker to a product builder. He has strong business sense and can execute the work hands-on.
          </p>
          
          <div className="flex justify-center" style={{ marginTop: '3rem' }}>
            <img 
              src="https://res.cloudinary.com/dzhwsjuxy/image/upload/v1765786566/3_pills_tm35ex.png"
              alt="Skills pills"
              style={{
                maxWidth: '100%',
                height: 'auto',
                maxHeight: '500px',
                objectFit: 'contain'
              }}
            />
          </div>
        </div>
      </section>

      {/* Activities and Skills Section */}
      <section className="relative min-h-screen flex items-center justify-center px-3 md:px-6 lg:px-12 py-20" style={{ zIndex: 10 }}>
        <div className="max-w-6xl w-full" style={{ paddingTop: '50px' }}>
          <h2 className="text-5xl md:text-6xl font-light text-neutral-100 text-center hover-laser" style={{ marginBottom: '1.5rem' }}>
            Activities and skills
          </h2>
          <div style={{ paddingBottom: '3rem', marginBottom: '2rem' }}>
            <p className="text-neutral-400 font-light text-lg text-center" style={{ marginBottom: '0.5rem' }}>
              Core <span style={{ color: '#fbbf24' }}>{descriptionGlitch}</span> capabilities and proficiencies
            </p>
            <p className="text-neutral-500 font-light text-xs text-center">
              [click card to expand]
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ paddingLeft: '10px', paddingRight: '10px' }}>
            {pmActivities.map((activity, idx) => (
              <div
                key={activity.id}
                className="animate-in fade-in slide-in-from-bottom"
                style={{
                  animationDelay: `${idx * 50}ms`,
                }}
              >
                <PMActivityCard
                  title={activity.title}
                  proficiency={activity.proficiency}
                  onClick={() => setSelectedActivity(activity)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedActivity && (
        <PMActivityModal
          title={selectedActivity.title}
          description={selectedActivity.description}
          proficiency={selectedActivity.proficiency}
          onClose={() => setSelectedActivity(null)}
        />
      )}

      {/* Footer */}
      <footer className="relative border-t border-neutral-800/50 py-8 px-3 md:px-6 lg:px-12" style={{ zIndex: 10 }}>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/20 to-transparent" />
        
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-neutral-500 font-light text-sm">
            © 2025 {profile.name}. All rights reserved.
          </p>
        </div>
      </footer>

      <canvas id="experienceMatrixCanvas" />
      <div id="experienceGlitchOverlay" className="experience-glitch-overlay" />
    </div>
  )
}
