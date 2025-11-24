import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { LuckyIncensePage } from '../components/LuckyIncensePage'

export const Route = createFileRoute('/incense')({
  component: IncensePage,
})

function IncensePage() {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate({ to: '/' })
  }

  const handleNavigateHome = () => {
    navigate({ to: '/' })
  }

  return (
    <LuckyIncensePage onBack={handleBack} onNavigateHome={handleNavigateHome} />
  )
}
