import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

// ─── Role Definitions ─────────────────────────────────────────────────────────
export type Role =
  | 'admin'
  | 'project_manager'
  | 'site_engineer'
  | 'procurement_manager'
  | 'finance'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: Role
  avatar: string
  site?: string // site assignment for site engineers
}

// ─── Demo Users ───────────────────────────────────────────────────────────────
export const DEMO_USERS: Array<AuthUser & { password: string }> = [
  {
    id: 'USR-001',
    name: 'Amit Director',
    email: 'amit@finoerp.in',
    password: 'admin123',
    role: 'admin',
    avatar: 'AD',
  },
  {
    id: 'USR-002',
    name: 'Suresh Patel',
    email: 'suresh@finoerp.in',
    password: 'pm123',
    role: 'project_manager',
    avatar: 'SP',
    site: 'SITE-014',
  },
  {
    id: 'USR-003',
    name: 'Vikram Sharma',
    email: 'vikram@finoerp.in',
    password: 'se123',
    role: 'site_engineer',
    avatar: 'VS',
    site: 'SITE-014',
  },
  {
    id: 'USR-004',
    name: 'Priya Desai',
    email: 'priya@finoerp.in',
    password: 'proc123',
    role: 'procurement_manager',
    avatar: 'PD',
  },
  {
    id: 'USR-005',
    name: 'Rahul Mehta',
    email: 'rahul@finoerp.in',
    password: 'fin123',
    role: 'finance',
    avatar: 'RM',
  },
]

// ─── RBAC Route Permissions ───────────────────────────────────────────────────
// Maps route paths to which roles can access them. '*' = all authenticated users.
export const ROUTE_PERMISSIONS: Record<string, Role[]> = {
  '/': ['admin', 'project_manager', 'finance', 'procurement_manager', 'site_engineer'],
  '/projects': ['admin', 'project_manager', 'site_engineer', 'finance'],
  '/materials': ['admin', 'project_manager', 'site_engineer', 'procurement_manager'],
  '/procurement': ['admin', 'procurement_manager', 'finance', 'project_manager'],
  '/contractors': ['admin', 'project_manager', 'finance'],
  '/billing': ['admin', 'finance', 'project_manager'],
  '/finance': ['admin', 'finance'],
  '/equipment': ['admin', 'project_manager', 'procurement_manager'],
  '/documents': ['admin', 'project_manager', 'site_engineer', 'finance', 'procurement_manager'],
  '/approvals': ['admin', 'project_manager', 'finance', 'procurement_manager'],
  '/hr': ['admin', 'project_manager'],
  '/settings': ['admin'],
}

export const ROLE_LABELS: Record<Role, string> = {
  admin: 'Admin',
  project_manager: 'Project Manager',
  site_engineer: 'Site Engineer',
  procurement_manager: 'Procurement Manager',
  finance: 'Finance Team',
}

export const ROLE_COLORS: Record<Role, string> = {
  admin: 'bg-destructive/10 text-destructive border-destructive/20',
  project_manager: 'bg-primary/10 text-primary border-primary/20',
  site_engineer: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  procurement_manager: 'bg-amber-50 text-amber-700 border-amber-200',
  finance: 'bg-violet-50 text-violet-700 border-violet-200',
}

// ─── Auth Context ─────────────────────────────────────────────────────────────
interface AuthContextValue {
  user: AuthUser | null
  login: (email: string, password: string) => { ok: boolean; error?: string }
  logout: () => void
  canAccess: (path: string) => boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

const STORAGE_KEY = 'finoerp_auth_user'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window === 'undefined') return null
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? (JSON.parse(raw) as AuthUser) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [user])

  function login(email: string, password: string) {
    const found = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )
    if (!found) {
      return { ok: false, error: 'Invalid email or password.' }
    }
    // Strip password before storing
    const { password: _pw, ...safeUser } = found
    setUser(safeUser)
    return { ok: true }
  }

  function logout() {
    setUser(null)
  }

  function canAccess(path: string): boolean {
    if (!user) return false
    const allowed = ROUTE_PERMISSIONS[path]
    if (!allowed) return user.role === 'admin' // unknown routes: admin only
    return allowed.includes(user.role)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, canAccess }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
