'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

interface NavigationContextType {
  isReturning: boolean
}

const NavigationContext = createContext<NavigationContextType>({ isReturning: false })

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isReturning, setIsReturning] = useState(false)
  const [lastPathname, setLastPathname] = useState<string | null>(null)

  useEffect(() => {
    if (lastPathname && lastPathname !== '/' && pathname === '/') {
      setIsReturning(true)
    } else if (pathname !== '/') {
      setIsReturning(false)
    }
    setLastPathname(pathname)
  }, [pathname, lastPathname])

  return (
    <NavigationContext.Provider value={{ isReturning }}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider')
  }
  return context
}
