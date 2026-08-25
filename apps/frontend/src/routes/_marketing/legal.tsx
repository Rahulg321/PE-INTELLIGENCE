import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_marketing/legal')({
  component: LegalLayout,
})

function LegalLayout() {
  return (
    <div className="bg-canvas">
      <Outlet />
    </div>
  )
}
