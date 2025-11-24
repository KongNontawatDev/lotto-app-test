import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { BallDrawPage } from '../components/BallDrawPage'

export const Route = createFileRoute('/ball-draw')({
  component: BallDrawPageComponent,
})

function BallDrawPageComponent() {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate({ to: '/' })
  }

  const handleNavigateHome = () => {
    navigate({ to: '/' })
  }

  return (
    <BallDrawPage onBack={handleBack} onNavigateHome={handleNavigateHome} />
  )
}
