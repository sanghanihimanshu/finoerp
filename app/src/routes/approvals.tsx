import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'
import { Separator } from '#/components/ui/separator'
import { Button } from '#/components/ui/button'
import { Label } from '#/components/ui/label'
import { Textarea } from '#/components/ui/textarea'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '#/components/ui/dialog'
import { DataTable, SortableHeader } from '#/components/ui/data-table'
import type { ColumnDef } from '@tanstack/react-table'
import { Input } from '#/components/ui/input'
import { Clock, CheckCircle2, XCircle, AlertCircle, Search } from 'lucide-react'

export const Route = createFileRoute('/approvals')({ component: ApprovalsModule })

type Approval = {
  id: string; type: string; subject: string; amount: number | null;
  from: string; to: string; waiting: string; priority: 'High' | 'Medium' | 'Low';
}
type HistoryItem = { id: string; type: string; subject: string; status: 'Approved' | 'Rejected' | 'Returned'; by: string; on: string; comment: string | null }

const initialPending: Approval[] = [
  { id: 'APR-0142', type: 'Purchase Order', subject: 'Ultratech Cement (200 Bags)', amount: 97400, from: 'Vikram S.', to: 'Amit Director', waiting: '1d 4h', priority: 'High' },
  { id: 'APR-0143', type: 'Drawing', subject: 'Structural Foundation Detail Rev 0', amount: null, from: 'Structural Team', to: 'Architect Lead', waiting: '5h', priority: 'Medium' },
  { id: 'APR-0139', type: 'Payment', subject: 'Tata Steel (3-Way Matched)', amount: 383500, from: 'Accounts', to: 'Amit Director', waiting: '3d', priority: 'High' },
  { id: 'APR-0141', type: 'Budget', subject: 'SITE-012 Labour Budget Revision', amount: 500000, from: 'Suresh PM', to: 'Amit Director', waiting: '12h', priority: 'Medium' },
  { id: 'APR-0145', type: 'Purchase Order', subject: 'Jindal TMT Rebar (10 Tons)', amount: 650000, from: 'Vikram S.', to: 'Amit Director', waiting: '2h', priority: 'High' },
]

const initialHistory: HistoryItem[] = [
  { id: 'APR-0138', type: 'Purchase Order', subject: 'PO-2024-0139 – Red Bricks', status: 'Approved', by: 'Amit Director', on: '2024-06-18', comment: 'Approved. Proceed with delivery.' },
  { id: 'APR-0137', type: 'Drawing', subject: 'Arch Floor Plan Tower A – Rev 1', status: 'Rejected', by: 'Architect Lead', on: '2024-06-17', comment: 'Staircase dimensions incorrect.' },
]

function TypeBadge({ type }: { type: string }) {
  const map: Record<string, string> = {
    'Purchase Order': 'bg-primary/10 text-primary border-primary/20',
    'Drawing': 'bg-violet-100 text-violet-800 border-violet-300',
    'Payment': 'bg-emerald-100 text-emerald-800 border-emerald-300',
    'Budget': 'bg-amber-100 text-amber-800 border-amber-300',
  }
  return <Badge variant="outline" className={`text-[10px] h-5 px-1.5 font-semibold ${map[type] ?? ''}`}>{type}</Badge>
}

function ApprovalsModule() {
  const [pending, setPending] = useState<Approval[]>(initialPending)
  const [history, setHistory] = useState<HistoryItem[]>(initialHistory)
  const [actionItem, setActionItem] = useState<{ item: Approval; action: 'approve' | 'reject' } | null>(null)
  const [comment, setComment] = useState('')
  const [pendingSearch, setPendingSearch] = useState('')
  const [historySearch, setHistorySearch] = useState('')

  function handleAction() {
    if (!actionItem) return
    const { item, action } = actionItem
    const record: HistoryItem = {
      id: item.id, type: item.type, subject: item.subject,
      status: action === 'approve' ? 'Approved' : 'Rejected',
      by: 'Amit Director', on: new Date().toISOString().slice(0, 10),
      comment: comment || null,
    }
    setHistory((prev) => [record, ...prev])
    setPending((prev) => prev.filter((p) => p.id !== item.id))
    setActionItem(null)
    setComment('')
  }

  const pendingColumns = useMemo<ColumnDef<Approval>[]>(() => [
    {
      id: 'select',
      header: () => <input type="checkbox" className="rounded border-muted-foreground/50 ml-1" />,
      cell: () => <input type="checkbox" className="rounded border-muted-foreground/50 ml-1" />,
      enableSorting: false,
    },
    {
      accessorKey: 'id',
      header: ({ column }) => <SortableHeader column={column} title="Ref ID" />,
      cell: ({ row }) => <div className="font-mono text-xs">{row.getValue('id')}</div>,
    },
    {
      accessorKey: 'type',
      header: ({ column }) => <SortableHeader column={column} title="Type" />,
      cell: ({ row }) => <TypeBadge type={row.getValue('type')} />,
    },
    {
      accessorKey: 'subject',
      header: ({ column }) => <SortableHeader column={column} title="Subject" />,
      cell: ({ row }) => {
        const priority = row.original.priority
        return (
          <div className="font-medium max-w-[200px] truncate" title={row.getValue('subject')}>
            {priority === 'High' ? <span className="text-destructive font-bold mr-1">!</span> : null}
            {row.getValue('subject')}
          </div>
        )
      },
    },
    {
      accessorKey: 'amount',
      header: ({ column }) => <div className="flex justify-end pr-4"><SortableHeader column={column} title="Value (₹)" /></div>,
      cell: ({ row }) => {
        const amount = row.getValue('amount') as number | null
        return <div className="text-right font-mono font-medium pr-4">{amount ? amount.toLocaleString('en-IN') : '--'}</div>
      },
    },
    {
      accessorKey: 'from',
      header: ({ column }) => <SortableHeader column={column} title="Requestor" />,
      cell: ({ row }) => <div className="text-xs">{row.getValue('from')}</div>,
    },
    {
      accessorKey: 'waiting',
      header: ({ column }) => <SortableHeader column={column} title="Waiting" />,
      cell: ({ row }) => <div className="text-xs text-amber-600 font-medium">{row.getValue('waiting')}</div>,
    },
    {
      id: 'actions',
      header: () => <div className="text-right pr-1">Action</div>,
      cell: ({ row }) => {
        const item = row.original
        return (
          <div className="flex items-center justify-end gap-1 pr-1">
            <Button size="sm" className="h-6 w-6 p-0 bg-emerald-600 hover:bg-emerald-700" title="Approve"
              onClick={(e) => { e.stopPropagation(); setActionItem({ item, action: 'approve' }); setComment('') }}>
              <CheckCircle2 className="size-3.5" />
            </Button>
            <Button size="sm" variant="outline" className="h-6 w-6 p-0 text-destructive border-destructive/30 hover:bg-destructive/10" title="Reject"
              onClick={(e) => { e.stopPropagation(); setActionItem({ item, action: 'reject' }); setComment('') }}>
              <XCircle className="size-3.5" />
            </Button>
          </div>
        )
      },
    },
  ], [])

  const historyColumns = useMemo<ColumnDef<HistoryItem>[]>(() => [
    {
      accessorKey: 'id',
      header: ({ column }) => <SortableHeader column={column} title="Ref ID" />,
      cell: ({ row }) => <div className="font-mono text-xs text-muted-foreground">{row.getValue('id')}</div>,
    },
    {
      accessorKey: 'type',
      header: ({ column }) => <SortableHeader column={column} title="Type" />,
      cell: ({ row }) => <span className="text-[10px] uppercase font-semibold text-muted-foreground">{row.getValue('type')}</span>,
    },
    {
      accessorKey: 'subject',
      header: ({ column }) => <SortableHeader column={column} title="Subject" />,
      cell: ({ row }) => <div className="text-xs max-w-[200px] truncate" title={row.getValue('subject')}>{row.getValue('subject')}</div>,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <SortableHeader column={column} title="Decision" />,
      cell: ({ row }) => {
        const status = row.getValue('status') as string
        if (status === 'Approved') return <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 uppercase tracking-wider"><CheckCircle2 className="size-2.5" /> Approved</span>
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold text-destructive bg-destructive/10 px-1.5 py-0.5 rounded border border-destructive/20 uppercase tracking-wider"><XCircle className="size-2.5" /> Rejected</span>
      },
    },
    {
      accessorKey: 'by',
      header: ({ column }) => <SortableHeader column={column} title="By" />,
      cell: ({ row }) => <div className="text-xs font-medium">{row.getValue('by')}</div>,
    },
    {
      accessorKey: 'on',
      header: ({ column }) => <SortableHeader column={column} title="Date" />,
      cell: ({ row }) => <div className="text-xs text-muted-foreground">{row.getValue('on')}</div>,
    },
    {
      accessorKey: 'comment',
      header: ({ column }) => <SortableHeader column={column} title="Comments" />,
      cell: ({ row }) => <div className="text-xs text-muted-foreground italic truncate max-w-[200px]" title={row.getValue('comment') ?? ''}>{row.getValue('comment') ?? '--'}</div>,
    },
  ], [])

  return (
    <div className="flex flex-col gap-3">
      {/* Dense Top Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="shadow-none border-border">
          <CardContent className="flex items-center gap-3 p-3">
            <div className="flex size-8 items-center justify-center rounded bg-amber-50"><Clock className="size-4 text-amber-600" /></div>
            <div className="flex flex-col leading-tight"><span className="text-lg font-bold text-amber-600">{pending.length}</span><span className="text-[10px] uppercase font-semibold text-muted-foreground">Pending</span></div>
          </CardContent>
        </Card>
        <Card className="shadow-none border-border">
          <CardContent className="flex items-center gap-3 p-3">
            <div className="flex size-8 items-center justify-center rounded bg-destructive/10"><AlertCircle className="size-4 text-destructive" /></div>
            <div className="flex flex-col leading-tight"><span className="text-lg font-bold text-destructive">{pending.filter((p) => p.priority === 'High').length}</span><span className="text-[10px] uppercase font-semibold text-muted-foreground">High Priority</span></div>
          </CardContent>
        </Card>
        <Card className="shadow-none border-border">
          <CardContent className="flex items-center gap-3 p-3">
            <div className="flex size-8 items-center justify-center rounded bg-emerald-50"><CheckCircle2 className="size-4 text-emerald-600" /></div>
            <div className="flex flex-col leading-tight"><span className="text-lg font-bold text-emerald-600">{history.filter((h) => h.status === 'Approved').length}</span><span className="text-[10px] uppercase font-semibold text-muted-foreground">Approved</span></div>
          </CardContent>
        </Card>
        <Card className="shadow-none border-border">
          <CardContent className="flex items-center gap-3 p-3">
            <div className="flex size-8 items-center justify-center rounded bg-muted"><XCircle className="size-4 text-muted-foreground" /></div>
            <div className="flex flex-col leading-tight"><span className="text-lg font-bold">{history.filter((h) => h.status === 'Rejected').length}</span><span className="text-[10px] uppercase font-semibold text-muted-foreground">Rejected</span></div>
          </CardContent>
        </Card>
      </div>

      {/* Main Data Area: Split vertically or stack densely */}
      <div className="flex flex-col gap-3">
        {/* Pending Action Table */}
        <Card className="shadow-none border-border">
          <CardHeader className="flex flex-row items-center justify-between p-3">
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-amber-600" />
              <CardTitle className="text-sm font-semibold">Action Required ({pending.length})</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <Input placeholder="Search approvals..." value={pendingSearch} onChange={e => setPendingSearch(e.target.value)} className="w-44 pl-8 h-7 text-xs" />
              </div>
              <Button variant="outline" size="sm" className="h-7 text-xs font-semibold">Bulk Approve</Button>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="p-0 border-b-0">
            <DataTable columns={pendingColumns} data={pending} externalFilter={pendingSearch} onExternalFilterChange={setPendingSearch} />
          </CardContent>
        </Card>

        {/* Audit Trail Table */}
        <Card className="shadow-none border-border">
          <CardHeader className="flex flex-row items-center justify-between p-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Recent Decisions</CardTitle>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input placeholder="Search audit log..." value={historySearch} onChange={e => setHistorySearch(e.target.value)} className="w-44 pl-8 h-7 text-xs" />
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="p-0 border-b-0">
            <DataTable columns={historyColumns} data={history} externalFilter={historySearch} onExternalFilterChange={setHistorySearch} />
          </CardContent>
        </Card>
      </div>

      {/* Approve / Reject Dialog */}
      <Dialog open={!!actionItem} onOpenChange={(o) => !o && setActionItem(null)}>
        <DialogContent className="max-w-md p-4 gap-4">
          <DialogHeader className="p-0">
            <DialogTitle className={actionItem?.action === 'approve' ? 'text-emerald-700 text-base' : 'text-destructive text-base'}>
              {actionItem?.action === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'} — {actionItem?.item.id}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <div className="rounded border border-border bg-muted/30 p-2 text-xs text-foreground font-medium">{actionItem?.item.subject}</div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Reason / Comment (Optional)</Label>
              <Textarea
                className="text-xs min-h-15 resize-none h-14"
                placeholder={actionItem?.action === 'approve' ? 'e.g. Rate approved.' : 'e.g. Budget exceeded.'}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setActionItem(null)}>Cancel</Button>
            <Button
              size="sm"
              className={`h-8 text-xs font-semibold ${actionItem?.action === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-destructive hover:bg-destructive/90'}`}
              onClick={handleAction}
            >
              {actionItem?.action === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
