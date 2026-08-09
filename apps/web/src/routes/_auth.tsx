import { Outlet, createFileRoute } from '@tanstack/react-router'
import { BrandPanel } from '#/components/shared/brand-panel'

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
})

function AuthLayout() {
  return (
    <div className="grid min-h-screen bg-canvas lg:grid-cols-2">
      <BrandPanel
        title="Intelligence for your deal flow"
        subtitle="Deal intake, research, and screening for investment firms — in one quiet, focused workspace."
      />
      <main className="flex items-center justify-center bg-parchment px-6 py-12">
        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
