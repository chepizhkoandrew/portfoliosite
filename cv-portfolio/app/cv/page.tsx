'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { profile } from '@/data/content'
import { experiences } from '@/data/experience'
import { MobileMenu } from '@/components/MobileMenu'
import { PDFGenerationModal } from '@/components/PDFGenerationModal'

const relevantExperience = [
  {
    tag: 'ERP & Finance Systems',
    color: '#ec4899',
    text: 'Owned the data model and system logic for an ERP platform running $100–$10K field-operation budgets across 6,000+ sites — later white-labeled for enterprise clients in Australia.',
  },
  {
    tag: 'AI & Automation',
    color: '#06b6d4',
    text: 'Built an AI Formulas Builder on top of an existing workflow engine so non-technical staff could self-serve automations, cutting hundreds of engineering hours a month.',
  },
  {
    tag: 'AI & Automation',
    color: '#06b6d4',
    text: 'Shipped a proactive monitoring tool that catches and flags integration data mismatches before they reach a client-reported ticket.',
  },
  {
    tag: 'Integrations',
    color: '#0ea5e9',
    text: 'Run day-to-day integration health across 10+ SaaS systems (HubSpot, Salesforce, Snowflake, BigQuery, Zendesk, Intercom, Pendo) feeding one core platform.',
  },
  {
    tag: 'Audit & Compliance',
    color: '#10b981',
    text: 'Took a tax-compliance product live and registered it with the Spanish tax authority under the new Verifactu law — shipped software, not just a spec.',
  },
  {
    tag: 'Process & Ops Efficiency',
    color: '#f59e0b',
    text: 'Cut release cycle time from 4 months to 6 weeks and cleared 1,000+ stalled backlog tickets across a 50-person org.',
  },
  {
    tag: 'Process & Ops Efficiency',
    color: '#f59e0b',
    text: 'Reduced retailer onboarding from 3 months to 3–4 weeks by systematizing configuration and rollout for a B2B SaaS platform.',
  },
  {
    tag: 'Corporate Finance Exposure',
    color: '#8b5cf6',
    text: 'Advised banks, government institutions, and factories on KPI design and operational cost reduction as an operational consultant.',
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
    if (!cvRef.current) return
    
    try {
      const { default: html2pdf } = await import('html2pdf.js')
      
      const elementClone = cvRef.current.cloneNode(true) as HTMLElement
      
      const visibleH2El = elementClone.querySelector('[data-content-type="visible-h2"]')
      const invisibleH2El = elementClone.querySelector('[data-content-type="invisible-h2"]')
      
      if (visibleH2El && visibleH2El instanceof HTMLElement) {
        visibleH2El.textContent = newVisibleH2
      }
      if (invisibleH2El && invisibleH2El instanceof HTMLElement) {
        invisibleH2El.remove()
      }
      
      const opt = {
        margin: 0,
        filename: 'Andrii_Chepizhko_CV.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { format: 'a4', orientation: 'portrait', compress: true },
      }
      
      const { PDFDocument, rgb } = await import('pdf-lib')
      
      const pdfBlob: Blob = await new Promise((resolve, reject) => {
        html2pdf()
          .set(opt)
          .from(elementClone)
          .toPdf()
          .get('pdf', (pdf: any) => {
            try {
              const blob = pdf.output('blob')
              resolve(blob)
            } catch (e) {
              reject(e)
            }
          })
      })
      
      const pdfBytes = await pdfBlob.arrayBuffer()
      const pdfDoc = await PDFDocument.load(pdfBytes)
      
      while (pdfDoc.getPageCount() > 1) {
        pdfDoc.removePage(pdfDoc.getPageCount() - 1)
      }
      
      const pages = pdfDoc.getPages()
      if (pages.length > 0 && newInvisibleH2 && newInvisibleH2.trim().length > 0) {
        const firstPage = pages[0]
        const pageHeight = firstPage.getHeight()
        const sanitizedText = newInvisibleH2.replace(/[^\x00-\x7F]/g, '?')
        
        try {
          const courierFont = await pdfDoc.embedFont('Courier')
          const yPosition = pageHeight - 20
          
          firstPage.drawText(sanitizedText, {
            x: 20,
            y: yPosition,
            size: 3,
            color: rgb(0.9, 0.9, 0.9),
            font: courierFont,
          })
          console.log('✓ Added hidden text to PDF via post-processing, text:', sanitizedText.substring(0, 80))
        } catch (e) {
          console.warn('Error adding text:', e)
        }
      }
      
      const modifiedPdfBytes = await pdfDoc.save()
      const modifiedBlob = new Blob([modifiedPdfBytes as any], { type: 'application/pdf' })
      
      const url = URL.createObjectURL(modifiedBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'Andrii_Chepizhko_CV.pdf'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      setVisibleH2(newVisibleH2)
      setInvisibleH2(newInvisibleH2)
    } catch (error) {
      console.error('Failed to generate PDF:', error)
      console.error('Error details:', error instanceof Error ? error.message : String(error))
      alert('Failed to generate PDF. Check console for details.')
    }
  }

  const renderExperienceRow = (exp: typeof experiences[0]) => (
    <a 
      key={exp.id} 
      href={`/experience/${exp.id}`}
      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 2.2fr 1fr', gap: '6mm', alignItems: 'start' }}>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
          {exp.logo && (
            <img
              src={exp.logo}
              alt={exp.title}
              style={{
                width: '32px',
                height: '32px',
                flexShrink: 0,
                objectFit: 'contain',
              }}
            />
          )}
          <div>
            <h2 style={{ margin: 0, fontSize: '11px', fontWeight: 600 }}>
              {exp.title}
            </h2>
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
        <div style={{ textAlign: 'left', whiteSpace: 'nowrap', flexShrink: 0, fontSize: '9px', color: '#888' }}>
          {exp.duration}
        </div>
      </div>
    </a>
  )

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-8 px-4 flex flex-col items-center page-container">
      <MobileMenu onDownloadCV={handleOpenModal} />
      
      <div className="w-full flex justify-center mb-8">
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
        data-cv-content
        className="bg-white text-black"
        style={{
          width: 'min(210mm, calc(100% - 32px))',
          height: '297mm',
          minHeight: '297mm',
          padding: '6mm 8mm',
          fontSize: '12px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          overflow: 'hidden',
        }}
      >
        {/* Intro Section */}
        <div style={{ marginBottom: '2mm' }}>
          <h1 style={{ margin: '0 0 4px 0', fontSize: '26px', fontWeight: 300 }}>
            {profile.name}
          </h1>
          <h2 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 400, color: '#666' }}>
            {profile.title}
          </h2>
          <h2 data-content-type="visible-h2" style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 400, color: '#888', lineHeight: 1.4 }}>
            {visibleH2}
          </h2>
          <h2 data-content-type="invisible-h2" style={{ margin: '0 0 4px 0', fontSize: '5px', fontWeight: 400, color: '#111111', lineHeight: 1.4 }}>
            {invisibleH2}
          </h2>
        </div>

        {/* Contact Section */}
        <div style={{ marginBottom: '6mm', paddingBottom: '4mm', borderBottom: '1px solid #ddd' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6mm', fontSize: '11px' }}>
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
          </div>
        </div>

        {/* Experience Section */}
        <div style={{ marginBottom: '4mm' }}>
          <div style={{ marginBottom: '3mm' }}>
            <h2 style={{ margin: '0 0 2px 0', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Professional Experience
            </h2>
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

        {/* Relevant Experience Section Header */}
        <div style={{ marginBottom: '4mm', paddingTop: '4mm', borderTop: '1px solid #ddd' }}>
          <h2 style={{ margin: '0 0 2px 0', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Relevant Experience
          </h2>
        </div>

        {/* Relevant Experience Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5mm 6mm', marginBottom: '4mm' }}>
          {relevantExperience.map((item, idx) => (
            <div key={idx}>
              <span
                style={{
                  display: 'inline-block',
                  fontSize: '8px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.3px',
                  color: '#fff',
                  backgroundColor: item.color,
                  borderRadius: '3px',
                  padding: '2px 6px',
                  marginBottom: '2px',
                }}
              >
                {item.tag}
              </span>
              <p style={{ margin: 0, fontSize: '10px', lineHeight: 1.4, color: '#333' }}>
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 text-center text-neutral-500 text-sm">
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
