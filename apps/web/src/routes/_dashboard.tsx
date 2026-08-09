import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { AppSidebar } from '#/components/shared/app-sidebar'
import { Separator } from '#/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '#/components/ui/sidebar'
import { getSessionStatus } from '#/features/auth/server/queries/get-session-status'
import { getOnboardingStatus } from '#/features/onboarding/server/queries/get-onboarding-status'

export const Route = createFileRoute('/_dashboard')({
  component: DashboardLayout,
  beforeLoad: async () => {
    const status = await getSessionStatus()
    if (!status.signedIn) {
      throw redirect({ to: '/login' })
    }
    const onboarding = await getOnboardingStatus()
    if (!onboarding.onboarded) {
      throw redirect({ to: '/onboarding' })
    }
  },
})

function DashboardLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-11 shrink-0 items-center gap-2 border-b border-hairline bg-parchment/80 px-4 backdrop-blur">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
