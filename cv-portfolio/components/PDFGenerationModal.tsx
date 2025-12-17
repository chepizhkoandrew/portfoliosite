'use client'

import { useState } from 'react'
import { FiX } from 'react-icons/fi'

interface PDFGenerationModalProps {
  isOpen: boolean
  onClose: () => void
  onGenerate: (visibleH2: string, invisibleH2: string) => void
  defaultVisibleH2: string
}

export function PDFGenerationModal({
  isOpen,
  onClose,
  onGenerate,
  defaultVisibleH2,
}: PDFGenerationModalProps) {
  const [visibleH2, setVisibleH2] = useState(defaultVisibleH2)
  const [invisibleH2, setInvisibleH2] = useState('')
  const [vacancy, setVacancy] = useState('')
  const [generatedSummary, setGeneratedSummary] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisError, setAnalysisError] = useState('')

  const handleAnalyzeVacancy = async () => {
    if (!vacancy.trim()) {
      setAnalysisError('Please enter a vacancy description')
      return
    }

    setIsAnalyzing(true)
    setAnalysisError('')
    setGeneratedSummary('')

    try {
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'
      const response = await fetch(`${BACKEND_URL}/api/vacancy-match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          vacancy: vacancy.trim(),
          instructions: 'Generate a concise professional summary in English only (Latin characters only, no Cyrillic or special characters). The summary should be 1-2 sentences highlighting relevant skills and experience matching the vacancy.'
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to analyze vacancy')
      }

      const data = await response.json()
      setGeneratedSummary(data.summary)
    } catch (error) {
      setAnalysisError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleUseGeneratedSummary = () => {
    setInvisibleH2(generatedSummary)
    setGeneratedSummary('')
    setVacancy('')
  }

  const handleGenerate = () => {
    onGenerate(visibleH2, invisibleH2)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 border border-neutral-700 rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-light text-neutral-100">Generate PDF</h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-100 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="space-y-6 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-light text-neutral-300 mb-2">
              Visible Summary (H2)
            </label>
            <textarea
              value={visibleH2}
              onChange={(e) => setVisibleH2(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500 resize-none"
              rows={3}
              placeholder="Enter visible summary..."
            />
          </div>

          <div className="border-t border-neutral-700 pt-4">
            <label className="block text-sm font-light text-neutral-300 mb-2">
              Vacancy Description (Optional)
            </label>
            <textarea
              value={vacancy}
              onChange={(e) => setVacancy(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500 resize-none"
              rows={6}
              placeholder="Paste full vacancy description here..."
            />
            <button
              onClick={handleAnalyzeVacancy}
              disabled={isAnalyzing}
              className="w-full mt-3 px-3 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900 disabled:opacity-50 text-white rounded transition-colors text-sm"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Vacancy'}
            </button>
            {analysisError && (
              <div className="mt-2 text-sm text-red-400">{analysisError}</div>
            )}
          </div>

          {generatedSummary && (
            <div className="border-t border-neutral-700 pt-4 bg-neutral-800/50 rounded p-3">
              <p className="text-xs text-neutral-400 mb-2">Generated Summary:</p>
              <p className="text-sm text-neutral-100 mb-3 leading-relaxed">{generatedSummary}</p>
              <div className="flex gap-2">
                <button
                  onClick={handleUseGeneratedSummary}
                  className="flex-1 px-2 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors"
                >
                  Use This
                </button>
                <button
                  onClick={() => setGeneratedSummary('')}
                  className="flex-1 px-2 py-1.5 bg-neutral-700 hover:bg-neutral-600 text-neutral-100 rounded text-sm transition-colors"
                >
                  Discard
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-light text-neutral-300 mb-2">
              Invisible Summary (H2) - For LLM Extraction
            </label>
            <textarea
              value={invisibleH2}
              onChange={(e) => setInvisibleH2(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500 resize-none"
              rows={3}
              placeholder="Enter invisible summary (white-on-white in PDF)..."
            />
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 rounded transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors font-light"
          >
            Generate PDF
          </button>
        </div>
      </div>
    </div>
  )
}
