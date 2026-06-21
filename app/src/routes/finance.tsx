import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'
import { Separator } from '#/components/ui/separator'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Progress } from '#/components/ui/progress'
import {
  ChartContainer, ChartTooltip, ChartTooltipContent,
} from '#/components/ui/chart'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { DataTable, SortableHeader } from '#/components/ui/data-table'
import type { ColumnDef } from '@tanstack/react-table'
import { TrendingUp, TrendingDown, IndianRupee, AlertTriangle, MoreHorizontal, Search } from 'lucide-react'

export const Route = createFileRoute('/finance')({ component: FinanceModule })

const chartConfig = {
  committed: { label: 'Committed', color: 'var(--color-chart-1)' },
  actual: { label: 'Actual', color: 'var(--color-chart-2)' },
}

const profitData = [
  { month: 'Feb', committed: 42, actual: 38 },
  { month: 'Mar', committed: 48, actual: 52 },
  { month: 'Apr', committed: 55, actual: 51 },
  { month: 'May', committed: 60, actual: 64 },
  { month: 'Jun', committed: 58, actual: 56 },
]

type CostRow = { project: string; head: string; budget: number; actual: number; variance: number }
const costAllocation: CostRow[] = [
  { project: 'SITE-014 (Skyline Towers)', head: 'Material', budget: 3000000, actual: 2500000, variance: -500000 },
  { project: 'SITE-014 (Skyline Towers)', head: 'Labour', budget: 1500000, actual: 1600000, variance: 100000 },
  { project: 'SITE-015 (Riverfront Villas)', head: 'Material', budget: 2000000, actual: 800000, variance: -1200000 },
  { project: 'SITE-012 (Metro Hub)', head: 'Material', budget: 4000000, actual: 5000000, variance: 1000000 },
  { project: 'SITE-012 (Metro Hub)', head: 'Labour', budget: 2000000, actual: 2500000, variance: 500000 },
]
const payments = [
  { vendor: 'BuildMart Ltd', po: 'PO-2024-0142', amount: 97400, due: '2024-06-25', status: 'Due Soon' },
  { vendor: 'Tata Steel Direct', po: 'PO-2024-0143', amount: 383500, due: '2024-06-20', status: 'Overdue' },
  { vendor: 'Local Sand Co.', po: 'PO-2024-0141', amount: 37800, due: '2024-07-01', status: 'Scheduled' },
]

function fmt(n: number) {
  const abs = Math.abs(n)
  if (abs >= 10000000) return `₹${(abs / 10000000).toFixed(1)}Cr`
  if (abs >= 100000) return `₹${(abs / 100000).toFixed(0)}L`
  return `₹${abs.toLocaleString('en-IN')}`
}

function FinanceModule() {
  const [costSearch, setCostSearch] = useState('')

  const costCols = useMemo<ColumnDef<CostRow>[]>(() => [
    {
      accessorKey: 'project',
      header: ({ column }) => <SortableHeader column={column} title="Project" />,
      cell: ({ row }) => <div className="text-xs font-medium text-foreground">{row.getValue('project')}</div>,
    },
    {
      accessorKey: 'head',
      header: ({ column }) => <SortableHeader column={column} title="Cost Head" />,
      cell: ({ row }) => <Badge variant="secondary" className="text-[10px] font-medium">{row.getValue('head')}</Badge>,
    },
    {
      accessorKey: 'budget',
      header: ({ column }) => <SortableHeader column={column} title="Budget" />,
      cell: ({ row }) => <span className="text-xs font-medium font-mono text-muted-foreground">{fmt(row.getValue('budget'))}</span>,
    },
    {
      accessorKey: 'actual',
      header: ({ column }) => <SortableHeader column={column} title="Actual" />,
      cell: ({ row }) => <span className="text-xs font-bold font-mono text-foreground">{fmt(row.getValue('actual'))}</span>,
    },
    {
      id: 'utilisation',
      header: () => <span className="text-[11px] font-semibold uppercase tracking-wide">Utilisation</span>,
      cell: ({ row }) => {
        const pct = (row.original.actual / row.original.budget) * 100
        return (
          <div className="w-32">
            <Progress value={Math.min(pct, 100)} className={`h-1.5 ${pct > 100 ? '[&>div]:bg-destructive' : pct > 85 ? '[&>div]:bg-amber-500' : '[&>div]:bg-primary'}`} />
            <div className="text-[10px] text-muted-foreground mt-0.5">{Math.round(pct)}%</div>
          </div>
        )
      },
    },
    {
      accessorKey: 'variance',
      header: ({ column }) => <SortableHeader column={column} title="Variance" />,
      cell: ({ row }) => {
        const v = row.getValue('variance') as number
        const over = v > 0
        return <span className={`text-xs font-mono font-bold ${over ? 'text-destructive' : 'text-emerald-600'}`}>{over ? '+' : '-'}{fmt(v)}</span>
      },
    },
  ], [])

  return (
    <div className="flex flex-col gap-5 max-w-350">
      <div>
        <h1 className="text-xl font-bold text-foreground">Finance & Cost Control</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Project cost allocation, budget variance, and payment tracking.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card className="shadow-none border-border"><CardContent className="p-3"><div className="flex items-center justify-between"><span className="text-[10px] uppercase font-semibold text-muted-foreground">Total Committed</span><IndianRupee className="size-3.5 text-primary" /></div><div className="text-xl font-bold mt-1">₹4.82 Cr</div><div className="flex items-center gap-1 mt-1 text-[10px] text-emerald-600"><TrendingUp className="size-3" /><span>Across 12 projects</span></div></CardContent></Card>
        <Card className="shadow-none border-border"><CardContent className="p-3"><div className="flex items-center justify-between"><span className="text-[10px] uppercase font-semibold text-muted-foreground">Actual Spend</span><IndianRupee className="size-3.5 text-foreground" /></div><div className="text-xl font-bold mt-1">₹1.52 Cr</div><div className="flex items-center gap-1 mt-1 text-[10px] text-amber-600"><TrendingDown className="size-3" /><span>+2.7% over plan</span></div></CardContent></Card>
        <Card className="shadow-none border-border"><CardContent className="p-3"><div className="flex items-center justify-between"><span className="text-[10px] uppercase font-semibold text-muted-foreground">Pending Liabilities</span><AlertTriangle className="size-3.5 text-amber-600" /></div><div className="text-xl font-bold mt-1">₹12.5L</div><div className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground"><span>Approved POs not paid</span></div></CardContent></Card>
        <Card className="shadow-none border-border"><CardContent className="p-3"><div className="flex items-center justify-between"><span className="text-[10px] uppercase font-semibold text-muted-foreground">Overdue Payments</span><AlertTriangle className="size-3.5 text-destructive" /></div><div className="text-xl font-bold mt-1 text-destructive">₹3.8L</div><div className="flex items-center gap-1 mt-1 text-[10px] text-destructive"><span>2 vendors overdue</span></div></CardContent></Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="shadow-none border-border col-span-2">
          <CardHeader className="px-5 py-4"><CardTitle className="text-sm font-semibold">Monthly Committed vs Actual (₹L)</CardTitle></CardHeader>
          <Separator />
          <CardContent className="px-5 py-4">
            <ChartContainer config={chartConfig} className="h-52 w-full">
              <BarChart data={profitData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}L`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="committed" fill="var(--color-chart-1)" radius={[3, 3, 0, 0]} maxBarSize={24} opacity={0.4} />
                <Bar dataKey="actual" fill="var(--color-chart-1)" radius={[3, 3, 0, 0]} maxBarSize={24} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-none border-border">
          <CardHeader className="px-5 py-4"><CardTitle className="text-sm font-semibold">Payment Tracker</CardTitle></CardHeader>
          <Separator />
          <CardContent className="p-0">
            {payments.map((p, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3.5 border-b border-border/50 hover:bg-muted/20 transition-colors">
                <div>
                  <div className="text-sm font-medium text-foreground">{p.vendor}</div>
                  <div className="text-[10px] text-muted-foreground font-mono mt-0.5">{p.po} · Due {p.due}</div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className="text-sm font-bold text-foreground">{fmt(p.amount)}</span>
                  <Badge variant="outline" className={`text-[9px] font-semibold px-1.5 h-4 ${p.status === 'Overdue' ? 'border-destructive/30 bg-destructive/8 text-destructive' : p.status === 'Due Soon' ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>{p.status}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-none border-border">
        <CardHeader className="flex flex-row items-center justify-between p-3">
          <CardTitle className="text-sm font-semibold">Cost Allocation per Project</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input placeholder="Search..." className="w-44 pl-8 h-7 text-xs" value={costSearch} onChange={(e) => setCostSearch(e.target.value)} />
            </div>
            <Button variant="ghost" size="icon" className="size-7"><MoreHorizontal className="size-3.5" /></Button>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="p-0 border-b-0">
          <DataTable columns={costCols} data={costAllocation} externalFilter={costSearch} onExternalFilterChange={setCostSearch} />
        </CardContent>
      </Card>
    </div>
  )
}
