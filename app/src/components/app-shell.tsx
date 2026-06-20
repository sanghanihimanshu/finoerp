import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from '#/components/ui/sidebar'
import { Avatar, AvatarFallback } from '#/components/ui/avatar'
import { Separator } from '#/components/ui/separator'
import { Link, useRouterState } from '@tanstack/react-router'
import {
  LayoutDashboard,
  HardHat,
  Package,
  FileText,
  CheckSquare,
  IndianRupee,
  ShoppingCart,
  Users,
  Settings,
  Bell,
  ChevronRight,
  Building2,
} from 'lucide-react'
import { Badge } from '#/components/ui/badge'
import { cn } from '#/lib/utils'

const mainNav = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'Projects', url: '/projects', icon: HardHat },
  { title: 'Materials', url: '/materials', icon: Package },
  { title: 'Procurement', url: '/procurement', icon: ShoppingCart },
  { title: 'Finance & Cost', url: '/finance', icon: IndianRupee },
  { title: 'Documents', url: '/documents', icon: FileText },
  { title: 'Approvals', url: '/approvals', icon: CheckSquare, badge: 18 },
  { title: 'HR & Labour', url: '/hr', icon: Users },
]

const otherNav = [
  { title: 'Settings', url: '/settings', icon: Settings },
]

function NavItem({
  item,
}: {
  item: { title: string; url: string; icon: React.ElementType; badge?: number }
}) {
  const { location } = useRouterState()
  const isActive = location.pathname === item.url

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} className="group">
        <Link to={item.url} className="flex items-center gap-2.5 px-3 py-2 text-sm">
          <item.icon
            className={cn(
              'size-4 shrink-0 transition-colors',
              isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
            )}
          />
          <span className={cn(isActive ? 'font-medium text-foreground' : 'text-muted-foreground group-hover:text-foreground')}>
            {item.title}
          </span>
          {item.badge && (
            <Badge className="ml-auto h-4 min-w-4 justify-center px-1 text-[10px] font-semibold bg-primary/10 text-primary hover:bg-primary/10">
              {item.badge}
            </Badge>
          )}
          {isActive && <ChevronRight className="ml-auto size-3 text-primary" />}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar className="border-r border-border bg-card" collapsible="icon">
        {/* Logo */}
        <SidebarHeader className="h-14 flex flex-row items-center gap-2.5 border-b border-border px-4">
          <div className="flex size-7 items-center justify-center rounded-md bg-primary">
            <Building2 className="size-4 text-primary-foreground" />
          </div>
          <div className="flex flex-col leading-none group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-bold tracking-tight text-foreground">FinoERP</span>
            <span className="text-[10px] text-muted-foreground font-medium">Construction Suite</span>
          </div>
        </SidebarHeader>

        <SidebarContent className="pt-2 gap-0 overflow-y-auto">
          {/* Main nav */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-semibold px-4 mb-1">
              Main
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-px">
                {mainNav.map((item) => (
                  <NavItem key={item.title} item={item} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <Separator className="my-3 mx-4 w-auto" />

          {/* Others nav */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-semibold px-4 mb-1">
              Others
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-px">
                {otherNav.map((item) => (
                  <NavItem key={item.title} item={item} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* User footer */}
        <SidebarFooter className="border-t border-border p-3">
          <div className="flex items-center gap-2.5 rounded-md px-2 py-1.5 hover:bg-muted cursor-pointer transition-colors">
            <Avatar className="size-7 shrink-0">
              <AvatarFallback className="text-[11px] font-semibold bg-primary/10 text-primary">
                AM
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0 group-data-[collapsible=icon]:hidden">
              <span className="text-xs font-semibold text-foreground truncate">Amit Director</span>
              <span className="text-[10px] text-muted-foreground truncate">amit@finoerp.in</span>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="flex flex-col h-screen overflow-hidden bg-background">
        {/* Top header bar */}
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-card px-4">
          <SidebarTrigger className="size-7 text-muted-foreground" />
          <Separator orientation="vertical" className="h-4" />
          <PageBreadcrumb />
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              className="relative flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Bell className="size-4" />
              <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-primary" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

function PageBreadcrumb() {
  const { location } = useRouterState()
  const labels: Record<string, string> = {
    '/': 'Dashboard',
    '/projects': 'Projects & Sites',
    '/materials': 'Materials & Inventory',
    '/procurement': 'Procurement',
    '/finance': 'Finance & Cost',
    '/documents': 'Documents',
    '/approvals': 'Approvals',
    '/hr': 'HR & Labour',
    '/settings': 'Settings',
  }
  const label = labels[location.pathname] ?? 'Page'
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-muted-foreground">FinoERP</span>
      <ChevronRight className="size-3 text-muted-foreground" />
      <span className="text-xs font-medium text-foreground">{label}</span>
    </div>
  )
}
