import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { SiameseStickPage } from '../components/SiameseStickPage'

export const Route = createFileRoute('/siamese-stick')({
  component: SiameseStickPageComponent,
})

function SiameseStickPageComponent() {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate({ to: '/' })
  }

  const handleNavigateHome = () => {
    navigate({ to: '/' })
  }

  return (
    <SiameseStickPage onBack={handleBack} onNavigateHome={handleNavigateHome} />
  )
}
