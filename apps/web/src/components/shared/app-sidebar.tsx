import {
  Link,
  useLocation,
  useNavigate,
  useRouter,
} from '@tanstack/react-router'
import {
  Building2,
  Check,
  ChevronsUpDown,
  Handshake,
  LayoutDashboard,
  LogOut,
  Plus,
  Users,
} from 'lucide-react'
import { authClient } from '#/features/auth/client'
import { setActiveWorkspace } from '#/features/workspaces/server/mutations/set-active-workspace'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/deals', label: 'Deals', icon: Handshake },
  { to: '/companies', label: 'Companies', icon: Building2 },
  { to: '/contacts', label: 'Contacts', icon: Users },
] as const

type WorkspaceSummary = { id: string; name: string; slug: string }

export function AppSidebar({
  workspaces,
  activeWorkspaceId,
}: {
  workspaces: WorkspaceSummary[]
  activeWorkspaceId: string | null
}) {
  const pathname = useLocation().pathname
  const navigate = useNavigate()
  const router = useRouter()
  const { data: session } = authClient.useSession()
  const user = session?.user

  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId)

  const handleSelectWorkspace = async (workspaceId: string) => {
    if (workspaceId === activeWorkspaceId) return
    await setActiveWorkspace({ data: { workspaceId } })
    await router.invalidate()
    await router.navigate({ to: '/dashboard' })
  }

  const handleCreateWorkspace = () => {
    void navigate({ to: '/onboarding', search: { step: 0 } })
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <span className="flex aspect-square size-8 items-center justify-center rounded-lg border bg-sidebar text-sm font-semibold">
                    {(activeWorkspace?.name ?? 'W').charAt(0).toUpperCase()}
                  </span>
                  <span className="truncate text-base font-semibold tracking-[-0.02em]">
                    {activeWorkspace?.name ?? 'Select workspace'}
                  </span>
                  <ChevronsUpDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                align="start"
                side="bottom"
                sideOffset={4}
              >
                <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
                {workspaces.map((workspace) => (
                  <DropdownMenuItem
                    key={workspace.id}
                    onSelect={() => void handleSelectWorkspace(workspace.id)}
                  >
                    <span className="truncate">{workspace.name}</span>
                    {workspace.id === activeWorkspaceId && (
                      <Check className="ml-auto" />
                    )}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleCreateWorkspace}>
                  <Plus />
                  Create workspace
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
