<<<<<<< HEAD
"use client"

import { useState, useMemo } from "react"
import { Plus, Search, Pencil, Trash2, UserCheck, UserX, MoreHorizontal } from "lucide-react"
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
import type { Cliente } from "@/types"

const MOCK_CLIENTES: Cliente[] = [
  { id: "1", tipo: "PF", nome: "Carlos Alberto Silva", documento: "123.456.789-00", email: "carlos.silva@email.com", telefone: "(11) 99999-1234", endereco: "Rua Augusta, 1500 - São Paulo, SP", tags: ["Trabalhista", "Cível"], status: "ativo", dataCadastro: "2026-01-15" },
  { id: "2", tipo: "PJ", nome: "Tech Solutions Ltda", documento: "12.345.678/0001-90", email: "contato@techsolutions.com.br", telefone: "(11) 3333-4444", endereco: "Av. Faria Lima, 2500 - São Paulo, SP", tags: ["Empresarial", "Tributário"], status: "ativo", dataCadastro: "2025-11-20" },
  { id: "3", tipo: "PF", nome: "Mariana Costa Oliveira", documento: "987.654.321-00", email: "mariana.oliveira@email.com", telefone: "(21) 98888-5678", endereco: "Rua do Russel, 300 - Rio de Janeiro, RJ", tags: ["Família", "Sucessões"], status: "ativo", dataCadastro: "2026-03-02" },
  { id: "4", tipo: "PF", nome: "Roberto Mendes Dias", documento: "456.789.123-00", email: "roberto.dias@email.com", telefone: "(31) 97777-8901", endereco: "Rua Pernambuco, 500 - Belo Horizonte, MG", tags: ["Consumidor"], status: "inativo", dataCadastro: "2025-07-10" },
  { id: "5", tipo: "PJ", nome: "Construtora Nova Era S.A.", documento: "98.765.432/0001-10", email: "adm@novaera.com.br", telefone: "(41) 3222-1111", endereco: "Av. Batel, 800 - Curitiba, PR", tags: ["Contratos", "Imobiliário"], status: "ativo", dataCadastro: "2026-02-18" },
  { id: "6", tipo: "PF", nome: "Ana Paula dos Santos", documento: "321.654.987-00", email: "ana.santos@email.com", telefone: "(11) 96666-3456", endereco: "Rua Oscar Freire, 900 - São Paulo, SP", tags: ["Trabalhista"], status: "ativo", dataCadastro: "2026-05-22" },
  { id: "7", tipo: "PJ", nome: "Comércio Brasil Alimentos ME", documento: "11.222.333/0001-44", email: "adm@comerciobrasil.com", telefone: "(71) 3444-5566", endereco: "Av. Tancredo Neves, 100 - Salvador, BA", tags: ["Contratos"], status: "ativo", dataCadastro: "2025-09-05" },
  { id: "8", tipo: "PF", nome: "Dr. Paulo Ricardo Souza", documento: "654.321.789-00", email: "paulo.souza@email.com", telefone: "(61) 95555-7890", endereco: "SHS Quadra 6, 200 - Brasília, DF", tags: ["Cível", "Família"], status: "inativo", dataCadastro: "2024-12-01" },
]

type StatusFilter = "todos" | "ativo" | "inativo"

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>(MOCK_CLIENTES)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("todos")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<Cliente, "id" | "dataCadastro"> & { id?: string }>({
    tipo: "PF",
    nome: "",
    documento: "",
    email: "",
    telefone: "",
    endereco: "",
    tags: [],
    status: "ativo",
  })
  const [tagInput, setTagInput] = useState("")
  const [detailClient, setDetailClient] = useState<Cliente | null>(null)

  const filtered = useMemo(() => {
    let list = clientes
    if (statusFilter !== "todos") {
      list = list.filter((c) => c.status === statusFilter)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (c) =>
          c.nome.toLowerCase().includes(q) ||
          c.documento.includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q))
      )
    }
    return list
  }, [clientes, search, statusFilter])

  function openNew() {
    setEditingId(null)
    setForm({ tipo: "PF", nome: "", documento: "", email: "", telefone: "", endereco: "", tags: [], status: "ativo" })
    setTagInput("")
    setDialogOpen(true)
  }

  function openEdit(cliente: Cliente) {
    setEditingId(cliente.id)
    setForm({ ...cliente })
    setTagInput("")
    setDialogOpen(true)
  }

  function handleSave() {
    if (!form.nome.trim()) return
    if (editingId) {
      setClientes((prev) => prev.map((c) => (c.id === editingId ? { ...c, ...form, id: editingId } : c)))
    } else {
      const novo: Cliente = {
        ...form,
        id: String(Date.now()),
        dataCadastro: new Date().toISOString().slice(0, 10),
      }
      setClientes((prev) => [novo, ...prev])
    }
    setDialogOpen(false)
    setDetailClient(null)
  }

  function handleDelete(id: string) {
    setClientes((prev) => prev.filter((c) => c.id !== id))
    setDetailClient(null)
  }

  function toggleStatus(id: string) {
    setClientes((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: c.status === "ativo" ? "inativo" : "ativo" } : c))
    )
  }

  function addTag(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault()
      setForm((prev) => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }))
      setTagInput("")
    }
  }

  function removeTag(tag: string) {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }))
  }

  function formatStatus(status: "ativo" | "inativo") {
    return status === "ativo" ? "Ativo" : "Inativo"
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-law-navy dark:text-white font-serif">Clientes</h1>
          <p className="text-law-slate dark:text-white/60 text-sm mt-1">Gerencie os clientes do escritório</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} className="bg-law-navy hover:bg-law-navy/90 text-white gap-2">
              <Plus className="w-4 h-4" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="font-serif">{editingId ? "Editar Cliente" : "Novo Cliente"}</DialogTitle>
              <DialogDescription>
                {editingId ? "Altere os dados do cliente." : "Preencha os dados para cadastrar um novo cliente."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select value={form.tipo} onValueChange={(v: "PF" | "PJ") => setForm((p) => ({ ...p, tipo: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PF">Pessoa Física</SelectItem>
                      <SelectItem value="PJ">Pessoa Jurídica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{form.tipo === "PF" ? "Nome Completo" : "Razão Social"}</Label>
                  <Input value={form.nome} onChange={(e) => setForm((p) => ({ ...p, nome: e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{form.tipo === "PF" ? "CPF" : "CNPJ"}</Label>
                  <Input value={form.documento} onChange={(e) => setForm((p) => ({ ...p, documento: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={(v: "ativo" | "inativo") => setForm((p) => ({ ...p, status: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>E-mail</Label>
                  <Input type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input value={form.telefone} onChange={(e) => setForm((p) => ({ ...p, telefone: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Endereço</Label>
                <Input value={form.endereco} onChange={(e) => setForm((p) => ({ ...p, endereco: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Tags (pressione Enter para adicionar)</Label>
                <Input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={addTag} placeholder="Ex: Trabalhista, Cível..." />
                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {form.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                        {tag} &times;
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSave} className="bg-law-navy hover:bg-law-navy/90 text-white">
                {editingId ? "Salvar Alterações" : "Cadastrar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-law-slate">Total de Clientes</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold font-serif text-law-navy dark:text-white">{clientes.length}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-law-slate">Ativos</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold font-serif text-green-600">{clientes.filter((c) => c.status === "ativo").length}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-law-slate">Inativos</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold font-serif text-red-500">{clientes.filter((c) => c.status === "inativo").length}</p></CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-law-slate" />
          <Input
            placeholder="Buscar por nome, CPF/CNPJ, e-mail ou tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabs filter */}
      <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
        <TabsList>
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="ativo">Ativos</TabsTrigger>
          <TabsTrigger value="inativo">Inativos</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead className="hidden md:table-cell">Documento</TableHead>
                <TableHead className="hidden lg:table-cell">Contato</TableHead>
                <TableHead className="hidden lg:table-cell">Tags</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-law-slate">
                    Nenhum cliente encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((cliente) => (
                  <TableRow key={cliente.id}>
                    <TableCell>
                      <div>
                        <button onClick={() => setDetailClient(cliente)} className="font-medium text-law-navy dark:text-white hover:underline text-left">
                          {cliente.nome}
                        </button>
                        <p className="text-xs text-law-slate">{cliente.tipo}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell font-mono text-xs">{cliente.documento}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <p className="text-sm">{cliente.email}</p>
                      <p className="text-xs text-law-slate">{cliente.telefone}</p>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {cliente.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs border-law-navy/20 dark:border-white/20">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cliente.status === "ativo" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"}>
                        {formatStatus(cliente.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setDetailClient(cliente)}>
                            <Pencil className="w-4 h-4 mr-2" /> Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEdit(cliente)}>
                            <Pencil className="w-4 h-4 mr-2" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleStatus(cliente.id)}>
                            {cliente.status === "ativo" ? <UserX className="w-4 h-4 mr-2" /> : <UserCheck className="w-4 h-4 mr-2" />}
                            {cliente.status === "ativo" ? "Desativar" : "Reativar"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDelete(cliente.id)} className="text-red-500">
                            <Trash2 className="w-4 h-4 mr-2" /> Excluir
                          </DropdownMenuItem>
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

      {/* Detail Sidebar */}
      {detailClient && (
        <div className="fixed inset-0 z-40 flex">
          <div className="flex-1 bg-black/30" onClick={() => setDetailClient(null)} />
          <div className="w-full max-w-md bg-white dark:bg-law-navy shadow-xl overflow-y-auto">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold font-serif">Detalhes do Cliente</h2>
                <Button variant="ghost" size="icon" onClick={() => setDetailClient(null)}>&times;</Button>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-law-slate uppercase tracking-wider">Nome</p>
                  <p className="font-medium">{detailClient.nome}</p>
                </div>
                <div>
                  <p className="text-xs text-law-slate uppercase tracking-wider">Tipo</p>
                  <p>{detailClient.tipo === "PF" ? "Pessoa Física" : "Pessoa Jurídica"}</p>
                </div>
                <div>
                  <p className="text-xs text-law-slate uppercase tracking-wider">{detailClient.tipo === "PF" ? "CPF" : "CNPJ"}</p>
                  <p className="font-mono">{detailClient.documento}</p>
                </div>
                <div>
                  <p className="text-xs text-law-slate uppercase tracking-wider">E-mail</p>
                  <p>{detailClient.email}</p>
                </div>
                <div>
                  <p className="text-xs text-law-slate uppercase tracking-wider">Telefone</p>
                  <p>{detailClient.telefone}</p>
                </div>
                <div>
                  <p className="text-xs text-law-slate uppercase tracking-wider">Endereço</p>
                  <p>{detailClient.endereco}</p>
                </div>
                <div>
                  <p className="text-xs text-law-slate uppercase tracking-wider">Tags</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {detailClient.tags.map((tag) => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-law-slate uppercase tracking-wider">Status</p>
                  <Badge className={detailClient.status === "ativo" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}>
                    {formatStatus(detailClient.status)}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-law-slate uppercase tracking-wider">Cadastro</p>
                  <p>{new Date(detailClient.dataCadastro).toLocaleDateString("pt-BR")}</p>
                </div>
              </div>
              <div className="flex gap-2 pt-3">
                <Button variant="outline" className="flex-1" onClick={() => { openEdit(detailClient); setDetailClient(null) }}>Editar</Button>
                <Button variant="destructive" className="flex-1" onClick={() => handleDelete(detailClient.id)}>Excluir</Button>
              </div>
            </div>
          </div>
=======
'use client'

import { useState, useMemo } from 'react'

import { mockClientes } from '@/data/mock-clientes'
import type { ResumoClientes } from '@/lib/types'

import { ClienteCard } from './components/cliente-card'
import { ClienteFiltros, type FiltrosCliente } from './components/cliente-filters'
import { ClienteResumo } from './components/cliente-resumo'

const filtrosPadrao: FiltrosCliente = {
  busca: '',
  status: 'todos',
  segmento: 'todos',
  origem: 'todos',
  ordem: 'recentes',
}

export default function ClientesPage() {
  const [filtros, setFiltros] = useState<FiltrosCliente>(filtrosPadrao)

  const clientesFiltrados = useMemo(() => {
    let lista = [...mockClientes]

    if (filtros.busca.trim()) {
      const termo = filtros.busca.toLowerCase()
      lista = lista.filter(
        (c) =>
          c.nome.toLowerCase().includes(termo) ||
          c.cpfCnpj.includes(termo) ||
          c.contato.email.toLowerCase().includes(termo) ||
          c.contato.celular.includes(termo)
      )
    }

    if (filtros.status !== 'todos') {
      lista = lista.filter((c) => c.status === filtros.status)
    }

    if (filtros.segmento !== 'todos') {
      lista = lista.filter((c) => c.segmento === filtros.segmento)
    }

    if (filtros.origem !== 'todos') {
      lista = lista.filter((c) => c.origem === filtros.origem)
    }

    switch (filtros.ordem) {
      case 'recentes':
        lista.sort((a, b) => new Date(b.dataCadastro).getTime() - new Date(a.dataCadastro).getTime())
        break
      case 'antigos':
        lista.sort((a, b) => new Date(a.dataCadastro).getTime() - new Date(b.dataCadastro).getTime())
        break
      case 'nome':
        lista.sort((a, b) => a.nome.localeCompare(b.nome))
        break
      case 'nome-desc':
        lista.sort((a, b) => b.nome.localeCompare(a.nome))
        break
      case 'processos':
        lista.sort((a, b) => b.totalProcessos - a.totalProcessos)
        break
      case 'valor':
        lista.sort((a, b) => b.valorTotalCausas - a.valorTotalCausas)
        break
    }

    return lista
  }, [filtros])

  const resumo: ResumoClientes = useMemo(() => ({
    total: mockClientes.length,
    ativos: mockClientes.filter((c) => c.status === 'ativo').length,
    inativos: mockClientes.filter((c) => c.status === 'inativo').length,
    prospects: mockClientes.filter((c) => c.status === 'prospect').length,
    premium: mockClientes.filter((c) => c.segmento === 'premium').length,
  }), [])

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
        <p className="text-muted-foreground">
          Gerencie sua base de clientes, visualize perfis e acompanhe processos.
        </p>
      </div>

      <ClienteResumo resumo={resumo} />

      <ClienteFiltros
        filtros={filtros}
        onChange={setFiltros}
        resultadoBusca={clientesFiltrados.length}
        total={mockClientes.length}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {clientesFiltrados.map((cliente) => (
          <ClienteCard key={cliente.id} cliente={cliente} />
        ))}
      </div>

      {clientesFiltrados.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">Nenhum cliente encontrado com esses filtros.</p>
>>>>>>> 96bf26f969a404a90f8be50cc776e49ca9b3ca89
        </div>
      )}
    </div>
  )
}
