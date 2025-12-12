'use client'

import Link from 'next/link'
import { myproductExperience } from '@/data/experiences/myproduct'
import { freelanceExperience } from '@/data/experiences/freelance'
import { b2cboostExperience } from '@/data/experiences/b2cboosta'
import { b2bsaasTakeoffExperience } from '@/data/experiences/b2bsaastakeoff'
import { erpsystemExperience } from '@/data/experiences/erpsystem'
import { businessconsultingExperience } from '@/data/experiences/businessconsulting'
import { useState, useEffect } from 'react'
import { FiChevronDown } from 'react-icons/fi'

const experiences: { [key: string]: any } = {
  myproduct: myproductExperience,
  freelance: freelanceExperience,
  b2cboosta: b2cboostExperience,
  b2bsaastakeoff: b2bsaasTakeoffExperience,
  erpsystem: erpsystemExperience,
  businessconsulting: businessconsultingExperience,
}

export default function ExperiencePage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState<string>('')
  const [displayTexts, setDisplayTexts] = useState<string[]>([
    'Startup Founder',
    "I've been solely building my own product",
    'My goal is to get 5% of the market until the end of 2026',
    'priroda.tech'
  ])
  const [freelanceDisplayTexts, setFreelanceDisplayTexts] = useState<{ [key: string]: string }>({
    title: 'Freelance Product Builder',
    'project-0': 'Sports League Management',
    'project-1': 'Tax Advisory CRM',
    'project-2': 'Commissions Module',
    'project-3': 'Casino Metrics',
    'project-4': 'Deposit Flow Redesign',
  })

  const projectPrefixes: { [key: string]: string } = {
    'project-0': 'ScrumLaunch: ',
    'project-1': 'Blackthorn Vision: ',
    'project-2': 'Tribute Technologies: E-commerce ',
    'project-3': '',
    'project-4': 'Kingmaker: ',
  }
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set())

  useEffect(() => {
    params.then(({ slug }) => setSlug(slug))
  }, [params])

  useEffect(() => {
    if (slug !== 'myproduct') return

    const originalTexts = [
      'Startup Founder',
      "I've been solely building my own product",
      'My goal is to get 5% of the market until the end of 2026',
      'priroda.tech'
    ]

    const sequence = [0, 1, 2, 3]
    let currentIndex = 0
    let initialDelay = true

    const scheduleGlitch = () => {
      const delay = initialDelay ? 5000 : 3000
      initialDelay = false

      const timeout = setTimeout(() => {
        const elementIndex = sequence[currentIndex]
        const originalText = originalTexts[elementIndex]
        let phase = 0

        const interval = setInterval(() => {
          if (phase < 10) {
            setDisplayTexts(prev => {
              const newTexts = [...prev]
              newTexts[elementIndex] = originalText
                .split('')
                .map(() => Math.random() > 0.5 ? '1' : '0')
                .join('')
              return newTexts
            })
          } else if (phase < 20) {
            const progress = (phase - 10) / 10
            setDisplayTexts(prev => {
              const newTexts = [...prev]
              newTexts[elementIndex] = originalText
                .split('')
                .map((char, idx) => {
                  if (idx / originalText.length < progress) {
                    return char
                  }
                  return Math.random() > 0.5 ? '1' : '0'
                })
                .join('')
              return newTexts
            })
          } else {
            setDisplayTexts(prev => {
              const newTexts = [...prev]
              newTexts[elementIndex] = originalText
              return newTexts
            })
            clearInterval(interval)
            currentIndex = (currentIndex + 1) % sequence.length
            scheduleGlitch()
          }
          phase++
        }, 50)
      }, delay)

      return () => clearTimeout(timeout)
    }

    scheduleGlitch()
  }, [slug])

  useEffect(() => {
    if (slug !== 'freelance') return

    const originalTexts: { [key: string]: string } = {
      title: 'Freelance Product Builder',
      'project-0': 'Sports League Management',
      'project-1': 'Tax Advisory CRM',
      'project-2': 'Commissions Module',
      'project-3': 'Casino Metrics',
      'project-4': 'Deposit Flow Redesign',
    }

    const sequence = ['title', 'project-0', 'project-1', 'project-2', 'project-3', 'project-4']
    let currentIndex = 0
    let initialDelay = true

    const scheduleGlitch = () => {
      const delay = initialDelay ? 5000 : Math.random() * 2000 + 4000
      initialDelay = false

      const timeout = setTimeout(() => {
        const elementKey = sequence[currentIndex]
        const originalText = originalTexts[elementKey]
        let phase = 0

        const interval = setInterval(() => {
          if (phase < 10) {
            setFreelanceDisplayTexts(prev => ({
              ...prev,
              [elementKey]: originalText
                .split('')
                .map(() => Math.random() > 0.5 ? '1' : '0')
                .join('')
            }))
          } else if (phase < 20) {
            const progress = (phase - 10) / 10
            setFreelanceDisplayTexts(prev => ({
              ...prev,
              [elementKey]: originalText
                .split('')
                .map((char, idx) => {
                  if (idx / originalText.length < progress) {
                    return char
                  }
                  return Math.random() > 0.5 ? '1' : '0'
                })
                .join('')
            }))
          } else {
            setFreelanceDisplayTexts(prev => ({
              ...prev,
              [elementKey]: originalText
            }))
            clearInterval(interval)
            currentIndex = (currentIndex + 1) % sequence.length
            scheduleGlitch()
          }
          phase++
        }, 50)
      }, delay)

      return () => clearTimeout(timeout)
    }

    scheduleGlitch()
  }, [slug])

  const experience = experiences[slug]

  if (!slug) {
    return null
  }

  if (!experience) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-light text-neutral-100 mb-4">Experience not found</h1>
          <Link href="/" className="text-cyan-400 hover:text-cyan-300 transition-colors">
            ← Back to portfolio
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100" style={{ paddingLeft: '10px', paddingRight: '10px' }}>
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
      `}</style>

      <section className="relative min-h-screen flex items-center justify-center px-3 md:px-6 lg:px-12 py-20">
        <Link href="/experience" className="neon-back-link absolute top-20 left-1/2 transform -translate-x-1/2 inline-flex items-center gap-2 text-2xl hover:text-neutral-50 transition-colors text-center justify-center z-50">
          <span>←</span>
          <span>Back</span>
        </Link>

        <div className="max-w-4xl w-full">

          <div>
            <div className="mb-8 pt-8 pb-8">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-wide mb-4 hover-laser text-neutral-100 overflow-hidden" style={{ paddingTop: '150px', height: '140px', lineHeight: '1.2' }}>
                {slug === 'myproduct' ? displayTexts[0] : slug === 'freelance' ? freelanceDisplayTexts.title : experience.title}
              </h1>
              {slug === 'myproduct' ? (
                <a 
                  href="https://priroda.tech" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-2xl md:text-3xl font-light text-neutral-300 mb-2 hover:text-neutral-100 transition-colors block"
                >
                  {displayTexts[3]}
                </a>
              ) : (
                <p className="text-2xl md:text-3xl font-light text-neutral-300 mb-2">
                  {experience.company}
                </p>
              )}
              <div className="inline-block px-3 py-1 bg-neutral-900/50 border border-neutral-800/50 rounded-sm mb-6">
                <span className="text-sm text-neutral-400">{experience.duration}</span>
              </div>
              <p className="text-lg text-neutral-400 font-light">
                {experience.overview}
              </p>
            </div>

            <div className="my-12">
              <img
                src={`/experienceicons/${slug === 'myproduct' ? 'priroda' : experience.slug}.png`}
                alt={`${experience.title} Logo`}
                style={{ maxWidth: '60px', height: 'auto', opacity: 0.8 }}
              />
            </div>

            {experience.videoDemo && (
              <div className="my-16">
                <h2 className="text-2xl font-light text-neutral-200 mb-6">Project Demo</h2>
                <div className="aspect-video rounded-sm overflow-hidden bg-neutral-900/30 border border-neutral-800/50">
                  <iframe
                    src={`https://www.youtube.com/embed/${experience.videoDemo.youtubeId}`}
                    title={experience.videoDemo.title}
                    className="w-full h-full"
                    frameBorder="0"
                    allowFullScreen
                  />
                </div>
                <p className="text-neutral-400 font-light mt-4">{experience.videoDemo.description}</p>
              </div>
            )}

            {!experience.detailedContent && (
              <>
                <div className="my-16">
                  <h2 className="text-2xl font-light text-neutral-200 mb-6">Overview</h2>
                  <div className="prose prose-invert max-w-none">
                    <div className="space-y-4 text-neutral-300 font-light leading-relaxed">
                      {experience.description && experience.description.map((desc: string, idx: number) => (
                        <p key={idx} className="text-lg">• {desc}</p>
                      ))}
                    </div>
                  </div>
                </div>

                {experience.achievements && (
                  <div className="my-16">
                    <h2 className="text-2xl font-light text-neutral-200 mb-6">Key Achievements</h2>
                    <div className="space-y-3">
                      {experience.achievements.map((achievement: string, idx: number) => (
                        <div key={idx} className="flex gap-4">
                          <span className="text-cyan-400 font-light text-lg">✓</span>
                          <span className="text-neutral-300 font-light text-lg">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {experience.projects && slug === 'freelance' && (
              <div style={{ paddingTop: '32px', paddingBottom: '20px' }}>
                <h2 className="text-2xl font-light text-neutral-200 mb-6">Projects Delivered</h2>
                <div style={{ paddingTop: '24px' }}>
                  {experience.projects.map((project: any, idx: number) => {
                    const isExpanded = expandedProjects.has(`project-${idx}`)
                    return (
                      <div key={idx} className="border border-neutral-800/50 bg-neutral-900/20 rounded-sm overflow-hidden" style={{ marginBottom: '24px', paddingTop: '16px', paddingBottom: '16px' }}>
                        <div className="px-6" style={{ paddingTop: '12px', paddingBottom: '12px' }}>
                          <div className="flex justify-between items-start gap-4 mb-3">
                            <div className="flex-1">
                              <h3 className="text-xl font-light text-neutral-100 mb-2" style={{ minHeight: '56px' }}>
                                {slug === 'freelance' 
                                  ? (projectPrefixes[`project-${idx}`] || '') + freelanceDisplayTexts[`project-${idx}`]
                                  : project.name}
                              </h3>
                              <p className="text-sm text-neutral-400 mb-3">{project.duration}</p>
                            </div>
                          </div>
                          
                          <p className="text-neutral-300 font-light leading-relaxed" style={{ marginBottom: '16px' }}>{project.overview}</p>
                          
                          {project.tags && project.tags.length > 0 && (
                            <div style={{ marginBottom: '16px' }} className="flex flex-wrap gap-2">
                              {project.tags.map((tag: string, tagIdx: number) => (
                                <span
                                  key={tagIdx}
                                  className="inline-block px-3 py-1 bg-neutral-800/50 border border-neutral-700/50 rounded-full text-xs font-light text-neutral-300"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                          
                          <button
                            onClick={() => {
                              setExpandedProjects(prev => {
                                const next = new Set(prev)
                                if (next.has(`project-${idx}`)) {
                                  next.delete(`project-${idx}`)
                                } else {
                                  next.add(`project-${idx}`)
                                }
                                return next
                              })
                            }}
                            className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-light flex items-center gap-2"
                            style={{ marginTop: '12px' }}
                          >
                            {isExpanded ? '▼' : '▶'} More Info
                          </button>
                        </div>
                        
                        {isExpanded && (
                          <div className="border-t border-neutral-800/50 bg-neutral-900/10" style={{ padding: '24px 24px' }}>
                            {project.details && (
                              <p className="text-neutral-300 font-light mb-4">{project.details}</p>
                            )}
                            {project.url && (
                              <a 
                                href={project.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-light"
                              >
                                Visit Project →
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {experience.projects && slug !== 'freelance' && (
              <div className="my-16">
                <h2 className="text-2xl font-light text-neutral-200 mb-6">Projects</h2>
                <div className="space-y-6">
                  {experience.projects.map((project: any, idx: number) => (
                    <div key={idx} className="border border-neutral-800/50 bg-neutral-900/20 rounded-sm p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-light text-neutral-100">{project.name}</h3>
                        {project.url && (
                          <a 
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-light"
                          >
                            Visit →
                          </a>
                        )}
                      </div>
                      <p className="text-sm text-neutral-400 mb-3 font-light">{project.duration}</p>
                      <p className="text-neutral-300 font-light">{project.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {experience.platforms && (
              <div className="my-16">
                <h2 className="text-2xl font-light text-neutral-200 mb-6">Platforms</h2>
                <div className="space-y-4">
                  {experience.platforms.map((platform: any, idx: number) => (
                    <a 
                      key={idx}
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block border border-neutral-800/50 bg-neutral-900/20 rounded-sm p-6 hover:border-neutral-700/50 transition-colors"
                    >
                      <h3 className="text-lg font-light text-cyan-400 hover:text-cyan-300 mb-2">{platform.name}</h3>
                      <p className="text-neutral-300 font-light">{platform.description}</p>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {experience.resources && !experience.detailedContent && (
              <div className="my-16 pt-8 pb-8">
                <h2 className="text-2xl font-light text-neutral-200 mb-6">Resources</h2>
                <div className="space-y-3">
                  {experience.resources.map((resource: any, idx: number) => (
                    <a 
                      key={idx}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-cyan-400 hover:text-cyan-300 transition-colors font-light hover-laser"
                    >
                      {resource.title} →
                    </a>
                  ))}
                </div>
              </div>
            )}

            {experience.detailedContent && slug === 'freelance' && (
              <div className="prose prose-invert max-w-none mb-12">
                <div className="space-y-8 text-neutral-300 font-light leading-relaxed">
                  {experience.detailedContent.split('\n\n').map((section: string, idx: number) => {
                    if (section.trim().startsWith('## Overview')) {
                      const content = section.replace('## Overview', '').trim()
                      return (
                        <div key={idx} style={{ paddingTop: '32px', paddingBottom: '20px' }}>
                          <h3 className="text-3xl font-light text-neutral-100 mb-4">Overview</h3>
                          <p className="text-base leading-relaxed text-neutral-300 mb-4">{content.split('\n')[0]}</p>
                        </div>
                      )
                    }
                    if (section.trim().startsWith('## Methodology')) {
                      return (
                        <div key={idx} style={{ paddingTop: '32px', paddingBottom: '20px' }}>
                          <h3 className="text-3xl font-light text-neutral-100 mb-4">Methodology</h3>
                          <div className="space-y-3">
                            {section.split('\n').filter((line: string) => line.trim().startsWith('-')).map((line: string, lineIdx: number) => (
                              <div key={lineIdx} className="flex gap-3">
                                <span className="text-neutral-400 flex-shrink-0 text-lg">○</span>
                                <p className="text-base leading-relaxed text-neutral-300">
                                  {line.replace('- ', '')}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    }
                    if (section.trim().startsWith('## Key Learnings')) {
                      return (
                        <div key={idx} style={{ paddingTop: '32px', paddingBottom: '20px' }}>
                          <h3 className="text-3xl font-light text-neutral-100 mb-4">Key Learnings</h3>
                          <div className="space-y-3">
                            {section.split('\n').filter((line: string) => line.trim().startsWith('-')).map((line: string, lineIdx: number) => (
                              <div key={lineIdx} className="flex gap-3">
                                <span className="text-neutral-400 flex-shrink-0 text-lg">○</span>
                                <p className="text-base leading-relaxed text-neutral-300">
                                  {line.replace('- ', '')}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    }
                    return null
                  })}
                </div>
              </div>
            )}

            {experience.detailedContent && slug !== 'freelance' && (
              <div className="prose prose-invert max-w-none">
                <div className="space-y-8 text-neutral-300 font-light leading-relaxed">
                  {experience.detailedContent.split('\n\n').map((section: string, idx: number) => {
                    if (section.trim().startsWith('###')) {
                      const heading = section.replace('### ', '').trim()
                      const isExpanded = expandedProjects.has(`project-${idx}`)
                      
                      if (slug === 'freelance') {
                        return (
                          <div key={idx}>
                            <button
                              onClick={() => {
                                setExpandedProjects(prev => {
                                  const next = new Set(prev)
                                  if (next.has(`project-${idx}`)) {
                                    next.delete(`project-${idx}`)
                                  } else {
                                    next.add(`project-${idx}`)
                                  }
                                  return next
                                })
                              }}
                              className="w-full flex items-center justify-between px-6 py-4 border border-neutral-800/50 bg-neutral-900/20 rounded-sm hover:border-neutral-700/50 transition-colors text-left"
                              style={{ paddingTop: '24px', paddingBottom: '16px' }}
                            >
                              <h4 className="text-xl font-light text-neutral-100">
                                {heading}
                              </h4>
                              <FiChevronDown 
                                size={20} 
                                className={`flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                              />
                            </button>
                            {isExpanded && (
                              <div className="mt-4 px-6 py-4 border border-neutral-800/30 border-t-0 bg-neutral-900/10 rounded-b-sm">
                                <p className="text-base leading-relaxed text-neutral-300">
                                  {section.split('\n').slice(1).join('\n').trim()}
                                </p>
                              </div>
                            )}
                          </div>
                        )
                      }
                      
                      return (
                        <div key={idx} style={{ paddingTop: '24px', paddingBottom: '16px' }}>
                          <h4 className="text-xl font-light text-neutral-100 mb-3">
                            {heading}
                          </h4>
                        </div>
                      )
                    }
                    if (section.trim().startsWith('##')) {
                      const heading = section.replace('## ', '').trim()
                      return (
                        <div key={idx} style={{ paddingTop: '32px', paddingBottom: '20px' }}>
                          <h3 className="text-3xl font-light text-neutral-100 mb-4">
                            {heading}
                          </h3>
                        </div>
                      )
                    }
                    if (section.trim().startsWith('-')) {
                      return (
                        <div key={idx} className="space-y-3" style={{ paddingTop: '16px', paddingBottom: '16px' }}>
                          {section.split('\n').filter((line: string) => line.trim()).map((line: string, lineIdx: number) => (
                            <div key={lineIdx} className="flex gap-3">
                              <span className="text-neutral-400 flex-shrink-0 text-lg">○</span>
                              <p className="text-base leading-relaxed text-neutral-300">
                                {line.replace('- ', '')}
                              </p>
                            </div>
                          ))}
                        </div>
                      )
                    }
                    return (
                      <p key={idx} className="text-base leading-relaxed text-neutral-300" style={{ paddingTop: '16px', paddingBottom: '16px' }}>
                        {(() => {
                          let processedSection = section
                          const glitchPhrases = [
                            { original: "I've been solely building my own product", index: 1 },
                            { original: 'My goal is to get 5% of the market until the end of 2026', index: 2 }
                          ]
                          
                          return processedSection.split(/(\[[^\]]+\]\([^\)]+\))/g).map((part: string, i: number) => {
                            const linkMatch = part.match(/\[([^\]]+)\]\(([^\)]+)\)/)
                            if (linkMatch) {
                              return (
                                <a
                                  key={i}
                                  href={linkMatch[2]}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-cyan-400 hover:text-cyan-300 transition-colors hover-laser"
                                >
                                  {linkMatch[1]}
                                </a>
                              )
                            }
                            
                            let result = part
                            for (const phrase of glitchPhrases) {
                              if (part.includes(phrase.original)) {
                                result = part.replace(phrase.original, displayTexts[phrase.index])
                              }
                            }
                            return result
                          })
                        })()}
                      </p>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="mt-24 flex justify-center">
            <Link 
              href="/experience" 
              className="neon-back-link inline-flex items-center gap-2 text-2xl hover:text-neutral-50 transition-colors text-center justify-center"
              style={{ paddingTop: '40px', paddingBottom: '40px' }}
            >
              <span>←</span>
              <span>Back</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
