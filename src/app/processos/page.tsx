"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Plus, Search, MoreHorizontal, FileText, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Processo, StatusProcesso, Cliente } from "@/lib/types"

interface ProcessoComNome extends Processo {
  clienteNome?: string
}

interface Resumo {
  total: number
  ativos: number
  suspensos: number
  arquivados: number
  emRecurso: number
  valorTotal: number
}

const AREAS = ["Trabalhista", "Cível", "Empresarial", "Família", "Tributário", "Contratos", "Consumidor", "Imobiliário", "Sucessões", "Penal", "Administrativo", "Ambiental"]

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  ativo: { label: "Ativo", cls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  suspenso: { label: "Suspenso", cls: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  arquivado: { label: "Arquivado", cls: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400" },
  recurso: { label: "Em Recurso", cls: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
}

type StatusFilter = "todos" | "ativo" | "suspenso" | "arquivado" | "recurso"

const EMPTY_FORM: Partial<Processo> & { clienteId: string } = {
  clienteId: "",
  numero: "",
  tipo: "",
  area: "",
  tribunal: "",
  vara: "",
  dataDistribuicao: "",
  status: "ativo",
  valorCausa: 0,
  parteContraria: "",
  advogadoResponsavel: "",
}

export default function ProcessosPage() {
  const [processos, setProcessos] = useState<ProcessoComNome[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [resumo, setResumo] = useState<Resumo>({ total: 0, ativos: 0, suspensos: 0, arquivados: 0, emRecurso: 0, valorTotal: 0 })
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("todos")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<Processo> & { clienteId: string }>(EMPTY_FORM)
  const [error, setError] = useState("")

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== "todos") params.set("status", statusFilter)
      if (search.trim()) params.set("busca", search.trim())

      const [procRes, cliRes] = await Promise.all([
        fetch(`/api/processos?${params.toString()}`),
        fetch("/api/clientes?ordem=nome-az"),
      ])

      if (procRes.ok) {
        const data = await procRes.json()
        setProcessos(data.processos)
        setResumo(data.resumo)
      }

      if (cliRes.ok) {
        const data = await cliRes.json()
        setClientes(data.clientes)
      }
    } catch (err) {
      console.error("Erro ao carregar processos:", err)
    } finally {
      setLoading(false)
    }
  }, [search, statusFilter])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // debounce search
  useEffect(() => {
    const timer = setTimeout(() => { fetchData() }, 300)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const filtered = useMemo(() => {
    return processos
  }, [processos])

  function openNew() {
    setEditingId(null)
    setError("")
    setForm({ ...EMPTY_FORM, dataDistribuicao: new Date().toISOString().slice(0, 10) })
    setDialogOpen(true)
  }

  function openEdit(p: ProcessoComNome) {
    setEditingId(p.id)
    setError("")
    setForm({
      clienteId: p.clienteId,
      numero: p.numero,
      tipo: p.tipo,
      area: p.area,
      tribunal: p.tribunal,
      vara: p.vara,
      dataDistribuicao: p.dataDistribuicao || "",
      status: p.status,
      valorCausa: p.valorCausa,
      parteContraria: p.parteContraria,
      advogadoResponsavel: p.advogadoResponsavel,
    })
    setDialogOpen(true)
  }

  async function handleSave() {
    if (!form.clienteId || !form.numero?.trim()) {
      setError("Cliente e número do processo são obrigatórios.")
      return
    }
    setSaving(true)
    setError("")

    const payload = {
      clienteId: form.clienteId,
      numero: form.numero,
      tipo: form.tipo,
      area: form.area,
      tribunal: form.tribunal,
      vara: form.vara,
      dataDistribuicao: form.dataDistribuicao || null,
      status: form.status,
      valorCausa: Number(form.valorCausa) || 0,
      parteContraria: form.parteContraria,
      advogadoResponsavel: form.advogadoResponsavel,
    }

    try {
      const url = editingId ? `/api/processos/${editingId}` : "/api/processos"
      const method = editingId ? "PUT" : "POST"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.json()
        setError(err.error || "Erro ao salvar processo.")
        setSaving(false)
        return
      }

      setDialogOpen(false)
      fetchData()
    } catch {
      setError("Erro de rede ao salvar.")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/processos/${id}`, { method: "DELETE" })
      if (res.ok) fetchData()
    } catch {
      console.error("Erro ao excluir processo")
    }
  }

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v)

  const getClienteNome = (p: ProcessoComNome) => p.clienteNome || clientes.find((c) => c.id === p.clienteId)?.nome || p.clienteId

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
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cliente *</Label>
                  <Select
                    value={form.clienteId}
                    onValueChange={(v) => setForm((p) => ({ ...p, clienteId: v }))}
                  >
                    <SelectTrigger><SelectValue placeholder="Selecione o cliente" /></SelectTrigger>
                    <SelectContent>
                      {clientes.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Número do Processo *</Label>
                  <Input value={form.numero || ""} onChange={(e) => setForm((p) => ({ ...p, numero: e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Input value={form.tipo || ""} onChange={(e) => setForm((p) => ({ ...p, tipo: e.target.value }))} placeholder="Ex: Reclamação Trabalhista" />
                </div>
                <div className="space-y-2">
                  <Label>Área</Label>
                  <Select value={form.area} onValueChange={(v) => setForm((p) => ({ ...p, area: v }))}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      {AREAS.map((a) => (<SelectItem key={a} value={a}>{a}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Tribunal</Label><Input value={form.tribunal || ""} onChange={(e) => setForm((p) => ({ ...p, tribunal: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Vara</Label><Input value={form.vara || ""} onChange={(e) => setForm((p) => ({ ...p, vara: e.target.value }))} /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2"><Label>Distribuição</Label><Input type="date" value={form.dataDistribuicao || ""} onChange={(e) => setForm((p) => ({ ...p, dataDistribuicao: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Valor da Causa (R$)</Label><Input type="number" value={form.valorCausa || ""} onChange={(e) => setForm((p) => ({ ...p, valorCausa: Number(e.target.value) }))} /></div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={form.status || "ativo"} onValueChange={(v) => setForm((p) => ({ ...p, status: v as StatusProcesso }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="suspenso">Suspenso</SelectItem>
                      <SelectItem value="arquivado">Arquivado</SelectItem>
                      <SelectItem value="recurso">Em Recurso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Parte Contrária</Label><Input value={form.parteContraria || ""} onChange={(e) => setForm((p) => ({ ...p, parteContraria: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Advogado Responsável</Label><Input value={form.advogadoResponsavel || ""} onChange={(e) => setForm((p) => ({ ...p, advogadoResponsavel: e.target.value }))} /></div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSave} disabled={saving} className="bg-law-navy hover:bg-law-navy/90 text-white">
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {editingId ? "Salvar" : "Criar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-law-slate">Total</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold font-serif">{resumo.total}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-law-slate">Ativos</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold font-serif text-green-600">{resumo.ativos}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-law-slate">Suspensos</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold font-serif text-yellow-600">{resumo.suspensos}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-law-slate">Em Recurso</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold font-serif text-purple-600">{resumo.emRecurso}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-law-slate">Valor Total</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold font-serif text-law-gold">{formatCurrency(resumo.valorTotal)}</p></CardContent></Card>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-law-slate" />
          <Input placeholder="Buscar por nº, tipo, cliente ou parte..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
      </div>

      {/* Status Tabs */}
      <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
        <TabsList>
          <TabsTrigger value="todos">Todos ({resumo.total})</TabsTrigger>
          <TabsTrigger value="ativo">Ativos ({resumo.ativos})</TabsTrigger>
          <TabsTrigger value="suspenso">Suspensos ({resumo.suspensos})</TabsTrigger>
          <TabsTrigger value="arquivado">Arquivados ({resumo.arquivados})</TabsTrigger>
          <TabsTrigger value="recurso">Em Recurso ({resumo.emRecurso})</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead className="hidden md:table-cell">Nº Processo</TableHead>
                <TableHead className="hidden md:table-cell">Cliente</TableHead>
                <TableHead className="hidden lg:table-cell">Área</TableHead>
                <TableHead className="hidden lg:table-cell">Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={7} className="text-center py-12 text-law-slate"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-12 text-law-slate">Nenhum processo encontrado.</TableCell></TableRow>
              ) : (
                filtered.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell><p className="font-medium text-law-navy dark:text-white">{p.tipo || "—"}</p><p className="text-xs text-law-slate hidden sm:block">{p.parteContraria && `× ${p.parteContraria}`}</p></TableCell>
                    <TableCell className="hidden md:table-cell font-mono text-xs">{p.numero}</TableCell>
                    <TableCell className="hidden md:table-cell">{getClienteNome(p)}</TableCell>
                    <TableCell className="hidden lg:table-cell"><Badge variant="outline" className="text-xs">{p.area || "—"}</Badge></TableCell>
                    <TableCell className="hidden lg:table-cell">{formatCurrency(p.valorCausa)}</TableCell>
                    <TableCell><Badge className={STATUS_BADGE[p.status]?.cls}>{STATUS_BADGE[p.status]?.label ?? p.status}</Badge></TableCell>
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
