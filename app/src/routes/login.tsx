import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useAuth, DEMO_USERS, ROLE_LABELS, ROLE_COLORS } from '#/lib/auth'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { HardHat, Eye, EyeOff, LogIn, Lock, Mail } from 'lucide-react'

export const Route = createFileRoute('/login')({ component: LoginPage })

function LoginPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (user) navigate({ to: '/' })
  }, [user, navigate])

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    setTimeout(() => {
      const result = login(email, password)
      if (result.ok) {
        navigate({ to: '/' })
      } else {
        setError(result.error ?? 'Login failed.')
        setLoading(false)
      }
    }, 500)
  }

  function quickLogin(demoEmail: string, demoPassword: string) {
    setEmail(demoEmail)
    setPassword(demoPassword)
    setError('')
    setLoading(true)
    setTimeout(() => {
      const result = login(demoEmail, demoPassword)
      if (result.ok) navigate({ to: '/' })
      else setLoading(false)
    }, 400)
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel – branding */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 bg-[oklch(0.23_0.04_252)] p-10 text-white">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
            <HardHat className="size-5 text-white" />
          </div>
          <div>
            <div className="text-base font-bold tracking-tight">FinoERP</div>
            <div className="text-[11px] text-white/50 font-medium">Construction Suite</div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/70">
            <span className="size-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
            Enterprise-grade ERP
          </div>
          <h1 className="text-3xl font-bold leading-snug text-white">
            Control every rupee,<br />every site, every day.
          </h1>
          <p className="text-sm text-white/50 leading-relaxed">
            Purpose-built for construction contractors — from site requisition to final account, all in one system.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            {[
              { label: 'Active Sites', value: '12' },
              { label: 'Budget Tracked', value: '₹4.8Cr' },
              { label: 'POs This Month', value: '26' },
              { label: 'Pending Approvals', value: '18' },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-white/8 p-3 border border-white/10">
                <div className="text-lg font-bold text-white">{s.value}</div>
                <div className="text-[11px] text-white/50 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-white/30">
          © 2026 FinoERP. Confidential — for authorised personnel only.
        </p>
      </div>

      {/* Right Panel – login form */}
      <div className="flex flex-1 flex-col items-center justify-center p-6 lg:p-12 bg-background">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
              <HardHat className="size-4 text-white" />
            </div>
            <span className="font-bold text-foreground">FinoERP</span>
          </div>

          <div className="mb-7">
            <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
            <p className="text-sm text-muted-foreground mt-1">Sign in to your FinoERP account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <Input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@finoerp.in"
                  className="pl-9 h-10 text-sm"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError('') }}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <Input
                  id="login-password"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="pl-9 pr-10 h-10 text-sm"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError('') }}
                  required
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPw ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2 text-xs text-destructive font-medium">
                {error}
              </div>
            )}

            <Button
              id="login-submit"
              type="submit"
              className="w-full h-10 font-semibold gap-2"
              disabled={loading}
            >
              {loading ? (
                <span className="size-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              ) : (
                <LogIn className="size-4" />
              )}
              {loading ? 'Signing in…' : 'Sign In'}
            </Button>
          </form>

          {/* Demo accounts */}
          <div className="mt-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Demo accounts</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="space-y-2">
              {DEMO_USERS.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => quickLogin(u.email, u.password)}
                  className="w-full flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5 hover:bg-muted/50 hover:border-primary/30 transition-all text-left group"
                >
                  <div className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold shrink-0">
                    {u.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-foreground truncate">{u.name}</div>
                    <div className="text-[10px] text-muted-foreground truncate">{u.email} · {u.password}</div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-[9px] font-semibold shrink-0 h-4 px-1.5 ${ROLE_COLORS[u.role]}`}
                  >
                    {ROLE_LABELS[u.role]}
                  </Badge>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
