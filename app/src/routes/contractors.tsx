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
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '#/components/ui/select'
import { DataTable, SortableHeader } from '#/components/ui/data-table'
import type { ColumnDef } from '@tanstack/react-table'
import {
  Plus, Users, FileCheck, AlertTriangle, IndianRupee,
  CheckCircle2, Clock, XCircle, Pencil, Search,
} from 'lucide-react'

export const Route = createFileRoute('/contractors')({ component: ContractorsModule })

type Contractor = {
  id: string; name: string; trade: string; pan: string; gstin: string;
  licenseExpiry: string; status: 'Active' | 'Suspended' | 'Blacklisted'; performanceScore: number
}

type WorkOrder = {
  id: string; contractor: string; project: string; scope: string;
  value: number; billed: number; start: string; end: string; status: string; retention: number
}

type Bill = {
  id: string; woRef: string; contractor: string; period: string;
  grossValue: number; deductions: number; netPayable: number; status: string
}

const initContractors: Contractor[] = [
  { id: 'SC-001', name: 'Ramesh Civil Works', trade: 'Civil / RCC', pan: 'ABCPR1234D', gstin: '27ABCPR1234D1Z5', licenseExpiry: '2025-03-31', status: 'Active', performanceScore: 88 },
  { id: 'SC-002', name: 'Singh Tiling Co.', trade: 'Flooring & Tiling', pan: 'BCDPS5678E', gstin: '27BCDPS5678E1Z3', licenseExpiry: '2024-07-15', status: 'Active', performanceScore: 72 },
  { id: 'SC-003', name: 'Kumar Electrical', trade: 'MEP / Electrical', pan: 'CDEQK9012F', gstin: '27CDEQK9012F1Z1', licenseExpiry: '2024-06-01', status: 'Suspended', performanceScore: 55 },
  { id: 'SC-004', name: 'Gupta Waterproof', trade: 'Waterproofing', pan: 'DEFPG3456G', gstin: '27DEFPG3456G1Z9', licenseExpiry: '2025-11-30', status: 'Active', performanceScore: 94 },
]

const initWorkOrders: WorkOrder[] = [
  { id: 'WO-0041', contractor: 'Ramesh Civil Works', project: 'SITE-014 (Skyline Towers)', scope: 'RCC Slab – Floors 4–6', value: 1850000, billed: 1200000, start: '2024-02-01', end: '2024-08-31', status: 'Active', retention: 5 },
  { id: 'WO-0038', contractor: 'Singh Tiling Co.', project: 'SITE-014 (Skyline Towers)', scope: 'Vitrified Tiling – Lower Floors', value: 420000, billed: 390000, start: '2024-03-15', end: '2024-06-30', status: 'Completed', retention: 5 },
  { id: 'WO-0039', contractor: 'Gupta Waterproof', project: 'SITE-015 (Riverfront Villas)', scope: 'Basement Waterproofing', value: 290000, billed: 0, start: '2024-05-01', end: '2024-07-15', status: 'Active', retention: 5 },
  { id: 'WO-0042', contractor: 'Ramesh Civil Works', project: 'SITE-016 (Tech Park Ph.1)', scope: 'Foundation & Plinth Beam', value: 3200000, billed: 400000, start: '2024-04-01', end: '2025-01-31', status: 'Active', retention: 5 },
]

const initBills: Bill[] = [
  { id: 'SB-0121', woRef: 'WO-0041', contractor: 'Ramesh Civil Works', period: 'May 2024', grossValue: 350000, deductions: 52500, netPayable: 297500, status: 'Pending Certification' },
  { id: 'SB-0119', woRef: 'WO-0038', contractor: 'Singh Tiling Co.', period: 'Apr 2024', grossValue: 120000, deductions: 18000, netPayable: 102000, status: 'Paid' },
  { id: 'SB-0118', woRef: 'WO-0041', contractor: 'Ramesh Civil Works', period: 'Apr 2024', grossValue: 280000, deductions: 42000, netPayable: 238000, status: 'Certified' },
]

function fmt(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`
  return `₹${n.toLocaleString('en-IN')}`
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Suspended: 'bg-amber-50 text-amber-700 border-amber-200',
    Blacklisted: 'bg-destructive/10 text-destructive border-destructive/30',
    Completed: 'bg-muted text-muted-foreground border-border',
    'Pending Certification': 'bg-amber-50 text-amber-700 border-amber-200',
    Certified: 'bg-blue-50 text-blue-700 border-blue-200',
    Paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  }
  return <Badge variant="outline" className={`text-[10px] font-semibold h-5 px-1.5 ${map[status] ?? ''}`}>{status}</Badge>
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 85 ? 'text-emerald-600' : score >= 65 ? 'text-amber-600' : 'text-destructive'
  return <span className={`text-xs font-bold font-mono ${color}`}>{score}/100</span>
}

function ContractorsModule() {
  const [contractors] = useState<Contractor[]>(initContractors)
  const [workOrders] = useState<WorkOrder[]>(initWorkOrders)
  const [bills, setBills] = useState<Bill[]>(initBills)
  const [showWO, setShowWO] = useState(false)
  const [woForm, setWoForm] = useState({ contractor: initContractors[0].name, project: 'SITE-014', scope: '', value: 0, retention: 5, start: '', end: '' })
  const [contractorSearch, setContractorSearch] = useState('')
  const [woSearch, setWoSearch] = useState('')
  const [billSearch, setBillSearch] = useState('')

  const expiringSoon = contractors.filter(c => {
    const days = (new Date(c.licenseExpiry).getTime() - Date.now()) / 86400000
    return days <= 60 && c.status === 'Active'
  })

  const contractorCols = useMemo<ColumnDef<Contractor>[]>(() => [
    {
      accessorKey: 'id',
      header: ({ column }) => <SortableHeader column={column} title="Code" />,
      cell: ({ row }) => <span className="font-mono text-xs text-primary">{row.getValue('id')}</span>,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => <SortableHeader column={column} title="Contractor" />,
      cell: ({ row }) => <div className="font-medium text-xs">{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'trade',
      header: ({ column }) => <SortableHeader column={column} title="Trade" />,
      cell: ({ row }) => <Badge variant="secondary" className="text-[10px]">{row.getValue('trade')}</Badge>,
    },
    {
      accessorKey: 'licenseExpiry',
      header: ({ column }) => <SortableHeader column={column} title="License Expiry" />,
      cell: ({ row }) => {
        const d = row.getValue('licenseExpiry') as string
        const days = (new Date(d).getTime() - Date.now()) / 86400000
        return (
          <div className="flex items-center gap-1.5">
            {days <= 30 && <AlertTriangle className="size-3 text-destructive" />}
            {days <= 60 && days > 30 && <AlertTriangle className="size-3 text-amber-500" />}
            <span className={`text-xs font-mono ${days <= 30 ? 'text-destructive font-bold' : days <= 60 ? 'text-amber-600' : ''}`}>{d}</span>
          </div>
        )
      },
    },
    {
      accessorKey: 'performanceScore',
      header: ({ column }) => <SortableHeader column={column} title="Score" />,
      cell: ({ row }) => <ScoreBadge score={row.getValue('performanceScore')} />,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <SortableHeader column={column} title="Status" />,
      cell: ({ row }) => <StatusBadge status={row.getValue('status')} />,
    },
  ], [])

  const woCols = useMemo<ColumnDef<WorkOrder>[]>(() => [
    {
      accessorKey: 'id',
      header: ({ column }) => <SortableHeader column={column} title="WO No." />,
      cell: ({ row }) => <span className="font-mono text-xs text-primary">{row.getValue('id')}</span>,
    },
    {
      accessorKey: 'contractor',
      header: ({ column }) => <SortableHeader column={column} title="Contractor" />,
      cell: ({ row }) => <div className="text-xs font-medium max-w-[140px] truncate">{row.getValue('contractor')}</div>,
    },
    {
      accessorKey: 'scope',
      header: ({ column }) => <SortableHeader column={column} title="Scope" />,
      cell: ({ row }) => <div className="text-xs max-w-[160px] truncate text-muted-foreground">{row.getValue('scope')}</div>,
    },
    {
      accessorKey: 'value',
      header: ({ column }) => <SortableHeader column={column} title="WO Value" />,
      cell: ({ row }) => <span className="text-xs font-mono font-semibold">{fmt(row.getValue('value'))}</span>,
    },
    {
      accessorKey: 'billed',
      header: ({ column }) => <SortableHeader column={column} title="Billed" />,
      cell: ({ row }) => {
        const v = row.original.value, b = row.original.billed
        const pct = Math.round((b / v) * 100)
        return (
          <div>
            <span className="text-xs font-mono text-primary font-semibold">{fmt(b)}</span>
            <div className="text-[10px] text-muted-foreground">{pct}% of WO</div>
          </div>
        )
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <SortableHeader column={column} title="Status" />,
      cell: ({ row }) => <StatusBadge status={row.getValue('status')} />,
    },
  ], [])

  const billCols = useMemo<ColumnDef<Bill>[]>(() => [
    {
      accessorKey: 'id',
      header: ({ column }) => <SortableHeader column={column} title="Bill No." />,
      cell: ({ row }) => <span className="font-mono text-xs">{row.getValue('id')}</span>,
    },
    {
      accessorKey: 'contractor',
      header: ({ column }) => <SortableHeader column={column} title="Contractor" />,
      cell: ({ row }) => <div className="text-xs font-medium max-w-[140px] truncate">{row.getValue('contractor')}</div>,
    },
    {
      accessorKey: 'period',
      header: ({ column }) => <SortableHeader column={column} title="Period" />,
      cell: ({ row }) => <span className="text-xs text-muted-foreground">{row.getValue('period')}</span>,
    },
    {
      accessorKey: 'grossValue',
      header: ({ column }) => <SortableHeader column={column} title="Gross" />,
      cell: ({ row }) => <span className="text-xs font-mono">{fmt(row.getValue('grossValue'))}</span>,
    },
    {
      accessorKey: 'deductions',
      header: ({ column }) => <SortableHeader column={column} title="Deductions" />,
      cell: ({ row }) => <span className="text-xs font-mono text-destructive">-{fmt(row.getValue('deductions'))}</span>,
    },
    {
      accessorKey: 'netPayable',
      header: ({ column }) => <SortableHeader column={column} title="Net Payable" />,
      cell: ({ row }) => <span className="text-xs font-mono font-bold text-primary">{fmt(row.getValue('netPayable'))}</span>,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <SortableHeader column={column} title="Status" />,
      cell: ({ row }) => <StatusBadge status={row.getValue('status')} />,
    },
    {
      id: 'certify',
      header: () => null,
      cell: ({ row }) => {
        if (row.original.status !== 'Pending Certification') return null
        return (
          <Button
            size="sm"
            className="h-6 text-[10px] bg-emerald-600 hover:bg-emerald-700 px-2"
            onClick={() => setBills(prev => prev.map(b => b.id === row.original.id ? { ...b, status: 'Certified' } : b))}
          >
            Certify
          </Button>
        )
      },
    },
  ], [])

  const totalWOValue = workOrders.reduce((a, b) => a + b.value, 0)
  const totalBilled = workOrders.reduce((a, b) => a + b.billed, 0)
  const pendingCert = bills.filter(b => b.status === 'Pending Certification').length

  return (
    <div className="flex flex-col gap-5 max-w-[1400px]">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Contractor & Subcontractor</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Work orders, measurement-based billing, retention, and compliance tracking.</p>
        </div>
        <Button size="sm" className="gap-1.5" onClick={() => setShowWO(true)}>
          <Plus className="size-3.5" />New Work Order
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'Active Contractors', value: contractors.filter(c => c.status === 'Active').length, icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Total WO Value', value: fmt(totalWOValue), icon: IndianRupee, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Total Billed', value: fmt(totalBilled), icon: FileCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Pending Certification', value: pendingCert, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label} className="shadow-none border-border">
            <CardContent className="flex items-center gap-3 p-3">
              <div className={`flex size-8 items-center justify-center rounded ${bg}`}><Icon className={`size-4 ${color}`} /></div>
              <div className="flex flex-col leading-tight">
                <div className="text-lg font-bold">{value}</div>
                <div className="text-[10px] uppercase font-semibold text-muted-foreground">{label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Expiry Alert */}
      {expiringSoon.length > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5">
          <AlertTriangle className="size-4 text-amber-600 shrink-0" />
          <p className="text-xs text-amber-800 font-medium">
            <strong>{expiringSoon.length} contractor(s)</strong> have licenses expiring within 60 days:{' '}
            {expiringSoon.map(c => c.name).join(', ')}. New work orders cannot be issued after expiry.
          </p>
        </div>
      )}

      <Tabs defaultValue="contractors">
        <TabsList className="h-8">
          <TabsTrigger value="contractors" className="text-xs">Contractor Master ({contractors.length})</TabsTrigger>
          <TabsTrigger value="workorders" className="text-xs">Work Orders ({workOrders.length})</TabsTrigger>
          <TabsTrigger value="bills" className="text-xs">Bills & Certification ({bills.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="contractors" className="mt-4">
          <Card className="shadow-none border-border">
            <CardHeader className="flex flex-row items-center justify-between p-3">
              <CardTitle className="text-sm font-semibold">Subcontractor / Contractor Register</CardTitle>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <Input placeholder="Search contractors..." value={contractorSearch} onChange={e => setContractorSearch(e.target.value)} className="w-48 pl-8 h-7 text-xs" />
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="p-0 border-b-0">
              <DataTable columns={contractorCols} data={contractors} externalFilter={contractorSearch} onExternalFilterChange={setContractorSearch} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workorders" className="mt-4">
          <Card className="shadow-none border-border">
            <CardHeader className="flex flex-row items-center justify-between p-3">
              <CardTitle className="text-sm font-semibold">Work Order Register</CardTitle>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <Input placeholder="Search work orders..." value={woSearch} onChange={e => setWoSearch(e.target.value)} className="w-48 pl-8 h-7 text-xs" />
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="p-0 border-b-0">
              <DataTable columns={woCols} data={workOrders} externalFilter={woSearch} onExternalFilterChange={setWoSearch} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bills" className="mt-4">
          <Card className="shadow-none border-border">
            <CardHeader className="flex flex-row items-center justify-between p-3">
              <CardTitle className="text-sm font-semibold">Subcontractor Bills</CardTitle>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CheckCircle2 className="size-3.5 text-emerald-600" />
                  <span>Certify after site measurement</span>
                </div>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  <Input placeholder="Search bills..." value={billSearch} onChange={e => setBillSearch(e.target.value)} className="w-40 pl-8 h-7 text-xs" />
                </div>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="p-0 border-b-0">
              <DataTable columns={billCols} data={bills} externalFilter={billSearch} onExternalFilterChange={setBillSearch} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New WO Dialog */}
      <Dialog open={showWO} onOpenChange={setShowWO}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>New Work Order</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label className="text-xs">Contractor *</Label>
              <Select value={woForm.contractor} onValueChange={v => setWoForm({ ...woForm, contractor: v })}>
                <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>{contractors.filter(c => c.status === 'Active').map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label className="text-xs">Scope of Work *</Label>
              <Input className="h-8 text-sm" value={woForm.scope} onChange={e => setWoForm({ ...woForm, scope: e.target.value })} placeholder="e.g. RCC Slab – Floors 7–9" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">WO Value (₹)</Label>
              <Input className="h-8 text-sm" type="number" value={woForm.value || ''} onChange={e => setWoForm({ ...woForm, value: Number(e.target.value) })} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Retention %</Label>
              <Input className="h-8 text-sm" type="number" value={woForm.retention} onChange={e => setWoForm({ ...woForm, retention: Number(e.target.value) })} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Start Date</Label>
              <Input className="h-8 text-sm" type="date" value={woForm.start} onChange={e => setWoForm({ ...woForm, start: e.target.value })} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Completion Date</Label>
              <Input className="h-8 text-sm" type="date" value={woForm.end} onChange={e => setWoForm({ ...woForm, end: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline" size="sm">Cancel</Button></DialogClose>
            <Button size="sm" disabled={!woForm.scope || !woForm.value}>Issue Work Order</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
