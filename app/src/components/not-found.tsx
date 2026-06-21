import { Link } from '@tanstack/react-router'
import { ShieldOff, Home, ArrowLeft } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { useAuth, ROLE_LABELS } from '#/lib/auth'

export function AccessDenied({ path }: { path?: string }) {
  const { user } = useAuth()
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-5 text-center max-w-sm mx-auto">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-destructive/10">
        <ShieldOff className="size-8 text-destructive" />
      </div>
      <div className="space-y-1.5">
        <h1 className="text-xl font-bold text-foreground">Access Restricted</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Your role <strong>{user ? ROLE_LABELS[user.role] : ''}</strong> does not have permission to access
          {path ? <> <code className="text-xs bg-muted px-1 py-0.5 rounded">{path}</code></> : ' this page'}.
        </p>
      </div>
      <Button variant="outline" size="sm" asChild>
        <Link to="/"><Home className="size-3.5 mr-1.5" />Back to Dashboard</Link>
      </Button>
    </div>
  )
}

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 text-center bg-background px-4">
      <div className="relative">
        <div className="text-[120px] font-black text-muted/30 leading-none select-none">404</div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl font-bold text-foreground">Page Not Found</div>
        </div>
      </div>
      <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
        The page you're looking for doesn't exist. It may have been moved, renamed, or you may have followed a broken link.
      </p>
      <div className="flex gap-3">
        <Button variant="outline" size="sm" onClick={() => window.history.back()}>
          <ArrowLeft className="size-3.5 mr-1.5" />Go Back
        </Button>
        <Button size="sm" asChild>
          <Link to="/"><Home className="size-3.5 mr-1.5" />Dashboard</Link>
        </Button>
      </div>
    </div>
  )
}
