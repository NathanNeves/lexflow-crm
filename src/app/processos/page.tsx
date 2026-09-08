"use client"

import { useState, useMemo } from "react"
import { Plus, Search, MoreHorizontal, Scale, FileText, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Processo {
  id: string
  numero: string
  titulo: string
  cliente: string
  area: string
  tribunal: string
  valor: number
  status: "ativo" | "suspenso" | "encerrado"
  dataAbertura: string
  prazo?: string
}

const MOCK_PROCESSOS: Processo[] = [
  { id: "1", numero: "0001234-56.2026.8.26.0100", titulo: "Reclamação Trabalhista", cliente: "Carlos Alberto Silva", area: "Trabalhista", tribunal: "TRT-2", valor: 45000, status: "ativo", dataAbertura: "2026-03-15", prazo: "2026-09-20" },
  { id: "2", numero: "0005678-90.2025.8.26.0100", titulo: "Ação de Cobrança", cliente: "Tech Solutions Ltda", area: "Empresarial", tribunal: "TJ-SP", valor: 120000, status: "ativo", dataAbertura: "2025-11-02", prazo: "2026-07-10" },
  { id: "3", numero: "0009012-34.2026.8.26.0100", titulo: "Divórcio Consensual", cliente: "Mariana Costa Oliveira", area: "Família", tribunal: "TJ-RJ", valor: 15000, status: "ativo", dataAbertura: "2026-02-20", prazo: "2026-08-15" },
  { id: "4", numero: "0003456-78.2025.8.26.0100", titulo: "Ação Indenizatória", cliente: "Roberto Mendes Dias", area: "Consumidor", tribunal: "TJ-MG", valor: 30000, status: "encerrado", dataAbertura: "2025-05-10", prazo: "2026-01-30" },
  { id: "5", numero: "0007890-12.2026.8.26.0100", titulo: "Contrato de Prestação", cliente: "Construtora Nova Era S.A.", area: "Contratos", tribunal: "TJ-PR", valor: 250000, status: "ativo", dataAbertura: "2026-04-05", prazo: "2026-10-01" },
  { id: "6", numero: "0001112-13.2025.8.26.0100", titulo: "Revisional de Alimentos", cliente: "Ana Paula dos Santos", area: "Família", tribunal: "TJ-SP", valor: 8000, status: "suspenso", dataAbertura: "2025-08-22", prazo: "2026-06-15" },
]

type StatusFilter = "todos" | "ativo" | "suspenso" | "encerrado"

export default function ProcessosPage() {
  const [processos, setProcessos] = useState<Processo[]>(MOCK_PROCESSOS)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("todos")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<Processo>>({
    numero: "", titulo: "", cliente: "", area: "", tribunal: "", valor: 0, status: "ativo", dataAbertura: "", prazo: "",
  })

  const filtered = useMemo(() => {
    let list = processos
    if (statusFilter !== "todos") list = list.filter((p) => p.status === statusFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((p) => p.titulo.toLowerCase().includes(q) || p.numero.includes(q) || p.cliente.toLowerCase().includes(q))
    }
    return list
  }, [processos, search, statusFilter])

  const ativos = processos.filter((p) => p.status === "ativo")
  const valorTotal = processos.reduce((acc, p) => acc + p.valor, 0)

  function openNew() {
    setEditingId(null)
    setForm({ numero: "", titulo: "", cliente: "", area: "", tribunal: "", valor: 0, status: "ativo", dataAbertura: new Date().toISOString().slice(0, 10), prazo: "" })
    setDialogOpen(true)
  }

  function openEdit(p: Processo) {
    setEditingId(p.id)
    setForm({ ...p })
    setDialogOpen(true)
  }

  function handleSave() {
    if (!form.titulo?.trim() || !form.numero?.trim()) return
    if (editingId) {
      setProcessos((prev) => prev.map((p) => (p.id === editingId ? { ...p, ...form, id: editingId } as Processo : p)))
    } else {
      setProcessos((prev) => [{ ...form, id: String(Date.now()) } as Processo, ...prev])
    }
    setDialogOpen(false)
  }

  function handleDelete(id: string) {
    setProcessos((prev) => prev.filter((p) => p.id !== id))
  }

  const statusBadge: Record<string, { label: string; cls: string }> = {
    ativo: { label: "Ativo", cls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
    suspenso: { label: "Suspenso", cls: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
    encerrado: { label: "Encerrado", cls: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400" },
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-law-navy dark:text-white font-serif">Processos</h1>
          <p className="text-law-slate dark:text-white/60 text-sm mt-1">Gerencie os processos judiciais do escritório</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} className="bg-law-navy hover:bg-law-navy/90 text-white gap-2">
              <Plus className="w-4 h-4" />Novo Processo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle className="font-serif">{editingId ? "Editar Processo" : "Novo Processo"}</DialogTitle>
              <DialogDescription>Preencha os dados do processo judicial.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Número do Processo</Label><Input value={form.numero || ""} onChange={(e) => setForm((p) => ({ ...p, numero: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Título</Label><Input value={form.titulo || ""} onChange={(e) => setForm((p) => ({ ...p, titulo: e.target.value }))} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Cliente</Label><Input value={form.cliente || ""} onChange={(e) => setForm((p) => ({ ...p, cliente: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Área</Label>
                  <Select value={form.area} onValueChange={(v) => setForm((p) => ({ ...p, area: v }))}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      {["Trabalhista", "Cível", "Empresarial", "Família", "Tributário", "Contratos", "Consumidor", "Imobiliário", "Sucessões"].map((a) => (
                        <SelectItem key={a} value={a}>{a}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Tribunal</Label><Input value={form.tribunal || ""} onChange={(e) => setForm((p) => ({ ...p, tribunal: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Valor da Causa (R$)</Label><Input type="number" value={form.valor || ""} onChange={(e) => setForm((p) => ({ ...p, valor: Number(e.target.value) }))} /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2"><Label>Abertura</Label><Input type="date" value={form.dataAbertura || ""} onChange={(e) => setForm((p) => ({ ...p, dataAbertura: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Prazo</Label><Input type="date" value={form.prazo || ""} onChange={(e) => setForm((p) => ({ ...p, prazo: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Status</Label>
                  <Select value={form.status} onValueChange={(v: "ativo" | "suspenso" | "encerrado") => setForm((p) => ({ ...p, status: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="suspenso">Suspenso</SelectItem>
                      <SelectItem value="encerrado">Encerrado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSave} className="bg-law-navy hover:bg-law-navy/90 text-white">{editingId ? "Salvar" : "Criar"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-law-slate">Total</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold font-serif">{processos.length}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-law-slate">Ativos</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold font-serif text-green-600">{ativos.length}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-law-slate">Suspensos</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold font-serif text-yellow-600">{processos.filter((p) => p.status === "suspenso").length}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-law-slate">Valor Total</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold font-serif text-law-gold">R$ {valorTotal.toLocaleString("pt-BR")}</p></CardContent></Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-law-slate" />
        <Input placeholder="Buscar por título, número ou cliente..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      {/* Tabs */}
      <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
        <TabsList>
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="ativo">Ativos</TabsTrigger>
          <TabsTrigger value="suspenso">Suspensos</TabsTrigger>
          <TabsTrigger value="encerrado">Encerrados</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead className="hidden md:table-cell">Nº Processo</TableHead>
                <TableHead className="hidden md:table-cell">Cliente</TableHead>
                <TableHead className="hidden lg:table-cell">Área</TableHead>
                <TableHead className="hidden lg:table-cell">Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-12 text-law-slate">Nenhum processo encontrado.</TableCell></TableRow>
              ) : (
                filtered.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell><p className="font-medium text-law-navy dark:text-white">{p.titulo}</p></TableCell>
                    <TableCell className="hidden md:table-cell font-mono text-xs">{p.numero}</TableCell>
                    <TableCell className="hidden md:table-cell">{p.cliente}</TableCell>
                    <TableCell className="hidden lg:table-cell"><Badge variant="outline" className="text-xs">{p.area}</Badge></TableCell>
                    <TableCell className="hidden lg:table-cell">R$ {p.valor.toLocaleString("pt-BR")}</TableCell>
                    <TableCell><Badge className={statusBadge[p.status]?.cls}>{statusBadge[p.status]?.label}</Badge></TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(p)}><FileText className="w-4 h-4 mr-2" />Editar</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDelete(p.id)} className="text-red-500"><AlertCircle className="w-4 h-4 mr-2" />Excluir</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
