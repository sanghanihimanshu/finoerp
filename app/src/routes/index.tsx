import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'
import { Separator } from '#/components/ui/separator'
import { Progress } from '#/components/ui/progress'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '#/components/ui/chart'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
} from 'recharts'
import {
  TrendingUp,
  TrendingDown,
  HardHat,
  AlertTriangle,
  Clock,
  BadgeCheck,
  MoreHorizontal,
  ArrowUpRight,
} from 'lucide-react'
import { Button } from '#/components/ui/button'

export const Route = createFileRoute('/')({ component: DashboardOverview })

const spendData = [
  { month: 'Jan', actual: 28, budget: 35 },
  { month: 'Feb', actual: 34, budget: 35 },
  { month: 'Mar', actual: 41, budget: 42 },
  { month: 'Apr', actual: 38, budget: 42 },
  { month: 'May', actual: 52, budget: 48 },
  { month: 'Jun', actual: 48, budget: 48 },
]

const procurement = [
  { month: 'Jan', po: 12 },
  { month: 'Feb', po: 18 },
  { month: 'Mar', po: 14 },
  { month: 'Apr', po: 22 },
  { month: 'May', po: 19 },
  { month: 'Jun', po: 26 },
]

const chartConfig = {
  actual: { label: 'Actual Spend', color: 'var(--color-chart-1)' },
  budget: { label: 'Budget', color: 'var(--color-chart-2)' },
  po: { label: 'POs Raised', color: 'var(--color-chart-1)' },
}

const topProjects = [
  { id: 'SITE-014', name: 'Skyline Towers', client: 'Apex Corp', pct: 75, spent: 45, budget: 60, status: 'On Track', delayed: false },
  { id: 'SITE-015', name: 'Riverfront Villas', client: 'Lakeside Dev', pct: 30, spent: 12, budget: 40, status: 'Delayed', delayed: true },
  { id: 'SITE-012', name: 'Metro Hub', client: 'City Transit', pct: 106, spent: 85, budget: 80, status: 'Overrun', delayed: true },
  { id: 'SITE-016', name: 'Tech Park Ph.1', client: 'Innovate IT', pct: 8, spent: 10, budget: 120, status: 'On Track', delayed: false },
]

const reorderItems = [
  { name: 'Ultratech Cement 50kg', qty: 45, reorder: 100, unit: 'Bags' },
  { name: 'TMT Steel Bar 12mm', qty: 2, reorder: 15, unit: 'Tons' },
  { name: 'River Sand', qty: 15, reorder: 50, unit: 'Cu.M' },
]

function StatCard({
  label,
  value,
  sub,
  trend,
  trendUp,
  icon: Icon,
  iconColor = 'text-primary',
}: {
  label: string
  value: string
  sub: string
  trend: string
  trendUp: boolean
  icon: React.ElementType
  iconColor?: string
}) {
  return (
    <Card className="shadow-none border-border">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">{label}</span>
            <span className="text-2xl font-bold tracking-tight text-foreground">{value}</span>
          </div>
          <div className={`flex size-9 items-center justify-center rounded-lg bg-primary/8 ${iconColor}`}>
            <Icon className="size-4" />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1.5">
          {trendUp ? (
            <ArrowUpRight className="size-3 text-emerald-500" />
          ) : (
            <TrendingDown className="size-3 text-destructive" />
          )}
          <span className={`text-xs font-semibold ${trendUp ? 'text-emerald-600' : 'text-destructive'}`}>
            {trend}
          </span>
          <span className="text-xs text-muted-foreground">{sub}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function DashboardOverview() {
  return (
    <div className="flex flex-col gap-5 max-w-[1400px]">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Management Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Welcome back, Amit. Here's what needs your attention today.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted rounded-md px-3 py-1.5">
          <Clock className="size-3" />
          <span>Last updated: just now</span>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Project Budget"
          value="₹4.82 Cr"
          sub="across 12 active sites"
          trend="+2 sites this month"
          trendUp
          icon={HardHat}
        />
        <StatCard
          label="Total Actual Spend"
          value="₹1.52 Cr"
          sub="vs ₹1.48 Cr planned"
          trend="+2.7% over plan"
          trendUp={false}
          icon={TrendingUp}
          iconColor="text-amber-500"
        />
        <StatCard
          label="Delayed Projects"
          value="2"
          sub="impacting critical path"
          trend="Same as last month"
          trendUp={false}
          icon={AlertTriangle}
          iconColor="text-destructive"
        />
        <StatCard
          label="Pending Approvals"
          value="18"
          sub="POs, drawings & payments"
          trend="6 new today"
          trendUp={false}
          icon={BadgeCheck}
          iconColor="text-primary"
        />
      </div>

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Spend chart - wide */}
        <Card className="shadow-none border-border col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5 px-5">
            <div>
              <CardTitle className="text-sm font-semibold text-foreground">Budget vs Actual Spend</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Monthly comparison across all active projects</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="inline-block size-2 rounded-full bg-primary" />
                Actual
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block size-2 rounded-full bg-chart-2" />
                Budget
              </span>
              <Button variant="ghost" size="icon" className="size-6">
                <MoreHorizontal className="size-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-4">
            <ChartContainer config={chartConfig} className="h-48 w-full">
              <AreaChart data={spendData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="budgetGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-chart-2)" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}L`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="budget" stroke="var(--color-chart-2)" strokeWidth={1.5} strokeDasharray="4 2" fill="url(#budgetGrad)" dot={false} />
                <Area type="monotone" dataKey="actual" stroke="var(--color-chart-1)" strokeWidth={2} fill="url(#actualGrad)" dot={false} activeDot={{ r: 4, fill: 'var(--color-chart-1)' }} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* PO chart */}
        <Card className="shadow-none border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5 px-5">
            <div>
              <CardTitle className="text-sm font-semibold text-foreground">POs Raised</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Monthly procurement activity</p>
            </div>
            <Button variant="ghost" size="icon" className="size-6">
              <MoreHorizontal className="size-3" />
            </Button>
          </CardHeader>
          <CardContent className="px-5 pb-4">
            <ChartContainer config={chartConfig} className="h-48 w-full">
              <BarChart data={procurement} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="po" fill="var(--color-chart-1)" radius={[3, 3, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom tables row */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Top Projects */}
        <Card className="shadow-none border-border">
          <CardHeader className="flex flex-row items-center justify-between px-5 py-4">
            <CardTitle className="text-sm font-semibold text-foreground">Top Projects</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Last Month</span>
              <Button variant="ghost" size="icon" className="size-6">
                <MoreHorizontal className="size-3" />
              </Button>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-2.5 text-xs font-medium text-muted-foreground">#</th>
                  <th className="text-left px-3 py-2.5 text-xs font-medium text-muted-foreground">Project</th>
                  <th className="text-left px-3 py-2.5 text-xs font-medium text-muted-foreground">Spend</th>
                  <th className="text-right px-5 py-2.5 text-xs font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {topProjects.map((p, i) => (
                  <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3 text-xs text-muted-foreground">{i + 1}</td>
                    <td className="px-3 py-3">
                      <div className="font-medium text-sm text-foreground">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.client}</div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-primary">₹{p.spent}L / ₹{p.budget}L</span>
                      </div>
                      <Progress
                        value={Math.min(p.pct, 100)}
                        className={`h-1 mt-1.5 w-24 ${p.pct > 100 ? '[&>div]:bg-destructive' : p.pct > 90 ? '[&>div]:bg-amber-500' : ''}`}
                      />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Badge
                        variant={p.status === 'On Track' ? 'outline' : p.status === 'Overrun' ? 'destructive' : 'secondary'}
                        className={`text-[10px] font-semibold ${
                          p.status === 'On Track'
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                            : p.status === 'Delayed'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : ''
                        }`}
                      >
                        {p.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Low Stock */}
        <Card className="shadow-none border-border">
          <CardHeader className="flex flex-row items-center justify-between px-5 py-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-4 text-amber-500" />
              <CardTitle className="text-sm font-semibold text-foreground">Reorder Alerts</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Live</span>
              <span className="inline-flex size-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="p-0">
            {reorderItems.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-5 py-4 border-b border-border/50 hover:bg-muted/30 transition-colors"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-foreground">{item.name}</span>
                  <span className="text-xs text-muted-foreground">Reorder at: {item.reorder} {item.unit}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="destructive" className="text-xs font-bold">
                    {item.qty} {item.unit}
                  </Badge>
                </div>
              </div>
            ))}
            <div className="px-5 py-3">
              <Button variant="ghost" className="w-full text-xs text-primary hover:text-primary h-7">
                View full inventory →
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
