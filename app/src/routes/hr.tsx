import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
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

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
}

const emptyEmp = (): Omit<Employee, 'id'> => ({
  name: '', role: ROLES[0], site: SITES[0], joining: '', salary: 0, present: true, leaves: 0,
})
const emptyAtt = () => ({ site: SITES[0], contractor: '', total: 0, present: 0 })

function HRModule() {
  const [employees, setEmployees] = useState<Employee[]>(initEmployees)
  const [attendance, setAttendance] = useState<Attendance[]>(initAttendance)
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [editEmp, setEditEmp] = useState<Employee | null>(null)
  const [deleteEmp, setDeleteEmp] = useState<Employee | null>(null)
  const [showAtt, setShowAtt] = useState(false)
  const [empForm, setEmpForm] = useState(emptyEmp())
  const [attForm, setAttForm] = useState(emptyAtt())

  const filtered = employees.filter(
    (e) => e.name.toLowerCase().includes(search.toLowerCase()) || e.role.toLowerCase().includes(search.toLowerCase())
  )

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
    setAttendance((prev) => [{
      id: Date.now(), date: new Date().toISOString().slice(0, 10),
      site: attForm.site, contractor: attForm.contractor,
      total: attForm.total, present: attForm.present, absent,
    }, ...prev])
    setShowAtt(false); setAttForm(emptyAtt())
  }

  function EmpForm({ value, onChange }: { value: typeof empForm; onChange: (v: typeof empForm) => void }) {
    const s = (k: keyof typeof value, v: string | number | boolean) => onChange({ ...value, [k]: v })
    return (
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 flex flex-col gap-1.5">
          <Label className="text-xs">Full Name *</Label>
          <Input className="h-8 text-sm" value={value.name} onChange={(e) => s('name', e.target.value)} placeholder="e.g. Rahul Sharma" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs">Role</Label>
          <Select value={value.role} onValueChange={(v) => s('role', v)}>
            <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>{ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs">Site Assignment</Label>
          <Select value={value.site} onValueChange={(v) => s('site', v)}>
            <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>{SITES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs">Joining Date</Label>
          <Input className="h-8 text-sm" type="date" value={value.joining} onChange={(e) => s('joining', e.target.value)} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs">Monthly Salary (₹)</Label>
          <Input className="h-8 text-sm" type="number" value={value.salary || ''} onChange={(e) => s('salary', Number(e.target.value))} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs">Leave Balance (days)</Label>
          <Input className="h-8 text-sm" type="number" value={value.leaves || ''} onChange={(e) => s('leaves', Number(e.target.value))} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5 max-w-[1400px]">
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
        <Card className="shadow-none border-border"><CardContent className="flex items-center gap-3 p-4"><div className="flex size-9 items-center justify-center rounded-lg bg-primary/8"><Users className="size-4 text-primary" /></div><div><div className="text-2xl font-bold">{employees.length}</div><div className="text-xs text-muted-foreground">Total Staff</div></div></CardContent></Card>
        <Card className="shadow-none border-border"><CardContent className="flex items-center gap-3 p-4"><div className="flex size-9 items-center justify-center rounded-lg bg-emerald-50"><CheckCircle2 className="size-4 text-emerald-600" /></div><div><div className="text-2xl font-bold text-emerald-600">{employees.filter((e) => e.present).length}</div><div className="text-xs text-muted-foreground">Present Today</div></div></CardContent></Card>
        <Card className="shadow-none border-border"><CardContent className="flex items-center gap-3 p-4"><div className="flex size-9 items-center justify-center rounded-lg bg-amber-50"><HardHat className="size-4 text-amber-500" /></div><div><div className="text-2xl font-bold">{attendance.reduce((a, b) => a + b.present, 0)}</div><div className="text-xs text-muted-foreground">Site Labour Today</div></div></CardContent></Card>
        <Card className="shadow-none border-border"><CardContent className="flex items-center gap-3 p-4"><div className="flex size-9 items-center justify-center rounded-lg bg-muted"><Calendar className="size-4 text-muted-foreground" /></div><div><div className="text-2xl font-bold">₹{(employees.reduce((a, b) => a + b.salary, 0) / 100000).toFixed(1)}L</div><div className="text-xs text-muted-foreground">Payroll (Month)</div></div></CardContent></Card>
      </div>

      <Tabs defaultValue="staff">
        <TabsList className="h-8">
          <TabsTrigger value="staff" className="text-xs">Staff Directory ({employees.length})</TabsTrigger>
          <TabsTrigger value="attendance" className="text-xs">Labour Attendance</TabsTrigger>
        </TabsList>

        <TabsContent value="staff" className="mt-4">
          <Card className="shadow-none border-border">
            <CardHeader className="flex flex-row items-center justify-between px-5 py-4">
              <CardTitle className="text-sm font-semibold">Employee Directory</CardTitle>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <Input placeholder="Search name or role..." className="w-52 pl-8 h-8 text-xs" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/20">
                    <th className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Employee</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Role</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Site</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Today</th>
                    <th className="text-right px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Salary</th>
                    <th className="text-right px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Leaves</th>
                    <th className="text-right px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && <tr><td colSpan={7} className="py-8 text-center text-sm text-muted-foreground">No employees found.</td></tr>}
                  {filtered.map((emp) => (
                    <tr key={emp.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="size-8 shrink-0"><AvatarFallback className="text-[11px] font-semibold bg-primary/10 text-primary">{initials(emp.name)}</AvatarFallback></Avatar>
                          <div><div className="font-medium text-sm">{emp.name}</div><div className="text-[10px] text-muted-foreground font-mono">{emp.id} · {emp.joining}</div></div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">{emp.role}</td>
                      <td className="px-4 py-3 text-sm text-primary font-medium">{emp.site}</td>
                      <td className="px-4 py-3">
                        <button type="button" onClick={() => togglePresent(emp.id)}>
                          {emp.present ? (
                            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] gap-1 cursor-pointer" variant="outline">
                              <span className="size-1.5 rounded-full bg-emerald-500 inline-block" />Present
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] cursor-pointer" variant="outline">
                              <Clock className="size-2.5" />Absent
                            </Badge>
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-semibold">₹{emp.salary.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-right"><span className={`text-sm font-bold ${emp.leaves === 0 ? 'text-destructive' : ''}`}>{emp.leaves}d</span></td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="size-7" onClick={() => setEditEmp({ ...emp })}><Pencil className="size-3.5 text-muted-foreground" /></Button>
                          <Button variant="ghost" size="icon" className="size-7" onClick={() => setDeleteEmp(emp)}><Trash2 className="size-3.5 text-destructive" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="mt-4">
          <Card className="shadow-none border-border">
            <CardHeader className="flex flex-row items-center justify-between px-5 py-4">
              <CardTitle className="text-sm font-semibold">Daily Labour Attendance</CardTitle>
              <Button size="sm" className="gap-1.5 h-8 text-xs" onClick={() => { setAttForm(emptyAtt()); setShowAtt(true) }}>
                <Plus className="size-3.5" />Mark Attendance
              </Button>
            </CardHeader>
            <Separator />
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/20">
                    <th className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Date</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Site</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Contractor</th>
                    <th className="text-right px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Total</th>
                    <th className="text-right px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Present</th>
                    <th className="text-right px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Absent</th>
                    <th className="text-right px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">%</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((a) => {
                    const pct = Math.round((a.present / a.total) * 100)
                    return (
                      <tr key={a.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                        <td className="px-5 py-4 text-xs font-mono text-muted-foreground">{a.date}</td>
                        <td className="px-4 py-4 text-sm font-semibold text-primary">{a.site}</td>
                        <td className="px-4 py-4 text-sm">{a.contractor}</td>
                        <td className="px-4 py-4 text-right text-sm font-medium">{a.total}</td>
                        <td className="px-4 py-4 text-right text-sm font-bold text-emerald-600">{a.present}</td>
                        <td className="px-4 py-4 text-right text-sm font-bold text-destructive">{a.absent}</td>
                        <td className="px-5 py-4 text-right">
                          <span className={`text-sm font-bold ${pct >= 90 ? 'text-emerald-600' : pct >= 75 ? 'text-amber-500' : 'text-destructive'}`}>{pct}%</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Employee */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Add Employee</DialogTitle></DialogHeader>
          <EmpForm value={empForm} onChange={setEmpForm} />
          <DialogFooter>
            <DialogClose asChild><Button variant="outline" size="sm">Cancel</Button></DialogClose>
            <Button size="sm" onClick={handleAddEmp} disabled={!empForm.name}>Add Employee</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Employee */}
      <Dialog open={!!editEmp} onOpenChange={(o) => !o && setEditEmp(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Edit — {editEmp?.id}</DialogTitle></DialogHeader>
          {editEmp && <EmpForm value={editEmp} onChange={(v) => setEditEmp({ ...editEmp, ...v })} />}
          <DialogFooter>
            <DialogClose asChild><Button variant="outline" size="sm">Cancel</Button></DialogClose>
            <Button size="sm" onClick={handleEditEmp}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Employee */}
      <AlertDialog open={!!deleteEmp} onOpenChange={(o) => !o && setDeleteEmp(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {deleteEmp?.id}?</AlertDialogTitle>
            <AlertDialogDescription>This will remove <strong>{deleteEmp?.name}</strong> from the system.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive hover:bg-destructive/90 text-destructive-foreground" onClick={() => { if (deleteEmp) { setEmployees((e) => e.filter((emp) => emp.id !== deleteEmp.id)); setDeleteEmp(null) } }}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Mark Attendance */}
      <Dialog open={showAtt} onOpenChange={setShowAtt}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Mark Labour Attendance</DialogTitle></DialogHeader>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5"><Label className="text-xs">Site</Label>
              <Select value={attForm.site} onValueChange={(v) => setAttForm({ ...attForm, site: v })}>
                <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>{SITES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5"><Label className="text-xs">Contractor / Labour Type *</Label><Input className="h-8 text-sm" value={attForm.contractor} onChange={(e) => setAttForm({ ...attForm, contractor: e.target.value })} placeholder="e.g. Ramesh Labour Co." /></div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1.5"><Label className="text-xs">Total Labour *</Label><Input className="h-8 text-sm" type="number" value={attForm.total || ''} onChange={(e) => setAttForm({ ...attForm, total: Number(e.target.value) })} /></div>
              <div className="flex flex-col gap-1.5"><Label className="text-xs">Present Today *</Label><Input className="h-8 text-sm" type="number" value={attForm.present || ''} onChange={(e) => setAttForm({ ...attForm, present: Number(e.target.value) })} max={attForm.total} /></div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline" size="sm">Cancel</Button></DialogClose>
            <Button size="sm" onClick={handleAddAtt} disabled={!attForm.contractor || !attForm.total}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
