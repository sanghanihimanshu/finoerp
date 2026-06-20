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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '#/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '#/components/ui/alert-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { PackagePlus, ArrowRightLeft, AlertTriangle, Package, Search, Pencil, Trash2, Plus, TrendingUp } from 'lucide-react'

export const Route = createFileRoute('/materials')({ component: MaterialsModule })

type Material = {
  sku: string; name: string; category: string; hsn: string; gst: number;
  rateBase: number; rateGst: number; centralStock: number; siteStock: number;
  reorder: number; unit: string; supplier: string;
}

type Movement = {
  id: number; date: string; type: 'IN' | 'OUT' | 'TRANSFER';
  material: string; site: string; qty: string; user: string;
}

const CATEGORIES = ['Cement', 'Steel', 'Aggregate', 'Bricks', 'Electrical', 'Plumbing', 'Finishing']
const SITES = ['Central Godown', 'SITE-014', 'SITE-015', 'SITE-012', 'SITE-016']

const initialInventory: Material[] = [
  { sku: 'MAT-CEM-001', name: 'Ultratech Cement 50kg', category: 'Cement', hsn: '25232910', gst: 28, rateBase: 380, rateGst: 487, centralStock: 450, siteStock: 120, reorder: 500, unit: 'Bags', supplier: 'BuildMart Ltd' },
  { sku: 'MAT-STL-012', name: 'TMT Steel Bar 12mm', category: 'Steel', hsn: '72142090', gst: 18, rateBase: 65000, rateGst: 76700, centralStock: 2, siteStock: 8, reorder: 15, unit: 'Tons', supplier: 'Tata Steel Direct' },
  { sku: 'MAT-AGG-003', name: 'River Sand (Fine)', category: 'Aggregate', hsn: '25059000', gst: 5, rateBase: 1200, rateGst: 1260, centralStock: 0, siteStock: 15, reorder: 50, unit: 'Cu.M', supplier: 'Local Sand Co.' },
  { sku: 'MAT-BRK-001', name: 'Red Bricks 9×4×3"', category: 'Bricks', hsn: '69041000', gst: 5, rateBase: 8, rateGst: 9, centralStock: 1200, siteStock: 4500, reorder: 5000, unit: 'Pcs', supplier: 'Ganga Brick Kiln' },
  { sku: 'MAT-ELE-045', name: 'Copper Wire 2.5mm', category: 'Electrical', hsn: '85444999', gst: 18, rateBase: 1400, rateGst: 1652, centralStock: 80, siteStock: 10, reorder: 20, unit: 'Rolls', supplier: 'Polycab Dist.' },
]

const initialLedger: Movement[] = [
  { id: 1, date: '2024-06-19 10:22', type: 'IN', material: 'Ultratech Cement 50kg', site: 'Central Godown', qty: '+500', user: 'Rahul M.' },
  { id: 2, date: '2024-06-19 09:45', type: 'OUT', material: 'TMT Steel Bar 12mm', site: 'SITE-014', qty: '-2.5 Tons', user: 'Vikram S.' },
  { id: 3, date: '2024-06-18 16:10', type: 'TRANSFER', material: 'Red Bricks 9×4×3"', site: 'Central → SITE-015', qty: '10,000 Pcs', user: 'Sanjay K.' },
]

const emptyMat = (): Omit<Material, 'sku'> => ({
  name: '', category: 'Cement', hsn: '', gst: 18,
  rateBase: 0, rateGst: 0, centralStock: 0, siteStock: 0,
  reorder: 0, unit: 'Bags', supplier: '',
})

function CategoryChip({ cat }: { cat: string }) {
  const map: Record<string, string> = {
    Cement: 'bg-slate-100 text-slate-700', Steel: 'bg-blue-50 text-blue-700',
    Aggregate: 'bg-yellow-50 text-yellow-700', Bricks: 'bg-orange-50 text-orange-700',
    Electrical: 'bg-violet-50 text-violet-700', Plumbing: 'bg-cyan-50 text-cyan-700', Finishing: 'bg-pink-50 text-pink-700',
  }
  return <span className={`inline-flex items-center rounded-sm px-1.5 py-0.5 text-[10px] font-semibold ${map[cat] ?? 'bg-muted text-muted-foreground'}`}>{cat}</span>
}

function MaterialsModule() {
  const [inventory, setInventory] = useState<Material[]>(initialInventory)
  const [ledger, setLedger] = useState<Movement[]>(initialLedger)
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [editMat, setEditMat] = useState<Material | null>(null)
  const [deleteMat, setDeleteMat] = useState<Material | null>(null)
  const [showMove, setShowMove] = useState(false)
  const [matForm, setMatForm] = useState(emptyMat())
  const [moveForm, setMoveForm] = useState({ type: 'IN' as 'IN' | 'OUT' | 'TRANSFER', material: '', site: SITES[0], qty: '', user: 'Amit Director' })

  const filtered = inventory.filter(
    (i) => i.name.toLowerCase().includes(search.toLowerCase()) || i.sku.toLowerCase().includes(search.toLowerCase())
  )
  const lowStock = inventory.filter((i) => i.centralStock + i.siteStock <= i.reorder)

  function nextSku() {
    return `MAT-NEW-${String(inventory.length + 1).padStart(3, '0')}`
  }

  function handleAdd() {
    if (!matForm.name) return
    setInventory((prev) => [{ ...matForm, sku: nextSku() }, ...prev])
    setShowAdd(false); setMatForm(emptyMat())
  }

  function handleEdit() {
    if (!editMat) return
    setInventory((prev) => prev.map((m) => m.sku === editMat.sku ? editMat : m))
    setEditMat(null)
  }

  function handleDelete() {
    if (!deleteMat) return
    setInventory((prev) => prev.filter((m) => m.sku !== deleteMat.sku))
    setDeleteMat(null)
  }

  function handleMove() {
    if (!moveForm.material || !moveForm.qty) return
    const newEntry: Movement = {
      id: Date.now(), date: new Date().toLocaleString('sv').replace('T', ' ').slice(0, 16),
      type: moveForm.type, material: moveForm.material, site: moveForm.site,
      qty: moveForm.type === 'IN' ? `+${moveForm.qty}` : `-${moveForm.qty}`, user: moveForm.user,
    }
    setLedger((prev) => [newEntry, ...prev])
    setInventory((prev) => prev.map((m) => {
      if (m.name !== moveForm.material) return m
      const q = Number(moveForm.qty)
      if (moveForm.type === 'IN') return { ...m, centralStock: m.centralStock + q }
      if (moveForm.type === 'OUT') return { ...m, siteStock: Math.max(0, m.siteStock - q) }
      return m
    }))
    setShowMove(false)
    setMoveForm({ type: 'IN', material: '', site: SITES[0], qty: '', user: 'Amit Director' })
  }

  function MatForm({ value, onChange }: { value: typeof matForm; onChange: (v: typeof matForm) => void }) {
    const s = (k: keyof typeof value, v: string | number) => onChange({ ...value, [k]: v })
    return (
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 flex flex-col gap-1.5">
          <Label className="text-xs">Material Name *</Label>
          <Input className="h-8 text-sm" value={value.name} onChange={(e) => s('name', e.target.value)} placeholder="e.g. OPC Cement 43 Grade" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs">Category</Label>
          <Select value={value.category} onValueChange={(v) => s('category', v)}>
            <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs">Unit</Label>
          <Input className="h-8 text-sm" value={value.unit} onChange={(e) => s('unit', e.target.value)} placeholder="Bags / Tons / Cu.M" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs">HSN Code</Label>
          <Input className="h-8 text-sm font-mono" value={value.hsn} onChange={(e) => s('hsn', e.target.value)} placeholder="e.g. 25232910" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs">GST %</Label>
          <Select value={String(value.gst)} onValueChange={(v) => s('gst', Number(v))}>
            <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              {[5, 12, 18, 28].map((g) => <SelectItem key={g} value={String(g)}>{g}%</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs">Rate (ex-GST ₹)</Label>
          <Input className="h-8 text-sm" type="number" value={value.rateBase || ''} onChange={(e) => s('rateBase', Number(e.target.value))} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs">Reorder Level</Label>
          <Input className="h-8 text-sm" type="number" value={value.reorder || ''} onChange={(e) => s('reorder', Number(e.target.value))} />
        </div>
        <div className="col-span-2 flex flex-col gap-1.5">
          <Label className="text-xs">Supplier</Label>
          <Input className="h-8 text-sm" value={value.supplier} onChange={(e) => s('supplier', e.target.value)} placeholder="e.g. BuildMart Ltd" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5 max-w-[1400px]">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Materials & Inventory</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Central + site-level stock with HSN/GST compliance.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs" onClick={() => setShowMove(true)}>
            <ArrowRightLeft className="size-3.5" />Log Movement
          </Button>
          <Button size="sm" className="gap-1.5 h-8 text-xs" onClick={() => { setMatForm(emptyMat()); setShowAdd(true) }}>
            <PackagePlus className="size-3.5" />Add Material
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card className="shadow-none border-border">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/8"><Package className="size-4 text-primary" /></div>
            <div><div className="text-2xl font-bold">{inventory.length}</div><div className="text-xs text-muted-foreground">Total SKUs</div></div>
          </CardContent>
        </Card>
        <Card className="shadow-none border-border">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-9 items-center justify-center rounded-lg bg-destructive/8"><AlertTriangle className="size-4 text-destructive" /></div>
            <div><div className="text-2xl font-bold text-destructive">{lowStock.length}</div><div className="text-xs text-muted-foreground">Reorder Alerts</div></div>
          </CardContent>
        </Card>
        <Card className="shadow-none border-border">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-50"><TrendingUp className="size-4 text-emerald-600" /></div>
            <div><div className="text-2xl font-bold">{ledger.length}</div><div className="text-xs text-muted-foreground">Total Movements</div></div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="inventory">
        <TabsList className="h-8 text-xs">
          <TabsTrigger value="inventory" className="text-xs">Live Inventory</TabsTrigger>
          <TabsTrigger value="ledger" className="text-xs">Movement Ledger</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="mt-4">
          <Card className="shadow-none border-border">
            <CardHeader className="flex flex-row items-center justify-between px-5 py-4">
              <CardTitle className="text-sm font-semibold">Material Catalog</CardTitle>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <Input placeholder="Search SKU or name..." className="w-52 pl-8 h-8 text-xs" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/20">
                    <th className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Material</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">HSN / GST</th>
                    <th className="text-right px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Rate (ex/inc GST)</th>
                    <th className="text-right px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Central</th>
                    <th className="text-right px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Sites / Total</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Supplier</th>
                    <th className="text-right px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr><td colSpan={7} className="py-8 text-center text-sm text-muted-foreground">No materials found.</td></tr>
                  )}
                  {filtered.map((item) => {
                    const total = item.centralStock + item.siteStock
                    const isLow = total <= item.reorder
                    return (
                      <tr key={item.sku} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                        <td className="px-5 py-4">
                          <div className="font-medium text-foreground text-sm">{item.name}</div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] text-muted-foreground font-mono">{item.sku}</span>
                            <CategoryChip cat={item.category} />
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-xs font-mono text-foreground">{item.hsn}</div>
                          <div className="text-xs text-muted-foreground">GST {item.gst}%</div>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="text-sm font-semibold">₹{item.rateBase.toLocaleString('en-IN')}</div>
                          <div className="text-xs text-muted-foreground">₹{item.rateGst.toLocaleString('en-IN')} inc</div>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className={`text-sm font-bold ${item.centralStock === 0 ? 'text-destructive' : ''}`}>{item.centralStock}</span>
                          <div className="text-[10px] text-muted-foreground">{item.unit}</div>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className={`text-sm font-bold ${isLow ? 'text-destructive' : ''}`}>{total}</span>
                          <div className="text-[10px] text-muted-foreground">{item.unit} total</div>
                          {isLow && <Badge variant="destructive" className="text-[9px] font-bold h-3.5 px-1 mt-0.5">LOW</Badge>}
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-xs">{item.supplier}</div>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="size-7" onClick={() => setEditMat({ ...item })} title="Edit">
                              <Pencil className="size-3.5 text-muted-foreground" />
                            </Button>
                            <Button variant="ghost" size="icon" className="size-7" onClick={() => setDeleteMat(item)} title="Delete">
                              <Trash2 className="size-3.5 text-destructive" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ledger" className="mt-4">
          <Card className="shadow-none border-border">
            <CardHeader className="flex flex-row items-center justify-between px-5 py-4">
              <CardTitle className="text-sm font-semibold">Movement Ledger</CardTitle>
              <Button size="sm" className="gap-1.5 h-8 text-xs" onClick={() => setShowMove(true)}>
                <Plus className="size-3.5" />Record Movement
              </Button>
            </CardHeader>
            <Separator />
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/20">
                    <th className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Date & Time</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Type</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Material</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Location</th>
                    <th className="text-right px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Qty</th>
                    <th className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">User</th>
                  </tr>
                </thead>
                <tbody>
                  {ledger.map((l) => (
                    <tr key={l.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                      <td className="px-5 py-3 text-xs text-muted-foreground font-mono">{l.date}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={`text-[10px] font-semibold ${l.type === 'IN' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : l.type === 'OUT' ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-amber-200 bg-amber-50 text-amber-700'}`}>
                          {l.type === 'IN' ? '↓ Stock In' : l.type === 'OUT' ? '↑ Stock Out' : '⇄ Transfer'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">{l.material}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{l.site}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`text-sm font-bold ${l.type === 'IN' ? 'text-emerald-600' : l.type === 'OUT' ? 'text-blue-600' : 'text-amber-600'}`}>{l.qty}</span>
                      </td>
                      <td className="px-5 py-3 text-xs text-muted-foreground">{l.user}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Material Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Add Material</DialogTitle></DialogHeader>
          <MatForm value={matForm} onChange={setMatForm} />
          <DialogFooter>
            <DialogClose asChild><Button variant="outline" size="sm">Cancel</Button></DialogClose>
            <Button size="sm" onClick={handleAdd} disabled={!matForm.name}>Add Material</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Material Dialog */}
      <Dialog open={!!editMat} onOpenChange={(o) => !o && setEditMat(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Edit — {editMat?.sku}</DialogTitle></DialogHeader>
          {editMat && <MatForm value={editMat} onChange={(v) => setEditMat({ ...editMat, ...v })} />}
          <DialogFooter>
            <DialogClose asChild><Button variant="outline" size="sm">Cancel</Button></DialogClose>
            <Button size="sm" onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteMat} onOpenChange={(o) => !o && setDeleteMat(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteMat?.sku}?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently remove <strong>{deleteMat?.name}</strong> from the catalog.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive hover:bg-destructive/90 text-destructive-foreground" onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Log Movement Dialog */}
      <Dialog open={showMove} onOpenChange={setShowMove}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Log Stock Movement</DialogTitle></DialogHeader>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Movement Type</Label>
              <Select value={moveForm.type} onValueChange={(v) => setMoveForm({ ...moveForm, type: v as 'IN' | 'OUT' | 'TRANSFER' })}>
                <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="IN">↓ Stock In (Delivery)</SelectItem>
                  <SelectItem value="OUT">↑ Stock Out (Site Consumption)</SelectItem>
                  <SelectItem value="TRANSFER">⇄ Transfer (Central → Site)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Material *</Label>
              <Select value={moveForm.material} onValueChange={(v) => setMoveForm({ ...moveForm, material: v })}>
                <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Select material..." /></SelectTrigger>
                <SelectContent>{inventory.map((m) => <SelectItem key={m.sku} value={m.name}>{m.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Site / Location</Label>
              <Select value={moveForm.site} onValueChange={(v) => setMoveForm({ ...moveForm, site: v })}>
                <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>{SITES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Quantity *</Label>
              <Input className="h-8 text-sm" type="number" value={moveForm.qty} onChange={(e) => setMoveForm({ ...moveForm, qty: e.target.value })} placeholder="e.g. 50" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline" size="sm">Cancel</Button></DialogClose>
            <Button size="sm" onClick={handleMove} disabled={!moveForm.material || !moveForm.qty}>Record</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
