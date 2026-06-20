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
import { Plus, ShoppingCart, Package, CheckCircle2, Clock, ArrowRight, Pencil, Trash2, Search } from 'lucide-react'

export const Route = createFileRoute('/procurement')({ component: ProcurementModule })

type Requisition = { id: string; material: string; qty: string; site: string; raised: string; date: string; status: string }
type PO = { id: string; vendor: string; material: string; site: string; amount: number; gstin: string; status: string; raised: string }

const SITES = ['SITE-014', 'SITE-015', 'SITE-012', 'SITE-016', 'Central Godown']
const MATERIALS = ['Ultratech Cement 50kg', 'TMT Steel Bar 12mm', 'River Sand', 'Red Bricks', 'Copper Wire 2.5mm']
const STATUSES_PO = ['Pending GRN', 'Partially Received', '3-Way Matched', 'Paid']

const initRequisitions: Requisition[] = [
  { id: 'REQ-2024-0078', material: 'Ultratech Cement 50kg', qty: '200 Bags', site: 'SITE-014', raised: 'Vikram S.', date: '2024-06-19', status: 'Approved' },
  { id: 'REQ-2024-0079', material: 'TMT Steel Bar 16mm', qty: '5 Tons', site: 'SITE-015', raised: 'Sanjay K.', date: '2024-06-18', status: 'Pending' },
  { id: 'REQ-2024-0076', material: 'River Sand (Fine)', qty: '30 Cu.M', site: 'SITE-012', raised: 'Suresh P.', date: '2024-06-17', status: 'PO Raised' },
]
const initPOs: PO[] = [
  { id: 'PO-2024-0142', vendor: 'BuildMart Ltd', material: 'Ultratech Cement 50kg', site: 'SITE-014', amount: 97400, gstin: '27AABCB1234M1Z5', status: 'Pending GRN', raised: '2024-06-18' },
  { id: 'PO-2024-0143', vendor: 'Tata Steel Direct', material: 'TMT Steel Bar 12mm', site: 'SITE-015', amount: 383500, gstin: '27AAACT2727Q1ZV', status: '3-Way Matched', raised: '2024-06-15' },
  { id: 'PO-2024-0141', vendor: 'Local Sand Co.', material: 'River Sand', site: 'SITE-012', amount: 37800, gstin: '27BBBCA1234M1Z5', status: 'Partially Received', raised: '2024-06-12' },
]

function POStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    '3-Way Matched': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Paid': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Pending GRN': 'bg-amber-50 text-amber-700 border-amber-200',
    'Partially Received': 'bg-blue-50 text-blue-700 border-blue-200',
  }
  return <Badge variant="outline" className={`text-[10px] font-semibold ${map[status] ?? ''}`}>{status}</Badge>
}

function ProcurementModule() {
  const [reqs, setReqs] = useState<Requisition[]>(initRequisitions)
  const [pos, setPOs] = useState<PO[]>(initPOs)
  const [showReq, setShowReq] = useState(false)
  const [showPO, setShowPO] = useState(false)
  const [editPO, setEditPO] = useState<PO | null>(null)
  const [deletePO, setDeletePO] = useState<PO | null>(null)
  const [deleteReq, setDeleteReq] = useState<Requisition | null>(null)

  const [reqForm, setReqForm] = useState({ material: '', qty: '', unit: 'Bags', site: SITES[0], raised: 'Vikram S.' })
  const [poForm, setPOForm] = useState({ vendor: '', material: '', site: SITES[0], amount: '', gstin: '' })

  function handleAddReq() {
    if (!reqForm.material || !reqForm.qty) return
    const id = `REQ-2024-${String(Math.floor(Math.random() * 900) + 100)}`
    setReqs((prev) => [{ id, material: reqForm.material, qty: `${reqForm.qty} ${reqForm.unit}`, site: reqForm.site, raised: reqForm.raised, date: new Date().toISOString().slice(0, 10), status: 'Pending' }, ...prev])
    setShowReq(false)
    setReqForm({ material: '', qty: '', unit: 'Bags', site: SITES[0], raised: 'Vikram S.' })
  }

  function handleAddPO() {
    if (!poForm.vendor || !poForm.amount) return
    const id = `PO-2024-${String(Math.floor(Math.random() * 900) + 100)}`
    setPOs((prev) => [{ id, vendor: poForm.vendor, material: poForm.material, site: poForm.site, amount: Number(poForm.amount), gstin: poForm.gstin, status: 'Pending GRN', raised: new Date().toISOString().slice(0, 10) }, ...prev])
    setShowPO(false)
    setPOForm({ vendor: '', material: '', site: SITES[0], amount: '', gstin: '' })
  }

  function handleEditPO() {
    if (!editPO) return
    setPOs((prev) => prev.map((p) => p.id === editPO.id ? editPO : p))
    setEditPO(null)
  }

  function approveReq(id: string) {
    setReqs((prev) => prev.map((r) => r.id === id ? { ...r, status: 'Approved' } : r))
  }

  return (
    <div className="flex flex-col gap-5 max-w-[1400px]">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Procurement & Vendors</h1>
          <p className="text-sm text-muted-foreground mt-0.5">PO lifecycle: Requisition → Approval → PO → GRN → 3-Way Match → Payment.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs" onClick={() => setShowReq(true)}>
            <Plus className="size-3.5" />Raise Requisition
          </Button>
          <Button size="sm" className="gap-1.5 h-8 text-xs" onClick={() => setShowPO(true)}>
            <Plus className="size-3.5" />Create PO
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card className="shadow-none border-border"><CardContent className="flex items-center gap-3 p-4"><div className="flex size-9 items-center justify-center rounded-lg bg-primary/8"><ShoppingCart className="size-4 text-primary" /></div><div><div className="text-2xl font-bold">{pos.length}</div><div className="text-xs text-muted-foreground">Open POs</div></div></CardContent></Card>
        <Card className="shadow-none border-border"><CardContent className="flex items-center gap-3 p-4"><div className="flex size-9 items-center justify-center rounded-lg bg-amber-50"><Clock className="size-4 text-amber-500" /></div><div><div className="text-2xl font-bold text-amber-500">{pos.filter((p) => p.status === 'Pending GRN').length}</div><div className="text-xs text-muted-foreground">Pending GRN</div></div></CardContent></Card>
        <Card className="shadow-none border-border"><CardContent className="flex items-center gap-3 p-4"><div className="flex size-9 items-center justify-center rounded-lg bg-emerald-50"><CheckCircle2 className="size-4 text-emerald-600" /></div><div><div className="text-2xl font-bold text-emerald-600">{pos.filter((p) => p.status === '3-Way Matched').length}</div><div className="text-xs text-muted-foreground">Matched</div></div></CardContent></Card>
        <Card className="shadow-none border-border"><CardContent className="flex items-center gap-3 p-4"><div className="flex size-9 items-center justify-center rounded-lg bg-muted"><Package className="size-4 text-muted-foreground" /></div><div><div className="text-2xl font-bold">{reqs.filter((r) => r.status === 'Pending').length}</div><div className="text-xs text-muted-foreground">Pending Reqs</div></div></CardContent></Card>
      </div>

      {/* Flow */}
      <div className="flex items-center gap-2 px-5 py-3 bg-primary/5 border border-primary/15 rounded-lg text-xs text-primary font-medium flex-wrap">
        {['Requisition', 'Approval', 'Purchase Order', 'GRN', '3-Way Match', 'Payment Release'].map((step, i, arr) => (
          <span key={step} className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded ${i === 4 ? 'bg-primary text-primary-foreground' : 'bg-primary/10'}`}>{step}</span>
            {i < arr.length - 1 && <ArrowRight className="size-3 text-primary/40" />}
          </span>
        ))}
      </div>

      <Tabs defaultValue="pos">
        <TabsList className="h-8">
          <TabsTrigger value="pos" className="text-xs">Purchase Orders ({pos.length})</TabsTrigger>
          <TabsTrigger value="req" className="text-xs">Requisitions ({reqs.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pos" className="mt-4">
          <Card className="shadow-none border-border">
            <CardHeader className="flex flex-row items-center justify-between px-5 py-4">
              <CardTitle className="text-sm font-semibold">Purchase Orders</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/20">
                    <th className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">PO Number</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Vendor</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Material / Site</th>
                    <th className="text-right px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Amount</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
                    <th className="text-right px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pos.map((po) => (
                    <tr key={po.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                      <td className="px-5 py-4"><div className="font-semibold text-primary text-xs font-mono">{po.id}</div><div className="text-[10px] text-muted-foreground">{po.raised}</div></td>
                      <td className="px-4 py-4"><div className="text-sm font-medium">{po.vendor}</div><div className="text-[10px] text-muted-foreground font-mono">{po.gstin}</div></td>
                      <td className="px-4 py-4"><div className="text-sm">{po.material}</div><div className="text-xs text-muted-foreground">{po.site}</div></td>
                      <td className="px-4 py-4 text-right"><span className="text-sm font-bold">₹{po.amount.toLocaleString('en-IN')}</span></td>
                      <td className="px-4 py-4"><POStatusBadge status={po.status} /></td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="size-7" onClick={() => setEditPO({ ...po })} title="Edit status"><Pencil className="size-3.5 text-muted-foreground" /></Button>
                          <Button variant="ghost" size="icon" className="size-7" onClick={() => setDeletePO(po)} title="Delete"><Trash2 className="size-3.5 text-destructive" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="req" className="mt-4">
          <Card className="shadow-none border-border">
            <CardHeader className="px-5 py-4"><CardTitle className="text-sm font-semibold">Purchase Requisitions</CardTitle></CardHeader>
            <Separator />
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/20">
                    <th className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">REQ ID</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Material / Qty</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Site / User</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
                    <th className="text-right px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reqs.map((r) => (
                    <tr key={r.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                      <td className="px-5 py-4"><div className="font-semibold text-primary text-xs font-mono">{r.id}</div><div className="text-[10px] text-muted-foreground">{r.date}</div></td>
                      <td className="px-4 py-4"><div className="text-sm font-medium">{r.material}</div><div className="text-xs text-muted-foreground">{r.qty}</div></td>
                      <td className="px-4 py-4"><div className="text-sm">{r.site}</div><div className="text-xs text-muted-foreground">{r.raised}</div></td>
                      <td className="px-4 py-4">
                        <Badge variant="outline" className={`text-[10px] font-semibold ${r.status === 'Approved' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : r.status === 'PO Raised' ? 'border-primary/20 bg-primary/8 text-primary' : 'border-amber-200 bg-amber-50 text-amber-700'}`}>
                          {r.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {r.status === 'Pending' && (
                            <Button size="sm" variant="outline" className="h-7 text-xs text-emerald-600 border-emerald-200" onClick={() => approveReq(r.id)}>Approve</Button>
                          )}
                          {r.status === 'Approved' && (
                            <Button size="sm" className="h-7 text-xs gap-1" onClick={() => { setPOForm({ vendor: '', material: r.material, site: r.site, amount: '', gstin: '' }); setShowPO(true) }}>
                              <Plus className="size-3" />Create PO
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" className="size-7" onClick={() => setDeleteReq(r)}><Trash2 className="size-3.5 text-destructive" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Requisition Dialog */}
      <Dialog open={showReq} onOpenChange={setShowReq}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Raise Purchase Requisition</DialogTitle></DialogHeader>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5"><Label className="text-xs">Material *</Label>
              <Select value={reqForm.material} onValueChange={(v) => setReqForm({ ...reqForm, material: v })}>
                <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>{MATERIALS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1.5"><Label className="text-xs">Quantity *</Label><Input className="h-8 text-sm" type="number" value={reqForm.qty} onChange={(e) => setReqForm({ ...reqForm, qty: e.target.value })} /></div>
              <div className="flex flex-col gap-1.5"><Label className="text-xs">Unit</Label><Input className="h-8 text-sm" value={reqForm.unit} onChange={(e) => setReqForm({ ...reqForm, unit: e.target.value })} /></div>
            </div>
            <div className="flex flex-col gap-1.5"><Label className="text-xs">Site</Label>
              <Select value={reqForm.site} onValueChange={(v) => setReqForm({ ...reqForm, site: v })}>
                <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>{SITES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5"><Label className="text-xs">Raised By</Label><Input className="h-8 text-sm" value={reqForm.raised} onChange={(e) => setReqForm({ ...reqForm, raised: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline" size="sm">Cancel</Button></DialogClose>
            <Button size="sm" onClick={handleAddReq} disabled={!reqForm.material || !reqForm.qty}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create PO Dialog */}
      <Dialog open={showPO} onOpenChange={setShowPO}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Create Purchase Order</DialogTitle></DialogHeader>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5"><Label className="text-xs">Vendor Name *</Label><Input className="h-8 text-sm" value={poForm.vendor} onChange={(e) => setPOForm({ ...poForm, vendor: e.target.value })} placeholder="e.g. BuildMart Ltd" /></div>
            <div className="flex flex-col gap-1.5"><Label className="text-xs">Vendor GSTIN</Label><Input className="h-8 text-sm font-mono" value={poForm.gstin} onChange={(e) => setPOForm({ ...poForm, gstin: e.target.value })} placeholder="27XXXXXX..." /></div>
            <div className="flex flex-col gap-1.5"><Label className="text-xs">Material</Label>
              <Select value={poForm.material} onValueChange={(v) => setPOForm({ ...poForm, material: v })}>
                <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>{MATERIALS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5"><Label className="text-xs">Delivery Site</Label>
              <Select value={poForm.site} onValueChange={(v) => setPOForm({ ...poForm, site: v })}>
                <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>{SITES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5"><Label className="text-xs">PO Amount (₹) *</Label><Input className="h-8 text-sm" type="number" value={poForm.amount} onChange={(e) => setPOForm({ ...poForm, amount: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline" size="sm">Cancel</Button></DialogClose>
            <Button size="sm" onClick={handleAddPO} disabled={!poForm.vendor || !poForm.amount}>Create PO</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit PO Status Dialog */}
      <Dialog open={!!editPO} onOpenChange={(o) => !o && setEditPO(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Update PO — {editPO?.id}</DialogTitle></DialogHeader>
          {editPO && (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5"><Label className="text-xs">Status</Label>
                <Select value={editPO.status} onValueChange={(v) => setEditPO({ ...editPO, status: v })}>
                  <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>{STATUSES_PO.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5"><Label className="text-xs">Vendor Name</Label><Input className="h-8 text-sm" value={editPO.vendor} onChange={(e) => setEditPO({ ...editPO, vendor: e.target.value })} /></div>
              <div className="flex flex-col gap-1.5"><Label className="text-xs">Amount (₹)</Label><Input className="h-8 text-sm" type="number" value={editPO.amount} onChange={(e) => setEditPO({ ...editPO, amount: Number(e.target.value) })} /></div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild><Button variant="outline" size="sm">Cancel</Button></DialogClose>
            <Button size="sm" onClick={handleEditPO}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete PO */}
      <AlertDialog open={!!deletePO} onOpenChange={(o) => !o && setDeletePO(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete {deletePO?.id}?</AlertDialogTitle>
            <AlertDialogDescription>This will remove the PO for <strong>{deletePO?.vendor}</strong>.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive hover:bg-destructive/90 text-destructive-foreground" onClick={() => { if (deletePO) { setPOs((p) => p.filter((po) => po.id !== deletePO.id)); setDeletePO(null) } }}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Req */}
      <AlertDialog open={!!deleteReq} onOpenChange={(o) => !o && setDeleteReq(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete {deleteReq?.id}?</AlertDialogTitle>
            <AlertDialogDescription>Remove this requisition for <strong>{deleteReq?.material}</strong>?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive hover:bg-destructive/90 text-destructive-foreground" onClick={() => { if (deleteReq) { setReqs((r) => r.filter((req) => req.id !== deleteReq.id)); setDeleteReq(null) } }}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
