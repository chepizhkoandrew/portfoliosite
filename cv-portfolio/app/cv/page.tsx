'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { profile, contactInfo } from '@/data/content'
import { experiences } from '@/data/experience'
import { pmActivities } from '@/data/pmActivities'
import AnimatedProgressBar from '@/components/AnimatedProgressBar'
import { MobileMenu } from '@/components/MobileMenu'

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

export default function CVPage() {
  const cvRef = useRef<HTMLDivElement>(null)

  const handleDownloadPDF = async () => {
    if (!cvRef.current) return
    
    try {
      const html2pdf = (await import('html2pdf.js')).default
      const element = cvRef.current
      const opt = {
        margin: 10,
        filename: 'Andrii_Chepizhko_CV.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { format: 'a4', orientation: 'portrait' },
      }
      html2pdf().set(opt).from(element).save()
    } catch (error) {
      console.error('Failed to download PDF:', error)
      alert('Failed to generate PDF. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-8 px-4">
      <MobileMenu />
      
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex gap-4 justify-center items-center flex-wrap">
          <button
            onClick={handleDownloadPDF}
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
          padding: '20mm',
          margin: '0 auto',
          fontSize: '11px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Intro Section */}
        <div style={{ marginBottom: '12mm' }}>
          <h1 style={{ margin: '0 0 4px 0', fontSize: '24px', fontWeight: 300 }}>
            {profile.name}
          </h1>
          <h2 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 400, color: '#666' }}>
            {profile.title}
          </h2>
          <p style={{ margin: '0 0 8px 0', fontSize: '10px', color: '#888', lineHeight: 1.4 }}>
            {profile.bio.secondLine}
          </p>
        </div>

        {/* Contact Section */}
        <div style={{ marginBottom: '12mm', paddingBottom: '8mm', borderBottom: '1px solid #ddd' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '10px' }}>
            <div>
              <span style={{ color: '#666' }}>Email:</span> {profile.email}
            </div>
            <div>
              <span style={{ color: '#666' }}>Phone:</span> {profile.phone}
            </div>
            <div>
              <span style={{ color: '#666' }}>LinkedIn:</span>{' '}
              <a href={profile.social.linkedin} style={{ color: '#0066cc', textDecoration: 'none' }}>
                Profile
              </a>
            </div>
            <div>
              <span style={{ color: '#666' }}>Location:</span> Vigo, Galicia
            </div>
          </div>
        </div>

        {/* Experience Section */}
        <div style={{ marginBottom: '12mm' }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Professional Experience
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6mm' }}>
            {experiences.slice(0, 5).map((exp) => (
              <div key={exp.id} style={{ display: 'flex', gap: '8px' }}>
                {exp.logo && (
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      flexShrink: 0,
                      backgroundImage: `url(${exp.logo})`,
                      backgroundSize: 'contain',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center',
                    }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                    <h4 style={{ margin: 0, fontSize: '11px', fontWeight: 600 }}>
                      {exp.title}
                    </h4>
                    <span style={{ fontSize: '10px', color: '#888' }}>
                      {exp.duration}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 2px 0', fontSize: '10px', color: '#666' }}>
                    {exp.company}
                  </p>
                  <ul style={{ margin: '2px 0 0 0', paddingLeft: '16px', fontSize: '9px', lineHeight: 1.3, color: '#555' }}>
                    {exp.description.slice(0, 2).map((desc, idx) => (
                      <li key={idx} style={{ margin: '2px 0' }}>
                        {desc}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10mm', marginBottom: '8mm' }}>
          {/* Product Management Skills */}
          <div>
            <h3 style={{ margin: '0 0 6mm 0', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Product Management
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4mm' }}>
              {pmActivities.map((activity) => (
                <div key={activity.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                    <p style={{ margin: 0, fontSize: '10px', fontWeight: 500 }}>
                      {activity.title}
                    </p>
                    <span style={{ fontSize: '9px', color: '#888' }}>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4mm' }}>
              {devActivities.map((activity) => (
                <div key={activity.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                    <p style={{ margin: 0, fontSize: '10px', fontWeight: 500 }}>
                      {activity.title}
                    </p>
                    <span style={{ fontSize: '9px', color: '#888' }}>
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
    </div>
  )
}
