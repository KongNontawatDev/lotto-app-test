import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { WheelSpinPage } from '../components/WheelSpinPage'

export const Route = createFileRoute('/wheel-spin')({
  component: WheelSpinPageComponent,
})

function WheelSpinPageComponent() {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate({ to: '/' })
  }

  const handleNavigateHome = () => {
    navigate({ to: '/' })
  }

  return (
    <WheelSpinPage onBack={handleBack} onNavigateHome={handleNavigateHome} />
  )
}
