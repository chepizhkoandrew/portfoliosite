'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { profile } from '@/data/content'
import { experiences } from '@/data/experience'
import { pmActivities } from '@/data/pmActivities'
import { MobileMenu } from '@/components/MobileMenu'
import { PDFGenerationModal } from '@/components/PDFGenerationModal'

const devActivities = [
  {
    id: 'ai-chatbots',
    title: 'AI Chatbots',
    proficiency: 78,
  },
  {
    id: 'web-parsing-data-collection',
    title: 'Web Parsing & Data Collection',
    proficiency: 79,
  },
  {
    id: 'generative-ai-pipelines',
    title: 'Gen-AI Pipelines',
    proficiency: 81,
  },
  {
    id: 'data-modeling',
    title: 'Data Modeling',
    proficiency: 85,
  },
  {
    id: 'reverse-engineering',
    title: 'Reverse Engineering',
    proficiency: 88,
  },
  {
    id: 'low-code-prototyping',
    title: 'Low-Code Prototyping',
    proficiency: 86,
  },
  {
    id: 'api-integrations',
    title: 'API Integrations',
    proficiency: 80,
  },
  {
    id: 'digital-knowledge-bases',
    title: 'Digital Knowledge Bases',
    proficiency: 82,
  },
  {
    id: 'internal-tools',
    title: 'Internal Tools',
    proficiency: 77,
  },
]

const DEFAULT_VISIBLE_H2 = 'I can build and launch IT products, from idea to a working solution.'

export default function CVPage() {
  const cvRef = useRef<HTMLDivElement>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [visibleH2, setVisibleH2] = useState(DEFAULT_VISIBLE_H2)
  const [invisibleH2, setInvisibleH2] = useState('')

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleGeneratePDF = async (newVisibleH2: string, newInvisibleH2: string) => {
    setVisibleH2(newVisibleH2)
    setInvisibleH2(newInvisibleH2)
    
    setTimeout(async () => {
      if (!cvRef.current) return
      
      try {
        const html2pdf = (await import('html2pdf.js')).default
        const element = cvRef.current
        
        const opt = {
          margin: 0,
          filename: 'Andrii_Chepizhko_CV.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 1, useCORS: true, logging: false, allowTaint: true },
          jsPDF: { format: 'a4', orientation: 'portrait', compress: true },
          pagebreak: { mode: 'avoid-all' },
        }
        await html2pdf().set(opt).from(element).save()
      } catch (error) {
        console.error('Failed to download PDF:', error)
        alert('Failed to generate PDF. Please try again.')
      }
    }, 100)
  }

  const renderExperienceRow = (exp: typeof experiences[0]) => (
    <a 
      key={exp.id} 
      href={`/experience/${exp.id}`}
      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10mm', alignItems: 'start' }}>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
          {exp.logo && (
            <div
              style={{
                width: '32px',
                height: '32px',
                flexShrink: 0,
                backgroundImage: `url(${exp.logo})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
              }}
            />
          )}
          <div>
            <h4 style={{ margin: 0, fontSize: '11px', fontWeight: 600 }}>
              {exp.title}
            </h4>
            {exp.id !== 'freelance' && (
              <p style={{ margin: '1px 0 0 0', fontSize: '9px', color: '#888' }}>
                {exp.company}
              </p>
            )}
          </div>
        </div>
        <div style={{ fontSize: '9px', color: '#666', lineHeight: 1.4 }}>
          {exp.id === 'freelance' ? (
            <div>
              {exp.description[0]}<br />
              <strong style={{ color: '#555' }}>Projects:</strong> Tax Advisory CRM prototype, E-commerce Commissions Module, Sports League Management App logic and design, Online Casino Metrics Framework, Online Casino Deposit Flow Redesign, Gen-AI Content Pipeline for Instagram
            </div>
          ) : (
            <div>
              {exp.description[0]}<br />
              <span style={{ color: '#555' }}>{exp.description[1]}</span>
            </div>
          )}
        </div>
        <div style={{ textAlign: 'right', whiteSpace: 'nowrap', flexShrink: 0, fontSize: '9px', color: '#888' }}>
          {exp.duration}
        </div>
      </div>
    </a>
  )

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-8 px-4">
      <MobileMenu onDownloadCV={handleOpenModal} />
      
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex gap-4 justify-center items-center flex-wrap">
          <button
            onClick={handleOpenModal}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-light transition-colors"
          >
            Download as PDF
          </button>
          <Link
            href="/experience"
            className="px-6 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 rounded font-light transition-colors"
          >
            Back to Experience
          </Link>
        </div>
      </div>

      <div
        ref={cvRef}
        className="max-w-4xl mx-auto bg-white text-black"
        style={{
          width: '210mm',
          minHeight: '297mm',
          padding: '6mm 8mm',
          margin: '0 auto',
          fontSize: '12px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Intro Section */}
        <div style={{ marginBottom: '12mm' }}>
          <h1 style={{ margin: '0 0 4px 0', fontSize: '26px', fontWeight: 300 }}>
            {profile.name}
          </h1>
          <h2 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 400, color: '#666' }}>
            {profile.title}
          </h2>
          <h2 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 400, color: '#888', lineHeight: 1.4 }}>
            {visibleH2}
          </h2>
          <h2 style={{ margin: '0 0 8px 0', fontSize: '1px', fontWeight: 400, color: '#fff', lineHeight: 1, letterSpacing: '0px' }}>
            {invisibleH2}
          </h2>
        </div>

        {/* Contact Section */}
        <div style={{ marginBottom: '12mm', paddingBottom: '8mm', borderBottom: '1px solid #ddd' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10mm', fontSize: '11px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3mm' }}>
              <div>
                <span style={{ color: '#666' }}>Email:</span> {profile.email}
              </div>
              <div>
                <span style={{ color: '#666' }}>Website:</span>{' '}
                <a href={profile.website} style={{ color: '#0066cc', textDecoration: 'none' }}>
                  Portfolio
                </a>
              </div>
              <div>
                <span style={{ color: '#666' }}>LinkedIn:</span>{' '}
                <a href={profile.social.linkedin} style={{ color: '#0066cc', textDecoration: 'none' }}>
                  Profile
                </a>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3mm' }}>
              <div>
                <span style={{ color: '#666' }}>Phone:</span> {profile.phone}
              </div>
              <div>
                <span style={{ color: '#666' }}>Location:</span> Vigo, Galicia
              </div>
              <div>
                <span style={{ color: '#666' }}>AI Assistant:</span>{' '}
                <a href={profile.personalAssistant} style={{ color: '#0066cc', textDecoration: 'none' }}>
                  Chat
                </a>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3mm' }}>
              <div>
                <span style={{ color: '#666' }}>Full time rate:</span> €3,000
              </div>
              <div>
                <span style={{ color: '#666' }}>Hourly rate:</span> €20/hour
              </div>
              <div>
                <span style={{ color: '#666' }}>Availability:</span> now
              </div>
            </div>
          </div>
        </div>

        {/* Experience Section */}
        <div style={{ marginBottom: '12mm' }}>
          <div style={{ marginBottom: '6mm' }}>
            <h3 style={{ margin: '0 0 2px 0', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Professional Experience
            </h3>
            <p style={{ margin: 0, fontSize: '9px', color: '#999' }}>
              [click for details]
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6mm' }}>
            <div style={{ height: 0, overflow: 'hidden' }} />
            {renderExperienceRow(experiences[0])}
            {experiences.slice(1, 6).map((exp) => renderExperienceRow(exp))}
          </div>
        </div>

        {/* Skills Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10mm', marginBottom: '8mm' }}>
          {/* Product Management Skills */}
          <div>
            <h3 style={{ margin: '0 0 6mm 0', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Product Management
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2mm' }}>
              {pmActivities.map((activity) => (
                <div key={activity.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                    <p style={{ margin: 0, fontSize: '11px', fontWeight: 500 }}>
                      {activity.title}
                    </p>
                    <span style={{ fontSize: '10px', color: '#888' }}>
                      {activity.proficiency}%
                    </span>
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: '4px',
                      backgroundColor: '#e5e7eb',
                      borderRadius: '2px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${activity.proficiency}%`,
                        height: '100%',
                        backgroundColor: '#fbbf24',
                        borderRadius: '2px',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Development & Automation Skills */}
          <div>
            <h3 style={{ margin: '0 0 6mm 0', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Development & Automation
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2mm' }}>
              {devActivities.map((activity) => (
                <div key={activity.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                    <p style={{ margin: 0, fontSize: '11px', fontWeight: 500 }}>
                      {activity.title}
                    </p>
                    <span style={{ fontSize: '10px', color: '#888' }}>
                      {activity.proficiency}%
                    </span>
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: '4px',
                      backgroundColor: '#e5e7eb',
                      borderRadius: '2px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${activity.proficiency}%`,
                        height: '100%',
                        backgroundColor: '#fbbf24',
                        borderRadius: '2px',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-8 text-center text-neutral-500 text-sm">
        <p>A4 Portrait Format - Optimized for Printing</p>
      </div>

      <PDFGenerationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onGenerate={handleGeneratePDF}
        defaultVisibleH2={DEFAULT_VISIBLE_H2}
      />
    </div>
  )
}
