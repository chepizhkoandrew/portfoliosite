'use client'

import PortfolioRedesign from '@/components/PortfolioRedesign'
import { useNavigation } from './NavigationProvider'

export default function Home() {
  const { isReturning } = useNavigation()
  return <PortfolioRedesign showAnimations={!isReturning} />
}
