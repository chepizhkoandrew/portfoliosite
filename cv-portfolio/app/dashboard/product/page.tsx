'use client'

import PMActivityCard from '@/components/PMActivityCard'
import PMActivityModal from '@/components/PMActivityModal'
import { pmActivities, PMActivity } from '@/data/pmActivities'
import { MobileMenu } from '@/components/MobileMenu'
import { downloadCV } from '@/lib/downloadCV'
import { useState, useEffect } from 'react'

export default function ProductDashboard() {
  const [mounted, setMounted] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<PMActivity | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <MobileMenu onDownloadCV={downloadCV} />
      {/* Navigation Back */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-neutral-950/80 backdrop-blur-sm border-b border-neutral-800/50">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <a href="/" className="text-neutral-400 hover:text-neutral-200 text-sm font-light transition-colors">
            ← Back to Portfolio
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 pb-16 dashboard-outer">
        <style>{`
          .dashboard-outer {
            padding-left: calc(1rem + 10px) !important;
            padding-right: calc(1rem + 10px) !important;
          }
          .dashboard-main {
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
          @media (min-width: 640px) {
            .dashboard-outer {
              padding-left: calc(1.5rem + 10px) !important;
              padding-right: calc(1.5rem + 10px) !important;
            }
          }
          @media (min-width: 1024px) {
            .dashboard-outer {
              padding-left: calc(2rem + 10px) !important;
              padding-right: calc(2rem + 10px) !important;
            }
          }
        `}</style>
        <div className="dashboard-main">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center dashboard-header">
              <h1 className="text-4xl sm:text-5xl font-light text-neutral-100 dashboard-title">Product Dashboard</h1>
              <p className="text-neutral-400 font-light text-lg dashboard-description">
                Core activities and responsibilities in product management
              </p>
            </div>

            {/* Activities Grid - Centered */}
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
                    proficiency={activity.proficiency}
                    onClick={() => setSelectedActivity(activity)}
                  />
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="border-t border-neutral-800/50 dashboard-legend">
              <p className="text-xs text-neutral-500 font-light">Click card to expand</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedActivity && (
        <PMActivityModal
          title={selectedActivity.title}
          description={selectedActivity.description}
          proficiency={selectedActivity.proficiency}
          onClose={() => setSelectedActivity(null)}
        />
      )}

      <style>{`
        .dashboard-header {
          margin-bottom: 2rem !important;
        }

        .dashboard-title {
          margin-bottom: 1rem !important;
        }

        .dashboard-description {
          padding-bottom: 2rem !important;
        }

        .dashboard-legend {
          margin-top: 4rem !important;
          padding-top: 3rem !important;
          display: flex !important;
          justify-content: center !important;
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
      `}</style>
    </div>
  )
}
