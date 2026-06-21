import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'
import { Separator } from '#/components/ui/separator'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from '#/components/ui/dialog'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '#/components/ui/alert-dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '#/components/ui/select'
import { Avatar, AvatarFallback } from '#/components/ui/avatar'
import { DataTable, SortableHeader } from '#/components/ui/data-table'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus, Search, Users, HardHat, Calendar, CheckCircle2, Pencil, Trash2, Clock } from 'lucide-react'

export const Route = createFileRoute('/hr')({ component: HRModule })

type Employee = {
  id: string; name: string; role: string; site: string;
  joining: string; salary: number; present: boolean; leaves: number;
}
type Attendance = { id: number; date: string; site: string; contractor: string; total: number; present: number; absent: number }

const SITES = ['SITE-014', 'SITE-015', 'SITE-012', 'SITE-016', 'Central Godown', 'HO']
const ROLES = ['Site Engineer', 'Site Supervisor', 'Project Manager', 'Storekeeper', 'Billing Engineer', 'Accountant', 'HR Manager', 'Admin']

const initEmployees: Employee[] = [
  { id: 'EMP-001', name: 'Vikram Sharma', role: 'Site Engineer', site: 'SITE-014', joining: '2021-03-15', salary: 45000, present: true, leaves: 2 },
  { id: 'EMP-002', name: 'Sanjay Kumar', role: 'Site Supervisor', site: 'SITE-012', joining: '2020-07-01', salary: 32000, present: true, leaves: 5 },
  { id: 'EMP-003', name: 'Rahul Mehta', role: 'Storekeeper', site: 'Central Godown', joining: '2022-01-10', salary: 22000, present: false, leaves: 0 },
  { id: 'EMP-004', name: 'Priya Desai', role: 'Project Manager', site: 'SITE-015', joining: '2019-09-20', salary: 75000, present: true, leaves: 3 },
]
const initAttendance: Attendance[] = [
  { id: 1, date: '2024-06-19', site: 'SITE-014', contractor: 'Ramesh Labour Co.', total: 32, present: 30, absent: 2 },
  { id: 2, date: '2024-06-19', site: 'SITE-015', contractor: 'Direct Labour', total: 18, present: 16, absent: 2 },
  { id: 3, date: '2024-06-19', site: 'SITE-012', contractor: 'Singh Labour Co.', total: 45, present: 40, absent: 5 },
]

function initials(name: string) { return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() }

const emptyEmp = (): Omit<Employee, 'id'> => ({ name: '', role: ROLES[0], site: SITES[0], joining: '', salary: 0, present: true, leaves: 0 })
const emptyAtt = () => ({ site: SITES[0], contractor: '', total: 0, present: 0 })

function HRModule() {
  const [employees, setEmployees] = useState<Employee[]>(initEmployees)
  const [attendance, setAttendance] = useState<Attendance[]>(initAttendance)
  const [staffSearch, setStaffSearch] = useState('')
  const [attSearch, setAttSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [editEmp, setEditEmp] = useState<Employee | null>(null)
  const [deleteEmp, setDeleteEmp] = useState<Employee | null>(null)
  const [showAtt, setShowAtt] = useState(false)
  const [empForm, setEmpForm] = useState(emptyEmp())
  const [attForm, setAttForm] = useState(emptyAtt())

  function handleAddEmp() {
    if (!empForm.name) return
    const id = `EMP-${String(employees.length + 1).padStart(3, '0')}`
    setEmployees((prev) => [...prev, { ...empForm, id }])
    setShowAdd(false); setEmpForm(emptyEmp())
  }
  function handleEditEmp() {
    if (!editEmp) return
    setEmployees((prev) => prev.map((e) => e.id === editEmp.id ? editEmp : e))
    setEditEmp(null)
  }
  function togglePresent(id: string) {
    setEmployees((prev) => prev.map((e) => e.id === id ? { ...e, present: !e.present } : e))
  }
  function handleAddAtt() {
    if (!attForm.contractor || !attForm.total) return
    const absent = attForm.total - attForm.present
    setAttendance((prev) => [{ id: Date.now(), date: new Date().toISOString().slice(0, 10), site: attForm.site, contractor: attForm.contractor, total: attForm.total, present: attForm.present, absent }, ...prev])
    setShowAtt(false); setAttForm(emptyAtt())
  }

  const empCols = useMemo<ColumnDef<Employee>[]>(() => [
    {
      accessorKey: 'name',
      header: ({ column }) => <SortableHeader column={column} title="Employee" />,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar className="size-7 shrink-0"><AvatarFallback className="text-[10px] font-semibold bg-primary/10 text-primary">{initials(row.getValue('name'))}</AvatarFallback></Avatar>
          <div>
            <div className="font-medium text-xs">{row.getValue('name')}</div>
            <div className="text-[10px] text-muted-foreground font-mono">{row.original.id} · {row.original.joining}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'role',
      header: ({ column }) => <SortableHeader column={column} title="Role" />,
      cell: ({ row }) => <span className="text-xs">{row.getValue('role')}</span>,
    },
    {
      accessorKey: 'site',
      header: ({ column }) => <SortableHeader column={column} title="Site" />,
      cell: ({ row }) => <span className="text-xs text-primary font-medium">{row.getValue('site')}</span>,
    },
    {
      accessorKey: 'present',
      header: ({ column }) => <SortableHeader column={column} title="Today" />,
      cell: ({ row }) => (
        <button type="button" onClick={() => togglePresent(row.original.id)}>
          {row.original.present ? (
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] gap-1 cursor-pointer h-5 px-1.5" variant="outline">
              <span className="size-1.5 rounded-full bg-emerald-500 inline-block" />Present
            </Badge>
          ) : (
            <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] cursor-pointer h-5 px-1.5 gap-1" variant="outline">
              <Clock className="size-2.5" />Absent
            </Badge>
          )}
        </button>
      ),
    },
    {
      accessorKey: 'salary',
      header: ({ column }) => <SortableHeader column={column} title="Salary" />,
      cell: ({ row }) => <span className="text-xs font-mono font-semibold">₹{(row.getValue('salary') as number).toLocaleString('en-IN')}</span>,
    },
    {
      accessorKey: 'leaves',
      header: ({ column }) => <SortableHeader column={column} title="Leaves" />,
      cell: ({ row }) => <span className={`text-xs font-bold ${row.original.leaves === 0 ? 'text-destructive' : ''}`}>{row.original.leaves}d</span>,
    },
    {
      id: 'actions',
      header: () => null,
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="icon" className="size-6" onClick={() => setEditEmp({ ...row.original })}><Pencil className="size-3 text-muted-foreground" /></Button>
          <Button variant="ghost" size="icon" className="size-6" onClick={() => setDeleteEmp(row.original)}><Trash2 className="size-3 text-destructive" /></Button>
        </div>
      ),
    },
  ], [])

  const attCols = useMemo<ColumnDef<Attendance>[]>(() => [
    {
      accessorKey: 'date',
      header: ({ column }) => <SortableHeader column={column} title="Date" />,
      cell: ({ row }) => <span className="text-[10px] font-mono text-muted-foreground">{row.getValue('date')}</span>,
    },
    {
      accessorKey: 'site',
      header: ({ column }) => <SortableHeader column={column} title="Site" />,
      cell: ({ row }) => <span className="text-xs font-semibold text-primary">{row.getValue('site')}</span>,
    },
    {
      accessorKey: 'contractor',
      header: ({ column }) => <SortableHeader column={column} title="Contractor" />,
      cell: ({ row }) => <span className="text-xs">{row.getValue('contractor')}</span>,
    },
    {
      accessorKey: 'total',
      header: ({ column }) => <SortableHeader column={column} title="Total" />,
      cell: ({ row }) => <span className="text-xs font-mono font-medium">{row.getValue('total')}</span>,
    },
    {
      accessorKey: 'present',
      header: ({ column }) => <SortableHeader column={column} title="Present" />,
      cell: ({ row }) => <span className="text-xs font-mono font-bold text-emerald-600">{row.getValue('present')}</span>,
    },
    {
      accessorKey: 'absent',
      header: ({ column }) => <SortableHeader column={column} title="Absent" />,
      cell: ({ row }) => <span className="text-xs font-mono font-bold text-destructive">{row.getValue('absent')}</span>,
    },
    {
      id: 'pct',
      header: () => <span className="text-[11px] font-semibold uppercase tracking-wide">%</span>,
      cell: ({ row }) => {
        const pct = Math.round((row.original.present / row.original.total) * 100)
        return <span className={`text-xs font-bold ${pct >= 90 ? 'text-emerald-600' : pct >= 75 ? 'text-amber-500' : 'text-destructive'}`}>{pct}%</span>
      },
    },
  ], [])

  function EmpForm({ value, onChange }: { value: typeof empForm; onChange: (v: typeof empForm) => void }) {
    const s = (k: keyof typeof value, v: string | number | boolean) => onChange({ ...value, [k]: v })
    return (
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 flex flex-col gap-1.5"><Label className="text-xs">Full Name *</Label><Input className="h-8 text-sm" value={value.name} onChange={(e) => s('name', e.target.value)} placeholder="e.g. Rahul Sharma" /></div>
        <div className="flex flex-col gap-1.5"><Label className="text-xs">Role</Label><Select value={value.role} onValueChange={(v) => s('role', v)}><SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger><SelectContent>{ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent></Select></div>
        <div className="flex flex-col gap-1.5"><Label className="text-xs">Site Assignment</Label><Select value={value.site} onValueChange={(v) => s('site', v)}><SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger><SelectContent>{SITES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
        <div className="flex flex-col gap-1.5"><Label className="text-xs">Joining Date</Label><Input className="h-8 text-sm" type="date" value={value.joining} onChange={(e) => s('joining', e.target.value)} /></div>
        <div className="flex flex-col gap-1.5"><Label className="text-xs">Monthly Salary (₹)</Label><Input className="h-8 text-sm" type="number" value={value.salary || ''} onChange={(e) => s('salary', Number(e.target.value))} /></div>
        <div className="flex flex-col gap-1.5"><Label className="text-xs">Leave Balance (days)</Label><Input className="h-8 text-sm" type="number" value={value.leaves || ''} onChange={(e) => s('leaves', Number(e.target.value))} /></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5 max-w-350">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">HR & Labour Management</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage staff, site labour attendance, and payroll.</p>
        </div>
        <Button size="sm" className="gap-1.5 h-8 text-xs" onClick={() => { setEmpForm(emptyEmp()); setShowAdd(true) }}>
          <Plus className="size-3.5" />Add Employee
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card className="shadow-none border-border"><CardContent className="flex items-center gap-3 p-3"><div className="flex size-8 items-center justify-center rounded bg-primary/10"><Users className="size-4 text-primary" /></div><div className="flex flex-col leading-tight"><div className="text-lg font-bold">{employees.length}</div><div className="text-[10px] uppercase font-semibold text-muted-foreground">Total Staff</div></div></CardContent></Card>
        <Card className="shadow-none border-border"><CardContent className="flex items-center gap-3 p-3"><div className="flex size-8 items-center justify-center rounded bg-emerald-50"><CheckCircle2 className="size-4 text-emerald-600" /></div><div className="flex flex-col leading-tight"><div className="text-lg font-bold text-emerald-600">{employees.filter((e) => e.present).length}</div><div className="text-[10px] uppercase font-semibold text-muted-foreground">Present Today</div></div></CardContent></Card>
        <Card className="shadow-none border-border"><CardContent className="flex items-center gap-3 p-3"><div className="flex size-8 items-center justify-center rounded bg-amber-50"><HardHat className="size-4 text-amber-600" /></div><div className="flex flex-col leading-tight"><div className="text-lg font-bold text-amber-600">{attendance.reduce((a, b) => a + b.present, 0)}</div><div className="text-[10px] uppercase font-semibold text-muted-foreground">Site Labour Today</div></div></CardContent></Card>
        <Card className="shadow-none border-border"><CardContent className="flex items-center gap-3 p-3"><div className="flex size-8 items-center justify-center rounded bg-muted"><Calendar className="size-4 text-muted-foreground" /></div><div className="flex flex-col leading-tight"><div className="text-lg font-bold">₹{(employees.reduce((a, b) => a + b.salary, 0) / 100000).toFixed(1)}L</div><div className="text-[10px] uppercase font-semibold text-muted-foreground">Payroll (Month)</div></div></CardContent></Card>
      </div>

      <Tabs defaultValue="staff">
        <TabsList className="h-8">
          <TabsTrigger value="staff" className="text-xs">Staff Directory ({employees.length})</TabsTrigger>
          <TabsTrigger value="attendance" className="text-xs">Labour Attendance</TabsTrigger>
        </TabsList>

        <TabsContent value="staff" className="mt-4">
          <Card className="shadow-none border-border">
            <CardHeader className="flex flex-row items-center justify-between p-3">
              <CardTitle className="text-sm font-semibold">Employee Directory</CardTitle>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <Input placeholder="Search name or role..." className="w-48 pl-8 h-7 text-xs" value={staffSearch} onChange={(e) => setStaffSearch(e.target.value)} />
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="p-0 border-b-0">
              <DataTable columns={empCols} data={employees} externalFilter={staffSearch} onExternalFilterChange={setStaffSearch} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="mt-4">
          <Card className="shadow-none border-border">
            <CardHeader className="flex flex-row items-center justify-between p-3">
              <CardTitle className="text-sm font-semibold">Daily Labour Attendance</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  <Input placeholder="Search attendance..." className="w-44 pl-8 h-7 text-xs" value={attSearch} onChange={(e) => setAttSearch(e.target.value)} />
                </div>
                <Button size="sm" className="gap-1.5 h-7 text-xs" onClick={() => { setAttForm(emptyAtt()); setShowAtt(true) }}>
                  <Plus className="size-3.5" />Mark Attendance
                </Button>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="p-0 border-b-0">
              <DataTable columns={attCols} data={attendance} externalFilter={attSearch} onExternalFilterChange={setAttSearch} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-md"><DialogHeader><DialogTitle>Add Employee</DialogTitle></DialogHeader>
          <EmpForm value={empForm} onChange={setEmpForm} />
          <DialogFooter><DialogClose asChild><Button variant="outline" size="sm">Cancel</Button></DialogClose><Button size="sm" onClick={handleAddEmp} disabled={!empForm.name}>Add Employee</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editEmp} onOpenChange={(o) => !o && setEditEmp(null)}>
        <DialogContent className="max-w-md"><DialogHeader><DialogTitle>Edit — {editEmp?.id}</DialogTitle></DialogHeader>
          {editEmp && <EmpForm value={editEmp} onChange={(v) => setEditEmp({ ...editEmp, ...v })} />}
          <DialogFooter><DialogClose asChild><Button variant="outline" size="sm">Cancel</Button></DialogClose><Button size="sm" onClick={handleEditEmp}>Save Changes</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteEmp} onOpenChange={(o) => !o && setDeleteEmp(null)}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Remove {deleteEmp?.id}?</AlertDialogTitle><AlertDialogDescription>This will remove <strong>{deleteEmp?.name}</strong> from the system.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction className="bg-destructive hover:bg-destructive/90 text-destructive-foreground" onClick={() => { if (deleteEmp) { setEmployees((e) => e.filter((emp) => emp.id !== deleteEmp.id)); setDeleteEmp(null) } }}>Remove</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showAtt} onOpenChange={setShowAtt}>
        <DialogContent className="max-w-sm"><DialogHeader><DialogTitle>Mark Labour Attendance</DialogTitle></DialogHeader>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5"><Label className="text-xs">Site</Label><Select value={attForm.site} onValueChange={(v) => setAttForm({ ...attForm, site: v })}><SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger><SelectContent>{SITES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
            <div className="flex flex-col gap-1.5"><Label className="text-xs">Contractor / Labour Type *</Label><Input className="h-8 text-sm" value={attForm.contractor} onChange={(e) => setAttForm({ ...attForm, contractor: e.target.value })} placeholder="e.g. Ramesh Labour Co." /></div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1.5"><Label className="text-xs">Total Labour *</Label><Input className="h-8 text-sm" type="number" value={attForm.total || ''} onChange={(e) => setAttForm({ ...attForm, total: Number(e.target.value) })} /></div>
              <div className="flex flex-col gap-1.5"><Label className="text-xs">Present Today *</Label><Input className="h-8 text-sm" type="number" value={attForm.present || ''} onChange={(e) => setAttForm({ ...attForm, present: Number(e.target.value) })} max={attForm.total} /></div>
            </div>
          </div>
          <DialogFooter><DialogClose asChild><Button variant="outline" size="sm">Cancel</Button></DialogClose><Button size="sm" onClick={handleAddAtt} disabled={!attForm.contractor || !attForm.total}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
