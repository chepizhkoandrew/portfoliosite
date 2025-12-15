'use client'

import PMActivityCard from '@/components/PMActivityCard'
import { pmActivities } from '@/data/pmActivities'
import { useState, useEffect } from 'react'

export default function ProductDashboard() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Navigation Back */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-neutral-950/80 backdrop-blur-sm border-b border-neutral-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <a href="/" className="text-neutral-400 hover:text-neutral-200 text-sm font-light transition-colors">
            ← Back to Portfolio
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl sm:text-5xl font-light text-neutral-100 mb-3">Product Dashboard</h1>
            <p className="text-neutral-400 font-light text-lg">
              Core activities and responsibilities in product management
            </p>
          </div>

          {/* Activities Grid */}
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-500 ${
              mounted ? 'opacity-100' : 'opacity-0'
            }`}
          >
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
                  description={activity.description}
                  proficiency={activity.proficiency}
                  color={activity.color}
                />
              </div>
            ))}
          </div>

          {/* Footer Info */}
          <div className="mt-16 pt-8 border-t border-neutral-800/50">
            <p className="text-neutral-400 font-light text-sm text-center">
              Each card represents a core area of product management practice. Expand to see detailed activities.
            </p>
          </div>
        </div>
      </div>

      <style>{`
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
      `}</style>
    </div>
  )
}
