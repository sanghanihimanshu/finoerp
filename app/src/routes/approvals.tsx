import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'
import { Separator } from '#/components/ui/separator'
import { Button } from '#/components/ui/button'
import { Label } from '#/components/ui/label'
import { Textarea } from '#/components/ui/textarea'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from '#/components/ui/dialog'
import { CheckSquare, Clock, CheckCircle2, XCircle, AlertCircle, MoreHorizontal } from 'lucide-react'

export const Route = createFileRoute('/approvals')({ component: ApprovalsModule })

type Approval = {
  id: string; type: string; subject: string; amount: number | null;
  from: string; to: string; waiting: string; priority: 'High' | 'Medium' | 'Low';
}
type HistoryItem = { id: string; type: string; subject: string; status: 'Approved' | 'Rejected' | 'Returned'; by: string; on: string; comment: string | null }

const initialPending: Approval[] = [
  { id: 'APR-0142', type: 'Purchase Order', subject: 'PO-2024-0142 – Ultratech Cement (200 Bags)', amount: 97400, from: 'Vikram S.', to: 'Amit Director', waiting: '1d 4h', priority: 'High' },
  { id: 'APR-0143', type: 'Drawing Approval', subject: 'Structural Foundation Detail – SITE-014 Rev 0', amount: null, from: 'Structural Team', to: 'Architect Lead', waiting: '5h', priority: 'Medium' },
  { id: 'APR-0139', type: 'Payment Release', subject: 'PO-2024-0138 – Tata Steel (3-Way Matched)', amount: 383500, from: 'Accounts', to: 'Amit Director', waiting: '3d', priority: 'High' },
  { id: 'APR-0141', type: 'Budget Revision', subject: 'SITE-012 Labour Budget +₹5L revision request', amount: 500000, from: 'Suresh PM', to: 'Amit Director', waiting: '12h', priority: 'Medium' },
]
const initialHistory: HistoryItem[] = [
  { id: 'APR-0138', type: 'Purchase Order', subject: 'PO-2024-0139 – Red Bricks (₹80K)', status: 'Approved', by: 'Amit Director', on: '2024-06-18', comment: 'Approved. Proceed with delivery.' },
  { id: 'APR-0137', type: 'Drawing Approval', subject: 'Arch Floor Plan Tower A – Rev 1', status: 'Rejected', by: 'Architect Lead', on: '2024-06-17', comment: 'Staircase dimensions incorrect. Return for revision.' },
]

function TypeBadge({ type }: { type: string }) {
  const map: Record<string, string> = {
    'Purchase Order': 'bg-primary/8 text-primary border-primary/15',
    'Drawing Approval': 'bg-violet-50 text-violet-700 border-violet-200',
    'Payment Release': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Budget Revision': 'bg-amber-50 text-amber-700 border-amber-200',
  }
  return <Badge variant="outline" className={`text-[10px] font-semibold ${map[type] ?? ''}`}>{type}</Badge>
}

function ApprovalsModule() {
  const [pending, setPending] = useState<Approval[]>(initialPending)
  const [history, setHistory] = useState<HistoryItem[]>(initialHistory)
  const [actionItem, setActionItem] = useState<{ item: Approval; action: 'approve' | 'reject' } | null>(null)
  const [comment, setComment] = useState('')

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

  return (
    <div className="flex flex-col gap-5 max-w-[1400px]">
      <div>
        <h1 className="text-xl font-bold text-foreground">Approvals Workflow</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage sign-offs for POs, drawings, budgets, and payments.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card className="shadow-none border-border"><CardContent className="flex items-center gap-3 p-4"><div className="flex size-9 items-center justify-center rounded-lg bg-amber-50"><Clock className="size-4 text-amber-500" /></div><div><div className="text-2xl font-bold text-amber-500">{pending.length}</div><div className="text-xs text-muted-foreground">Pending</div></div></CardContent></Card>
        <Card className="shadow-none border-border"><CardContent className="flex items-center gap-3 p-4"><div className="flex size-9 items-center justify-center rounded-lg bg-destructive/8"><AlertCircle className="size-4 text-destructive" /></div><div><div className="text-2xl font-bold text-destructive">{pending.filter((p) => p.priority === 'High').length}</div><div className="text-xs text-muted-foreground">High Priority</div></div></CardContent></Card>
        <Card className="shadow-none border-border"><CardContent className="flex items-center gap-3 p-4"><div className="flex size-9 items-center justify-center rounded-lg bg-emerald-50"><CheckCircle2 className="size-4 text-emerald-600" /></div><div><div className="text-2xl font-bold text-emerald-600">{history.filter((h) => h.status === 'Approved').length}</div><div className="text-xs text-muted-foreground">Approved</div></div></CardContent></Card>
        <Card className="shadow-none border-border"><CardContent className="flex items-center gap-3 p-4"><div className="flex size-9 items-center justify-center rounded-lg bg-muted"><XCircle className="size-4 text-muted-foreground" /></div><div><div className="text-2xl font-bold">{history.filter((h) => h.status === 'Rejected').length}</div><div className="text-xs text-muted-foreground">Rejected</div></div></CardContent></Card>
      </div>

      <Card className="shadow-none border-border">
        <CardHeader className="flex flex-row items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-amber-500" />
            <CardTitle className="text-sm font-semibold">Pending Approvals</CardTitle>
          </div>
          {pending.length > 0 && (
            <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-xs font-bold" variant="outline">{pending.length} items</Badge>
          )}
        </CardHeader>
        <Separator />
        <CardContent className="p-0">
          {pending.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <CheckSquare className="size-10 mb-3 text-emerald-400" />
              <p className="text-sm font-medium">All caught up!</p>
              <p className="text-xs mt-1">No pending approvals at this time.</p>
            </div>
          )}
          {pending.map((item) => (
            <div key={item.id} className="flex items-center gap-4 px-5 py-4 border-b border-border/50 hover:bg-muted/20 transition-colors">
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <TypeBadge type={item.type} />
                  {item.priority === 'High' && <span className="text-[10px] text-destructive font-bold">● HIGH PRIORITY</span>}
                </div>
                <div className="text-sm font-medium text-foreground truncate">{item.subject}</div>
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span>From: <strong className="text-foreground">{item.from}</strong></span>
                  <span>→ To: <strong className="text-foreground">{item.to}</strong></span>
                  <span>· Waiting {item.waiting}</span>
                </div>
              </div>
              {item.amount && <div className="text-sm font-bold text-foreground shrink-0">₹{item.amount.toLocaleString('en-IN')}</div>}
              <div className="flex items-center gap-2 shrink-0">
                <Button size="sm" className="h-7 text-xs gap-1 bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => { setActionItem({ item, action: 'approve' }); setComment('') }}>
                  <CheckCircle2 className="size-3" />Approve
                </Button>
                <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-destructive border-destructive/30 hover:bg-destructive/8"
                  onClick={() => { setActionItem({ item, action: 'reject' }); setComment('') }}>
                  <XCircle className="size-3" />Reject
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="shadow-none border-border">
        <CardHeader className="px-5 py-4">
          <CardTitle className="text-sm font-semibold">Approval Audit Trail</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="p-0">
          {history.length === 0 && (
            <div className="py-8 text-center text-sm text-muted-foreground">No decisions recorded yet.</div>
          )}
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">ID</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Item</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Decision</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">By / Date</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Comments</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-3 text-xs text-muted-foreground font-mono">{h.id}</td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-foreground">{h.subject}</div>
                    <TypeBadge type={h.type} />
                  </td>
                  <td className="px-4 py-3">
                    {h.status === 'Approved' ? (
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-semibold gap-1" variant="outline"><CheckCircle2 className="size-2.5" />Approved</Badge>
                    ) : (
                      <Badge className="bg-destructive/8 text-destructive border-destructive/20 text-[10px] font-semibold gap-1" variant="outline"><XCircle className="size-2.5" />Rejected</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3"><div className="text-xs font-medium">{h.by}</div><div className="text-[10px] text-muted-foreground">{h.on}</div></td>
                  <td className="px-5 py-3 text-xs text-muted-foreground italic">{h.comment ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Approve / Reject Dialog */}
      <Dialog open={!!actionItem} onOpenChange={(o) => !o && setActionItem(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className={actionItem?.action === 'approve' ? 'text-emerald-700' : 'text-destructive'}>
              {actionItem?.action === 'approve' ? '✓ Approve' : '✗ Reject'} — {actionItem?.item.id}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <div className="rounded-lg bg-muted/50 p-3 text-sm text-foreground">{actionItem?.item.subject}</div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Comment (optional)</Label>
              <Textarea
                className="text-sm min-h-20 resize-none"
                placeholder={actionItem?.action === 'approve' ? 'e.g. Approved. Proceed as planned.' : 'e.g. Rate too high, get another quote.'}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline" size="sm">Cancel</Button></DialogClose>
            <Button
              size="sm"
              className={actionItem?.action === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-destructive hover:bg-destructive/90'}
              onClick={handleAction}
            >
              Confirm {actionItem?.action === 'approve' ? 'Approval' : 'Rejection'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
