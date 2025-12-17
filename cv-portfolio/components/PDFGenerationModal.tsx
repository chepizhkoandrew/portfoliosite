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

        <div className="space-y-6">
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
