import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'
import { Separator } from '#/components/ui/separator'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '#/components/ui/alert'
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
import { FileText, Search, Upload, AlertCircle, History, Download, CheckCircle2, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'

export const Route = createFileRoute('/documents')({ component: DocumentsModule })

type Doc = {
  id: string; name: string; site: string; category: string;
  rev: number; status: string; expiry: string | null; size: string;
}

const SITES = ['SITE-014', 'SITE-015', 'SITE-012', 'SITE-016', 'Global']
const DOC_CATS = ['Architectural', 'Structural', 'Permit', 'Contract', 'Soil Report', 'Site Photos']
const DOC_STATUSES = ['Draft', 'Submitted', 'Under Review', 'Approved', 'Rejected']

const categories = [
  { label: 'All Documents', key: null, count: 7 },
  { label: 'Architectural', key: 'Architectural', count: 2 },
  { label: 'Structural', key: 'Structural', count: 1 },
  { label: 'Permits & NOCs', key: 'Permit', count: 3 },
  { label: 'Contracts', key: 'Contract', count: 1 },
]

const initialDocs: Doc[] = [
  { id: 'DOC-0091', name: 'Architectural Floor Plan – Tower A', site: 'SITE-014', category: 'Architectural', rev: 2, status: 'Approved', expiry: null, size: '4.2 MB' },
  { id: 'DOC-0092', name: 'Structural Foundation Detail Sheet', site: 'SITE-014', category: 'Structural', rev: 0, status: 'Under Review', expiry: null, size: '1.8 MB' },
  { id: 'DOC-0044', name: 'RERA Registration Certificate', site: 'SITE-015', category: 'Permit', rev: 0, status: 'Approved', expiry: '2025-12-31', size: '0.5 MB' },
  { id: 'DOC-0038', name: 'Labour Licence – SITE-012', site: 'SITE-012', category: 'Permit', rev: 1, status: 'Approved', expiry: '2023-08-15', size: '0.3 MB' },
  { id: 'DOC-0021', name: 'Cement Supply Framework Contract', site: 'Global', category: 'Contract', rev: 3, status: 'Approved', expiry: '2024-05-30', size: '2.1 MB' },
  { id: 'DOC-0085', name: 'Fire NOC – Skyline Towers', site: 'SITE-014', category: 'Permit', rev: 0, status: 'Draft', expiry: null, size: '0.8 MB' },
]

function StatusBadge({ status }: { status: string }) {
  if (status === 'Approved')
    return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-semibold gap-1" variant="outline"><CheckCircle2 className="size-2.5" />Approved</Badge>
  if (status === 'Under Review')
    return <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] font-semibold" variant="outline">Under Review</Badge>
  if (status === 'Draft')
    return <Badge variant="secondary" className="text-[10px] font-semibold">Draft</Badge>
  if (status === 'Rejected')
    return <Badge variant="destructive" className="text-[10px] font-semibold">Rejected</Badge>
  if (status === 'Submitted')
    return <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] font-semibold" variant="outline">Submitted</Badge>
  return <Badge>{status}</Badge>
}

const emptyDoc = (): Omit<Doc, 'id'> => ({
  name: '', site: SITES[0], category: DOC_CATS[0], rev: 0, status: 'Draft', expiry: null, size: '—',
})

function DocumentsModule() {
  const [docs, setDocs] = useState<Doc[]>(initialDocs)
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState<string | null>(null)
  const [showUpload, setShowUpload] = useState(false)
  const [editDoc, setEditDoc] = useState<Doc | null>(null)
  const [deleteDoc, setDeleteDoc] = useState<Doc | null>(null)
  const [form, setForm] = useState(emptyDoc())

  const now = new Date()
  const expiredDocs = docs.filter((d) => d.expiry && new Date(d.expiry) < now)

  const filtered = docs.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.site.toLowerCase().includes(search.toLowerCase()) || d.id.toLowerCase().includes(search.toLowerCase())
    const matchCat = catFilter === null || d.category === catFilter
    return matchSearch && matchCat
  })

  function nextId() {
    return `DOC-${String(Math.floor(Math.random() * 9000) + 1000)}`
  }

  function handleUpload() {
    if (!form.name) return
    setDocs((prev) => [{ ...form, id: nextId() }, ...prev])
    setShowUpload(false); setForm(emptyDoc())
  }
  function handleEdit() {
    if (!editDoc) return
    setDocs((prev) => prev.map((d) => d.id === editDoc.id ? editDoc : d))
    setEditDoc(null)
  }
  function handleDelete() {
    if (!deleteDoc) return
    setDocs((prev) => prev.filter((d) => d.id !== deleteDoc.id))
    setDeleteDoc(null)
  }

  function DocForm({ value, onChange }: { value: typeof form; onChange: (v: typeof form) => void }) {
    const s = (k: keyof typeof value, v: string | number | null) => onChange({ ...value, [k]: v })
    return (
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5"><Label className="text-xs">Document Name *</Label>
          <Input className="h-8 text-sm" value={value.name} onChange={(e) => s('name', e.target.value)} placeholder="e.g. Structural Plan Rev 2" /></div>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1.5"><Label className="text-xs">Site</Label>
            <Select value={value.site} onValueChange={(v) => s('site', v)}>
              <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>{SITES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5"><Label className="text-xs">Category</Label>
            <Select value={value.category} onValueChange={(v) => s('category', v)}>
              <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>{DOC_CATS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1.5"><Label className="text-xs">Status</Label>
            <Select value={value.status} onValueChange={(v) => s('status', v)}>
              <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>{DOC_STATUSES.map((st) => <SelectItem key={st} value={st}>{st}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5"><Label className="text-xs">Revision #</Label>
            <Input className="h-8 text-sm" type="number" min={0} value={value.rev} onChange={(e) => s('rev', Number(e.target.value))} />
          </div>
        </div>
        <div className="flex flex-col gap-1.5"><Label className="text-xs">Expiry Date (for permits/licenses)</Label>
          <Input className="h-8 text-sm" type="date" value={value.expiry ?? ''} onChange={(e) => s('expiry', e.target.value || null)} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5 max-w-[1400px]">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Documents & Drawings</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Version-controlled document repository for all sites.</p>
        </div>
        <Button size="sm" className="gap-1.5 h-8 text-xs" onClick={() => { setForm(emptyDoc()); setShowUpload(true) }}>
          <Upload className="size-3.5" />Upload Document
        </Button>
      </div>

      {expiredDocs.length > 0 && (
        <Alert variant="destructive" className="py-3">
          <AlertCircle className="size-4" />
          <AlertTitle className="text-sm font-semibold">Expired Permits / Licences</AlertTitle>
          <AlertDescription className="text-xs mt-1">{expiredDocs.map((d) => `${d.name} (expired: ${d.expiry})`).join(' · ')}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 lg:grid-cols-5">
        {/* Category sidebar */}
        <Card className="shadow-none border-border col-span-1">
          <CardHeader className="px-4 py-4">
            <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Categories</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="p-2">
            {categories.map((c) => {
              const isActive = catFilter === c.key
              const count = c.key === null ? docs.length : docs.filter((d) => d.category === c.key).length
              return (
                <button key={c.label} type="button"
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs text-left transition-colors ${isActive ? 'bg-primary/8 text-primary font-semibold' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                  onClick={() => setCatFilter(c.key)}
                >
                  <span>{c.label}</span>
                  <span className={`text-[10px] font-bold ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>{count}</span>
                </button>
              )
            })}
          </CardContent>
        </Card>

        {/* Doc table */}
        <Card className="shadow-none border-border col-span-4">
          <CardHeader className="flex flex-row items-center justify-between px-5 py-4">
            <CardTitle className="text-sm font-semibold">
              {catFilter ?? 'All Documents'} <span className="text-muted-foreground font-normal">({filtered.length})</span>
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input placeholder="Search..." className="w-60 pl-8 h-8 text-xs" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  <th className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Document</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Site</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Category / Rev</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Expiry</th>
                  <th className="text-right px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && <tr><td colSpan={6} className="py-8 text-center text-sm text-muted-foreground">No documents found.</td></tr>}
                {filtered.map((doc) => {
                  const isExpired = doc.expiry && new Date(doc.expiry) < now
                  const expiringSoon = doc.expiry && !isExpired && new Date(doc.expiry) < new Date(Date.now() + 30 * 86400000)
                  return (
                    <tr key={doc.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
                            <FileText className="size-3.5 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="font-medium text-foreground text-sm">{doc.name}</div>
                            <div className="text-[10px] text-muted-foreground mt-0.5">{doc.id} · {doc.size}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-xs text-foreground">{doc.site}</td>
                      <td className="px-4 py-4">
                        <div className="text-xs text-foreground">{doc.category}</div>
                        <div className="text-[10px] text-muted-foreground font-medium mt-0.5">Rev {doc.rev}</div>
                      </td>
                      <td className="px-4 py-4"><StatusBadge status={doc.status} /></td>
                      <td className="px-4 py-4">
                        {doc.expiry ? (
                          <span className={`text-xs font-medium ${isExpired ? 'text-destructive' : expiringSoon ? 'text-amber-600' : 'text-muted-foreground'}`}>
                            {isExpired ? '⚠ EXPIRED · ' : expiringSoon ? '↑ Soon · ' : ''}{doc.expiry}
                          </span>
                        ) : <span className="text-xs text-muted-foreground">—</span>}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-0.5">
                          <Button variant="ghost" size="icon" className="size-7" title="Version history"><History className="size-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="size-7" title="Download"><Download className="size-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="size-7" title="Edit" onClick={() => setEditDoc({ ...doc })}><Pencil className="size-3.5 text-muted-foreground" /></Button>
                          <Button variant="ghost" size="icon" className="size-7" title="Delete" onClick={() => setDeleteDoc(doc)}><Trash2 className="size-3.5 text-destructive" /></Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* Upload Dialog */}
      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Upload Document</DialogTitle></DialogHeader>
          <DocForm value={form} onChange={setForm} />
          <DialogFooter>
            <DialogClose asChild><Button variant="outline" size="sm">Cancel</Button></DialogClose>
            <Button size="sm" onClick={handleUpload} disabled={!form.name}>Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editDoc} onOpenChange={(o) => !o && setEditDoc(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Edit — {editDoc?.id}</DialogTitle></DialogHeader>
          {editDoc && <DocForm value={editDoc} onChange={(v) => setEditDoc({ ...editDoc, ...v })} />}
          <DialogFooter>
            <DialogClose asChild><Button variant="outline" size="sm">Cancel</Button></DialogClose>
            <Button size="sm" onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteDoc} onOpenChange={(o) => !o && setDeleteDoc(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteDoc?.id}?</AlertDialogTitle>
            <AlertDialogDescription>Permanently remove <strong>{deleteDoc?.name}</strong>? This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive hover:bg-destructive/90 text-destructive-foreground" onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
