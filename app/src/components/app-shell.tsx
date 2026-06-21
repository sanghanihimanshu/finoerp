import { useState, useRef, useEffect } from 'react'
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
import { Link, useRouterState, useNavigate } from '@tanstack/react-router'
import {
  LayoutDashboard,
  HardHat,
  Package,
  ShoppingCart,
  IndianRupee,
  FileText,
  Users,
  CheckSquare,
  Settings,
  Bell,
  ChevronRight,
  LogOut,
  User,
  CheckCircle2,
  AlertTriangle,
  Info,
  MoreVertical,
  HardDrive,
  Receipt,
  Hammer,
  ShieldOff,
} from 'lucide-react'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { cn } from '#/lib/utils'
import { useAuth, ROLE_LABELS, ROLE_COLORS } from '#/lib/auth'

const mainNav = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'Contractors', url: '/contractors', icon: Hammer },
  { title: 'Billing & Invoicing', url: '/billing', icon: Receipt },
  { title: 'Equipment', url: '/equipment', icon: HardDrive },
  { title: 'Approvals', url: '/approvals', icon: CheckSquare, badge: 18 },
  { title: 'Projects', url: '/projects', icon: HardHat },
  { title: 'Materials', url: '/materials', icon: Package },
  { title: 'Procurement', url: '/procurement', icon: ShoppingCart },
  { title: 'Finance & Cost', url: '/finance', icon: IndianRupee },
  { title: 'Documents', url: '/documents', icon: FileText },
  { title: 'HR & Labour', url: '/hr', icon: Users },
]

const otherNav = [
  { title: 'Settings', url: '/settings', icon: Settings },
]

const notifications = [
  { id: 1, icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10', title: 'Budget Overrun', desc: 'Skyline Towers exceeded budget by ₹12L', time: '2m ago', unread: true },
  { id: 2, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', title: 'PO Approved', desc: 'PO-0042 approved by Priya Desai', time: '15m ago', unread: true },
  { id: 3, icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50', title: 'Low Stock Alert', desc: 'M-Sand stock at SITE-014 below reorder level', time: '1h ago', unread: true },
  { id: 4, icon: Info, color: 'text-primary', bg: 'bg-primary/10', title: 'Approval Pending', desc: '3 documents awaiting your approval', time: '3h ago', unread: false },
  { id: 5, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', title: 'Labour Attendance', desc: 'Daily attendance for SITE-015 logged', time: 'Yesterday', unread: false },
]

function useClickOutside(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return
      handler()
    }
    document.addEventListener('mousedown', listener)
    return () => document.removeEventListener('mousedown', listener)
  }, [ref, handler])
}

function NavItem({
  item,
}: {
  item: { title: string; url: string; icon: React.ElementType; badge?: number }
}) {
  const { location } = useRouterState()
  const { canAccess } = useAuth()
  const isActive = location.pathname === item.url
  const allowed = canAccess(item.url)

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} className="group">
        <Link
          to={item.url}
          className={cn(
            'flex items-center gap-2.5 px-3 py-2 text-sm',
            !allowed && 'opacity-40 cursor-not-allowed pointer-events-none'
          )}
          onClick={(e) => { if (!allowed) e.preventDefault() }}
          title={!allowed ? 'Access restricted for your role' : undefined}
        >
          {!allowed ? (
            <ShieldOff className="size-4 shrink-0 text-muted-foreground" />
          ) : (
            <item.icon
              className={cn(
                'size-4 shrink-0 transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
              )}
            />
          )}
          <span className={cn(isActive ? 'font-medium text-foreground' : 'text-muted-foreground group-hover:text-foreground')}>
            {item.title}
          </span>
          {item.badge && allowed && (
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

// ─── Notification Dropdown ─────────────────────────────────────────────────────
function NotificationButton() {
  const [open, setOpen] = useState(false)
  const [notifs, setNotifs] = useState(notifications)
  const ref = useRef<HTMLDivElement>(null)
  useClickOutside(ref, () => setOpen(false))
  const unreadCount = notifs.filter((n) => n.unread).length

  function markAllRead() {
    setNotifs((prev) => prev.map((n) => ({ ...n, unread: false })))
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="relative flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      >
        <Bell className="size-4" />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-white leading-none">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-50 w-80 rounded-xl border border-border bg-card shadow-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">Notifications</span>
              {unreadCount > 0 && (
                <Badge className="h-4 px-1.5 text-[10px] font-bold bg-destructive text-white">
                  {unreadCount} new
                </Badge>
              )}
            </div>
            {unreadCount > 0 && (
              <button type="button" onClick={markAllRead} className="text-[11px] text-primary hover:underline font-medium">
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-72 overflow-y-auto">
            {notifs.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => setNotifs((prev) => prev.map((x) => x.id === n.id ? { ...x, unread: false } : x))}
                className={cn(
                  'w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50 border-b border-border/50 last:border-0',
                  n.unread && 'bg-primary/3'
                )}
              >
                <div className={cn('flex size-7 shrink-0 items-center justify-center rounded-full mt-0.5', n.bg)}>
                  <n.icon className={cn('size-3.5', n.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={cn('text-xs font-semibold text-foreground truncate', n.unread && 'text-foreground')}>{n.title}</span>
                    <span className="text-[10px] text-muted-foreground shrink-0">{n.time}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{n.desc}</p>
                </div>
                {n.unread && <span className="size-1.5 rounded-full bg-primary shrink-0 mt-1.5" />}
              </button>
            ))}
          </div>
          <div className="px-4 py-2.5 border-t border-border bg-muted/20">
            <button type="button" className="w-full text-center text-xs text-primary hover:underline font-medium">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Header Profile Dropdown ──────────────────────────────────────────────────
function HeaderProfile() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  useClickOutside(ref, () => setOpen(false))

  function handleLogout() {
    logout()
    navigate({ to: '/login' })
  }

  if (!user) return null

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-muted transition-colors"
      >
        <Avatar className="size-7 shrink-0">
          <AvatarFallback className="text-[11px] font-semibold bg-primary/10 text-primary">{user.avatar}</AvatarFallback>
        </Avatar>
        <div className="hidden sm:flex flex-col items-start leading-none">
          <span className="text-xs font-semibold text-foreground">{user.name}</span>
          <span className="text-[10px] text-muted-foreground">{ROLE_LABELS[user.role]}</span>
        </div>
        <ChevronRight className="size-3 text-muted-foreground rotate-90 hidden sm:block" />
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-50 w-56 rounded-xl border border-border bg-card shadow-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-muted/20">
            <div className="text-sm font-semibold text-foreground">{user.name}</div>
            <div className="text-[11px] text-muted-foreground">{user.email}</div>
            <Badge variant="outline" className={`mt-1.5 text-[10px] font-semibold ${ROLE_COLORS[user.role]}`}>
              {ROLE_LABELS[user.role]}
            </Badge>
          </div>
          <div className="py-1">
            <Link
              to="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
            >
              <User className="size-3.5 text-muted-foreground" />
              Profile & Settings
            </Link>
          </div>
          <Separator />
          <div className="py-1">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-destructive hover:bg-destructive/5 transition-colors"
            >
              <LogOut className="size-3.5" />
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Sidebar Footer Profile ───────────────────────────────────────────────────
function SidebarUserFooter() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  useClickOutside(ref, () => setOpen(false))

  function handleLogout() {
    logout()
    navigate({ to: '/login' })
  }

  if (!user) return null

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2.5 rounded-md px-2 py-1.5 hover:bg-muted cursor-pointer transition-colors"
      >
        <Avatar className="size-7 shrink-0">
          <AvatarFallback className="text-[11px] font-semibold bg-primary/10 text-primary">{user.avatar}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
          <span className="text-xs font-semibold text-foreground truncate text-left">{user.name}</span>
          <span className="text-[10px] text-muted-foreground truncate text-left">{user.email}</span>
        </div>
        <MoreVertical className="size-3.5 text-muted-foreground shrink-0 group-data-[collapsible=icon]:hidden" />
      </button>

      {open && (
        <div className="absolute bottom-12 left-0 right-0 z-50 rounded-xl border border-border bg-card shadow-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-muted/20">
            <div className="text-sm font-semibold text-foreground">{user.name}</div>
            <div className="text-[11px] text-muted-foreground">{user.email}</div>
            <Badge variant="outline" className={`mt-1.5 text-[10px] font-semibold ${ROLE_COLORS[user.role]}`}>
              {ROLE_LABELS[user.role]}
            </Badge>
          </div>
          <div className="py-1">
            <Link to="/settings" onClick={() => setOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">
              <User className="size-3.5 text-muted-foreground" />
              Profile & Settings
            </Link>
          </div>
          <Separator />
          <div className="py-1">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-destructive hover:bg-destructive/5 transition-colors"
            >
              <LogOut className="size-3.5" />
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── RBAC Page Content Wrapper ────────────────────────────────────────────────
function RbacGate({ children }: { children: React.ReactNode }) {
  const { canAccess } = useAuth()
  const { location } = useRouterState()
  const allowed = canAccess(location.pathname)

  if (!allowed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-5 text-center max-w-sm mx-auto">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-destructive/10">
          <ShieldOff className="size-8 text-destructive" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-xl font-bold text-foreground">Access Restricted</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your role does not have permission to access this page. Contact your administrator if you need access.
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/"><ChevronRight className="size-3.5 mr-1 rotate-180" />Back to Dashboard</Link>
        </Button>
      </div>
    )
  }

  return <>{children}</>
}

// ─── App Shell ────────────────────────────────────────────────────────────────
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar className="border-r border-border bg-card overflow-x-hidden" collapsible="icon">
        <SidebarHeader className="h-12 flex flex-row items-center border-b border-border px-3 overflow-hidden">
          {/* Expanded: wide logo with text */}
          <img src="/logo-wbg.png" alt="FinoERP" className="h-8 w-auto object-contain group-data-[collapsible=icon]:hidden" />
          {/* Collapsed: square icon only */}
          <img src="/Logo.png" alt="FinoERP" className="size-7 shrink-0 rounded-lg object-contain hidden group-data-[collapsible=icon]:block" />
        </SidebarHeader>

        <SidebarContent className="pt-2 gap-0 overflow-y-auto overflow-x-hidden">
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

        <SidebarFooter className="border-t border-border p-3">
          <SidebarUserFooter />
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="flex flex-col h-screen overflow-hidden bg-background">
        <header className="flex h-12 shrink-0 items-center gap-3 border-b border-border bg-card px-4">
          <SidebarTrigger className="size-6 text-muted-foreground" />
          <Separator orientation="vertical" className="h-4" />
          <PageBreadcrumb />
          <div className="ml-auto flex items-center gap-1.5">
            <NotificationButton />
            <Separator orientation="vertical" className="h-4 mx-1" />
            <HeaderProfile />
          </div>
        </header>

        <main className="flex-1 overflow-auto p-3">
          <RbacGate>{children}</RbacGate>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

// ─── RBAC Page Content Wrapper ────────────────────────────────────────────────
function PageContent() {
  const { canAccess } = useAuth()
  const { location } = useRouterState()
  const allowed = canAccess(location.pathname)

  if (!allowed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-5 text-center max-w-sm mx-auto">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-destructive/10">
          <ShieldOff className="size-8 text-destructive" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-xl font-bold text-foreground">Access Restricted</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your role does not have permission to access this page. Contact your administrator if you need access.
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/"><ChevronRight className="size-3.5 mr-1 rotate-180" />Back to Dashboard</Link>
        </Button>
      </div>
    )
  }

  // Import Outlet lazily to avoid circular dep - use children instead
  return null
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
    '/hr': 'HR & Labour',
    '/contractors': 'Contractor & Subcontractor',
    '/billing': 'Billing & Invoicing',
    '/equipment': 'Equipment & Assets',
    '/approvals': 'Approvals',
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
