'use client'

import { usePathname } from 'next/navigation'
import { ChatWidget } from '@/components/ChatWidget'

export function ChatWidgetClient() {
  const pathname = usePathname()
  
  if (pathname === '/chatbot') {
    return null
  }
  
  return <ChatWidget />
}
