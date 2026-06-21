import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'
import { Separator } from '#/components/ui/separator'
import { Button } from '#/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '#/components/ui/table'
import { DataTable, SortableHeader } from '#/components/ui/data-table'
import type { ColumnDef } from '@tanstack/react-table'
import { Progress } from '#/components/ui/progress'
import { Input } from '#/components/ui/input'
import {
  IndianRupee, FileText, AlertTriangle, Clock, CheckCircle2,
  TrendingUp, Plus, MoreHorizontal, Search,
} from 'lucide-react'

export const Route = createFileRoute('/billing')({ component: BillingModule })

type RABill = {
  id: string; project: string; period: string; type: 'RA' | 'Milestone' | 'Final'
  grossValue: number; retention: number; tds: number; netValue: number
  physicalPct: number; billedPct: number; status: string; submitted: string
}

type Receivable = {
  id: string; project: string; client: string; billNo: string
  certified: number; outstanding: number; daysOld: number; ageing: string
}

const initBills: RABill[] = [
  { id: 'RA-0042', project: 'SITE-014 (Skyline Towers)', period: 'Jun 2024', type: 'RA', grossValue: 2850000, retention: 142500, tds: 57000, netValue: 2650500, physicalPct: 75, billedPct: 71, status: 'Submitted to Client', submitted: '2024-06-10' },
  { id: 'RA-0039', project: 'SITE-014 (Skyline Towers)', period: 'Apr 2024', type: 'RA', grossValue: 2200000, retention: 110000, tds: 44000, netValue: 2046000, physicalPct: 58, billedPct: 55, status: 'Client Certified', submitted: '2024-04-12' },
  { id: 'RA-0036', project: 'SITE-015 (Riverfront Villas)', period: 'May 2024', type: 'RA', grossValue: 480000, retention: 24000, tds: 9600, netValue: 446400, physicalPct: 30, billedPct: 30, status: 'Internally Certified', submitted: '2024-06-02' },
  { id: 'MS-0007', project: 'SITE-016 (Tech Park Ph.1)', period: 'Jun 2024', type: 'Milestone', grossValue: 1200000, retention: 60000, tds: 24000, netValue: 1116000, physicalPct: 8, billedPct: 10, status: 'Draft', submitted: '' },
  { id: 'RA-0041', project: 'SITE-012 (Metro Hub)', period: 'Jun 2024', type: 'RA', grossValue: 6500000, retention: 325000, tds: 130000, netValue: 6045000, physicalPct: 100, billedPct: 100, status: 'Payment Received', submitted: '2024-05-30' },
]

const initReceivables: Receivable[] = [
  { id: 'REC-001', project: 'SITE-014', client: 'Apex Corp', billNo: 'RA-0042', certified: 2650500, outstanding: 2650500, daysOld: 10, ageing: '0–30' },
  { id: 'REC-002', project: 'SITE-014', client: 'Apex Corp', billNo: 'RA-0039', certified: 2046000, outstanding: 1023000, daysOld: 68, ageing: '61–90' },
  { id: 'REC-003', project: 'SITE-015', client: 'Lakeside Dev', billNo: 'RA-0036', certified: 446400, outstanding: 446400, daysOld: 18, ageing: '0–30' },
]

function fmt(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`
  return `₹${n.toLocaleString('en-IN')}`
}

function BillStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Draft: 'bg-muted text-muted-foreground border-border',
    'Internally Certified': 'bg-blue-50 text-blue-700 border-blue-200',
    'Submitted to Client': 'bg-amber-50 text-amber-700 border-amber-200',
    'Client Certified': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Payment Received': 'bg-primary/10 text-primary border-primary/20',
  }
  return <Badge variant="outline" className={`text-[10px] font-semibold h-5 px-1.5 ${map[status] ?? ''}`}>{status}</Badge>
}

function BillingModule() {
  const [bills, setBills] = useState<RABill[]>(initBills)
  const [activeTab, setActiveTab] = useState('bills')
  const [billSearch, setBillSearch] = useState('')

  const totalBilled = bills.reduce((a, b) => a + b.grossValue, 0)
  const totalNet = bills.reduce((a, b) => a + b.netValue, 0)
  const totalOutstanding = initReceivables.reduce((a, r) => a + r.outstanding, 0)
  const overBilledCount = bills.filter(b => b.billedPct > b.physicalPct + 5).length

  const billColumns = useMemo<ColumnDef<RABill>[]>(() => [
    {
      accessorKey: 'id',
      header: ({ column }) => <SortableHeader column={column} title="Bill No." />,
      cell: ({ row }) => <span className="font-mono text-xs text-primary">{row.getValue('id')}</span>,
    },
    {
      accessorKey: 'project',
      header: ({ column }) => <SortableHeader column={column} title="Project" />,
      cell: ({ row }) => <div className="text-xs font-medium max-w-[160px] truncate">{row.getValue('project')}</div>,
    },
    {
      accessorKey: 'type',
      header: ({ column }) => <SortableHeader column={column} title="Type" />,
      cell: ({ row }) => {
        const t = row.getValue('type') as string
        const color = t === 'RA' ? 'bg-primary/10 text-primary border-primary/20' : t === 'Milestone' ? 'bg-violet-100 text-violet-800 border-violet-200' : 'bg-amber-50 text-amber-700 border-amber-200'
        return <Badge variant="outline" className={`text-[10px] h-5 px-1.5 font-semibold ${color}`}>{t}</Badge>
      },
    },
    {
      accessorKey: 'period',
      header: ({ column }) => <SortableHeader column={column} title="Period" />,
      cell: ({ row }) => <span className="text-xs text-muted-foreground">{row.getValue('period')}</span>,
    },
    {
      accessorKey: 'grossValue',
      header: ({ column }) => <SortableHeader column={column} title="Gross Value" />,
      cell: ({ row }) => <span className="text-xs font-mono font-semibold">{fmt(row.getValue('grossValue'))}</span>,
    },
    {
      id: 'progress',
      header: () => <span className="text-[11px] font-semibold uppercase tracking-wide">Physical vs Billed</span>,
      cell: ({ row }) => {
        const phy = row.original.physicalPct, bill = row.original.billedPct
        const overBilled = bill > phy + 5
        return (
          <div className="min-w-[120px]">
            <div className="flex justify-between text-[10px] mb-1">
              <span className="text-muted-foreground">Phy: <strong>{phy}%</strong></span>
              <span className={overBilled ? 'text-destructive font-bold' : 'text-muted-foreground'}>Bill: <strong>{bill}%</strong></span>
            </div>
            <div className="relative h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div className="absolute h-full rounded-full bg-primary/40" style={{ width: `${phy}%` }} />
              <div className={`absolute h-full rounded-full ${overBilled ? 'bg-destructive' : 'bg-emerald-500'}`} style={{ width: `${Math.min(bill, 100)}%`, opacity: 0.7 }} />
            </div>
            {overBilled && <div className="text-[10px] text-destructive font-semibold mt-0.5">⚠ Over-billed</div>}
          </div>
        )
      },
    },
    {
      accessorKey: 'netValue',
      header: ({ column }) => <SortableHeader column={column} title="Net Payable" />,
      cell: ({ row }) => <span className="text-xs font-mono font-bold text-primary">{fmt(row.getValue('netValue'))}</span>,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <SortableHeader column={column} title="Status" />,
      cell: ({ row }) => <BillStatusBadge status={row.getValue('status')} />,
    },
    {
      id: 'action',
      header: () => null,
      cell: ({ row }) => {
        const b = row.original
        if (b.status === 'Draft') {
          return (
            <Button size="sm" className="h-6 text-[10px] px-2 bg-blue-600 hover:bg-blue-700"
              onClick={() => setBills(prev => prev.map(x => x.id === b.id ? { ...x, status: 'Internally Certified' } : x))}>
              Certify
            </Button>
          )
        }
        if (b.status === 'Internally Certified') {
          return (
            <Button size="sm" className="h-6 text-[10px] px-2" variant="outline"
              onClick={() => setBills(prev => prev.map(x => x.id === b.id ? { ...x, status: 'Submitted to Client', submitted: new Date().toISOString().slice(0, 10) } : x))}>
              Submit
            </Button>
          )
        }
        return null
      },
    },
  ], [])

  return (
    <div className="flex flex-col gap-5 max-w-[1400px]">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Billing & Invoicing</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Client RA bills, milestone billing, receivable tracking, and retention management.</p>
        </div>
        <Button size="sm" className="gap-1.5">
          <Plus className="size-3.5" />Generate RA Bill
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'Total Billed (Gross)', value: fmt(totalBilled), icon: FileText, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Net Receivable', value: fmt(totalNet), icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Outstanding', value: fmt(totalOutstanding), icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Over-Billed Risk', value: overBilledCount, icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10' },
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

      {/* Over-billing warning */}
      {overBilledCount > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-2.5">
          <AlertTriangle className="size-4 text-destructive shrink-0" />
          <p className="text-xs text-destructive font-medium">
            <strong>{overBilledCount} bill(s)</strong> show billed % exceeding physical progress by more than 5 points. These require explicit approval before client submission.
          </p>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="h-8">
          <TabsTrigger value="bills" className="text-xs">RA Bill Register ({bills.length})</TabsTrigger>
          <TabsTrigger value="receivables" className="text-xs">Receivable Ageing</TabsTrigger>
          <TabsTrigger value="retention" className="text-xs">Retention Ledger</TabsTrigger>
        </TabsList>

        <TabsContent value="bills" className="mt-4">
          <Card className="shadow-none border-border">
            <CardHeader className="p-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold">RA / Milestone / Final Bill Register</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  <Input placeholder="Search bills..." value={billSearch} onChange={e => setBillSearch(e.target.value)} className="w-48 pl-8 h-7 text-xs" />
                </div>
                <Button variant="ghost" size="icon" className="size-7"><MoreHorizontal className="size-3.5" /></Button>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="p-0 border-b-0">
              <DataTable columns={billColumns} data={bills} externalFilter={billSearch} onExternalFilterChange={setBillSearch} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="receivables" className="mt-4">
          <Card className="shadow-none border-border">
            <CardHeader className="p-3"><CardTitle className="text-sm font-semibold">Receivable Ageing Report</CardTitle></CardHeader>
            <Separator />
            <CardContent className="p-0 border-b-0 max-h-[55vh] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/20">
                    {['Project', 'Client', 'Bill No.', 'Certified Value', 'Outstanding', 'Days Old', 'Bucket'].map(h => (
                      <TableHead key={h} className="px-4 text-[11px] font-semibold uppercase tracking-wide">{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {initReceivables.map(r => (
                    <TableRow key={r.id} className="hover:bg-muted/20 transition-colors">
                      <TableCell className="pl-5 text-xs font-medium">{r.project}</TableCell>
                      <TableCell className="text-xs">{r.client}</TableCell>
                      <TableCell className="text-xs font-mono text-primary">{r.billNo}</TableCell>
                      <TableCell className="text-xs font-mono">{fmt(r.certified)}</TableCell>
                      <TableCell className="text-xs font-mono font-bold text-destructive">{fmt(r.outstanding)}</TableCell>
                      <TableCell>
                        <span className={`text-xs font-bold ${r.daysOld > 60 ? 'text-destructive' : r.daysOld > 30 ? 'text-amber-600' : 'text-foreground'}`}>
                          {r.daysOld}d
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-[10px] h-5 px-1.5 font-semibold ${
                          r.ageing === '61–90' ? 'bg-destructive/10 text-destructive border-destructive/30' :
                          r.ageing === '31–60' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-muted text-muted-foreground border-border'
                        }`}>
                          {r.ageing} days
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="retention" className="mt-4">
          <Card className="shadow-none border-border">
            <CardHeader className="p-3"><CardTitle className="text-sm font-semibold">Retention Ledger (Client-Withheld)</CardTitle></CardHeader>
            <Separator />
            <CardContent className="p-0 border-b-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/20">
                    {['Project', 'Total Billed', 'Retention %', 'Total Withheld', 'Released', 'Outstanding', 'Trigger Event'].map(h => (
                      <TableHead key={h} className="px-4 text-[11px] font-semibold uppercase tracking-wide">{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { proj: 'SITE-014 (Skyline)', billed: 5050000, pct: 5, withheld: 252500, released: 0, trigger: 'Virtual Completion' },
                    { proj: 'SITE-015 (Riverfront)', billed: 480000, pct: 5, withheld: 24000, released: 0, trigger: 'Virtual Completion' },
                    { proj: 'SITE-012 (Metro Hub)', billed: 6500000, pct: 5, withheld: 325000, released: 162500, trigger: 'DLP Expiry 2024-11-01' },
                  ].map((r, i) => (
                    <TableRow key={i} className="hover:bg-muted/20 transition-colors">
                      <TableCell className="pl-5 text-xs font-medium">{r.proj}</TableCell>
                      <TableCell className="text-xs font-mono">{fmt(r.billed)}</TableCell>
                      <TableCell className="text-xs font-mono">{r.pct}%</TableCell>
                      <TableCell className="text-xs font-mono font-bold">{fmt(r.withheld)}</TableCell>
                      <TableCell className="text-xs font-mono text-emerald-600">{fmt(r.released)}</TableCell>
                      <TableCell className="text-xs font-mono font-bold text-destructive">{fmt(r.withheld - r.released)}</TableCell>
                      <TableCell className="pr-5">
                        <span className="text-[10px] text-muted-foreground">{r.trigger}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
