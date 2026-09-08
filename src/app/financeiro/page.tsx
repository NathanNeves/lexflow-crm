"use client"

import { useState, useMemo } from "react"
import { Plus, Search, MoreHorizontal, ArrowUpRight, ArrowDownLeft, FileText, AlertCircle } from "lucide-react"
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
import { Separator } from "@/components/ui/separator"

interface Lancamento {
  id: string
  tipo: "receita" | "despesa"
  descricao: string
  cliente: string
  processo: string
  categoria: string
  valor: number
  data: string
  status: "pendente" | "recebido" | "atrasado"
  formaPagamento: string
  observacao?: string
}

const MOCK_LANCAMENTOS: Lancamento[] = [
  { id: "1", tipo: "receita", descricao: "Honorários - Reclamação Trabalhista", cliente: "Carlos Alberto Silva", processo: "0001234-56.2026.8.26.0100", categoria: "Honorários", valor: 15000, data: "2026-05-10", status: "recebido", formaPagamento: "Pix" },
  { id: "2", tipo: "receita", descricao: "Consultoria Empresarial", cliente: "Tech Solutions Ltda", processo: "0005678-90.2025.8.26.0100", categoria: "Consultoria", valor: 8000, data: "2026-05-05", status: "recebido", formaPagamento: "Transferência" },
  { id: "3", tipo: "despesa", descricao: "Custas Processuais", cliente: "Construtora Nova Era S.A.", processo: "0007890-12.2026.8.26.0100", categoria: "Custas", valor: 3450, data: "2026-05-12", status: "pendente", formaPagamento: "Boleto" },
  { id: "4", tipo: "receita", descricao: "Honorários - Divórcio", cliente: "Mariana Costa Oliveira", processo: "0009012-34.2026.8.26.0100", categoria: "Honorários", valor: 12000, data: "2026-04-20", status: "recebido", formaPagamento: "Pix" },
  { id: "5", tipo: "despesa", descricao: "Assinatura Jurídica (Sistema)", cliente: "Escritório", processo: "-", categoria: "Ferramentas", valor: 497, data: "2026-05-01", status: "recebido", formaPagamento: "Cartão" },
  { id: "6", tipo: "receita", descricao: "Honorários Advocatícios", cliente: "Roberto Mendes Dias", processo: "0003456-78.2025.8.26.0100", categoria: "Honorários", valor: 30000, data: "2026-03-01", status: "atrasado", formaPagamento: "Boleto" },
  { id: "7", tipo: "despesa", descricao: "Deslocamento - Audiência", cliente: "Ana Paula dos Santos", processo: "0001112-13.2025.8.26.0100", categoria: "Deslocamento", valor: 250, data: "2026-05-15", status: "pendente", formaPagamento: "Dinheiro" },
  { id: "8", tipo: "despesa", descricao: "Certidões Online", cliente: "Escritório", processo: "-", categoria: "Ferramentas", valor: 180, data: "2026-05-08", status: "recebido", formaPagamento: "Cartão" },
]

type TipoFilter = "todos" | "receita" | "despesa"
type StatusFilter = "todos" | "pendente" | "recebido" | "atrasado"

export default function FinanceiroPage() {
  const [lancamentos, setLancamentos] = useState<Lancamento[]>(MOCK_LANCAMENTOS)
  const [search, setSearch] = useState("")
  const [tipoFilter, setTipoFilter] = useState<TipoFilter>("todos")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("todos")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<Lancamento>>({
    tipo: "receita", descricao: "", cliente: "", processo: "", categoria: "", valor: 0, data: "", status: "pendente", formaPagamento: "Pix",
  })

  const filtered = useMemo(() => {
    let list = lancamentos
    if (tipoFilter !== "todos") list = list.filter((l) => l.tipo === tipoFilter)
    if (statusFilter !== "todos") list = list.filter((l) => l.status === statusFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((l) => l.descricao.toLowerCase().includes(q) || l.cliente.toLowerCase().includes(q))
    }
    return list
  }, [lancamentos, search, tipoFilter, statusFilter])

  const receitas = lancamentos.filter((l) => l.tipo === "receita" && l.status === "recebido").reduce((a, l) => a + l.valor, 0)
  const despesas = lancamentos.filter((l) => l.tipo === "despesa" && (l.status === "recebido" || l.status === "pendente")).reduce((a, l) => a + l.valor, 0)
  const pendentes = lancamentos.filter((l) => l.status === "pendente" || l.status === "atrasado").reduce((a, l) => a + l.valor, 0)
  const saldo = receitas - despesas

  function openNew() { setEditingId(null); setForm({ tipo: "receita", descricao: "", cliente: "", processo: "", categoria: "", valor: 0, data: new Date().toISOString().slice(0, 10), status: "pendente", formaPagamento: "Pix" }); setDialogOpen(true) }
  function openEdit(l: Lancamento) { setEditingId(l.id); setForm({ ...l }); setDialogOpen(true) }

  function handleSave() {
    if (!form.descricao?.trim()) return
    if (editingId) {
      setLancamentos((prev) => prev.map((l) => (l.id === editingId ? { ...l, ...form, id: editingId } as Lancamento : l)))
    } else {
      setLancamentos((prev) => [{ ...form, id: String(Date.now()) } as Lancamento, ...prev])
    }
    setDialogOpen(false)
  }

  function handleDelete(id: string) { setLancamentos((prev) => prev.filter((l) => l.id !== id)) }

  const format = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-law-navy dark:text-white font-serif">Financeiro</h1>
          <p className="text-law-slate dark:text-white/60 text-sm mt-1">Controle financeiro do escritório</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} className="bg-law-navy hover:bg-law-navy/90 text-white gap-2">
              <Plus className="w-4 h-4" />Novo Lançamento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="font-serif">{editingId ? "Editar Lançamento" : "Novo Lançamento"}</DialogTitle>
              <DialogDescription>Registre receitas e despesas do escritório.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Tipo</Label>
                  <Select value={form.tipo} onValueChange={(v: "receita" | "despesa") => setForm((p) => ({ ...p, tipo: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="receita">Receita</SelectItem>
                      <SelectItem value="despesa">Despesa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Categoria</Label>
                  <Select value={form.categoria} onValueChange={(v) => setForm((p) => ({ ...p, categoria: v }))}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      {["Honorários", "Consultoria", "Custas", "Deslocamento", "Ferramentas", "Impostos", "Outros"].map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2"><Label>Descrição</Label><Input value={form.descricao || ""} onChange={(e) => setForm((p) => ({ ...p, descricao: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Valor (R$)</Label><Input type="number" value={form.valor || ""} onChange={(e) => setForm((p) => ({ ...p, valor: Number(e.target.value) }))} /></div>
                <div className="space-y-2"><Label>Data</Label><Input type="date" value={form.data || ""} onChange={(e) => setForm((p) => ({ ...p, data: e.target.value }))} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Cliente</Label><Input value={form.cliente || ""} onChange={(e) => setForm((p) => ({ ...p, cliente: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Forma de Pagamento</Label>
                  <Select value={form.formaPagamento} onValueChange={(v) => setForm((p) => ({ ...p, formaPagamento: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Pix", "Transferência", "Boleto", "Cartão", "Dinheiro", "Cheque"].map((f) => (
                        <SelectItem key={f} value={f}>{f}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2"><Label>Status</Label>
                <Select value={form.status} onValueChange={(v: "pendente" | "recebido" | "atrasado") => setForm((p) => ({ ...p, status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="recebido">Recebido</SelectItem>
                    <SelectItem value="atrasado">Atrasado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSave} className="bg-law-navy hover:bg-law-navy/90 text-white">{editingId ? "Salvar" : "Criar"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-law-slate">Receitas Realizadas</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold font-serif text-green-600">{format(receitas)}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-law-slate">Despesas</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold font-serif text-red-500">{format(despesas)}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-law-slate">Saldo</CardTitle></CardHeader><CardContent><p className={`text-2xl font-bold font-serif ${saldo >= 0 ? "text-green-600" : "text-red-500"}`}>{format(saldo)}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-law-slate">A Receber</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold font-serif text-amber-600">{format(pendentes)}</p></CardContent></Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-law-slate" />
          <Input placeholder="Buscar lançamentos..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
      </div>
      <div className="flex gap-4">
        <Tabs value={tipoFilter} onValueChange={(v) => setTipoFilter(v as TipoFilter)}>
          <TabsList><TabsTrigger value="todos">Todas</TabsTrigger><TabsTrigger value="receita">Receitas</TabsTrigger><TabsTrigger value="despesa">Despesas</TabsTrigger></TabsList>
        </Tabs>
        <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
          <TabsList><TabsTrigger value="todos">Todos</TabsTrigger><TabsTrigger value="pendente">Pendentes</TabsTrigger><TabsTrigger value="recebido">Recebidos</TabsTrigger><TabsTrigger value="atrasado">Atrasados</TabsTrigger></TabsList>
        </Tabs>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead className="hidden md:table-cell">Cliente</TableHead>
                <TableHead className="hidden lg:table-cell">Categoria</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead className="hidden md:table-cell">Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-12 text-law-slate">Nenhum lançamento encontrado.</TableCell></TableRow>
              ) : (
                filtered.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {l.tipo === "receita" ? <ArrowUpRight className="w-4 h-4 text-green-500 shrink-0" /> : <ArrowDownLeft className="w-4 h-4 text-red-500 shrink-0" />}
                        <div>
                          <p className="font-medium text-law-navy dark:text-white">{l.descricao}</p>
                          <p className="text-xs text-law-slate">{l.formaPagamento}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{l.cliente}</TableCell>
                    <TableCell className="hidden lg:table-cell"><Badge variant="outline" className="text-xs">{l.categoria}</Badge></TableCell>
                    <TableCell className={l.tipo === "receita" ? "text-green-600 font-medium" : "text-red-500 font-medium"}>
                      {l.tipo === "receita" ? "+" : "-"}{format(l.valor)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{new Date(l.data).toLocaleDateString("pt-BR")}</TableCell>
                    <TableCell>
                      <Badge className={
                        l.status === "recebido" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                        l.status === "pendente" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                        "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }>
                        {l.status === "recebido" ? "Recebido" : l.status === "pendente" ? "Pendente" : "Atrasado"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(l)}><FileText className="w-4 h-4 mr-2" />Editar</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDelete(l.id)} className="text-red-500"><AlertCircle className="w-4 h-4 mr-2" />Excluir</DropdownMenuItem>
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
