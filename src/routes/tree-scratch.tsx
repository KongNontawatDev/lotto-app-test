import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { TreeScratchPage } from '../components/TreeScratchPage'

export const Route = createFileRoute('/tree-scratch')({
  component: TreeScratchPageRoute,
})

function TreeScratchPageRoute() {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate({ to: '/' })
  }

  const handleNavigateHome = () => {
    navigate({ to: '/' })
  }

  return (
    <TreeScratchPage onBack={handleBack} onNavigateHome={handleNavigateHome} />
  )
}
