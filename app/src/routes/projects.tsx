import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'
import { Progress } from '#/components/ui/progress'
import { Separator } from '#/components/ui/separator'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '#/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '#/components/ui/alert-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  ArrowUpDown,
  HardHat,
  TrendingDown,
  Clock,
  CheckCircle2,
  Pencil,
  Trash2,
} from 'lucide-react'

export const Route = createFileRoute('/projects')({ component: ProjectsModule })

type Site = {
  id: string
  name: string
  client: string
  type: string
  status: string
  delayed: boolean
  budget: number
  spent: number
  progress: number
  material: number
  labour: number
  start: string
  end: string
}

const initialSites: Site[] = [
  { id: 'SITE-014', name: 'Skyline Towers', client: 'Apex Corp', type: 'Residential', status: 'Active', delayed: false, budget: 6000000, spent: 4500000, progress: 75, material: 2500000, labour: 1500000, start: '2023-01-15', end: '2024-12-30' },
  { id: 'SITE-015', name: 'Riverfront Villas', client: 'Lakeside Dev', type: 'Residential', status: 'Active', delayed: true, budget: 4000000, spent: 1200000, progress: 30, material: 800000, labour: 300000, start: '2023-06-01', end: '2025-06-01' },
  { id: 'SITE-016', name: 'Tech Park Phase 1', client: 'Innovate IT', type: 'Commercial', status: 'Planning', delayed: false, budget: 12000000, spent: 1000000, progress: 8, material: 500000, labour: 300000, start: '2024-03-01', end: '2026-03-01' },
  { id: 'SITE-012', name: 'Metro Hub', client: 'City Transit', type: 'Infrastructure', status: 'On Hold', delayed: true, budget: 8000000, spent: 8500000, progress: 100, material: 5000000, labour: 2500000, start: '2022-11-01', end: '2024-05-01' },
  { id: 'SITE-008', name: 'Greenwood Estate', client: 'Eco Homes', type: 'Residential', status: 'Completed', delayed: false, budget: 3500000, spent: 3380000, progress: 100, material: 1800000, labour: 1200000, start: '2021-02-10', end: '2023-08-15' },
]

const summaryStats = [
  { label: 'Active', icon: HardHat, color: 'text-primary', bg: 'bg-primary/8', key: 'Active' },
  { label: 'Planning', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50', key: 'Planning' },
  { label: 'Delayed', icon: TrendingDown, color: 'text-destructive', bg: 'bg-destructive/8', key: 'delayed' },
  { label: 'Completed', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', key: 'Completed' },
]

function fmt(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`
  if (n >= 100000) return `₹${(n / 100000).toFixed(0)}L`
  return `₹${n.toLocaleString('en-IN')}`
}

function StatusBadge({ status, delayed }: { status: string; delayed: boolean }) {
  if (status === 'Active' && !delayed)
    return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-semibold" variant="outline">Active</Badge>
  if (status === 'Active' && delayed)
    return <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] font-semibold" variant="outline">Delayed</Badge>
  if (status === 'Planning')
    return <Badge className="bg-primary/8 text-primary border-primary/20 text-[10px] font-semibold" variant="outline">Planning</Badge>
  if (status === 'On Hold')
    return <Badge variant="destructive" className="text-[10px] font-semibold">On Hold</Badge>
  if (status === 'Completed')
    return <Badge variant="secondary" className="text-[10px] font-semibold">Completed</Badge>
  return <Badge>{status}</Badge>
}

const emptyForm = (): Omit<Site, 'id'> => ({
  name: '', client: '', type: 'Residential', status: 'Planning',
  delayed: false, budget: 0, spent: 0, progress: 0,
  material: 0, labour: 0, start: '', end: '',
})

function ProjectForm({
  value,
  onChange,
}: {
  value: Omit<Site, 'id'>
  onChange: (v: Omit<Site, 'id'>) => void
}) {
  const set = (k: keyof typeof value, v: string | number | boolean) =>
    onChange({ ...value, [k]: v })

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2 flex flex-col gap-1.5">
        <Label className="text-xs">Project Name *</Label>
        <Input className="h-8 text-sm" value={value.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Skyline Tower B" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs">Client Name *</Label>
        <Input className="h-8 text-sm" value={value.client} onChange={(e) => set('client', e.target.value)} placeholder="e.g. Apex Corp" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs">Project Type</Label>
        <Select value={value.type} onValueChange={(v) => set('type', v)}>
          <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Residential">Residential</SelectItem>
            <SelectItem value="Commercial">Commercial</SelectItem>
            <SelectItem value="Infrastructure">Infrastructure</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs">Status</Label>
        <Select value={value.status} onValueChange={(v) => set('status', v)}>
          <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Planning">Planning</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="On Hold">On Hold</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs">Total Budget (₹)</Label>
        <Input className="h-8 text-sm" type="number" value={value.budget || ''} onChange={(e) => set('budget', Number(e.target.value))} placeholder="e.g. 6000000" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs">Start Date</Label>
        <Input className="h-8 text-sm" type="date" value={value.start} onChange={(e) => set('start', e.target.value)} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs">End Date</Label>
        <Input className="h-8 text-sm" type="date" value={value.end} onChange={(e) => set('end', e.target.value)} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs">Progress (%)</Label>
        <Input className="h-8 text-sm" type="number" min={0} max={100} value={value.progress || ''} onChange={(e) => set('progress', Number(e.target.value))} placeholder="0–100" />
      </div>
    </div>
  )
}

function ProjectsModule() {
  const [sites, setSites] = useState<Site[]>(initialSites)
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [editSite, setEditSite] = useState<Site | null>(null)
  const [deleteSite, setDeleteSite] = useState<Site | null>(null)
  const [form, setForm] = useState(emptyForm())

  const filtered = sites.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase()) ||
      s.client.toLowerCase().includes(search.toLowerCase())
  )

  const getCount = (key: string) => {
    if (key === 'delayed') return sites.filter((s) => s.delayed).length
    return sites.filter((s) => s.status === key).length
  }

  function handleAdd() {
    if (!form.name || !form.client) return
    const id = `SITE-${String(Math.floor(Math.random() * 900) + 100)}`
    setSites((prev) => [{ ...form, id }, ...prev])
    setShowAdd(false)
    setForm(emptyForm())
  }

  function handleEdit() {
    if (!editSite) return
    setSites((prev) => prev.map((s) => (s.id === editSite.id ? editSite : s)))
    setEditSite(null)
  }

  function handleDelete() {
    if (!deleteSite) return
    setSites((prev) => prev.filter((s) => s.id !== deleteSite.id))
    setDeleteSite(null)
  }

  return (
    <div className="flex flex-col gap-5 max-w-[1400px]">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Projects & Sites</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Track budgets, timelines, and progress across all sites.</p>
        </div>
        <Button size="sm" className="gap-1.5" onClick={() => { setForm(emptyForm()); setShowAdd(true) }}>
          <Plus className="size-3.5" />
          New Project
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {summaryStats.map((s) => (
          <Card key={s.label} className="shadow-none border-border">
            <CardContent className="flex items-center gap-3 p-4">
              <div className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${s.bg}`}>
                <s.icon className={`size-4 ${s.color}`} />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{getCount(s.key)}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card className="shadow-none border-border">
        <CardHeader className="flex flex-row items-center justify-between px-5 py-4">
          <CardTitle className="text-sm font-semibold">Site Registry</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input
                placeholder="Search sites..."
                className="w-52 pl-8 h-8 text-xs border-border bg-muted/30"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
              <Filter className="size-3.5" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  <button type="button" className="flex items-center gap-1">Site <ArrowUpDown className="size-3" /></button>
                </th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Client / Type</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Cost Split</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground w-52">Budget vs Actual</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Timeline</th>
                <th className="text-right px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-sm text-muted-foreground">No projects match your search.</td>
                </tr>
              )}
              {filtered.map((site) => {
                const overrun = site.spent > site.budget
                return (
                  <tr key={site.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-primary text-xs">{site.id}</div>
                      <div className="font-medium text-foreground text-sm mt-0.5">{site.name}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-foreground">{site.client}</div>
                      <div className="text-xs text-muted-foreground">{site.type}</div>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={site.status} delayed={site.delayed} />
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-xs text-muted-foreground space-y-0.5">
                        <div className="flex justify-between gap-4"><span>Mat</span><span className="font-medium text-foreground">{fmt(site.material)}</span></div>
                        <div className="flex justify-between gap-4"><span>Lab</span><span className="font-medium text-foreground">{fmt(site.labour)}</span></div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-between mb-1.5 text-xs">
                        <span className={`font-semibold ${overrun ? 'text-destructive' : 'text-foreground'}`}>{fmt(site.spent)}</span>
                        <span className="text-muted-foreground">{fmt(site.budget)}</span>
                      </div>
                      <Progress
                        value={Math.min((site.spent / site.budget) * 100, 100)}
                        className={`h-1.5 ${overrun ? '[&>div]:bg-destructive' : site.spent / site.budget > 0.85 ? '[&>div]:bg-amber-500' : '[&>div]:bg-primary'}`}
                      />
                      <div className="flex items-center justify-between mt-1 text-[10px] text-muted-foreground">
                        <span>{site.progress}% complete</span>
                        {overrun && <span className="text-destructive font-medium">Overrun</span>}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-xs text-foreground">{site.start}</div>
                      <div className="text-xs text-muted-foreground">→ {site.end}</div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost" size="icon" className="size-7"
                          onClick={() => setEditSite({ ...site })}
                          title="Edit"
                        >
                          <Pencil className="size-3.5 text-muted-foreground" />
                        </Button>
                        <Button
                          variant="ghost" size="icon" className="size-7"
                          onClick={() => setDeleteSite(site)}
                          title="Delete"
                        >
                          <Trash2 className="size-3.5 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>New Project</DialogTitle>
          </DialogHeader>
          <ProjectForm value={form} onChange={setForm} />
          <DialogFooter>
            <DialogClose asChild><Button variant="outline" size="sm">Cancel</Button></DialogClose>
            <Button size="sm" onClick={handleAdd} disabled={!form.name || !form.client}>Create Project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editSite} onOpenChange={(o) => !o && setEditSite(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Project — {editSite?.id}</DialogTitle>
          </DialogHeader>
          {editSite && (
            <ProjectForm
              value={editSite}
              onChange={(v) => setEditSite({ ...editSite, ...v })}
            />
          )}
          <DialogFooter>
            <DialogClose asChild><Button variant="outline" size="sm">Cancel</Button></DialogClose>
            <Button size="sm" onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteSite} onOpenChange={(o) => !o && setDeleteSite(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteSite?.id}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove <strong>{deleteSite?.name}</strong> from the system. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              onClick={handleDelete}
            >
              Delete Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
