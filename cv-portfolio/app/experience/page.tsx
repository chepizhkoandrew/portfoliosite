'use client'

import Link from 'next/link'
import { experiences } from '@/data/experience'
import { profile } from '@/data/content'
import { glitchText, partialGlitchText } from '@/lib/glitchEffect'
import PMActivityCard from '@/components/PMActivityCard'
import PMActivityModal from '@/components/PMActivityModal'
import GlitchText from '@/components/GlitchText'
import { pmActivities, PMActivity } from '@/data/pmActivities'
import { MobileMenu } from '@/components/MobileMenu'
import { downloadCV } from '@/lib/downloadCV'

import { useState, useEffect, useCallback } from 'react'

interface DevActivity extends PMActivity {}

const devActivities: DevActivity[] = [
  {
    id: 'ai-chatbots',
    title: 'AI Chatbots',
    description: [
      'Build chatbots that answer customer or internal questions using existing documents and data.',
      'Train assistants on local knowledge bases with tools like LangChain, LlamaIndex, or OpenAI Assistants API.',
      'Connect chatbots to Slack, WhatsApp, Instagram, Telegram, websites, or internal systems.',
      'Enable chatbots to follow workflows, retrieve information from APIs, and update records when required.',
    ],
    proficiency: 78,
  },
  {
    id: 'web-parsing-data-collection',
    title: 'Web Parsing & Data Collection',
    description: [
      'Create scrapers, crawlers, and pipelines for collecting structured data from websites, APIs, PDFs, and documents.',
      'Evaluate and select reliable enrichment APIs from large marketplaces of tools.',
      'Estimate operational costs to avoid overspending on high-volume API calls ($0.01–$0.03 per request).',
      'Combine browser automation, API polling, ETL scheduling, and storage strategies for stable data acquisition.',
      'Ensure compliance with rate limits, error handling, and long-term maintainability.',
    ],
    proficiency: 79,
  },
  {
    id: 'generative-ai-pipelines',
    title: 'Gen-AI Pipelines & Content Creation',
    description: [
      'Automate production of text, summaries, images, audio, and structured outputs using OpenAI, Hugging Face, or custom models.',
      'Deploy models on-premise where data protection or compliance requires it.',
      'Generate advertising content, social media assets, product descriptions, emails, or batch documents at scale.',
      'Set up workflows where human review is optional and only applied to final outputs.',
      'Produce high-volume, consistent content with minimal manual effort.',
    ],
    proficiency: 81,
  },
  {
    id: 'data-modeling',
    title: 'Data Modeling',
    description: [
      'Analyse business requirements and translate them into clear data structures for systems and applications.',
      'Map entities, attributes, and relationships to form a consistent logical data model.',
      'Identify existing data sources, review their structure, and plan how they should interact.',
      'Define connection types, hierarchy, and data flow between components.',
      'Create visual diagrams and topology maps to show how the whole system fits together.',
      'Support engineering teams with a stable, predictable data foundation before development starts.',
    ],
    proficiency: 85,
  },
  {
    id: 'reverse-engineering',
    title: 'Reverse Engineering',
    description: [
      'Analyse existing systems when documentation is missing or outdated and no one can explain how they work.',
      'Discover hidden logic, legacy algorithms, and undocumented workflows by testing real scenarios.',
      'Audit system behaviour to verify whether processes operate as originally intended.',
      'Collect knowledge from team members before organisational changes or support transitions.',
      'Create clear documentation that explains how the system functions today and what risks exist.',
      'This approach was used in large-scale support-transfer projects, such as migrating pharma system support from Russia to Ukraine.',
    ],
    proficiency: 88,
  },
  {
    id: 'low-code-prototyping',
    title: 'Low-Code Prototyping',
    description: [
      'Build functional MVPs using platforms like Airtable, Softr, Retool, Glide, or similar tools.',
      'Enable clients to test real workflows, validate assumptions, and understand the actual value of the solution.',
      'Provide an interactive environment where users can "touch and try" the product before core development begins.',
      'Capture detailed insights about required features, missing flows, and true priorities based on real usage.',
      'Reduce risk for engineering teams by replacing a vague scope with a validated, working reference model.',
      'Accelerate discovery and reduce wasted development time by confirming what should and should not be built.',
    ],
    proficiency: 86,
  },
  {
    id: 'api-integrations',
    title: 'API Integrations & System Connectivity',
    description: [
      'Connect CRMs, ERPs, messengers, payment systems, and internal tools into unified workflows.',
      'Use Zapier, Make, n8n, or custom scripts when ready-made connectors are insufficient.',
      'Implement MCP servers and AI-based data translation for complex or unstructured integrations.',
      'Configure reliable authentication, error handling, retries, and monitoring for stable operation.',
      'Integrate any system exposing an API, even when vendors do not provide ready solutions.',
    ],
    proficiency: 80,
  },
  {
    id: 'digital-knowledge-bases',
    title: 'Digital Knowledge Bases',
    description: [
      'Audit existing knowledge bases: verify accuracy, remove duplicates, update outdated entries.',
      'Build structured repositories with clear taxonomy, tagging, and version control.',
      'Implement embedding-based search to improve information retrieval and support AI assistants.',
      'Automate synchronisation across help centers, internal wikis, and chatbots.',
    ],
    proficiency: 82,
  },
  {
    id: 'internal-tools',
    title: 'Internal Tools, Apps, Portals',
    description: [
      'Build focused tools to remove operational bottlenecks: dashboards, calculators, validators, configuration helpers.',
      'Embed tools into existing systems via iframes or deliver them as Chrome extensions for daily workflows.',
      'Replace repetitive manual work with targeted utilities, saving months of FTE time annually.',
      'Use Airtable, Softr, Retool, or similar platforms to create internal apps without full engineering cycles.',
      'Allow power users to update tools directly through admin panels without additional development.',
      'Use such prototypes to refine requirements before developing long-term custom systems.',
    ],
    proficiency: 77,
  },
]

export default function ExperiencePage() {
  const [matrixActive, setMatrixActive] = useState(false)
  const [pathGlitch, setPathGlitch] = useState('path')
  const [selectedActivity, setSelectedActivity] = useState<PMActivity | null>(null)
  const [descriptionGlitch, setDescriptionGlitch] = useState('product management')
  const [hireGlitch, setHireGlitch] = useState("You don't need to choose")
  const [shouldWordGlitch, setShouldWordGlitch] = useState('should')
  const [hireWordGlitch, setHireWordGlitch] = useState('hire')

  const playGlitchAnimation = useCallback((textItems: Array<{ text: string; setter: (text: string) => void }>) => {
    let phase = 0
    
    const interval = setInterval(() => {
      textItems.forEach(({ text, setter }) => {
        if (phase < 2) {
          setter(glitchText(text))
        } else if (phase < 15) {
          const progress = (phase - 2) / 13
          setter(partialGlitchText(text, progress))
        } else {
          setter(text)
        }
      })
      phase++
      if (phase > 15) {
        clearInterval(interval)
      }
    }, 50)
    
    return interval
  }, [])

  useEffect(() => {
    const timeoutIds: NodeJS.Timeout[] = []
    const intervalIds: NodeJS.Timeout[] = []

    const textItems = [
      { text: 'path', setter: setPathGlitch },
      { text: 'product management', setter: setDescriptionGlitch },
      { text: "You don't need to choose", setter: setHireGlitch },
      { text: 'Two', setter: setShouldWordGlitch },
      { text: 'Hire', setter: setHireWordGlitch },
    ]

    const startSyncedGlitchCycle = (delay: number) => {
      const timeout = setTimeout(() => {
        const interval = playGlitchAnimation(textItems)
        intervalIds.push(interval as unknown as NodeJS.Timeout)
        
        const recurringInterval = setInterval(() => {
          playGlitchAnimation(textItems)
        }, 6000)
        intervalIds.push(recurringInterval as unknown as NodeJS.Timeout)
      }, delay)
      
      timeoutIds.push(timeout)
    }

    startSyncedGlitchCycle(2000)

    return () => {
      timeoutIds.forEach(id => clearTimeout(id))
      intervalIds.forEach(id => clearInterval(id))
    }
  }, [playGlitchAnimation])

  useEffect(() => {
    const matrixTimer = setTimeout(() => {
      setMatrixActive(true)
    }, 500)

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

    return () => {
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

      <MobileMenu onDownloadCV={downloadCV} />

      {/* Career Path Hero Section with Title Overlay */}
      <section className="relative flex items-center justify-center px-3 md:px-6 lg:px-12 py-16" style={{ zIndex: 10 }}>
        <div className="relative w-full max-w-6xl flex justify-center items-center">
          <img 
            src="https://res.cloudinary.com/dzhwsjuxy/image/upload/v1765798506/career_keanu_tg9lnd.png"
            alt="Career journey"
            style={{
              maxWidth: '100%',
              height: 'auto',
              maxHeight: '600px',
              objectFit: 'contain',
              borderRadius: '4px'
            }}
          />
          <h1 
            className="absolute text-5xl md:text-6xl font-light text-neutral-100 text-center hover-laser" 
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 20,
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
              width: '80%'
            }}
          >
            Career <span style={{ color: '#fbbf24' }}><GlitchText text={pathGlitch} /></span>
          </h1>
        </div>
      </section>

      {/* Experience Cards Section */}
      <section className="relative flex items-center justify-center px-3 md:px-6 lg:px-12 py-16" style={{ zIndex: 10, marginTop: '24px' }}>
        <div className="max-w-6xl w-full">
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
        </div>
      </section>

      {/* Why Hire Andrii Section */}
      <section className="relative min-h-screen flex items-center justify-center px-3 md:px-6 lg:px-12 py-16" style={{ zIndex: 10 }}>
        <div className="max-w-6xl w-full" style={{ paddingTop: '24px' }}>
          <h2 className="text-5xl md:text-6xl font-light text-neutral-100 text-center hover-laser" style={{ marginBottom: '2rem' }}>
            <div><span style={{ color: '#fbbf24' }}><GlitchText text={hireWordGlitch} /> Andrii</span> - get</div>
            <div style={{ marginTop: '0.5rem' }}><span style={{ color: '#fbbf24' }}><GlitchText text={shouldWordGlitch} /> pills</span> for the price of one.</div>
          </h2>
          <div style={{ maxWidth: '800px', margin: '0 auto 3rem auto', paddingLeft: '10px', paddingRight: '10px', textAlign: 'center' }}>
            <p className="text-neutral-100 font-light text-3xl md:text-4xl" style={{ marginBottom: '1rem' }}>
              <span style={{ color: '#fbbf24' }}><GlitchText text={hireGlitch} /></span> between soft / technical / communication skills.
            </p>
            <p className="text-neutral-100 font-light text-3xl md:text-4xl">
              He walked the path from a slide-maker to a product builder and can do the work hands-on.
            </p>
          </div>
          
          <div className="flex justify-center" style={{ marginTop: '3rem' }}>
            <img 
              src="https://res.cloudinary.com/dzhwsjuxy/image/upload/v1765788092/Activities_and_skills_1536_x_620_px_ssibj5.png"
              alt="Skills and activities"
              style={{
                maxWidth: '100%',
                height: 'auto',
                maxHeight: '500px',
                objectFit: 'contain'
              }}
            />
          </div>

          <div style={{ height: '1px' }} />

          <div className="flex gap-4 md:gap-8 justify-center" style={{ marginTop: '3rem' }}>
            <Link
              href="/contact"
              className="glow-button w-40 md:w-48 h-16 flex items-center justify-center bg-neutral-900 border border-neutral-700 hover:border-cyan-400/50 rounded-sm text-neutral-100 font-light tracking-wider uppercase text-sm transition-all"
            >
              Get in Touch
            </Link>
            <Link
              href="/chatbot"
              className="glow-button w-40 md:w-48 h-16 flex items-center justify-center bg-neutral-900 border border-neutral-700 hover:border-cyan-400/50 rounded-sm text-neutral-100 font-light tracking-wider uppercase text-sm transition-all"
            >
              Talk to Assistant
            </Link>
          </div>
        </div>
      </section>

      {/* Activities and Skills Section */}
      <section className="relative min-h-screen flex items-center justify-center px-3 md:px-6 lg:px-12 py-12" style={{ zIndex: 10, marginTop: '1rem' }}>
        <div className="max-w-6xl w-full" style={{ paddingTop: '24px' }}>
          <h2 className="text-5xl md:text-6xl font-light text-neutral-100 text-center hover-laser" style={{ marginBottom: '1.5rem' }}>
            Activities and skills
          </h2>
          <div style={{ marginBottom: '2rem' }}>
            <p className="text-neutral-100 font-light text-3xl md:text-4xl text-center" style={{ marginBottom: '0.5rem' }}>
              Core <span style={{ color: '#fbbf24' }}><GlitchText text={descriptionGlitch} /></span> capabilities and proficiencies
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

          <div style={{ marginTop: '4rem', paddingTop: '3rem', borderTop: '1px solid rgba(212, 175, 55, 0.2)' }}>
            <div style={{ marginBottom: '2rem' }}>
              <h3 className="text-3xl md:text-4xl font-light text-neutral-100 text-center hover-laser">
                <div>Development & automation - focus on real world results</div>
                <div style={{ marginTop: '0.5rem' }}><span style={{ color: '#fbbf24' }}>without disturbing</span> your <span style={{ color: '#fbbf24' }}>development team</span></div>
              </h3>
            </div>

            {/* AI Automation */}
            <div style={{ marginBottom: '3rem' }}>
              <h4 style={{ margin: '0 0 1.5rem 0', fontSize: '1.125rem', fontWeight: 400, color: 'rgb(209, 213, 219)', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.8 }}>
                AI Automation
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ paddingLeft: '10px', paddingRight: '10px' }}>
                {devActivities.slice(0, 3).map((activity, idx) => (
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

            {/* System Logic & Prototyping */}
            <div style={{ marginBottom: '3rem' }}>
              <h4 style={{ margin: '0 0 1.5rem 0', fontSize: '1.125rem', fontWeight: 400, color: 'rgb(209, 213, 219)', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.8 }}>
                System Logic & Prototyping
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ paddingLeft: '10px', paddingRight: '10px' }}>
                {devActivities.slice(3, 6).map((activity, idx) => (
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

            {/* Integration & Operational Tools */}
            <div>
              <h4 style={{ margin: '0 0 1.5rem 0', fontSize: '1.125rem', fontWeight: 400, color: 'rgb(209, 213, 219)', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.8 }}>
                Integration & Operational Tools
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ paddingLeft: '10px', paddingRight: '10px' }}>
                {devActivities.slice(6, 9).map((activity, idx) => (
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
      <footer className="relative border-t border-neutral-800/50 py-8 px-3 md:px-6 lg:px-12 flex items-center justify-center" style={{ zIndex: 10 }}>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/20 to-transparent" />
        
        <div className="max-w-6xl w-full mx-auto text-center space-y-6">
          <p className="text-neutral-500 font-light text-sm">
            © 2025 {profile.name}. All rights reserved.
          </p>
          
          <Link 
            href="/" 
            className="neon-back-link inline-flex items-center gap-2 text-2xl hover:text-neutral-50 transition-colors text-center justify-center"
            style={{ paddingTop: '20px', paddingBottom: '20px' }}
          >
            <span>←</span>
            <span>Back</span>
          </Link>
        </div>
      </footer>

      <canvas id="experienceMatrixCanvas" />
      <div id="experienceGlitchOverlay" className="experience-glitch-overlay" />
    </div>
  )
}
