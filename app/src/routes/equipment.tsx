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
  Truck, AlertTriangle, CheckCircle2, Clock, Wrench, Plus, TrendingDown, Search,
} from 'lucide-react'

export const Route = createFileRoute('/equipment')({ component: EquipmentModule })

type Asset = {
  id: string; name: string; category: string; ownership: 'Owned' | 'Hired'
  site: string; vendor: string; hireRate: string; hireExpiry: string
  utilization: number; lastMaintenance: string; certExpiry: string; status: string
}

type MaintenanceLog = {
  id: string; assetId: string; asset: string; type: string
  dueDate: string; completed: boolean; downtime: number; cost: number
}

const initAssets: Asset[] = [
  { id: 'EQ-001', name: 'Liebherr Tower Crane TC-01', category: 'Crane', ownership: 'Hired', site: 'SITE-014', vendor: 'CraneRent India', hireRate: '₹1.2L/month', hireExpiry: '2024-09-30', utilization: 82, lastMaintenance: '2024-05-10', certExpiry: '2024-08-15', status: 'Operational' },
  { id: 'EQ-002', name: 'SCHWING Concrete Pump CP-01', category: 'Concrete Pump', ownership: 'Hired', site: 'SITE-014', vendor: 'BuildTech Hire', hireRate: '₹85K/month', hireExpiry: '2024-08-15', utilization: 38, lastMaintenance: '2024-06-01', certExpiry: '2025-01-01', status: 'Low Utilization' },
  { id: 'EQ-003', name: 'JCB 3DX Backhoe BH-01', category: 'Excavator', ownership: 'Owned', site: 'SITE-015', vendor: '—', hireRate: '—', hireExpiry: '—', utilization: 71, lastMaintenance: '2024-04-20', certExpiry: '2024-12-31', status: 'Operational' },
  { id: 'EQ-004', name: 'TATA Transit Mixer TM-01', category: 'Transit Mixer', ownership: 'Owned', site: 'SITE-012', vendor: '—', hireRate: '—', hireExpiry: '—', utilization: 0, lastMaintenance: '2024-06-15', certExpiry: '2025-03-01', status: 'Under Maintenance' },
  { id: 'EQ-005', name: 'Potain MCi 85 Crane TC-02', category: 'Crane', ownership: 'Hired', site: 'SITE-016', vendor: 'CraneRent India', hireRate: '₹98K/month', hireExpiry: '2025-06-30', utilization: 65, lastMaintenance: '2024-05-28', certExpiry: '2024-07-01', status: 'Cert Expiry Soon' },
]

const initMaintenance: MaintenanceLog[] = [
  { id: 'MNT-001', assetId: 'EQ-004', asset: 'TATA Transit Mixer TM-01', type: 'Corrective – Engine Overhaul', dueDate: '2024-06-15', completed: false, downtime: 5, cost: 85000 },
  { id: 'MNT-002', assetId: 'EQ-001', asset: 'Liebherr Tower Crane TC-01', type: 'Preventive – 500hr Service', dueDate: '2024-07-10', completed: false, downtime: 0, cost: 32000 },
  { id: 'MNT-003', assetId: 'EQ-003', asset: 'JCB 3DX Backhoe BH-01', type: 'Preventive – 250hr Service', dueDate: '2024-04-20', completed: true, downtime: 1, cost: 18000 },
]

function fmt(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(0)}L`
  return `₹${n.toLocaleString('en-IN')}`
}

function UtilBar({ pct }: { pct: number }) {
  const color = pct < 40 ? 'bg-destructive' : pct < 65 ? 'bg-amber-500' : 'bg-emerald-500'
  return (
    <div>
      <div className="flex items-center justify-between text-[10px] mb-1">
        <span className={`font-bold ${pct < 40 ? 'text-destructive' : pct < 65 ? 'text-amber-600' : 'text-emerald-600'}`}>{pct}%</span>
      </div>
      <div className="h-1.5 w-24 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function AssetStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Operational: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Low Utilization': 'bg-amber-50 text-amber-700 border-amber-200',
    'Under Maintenance': 'bg-muted text-muted-foreground border-border',
    'Cert Expiry Soon': 'bg-destructive/10 text-destructive border-destructive/30',
  }
  return <Badge variant="outline" className={`text-[10px] font-semibold h-5 px-1.5 ${map[status] ?? ''}`}>{status}</Badge>
}

function EquipmentModule() {
  const [assets] = useState<Asset[]>(initAssets)
  const [maintenance, setMaintenance] = useState<MaintenanceLog[]>(initMaintenance)
  const [showUsage, setShowUsage] = useState(false)
  const [usageForm, setUsageForm] = useState({ asset: initAssets[0].id, running: 0, idle: 0, operator: '', activity: '' })
  const [assetSearch, setAssetSearch] = useState('')
  const [maintSearch, setMaintSearch] = useState('')

  const certExpirySoon = assets.filter(a => {
    const days = (new Date(a.certExpiry).getTime() - Date.now()) / 86400000
    return days <= 30
  })
  const lowUtil = assets.filter(a => a.utilization < 40 && a.status !== 'Under Maintenance')
  const underMaint = assets.filter(a => a.status === 'Under Maintenance')

  const assetCols = useMemo<ColumnDef<Asset>[]>(() => [
    {
      accessorKey: 'id',
      header: ({ column }) => <SortableHeader column={column} title="Code" />,
      cell: ({ row }) => <span className="font-mono text-xs text-primary">{row.getValue('id')}</span>,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => <SortableHeader column={column} title="Equipment" />,
      cell: ({ row }) => (
        <div>
          <div className="text-xs font-medium max-w-[180px] truncate">{row.getValue('name')}</div>
          <div className="text-[10px] text-muted-foreground">{row.original.category} · {row.original.ownership}</div>
        </div>
      ),
    },
    {
      accessorKey: 'site',
      header: ({ column }) => <SortableHeader column={column} title="Site" />,
      cell: ({ row }) => <span className="text-xs font-semibold text-primary">{row.getValue('site')}</span>,
    },
    {
      accessorKey: 'utilization',
      header: ({ column }) => <SortableHeader column={column} title="Utilization" />,
      cell: ({ row }) => <UtilBar pct={row.getValue('utilization')} />,
    },
    {
      accessorKey: 'hireRate',
      header: ({ column }) => <SortableHeader column={column} title="Rate / Ownership" />,
      cell: ({ row }) => (
        <div>
          <div className="text-xs font-medium">{row.original.hireRate === '—' ? 'Owned' : row.original.hireRate}</div>
          {row.original.hireExpiry !== '—' && <div className="text-[10px] text-muted-foreground">Hire until: {row.original.hireExpiry}</div>}
        </div>
      ),
    },
    {
      accessorKey: 'certExpiry',
      header: ({ column }) => <SortableHeader column={column} title="Cert. Expiry" />,
      cell: ({ row }) => {
        const d = row.getValue('certExpiry') as string
        const days = (new Date(d).getTime() - Date.now()) / 86400000
        return (
          <div className="flex items-center gap-1">
            {days <= 30 && <AlertTriangle className="size-3 text-destructive" />}
            <span className={`text-xs font-mono ${days <= 30 ? 'text-destructive font-bold' : ''}`}>{d}</span>
          </div>
        )
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <SortableHeader column={column} title="Status" />,
      cell: ({ row }) => <AssetStatusBadge status={row.getValue('status')} />,
    },
  ], [])

  const maintCols = useMemo<ColumnDef<MaintenanceLog>[]>(() => [
    {
      accessorKey: 'id',
      header: ({ column }) => <SortableHeader column={column} title="Ref" />,
      cell: ({ row }) => <span className="font-mono text-xs">{row.getValue('id')}</span>,
    },
    {
      accessorKey: 'asset',
      header: ({ column }) => <SortableHeader column={column} title="Equipment" />,
      cell: ({ row }) => <div className="text-xs font-medium max-w-[160px] truncate">{row.getValue('asset')}</div>,
    },
    {
      accessorKey: 'type',
      header: ({ column }) => <SortableHeader column={column} title="Type" />,
      cell: ({ row }) => <div className="text-xs text-muted-foreground">{row.getValue('type')}</div>,
    },
    {
      accessorKey: 'dueDate',
      header: ({ column }) => <SortableHeader column={column} title="Due Date" />,
      cell: ({ row }) => <span className="text-xs font-mono">{row.getValue('dueDate')}</span>,
    },
    {
      accessorKey: 'cost',
      header: ({ column }) => <SortableHeader column={column} title="Est. Cost" />,
      cell: ({ row }) => <span className="text-xs font-mono">{fmt(row.getValue('cost'))}</span>,
    },
    {
      accessorKey: 'completed',
      header: ({ column }) => <SortableHeader column={column} title="Status" />,
      cell: ({ row }) => {
        const done = row.getValue('completed') as boolean
        if (done) return <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200"><CheckCircle2 className="size-2.5" /> Done</span>
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200"><Clock className="size-2.5" /> Pending</span>
      },
    },
    {
      id: 'mark',
      header: () => null,
      cell: ({ row }) => {
        if (row.original.completed) return null
        return (
          <Button size="sm" className="h-6 text-[10px] px-2 bg-emerald-600 hover:bg-emerald-700"
            onClick={() => setMaintenance(prev => prev.map(m => m.id === row.original.id ? { ...m, completed: true } : m))}>
            Mark Done
          </Button>
        )
      },
    },
  ], [])

  return (
    <div className="flex flex-col gap-5 max-w-[1400px]">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Equipment & Asset Management</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Track owned and hired equipment utilization, maintenance, and statutory certifications.</p>
        </div>
        <Button size="sm" className="gap-1.5" onClick={() => setShowUsage(true)}>
          <Plus className="size-3.5" />Log Usage
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'Total Assets', value: assets.length, icon: Truck, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Under Maintenance', value: underMaint.length, icon: Wrench, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Low Utilization', value: lowUtil.length, icon: TrendingDown, color: 'text-destructive', bg: 'bg-destructive/10' },
          { label: 'Cert. Expiry ≤30d', value: certExpirySoon.length, icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10' },
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

      {/* Alerts */}
      {certExpirySoon.length > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-2.5">
          <AlertTriangle className="size-4 text-destructive shrink-0" />
          <p className="text-xs text-destructive font-medium">
            <strong>{certExpirySoon.map(a => a.name).join(', ')}</strong> — statutory certification expiring within 30 days. These assets cannot be allocated until certificates are renewed.
          </p>
        </div>
      )}
      {lowUtil.length > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5">
          <TrendingDown className="size-4 text-amber-600 shrink-0" />
          <p className="text-xs text-amber-800 font-medium">
            <strong>{lowUtil.length} asset(s)</strong> have utilization below 40%: {lowUtil.map(a => a.name).join(', ')}. Consider redeployment or early hire return.
          </p>
        </div>
      )}

      <Tabs defaultValue="assets">
        <TabsList className="h-8">
          <TabsTrigger value="assets" className="text-xs">Asset Register ({assets.length})</TabsTrigger>
          <TabsTrigger value="maintenance" className="text-xs">Maintenance Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="assets" className="mt-4">
          <Card className="shadow-none border-border">
            <CardHeader className="flex flex-row items-center justify-between p-3">
              <CardTitle className="text-sm font-semibold">Equipment / Asset Master</CardTitle>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <Input placeholder="Search equipment..." value={assetSearch} onChange={e => setAssetSearch(e.target.value)} className="w-48 pl-8 h-7 text-xs" />
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="p-0 border-b-0">
              <DataTable columns={assetCols} data={assets} externalFilter={assetSearch} onExternalFilterChange={setAssetSearch} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="mt-4">
          <Card className="shadow-none border-border">
            <CardHeader className="flex flex-row items-center justify-between p-3">
              <CardTitle className="text-sm font-semibold">Maintenance Log (Preventive & Corrective)</CardTitle>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <Input placeholder="Search maintenance..." value={maintSearch} onChange={e => setMaintSearch(e.target.value)} className="w-48 pl-8 h-7 text-xs" />
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="p-0 border-b-0">
              <DataTable columns={maintCols} data={maintenance} externalFilter={maintSearch} onExternalFilterChange={setMaintSearch} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Log Usage Dialog */}
      <Dialog open={showUsage} onOpenChange={setShowUsage}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Log Equipment Usage</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label className="text-xs">Equipment *</Label>
              <Select value={usageForm.asset} onValueChange={v => setUsageForm({ ...usageForm, asset: v })}>
                <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>{assets.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Running Hours *</Label>
              <Input className="h-8 text-sm" type="number" value={usageForm.running || ''} onChange={e => setUsageForm({ ...usageForm, running: Number(e.target.value) })} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Idle Hours</Label>
              <Input className="h-8 text-sm" type="number" value={usageForm.idle || ''} onChange={e => setUsageForm({ ...usageForm, idle: Number(e.target.value) })} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Operator Name</Label>
              <Input className="h-8 text-sm" value={usageForm.operator} onChange={e => setUsageForm({ ...usageForm, operator: e.target.value })} placeholder="e.g. Ramesh Kumar" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Activity / WBS</Label>
              <Input className="h-8 text-sm" value={usageForm.activity} onChange={e => setUsageForm({ ...usageForm, activity: e.target.value })} placeholder="e.g. Slab Pour – Floor 5" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline" size="sm">Cancel</Button></DialogClose>
            <Button size="sm" disabled={!usageForm.running}>Log Usage</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
