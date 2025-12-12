'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FiMenu, FiX } from 'react-icons/fi'

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  const menuItems = [
    { label: 'About Andrii', href: '/experience' },
    { label: 'Get in touch', href: '/contact' },
    { label: 'Talk to Assistant', href: '/chatbot', highlight: true },
  ]

  return (
    <>
      <button
        onClick={toggleMenu}
        className="fixed top-6 right-6 z-50 p-3 text-neutral-100 hover:text-cyan-400 transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <FiX size={32} />
        ) : (
          <FiMenu size={32} />
        )}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {isOpen && (
        <div className="fixed top-16 right-6 z-40 bg-neutral-900 border border-neutral-700 rounded-sm shadow-lg min-w-48 py-3">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`block px-6 py-4 transition-colors ${
                item.highlight
                  ? 'text-cyan-400 hover:bg-neutral-800 font-medium'
                  : 'text-neutral-100 hover:bg-neutral-800 hover:text-cyan-400'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
