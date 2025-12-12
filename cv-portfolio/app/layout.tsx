import type { Metadata } from 'next'
import { Inter, Poppins, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { NavigationProvider } from './NavigationProvider'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Andrii Chepizhko - CV Portfolio',
  description: 'Interactive CV with multiple zoom levels showcasing professional experience and journey',
  icons: {
    icon: 'https://res.cloudinary.com/dzhwsjuxy/image/upload/v1765542415/andrii_portfolio_logo_amlc74.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} ${jetbrainsMono.variable} bg-neutral-950`}>
      <body className="bg-neutral-950 text-slate-100 font-inter min-h-screen">
        <NavigationProvider>
          {children}
          {/* <ChatWidgetClient /> */}
        </NavigationProvider>
      </body>
    </html>
  )
}
