import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import { LayoutDashboard, ListOrdered, LogOut } from 'lucide-react'
import { authClient } from '#/features/auth/client'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '#/components/ui/sidebar'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/deals', label: 'Deals', icon: ListOrdered },
] as const

export function AppSidebar() {
  const pathname = useLocation().pathname
  const navigate = useNavigate()
  const { data: session } = authClient.useSession()
  const user = session?.user

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/dashboard">
                <span className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <span className="text-sm font-semibold">PE</span>
                </span>
                <span className="text-base font-semibold tracking-[-0.02em]">
                  PE Intelligence
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
                <SidebarMenuItem key={to}>
                  <SidebarMenuButton asChild isActive={pathname === to}>
                    <Link to={to}>
                      <Icon />
                      <span>{label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              onClick={async () => {
                await authClient.signOut()
                navigate({ to: '/login' })
              }}
            >
              {user?.image ? (
                <img
                  src={user.image}
                  alt=""
                  className="size-8 rounded-full object-cover"
                />
              ) : (
                <span className="flex aspect-square size-8 items-center justify-center rounded-full bg-muted font-semibold">
                  {(user?.name ?? 'U').charAt(0).toUpperCase()}
                </span>
              )}
              <span className="truncate">
                {user?.name ?? user?.email ?? 'Account'}
              </span>
              <LogOut className="ml-auto" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
