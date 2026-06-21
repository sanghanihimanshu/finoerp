import { createFileRoute, Link } from '@tanstack/react-router'
import { Construction, ArrowLeft, Home } from 'lucide-react'
import { Button } from '#/components/ui/button'

export const Route = createFileRoute('/settings')({ component: SettingsPage })

function SettingsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 text-center max-w-md mx-auto">
      <div className="relative flex size-20 items-center justify-center rounded-2xl bg-primary/10">
        <Construction className="size-10 text-primary" />
        <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-amber-500 text-white text-[10px] font-bold">!</span>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Settings — Coming Soon</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The Settings module is currently under active development. It will include company profile, user management, RBAC configuration, approval workflow setup, and notification preferences.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 w-full text-left">
        {[
          'Company Profile & Branding',
          'User & Role Management',
          'Approval Workflow Config',
          'Notification Preferences',
          'Chart of Accounts Setup',
          'GST & TDS Rate Master',
        ].map((item) => (
          <div key={item} className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
            <span className="size-1.5 rounded-full bg-amber-400 shrink-0" />
            <span className="text-xs text-muted-foreground">{item}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Button variant="outline" size="sm" asChild>
          <Link to="/">
            <Home className="size-3.5 mr-1.5" />Dashboard
          </Link>
        </Button>
      </div>
    </div>
  )
}
