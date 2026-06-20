import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'
import { Separator } from '#/components/ui/separator'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Switch } from '#/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '#/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '#/components/ui/alert-dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '#/components/ui/select'
import { Avatar, AvatarFallback } from '#/components/ui/avatar'
import { Plus, Pencil, Trash2, Shield, Users, Building2, Bell, CheckCircle2, XCircle, Search } from 'lucide-react'

export const Route = createFileRoute('/settings')({ component: SettingsModule })

// ─── Types ───────────────────────────────────────────────────────────────────
type Role = 'Admin' | 'Project Manager' | 'Site Engineer' | 'Procurement Officer' | 'Accountant' | 'HR Manager' | 'Viewer'
type User = { id: string; name: string; email: string; role: Role; active: boolean; joined: string }

const ROLES: Role[] = ['Admin', 'Project Manager', 'Site Engineer', 'Procurement Officer', 'Accountant', 'HR Manager', 'Viewer']

// Permission matrix: module → role → can read / write / delete
const MODULES = ['Projects', 'Materials', 'Procurement', 'Finance & Cost', 'Documents', 'Approvals', 'HR & Labour']

type Perm = { read: boolean; write: boolean; delete: boolean }
type PermMatrix = Record<Role, Record<string, Perm>>

const defaultMatrix: PermMatrix = {
  Admin: Object.fromEntries(MODULES.map((m) => [m, { read: true, write: true, delete: true }])) as Record<string, Perm>,
  'Project Manager': Object.fromEntries(MODULES.map((m) => [m, { read: true, write: ['Projects', 'Materials', 'Documents', 'Approvals'].includes(m), delete: false }])) as Record<string, Perm>,
  'Site Engineer': Object.fromEntries(MODULES.map((m) => [m, { read: ['Projects', 'Materials', 'Documents'].includes(m), write: ['Materials'].includes(m), delete: false }])) as Record<string, Perm>,
  'Procurement Officer': Object.fromEntries(MODULES.map((m) => [m, { read: ['Materials', 'Procurement', 'Finance & Cost'].includes(m), write: ['Procurement'].includes(m), delete: false }])) as Record<string, Perm>,
  Accountant: Object.fromEntries(MODULES.map((m) => [m, { read: ['Finance & Cost', 'Procurement', 'Approvals'].includes(m), write: ['Finance & Cost'].includes(m), delete: false }])) as Record<string, Perm>,
  'HR Manager': Object.fromEntries(MODULES.map((m) => [m, { read: ['HR & Labour', 'Projects'].includes(m), write: ['HR & Labour'].includes(m), delete: false }])) as Record<string, Perm>,
  Viewer: Object.fromEntries(MODULES.map((m) => [m, { read: true, write: false, delete: false }])) as Record<string, Perm>,
}

const initUsers: User[] = [
  { id: 'USR-001', name: 'Amit Director', email: 'amit@finoerp.in', role: 'Admin', active: true, joined: '2019-01-01' },
  { id: 'USR-002', name: 'Vikram Sharma', email: 'vikram@finoerp.in', role: 'Site Engineer', active: true, joined: '2021-03-15' },
  { id: 'USR-003', name: 'Priya Desai', email: 'priya@finoerp.in', role: 'Project Manager', active: true, joined: '2019-09-20' },
  { id: 'USR-004', name: 'Suresh Patel', email: 'suresh@finoerp.in', role: 'Accountant', active: true, joined: '2023-04-05' },
  { id: 'USR-005', name: 'Rahul Mehta', email: 'rahul@finoerp.in', role: 'Procurement Officer', active: false, joined: '2022-01-10' },
]

const ROLE_COLORS: Record<Role, string> = {
  Admin: 'bg-destructive/10 text-destructive border-destructive/20',
  'Project Manager': 'bg-primary/8 text-primary border-primary/20',
  'Site Engineer': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Procurement Officer': 'bg-amber-50 text-amber-700 border-amber-200',
  Accountant: 'bg-violet-50 text-violet-700 border-violet-200',
  'HR Manager': 'bg-cyan-50 text-cyan-700 border-cyan-200',
  Viewer: 'bg-muted text-muted-foreground border-border',
}

function initials(n: string) { return n.split(' ').map((x) => x[0]).join('').slice(0, 2).toUpperCase() }

// ─── Settings page ────────────────────────────────────────────────────────────
function SettingsModule() {
  const [users, setUsers] = useState<User[]>(initUsers)
  const [matrix] = useState<PermMatrix>(defaultMatrix)
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [editUser, setEditUser] = useState<User | null>(null)
  const [deleteUser, setDeleteUser] = useState<User | null>(null)
  const [selectedRole, setSelectedRole] = useState<Role>('Admin')
  const [form, setForm] = useState({ name: '', email: '', role: 'Viewer' as Role })

  // Company settings state
  const [company, setCompany] = useState({ name: 'FinoERP Construction', gstin: '27AABCF1234M1Z5', email: 'admin@finoerp.in', phone: '+91 98765 43210', address: 'Mumbai, Maharashtra' })

  // Notification toggles
  const [notifs, setNotifs] = useState({ lowStock: true, approvalPending: true, budgetOverrun: true, docExpiry: true, paymentDue: false })

  const filtered = users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))

  function handleAdd() {
    if (!form.name || !form.email) return
    const id = `USR-${String(users.length + 1).padStart(3, '0')}`
    setUsers((p) => [...p, { ...form, id, active: true, joined: new Date().toISOString().slice(0, 10) }])
    setShowAdd(false); setForm({ name: '', email: '', role: 'Viewer' })
  }
  function handleEdit() {
    if (!editUser) return
    setUsers((p) => p.map((u) => u.id === editUser.id ? editUser : u))
    setEditUser(null)
  }
  function toggleActive(id: string) {
    setUsers((p) => p.map((u) => u.id === id ? { ...u, active: !u.active } : u))
  }

  const perms = matrix[selectedRole]

  return (
    <div className="flex flex-col gap-5 max-w-[1200px]">
      <div>
        <h1 className="text-xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage company info, users, roles, and permissions.</p>
      </div>

      <Tabs defaultValue="users">
        <TabsList className="h-8">
          <TabsTrigger value="users" className="text-xs gap-1.5"><Users className="size-3" />Users & Access</TabsTrigger>
          <TabsTrigger value="rbac" className="text-xs gap-1.5"><Shield className="size-3" />Role Permissions</TabsTrigger>
          <TabsTrigger value="company" className="text-xs gap-1.5"><Building2 className="size-3" />Company</TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs gap-1.5"><Bell className="size-3" />Notifications</TabsTrigger>
        </TabsList>

        {/* ── Users Tab ─────────────────────────────── */}
        <TabsContent value="users" className="mt-4">
          <Card className="shadow-none border-border">
            <CardHeader className="flex flex-row items-center justify-between px-5 py-4">
              <div>
                <CardTitle className="text-sm font-semibold">System Users</CardTitle>
                <CardDescription className="text-xs mt-0.5">Manage who has access to FinoERP and their roles.</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  <Input placeholder="Search users..." className="w-48 pl-8 h-8 text-xs" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <Button size="sm" className="gap-1.5 h-8 text-xs" onClick={() => { setForm({ name: '', email: '', role: 'Viewer' }); setShowAdd(true) }}>
                  <Plus className="size-3.5" />Invite User
                </Button>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/20">
                    <th className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">User</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Role</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Joined</th>
                    <th className="text-center px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Active</th>
                    <th className="text-right px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => (
                    <tr key={u.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="size-8 shrink-0">
                            <AvatarFallback className={`text-[11px] font-semibold ${u.active ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>{initials(u.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-sm text-foreground">{u.name}</div>
                            <div className="text-[10px] text-muted-foreground">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={`text-[10px] font-semibold ${ROLE_COLORS[u.role]}`}>{u.role}</Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground font-mono">{u.joined}</td>
                      <td className="px-4 py-3 text-center">
                        <Switch checked={u.active} onCheckedChange={() => toggleActive(u.id)} className="scale-75" />
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="size-7" onClick={() => setEditUser({ ...u })}><Pencil className="size-3.5 text-muted-foreground" /></Button>
                          <Button variant="ghost" size="icon" className="size-7" disabled={u.role === 'Admin'} onClick={() => setDeleteUser(u)}><Trash2 className="size-3.5 text-destructive" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── RBAC Tab ──────────────────────────────── */}
        <TabsContent value="rbac" className="mt-4 flex flex-col gap-4">
          <Card className="shadow-none border-border">
            <CardHeader className="px-5 py-4">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Shield className="size-4 text-primary" />Role-Based Access Control (RBAC)
              </CardTitle>
              <CardDescription className="text-xs">Select a role to view and configure its module permissions.</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="p-5">
              {/* Role selector pills */}
              <div className="flex flex-wrap gap-2 mb-5">
                {ROLES.map((r) => (
                  <button key={r} type="button"
                    onClick={() => setSelectedRole(r)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-all ${selectedRole === r ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted/40 text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'}`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              {/* Permission matrix */}
              <div className="rounded-lg border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/30 border-b border-border">
                      <th className="text-left px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground w-48">Module</th>
                      <th className="text-center px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">View</th>
                      <th className="text-center px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Create / Edit</th>
                      <th className="text-center px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MODULES.map((mod, i) => {
                      const p = perms[mod]
                      return (
                        <tr key={mod} className={`border-b border-border/50 ${i % 2 === 0 ? 'bg-white' : 'bg-muted/10'}`}>
                          <td className="px-4 py-3 text-sm font-medium text-foreground">{mod}</td>
                          <td className="px-4 py-3 text-center">
                            {p.read ? <CheckCircle2 className="size-4 text-emerald-500 mx-auto" /> : <XCircle className="size-4 text-destructive/40 mx-auto" />}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {p.write ? <CheckCircle2 className="size-4 text-emerald-500 mx-auto" /> : <XCircle className="size-4 text-destructive/40 mx-auto" />}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {p.delete ? <CheckCircle2 className="size-4 text-emerald-500 mx-auto" /> : <XCircle className="size-4 text-destructive/40 mx-auto" />}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              <p className="text-xs text-muted-foreground mt-3 italic">
                * Permissions are enforced at API level. Contact Admin to modify role definitions.
              </p>
            </CardContent>
          </Card>

          {/* Role summary cards */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {([['Admin', 'Full system access — all modules, all actions.'],
               ['Project Manager', 'Manage projects, approve docs, view finance.'],
               ['Site Engineer', 'View projects, log material movements.'],
               ['Viewer', 'Read-only access to all modules.']] as [Role, string][]).map(([role, desc]) => (
              <Card key={role} className={`shadow-none border cursor-pointer transition-all ${selectedRole === role ? 'border-primary ring-1 ring-primary/20' : 'border-border hover:border-primary/30'}`}
                onClick={() => setSelectedRole(role)}>
                <CardContent className="p-4">
                  <Badge variant="outline" className={`text-[10px] font-semibold mb-2 ${ROLE_COLORS[role]}`}>{role}</Badge>
                  <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                  <div className="mt-2 text-[10px] font-semibold text-muted-foreground">{users.filter((u) => u.role === role).length} user(s)</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ── Company Tab ───────────────────────────── */}
        <TabsContent value="company" className="mt-4">
          <Card className="shadow-none border-border">
            <CardHeader className="px-5 py-4">
              <CardTitle className="text-sm font-semibold">Company Profile</CardTitle>
              <CardDescription className="text-xs">Used across documents, invoices, and reports.</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="p-5 grid grid-cols-2 gap-4">
              {([['name', 'Company Name', 'text'], ['gstin', 'GSTIN', 'text'], ['email', 'Primary Email', 'email'], ['phone', 'Phone', 'tel'], ['address', 'Registered Address', 'text']] as [keyof typeof company, string, string][]).map(([key, label, type]) => (
                <div key={key} className={`flex flex-col gap-1.5 ${key === 'address' ? 'col-span-2' : ''}`}>
                  <Label className="text-xs">{label}</Label>
                  <Input className="h-8 text-sm" type={type} value={company[key]} onChange={(e) => setCompany({ ...company, [key]: e.target.value })} />
                </div>
              ))}
              <div className="col-span-2 flex justify-end pt-2">
                <Button size="sm" className="h-8 text-xs">Save Company Details</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Notifications Tab ─────────────────────── */}
        <TabsContent value="notifications" className="mt-4">
          <Card className="shadow-none border-border">
            <CardHeader className="px-5 py-4">
              <CardTitle className="text-sm font-semibold">Notification Preferences</CardTitle>
              <CardDescription className="text-xs">Control which system events trigger in-app alerts.</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="p-5 flex flex-col gap-0">
              {([
                ['lowStock', 'Low Stock Alerts', 'Notify when a material falls below reorder level.'],
                ['approvalPending', 'Pending Approvals', 'Notify approvers when items are waiting for sign-off.'],
                ['budgetOverrun', 'Budget Overrun Alerts', 'Notify when a project exceeds its sanctioned budget.'],
                ['docExpiry', 'Document Expiry Warnings', 'Alert 30 days before a permit or licence expires.'],
                ['paymentDue', 'Payment Due Reminders', 'Notify when vendor payments are approaching due date.'],
              ] as [keyof typeof notifs, string, string][]).map(([key, title, desc], i, arr) => (
                <div key={key} className={`flex items-center justify-between py-4 ${i < arr.length - 1 ? 'border-b border-border/50' : ''}`}>
                  <div>
                    <div className="text-sm font-medium text-foreground">{title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
                  </div>
                  <Switch checked={notifs[key]} onCheckedChange={(v) => setNotifs({ ...notifs, [key]: v })} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ── Dialogs ───────────────────────────────────────────────────────── */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Invite User</DialogTitle></DialogHeader>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5"><Label className="text-xs">Full Name *</Label><Input className="h-8 text-sm" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Rahul Sharma" /></div>
            <div className="flex flex-col gap-1.5"><Label className="text-xs">Email *</Label><Input className="h-8 text-sm" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="rahul@company.com" /></div>
            <div className="flex flex-col gap-1.5"><Label className="text-xs">Assign Role</Label>
              <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as Role })}>
                <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>{ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline" size="sm">Cancel</Button></DialogClose>
            <Button size="sm" onClick={handleAdd} disabled={!form.name || !form.email}>Send Invite</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editUser} onOpenChange={(o) => !o && setEditUser(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Edit User — {editUser?.id}</DialogTitle></DialogHeader>
          {editUser && (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5"><Label className="text-xs">Full Name</Label><Input className="h-8 text-sm" value={editUser.name} onChange={(e) => setEditUser({ ...editUser, name: e.target.value })} /></div>
              <div className="flex flex-col gap-1.5"><Label className="text-xs">Email</Label><Input className="h-8 text-sm" type="email" value={editUser.email} onChange={(e) => setEditUser({ ...editUser, email: e.target.value })} /></div>
              <div className="flex flex-col gap-1.5"><Label className="text-xs">Role</Label>
                <Select value={editUser.role} onValueChange={(v) => setEditUser({ ...editUser, role: v as Role })}>
                  <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>{ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild><Button variant="outline" size="sm">Cancel</Button></DialogClose>
            <Button size="sm" onClick={handleEdit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteUser} onOpenChange={(o) => !o && setDeleteUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {deleteUser?.name}?</AlertDialogTitle>
            <AlertDialogDescription>This will revoke their access to FinoERP immediately.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive hover:bg-destructive/90 text-destructive-foreground" onClick={() => { if (deleteUser) { setUsers((u) => u.filter((x) => x.id !== deleteUser.id)); setDeleteUser(null) } }}>Remove User</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
